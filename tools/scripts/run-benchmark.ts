import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BENCHMARK_CASES, type BenchmarkCase, type BenchmarkKind, type BenchmarkProfile } from '../benchmark/cases'
import { createHardNegativeCases } from '../benchmark/hard-negatives'
import {
  computeCalibratedOverallScore,
  applyCalibrationCurve,
  createTransformersQualityScorer,
  fitIsotonicCalibration,
  type CalibrationCurve,
} from '@browser-quality-scorer/core'

type BaseCaseResult = {
  id: string
  kind: BenchmarkKind
  profile: BenchmarkProfile
  question: string
  answer: string
  criteria: { label: string; weight: number }[]
  gate: number
  answerSupport: number
  constraintPresence: number
  constraintRespect: number
  structuralScore: number
  referenceScores: number[]
  rawScores: number[]
  referenceOverall: number
  rawOverall: number
}

type EvaluatedCaseResult = BaseCaseResult & {
  scoreMode: 'raw' | 'cross_validated' | 'runtime'
  appScores: number[]
  appOverall: number
  diff: number
  absDiff: number
}

type BenchmarkSummary = {
  meanAbsoluteError: number
  medianAbsoluteError: number
  within10: number
  within20: number
  byKind: GroupSummary[]
  byProfile: GroupSummary[]
  topMisses: EvaluatedCaseResult[]
}

type GroupSummary = {
  name: string
  count: number
  meanAbsoluteError: number
  averageReference: number
  averageApp: number
}

type CalibrationBundle = {
  criterion: CalibrationCurve | null
  overall: CalibrationCurve | null
}

type CalibrationCaseResult = {
  id: string
  question: string
  answer: string
  criteria: { label: string; weight: number }[]
  answerSupport: number
  structuralScore: number
  rawScores: number[]
  referenceOverall: number
}

const scorer = createTransformersQualityScorer({
  modelId: 'Xenova/nli-deberta-v3-xsmall',
  dtype: 'q8',
  modelSource: {
    mode: 'local',
    localModelPath: fileURLToPath(new URL('../../library/models/', import.meta.url)),
    revision: 'main',
    useBrowserCache: false,
  },
  criterionCalibration: null,
  overallCalibration: null,
})

const REPORTS_DIR = fileURLToPath(new URL('../reports/', import.meta.url))

await scorer.loadModel()

const baseResults: BaseCaseResult[] = []

for (const testCase of BENCHMARK_CASES) {
  const criteria = testCase.criteria.map((criterion) => criterion.label)
  const scoreResult = await scorer.score({
    question: testCase.question,
    response: testCase.answer,
    criteria,
  })

    baseResults.push({
    id: testCase.id,
    kind: testCase.kind,
    profile: testCase.profile,
    question: testCase.question,
    answer: testCase.answer,
    criteria: testCase.criteria,
      gate: scoreResult.gate,
      answerSupport: scoreResult.answerSupport,
      constraintPresence: scoreResult.constraintPresence,
      constraintRespect: scoreResult.constraintRespect,
      structuralScore: scoreResult.structuralScore,
      referenceScores: testCase.referenceScores,
      rawScores: scoreResult.rawScores,
    referenceOverall: weightedPercent(testCase.criteria, testCase.referenceScores),
    rawOverall: weightedPercent(testCase.criteria, scoreResult.rawScores),
  })
}

const hardNegativeResults = await Promise.all(
  createHardNegativeCases(BENCHMARK_CASES).map(async (testCase) => {
    const scoreResult = await scorer.score({
      question: testCase.question,
      response: testCase.answer,
      criteria: testCase.criteria.map((criterion) => criterion.label),
    })

    return {
      id: testCase.id,
      question: testCase.question,
      answer: testCase.answer,
      criteria: testCase.criteria,
      answerSupport: scoreResult.answerSupport,
      structuralScore: scoreResult.structuralScore,
      rawScores: scoreResult.rawScores,
      referenceOverall: testCase.referenceOverall,
    } satisfies CalibrationCaseResult
  }),
)

const rawResults = materializeResults(baseResults, 'raw')
const rawSummary = summarize(rawResults)
const crossValidatedResults = crossValidateCalibration(baseResults, hardNegativeResults, 5)
const crossValidatedSummary = summarize(crossValidatedResults)
const runtimeCalibration = fitCalibrationBundle(baseResults, hardNegativeResults)
const runtimeResults = materializeResults(baseResults, 'runtime', runtimeCalibration)
const runtimeSummary = summarize(runtimeResults)

await mkdir(REPORTS_DIR, { recursive: true })
await Bun.write(
  fileURLToPath(new URL('../reports/benchmark-results.json', import.meta.url)),
  JSON.stringify(
    {
      criterionCalibrationCurve: runtimeCalibration.criterion,
      overallCalibrationCurve: runtimeCalibration.overall,
      rawSummary,
      crossValidatedSummary,
      runtimeSummary,
      rawResults,
      crossValidatedResults,
      runtimeResults,
    },
    null,
    2,
  ),
)
await Bun.write(
  fileURLToPath(new URL('../reports/benchmark-report.md', import.meta.url)),
  renderMarkdown({
    rawSummary,
    crossValidatedSummary,
    runtimeSummary,
    rawResults,
    crossValidatedResults,
    runtimeResults,
    runtimeCalibration,
  }),
)
await Bun.write(
  fileURLToPath(new URL('../../library/src/generated-calibration.ts', import.meta.url)),
  renderCalibrationModule(runtimeCalibration),
)

console.log(
  JSON.stringify(
    {
      caseCount: baseResults.length,
      raw: compactSummary(rawSummary),
      crossValidated: compactSummary(crossValidatedSummary),
      runtime: compactSummary(runtimeSummary),
      criterionCurveKnots: runtimeCalibration.criterion?.xs.length ?? 0,
      overallCurveKnots: runtimeCalibration.overall?.xs.length ?? 0,
      worstCrossValidated: crossValidatedSummary.topMisses.slice(0, 5).map((item) => ({
        id: item.id,
        diff: round(item.diff),
        referenceOverall: round(item.referenceOverall),
        appOverall: round(item.appOverall),
      })),
    },
    null,
    2,
  ),
)

function materializeResults(
  baseResults: BaseCaseResult[],
  scoreMode: EvaluatedCaseResult['scoreMode'],
  calibration: CalibrationBundle = { criterion: null, overall: null },
) {
  return baseResults.map((result) => {
    const appScores = calibration.criterion
      ? result.rawScores.map((score) => applyCalibrationCurve(score, calibration.criterion))
      : [...result.rawScores]
    const overall = computeCalibratedOverallScore(
      {
        rawOverall: weightedPercent(result.criteria, appScores) / 100,
      question: result.question,
      response: result.answer,
      answerSupport: result.answerSupport,
      criterionScores: appScores,
      structuralScore: result.structuralScore,
    },
    { overallCalibration: calibration.overall },
  )
    const appOverall = round(overall.overallCalibrated * 100)
    const diff = appOverall - result.referenceOverall

    return {
      ...result,
      scoreMode,
      appScores,
      appOverall,
      diff,
      absDiff: Math.abs(diff),
    }
  })
}

function crossValidateCalibration(
  baseResults: BaseCaseResult[],
  hardNegativeResults: CalibrationCaseResult[],
  foldCount: number,
) {
  const groups = Array.from({ length: foldCount }, () => [] as BaseCaseResult[])
  const hardNegativeGroups = Array.from({ length: foldCount }, () => [] as CalibrationCaseResult[])

  baseResults.forEach((result, index) => {
    groups[index % foldCount]?.push(result)
  })
  hardNegativeResults.forEach((result, index) => {
    hardNegativeGroups[index % foldCount]?.push(result)
  })

  const evaluatedResults: EvaluatedCaseResult[] = []

  for (let foldIndex = 0; foldIndex < groups.length; foldIndex += 1) {
    const holdout = groups[foldIndex] ?? []
    const training = groups.flatMap((group, index) => (index === foldIndex ? [] : group))
    const trainingHardNegatives = hardNegativeGroups.flatMap((group, index) => (index === foldIndex ? [] : group))
    const calibration = fitCalibrationBundle(training, trainingHardNegatives)

    evaluatedResults.push(...materializeResults(holdout, 'cross_validated', calibration))
  }

  return evaluatedResults
}

function fitCriterionCalibration(baseResults: BaseCaseResult[]) {
  return fitIsotonicCalibration(
    [
      ...baseResults.flatMap((result) =>
        result.rawScores.map((rawScore, index) => ({
          raw: rawScore,
          target: result.referenceScores[index] ?? 0,
          weight: result.criteria[index]?.weight ?? 1,
        })),
      ),
      ...buildCalibrationAnchors(),
    ],
  )
}

function fitOverallCalibration(
  baseResults: BaseCaseResult[],
  hardNegativeResults: CalibrationCaseResult[],
  criterionCalibration: CalibrationCurve | null,
) {
  return fitIsotonicCalibration(
    [
      ...buildOverallCalibrationPoints(baseResults, criterionCalibration, 1),
      ...buildOverallCalibrationPoints(hardNegativeResults, criterionCalibration, 1.2),
      ...buildOverallCalibrationAnchors(),
    ],
  )
}

function fitCalibrationBundle(
  baseResults: BaseCaseResult[],
  hardNegativeResults: CalibrationCaseResult[],
): CalibrationBundle {
  const criterion = fitCriterionCalibration(baseResults)
  const overall = fitOverallCalibration(baseResults, hardNegativeResults, criterion)

  return { criterion, overall }
}

function weightedPercent(criteria: BenchmarkCase['criteria'], scores: number[]) {
  return round(
    criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / 100,
  )
}

function summarize(results: EvaluatedCaseResult[]): BenchmarkSummary {
  const absDiffs = results.map((result) => result.absDiff).sort((a, b) => a - b)
  const meanAbsoluteError = absDiffs.reduce((sum, value) => sum + value, 0) / absDiffs.length
  const medianAbsoluteError = absDiffs[Math.floor(absDiffs.length / 2)] ?? 0
  const within10 = results.filter((result) => result.absDiff <= 10).length
  const within20 = results.filter((result) => result.absDiff <= 20).length
  const byKind = summarizeGroups(groupBy(results, (result) => result.kind))
  const byProfile = summarizeGroups(groupBy(results, (result) => result.profile))
  const topMisses = [...results].sort((a, b) => b.absDiff - a.absDiff).slice(0, 15)

  return {
    meanAbsoluteError,
    medianAbsoluteError,
    within10,
    within20,
    byKind,
    byProfile,
    topMisses,
  }
}

function summarizeGroups(groups: Map<string, EvaluatedCaseResult[]>) {
  return Array.from(groups.entries())
    .map(([name, items]) => {
      const mae = items.reduce((sum, item) => sum + item.absDiff, 0) / items.length
      const avgReference = items.reduce((sum, item) => sum + item.referenceOverall, 0) / items.length
      const avgApp = items.reduce((sum, item) => sum + item.appOverall, 0) / items.length
      return {
        name,
        count: items.length,
        meanAbsoluteError: round(mae),
        averageReference: round(avgReference),
        averageApp: round(avgApp),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function groupBy<T>(items: T[], keyFn: (item: T) => string) {
  const groups = new Map<string, T[]>()

  for (const item of items) {
    const key = keyFn(item)
    const group = groups.get(key)

    if (group) {
      group.push(item)
    } else {
      groups.set(key, [item])
    }
  }

  return groups
}

function buildOverallCalibrationPoints(
  results: CalibrationCaseResult[],
  criterionCalibration: CalibrationCurve | null,
  weight: number,
) {
  return results.map((result) => {
    const calibratedScores = criterionCalibration
      ? result.rawScores.map((score) => applyCalibrationCurve(score, criterionCalibration))
      : result.rawScores
    const overall = computeCalibratedOverallScore(
      {
        rawOverall: weightedPercent(result.criteria, calibratedScores) / 100,
        question: result.question,
        response: result.answer,
        answerSupport: result.answerSupport,
        criterionScores: calibratedScores,
        structuralScore: result.structuralScore,
      },
      { overallCalibration: null },
    )

    return {
      raw: overall.overallAdjustedRaw,
      target: result.referenceOverall / 100,
      weight,
    }
  })
}

function renderMarkdown(payload: {
  rawSummary: BenchmarkSummary
  crossValidatedSummary: BenchmarkSummary
  runtimeSummary: BenchmarkSummary
  rawResults: EvaluatedCaseResult[]
  crossValidatedResults: EvaluatedCaseResult[]
  runtimeResults: EvaluatedCaseResult[]
  runtimeCalibration: CalibrationBundle
}) {
  const lines = [
    '# Benchmark Report',
    '',
    `Cases: ${payload.rawResults.length}`,
    '',
    '## Raw Scoring',
    '',
    ...renderSummary(payload.rawSummary, payload.rawResults.length),
    '',
    '## Cross-Validated Calibrated Scoring',
    '',
    ...renderSummary(payload.crossValidatedSummary, payload.crossValidatedResults.length),
    '',
    '## Runtime Calibrated Scoring',
    '',
    ...renderSummary(payload.runtimeSummary, payload.runtimeResults.length),
    '',
    '## Calibration Curve',
    '',
    payload.runtimeCalibration.criterion
      ? `Criterion calibration knots: ${payload.runtimeCalibration.criterion.xs
          .map((x, index) => `(${round(x)}, ${round(payload.runtimeCalibration.criterion?.ys[index] ?? 0)})`)
          .join(', ')}`
      : 'No calibration curve generated.',
    payload.runtimeCalibration.overall
      ? `Overall calibration knots: ${payload.runtimeCalibration.overall.xs
          .map((x, index) => `(${round(x)}, ${round(payload.runtimeCalibration.overall?.ys[index] ?? 0)})`)
          .join(', ')}`
      : 'No overall calibration curve generated.',
    '',
    '## Top Cross-Validated Misses',
    '',
    ...payload.crossValidatedSummary.topMisses.map((item) => {
      const question = truncate(item.question, 100)
      const answer = truncate(item.answer, 140)
      return `- ${item.id}: ref ${round(item.referenceOverall)}, app ${round(item.appOverall)}, diff ${round(item.diff)}, gate ${round(item.gate)}, answer ${round(item.answerSupport)}, constraint ${round(item.constraintRespect)}\n  Q: ${question}\n  A: ${answer}`
    }),
  ]

  return `${lines.join('\n')}\n`
}

function renderSummary(summary: BenchmarkSummary, caseCount: number) {
  return [
    `Mean absolute error: ${round(summary.meanAbsoluteError)}`,
    `Median absolute error: ${round(summary.medianAbsoluteError)}`,
    `Within 10 points: ${summary.within10}/${caseCount}`,
    `Within 20 points: ${summary.within20}/${caseCount}`,
    '',
    'By kind:',
    ...summary.byKind.map(
      (group) =>
        `- ${group.name}: count ${group.count}, MAE ${group.meanAbsoluteError}, reference avg ${group.averageReference}, app avg ${group.averageApp}`,
    ),
    '',
    'By profile:',
    ...summary.byProfile.map(
      (group) =>
        `- ${group.name}: count ${group.count}, MAE ${group.meanAbsoluteError}, reference avg ${group.averageReference}, app avg ${group.averageApp}`,
    ),
  ]
}

function renderCalibrationModule(calibration: CalibrationBundle) {
  if (!calibration.criterion && !calibration.overall) {
    return [
      "import type { CalibrationCurve } from './calibration-core'",
      '',
      '// This file is updated by scripts/run-benchmark.ts after fitting a monotonic calibration curve.',
      'export const DEFAULT_CRITERION_CALIBRATION: CalibrationCurve | null = null',
      'export const DEFAULT_OVERALL_CALIBRATION: CalibrationCurve | null = null',
      '',
    ].join('\n')
  }

  const criterionXs = calibration.criterion ? `[${calibration.criterion.xs.map((value) => value.toFixed(6)).join(', ')}]` : '[]'
  const criterionYs = calibration.criterion ? `[${calibration.criterion.ys.map((value) => value.toFixed(6)).join(', ')}]` : '[]'
  const overallXs = calibration.overall ? `[${calibration.overall.xs.map((value) => value.toFixed(6)).join(', ')}]` : '[]'
  const overallYs = calibration.overall ? `[${calibration.overall.ys.map((value) => value.toFixed(6)).join(', ')}]` : '[]'

  return [
    "import type { CalibrationCurve } from './calibration-core'",
    '',
    '// This file is updated by scripts/run-benchmark.ts after fitting a monotonic calibration curve.',
    'export const DEFAULT_CRITERION_CALIBRATION: CalibrationCurve | null = {',
    `  xs: ${criterionXs},`,
    `  ys: ${criterionYs},`,
    '}',
    'export const DEFAULT_OVERALL_CALIBRATION: CalibrationCurve | null = {',
    `  xs: ${overallXs},`,
    `  ys: ${overallYs},`,
    '}',
    '',
  ].join('\n')
}

function compactSummary(summary: BenchmarkSummary) {
  return {
    meanAbsoluteError: round(summary.meanAbsoluteError),
    medianAbsoluteError: round(summary.medianAbsoluteError),
    within10: summary.within10,
    within20: summary.within20,
  }
}

function truncate(text: string, limit: number) {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`
}

function round(value: number) {
  return Math.round(value * 10) / 10
}

function buildCalibrationAnchors() {
  return [
    { raw: 0, target: 0, weight: 60 },
    { raw: 0.05, target: 0.03, weight: 18 },
    { raw: 0.1, target: 0.08, weight: 12 },
    { raw: 0.25, target: 0.25, weight: 8 },
    { raw: 0.5, target: 0.5, weight: 8 },
    { raw: 0.75, target: 0.75, weight: 8 },
    { raw: 0.9, target: 0.9, weight: 12 },
    { raw: 1, target: 1, weight: 60 },
  ]
}

function buildOverallCalibrationAnchors() {
  return [
    { raw: 0, target: 0, weight: 60 },
    { raw: 0.1, target: 0.08, weight: 14 },
    { raw: 0.25, target: 0.22, weight: 10 },
    { raw: 0.5, target: 0.5, weight: 10 },
    { raw: 0.75, target: 0.78, weight: 10 },
    { raw: 0.9, target: 0.92, weight: 14 },
    { raw: 1, target: 1, weight: 60 },
  ]
}
