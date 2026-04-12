import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BENCHMARK_CASES, type BenchmarkCase } from '../benchmark/cases'
import { createHardNegativeCases, type HardNegativeCase } from '../benchmark/hard-negatives'
import {
  computeCalibratedOverallScore,
  createTransformersQualityScorer,
  resolveQualityScorerConfig,
} from '@browser-quality-scorer/core'

type HardNegativeResult = HardNegativeCase & {
  appScores: number[]
  appOverall: number
  diff: number
  absDiff: number
}

const scorerConfig = resolveQualityScorerConfig({
  modelId: 'Xenova/nli-deberta-v3-xsmall',
  dtype: 'q8',
  modelSource: {
    mode: 'local',
    localModelPath: fileURLToPath(new URL('../../library/models/', import.meta.url)),
    revision: 'main',
    useBrowserCache: false,
  },
})

const scorer = createTransformersQualityScorer(scorerConfig)
const REPORTS_DIR = fileURLToPath(new URL('../reports/', import.meta.url))

await scorer.loadModel()

const hardNegativeCases = createHardNegativeCases(BENCHMARK_CASES)

const results: HardNegativeResult[] = []

for (const testCase of hardNegativeCases) {
  const scoreResult = await scorer.score({
    question: testCase.question,
      response: testCase.answer,
      criteria: testCase.criteria.map((criterion) => criterion.label),
    })

  const overall = computeCalibratedOverallScore(
    {
      rawOverall: weightedPercent(testCase.criteria, scoreResult.scores) / 100,
      question: testCase.question,
      response: testCase.answer,
      answerSupport: scoreResult.answerSupport,
      criterionScores: scoreResult.scores,
      structuralScore: scoreResult.structuralScore,
    },
    scorerConfig,
  )
  const appOverall = round(overall.overallCalibrated * 100)
  const diff = appOverall - testCase.referenceOverall

  results.push({
    ...testCase,
    appScores: scoreResult.scores,
    appOverall,
    diff,
    absDiff: Math.abs(diff),
  })
}

const absDiffs = results.map((result) => result.absDiff).sort((left, right) => left - right)
const meanAbsoluteError = round(absDiffs.reduce((sum, value) => sum + value, 0) / absDiffs.length)
const medianAbsoluteError = round(absDiffs[Math.floor(absDiffs.length / 2)] ?? 0)
const within10 = results.filter((result) => result.absDiff <= 10).length
const within20 = results.filter((result) => result.absDiff <= 20).length
const byKind = summarizeByKind(results)
const topMisses = [...results].sort((left, right) => right.absDiff - left.absDiff).slice(0, 15)

await mkdir(REPORTS_DIR, { recursive: true })
await Bun.write(
  fileURLToPath(new URL('../reports/hard-negative-report.md', import.meta.url)),
  [
    '# Hard Negative Benchmark Report',
    '',
    `Cases: ${results.length}`,
    '',
    `Mean absolute error: ${meanAbsoluteError}`,
    `Median absolute error: ${medianAbsoluteError}`,
    `Within 10 points: ${within10}/${results.length}`,
    `Within 20 points: ${within20}/${results.length}`,
    '',
    '## By Kind',
    '',
    ...byKind.map(
      (group) =>
        `- ${group.kind}: count ${group.count}, MAE ${group.meanAbsoluteError}, reference avg ${group.referenceAverage}, app avg ${group.appAverage}`,
    ),
    '',
    '## Top Misses',
    '',
    ...topMisses.map(
      (result) =>
        `- ${result.id}: ref ${round(result.referenceOverall)}, app ${round(result.appOverall)}, diff ${round(result.diff)}\n  Q: ${truncate(result.question, 100)}\n  A: ${truncate(result.answer, 140)}`,
    ),
    '',
  ].join('\n'),
)

console.log(
  JSON.stringify(
    {
      caseCount: results.length,
      meanAbsoluteError,
      medianAbsoluteError,
      within10,
      within20,
      byKind,
      topMisses: topMisses.slice(0, 5).map((result) => ({
        id: result.id,
        diff: round(result.diff),
        referenceOverall: round(result.referenceOverall),
        appOverall: round(result.appOverall),
      })),
    },
    null,
    2,
  ),
)

function summarizeByKind(results: HardNegativeResult[]) {
  return ['advice', 'comparison', 'planning'].map((kind) => {
    const items = results.filter((result) => result.kind === kind)

    return {
      kind,
      count: items.length,
      meanAbsoluteError: round(items.reduce((sum, item) => sum + item.absDiff, 0) / items.length),
      referenceAverage: round(items.reduce((sum, item) => sum + item.referenceOverall, 0) / items.length),
      appAverage: round(items.reduce((sum, item) => sum + item.appOverall, 0) / items.length),
    }
  })
}

function weightedPercent(criteria: BenchmarkCase['criteria'], scores: number[]) {
  return round(
    criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / 100,
  )
}

function truncate(text: string, limit: number) {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`
}

function round(value: number) {
  return Math.round(value * 10) / 10
}
