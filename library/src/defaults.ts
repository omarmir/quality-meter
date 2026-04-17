import { applyCalibrationCurve } from './calibration-core'
import { resolveQualityCriteria } from './criteria'
import { DEFAULT_CRITERION_CALIBRATION, DEFAULT_OVERALL_CALIBRATION } from './generated-calibration'
import {
  ESTIMATED_CHARS_PER_TOKEN,
  HYPOTHESIS_TEMPLATE,
  MIN_SAFE_PREMISE_TOKENS,
  MODEL_TOKEN_LIMIT,
  TOKEN_BUFFER,
  buildEvaluationText,
  clampScore,
  computeTopicAlignmentGate,
  computeTaskStructureGate,
  computeWeakAnswerGate,
  createCriterionHypothesisEnsemble,
} from './scoring'
import { normalizeCriteriaForScoring } from './low-latency'
import type {
  QualityAdaptiveRefinementConfig,
  QualityContextBudget,
  QualityScorePresentationConfig,
  QualityScoreInput,
  QualityScorerConfig,
  QualityScorerConfigInput,
} from './types'

export const DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG: QualityScorePresentationConfig = {
  mixedFitMinPercent: 45,
  strongFitMinPercent: 70,
  toneByBand: {
    off_track: 'error',
    mixed_fit: 'warning',
    strong_fit: 'success',
  },
}

export const DEFAULT_ADAPTIVE_REFINEMENT_CONFIG: QualityAdaptiveRefinementConfig = {
  lowStopOverallPercent: 10,
  lowStopAnswerSupport: 0.25,
  lowStopMaxCriterionPercent: 15,
  lowStopSecondaryOverallBuffer: 5,
  lowStopLowCriterionShare: 0.66,
  highStopOverallPercent: 100,
  highStopMinCriterionPercent: 100,
  highStopSpreadPercent: 0,
  highStopWeakAnswerGate: 1,
  disableHighStopForConstraintQuestions: true,
  disableHighStopForTaskTypes: ['comparison', 'planning'],
}

export const DEFAULT_QUALITY_SCORER_CONFIG: QualityScorerConfig = {
  task: 'zero-shot-classification',
  modelId: 'Xenova/nli-deberta-v3-xsmall',
  dtype: 'q8',
  hypothesisTemplate: HYPOTHESIS_TEMPLATE,
  modelSource: {
    mode: 'local',
    localModelPath: '/models/',
    remoteHost: 'https://huggingface.co/',
    remotePathTemplate: '{model}/resolve/{revision}/',
    revision: 'main',
    useBrowserCache: 'auto',
  },
  limits: {
    modelTokenLimit: MODEL_TOKEN_LIMIT,
    estimatedCharsPerToken: ESTIMATED_CHARS_PER_TOKEN,
    tokenBuffer: TOKEN_BUFFER,
    minSafePremiseTokens: MIN_SAFE_PREMISE_TOKENS,
  },
  lowLatency: {
    useDeterministicConstraintChecks: false,
    useTaskStructureChecks: true,
    useCriterionNormalization: false,
  },
  criterionCalibration: DEFAULT_CRITERION_CALIBRATION,
  overallCalibration: DEFAULT_OVERALL_CALIBRATION,
}

export function resolveQualityScorerConfig(config: QualityScorerConfigInput = {}): QualityScorerConfig {
  return {
    ...DEFAULT_QUALITY_SCORER_CONFIG,
    ...config,
    modelSource: {
      ...DEFAULT_QUALITY_SCORER_CONFIG.modelSource,
      ...config.modelSource,
    },
    limits: {
      ...DEFAULT_QUALITY_SCORER_CONFIG.limits,
      ...config.limits,
    },
    lowLatency: {
      ...DEFAULT_QUALITY_SCORER_CONFIG.lowLatency,
      ...config.lowLatency,
    },
    criterionCalibration:
      config.criterionCalibration === undefined
        ? DEFAULT_QUALITY_SCORER_CONFIG.criterionCalibration
        : config.criterionCalibration,
    overallCalibration:
      config.overallCalibration === undefined
        ? DEFAULT_QUALITY_SCORER_CONFIG.overallCalibration
        : config.overallCalibration,
    hypothesisTemplate: config.hypothesisTemplate ?? DEFAULT_QUALITY_SCORER_CONFIG.hypothesisTemplate,
    dtype: config.dtype ?? DEFAULT_QUALITY_SCORER_CONFIG.dtype,
    modelId: config.modelId ?? DEFAULT_QUALITY_SCORER_CONFIG.modelId,
    task: 'zero-shot-classification',
  }
}

export function estimateQualityContextBudget(
  input: Pick<QualityScoreInput, 'question' | 'response' | 'criteria'>,
  config: QualityScorerConfigInput = {},
): QualityContextBudget {
  const resolvedConfig = resolveQualityScorerConfig(config)
  const evaluationText = buildEvaluationText(input.question ?? '', input.response)
  const estimatedPremiseTokens = estimateTokenCountWithConfig(evaluationText, resolvedConfig)
  const resolvedCriteria = resolveQualityCriteria(input.criteria)
  const scoringCriteria = resolvedConfig.lowLatency.useCriterionNormalization
    ? normalizeCriteriaForScoring(
        input.question ?? '',
        resolvedCriteria.map((criterion) => criterion.label),
      ).normalizedCriteria
    : resolvedCriteria.map((criterion) => criterion.label)
  const safePremiseTokenBudget = getSafePremiseTokenBudgetWithConfig(scoringCriteria, resolvedConfig)
  const safePremiseCharBudget = safePremiseTokenBudget * resolvedConfig.limits.estimatedCharsPerToken

  return {
    evaluationText,
    estimatedPremiseTokens,
    safePremiseTokenBudget,
    safePremiseCharBudget,
    isNearLimit:
      estimatedPremiseTokens < safePremiseTokenBudget &&
      estimatedPremiseTokens >= safePremiseTokenBudget * 0.9,
    isOverLimit: estimatedPremiseTokens > safePremiseTokenBudget,
  }
}

export function calibrateQualityOverall(score: number, config: QualityScorerConfigInput = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config)

  if (!resolvedConfig.overallCalibration) {
    return score
  }

  return applyCalibrationCurve(score, resolvedConfig.overallCalibration)
}

export function computeCalibratedOverallScore(
  input: {
    rawOverall: number
    question?: string
    response: string
    answerSupport: number
    criterionScores: number[]
    structuralScore?: number
    topicAlignment?: number
  },
  config: QualityScorerConfigInput = {},
) {
  const resolvedConfig = resolveQualityScorerConfig(config)
  const overallRaw = clampScore(input.rawOverall)
  const weakAnswerGate = computeWeakAnswerGate(
    input.question ?? '',
    input.response,
    input.answerSupport,
    input.criterionScores,
  )
  const taskStructureGate = resolvedConfig.lowLatency.useTaskStructureChecks
    ? computeTaskStructureGate(input.structuralScore ?? 1, input.answerSupport, input.criterionScores)
    : 1
  const topicAlignmentGate = computeTopicAlignmentGate(
    input.topicAlignment ?? 1,
    input.answerSupport,
    input.criterionScores,
  )
  const overallAdjustedRaw = clampScore(overallRaw * weakAnswerGate * taskStructureGate * topicAlignmentGate)
  const overallCalibrated = resolvedConfig.overallCalibration
    ? applyCalibrationCurve(overallAdjustedRaw, resolvedConfig.overallCalibration)
    : overallAdjustedRaw

  return {
    overallRaw,
    weakAnswerGate: clampScore(weakAnswerGate * taskStructureGate * topicAlignmentGate),
    overallAdjustedRaw,
    overallCalibrated,
    overallPercent: Math.round(overallCalibrated * 100),
  }
}

export function isRemoteModelSource(config: QualityScorerConfigInput = {}) {
  return resolveQualityScorerConfig(config).modelSource.mode !== 'local'
}

export function getQualityModelSourceLocation(config: QualityScorerConfigInput = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config)

  if (resolvedConfig.modelSource.mode === 'local') {
    return `${resolvedConfig.modelSource.localModelPath}${resolvedConfig.modelId}`
  }

  return [
    resolvedConfig.modelSource.remoteHost,
    resolvedConfig.modelSource.remotePathTemplate
      .replaceAll('{model}', resolvedConfig.modelId)
      .replaceAll('{revision}', encodeURIComponent(resolvedConfig.modelSource.revision)),
  ]
    .join('')
    .replace(/([^:]\/)\/+/g, '$1')
}

export function estimateTokenCountWithConfig(text: string, config: QualityScorerConfigInput = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config)
  return estimateTokenCountWithCharsPerToken(text, resolvedConfig.limits.estimatedCharsPerToken)
}

export function getSafePremiseTokenBudgetWithConfig(criteria: string[], config: QualityScorerConfigInput = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config)
  const longestHypothesisTokens = Math.max(
    ...criteria
      .filter(Boolean)
      .flatMap((criterion) =>
        createCriterionHypothesisEnsemble(criterion).flatMap(({ positive, negative }) => [
          estimateTokenCountWithCharsPerToken(positive, resolvedConfig.limits.estimatedCharsPerToken),
          estimateTokenCountWithCharsPerToken(negative, resolvedConfig.limits.estimatedCharsPerToken),
        ]),
      ),
    estimateTokenCountWithCharsPerToken('criterion', resolvedConfig.limits.estimatedCharsPerToken),
  )

  return Math.max(
    resolvedConfig.limits.minSafePremiseTokens,
    resolvedConfig.limits.modelTokenLimit - longestHypothesisTokens - resolvedConfig.limits.tokenBuffer,
  )
}

function estimateTokenCountWithCharsPerToken(text: string, charsPerToken: number) {
  const trimmed = text.trim()

  if (!trimmed) {
    return 0
  }

  return Math.ceil(trimmed.length / Math.max(1, charsPerToken))
}
