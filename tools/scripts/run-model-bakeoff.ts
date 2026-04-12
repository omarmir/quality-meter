import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from '@huggingface/transformers'
import { BENCHMARK_CASES, type BenchmarkCase, type BenchmarkKind, type BenchmarkProfile } from '../benchmark/cases'
import { createHardNegativeCases, type HardNegativeCase } from '../benchmark/hard-negatives'
import {
  applyCalibrationCurve,
  computeCalibratedOverallScore,
  createTransformersQualityScorer,
  fitIsotonicCalibration,
  resolveQualityScorerConfig,
  type CalibrationCurve,
} from '@browser-quality-scorer/core'

type ModelCandidate = {
  id: string
  label: string
  note: string
}

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

type EvaluatedCaseResult = BaseCaseResult & {
  scoreMode: 'raw' | 'cross_validated' | 'runtime'
  appScores: number[]
  appOverall: number
  diff: number
  absDiff: number
}

type HardNegativeResult = HardNegativeCase & {
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
  byProfile?: GroupSummary[]
  topMisses: Array<
    | EvaluatedCaseResult
    | HardNegativeResult
  >
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

type ModelBakeoffResult = {
  modelId: string
  label: string
  note: string
  sizeBytes: number | null
  sizeLabel: string
  loadDurationMs: number
  baseBenchmarkDurationMs: number
  hardNegativeDurationMs: number
  totalDurationMs: number
  mainRawSummary: BenchmarkSummary
  mainCrossValidatedSummary: BenchmarkSummary
  mainRuntimeSummary: BenchmarkSummary
  hardNegativeRawSummary: BenchmarkSummary
  hardNegativeCrossValidatedSummary: BenchmarkSummary
  hardNegativeRuntimeSummary: BenchmarkSummary
}

const MODEL_CANDIDATES: ModelCandidate[] = [
  {
    id: 'Xenova/nli-deberta-v3-xsmall',
    label: 'DeBERTa v3 xsmall',
    note: 'Current recommended baseline. Smallest DeBERTa-family candidate and the best overall tradeoff in this bakeoff.',
  },
  {
    id: 'Xenova/nli-deberta-v3-small',
    label: 'DeBERTa v3 small',
    note: 'Previous q8 baseline before the switch to xsmall.',
  },
  {
    id: 'MoritzLaurer/ModernBERT-base-zeroshot-v2.0',
    label: 'ModernBERT base zeroshot',
    note: 'Compact base-sized zero-shot model with a stronger architecture-size tradeoff than the current baseline.',
  },
  {
    id: 'Xenova/deberta-v3-base-tasksource-nli',
    label: 'DeBERTa v3 base tasksource NLI',
    note: 'Largest DeBERTa candidate in this shortlist. Accuracy-first option if browser budget allows it.',
  },
  {
    id: 'onnx-community/distilbart-mnli-12-3-ONNX',
    label: 'DistilBART MNLI',
    note: 'Older MNLI baseline. Included to test whether architecture differences help despite the larger payload.',
  },
  {
    id: 'onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX',
    label: 'Multilingual MiniLMv2 L6 MNLI/XNLI',
    note: 'Multilingual zero-shot candidate proposed for French support. Included here to measure English-regression risk before any profile split.',
  },
]

const ROOT_DIR = process.cwd()
const CACHE_ROOT = path.join(ROOT_DIR, '.model-bakeoff-cache')
const REPORT_PATH = fileURLToPath(new URL('../reports/model-bakeoff.md', import.meta.url))
const RESULTS_PATH = fileURLToPath(new URL('../reports/model-bakeoff.json', import.meta.url))
const REQUESTED_MODELS = new Set(Bun.argv.slice(2))
const SELECTED_CANDIDATES =
  REQUESTED_MODELS.size === 0
    ? MODEL_CANDIDATES
    : MODEL_CANDIDATES.filter(
        (candidate) =>
          REQUESTED_MODELS.has(candidate.id) || REQUESTED_MODELS.has(slugify(candidate.id)) || REQUESTED_MODELS.has(candidate.label),
      )

if (REQUESTED_MODELS.size > 0 && SELECTED_CANDIDATES.length === 0) {
  throw new Error(`No matching model candidates for: ${Array.from(REQUESTED_MODELS).join(', ')}`)
}

await mkdir(path.dirname(REPORT_PATH), { recursive: true })
await mkdir(CACHE_ROOT, { recursive: true })

const startedAt = performance.now()
const results: ModelBakeoffResult[] = []
const failures: Array<{ modelId: string; error: string }> = []

for (const candidate of SELECTED_CANDIDATES) {
  console.log(`\n=== ${candidate.id} ===`)

  try {
    const result = await runModelBakeoff(candidate)
    results.push(result)
    console.log(
      JSON.stringify(
        {
          modelId: result.modelId,
          size: result.sizeLabel,
          loadMs: round(result.loadDurationMs),
          totalMs: round(result.totalDurationMs),
          mainCv: compactSummary(result.mainCrossValidatedSummary),
          hardCv: compactSummary(result.hardNegativeCrossValidatedSummary),
        },
        null,
        2,
      ),
    )
  } catch (error) {
    const message = error instanceof Error ? error.stack ?? error.message : String(error)
    failures.push({ modelId: candidate.id, error: message })
    console.error(`Bakeoff failed for ${candidate.id}: ${message}`)
  }
}

const completedAt = performance.now()

await Bun.write(
  RESULTS_PATH,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      elapsedMs: round(completedAt - startedAt),
      candidates: SELECTED_CANDIDATES,
      results,
      failures,
    },
    null,
    2,
  ),
)

await Bun.write(
  REPORT_PATH,
  renderMarkdown({
    results,
    failures,
    elapsedMs: completedAt - startedAt,
  }),
)

console.log(
  JSON.stringify(
    {
      results: results.map((result) => ({
        modelId: result.modelId,
        size: result.sizeLabel,
        mainCv: compactSummary(result.mainCrossValidatedSummary),
        hardCv: compactSummary(result.hardNegativeCrossValidatedSummary),
        loadMs: round(result.loadDurationMs),
        totalMs: round(result.totalDurationMs),
      })),
      selected: SELECTED_CANDIDATES.map((candidate) => candidate.id),
      failures,
      report: REPORT_PATH,
    },
    null,
    2,
  ),
)

async function runModelBakeoff(candidate: ModelCandidate): Promise<ModelBakeoffResult> {
  const modelStartedAt = performance.now()
  const sizeBytes = await fetchModelSizeBytes(candidate.id)
  const cacheDir = path.join(CACHE_ROOT, slugify(candidate.id))

  await rm(cacheDir, { recursive: true, force: true })
  await mkdir(cacheDir, { recursive: true })

  const scorerConfig = resolveQualityScorerConfig({
    modelId: candidate.id,
    dtype: 'q8',
    modelSource: {
      mode: 'huggingface',
      revision: 'main',
      useBrowserCache: false,
    },
    criterionCalibration: null,
    overallCalibration: null,
  })

  env.useBrowserCache = false
  env.useFSCache = true
  env.cacheDir = cacheDir

  const scorer = createTransformersQualityScorer(scorerConfig)

  const loadStartedAt = performance.now()
  await scorer.loadModel()
  const loadDurationMs = performance.now() - loadStartedAt

  const baseStartedAt = performance.now()
  const baseResults: BaseCaseResult[] = []

  for (const testCase of BENCHMARK_CASES) {
    const scoreResult = await scorer.score({
      question: testCase.question,
      response: testCase.answer,
      criteria: testCase.criteria.map((criterion) => criterion.label),
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
  const baseBenchmarkDurationMs = performance.now() - baseStartedAt

  const hardNegativeStartedAt = performance.now()
  const hardNegativeCases = createHardNegativeCases(BENCHMARK_CASES)
  const hardNegativeCasesWithScores: CalibrationCaseResult[] = []

  for (const testCase of hardNegativeCases) {
    const scoreResult = await scorer.score({
      question: testCase.question,
      response: testCase.answer,
      criteria: testCase.criteria.map((criterion) => criterion.label),
    })

    hardNegativeCasesWithScores.push({
      id: testCase.id,
      question: testCase.question,
      answer: testCase.answer,
      criteria: testCase.criteria,
      answerSupport: scoreResult.answerSupport,
      structuralScore: scoreResult.structuralScore,
      rawScores: scoreResult.rawScores,
      referenceOverall: testCase.referenceOverall,
    })
  }
  const hardNegativeDurationMs = performance.now() - hardNegativeStartedAt

  const runtimeCalibration = fitCalibrationBundle(baseResults, hardNegativeCasesWithScores)

  const mainRawSummary = summarizeMain(materializeMainResults(baseResults, 'raw'))
  const mainCrossValidatedSummary = summarizeMain(
    crossValidateMainCalibration(baseResults, hardNegativeCasesWithScores, 5),
  )
  const mainRuntimeSummary = summarizeMain(
    materializeMainResults(baseResults, 'runtime', runtimeCalibration),
  )

  const hardNegativeRawSummary = summarizeHardNegative(
    materializeHardNegativeResults(hardNegativeCases, hardNegativeCasesWithScores, 'raw'),
  )
  const hardNegativeCrossValidatedSummary = summarizeHardNegative(
    crossValidateHardNegativeCalibration(baseResults, hardNegativeCases, hardNegativeCasesWithScores, 5),
  )
  const hardNegativeRuntimeSummary = summarizeHardNegative(
    materializeHardNegativeResults(hardNegativeCases, hardNegativeCasesWithScores, 'runtime', runtimeCalibration),
  )

  return {
    modelId: candidate.id,
    label: candidate.label,
    note: candidate.note,
    sizeBytes,
    sizeLabel: formatBytes(sizeBytes),
    loadDurationMs,
    baseBenchmarkDurationMs,
    hardNegativeDurationMs,
    totalDurationMs: performance.now() - modelStartedAt,
    mainRawSummary,
    mainCrossValidatedSummary,
    mainRuntimeSummary,
    hardNegativeRawSummary,
    hardNegativeCrossValidatedSummary,
    hardNegativeRuntimeSummary,
  }
}

function materializeMainResults(
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

function materializeHardNegativeResults(
  hardNegativeCases: HardNegativeCase[],
  calibrationCases: CalibrationCaseResult[],
  scoreMode: HardNegativeResult['scoreMode'],
  calibration: CalibrationBundle = { criterion: null, overall: null },
) {
  return hardNegativeCases.map((testCase) => {
    const rawResult = calibrationCases.find((item) => item.id === testCase.id)

    if (!rawResult) {
      throw new Error(`Missing hard-negative calibration result for ${testCase.id}`)
    }

    const appScores = calibration.criterion
      ? rawResult.rawScores.map((score) => applyCalibrationCurve(score, calibration.criterion))
      : [...rawResult.rawScores]
    const overall = computeCalibratedOverallScore(
      {
        rawOverall: weightedPercent(testCase.criteria, appScores) / 100,
        question: testCase.question,
        response: testCase.answer,
        answerSupport: rawResult.answerSupport,
        criterionScores: appScores,
        structuralScore: rawResult.structuralScore,
      },
      { overallCalibration: calibration.overall },
    )
    const appOverall = round(overall.overallCalibrated * 100)
    const diff = appOverall - testCase.referenceOverall

    return {
      ...testCase,
      scoreMode,
      appScores,
      appOverall,
      diff,
      absDiff: Math.abs(diff),
    }
  })
}

function crossValidateMainCalibration(
  baseResults: BaseCaseResult[],
  hardNegativeResults: CalibrationCaseResult[],
  foldCount: number,
) {
  const baseGroups = groupIntoFolds(baseResults, foldCount)
  const hardNegativeGroups = groupIntoFolds(hardNegativeResults, foldCount)
  const evaluatedResults: EvaluatedCaseResult[] = []

  for (let foldIndex = 0; foldIndex < foldCount; foldIndex += 1) {
    const holdout = baseGroups[foldIndex] ?? []
    const trainingBase = baseGroups.flatMap((group, index) => (index === foldIndex ? [] : group))
    const trainingHardNegatives = hardNegativeGroups.flatMap((group, index) => (index === foldIndex ? [] : group))
    const calibration = fitCalibrationBundle(trainingBase, trainingHardNegatives)

    evaluatedResults.push(...materializeMainResults(holdout, 'cross_validated', calibration))
  }

  return evaluatedResults
}

function crossValidateHardNegativeCalibration(
  baseResults: BaseCaseResult[],
  hardNegativeCases: HardNegativeCase[],
  hardNegativeResults: CalibrationCaseResult[],
  foldCount: number,
) {
  const baseGroups = groupIntoFolds(baseResults, foldCount)
  const hardNegativeCaseGroups = groupIntoFolds(hardNegativeCases, foldCount)
  const hardNegativeResultGroups = groupIntoFolds(hardNegativeResults, foldCount)
  const evaluatedResults: HardNegativeResult[] = []

  for (let foldIndex = 0; foldIndex < foldCount; foldIndex += 1) {
    const holdoutCases = hardNegativeCaseGroups[foldIndex] ?? []
    const holdoutResults = hardNegativeResultGroups[foldIndex] ?? []
    const trainingBase = baseGroups.flatMap((group, index) => (index === foldIndex ? [] : group))
    const trainingHardNegatives = hardNegativeResultGroups.flatMap((group, index) => (index === foldIndex ? [] : group))
    const calibration = fitCalibrationBundle(trainingBase, trainingHardNegatives)

    evaluatedResults.push(
      ...materializeHardNegativeResults(holdoutCases, holdoutResults, 'cross_validated', calibration),
    )
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
      ...buildCriterionCalibrationAnchors(),
    ],
  )
}

function fitOverallCalibration(
  baseResults: CalibrationCaseResult[],
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

function summarizeMain(results: EvaluatedCaseResult[]): BenchmarkSummary {
  return summarize(results, (result) => result.kind, (result) => result.profile)
}

function summarizeHardNegative(results: HardNegativeResult[]): BenchmarkSummary {
  return summarize(results, (result) => result.kind)
}

function summarize<T extends { absDiff: number; referenceOverall: number; appOverall: number; diff: number }>(
  results: T[],
  kindSelector: (result: T) => string,
  profileSelector?: (result: T) => string,
): BenchmarkSummary {
  const absDiffs = results.map((result) => result.absDiff).sort((left, right) => left - right)
  const meanAbsoluteError = absDiffs.reduce((sum, value) => sum + value, 0) / absDiffs.length
  const medianAbsoluteError = absDiffs[Math.floor(absDiffs.length / 2)] ?? 0
  const within10 = results.filter((result) => result.absDiff <= 10).length
  const within20 = results.filter((result) => result.absDiff <= 20).length
  const byKind = summarizeGroups(groupBy(results, kindSelector))
  const byProfile = profileSelector ? summarizeGroups(groupBy(results, profileSelector)) : undefined
  const topMisses = [...results].sort((left, right) => right.absDiff - left.absDiff).slice(0, 10)

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

function summarizeGroups<T extends { absDiff: number; referenceOverall: number; appOverall: number }>(
  groups: Map<string, T[]>,
) {
  return Array.from(groups.entries())
    .map(([name, items]) => ({
      name,
      count: items.length,
      meanAbsoluteError: round(items.reduce((sum, item) => sum + item.absDiff, 0) / items.length),
      averageReference: round(items.reduce((sum, item) => sum + item.referenceOverall, 0) / items.length),
      averageApp: round(items.reduce((sum, item) => sum + item.appOverall, 0) / items.length),
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
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

function groupIntoFolds<T>(items: T[], foldCount: number) {
  const groups = Array.from({ length: foldCount }, () => [] as T[])

  items.forEach((item, index) => {
    groups[index % foldCount]?.push(item)
  })

  return groups
}

function weightedPercent(criteria: BenchmarkCase['criteria'], scores: number[]) {
  return round(
    criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / 100,
  )
}

function compactSummary(summary: BenchmarkSummary) {
  return {
    mae: round(summary.meanAbsoluteError),
    median: round(summary.medianAbsoluteError),
    within10: summary.within10,
    within20: summary.within20,
  }
}

function renderMarkdown(payload: {
  results: ModelBakeoffResult[]
  failures: Array<{ modelId: string; error: string }>
  elapsedMs: number
}) {
  const sortedByMain = [...payload.results].sort(
    (left, right) =>
      left.mainCrossValidatedSummary.meanAbsoluteError - right.mainCrossValidatedSummary.meanAbsoluteError,
  )
  const sortedByHardNegative = [...payload.results].sort(
    (left, right) =>
      left.hardNegativeCrossValidatedSummary.meanAbsoluteError -
      right.hardNegativeCrossValidatedSummary.meanAbsoluteError,
  )
  const bestOverall = sortedByMain[0]
  const bestHardNegative = sortedByHardNegative[0]
  const smallest = [...payload.results].sort((left, right) => (left.sizeBytes ?? Infinity) - (right.sizeBytes ?? Infinity))[0]

  const lines = [
    '# Model Bakeoff Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Candidates: ${payload.results.length}`,
    `Elapsed: ${formatDuration(payload.elapsedMs)}`,
    '',
    '## Summary',
    '',
    bestOverall
      ? `- Best main benchmark: ${bestOverall.modelId} (cross-validated MAE ${round(bestOverall.mainCrossValidatedSummary.meanAbsoluteError)}, size ${bestOverall.sizeLabel})`
      : '- Best main benchmark: n/a',
    bestHardNegative
      ? `- Best hard-negative benchmark: ${bestHardNegative.modelId} (cross-validated MAE ${round(bestHardNegative.hardNegativeCrossValidatedSummary.meanAbsoluteError)}, size ${bestHardNegative.sizeLabel})`
      : '- Best hard-negative benchmark: n/a',
    smallest ? `- Smallest payload: ${smallest.modelId} (${smallest.sizeLabel})` : '- Smallest payload: n/a',
    '',
    '## Cross-Validated Comparison',
    '',
    '| Model | q8 size | Main MAE | Main median | Main within 10 | Main within 20 | Hard MAE | Hard median | Hard within 10 | Hard within 20 | Load | Total |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...sortedByMain.map((result) => {
      const main = result.mainCrossValidatedSummary
      const hard = result.hardNegativeCrossValidatedSummary
      return `| ${result.modelId} | ${result.sizeLabel} | ${round(main.meanAbsoluteError)} | ${round(main.medianAbsoluteError)} | ${main.within10}/100 | ${main.within20}/100 | ${round(hard.meanAbsoluteError)} | ${round(hard.medianAbsoluteError)} | ${hard.within10}/100 | ${hard.within20}/100 | ${formatDuration(result.loadDurationMs)} | ${formatDuration(result.totalDurationMs)} |`
    }),
    '',
    '## Per-Model Notes',
    '',
    ...sortedByMain.flatMap((result) => [
      `### ${result.modelId}`,
      '',
      `- Label: ${result.label}`,
      `- Note: ${result.note}`,
      `- q8 artifact size: ${result.sizeLabel}`,
      `- Cold load time: ${formatDuration(result.loadDurationMs)}`,
      `- Base benchmark time: ${formatDuration(result.baseBenchmarkDurationMs)}`,
      `- Hard-negative benchmark time: ${formatDuration(result.hardNegativeDurationMs)}`,
      `- Total time: ${formatDuration(result.totalDurationMs)}`,
      `- Main cross-validated: MAE ${round(result.mainCrossValidatedSummary.meanAbsoluteError)}, median ${round(result.mainCrossValidatedSummary.medianAbsoluteError)}, within 10 ${result.mainCrossValidatedSummary.within10}/100, within 20 ${result.mainCrossValidatedSummary.within20}/100`,
      `- Hard-negative cross-validated: MAE ${round(result.hardNegativeCrossValidatedSummary.meanAbsoluteError)}, median ${round(result.hardNegativeCrossValidatedSummary.medianAbsoluteError)}, within 10 ${result.hardNegativeCrossValidatedSummary.within10}/100, within 20 ${result.hardNegativeCrossValidatedSummary.within20}/100`,
      `- Main raw: MAE ${round(result.mainRawSummary.meanAbsoluteError)}; runtime calibrated: MAE ${round(result.mainRuntimeSummary.meanAbsoluteError)}`,
      `- Hard-negative raw: MAE ${round(result.hardNegativeRawSummary.meanAbsoluteError)}; runtime calibrated: MAE ${round(result.hardNegativeRuntimeSummary.meanAbsoluteError)}`,
      '',
    ]),
  ]

  if (payload.failures.length > 0) {
    lines.push('## Failures', '')
    for (const failure of payload.failures) {
      lines.push(`- ${failure.modelId}: ${failure.error}`)
    }
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}

function buildCriterionCalibrationAnchors() {
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

async function fetchModelSizeBytes(modelId: string) {
  const response = await fetch(`https://huggingface.co/${modelId}/resolve/main/onnx/model_quantized.onnx`, {
    method: 'HEAD',
    redirect: 'follow',
  })

  if (!response.ok) {
    return null
  }

  const contentLength = response.headers.get('content-length')
  return contentLength ? Number.parseInt(contentLength, 10) : null
}

function formatBytes(value: number | null) {
  if (!value || !Number.isFinite(value)) {
    return 'n/a'
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(valueMs: number) {
  const seconds = valueMs / 1000

  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainder = seconds - minutes * 60
  return `${minutes}m ${remainder.toFixed(1)}s`
}

function slugify(value: string) {
  return value.replaceAll(/[^\w.-]+/g, '-')
}

function round(value: number) {
  return Math.round(value * 10) / 10
}
