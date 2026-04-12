import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BENCHMARK_CASES, type BenchmarkCase, type BenchmarkKind, type BenchmarkProfile } from '../benchmark/cases'
import { createHardNegativeCases } from '../benchmark/hard-negatives'
import {
  applyCalibrationCurve,
  computeCalibratedOverallScore,
  createTransformersQualityScorer,
  fitIsotonicCalibration,
  type CalibrationCurve,
  type QualityScorerConfigInput,
} from '@browser-quality-scorer/core'

type Variant = {
  id: string
  title: string
  description: string
  config: QualityScorerConfigInput
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

type HardNegativeResult = CalibrationCaseResult & {
  kind: BenchmarkKind
  sourceId: string
  scoreMode: 'runtime'
  appScores: number[]
  appOverall: number
  diff: number
  absDiff: number
}

type Summary = {
  meanAbsoluteError: number
  medianAbsoluteError: number
  within10: number
  within20: number
}

type VariantResult = {
  variant: Variant
  rawSummary: Summary
  crossValidatedSummary: Summary
  runtimeSummary: Summary
  hardNegativeSummary: Summary
}

type CalibrationBundle = {
  criterion: CalibrationCurve | null
  overall: CalibrationCurve | null
}

const BASE_CONFIG: QualityScorerConfigInput = {
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
}

const VARIANTS: Variant[] = [
  {
    id: 'baseline',
    title: 'Baseline',
    description: 'Current scorer stack with the new low-latency layers disabled.',
    config: {
      ...BASE_CONFIG,
      lowLatency: {
        useDeterministicConstraintChecks: false,
        useTaskStructureChecks: false,
        useCriterionNormalization: false,
      },
    },
  },
  {
    id: 'step1_constraints',
    title: 'Step 1: Deterministic Constraint Checks',
    description:
      'Adds lightweight constraint extraction and violation checks on top of the NLI-based constraint gate.',
    config: {
      ...BASE_CONFIG,
      lowLatency: {
        useDeterministicConstraintChecks: true,
        useTaskStructureChecks: false,
        useCriterionNormalization: false,
      },
    },
  },
  {
    id: 'step2_structure',
    title: 'Step 2: Task-Type Structure Checks',
    description:
      'Keeps deterministic constraint checks and adds task-aware structure scoring for advice, comparison, and planning.',
    config: {
      ...BASE_CONFIG,
      lowLatency: {
        useDeterministicConstraintChecks: true,
        useTaskStructureChecks: true,
        useCriterionNormalization: false,
      },
    },
  },
  {
    id: 'step3_normalization',
    title: 'Step 3: Criterion Normalization',
    description:
      'Keeps the earlier layers and rewrites generic criteria into more explicit scoring criteria before running NLI.',
    config: {
      ...BASE_CONFIG,
      lowLatency: {
        useDeterministicConstraintChecks: true,
        useTaskStructureChecks: true,
        useCriterionNormalization: true,
      },
    },
  },
]

const variantResults: VariantResult[] = []
const REPORTS_DIR = fileURLToPath(new URL('../reports/', import.meta.url))

for (const variant of VARIANTS) {
  console.log(`Running ${variant.id}...`)
  const scorer = createTransformersQualityScorer(variant.config)
  await scorer.loadModel()

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

  const hardNegativeBaseResults: Array<CalibrationCaseResult & { kind: BenchmarkKind; sourceId: string }> = []

  for (const testCase of createHardNegativeCases(BENCHMARK_CASES)) {
    const scoreResult = await scorer.score({
      question: testCase.question,
      response: testCase.answer,
      criteria: testCase.criteria.map((criterion) => criterion.label),
    })

    hardNegativeBaseResults.push({
      id: testCase.id,
      sourceId: testCase.sourceId,
      kind: testCase.kind,
      question: testCase.question,
      answer: testCase.answer,
      criteria: testCase.criteria,
      answerSupport: scoreResult.answerSupport,
      structuralScore: scoreResult.structuralScore,
      rawScores: scoreResult.rawScores,
      referenceOverall: testCase.referenceOverall,
    })
  }

  const rawResults = materializeResults(baseResults, 'raw', variant.config)
  const rawSummary = summarize(rawResults)
  const crossValidatedResults = crossValidateCalibration(baseResults, hardNegativeBaseResults, variant.config, 5)
  const crossValidatedSummary = summarize(crossValidatedResults)
  const runtimeCalibration = fitCalibrationBundle(baseResults, hardNegativeBaseResults, variant.config)
  const runtimeResults = materializeResults(baseResults, 'runtime', variant.config, runtimeCalibration)
  const runtimeSummary = summarize(runtimeResults)
  const hardNegativeResults = materializeHardNegativeResults(hardNegativeBaseResults, variant.config, runtimeCalibration)
  const hardNegativeSummary = summarize(hardNegativeResults)

  variantResults.push({
    variant,
    rawSummary,
    crossValidatedSummary,
    runtimeSummary,
    hardNegativeSummary,
  })
}

await mkdir(REPORTS_DIR, { recursive: true })
await Bun.write(fileURLToPath(new URL('../reports/low-latency-iterations.json', import.meta.url)), JSON.stringify(variantResults, null, 2))
await Bun.write(fileURLToPath(new URL('../reports/low-latency-iterations.md', import.meta.url)), renderMarkdown(variantResults))

console.log(
  JSON.stringify(
    variantResults.map((result) => ({
      id: result.variant.id,
      mainCrossValidated: compactSummary(result.crossValidatedSummary),
      hardNegative: compactSummary(result.hardNegativeSummary),
    })),
    null,
    2,
  ),
)

function materializeResults(
  baseResults: BaseCaseResult[],
  scoreMode: EvaluatedCaseResult['scoreMode'],
  config: QualityScorerConfigInput,
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
      {
        ...config,
        criterionCalibration: calibration.criterion,
        overallCalibration: calibration.overall,
      },
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
  baseResults: Array<CalibrationCaseResult & { kind: BenchmarkKind; sourceId: string }>,
  config: QualityScorerConfigInput,
  calibration: CalibrationBundle,
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
      {
        ...config,
        criterionCalibration: calibration.criterion,
        overallCalibration: calibration.overall,
      },
    )
    const appOverall = round(overall.overallCalibrated * 100)
    const diff = appOverall - result.referenceOverall

    return {
      ...result,
      scoreMode: 'runtime' as const,
      appScores,
      appOverall,
      diff,
      absDiff: Math.abs(diff),
    } satisfies HardNegativeResult
  })
}

function crossValidateCalibration(
  baseResults: BaseCaseResult[],
  hardNegativeResults: CalibrationCaseResult[],
  config: QualityScorerConfigInput,
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
    const calibration = fitCalibrationBundle(training, trainingHardNegatives, config)

    evaluatedResults.push(...materializeResults(holdout, 'cross_validated', config, calibration))
  }

  return evaluatedResults
}

function fitCalibrationBundle(
  baseResults: BaseCaseResult[],
  hardNegativeResults: CalibrationCaseResult[],
  config: QualityScorerConfigInput,
): CalibrationBundle {
  const criterion = fitIsotonicCalibration(
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

  const mainCalibrationCases = baseResults.map((result) => ({
    question: result.question,
    answer: result.answer,
    criteria: result.criteria,
    answerSupport: result.answerSupport,
    structuralScore: result.structuralScore,
    rawScores: criterion ? result.rawScores.map((score) => applyCalibrationCurve(score, criterion)) : result.rawScores,
    referenceOverall: result.referenceOverall,
  }))

  const hardCalibrationCases = hardNegativeResults.map((result) => ({
    question: result.question,
    answer: result.answer,
    criteria: result.criteria,
    answerSupport: result.answerSupport,
    structuralScore: result.structuralScore,
    rawScores: criterion ? result.rawScores.map((score) => applyCalibrationCurve(score, criterion)) : result.rawScores,
    referenceOverall: result.referenceOverall,
  }))

  const overall = fitIsotonicCalibration(
    [
      ...mainCalibrationCases.map((result) => ({
        raw: computeCalibratedOverallScore(
          {
            rawOverall: weightedPercent(result.criteria, result.rawScores) / 100,
            question: result.question,
            response: result.answer,
            answerSupport: result.answerSupport,
            criterionScores: result.rawScores,
            structuralScore: result.structuralScore,
          },
          { ...config, criterionCalibration: criterion, overallCalibration: null },
        ).overallAdjustedRaw,
        target: result.referenceOverall / 100,
        weight: 1,
      })),
      ...hardCalibrationCases.map((result) => ({
        raw: computeCalibratedOverallScore(
          {
            rawOverall: weightedPercent(result.criteria, result.rawScores) / 100,
            question: result.question,
            response: result.answer,
            answerSupport: result.answerSupport,
            criterionScores: result.rawScores,
            structuralScore: result.structuralScore,
          },
          { ...config, criterionCalibration: criterion, overallCalibration: null },
        ).overallAdjustedRaw,
        target: result.referenceOverall / 100,
        weight: 1.2,
      })),
      ...buildOverallCalibrationAnchors(),
    ],
  )

  return { criterion, overall }
}

function summarize(results: Array<{ absDiff: number }>) {
  const absDiffs = results.map((result) => result.absDiff).sort((left, right) => left - right)
  return {
    meanAbsoluteError: round(absDiffs.reduce((sum, value) => sum + value, 0) / absDiffs.length),
    medianAbsoluteError: round(absDiffs[Math.floor(absDiffs.length / 2)] ?? 0),
    within10: results.filter((result) => result.absDiff <= 10).length,
    within20: results.filter((result) => result.absDiff <= 20).length,
  }
}

function renderMarkdown(results: VariantResult[]) {
  const baseline = results[0]

  return [
    '# Low-Latency Improvement Iterations',
    '',
    'This report benchmarks the recommended low-latency scoring layers one step at a time on the current `Xenova/nli-deberta-v3-xsmall` baseline.',
    '',
    'Benchmark conventions:',
    '',
    '- Main benchmark numbers are reported in raw, cross-validated calibrated, and runtime calibrated modes.',
    '- Hard-negative numbers use runtime calibration because that is the end-user display path.',
    '- Cross-validated main benchmark is the fairest top-line metric.',
    '',
    'Final decision:',
    '',
    '- keep task-type structure checks in the shipped default',
    '- keep deterministic constraint checks off by default',
    '- keep criterion normalization opt-in only',
    '',
    '## Summary Table',
    '',
    '| Step | Main CV MAE | Main CV Median | Main CV Within 10 | Main CV Within 20 | Hard-Negative MAE | Hard-Negative Median | Hard-Negative Within 10 | Hard-Negative Within 20 |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...results.map((result) => {
      const main = result.crossValidatedSummary
      const hard = result.hardNegativeSummary

      return `| ${result.variant.title} | ${main.meanAbsoluteError} | ${main.medianAbsoluteError} | ${main.within10}/100 | ${main.within20}/100 | ${hard.meanAbsoluteError} | ${hard.medianAbsoluteError} | ${hard.within10}/100 | ${hard.within20}/100 |`
    }),
    '',
    '## Step Detail',
    '',
    ...results.flatMap((result, index) => {
      const cvDelta = baseline ? round(result.crossValidatedSummary.meanAbsoluteError - baseline.crossValidatedSummary.meanAbsoluteError) : 0
      const hardDelta = baseline ? round(result.hardNegativeSummary.meanAbsoluteError - baseline.hardNegativeSummary.meanAbsoluteError) : 0

      return [
        `### ${result.variant.title}`,
        '',
        result.variant.description,
        '',
        index === 0 ? 'Baseline for comparison.' : `Delta vs baseline: main CV MAE ${cvDelta >= 0 ? '+' : ''}${cvDelta}, hard-negative MAE ${hardDelta >= 0 ? '+' : ''}${hardDelta}.`,
        '',
        '| Mode | MAE | Median | Within 10 | Within 20 |',
        '| --- | ---: | ---: | ---: | ---: |',
        `| Main raw | ${result.rawSummary.meanAbsoluteError} | ${result.rawSummary.medianAbsoluteError} | ${result.rawSummary.within10}/100 | ${result.rawSummary.within20}/100 |`,
        `| Main cross-validated | ${result.crossValidatedSummary.meanAbsoluteError} | ${result.crossValidatedSummary.medianAbsoluteError} | ${result.crossValidatedSummary.within10}/100 | ${result.crossValidatedSummary.within20}/100 |`,
        `| Main runtime | ${result.runtimeSummary.meanAbsoluteError} | ${result.runtimeSummary.medianAbsoluteError} | ${result.runtimeSummary.within10}/100 | ${result.runtimeSummary.within20}/100 |`,
        `| Hard-negative runtime | ${result.hardNegativeSummary.meanAbsoluteError} | ${result.hardNegativeSummary.medianAbsoluteError} | ${result.hardNegativeSummary.within10}/100 | ${result.hardNegativeSummary.within20}/100 |`,
        '',
      ]
    }),
  ].join('\n')
}

function weightedPercent(criteria: BenchmarkCase['criteria'], scores: number[]) {
  return round(
    criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / 100,
  )
}

function compactSummary(summary: Summary) {
  return {
    meanAbsoluteError: summary.meanAbsoluteError,
    medianAbsoluteError: summary.medianAbsoluteError,
    within10: summary.within10,
    within20: summary.within20,
  }
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

function round(value: number) {
  return Math.round(value * 10) / 10
}
