import { applyCalibrationCurve, type CalibrationCurve } from './calibration-core'
import { DEFAULT_CRITERION_CALIBRATION } from './generated-calibration'
import { assessDeterministicConstraints, assessTaskStructure, detectQualityTaskType, normalizeCriteriaForScoring } from './low-latency'
import type { QualityScoreMode } from './types'
import {
  HYPOTHESIS_TEMPLATE,
  aggregateChunkSupport,
  aggregatePromptScores,
  buildEvaluationText,
  clampScore,
  computeAnswerValidityGate,
  computeConstraintGate,
  computeTopicAlignment,
  computeTopicAlignmentGate,
  computeUncertaintyShrinkage,
  createAnswerValidityHypothesisEnsemble,
  createConstraintPresenceHypothesisEnsemble,
  createConstraintRespectHypothesisEnsemble,
  createCriterionHypothesisEnsemble,
  pairSupportScore,
  splitResponseIntoEvidenceChunks,
} from './scoring'

type ZeroShotClassificationOutput = {
  labels: string[]
  scores: number[]
}

export type ZeroShotClassifier = (
  text: string,
  candidateLabels: string[],
  options: { multi_label: true; hypothesis_template?: string },
) => Promise<ZeroShotClassificationOutput>

type BatchCapableZeroShotClassifier = ZeroShotClassifier & {
  tokenizer?: (
    text: string | string[],
    options: { text_pair: string | string[]; padding: true; truncation: true },
  ) => Record<string, unknown>
  model?: (inputs: Record<string, unknown>) => Promise<{ logits: { data: ArrayLike<number> } }>
  entailment_id?: number
  contradiction_id?: number
  useBatchedZeroShot?: boolean
}

export type CriterionScoreResult = {
  criteria: string[]
  normalizedCriteria: string[]
  scores: number[]
  rawScores: number[]
  gate: number
  answerSupport: number
  constraintPresence: number
  constraintRespect: number
  deterministicConstraintPresence: number
  deterministicConstraintRespect: number
  structuralScore: number
  taskType: ReturnType<typeof detectQualityTaskType>
}

export type ScoreCriteriaOptions = {
  criterionCalibration?: CalibrationCurve | null
  mode?: QualityScoreMode
  lowLatency?: {
    useDeterministicConstraintChecks: boolean
    useTaskStructureChecks: boolean
    useCriterionNormalization: boolean
  }
  cachedConstraintPresence?: number | null
}

export async function scoreCriteriaWithClassifier(
  classifier: ZeroShotClassifier,
  question: string,
  response: string,
  criteria: string[],
  options: ScoreCriteriaOptions = {},
): Promise<CriterionScoreResult> {
  const trimmedCriteria = criteria.map((criterion) => criterion.trim())
  const scoreMode = options.mode ?? 'full'
  const normalization = options.lowLatency?.useCriterionNormalization
    ? normalizeCriteriaForScoring(question, trimmedCriteria)
    : {
        taskType: detectQualityTaskType(question, trimmedCriteria),
        goalSummary: '',
        constraintSummary: '',
        prioritySummary: '',
        optionSummary: '',
        normalizedCriteria: trimmedCriteria,
      }
  const scoringCriteria = normalization.normalizedCriteria
  const fullInputText = buildEvaluationText(question, response)
  const chunkTexts =
    scoreMode === 'fast' ? [] : splitResponseIntoEvidenceChunks(response).map((chunk) => buildEvaluationText(question, chunk))

  const criterionHypothesisEnsembles = scoringCriteria.map((criterion) => {
    const ensemble = createCriterionHypothesisEnsemble(criterion)
    return scoreMode === 'fast' ? ensemble.slice(0, 1) : ensemble
  })
  const criterionLabels = dedupeLabels(
    criterionHypothesisEnsembles.flatMap((ensemble) => ensemble.flatMap(({ positive, negative }) => [positive, negative])),
  )
  const answerSupportEnsemble = limitEnsemble(createAnswerValidityHypothesisEnsemble(question), scoreMode)
  const answerSupportLabels = dedupeLabels(
    answerSupportEnsemble.flatMap(({ positive, negative }) => [positive, negative]),
  )
  const constraintRespectEnsemble = question.trim() && scoreMode !== 'fast'
    ? limitEnsemble(createConstraintRespectHypothesisEnsemble(), scoreMode)
    : []
  const constraintRespectLabels = dedupeLabels(
    constraintRespectEnsemble.flatMap(({ positive, negative }) => [positive, negative]),
  )
  const fullEvidenceLabels = dedupeLabels([...criterionLabels, ...answerSupportLabels, ...constraintRespectLabels])
  const chunkEvidenceLabels = dedupeLabels([...criterionLabels, ...answerSupportLabels])
  const fullEvidenceMap = await classifyLabelSetAcrossTexts(classifier, [fullInputText], fullEvidenceLabels)
  const chunkEvidenceMaps =
    chunkTexts.length === 0 ? [] : await classifyLabelSetAcrossTexts(classifier, chunkTexts, chunkEvidenceLabels)
  const criterionEvidenceMaps = [...fullEvidenceMap, ...chunkEvidenceMaps]

  const answerSupport = scoreHypothesisEnsembleFromEvidenceMaps(criterionEvidenceMaps, answerSupportEnsemble)

  let constraintPresence = 0
  let constraintRespect = 1
  let deterministicConstraintPresence = 0
  let deterministicConstraintRespect = 1
  let structuralScore = 1

  if (question.trim()) {
    if (scoreMode === 'fast') {
      constraintPresence = typeof options.cachedConstraintPresence === 'number' ? options.cachedConstraintPresence : 0
      constraintRespect = 1
    } else if (typeof options.cachedConstraintPresence === 'number') {
      constraintPresence = options.cachedConstraintPresence
    } else {
      constraintPresence = await scoreHypothesisEnsembleAcrossEvidence(
        classifier,
        [question.trim()],
        limitEnsemble(createConstraintPresenceHypothesisEnsemble(), scoreMode),
      )
    }

    if (constraintRespectEnsemble.length > 0) {
      constraintRespect = scoreHypothesisEnsembleFromEvidenceMaps(fullEvidenceMap, constraintRespectEnsemble)
    }
  }

  if (options.lowLatency?.useDeterministicConstraintChecks && question.trim()) {
    const deterministicConstraints = assessDeterministicConstraints(question, response)
    deterministicConstraintPresence = deterministicConstraints.presence
    deterministicConstraintRespect = deterministicConstraints.respect
    constraintPresence = Math.max(constraintPresence, deterministicConstraintPresence)

    if (deterministicConstraintRespect < 0.999) {
      constraintRespect = Math.min(constraintRespect, 0.1 + 0.8 * deterministicConstraintRespect)
    }
  }

  if (options.lowLatency?.useTaskStructureChecks) {
    structuralScore = assessTaskStructure(question, response, scoringCriteria).score
  }

  const answerGate = computeAnswerValidityGate(answerSupport, response)
  const constraintGate = computeConstraintGate(constraintPresence, constraintRespect)
  const gate = clampScore(answerGate * constraintGate)

  const rawScores = criterionHypothesisEnsembles.map((ensemble) => {
    const promptScores = ensemble.map((pair) => {
      const fullScore = readPairScore(criterionEvidenceMaps[0], pair)
      const chunkScores = criterionEvidenceMaps.slice(1).map((labelMap) => readPairScore(labelMap, pair))
      const chunkSupport = aggregateChunkSupport(chunkScores, fullScore)
      return clampScore(fullScore * 0.6 + chunkSupport * 0.4)
    })

    const fullPromptScores = ensemble.map((pair) => readPairScore(criterionEvidenceMaps[0], pair))
    const chunkPromptScores = criterionEvidenceMaps.slice(1).flatMap((labelMap) =>
      ensemble.map((pair) => readPairScore(labelMap, pair)),
    )
    const ensembleScore = aggregatePromptScores(promptScores)
    const shrinkage = computeUncertaintyShrinkage(promptScores, [...fullPromptScores, ...chunkPromptScores])

    return clampScore(ensembleScore * shrinkage * gate)
  })
  const topicAlignment = computeTopicAlignment(question, response, trimmedCriteria)
  const topicAlignmentGate = computeTopicAlignmentGate(topicAlignment, answerSupport, rawScores)
  const adjustedRawScores = rawScores.map((score, index) =>
    Math.min(score, estimateCriterionSpecificityCap(question, trimmedCriteria[index] ?? '', response)) * topicAlignmentGate,
  )

  const calibration =
    options.criterionCalibration === undefined ? DEFAULT_CRITERION_CALIBRATION : options.criterionCalibration
  const scores = calibration
    ? adjustedRawScores.map((score) => applyCalibrationCurve(score, calibration))
    : adjustedRawScores

  return {
    criteria: trimmedCriteria,
    normalizedCriteria: scoringCriteria,
    scores,
    rawScores: adjustedRawScores,
    gate,
    answerSupport,
    constraintPresence,
    constraintRespect,
    deterministicConstraintPresence,
    deterministicConstraintRespect,
    structuralScore,
    taskType: normalization.taskType,
  }
}

function estimateCriterionSpecificityCap(question: string, criterion: string, response: string) {
  const promptText = `${question} ${criterion}`.toLowerCase()
  const criterionText = criterion.toLowerCase()
  const isMethodCriterion =
    /\b(explains?|describes?|outlines?|shows?)\b/.test(criterionText) &&
    /\b(deliver(?:ed|y)?|implemented?|run|operate[sd]?|carried out|completed?|through|via|using|with)\b/.test(criterionText)

  if (
    /\b(targets?|outcomes?|deliverables?|outputs?|results?|metrics?|milestones?|measurable|specific|numbers?|amounts?|dates?|counts?|participants?|clients?|households?|learners?|placements?|completions?|sessions?|visits?|units?|sites?)\b/.test(
      criterionText,
    )
  ) {
    return estimateTargetSpecificity(criterion, response)
  }

  if (
    isMethodCriterion ||
    /\b(approach|activities|delivery method|delivery|implementation|method|steps?|process|deliver(?:ed|y)? (?:the )?(?:work|program|service|project|initiative|support|training|upgrades?)|how .*deliver)\b/.test(
      criterionText,
    )
  ) {
    return estimateMethodSpecificity(criterion, response)
  }

  if (
    /\b(purpose|what .*for|what is being funded|service|program|intervention|initiative|goal|focus|states?)\b/.test(
      criterionText,
    ) &&
    /\b(states?|describes?|summarizes?|identifies?|names?)\b/.test(criterionText)
  ) {
    return estimatePurposeSpecificity(criterion, response)
  }

  if (/\b(question directly|directly answers?)\b/.test(criterionText) && promptText.includes('what')) {
    return estimatePurposeSpecificity(criterion, response)
  }

  return 1
}

function estimatePurposeSpecificity(criterion: string, response: string) {
  const normalized = response.toLowerCase()
  const criterionOverlap = countCriterionContentOverlap(criterion, response)

  if (criterionOverlap >= 3) {
    return 1
  }

  if (criterionOverlap >= 2) {
    return 0.75
  }

  if (
    /\b(provides?|supports?|funds?|expands?|launches?|builds?|delivers?|offers?|operates?|restores?|upgrades?)\b/.test(
      normalized,
    )
  ) {
    return 0.4
  }

  return 0.25
}

function estimateTargetSpecificity(criterion: string, response: string) {
  const normalized = response.toLowerCase()
  const numericMatches = normalized.match(/\b\d[\d,]*(?:\.\d+)?\b/g) ?? []
  const criterionOverlap = countCriterionContentOverlap(criterion, response)

  if (numericMatches.length > 0) {
    return 1
  }

  const targetCues = countCueMatches(normalized, [
    'aims to',
    'targets',
    'job placements',
    'placements',
    'participants',
    'households',
    'visits',
    'sessions',
    'workshops',
    'training plans',
    'youth',
    'families',
    'clients',
    'by march',
    'by june',
    'by december',
    'over the next year',
  ])

  if (targetCues >= 3 || criterionOverlap >= 2) {
    return 0.5
  }

  if (targetCues >= 1 || criterionOverlap >= 1) {
    return 0.35
  }

  if (/\b(improve results|local needs|better outcomes|respond to need|more people|increase access|improve service)\b/.test(normalized)) {
    return 0.08
  }

  return 0.08
}

function estimateMethodSpecificity(criterion: string, response: string) {
  const normalized = response.toLowerCase()
  const criterionOverlap = countCriterionContentOverlap(criterion, response)
  const deliveryCues = countCueMatches(normalized, [
    'through',
    'by',
    'via',
    'work with',
    'partner with',
    'weekly',
    'monthly',
    'one-on-one',
    'case management',
    'workshops',
    'referrals',
    'outreach',
    'site visits',
    'training',
    'reviews',
    'installations',
    'classes',
    'meals',
    'routes',
    'schedule',
    'scheduled',
    'facilitators',
    'staff support',
    'inspection',
    'triage',
    'assessment',
    'assessments',
    'rotation',
  ])

  if (deliveryCues >= 4 || criterionOverlap >= 3) {
    return 1
  }

  if (deliveryCues >= 2 || criterionOverlap >= 2) {
    return 0.82
  }

  if (deliveryCues >= 1 || criterionOverlap >= 1) {
    return 0.32
  }

  return 0.08
}

function countCueMatches(text: string, cues: string[]) {
  return cues.filter((cue) => text.includes(cue)).length
}

function countCriterionContentOverlap(criterion: string, response: string) {
  const criterionTokens = extractCriterionContentTokens(criterion)
  const responseTokens = new Set((response.toLowerCase().match(/[a-z0-9']+/g) ?? []).map(normalizeHeuristicToken))

  return criterionTokens.filter((token) => responseTokens.has(token)).length
}

function extractCriterionContentTokens(text: string) {
  const stopWords = new Set([
    'agreement',
    'approach',
    'concrete',
    'deliver',
    'delivered',
    'delivery',
    'deliverables',
    'explains',
    'expected',
    'focus',
    'funded',
    'funding',
    'general',
    'goal',
    'identifies',
    'initiative',
    'method',
    'names',
    'number',
    'numbers',
    'outcomes',
    'planned',
    'process',
    'program',
    'purpose',
    'question',
    'service',
    'specificity',
    'specific',
    'states',
    'step',
    'steps',
    'targets',
    'that',
    'the',
    'what',
  ])

  return Array.from(
    new Set(
      (text.toLowerCase().match(/[a-z0-9']+/g) ?? [])
        .map(normalizeHeuristicToken)
        .filter((token) => token.length > 3 && !stopWords.has(token)),
    ),
  )
}

function normalizeHeuristicToken(token: string) {
  if (token.endsWith('ies') && token.length > 4) {
    return `${token.slice(0, -3)}y`
  }

  if (token.endsWith('ing') && token.length > 5) {
    return token.slice(0, -3)
  }

  if (token.endsWith('ed') && token.length > 4) {
    return token.slice(0, -2)
  }

  if (token.endsWith('s') && token.length > 4 && !token.endsWith('ss')) {
    return token.slice(0, -1)
  }

  return token
}

async function scoreHypothesisEnsembleAcrossEvidence(
  classifier: ZeroShotClassifier,
  evidenceTexts: string[],
  ensemble: { positive: string; negative: string }[],
) {
  const labels = dedupeLabels(ensemble.flatMap(({ positive, negative }) => [positive, negative]))
  const evidenceMaps = await classifyLabelSetAcrossTexts(classifier, evidenceTexts, labels)
  return scoreHypothesisEnsembleFromEvidenceMaps(evidenceMaps, ensemble)
}

function scoreHypothesisEnsembleFromEvidenceMaps(
  evidenceMaps: Array<Map<string, number>>,
  ensemble: { positive: string; negative: string }[],
) {
  const promptScores = ensemble.map((pair) => {
    const fullScore = readPairScore(evidenceMaps[0], pair)
    const chunkScores = evidenceMaps.slice(1).map((labelMap) => readPairScore(labelMap, pair))
    const chunkSupport = aggregateChunkSupport(chunkScores, fullScore)
    return clampScore(fullScore * 0.65 + chunkSupport * 0.35)
  })
  const evidenceScores = evidenceMaps.flatMap((labelMap) => ensemble.map((pair) => readPairScore(labelMap, pair)))
  const shrinkage = computeUncertaintyShrinkage(promptScores, evidenceScores)
  return clampScore(aggregatePromptScores(promptScores) * shrinkage)
}

async function classifyLabelSetAcrossTexts(
  classifier: ZeroShotClassifier,
  texts: string[],
  labels: string[],
) {
  const batchClassifier = classifier as BatchCapableZeroShotClassifier
  if (
    batchClassifier.useBatchedZeroShot &&
    typeof batchClassifier.tokenizer === 'function' &&
    typeof batchClassifier.model === 'function' &&
    typeof batchClassifier.entailment_id === 'number' &&
    typeof batchClassifier.contradiction_id === 'number' &&
    texts.length > 0 &&
    labels.length > 0
  ) {
    return classifyLabelSetAcrossTextsBatched(batchClassifier, texts, labels)
  }

  const labelMaps: Array<Map<string, number>> = []

  for (const text of texts) {
    const output = await classifier(text, labels, {
      multi_label: true,
      hypothesis_template: HYPOTHESIS_TEMPLATE,
    })
    labelMaps.push(outputToLabelMap(output))
  }

  return labelMaps
}

async function classifyLabelSetAcrossTextsBatched(
  classifier: Required<Pick<BatchCapableZeroShotClassifier, 'tokenizer' | 'model' | 'entailment_id' | 'contradiction_id'>>,
  texts: string[],
  labels: string[],
) {
  const hypotheses = labels.map((label) => HYPOTHESIS_TEMPLATE.replace('{}', label))
  const premises = texts.flatMap((text) => hypotheses.map(() => text))
  const pairedHypotheses = texts.flatMap(() => hypotheses)
  const inputs = classifier.tokenizer(premises, {
    text_pair: pairedHypotheses,
    padding: true,
    truncation: true,
  })
  const outputs = await classifier.model(inputs)
  const logits = Array.from(outputs.logits.data)
  const classCount = Math.max(1, Math.floor(logits.length / Math.max(1, premises.length)))
  const labelMaps: Array<Map<string, number>> = []

  for (let textIndex = 0; textIndex < texts.length; textIndex += 1) {
    const labelMap = new Map<string, number>()

    for (let labelIndex = 0; labelIndex < labels.length; labelIndex += 1) {
      const pairIndex = textIndex * labels.length + labelIndex
      const offset = pairIndex * classCount
      const contradiction = logits[offset + classifier.contradiction_id] ?? 0
      const entailment = logits[offset + classifier.entailment_id] ?? 0
      labelMap.set(labels[labelIndex] ?? '', softmax([contradiction, entailment])[1] ?? 0)
    }

    labelMaps.push(labelMap)
  }

  return labelMaps
}

function outputToLabelMap(output: ZeroShotClassificationOutput) {
  const labelMap = new Map<string, number>()
  output.labels.forEach((label, index) => {
    labelMap.set(label, output.scores[index] ?? 0)
  })
  return labelMap
}

function readPairScore(labelMap: Map<string, number>, pair: { positive: string; negative: string }) {
  return pairSupportScore(labelMap.get(pair.positive) ?? 0, labelMap.get(pair.negative) ?? 0)
}

function dedupeLabels(labels: string[]) {
  return Array.from(new Set(labels))
}

function limitEnsemble(
  ensemble: Array<{ positive: string; negative: string }>,
  scoreMode: QualityScoreMode,
) {
  return scoreMode === 'fast' ? ensemble.slice(0, 1) : ensemble
}

function softmax(values: number[]) {
  const maxValue = Math.max(...values)
  const exps = values.map((value) => Math.exp(value - maxValue))
  const sum = exps.reduce((total, value) => total + value, 0)
  return exps.map((value) => (sum === 0 ? 0 : value / sum))
}
