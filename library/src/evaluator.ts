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

  const calibration =
    options.criterionCalibration === undefined ? DEFAULT_CRITERION_CALIBRATION : options.criterionCalibration
  const scores = calibration ? rawScores.map((score) => applyCalibrationCurve(score, calibration)) : rawScores

  return {
    criteria: trimmedCriteria,
    normalizedCriteria: scoringCriteria,
    scores,
    rawScores,
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
