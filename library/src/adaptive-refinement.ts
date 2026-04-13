import { assessDeterministicConstraints, detectQualityTaskType, type QualityTaskType } from './low-latency'
import { resolveQualityCriteria } from './criteria'
import { DEFAULT_ADAPTIVE_REFINEMENT_CONFIG } from './defaults'
import type {
  QualityAdaptiveRefinementConfig,
  QualityCriterionInput,
  QualityRefinementDecision,
  QualityRefinementPolicy,
  QualityScoreResult,
} from './types'

type DecideQualityRefinementInput = {
  fastResult: QualityScoreResult
  question: string
  response: string
  criteria: QualityCriterionInput[]
  policy?: QualityRefinementPolicy
  config?: Partial<QualityAdaptiveRefinementConfig>
}

export function decideQualityRefinement(
  input: DecideQualityRefinementInput,
): QualityRefinementDecision {
  const policy = input.policy ?? 'adaptive'

  if (policy === 'never') {
    return {
      shouldRunFullPass: false,
      reason: 'quick_only',
      riskBand: 'low',
      fastOverallPercent: input.fastResult.overallPercent,
    }
  }

  if (policy === 'always') {
    return {
      shouldRunFullPass: true,
      reason: 'always_full',
      riskBand: 'medium',
      fastOverallPercent: input.fastResult.overallPercent,
    }
  }

  const config = {
    ...DEFAULT_ADAPTIVE_REFINEMENT_CONFIG,
    ...input.config,
  }

  const criterionPercents = input.fastResult.breakdown.map((criterion) => criterion.percent)
  const maxCriterionPercent = criterionPercents.length === 0 ? 0 : Math.max(...criterionPercents)
  const minCriterionPercent = criterionPercents.length === 0 ? 0 : Math.min(...criterionPercents)
  const spreadPercent = criterionPercents.length <= 1 ? 0 : maxCriterionPercent - minCriterionPercent
  const lowCriterionShare =
    criterionPercents.length === 0
      ? 0
      : criterionPercents.filter((percent) => percent <= config.lowStopMaxCriterionPercent).length / criterionPercents.length
  const taskType = resolveTaskType(input.fastResult.taskType, input.question, input.criteria)
  const hasConstraintRisk = hasQuestionConstraintRisk(input.question, input.response)

  if (
    (
      input.fastResult.overallPercent <= config.lowStopOverallPercent &&
      input.fastResult.answerSupport <= config.lowStopAnswerSupport &&
      maxCriterionPercent <= config.lowStopMaxCriterionPercent
    ) ||
    (
      input.fastResult.overallPercent <= config.lowStopOverallPercent + config.lowStopSecondaryOverallBuffer &&
      input.fastResult.answerSupport <= config.lowStopAnswerSupport &&
      lowCriterionShare >= config.lowStopLowCriterionShare
    )
  ) {
    return {
      shouldRunFullPass: false,
      reason: 'obvious_failure',
      riskBand: 'low',
      fastOverallPercent: input.fastResult.overallPercent,
    }
  }

  if (hasConstraintRisk) {
    return {
      shouldRunFullPass: true,
      reason: 'constraint_risk',
      riskBand: 'high',
      fastOverallPercent: input.fastResult.overallPercent,
    }
  }

  if (config.disableHighStopForTaskTypes.includes(taskType)) {
    return {
      shouldRunFullPass: true,
      reason: 'task_risk',
      riskBand: 'high',
      fastOverallPercent: input.fastResult.overallPercent,
    }
  }

  const allowHighStop =
    (!config.disableHighStopForConstraintQuestions || !hasQuestionConstraintMarkers(input.question)) &&
    !config.disableHighStopForTaskTypes.includes(taskType)

  if (
    allowHighStop &&
    input.fastResult.overallPercent >= config.highStopOverallPercent &&
    minCriterionPercent >= config.highStopMinCriterionPercent &&
    spreadPercent <= config.highStopSpreadPercent &&
    input.fastResult.weakAnswerGate >= config.highStopWeakAnswerGate
  ) {
    return {
      shouldRunFullPass: false,
      reason: 'stable_strong',
      riskBand: 'low',
      fastOverallPercent: input.fastResult.overallPercent,
    }
  }

  return {
    shouldRunFullPass: true,
    reason: 'mid_band',
    riskBand: 'medium',
    fastOverallPercent: input.fastResult.overallPercent,
  }
}

export function hasQuestionConstraintMarkers(question: string) {
  const normalized = question.toLowerCase()

  return (
    /\bwithout\b/.test(normalized) ||
    /\bonly\b/.test(normalized) ||
    /\bwithin\b/.test(normalized) ||
    /\bunder\b/.test(normalized) ||
    /\bbelow\b/.test(normalized) ||
    /\bless than\b/.test(normalized) ||
    /\bat most\b/.test(normalized) ||
    /\bno more than\b/.test(normalized) ||
    /\$\d/.test(normalized) ||
    /\b\d+\s*(?:minutes?|hours?|days?|weeks?|months?|sprints?)\b/.test(normalized)
  )
}

function hasQuestionConstraintRisk(question: string, response: string) {
  if (!hasQuestionConstraintMarkers(question)) {
    return false
  }

  return assessDeterministicConstraints(question, response).presence > 0
}

function resolveTaskType(taskType: QualityTaskType, question: string, criteria: QualityCriterionInput[]) {
  return taskType === 'unknown'
    ? detectQualityTaskType(
        question,
        resolveQualityCriteria(criteria).map((criterion) => criterion.label),
      )
    : taskType
}
