import type { BenchmarkCase, BenchmarkKind } from './cases'

export type HardNegativeCase = {
  id: string
  sourceId: string
  kind: BenchmarkKind
  question: string
  criteria: BenchmarkCase['criteria']
  answer: string
  referenceScores: number[]
  referenceOverall: number
}

export const HARD_NEGATIVE_REFERENCE_SCORES: Record<BenchmarkKind, number[]> = {
  workforce: [0.55, 0.08, 0.12],
  health: [0.55, 0.08, 0.12],
  housing: [0.55, 0.08, 0.12],
  infrastructure: [0.55, 0.08, 0.12],
  community: [0.55, 0.08, 0.12],
}

export function createHardNegativeCases(cases: BenchmarkCase[]) {
  return cases.map((testCase) => {
    const referenceScores = HARD_NEGATIVE_REFERENCE_SCORES[testCase.kind]

    return {
      id: `${testCase.id}-hard-negative`,
      sourceId: testCase.id,
      kind: testCase.kind,
      question: testCase.question,
      criteria: testCase.criteria,
      answer: buildHardNegativeAnswer(testCase.question, testCase.kind),
      referenceScores,
      referenceOverall: weightedPercent(testCase.criteria, referenceScores),
    } satisfies HardNegativeCase
  })
}

function buildHardNegativeAnswer(question: string, kind: BenchmarkKind) {
  const topicHint = buildTopicHint(question)

  return `This agreement funds ${topicHint} and is intended to improve results over the agreement term. The work will be delivered through program activities, partner coordination, and regular reporting.`
}

function buildTopicHint(question: string) {
  const stopWords = new Set([
    'a',
    'an',
    'and',
    'are',
    'between',
    'can',
    'choose',
    'do',
    'for',
    'how',
    'i',
    'if',
    'in',
    'is',
    'it',
    'my',
    'of',
    'on',
    'or',
    'should',
    'the',
    'to',
    'what',
    'which',
    'while',
    'with',
    'without',
    'would',
    'you',
  ])

  const tokens = question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && !stopWords.has(token))
    .slice(0, 5)

  return tokens.join(' ') || 'your situation'
}

function weightedPercent(criteria: BenchmarkCase['criteria'], scores: number[]) {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0)

  if (totalWeight <= 0) {
    return 0
  }

  return round(
    criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / totalWeight,
  )
}

function round(value: number) {
  return Math.round(value * 10) / 10
}
