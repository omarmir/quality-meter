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

type HardNegativeSummary = {
  caseCount: number
  meanAbsoluteError: number
  medianAbsoluteError: number
  within10: number
  within20: number
  byKind: Array<{
    name: HardNegativeCase['kind']
    count: number
    meanAbsoluteError: number
    averageReference: number
    averageApp: number
  }>
  topMisses: HardNegativeResult[]
}

const scorerConfig = resolveQualityScorerConfig({
  modelId: 'Xenova/nli-deberta-v3-xsmall',
  dtype: 'q8',
  execution: {
    device: Bun.argv.includes('--use-webgpu') ? 'webgpu' : 'cpu',
    useBatchedZeroShot: Bun.argv.includes('--use-webgpu'),
  },
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
const reportProgress = createProgressReporter('hard-negative benchmark', hardNegativeCases.length)

const results: HardNegativeResult[] = []

for (const [index, testCase] of hardNegativeCases.entries()) {
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

  reportProgress(index + 1, testCase.id)
}

const absDiffs = results.map((result) => result.absDiff).sort((left, right) => left - right)
const summary: HardNegativeSummary = {
  caseCount: results.length,
  meanAbsoluteError: round(absDiffs.reduce((sum, value) => sum + value, 0) / absDiffs.length),
  medianAbsoluteError: round(absDiffs[Math.floor(absDiffs.length / 2)] ?? 0),
  within10: results.filter((result) => result.absDiff <= 10).length,
  within20: results.filter((result) => result.absDiff <= 20).length,
  byKind: summarizeByKind(results),
  topMisses: [...results].sort((left, right) => right.absDiff - left.absDiff).slice(0, 15),
}

await mkdir(REPORTS_DIR, { recursive: true })
await Bun.write(
  fileURLToPath(new URL('../reports/hard-negative-results.json', import.meta.url)),
  JSON.stringify(summary, null, 2),
)

console.log(
  JSON.stringify(
    {
      caseCount: summary.caseCount,
      meanAbsoluteError: summary.meanAbsoluteError,
      medianAbsoluteError: summary.medianAbsoluteError,
      within10: summary.within10,
      within20: summary.within20,
      byKind: summary.byKind,
      topMisses: summary.topMisses.slice(0, 5).map((result) => ({
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
  return (['workforce', 'health', 'housing', 'infrastructure', 'community'] as HardNegativeCase['kind'][]).map((kind) => {
    const items = results.filter((result) => result.kind === kind)

    return {
      name: kind,
      count: items.length,
      meanAbsoluteError: round(items.reduce((sum, item) => sum + item.absDiff, 0) / items.length),
      averageReference: round(items.reduce((sum, item) => sum + item.referenceOverall, 0) / items.length),
      averageApp: round(items.reduce((sum, item) => sum + item.appOverall, 0) / items.length),
    }
  })
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

function createProgressReporter(label: string, total: number) {
  let previousLength = 0

  return (current: number, detail?: string) => {
    const line = `[${label}] ${current}/${total}${detail ? ` ${detail}` : ''}`

    if (process.stdout.isTTY) {
      const padded = line.padEnd(previousLength, ' ')
      process.stdout.write(`\r${padded}`)
      previousLength = Math.max(previousLength, line.length)
      if (current === total) {
        process.stdout.write('\n')
      }
      return
    }

    console.log(line)
  }
}
