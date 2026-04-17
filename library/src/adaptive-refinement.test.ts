import { describe, expect, test } from 'bun:test'
import { decideQualityRefinement } from './adaptive-refinement'
import type { QualityScoreResult } from './types'

function createFastResult(overallPercent: number): QualityScoreResult {
  return {
    criteria: ['Criterion 1', 'Criterion 2'],
    weightedCriteria: [
      { label: 'Criterion 1', weight: 1 },
      { label: 'Criterion 2', weight: 1 },
    ],
    normalizedCriteria: ['Criterion 1', 'Criterion 2'],
    scores: [0.08, 0.1],
    rawScores: [0.08, 0.1],
    gate: 1,
    answerSupport: 0.2,
    constraintPresence: 0,
    constraintRespect: 1,
    deterministicConstraintPresence: 0,
    deterministicConstraintRespect: 1,
    structuralScore: 1,
    topicAlignment: 1,
    taskType: 'unknown',
    overallRaw: overallPercent / 100,
    weakAnswerGate: 1,
    overallAdjustedRaw: overallPercent / 100,
    overallCalibrated: overallPercent / 100,
    overallPercent,
    band: 'off_track',
    tone: 'error',
    breakdown: [
      { label: 'Criterion 1', weight: 1, weightShare: 0.5, raw: 0.08, percent: 8 },
      { label: 'Criterion 2', weight: 1, weightShare: 0.5, raw: 0.1, percent: 10 },
    ],
  }
}

describe('decideQualityRefinement', () => {
  test('reads adaptive policy from request config', () => {
    const decision = decideQualityRefinement({
      fastResult: createFastResult(88),
      question: 'Summarize the answer.',
      response: 'A clear summary.',
      criteria: ['Criterion 1'],
      requestConfig: {
        adaptiveRefinementPolicy: 'never',
      },
    })

    expect(decision.shouldRunFullPass).toBe(false)
    expect(decision.reason).toBe('quick_only')
  })

  test('reads adaptive thresholds from request config', () => {
    const decision = decideQualityRefinement({
      fastResult: createFastResult(24),
      question: 'Summarize the answer.',
      response: 'A thin answer.',
      criteria: ['Criterion 1', 'Criterion 2'],
      requestConfig: {
        adaptiveRefinement: {
          lowStopOverallPercent: 25,
          lowStopAnswerSupport: 0.25,
          lowStopMaxCriterionPercent: 15,
        },
      },
    })

    expect(decision.shouldRunFullPass).toBe(false)
    expect(decision.reason).toBe('obvious_failure')
  })
})
