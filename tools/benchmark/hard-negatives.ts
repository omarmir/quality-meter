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
  advice: [0.55, 0.15, 0.15, 0.1],
  comparison: [0.6, 0.15, 0.15, 0.1],
  planning: [0.45, 0.2, 0.15, 0.05],
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

  switch (kind) {
    case 'comparison':
      return `Choose the option that seems stronger overall for ${topicHint}, because it should work better in general.`
    case 'planning':
      return `Start with the highest-priority part for ${topicHint}, then continue through the rest as time allows.`
    default:
      return `Start with the main thing for ${topicHint}, keep the process simple, and adjust later if needed.`
  }
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
  return round(
    criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / 100,
  )
}

function round(value: number) {
  return Math.round(value * 10) / 10
}
