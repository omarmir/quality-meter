import type { QualityCriterionInput, QualityWeightedCriterion } from './types'

const DEFAULT_CRITERION_WEIGHT = 1

export function resolveQualityCriteria(criteria: QualityCriterionInput[]): QualityWeightedCriterion[] {
  return criteria.map((criterion) => {
    if (typeof criterion === 'string') {
      return {
        label: criterion.trim(),
        weight: DEFAULT_CRITERION_WEIGHT,
      }
    }

    return {
      label: criterion.label.trim(),
      weight: resolveCriterionWeight(criterion.weight),
    }
  })
}

export function computeWeightedCriterionAverage(criteria: QualityWeightedCriterion[], scores: number[]) {
  if (criteria.length === 0) {
    return 0
  }

  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0)

  if (totalWeight <= 0) {
    return scores.reduce((sum, score) => sum + (score ?? 0), 0) / criteria.length
  }

  return criteria.reduce((sum, criterion, index) => sum + criterion.weight * (scores[index] ?? 0), 0) / totalWeight
}

function resolveCriterionWeight(weight?: number) {
  if (typeof weight !== 'number' || !Number.isFinite(weight) || weight <= 0) {
    return DEFAULT_CRITERION_WEIGHT
  }

  return weight
}
