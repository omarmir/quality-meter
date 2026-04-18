import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from '@huggingface/transformers'
import { BENCHMARK_CASES, type BenchmarkCase, type BenchmarkKind, type BenchmarkProfile, type BenchmarkCriterion } from '../benchmark/cases'
import { createHardNegativeCases } from '../benchmark/hard-negatives'
import { WORDING_EXPERIMENTS, type WordingExperimentPattern } from '../benchmark/wording-variants'
import {
  applyCalibrationCurve,
  computeCalibratedOverallScore,
  createTransformersQualityScorer,
  decideQualityRefinement,
  fitIsotonicCalibration,
  resolveQualityScorerConfig,
  DEFAULT_ADAPTIVE_REFINEMENT_CONFIG,
  type CalibrationCurve,
  type QualityAdaptiveRefinementConfig,
  type QualityRefinementDecision,
  type QualityScoreResult,
  type QualityScorerConfigInput,
} from '@browser-quality-scorer/core'

type GroupSummary = {
  name: string
  count: number
  meanAbsoluteError: number
  averageReference: number
  averageApp: number
}

type CaseSummary = {
  meanAbsoluteError: number
  medianAbsoluteError: number
  within10: number
  within20: number
}

type CalibrationBundle = {
  criterion: CalibrationCurve | null
  overall: CalibrationCurve | null
}

type BaseCaseResult = {
  id: string
  kind: BenchmarkKind
  profile: BenchmarkProfile
  question: string
  answer: string
  criteria: BenchmarkCriterion[]
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

type CalibrationCaseResult = {
  id: string
  sourceId?: string
  kind: BenchmarkKind
  question: string
  answer: string
  criteria: BenchmarkCriterion[]
  answerSupport: number
  structuralScore: number
  rawScores: number[]
  referenceOverall: number
}

type Variant = {
  id: string
  title: string
  description: string
  config: QualityScorerConfigInput
}

type LowLatencyResult = {
  variant: Variant
  rawSummary: CaseSummary
  crossValidatedSummary: CaseSummary
  runtimeSummary: CaseSummary
  hardNegativeSummary: CaseSummary
}

type FixtureProfile = BenchmarkProfile | 'hard_negative'

type CaseFixture = {
  id: string
  kind: BenchmarkKind
  profile: FixtureProfile
  question: string
  answer: string
  criteria: BenchmarkCriterion[]
  referenceOverall: number
}

type EvaluatedFixture = CaseFixture & {
  fastResult: QualityScoreResult
  fullResult: QualityScoreResult
}

type AdaptiveCaseResult = CaseFixture & {
  finalOverall: number
  diff: number
  absDiff: number
  usedMode: 'fast' | 'full'
  decision: QualityRefinementDecision
}

type AdaptiveSummary = {
  label: string
  config: QualityAdaptiveRefinementConfig
  main: CaseSummary
  hardNegative: CaseSummary
  combinedSkipRate: number
  mainSkipRate: number
  hardNegativeSkipRate: number
  goodMae: number
  offTopicAverage: number
  mainByKind: GroupSummary[]
  mainByProfile: GroupSummary[]
  hardNegativeByKind: GroupSummary[]
  topRegressions: AdaptiveCaseResult[]
  metSuccessCriteria: boolean
}

type WordingVariantKey = 'baseline' | 'question_explicit' | 'criteria_explicit' | 'both_explicit'

type WordingResult = {
  caseId: string
  kind: BenchmarkKind
  profile: BenchmarkProfile
  pattern: WordingExperimentPattern
  rationale: string
  variant: WordingVariantKey
  question: string
  criteria: BenchmarkCriterion[]
  answer: string
  referenceOverall: number
  appOverall: number
  diff: number
  absDiff: number
}

type WordingVariantSummary = {
  variant: WordingVariantKey
  count: number
  meanAbsoluteError: number
  medianAbsoluteError: number
  averageImprovement: number
  improvedCases: number
  worsenedCases: number
}

type WordingPatternSummary = {
  pattern: WordingExperimentPattern
  variants: Array<{
    variant: WordingVariantKey
    count: number
    meanAbsoluteError: number
    averageImprovement: number
    improvedCases: number
    worsenedCases: number
  }>
}

type WordingCaseSummary = {
  caseId: string
  pattern: WordingExperimentPattern
  baselineAbsDiff: number
  bestVariant: WordingVariantKey
  bestAbsDiff: number
  bestImprovement: number
}

type WordingReport = {
  caseCount: number
  variantSummaries: WordingVariantSummary[]
  patternSummaries: WordingPatternSummary[]
  bestByCase: WordingCaseSummary[]
}

type ModelCandidate = {
  id: string
  label: string
  note: string
}

type ModelBakeoffResult = {
  modelId: string
  label: string
  note: string
  sizeBytes: number | null
  sizeLabel: string
  loadDurationMs: number
  mainBenchmarkDurationMs: number
  hardNegativeDurationMs: number
  totalDurationMs: number
  mainRawSummary: CaseSummary
  mainCrossValidatedSummary: CaseSummary
  mainRuntimeSummary: CaseSummary
  hardNegativeRuntimeSummary: CaseSummary
  hardNegativeCrossValidatedSummary: CaseSummary
}

type ModelBakeoffReport = {
  generatedAt: string
  elapsedMs: number
  candidates: ModelCandidate[]
  results: ModelBakeoffResult[]
  failures: Array<{ modelId: string; error: string }>
}

const REPORTS_DIR = fileURLToPath(new URL('../reports/', import.meta.url))
const DOCS_DIR = fileURLToPath(new URL('../../docs/guide/', import.meta.url))
const LOCAL_MODEL_PATH = fileURLToPath(new URL('../../library/models/', import.meta.url))
const writeMd = Bun.argv.includes('--write-md')
const docsOnly = Bun.argv.includes('--docs-only')
const useWebGpu = Bun.argv.includes('--use-webgpu')
const onlyIndex = Bun.argv.findIndex((arg) => arg === '--only')
const onlyScope = onlyIndex >= 0 ? Bun.argv[onlyIndex + 1] : null
const modelsIndex = Bun.argv.findIndex((arg) => arg === '--models')
const requestedModels = modelsIndex >= 0 ? new Set((Bun.argv[modelsIndex + 1] ?? '').split(',').filter(Boolean)) : null
const scopes = new Set(
  onlyScope
    ? [onlyScope]
    : ['low-latency', 'adaptive', 'wording', 'model-bakeoff'],
)

const lowLatencyJsonPath = fileURLToPath(new URL('../reports/low-latency-iterations.json', import.meta.url))
const adaptiveJsonPath = fileURLToPath(new URL('../reports/adaptive-refinement-results.json', import.meta.url))
const wordingJsonPath = fileURLToPath(new URL('../reports/wording-experiments.json', import.meta.url))
const modelBakeoffJsonPath = fileURLToPath(new URL('../reports/model-bakeoff.json', import.meta.url))
const modelBakeoffDocPath = fileURLToPath(new URL('../../docs/guide/model-bakeoff.md', import.meta.url))
const CACHE_ROOT = path.join(process.cwd(), '.model-bakeoff-cache')

const MODEL_CANDIDATES: ModelCandidate[] = [
  {
    id: 'Xenova/nli-deberta-v3-xsmall',
    label: 'DeBERTa v3 xsmall',
    note: 'Current recommended baseline and smallest DeBERTa-family payload in the shortlist.',
  },
  {
    id: 'Xenova/nli-deberta-v3-small',
    label: 'DeBERTa v3 small',
    note: 'Larger DeBERTa-family candidate that sometimes narrows the fair benchmark gap.',
  },
  {
    id: 'MoritzLaurer/ModernBERT-base-zeroshot-v2.0',
    label: 'ModernBERT base zeroshot',
    note: 'Interesting hard-negative candidate with a different architecture tradeoff.',
  },
  {
    id: 'Xenova/deberta-v3-base-tasksource-nli',
    label: 'DeBERTa v3 base tasksource NLI',
    note: 'Largest DeBERTa-family candidate in the shortlist.',
  },
  {
    id: 'onnx-community/distilbart-mnli-12-3-ONNX',
    label: 'DistilBART MNLI',
    note: 'Older MNLI baseline kept as a historical reference point.',
  },
  {
    id: 'onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX',
    label: 'Multilingual MiniLMv2 L6 MNLI/XNLI',
    note: 'Multilingual candidate kept in the bakeoff to measure English-regression risk.',
  },
]

const baselineConfig = resolveQualityScorerConfig({
  modelId: 'Xenova/nli-deberta-v3-xsmall',
  dtype: 'q8',
  execution: {
    device: useWebGpu ? 'webgpu' : 'cpu',
    useBatchedZeroShot: useWebGpu,
  },
  modelSource: {
    mode: 'local',
    localModelPath: LOCAL_MODEL_PATH,
    revision: 'main',
    useBrowserCache: false,
  },
})

let lowLatencyResults: LowLatencyResult[] | null = null
let adaptiveResults: { selected: AdaptiveSummary; baselineMainSummary: CaseSummary; baselineHardNegativeSummary: CaseSummary; topCandidates: AdaptiveSummary[] } | null = null
let wordingResults: WordingReport | null = null
let modelBakeoffResults: ModelBakeoffReport | null = null
const scoringImprovementRequested = scopes.has('scoring-improvement')
const shouldWriteScoringImprovement = writeMd && (onlyScope === null || onlyScope === 'all' || scoringImprovementRequested)

if (docsOnly) {
  if (scopes.has('low-latency') || shouldWriteScoringImprovement) {
    lowLatencyResults = await Bun.file(lowLatencyJsonPath).json()
  }
  if (scopes.has('adaptive') || shouldWriteScoringImprovement) {
    adaptiveResults = await Bun.file(adaptiveJsonPath).json()
  }
  if (scopes.has('wording') || shouldWriteScoringImprovement) {
    wordingResults = await Bun.file(wordingJsonPath).json()
  }
  if (scopes.has('model-bakeoff')) {
    modelBakeoffResults = await Bun.file(modelBakeoffJsonPath).json()
  }
} else {
  await mkdir(REPORTS_DIR, { recursive: true })

  if (scopes.has('low-latency')) {
    lowLatencyResults = await runLowLatencySuite()
    await Bun.write(lowLatencyJsonPath, JSON.stringify(lowLatencyResults, null, 2))
  }

  if (scopes.has('adaptive')) {
    adaptiveResults = await runAdaptiveSuite()
    await Bun.write(adaptiveJsonPath, JSON.stringify(adaptiveResults, null, 2))
  }

  if (scopes.has('wording')) {
    wordingResults = await runWordingSuite()
    await Bun.write(wordingJsonPath, JSON.stringify(wordingResults, null, 2))
  }
  if (scopes.has('model-bakeoff')) {
    modelBakeoffResults = await runModelBakeoffSuite()
    await Bun.write(modelBakeoffJsonPath, JSON.stringify(modelBakeoffResults, null, 2))
  }

  console.log(
    JSON.stringify(
      {
        ...(lowLatencyResults
          ? {
              lowLatency: lowLatencyResults.map((result) => ({
                id: result.variant.id,
                mainCrossValidated: compactSummary(result.crossValidatedSummary),
                hardNegative: compactSummary(result.hardNegativeSummary),
              })),
            }
          : {}),
        ...(adaptiveResults
          ? {
              adaptive: {
                selected: adaptiveResults.selected.label,
                combinedSkipRate: adaptiveResults.selected.combinedSkipRate,
                mainMae: adaptiveResults.selected.main.meanAbsoluteError,
                hardNegativeMae: adaptiveResults.selected.hardNegative.meanAbsoluteError,
                goodMae: adaptiveResults.selected.goodMae,
                offTopicAverage: adaptiveResults.selected.offTopicAverage,
              },
            }
          : {}),
        ...(wordingResults
          ? {
              wording: {
                caseCount: wordingResults.caseCount,
                variantSummaries: wordingResults.variantSummaries,
                topImprovements: wordingResults.bestByCase
                  .filter((item) => item.bestImprovement > 0)
                  .sort((left, right) => right.bestImprovement - left.bestImprovement)
                  .slice(0, 6),
              },
            }
          : {}),
        ...(modelBakeoffResults
          ? {
              modelBakeoff: {
                candidates: modelBakeoffResults.results.map((result) => ({
                  modelId: result.modelId,
                  size: result.sizeLabel,
                  mainCv: compactSummary(result.mainCrossValidatedSummary),
                  hardCv: compactSummary(result.hardNegativeCrossValidatedSummary),
                  loadMs: round(result.loadDurationMs),
                  totalMs: round(result.totalDurationMs),
                })),
                failures: modelBakeoffResults.failures,
              },
            }
          : {}),
      },
      null,
      2,
    ),
  )
}

if (writeMd) {
  await mkdir(DOCS_DIR, { recursive: true })

  if (adaptiveResults) {
    await Bun.write(fileURLToPath(new URL('../../docs/guide/adaptive-refinement.md', import.meta.url)), renderAdaptiveDoc(adaptiveResults))
  }
  if (lowLatencyResults) {
    await Bun.write(fileURLToPath(new URL('../../docs/guide/low-latency-improvement.md', import.meta.url)), renderLowLatencyDoc(lowLatencyResults))
  }
  if (wordingResults) {
    await Bun.write(fileURLToPath(new URL('../../docs/guide/wording-experiments.md', import.meta.url)), renderWordingDoc(wordingResults))
  }
  if (modelBakeoffResults) {
    await Bun.write(modelBakeoffDocPath, renderModelBakeoffDoc(modelBakeoffResults))
  }
  if (lowLatencyResults && adaptiveResults && wordingResults && shouldWriteScoringImprovement) {
    await Bun.write(fileURLToPath(new URL('../../docs/guide/scoring-improvement.md', import.meta.url)), renderScoringImprovementDoc(lowLatencyResults, adaptiveResults, wordingResults))
  }

  console.log('')
  console.log('Updated docs:')
  if (adaptiveResults) {
    console.log(`- ${fileURLToPath(new URL('../../docs/guide/adaptive-refinement.md', import.meta.url))}`)
  }
  if (lowLatencyResults) {
    console.log(`- ${fileURLToPath(new URL('../../docs/guide/low-latency-improvement.md', import.meta.url))}`)
  }
  if (wordingResults) {
    console.log(`- ${fileURLToPath(new URL('../../docs/guide/wording-experiments.md', import.meta.url))}`)
  }
  if (modelBakeoffResults) {
    console.log(`- ${modelBakeoffDocPath}`)
  }
  if (lowLatencyResults && adaptiveResults && wordingResults && shouldWriteScoringImprovement) {
    console.log(`- ${fileURLToPath(new URL('../../docs/guide/scoring-improvement.md', import.meta.url))}`)
  }
}

async function runLowLatencySuite() {
  const variants: Variant[] = [
    {
      id: 'baseline',
      title: 'Baseline',
      description: 'Current scorer stack with the low-latency helper layers disabled.',
      config: {
        ...baselineConfig,
        criterionCalibration: null,
        overallCalibration: null,
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
      description: 'Adds lightweight deterministic constraint checks on top of the base scorer.',
      config: {
        ...baselineConfig,
        criterionCalibration: null,
        overallCalibration: null,
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
      description: 'Adds task-aware structure checks for the structured summary benchmark.',
      config: {
        ...baselineConfig,
        criterionCalibration: null,
        overallCalibration: null,
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
      description: 'Adds criterion normalization on top of the earlier low-latency passes.',
      config: {
        ...baselineConfig,
        criterionCalibration: null,
        overallCalibration: null,
        lowLatency: {
          useDeterministicConstraintChecks: true,
          useTaskStructureChecks: true,
          useCriterionNormalization: true,
        },
      },
    },
  ]

  const results: LowLatencyResult[] = []

  for (const variant of variants) {
    console.log(`\n=== low-latency: ${variant.title} ===`)
    const scorer = createTransformersQualityScorer(variant.config)
    await scorer.loadModel()
    const mainProgress = createProgressReporter(`low-latency ${variant.id} main`, BENCHMARK_CASES.length)

    const baseResults: BaseCaseResult[] = []
    for (const [index, testCase] of BENCHMARK_CASES.entries()) {
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

      mainProgress(index + 1, testCase.id)
    }

    const hardNegativeCases = createHardNegativeCases(BENCHMARK_CASES)
    const hardNegativeProgress = createProgressReporter(`low-latency ${variant.id} hard-negative`, hardNegativeCases.length)
    const hardNegativeBaseResults: CalibrationCaseResult[] = []
    for (const [index, testCase] of hardNegativeCases.entries()) {
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

      hardNegativeProgress(index + 1, testCase.id)
    }

    const rawSummary = summarizeCases(materializeResults(baseResults, 'raw', variant.config))
    const crossValidatedSummary = summarizeCases(crossValidateCalibration(baseResults, hardNegativeBaseResults, variant.config, 5))
    const runtimeCalibration = fitCalibrationBundle(baseResults, hardNegativeBaseResults)
    const runtimeSummary = summarizeCases(materializeResults(baseResults, 'runtime', variant.config, runtimeCalibration))
    const hardNegativeSummary = summarizeCases(materializeHardNegativeResults(hardNegativeBaseResults, variant.config, runtimeCalibration))

    results.push({
      variant,
      rawSummary,
      crossValidatedSummary,
      runtimeSummary,
      hardNegativeSummary,
    })
  }

  return results
}

async function runAdaptiveSuite() {
  const scorer = createTransformersQualityScorer(baselineConfig)
  await scorer.loadModel()

  const baseFixtures: CaseFixture[] = BENCHMARK_CASES.map((testCase) => ({
    id: testCase.id,
    kind: testCase.kind,
    profile: testCase.profile,
    question: testCase.question,
    answer: testCase.answer,
    criteria: testCase.criteria,
    referenceOverall: weightedPercent(testCase.criteria, testCase.referenceScores),
  }))

  const hardNegativeFixtures: CaseFixture[] = createHardNegativeCases(BENCHMARK_CASES).map((testCase) => ({
    id: testCase.id,
    kind: testCase.kind,
    profile: 'hard_negative',
    question: testCase.question,
    answer: testCase.answer,
    criteria: testCase.criteria,
    referenceOverall: testCase.referenceOverall,
  }))

  const evaluatedBase = await evaluateFixtures(scorer, baseFixtures, 'adaptive main')
  const evaluatedHardNegative = await evaluateFixtures(scorer, hardNegativeFixtures, 'adaptive hard-negative')

  const baselineMainResults = evaluatedBase.map((fixture) =>
    toAdaptiveCaseResult(fixture, fixture.fullResult, {
      shouldRunFullPass: true,
      reason: 'always_full',
      riskBand: 'medium',
      fastOverallPercent: fixture.fastResult.overallPercent,
    }),
  )
  const baselineHardNegativeResults = evaluatedHardNegative.map((fixture) =>
    toAdaptiveCaseResult(fixture, fixture.fullResult, {
      shouldRunFullPass: true,
      reason: 'always_full',
      riskBand: 'medium',
      fastOverallPercent: fixture.fastResult.overallPercent,
    }),
  )

  const baselineMainSummary = summarizeCases(baselineMainResults)
  const baselineHardNegativeSummary = summarizeCases(baselineHardNegativeResults)
  const candidateSummaries = buildAdaptiveConfigs().map((config) =>
    summarizeAdaptiveConfig(config, evaluatedBase, evaluatedHardNegative, baselineMainSummary, baselineHardNegativeSummary),
  )

  const selected =
    chooseAdaptiveWinner(candidateSummaries) ??
    chooseLowStopOnlyWinner(candidateSummaries) ??
    summarizeAdaptiveConfig(
      DEFAULT_ADAPTIVE_REFINEMENT_CONFIG,
      evaluatedBase,
      evaluatedHardNegative,
      baselineMainSummary,
      baselineHardNegativeSummary,
    )

  return {
    selected,
    baselineMainSummary,
    baselineHardNegativeSummary,
    topCandidates: [...candidateSummaries]
      .sort((left, right) =>
        Number(right.metSuccessCriteria) - Number(left.metSuccessCriteria) ||
        right.combinedSkipRate - left.combinedSkipRate ||
        left.main.meanAbsoluteError - right.main.meanAbsoluteError ||
        left.hardNegative.meanAbsoluteError - right.hardNegative.meanAbsoluteError,
      )
      .slice(0, 20),
  }
}

async function runWordingSuite(): Promise<WordingReport> {
  const scorer = createTransformersQualityScorer(baselineConfig)
  await scorer.loadModel()

  const caseMap = new Map(BENCHMARK_CASES.map((testCase) => [testCase.id, testCase]))
  const results: WordingResult[] = []
  const totalRuns = WORDING_EXPERIMENTS.length * 4
  const reportProgress = createProgressReporter('wording experiments', totalRuns)
  let completedRuns = 0

  for (const experiment of WORDING_EXPERIMENTS) {
    const baseCase = caseMap.get(experiment.caseId)
    if (!baseCase) {
      throw new Error(`Missing benchmark case for wording experiment: ${experiment.caseId}`)
    }

    const variantInputs: Array<{ variant: WordingVariantKey; question: string; criteria: BenchmarkCriterion[] }> = [
      { variant: 'baseline', question: baseCase.question, criteria: baseCase.criteria },
      { variant: 'question_explicit', question: experiment.explicitQuestion, criteria: baseCase.criteria },
      { variant: 'criteria_explicit', question: baseCase.question, criteria: rewriteCriteria(baseCase.criteria, experiment.explicitCriteria) },
      { variant: 'both_explicit', question: experiment.explicitQuestion, criteria: rewriteCriteria(baseCase.criteria, experiment.explicitCriteria) },
    ]

    for (const variantInput of variantInputs) {
      const scoreResult = await scorer.score({
        question: variantInput.question,
        response: baseCase.answer,
        criteria: variantInput.criteria.map((criterion) => criterion.label),
      })

      const weightedOverall = computeCalibratedOverallScore(
        {
          rawOverall: weightedPercent(variantInput.criteria, scoreResult.scores) / 100,
          question: variantInput.question,
          response: baseCase.answer,
          answerSupport: scoreResult.answerSupport,
          criterionScores: scoreResult.scores,
          structuralScore: scoreResult.structuralScore,
        },
        baselineConfig,
      )

      const appOverall = round(weightedOverall.overallCalibrated * 100)
      const referenceOverall = weightedPercent(baseCase.criteria, baseCase.referenceScores)

      results.push({
        caseId: baseCase.id,
        kind: baseCase.kind,
        profile: baseCase.profile,
        pattern: experiment.pattern,
        rationale: experiment.rationale,
        variant: variantInput.variant,
        question: variantInput.question,
        criteria: variantInput.criteria,
        answer: baseCase.answer,
        referenceOverall,
        appOverall,
        diff: round(appOverall - referenceOverall),
        absDiff: round(Math.abs(appOverall - referenceOverall)),
      })

      completedRuns += 1
      reportProgress(completedRuns, `${baseCase.id} ${variantInput.variant}`)
    }
  }

  const groupedByCase = groupBy(results, (result) => result.caseId)
  const variantSummaries = summarizeWordingVariants(results, groupedByCase)
  const patternSummaries = summarizeWordingPatterns(results, groupedByCase)
  const bestByCase = Array.from(groupedByCase.values()).map((items) => summarizeWordingCase(items))

  return {
    caseCount: WORDING_EXPERIMENTS.length,
    variantSummaries,
    patternSummaries,
    bestByCase,
  }
}

async function runModelBakeoffSuite(): Promise<ModelBakeoffReport> {
  await mkdir(CACHE_ROOT, { recursive: true })

  const selectedCandidates =
    requestedModels && requestedModels.size > 0
      ? MODEL_CANDIDATES.filter(
          (candidate) =>
            requestedModels.has(candidate.id) ||
            requestedModels.has(candidate.label) ||
            requestedModels.has(slugify(candidate.id)),
        )
      : MODEL_CANDIDATES

  if (requestedModels && requestedModels.size > 0 && selectedCandidates.length === 0) {
    throw new Error(`No matching model candidates for: ${Array.from(requestedModels).join(', ')}`)
  }

  const startedAt = performance.now()
  const results: ModelBakeoffResult[] = []
  const failures: Array<{ modelId: string; error: string }> = []

  for (const candidate of selectedCandidates) {
    console.log(`\n=== ${candidate.id} ===`)

    try {
      const result = await runModelCandidate(candidate)
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
      failures.push({
        modelId: candidate.id,
        error: message,
      })
      console.error(`Bakeoff failed for ${candidate.id}: ${message}`)
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    elapsedMs: round(performance.now() - startedAt),
    candidates: selectedCandidates,
    results,
    failures,
  }
}

async function runModelCandidate(candidate: ModelCandidate): Promise<ModelBakeoffResult> {
  const startedAt = performance.now()
  const sizeBytes = await fetchModelSizeBytes(candidate.id)
  const cacheDir = path.join(CACHE_ROOT, slugify(candidate.id))

  await rm(cacheDir, { recursive: true, force: true })
  await mkdir(cacheDir, { recursive: true })

  env.useBrowserCache = false
  env.useFSCache = true
  env.cacheDir = cacheDir

  const scorerConfig = resolveQualityScorerConfig({
    modelId: candidate.id,
    dtype: 'q8',
    execution: {
      device: useWebGpu ? 'webgpu' : 'cpu',
      useBatchedZeroShot: useWebGpu,
    },
    modelSource: {
      mode: 'huggingface',
      revision: 'main',
      useBrowserCache: false,
    },
    criterionCalibration: null,
    overallCalibration: null,
  })

  const scorer = createTransformersQualityScorer(scorerConfig)
  const loadStartedAt = performance.now()
  await scorer.loadModel()
  const loadDurationMs = performance.now() - loadStartedAt

  const mainStartedAt = performance.now()
  const baseResults: BaseCaseResult[] = []
  const mainProgress = createProgressReporter(`model-bakeoff ${slugify(candidate.id)} main`, BENCHMARK_CASES.length)

  for (const [index, testCase] of BENCHMARK_CASES.entries()) {
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

    mainProgress(index + 1, testCase.id)
  }

  const mainBenchmarkDurationMs = performance.now() - mainStartedAt

  const hardStartedAt = performance.now()
  const hardNegativeCases = createHardNegativeCases(BENCHMARK_CASES)
  const hardNegativeResults: CalibrationCaseResult[] = []
  const hardNegativeProgress = createProgressReporter(`model-bakeoff ${slugify(candidate.id)} hard-negative`, hardNegativeCases.length)

  for (const [index, testCase] of hardNegativeCases.entries()) {
    const scoreResult = await scorer.score({
      question: testCase.question,
      response: testCase.answer,
      criteria: testCase.criteria.map((criterion) => criterion.label),
    })

    hardNegativeResults.push({
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

    hardNegativeProgress(index + 1, testCase.id)
  }

  const hardNegativeDurationMs = performance.now() - hardStartedAt
  const runtimeCalibration = fitCalibrationBundle(baseResults, hardNegativeResults)

  return {
    modelId: candidate.id,
    label: candidate.label,
    note: candidate.note,
    sizeBytes,
    sizeLabel: formatBytes(sizeBytes),
    loadDurationMs: round(loadDurationMs),
    mainBenchmarkDurationMs: round(mainBenchmarkDurationMs),
    hardNegativeDurationMs: round(hardNegativeDurationMs),
    totalDurationMs: round(performance.now() - startedAt),
    mainRawSummary: summarizeCases(materializeResults(baseResults, 'raw', scorerConfig)),
    mainCrossValidatedSummary: summarizeCases(crossValidateCalibration(baseResults, hardNegativeResults, scorerConfig, 5)),
    mainRuntimeSummary: summarizeCases(materializeResults(baseResults, 'runtime', scorerConfig, runtimeCalibration)),
    hardNegativeRuntimeSummary: summarizeCases(materializeHardNegativeResults(hardNegativeResults, scorerConfig, runtimeCalibration)),
    hardNegativeCrossValidatedSummary: summarizeCases(
      crossValidateHardNegativeCalibration(baseResults, hardNegativeResults, scorerConfig, 5),
    ),
  }
}

async function evaluateFixtures(scorer: ReturnType<typeof createTransformersQualityScorer>, fixtures: CaseFixture[], label: string) {
  const evaluated: EvaluatedFixture[] = []
  const reportProgress = createProgressReporter(label, fixtures.length)

  for (const [index, fixture] of fixtures.entries()) {
    const criteria = fixture.criteria.map((criterion) => criterion.label)
    const fastResult = await scorer.score(
      {
        question: fixture.question,
        response: fixture.answer,
        criteria,
      },
      { mode: 'fast' },
    )
    const fullResult = await scorer.score(
      {
        question: fixture.question,
        response: fixture.answer,
        criteria,
      },
      { mode: 'full' },
    )

    evaluated.push({
      ...fixture,
      fastResult,
      fullResult,
    })

    reportProgress(index + 1, fixture.id)
  }

  return evaluated
}

function summarizeAdaptiveConfig(
  config: QualityAdaptiveRefinementConfig,
  mainFixtures: EvaluatedFixture[],
  hardNegativeFixtures: EvaluatedFixture[],
  baselineMainSummary: CaseSummary,
  baselineHardNegativeSummary: CaseSummary,
): AdaptiveSummary {
  const mainResults = mainFixtures.map((fixture) => {
    const decision = decideQualityRefinement({
      fastResult: fixture.fastResult,
      question: fixture.question,
      response: fixture.answer,
      criteria: fixture.criteria.map((criterion) => criterion.label),
      policy: 'adaptive',
      config,
    })

    return toAdaptiveCaseResult(fixture, decision.shouldRunFullPass ? fixture.fullResult : fixture.fastResult, decision)
  })

  const hardNegativeResults = hardNegativeFixtures.map((fixture) => {
    const decision = decideQualityRefinement({
      fastResult: fixture.fastResult,
      question: fixture.question,
      response: fixture.answer,
      criteria: fixture.criteria.map((criterion) => criterion.label),
      policy: 'adaptive',
      config,
    })

    return toAdaptiveCaseResult(fixture, decision.shouldRunFullPass ? fixture.fullResult : fixture.fastResult, decision)
  })

  const mainSummary = summarizeCases(mainResults)
  const hardNegativeSummary = summarizeCases(hardNegativeResults)
  const allResults = [...mainResults, ...hardNegativeResults]
  const combinedSkipRate = round((allResults.filter((result) => result.usedMode === 'fast').length / allResults.length) * 100)
  const mainSkipRate = round((mainResults.filter((result) => result.usedMode === 'fast').length / mainResults.length) * 100)
  const hardNegativeSkipRate = round((hardNegativeResults.filter((result) => result.usedMode === 'fast').length / hardNegativeResults.length) * 100)
  const goodItems = mainResults.filter((result) => result.profile === 'good')
  const goodMae = round(goodItems.reduce((sum, item) => sum + item.absDiff, 0) / Math.max(1, goodItems.length))
  const offTopicItems = mainResults.filter((result) => result.profile === 'off_topic')
  const offTopicAverage = round(offTopicItems.reduce((sum, item) => sum + item.finalOverall, 0) / Math.max(1, offTopicItems.length))
  const topRegressions = [...mainResults]
    .map((result, index) => ({
      adaptive: result,
      baseline: mainFixtures[index]?.fullResult.overallPercent ?? result.finalOverall,
    }))
    .sort((left, right) => Math.abs(right.adaptive.finalOverall - right.baseline) - Math.abs(left.adaptive.finalOverall - left.baseline))
    .slice(0, 15)
    .map((item) => item.adaptive)

  const metSuccessCriteria =
    combinedSkipRate >= 10 &&
    mainSummary.meanAbsoluteError - baselineMainSummary.meanAbsoluteError <= 0.5 &&
    hardNegativeSummary.meanAbsoluteError - baselineHardNegativeSummary.meanAbsoluteError <= 0.75 &&
    goodMae - summarizeGoodMae(mainFixtures) <= 1 &&
    offTopicAverage <= 1

  return {
    label: describeAdaptiveConfig(config),
    config,
    main: mainSummary,
    hardNegative: hardNegativeSummary,
    combinedSkipRate,
    mainSkipRate,
    hardNegativeSkipRate,
    goodMae,
    offTopicAverage,
    mainByKind: summarizeGroups(mainResults, 'kind', (item) => item.finalOverall),
    mainByProfile: summarizeGroups(mainResults, 'profile', (item) => item.finalOverall),
    hardNegativeByKind: summarizeGroups(hardNegativeResults, 'kind', (item) => item.finalOverall),
    topRegressions,
    metSuccessCriteria,
  }
}

function chooseAdaptiveWinner(candidates: AdaptiveSummary[]) {
  return [...candidates]
    .filter((candidate) => candidate.metSuccessCriteria)
    .sort((left, right) =>
      right.combinedSkipRate - left.combinedSkipRate ||
      left.main.meanAbsoluteError - right.main.meanAbsoluteError ||
      left.hardNegative.meanAbsoluteError - right.hardNegative.meanAbsoluteError ||
      left.offTopicAverage - right.offTopicAverage,
    )[0]
}

function chooseLowStopOnlyWinner(candidates: AdaptiveSummary[]) {
  return [...candidates]
    .filter((candidate) => isLowStopOnly(candidate.config))
    .sort((left, right) => {
      const leftPenalty = left.main.meanAbsoluteError + left.hardNegative.meanAbsoluteError + Math.max(0, left.offTopicAverage - 1) * 3
      const rightPenalty = right.main.meanAbsoluteError + right.hardNegative.meanAbsoluteError + Math.max(0, right.offTopicAverage - 1) * 3
      return right.combinedSkipRate - left.combinedSkipRate || leftPenalty - rightPenalty || left.goodMae - right.goodMae
    })[0]
}

function isLowStopOnly(config: QualityAdaptiveRefinementConfig) {
  return config.highStopOverallPercent >= 100 &&
    config.highStopMinCriterionPercent >= 100 &&
    config.highStopSpreadPercent === 0 &&
    config.highStopWeakAnswerGate >= 1
}

function buildAdaptiveConfigs() {
  const lowStopOverallPercent = [10, 12, 15, 18, 20]
  const lowStopAnswerSupport = [0.2, 0.25, 0.3]
  const lowStopMaxCriterionPercent = [15, 18, 20]
  const highStopOverallPercent = [92, 94, 96]
  const highStopMinCriterionPercent = [82, 85, 88]
  const highStopSpreadPercent = [8, 10]
  const highStopWeakAnswerGate = [0.88, 0.92, 0.95]
  const configs: QualityAdaptiveRefinementConfig[] = []

  for (const lowOverall of lowStopOverallPercent) {
    for (const lowSupport of lowStopAnswerSupport) {
      for (const lowMaxCriterion of lowStopMaxCriterionPercent) {
        for (const highOverall of highStopOverallPercent) {
          for (const highMinCriterion of highStopMinCriterionPercent) {
            for (const highSpread of highStopSpreadPercent) {
              for (const highWeakAnswer of highStopWeakAnswerGate) {
                configs.push({
                  lowStopOverallPercent: lowOverall,
                  lowStopAnswerSupport: lowSupport,
                  lowStopMaxCriterionPercent: lowMaxCriterion,
                  lowStopSecondaryOverallBuffer: 5,
                  lowStopLowCriterionShare: 0.66,
                  highStopOverallPercent: highOverall,
                  highStopMinCriterionPercent: highMinCriterion,
                  highStopSpreadPercent: highSpread,
                  highStopWeakAnswerGate: highWeakAnswer,
                  disableHighStopForConstraintQuestions: true,
                  disableHighStopForTaskTypes: ['comparison', 'planning'],
                })
              }
            }
          }
        }

        configs.push({
          lowStopOverallPercent: lowOverall,
          lowStopAnswerSupport: lowSupport,
          lowStopMaxCriterionPercent: lowMaxCriterion,
          lowStopSecondaryOverallBuffer: 5,
          lowStopLowCriterionShare: 0.66,
          highStopOverallPercent: 100,
          highStopMinCriterionPercent: 100,
          highStopSpreadPercent: 0,
          highStopWeakAnswerGate: 1,
          disableHighStopForConstraintQuestions: true,
          disableHighStopForTaskTypes: ['comparison', 'planning'],
        })
      }
    }
  }

  return configs
}

function toAdaptiveCaseResult(
  fixture: CaseFixture,
  scoreResult: QualityScoreResult,
  decision: QualityRefinementDecision,
): AdaptiveCaseResult {
  const finalOverall = round(scoreResult.overallPercent)
  return {
    ...fixture,
    finalOverall,
    diff: round(finalOverall - fixture.referenceOverall),
    absDiff: round(Math.abs(finalOverall - fixture.referenceOverall)),
    usedMode: scoreResult === (fixture as EvaluatedFixture).fastResult ? 'fast' : 'full',
    decision,
  }
}

function summarizeGoodMae(fixtures: EvaluatedFixture[]) {
  const items = fixtures
    .filter((fixture) => fixture.profile === 'good')
    .map((fixture) => Math.abs(round(fixture.fullResult.overallPercent - fixture.referenceOverall)))

  return round(items.reduce((sum, item) => sum + item, 0) / Math.max(1, items.length))
}

function materializeResults(
  baseResults: BaseCaseResult[],
  scoreMode: EvaluatedCaseResult['scoreMode'],
  config: QualityScorerConfigInput,
  calibration: CalibrationBundle = { criterion: null, overall: null },
) {
  return baseResults.map((result) => {
    const appScores = calibration.criterion ? result.rawScores.map((score) => applyCalibrationCurve(score, calibration.criterion!)) : [...result.rawScores]
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
        overallCalibration: calibration.overall,
      },
    )
    const appOverall = round(overall.overallCalibrated * 100)

    return {
      ...result,
      scoreMode,
      appScores,
      appOverall,
      diff: round(appOverall - result.referenceOverall),
      absDiff: round(Math.abs(appOverall - result.referenceOverall)),
    }
  })
}

function materializeHardNegativeResults(
  hardNegativeResults: CalibrationCaseResult[],
  config: QualityScorerConfigInput,
  calibration: CalibrationBundle = { criterion: null, overall: null },
) {
  return hardNegativeResults.map((result) => {
    const appScores = calibration.criterion ? result.rawScores.map((score) => applyCalibrationCurve(score, calibration.criterion!)) : [...result.rawScores]
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
        overallCalibration: calibration.overall,
      },
    )
    const appOverall = round(overall.overallCalibrated * 100)
    return {
      ...result,
      scoreMode: 'runtime' as const,
      appScores,
      appOverall,
      diff: round(appOverall - result.referenceOverall),
      absDiff: round(Math.abs(appOverall - result.referenceOverall)),
    }
  })
}

function crossValidateCalibration(
  baseResults: BaseCaseResult[],
  hardNegativeResults: CalibrationCaseResult[],
  config: QualityScorerConfigInput,
  foldCount: number,
) {
  const baseGroups = groupIntoFolds(baseResults, foldCount)
  const hardNegativeGroups = groupIntoFolds(hardNegativeResults, foldCount)
  const evaluatedResults: EvaluatedCaseResult[] = []

  for (let foldIndex = 0; foldIndex < foldCount; foldIndex += 1) {
    const holdout = baseGroups[foldIndex] ?? []
    const trainingBase = baseGroups.flatMap((group, index) => index === foldIndex ? [] : group)
    const trainingHardNegative = hardNegativeGroups.flatMap((group, index) => index === foldIndex ? [] : group)
    const calibration = fitCalibrationBundle(trainingBase, trainingHardNegative)
    evaluatedResults.push(...materializeResults(holdout, 'cross_validated', config, calibration))
  }

  return evaluatedResults
}

function crossValidateHardNegativeCalibration(
  baseResults: BaseCaseResult[],
  hardNegativeResults: CalibrationCaseResult[],
  config: QualityScorerConfigInput,
  foldCount: number,
) {
  const baseGroups = groupIntoFolds(baseResults, foldCount)
  const hardNegativeGroups = groupIntoFolds(hardNegativeResults, foldCount)
  const evaluatedResults: ReturnType<typeof materializeHardNegativeResults> = []

  for (let foldIndex = 0; foldIndex < foldCount; foldIndex += 1) {
    const holdout = hardNegativeGroups[foldIndex] ?? []
    const trainingBase = baseGroups.flatMap((group, index) => index === foldIndex ? [] : group)
    const trainingHardNegative = hardNegativeGroups.flatMap((group, index) => index === foldIndex ? [] : group)
    const calibration = fitCalibrationBundle(trainingBase, trainingHardNegative)
    evaluatedResults.push(...materializeHardNegativeResults(holdout, config, calibration))
  }

  return evaluatedResults
}

function fitCalibrationBundle(baseResults: BaseCaseResult[], hardNegativeResults: CalibrationCaseResult[]): CalibrationBundle {
  const criterion = fitIsotonicCalibration(
    baseResults.flatMap((result) =>
      result.rawScores.map((rawScore, index) => ({
        raw: rawScore,
        target: result.referenceScores[index] ?? 0,
        weight: result.criteria[index]?.weight ?? 1,
      })),
    ),
  )

  const overall = fitIsotonicCalibration([
    ...baseResults.map((result) => ({
      raw: weightedPercent(result.criteria, criterion ? result.rawScores.map((score) => applyCalibrationCurve(score, criterion)) : result.rawScores) / 100,
      target: result.referenceOverall / 100,
      weight: 1,
    })),
    ...hardNegativeResults.map((result) => ({
      raw: weightedPercent(result.criteria, criterion ? result.rawScores.map((score) => applyCalibrationCurve(score, criterion)) : result.rawScores) / 100,
      target: result.referenceOverall / 100,
      weight: 1.2,
    })),
  ])

  return { criterion, overall }
}

function summarizeCases<T extends { absDiff: number }>(results: T[]): CaseSummary {
  const diffs = [...results.map((result) => result.absDiff)].sort((left, right) => left - right)
  return {
    meanAbsoluteError: round(diffs.reduce((sum, value) => sum + value, 0) / Math.max(1, diffs.length)),
    medianAbsoluteError: round(diffs[Math.floor(diffs.length / 2)] ?? 0),
    within10: results.filter((result) => result.absDiff <= 10).length,
    within20: results.filter((result) => result.absDiff <= 20).length,
  }
}

function summarizeGroups<T extends { absDiff: number; referenceOverall: number; kind?: string; profile?: string }>(
  results: T[],
  key: 'kind' | 'profile',
  getApp: (item: T) => number,
): GroupSummary[] {
  const names = Array.from(new Set(results.map((result) => String(result[key] ?? 'unknown'))))
  return names.map((name) => {
    const items = results.filter((result) => String(result[key] ?? 'unknown') === name)
    return {
      name,
      count: items.length,
      meanAbsoluteError: round(items.reduce((sum, item) => sum + item.absDiff, 0) / Math.max(1, items.length)),
      averageReference: round(items.reduce((sum, item) => sum + item.referenceOverall, 0) / Math.max(1, items.length)),
      averageApp: round(items.reduce((sum, item) => sum + getApp(item), 0) / Math.max(1, items.length)),
    }
  })
}

function summarizeWordingVariants(results: WordingResult[], groupedByCase: Map<string, WordingResult[]>) {
  return (['baseline', 'question_explicit', 'criteria_explicit', 'both_explicit'] as WordingVariantKey[]).map((variant) => {
    const items = results.filter((result) => result.variant === variant)
    const absDiffs = items.map((item) => item.absDiff).sort((left, right) => left - right)
    const improvements = items.map((item) => baselineFor(groupedByCase, item.caseId).absDiff - item.absDiff)
    return {
      variant,
      count: items.length,
      meanAbsoluteError: round(mean(absDiffs)),
      medianAbsoluteError: round(median(absDiffs)),
      averageImprovement: round(mean(improvements)),
      improvedCases: improvements.filter((value) => value > 0.1).length,
      worsenedCases: improvements.filter((value) => value < -0.1).length,
    }
  })
}

function summarizeWordingPatterns(results: WordingResult[], groupedByCase: Map<string, WordingResult[]>) {
  const patterns = Array.from(new Set(results.map((result) => result.pattern)))
  return patterns.map((pattern) => ({
    pattern,
    variants: (['baseline', 'question_explicit', 'criteria_explicit', 'both_explicit'] as WordingVariantKey[]).map((variant) => {
      const items = results.filter((result) => result.pattern === pattern && result.variant === variant)
      const improvements = items.map((item) => baselineFor(groupedByCase, item.caseId).absDiff - item.absDiff)
      return {
        variant,
        count: items.length,
        meanAbsoluteError: round(mean(items.map((item) => item.absDiff))),
        averageImprovement: round(mean(improvements)),
        improvedCases: improvements.filter((value) => value > 0.1).length,
        worsenedCases: improvements.filter((value) => value < -0.1).length,
      }
    }),
  }))
}

function summarizeWordingCase(results: WordingResult[]): WordingCaseSummary {
  const baseline = results.find((result) => result.variant === 'baseline')
  if (!baseline) {
    throw new Error(`Missing wording baseline for case ${results[0]?.caseId ?? 'unknown'}`)
  }
  const best = results
    .filter((result) => result.variant !== 'baseline')
    .sort((left, right) => left.absDiff - right.absDiff)[0]

  return {
    caseId: baseline.caseId,
    pattern: baseline.pattern,
    baselineAbsDiff: baseline.absDiff,
    bestVariant: best?.variant ?? 'baseline',
    bestAbsDiff: best?.absDiff ?? baseline.absDiff,
    bestImprovement: round(baseline.absDiff - (best?.absDiff ?? baseline.absDiff)),
  }
}

function baselineFor(groupedByCase: Map<string, WordingResult[]>, caseId: string) {
  const baseline = groupedByCase.get(caseId)?.find((result) => result.variant === 'baseline')
  if (!baseline) {
    throw new Error(`Missing baseline wording result for ${caseId}`)
  }
  return baseline
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

function rewriteCriteria(baseCriteria: BenchmarkCriterion[], labels: string[]) {
  return baseCriteria.map((criterion, index) => ({
    label: labels[index] ?? criterion.label,
    weight: criterion.weight,
  }))
}

function weightedPercent(criteria: BenchmarkCase['criteria'], scores: number[]) {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
  if (totalWeight <= 0) {
    return 0
  }
  return round(criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / totalWeight)
}

function compactSummary(summary: CaseSummary) {
  return {
    meanAbsoluteError: summary.meanAbsoluteError,
    medianAbsoluteError: summary.medianAbsoluteError,
    within10: summary.within10,
    within20: summary.within20,
  }
}

function describeAdaptiveConfig(config: QualityAdaptiveRefinementConfig) {
  const highStop =
    config.highStopOverallPercent >= 100
      ? 'low-stop only'
      : `high ${config.highStopOverallPercent}/${config.highStopMinCriterionPercent}/${config.highStopSpreadPercent}/${config.highStopWeakAnswerGate}`
  return `low ${config.lowStopOverallPercent}/${config.lowStopAnswerSupport}/${config.lowStopMaxCriterionPercent}, ${highStop}`
}

function selectLowLatencyWinner(results: LowLatencyResult[]) {
  const baseline = results.find((result) => result.variant.id === 'baseline') ?? results[0]
  return [...results]
    .sort((left, right) => {
      const leftEligible = left.crossValidatedSummary.meanAbsoluteError <= baseline.crossValidatedSummary.meanAbsoluteError + 0.5 ? 1 : 0
      const rightEligible = right.crossValidatedSummary.meanAbsoluteError <= baseline.crossValidatedSummary.meanAbsoluteError + 0.5 ? 1 : 0
      return (
        rightEligible - leftEligible ||
        left.hardNegativeSummary.meanAbsoluteError - right.hardNegativeSummary.meanAbsoluteError ||
        left.crossValidatedSummary.meanAbsoluteError - right.crossValidatedSummary.meanAbsoluteError
      )
    })[0]
}

function bestWordingVariant(report: WordingReport) {
  return [...report.variantSummaries]
    .filter((item) => item.variant !== 'baseline')
    .sort((left, right) => right.averageImprovement - left.averageImprovement)[0]
}

function renderAdaptiveDoc(input: { selected: AdaptiveSummary; baselineMainSummary: CaseSummary; baselineHardNegativeSummary: CaseSummary; topCandidates: AdaptiveSummary[] }) {
  const selected = input.selected
  return [
    '# Adaptive Refinement',
    '',
    'This page is generated by `bun tools/scripts/update-evolution-reports.ts --write-md` from the current 300-case benchmark and its matching hard-negative set.',
    '',
    '## Goal',
    '',
    'The goal is to reduce latency without damaging score quality.',
    '',
    '## Current Outcome',
    '',
    `- Selected policy: \`${selected.label}\``,
    `- Combined full-pass skip rate: \`${selected.combinedSkipRate}%\``,
    `- Main benchmark MAE: \`${selected.main.meanAbsoluteError}\``,
    `- Hard-negative MAE: \`${selected.hardNegative.meanAbsoluteError}\``,
    `- Good-profile MAE: \`${selected.goodMae}\``,
    `- Off-topic average score: \`${selected.offTopicAverage}\``,
    '',
    '## Selected Policy Metrics',
    '',
    '| Metric | Value |',
    '| --- | ---: |',
    `| Combined full-pass skip rate | ${selected.combinedSkipRate}% |`,
    `| Main benchmark skip rate | ${selected.mainSkipRate}% |`,
    `| Hard-negative skip rate | ${selected.hardNegativeSkipRate}% |`,
    `| Main benchmark MAE | ${selected.main.meanAbsoluteError} |`,
    `| Hard-negative MAE | ${selected.hardNegative.meanAbsoluteError} |`,
    `| Good-profile MAE | ${selected.goodMae} |`,
    `| Off-topic average score | ${selected.offTopicAverage} |`,
    '',
    '## Main Benchmark By Domain',
    '',
    '| Domain | Count | MAE | Reference Avg | App Avg |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...selected.mainByKind.map((group) => `| ${toTitle(group.name)} | ${group.count} | ${group.meanAbsoluteError} | ${group.averageReference} | ${group.averageApp} |`),
    '',
    '## Main Benchmark By Profile',
    '',
    '| Profile | Count | MAE | Reference Avg | App Avg |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...selected.mainByProfile.map((group) => `| ${toTitle(group.name)} | ${group.count} | ${group.meanAbsoluteError} | ${group.averageReference} | ${group.averageApp} |`),
    '',
    '## Hard-Negative By Domain',
    '',
    '| Domain | Count | MAE | Reference Avg | App Avg |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...selected.hardNegativeByKind.map((group) => `| ${toTitle(group.name)} | ${group.count} | ${group.meanAbsoluteError} | ${group.averageReference} | ${group.averageApp} |`),
    '',
    '## Candidate Policies',
    '',
    '| Policy | Combined Skip Rate | Main MAE | Hard-Negative MAE | Good MAE | Off-Topic Avg | Selected |',
    '| --- | ---: | ---: | ---: | ---: | ---: | --- |',
    ...input.topCandidates.map(
      (candidate) =>
        `| \`${candidate.label}\` | ${candidate.combinedSkipRate}% | ${candidate.main.meanAbsoluteError} | ${candidate.hardNegative.meanAbsoluteError} | ${candidate.goodMae} | ${candidate.offTopicAverage} | ${candidate.label === selected.label ? 'yes' : ''} |`,
    ),
    '',
    '## How To Read This Page',
    '',
    '- Higher skip rates mean more fast-pass cases and lower expected latency.',
    '- Main and hard-negative MAE should be compared together before treating a policy as viable.',
    '- `Good MAE` and `Off-Topic Avg` show whether the policy harms strong answers or leaks score into obvious failures.',
    '',
  ].join('\n')
}

function renderLowLatencyDoc(results: LowLatencyResult[]) {
  const winner = selectLowLatencyWinner(results)
  return [
    '# Low-Latency Improvement',
    '',
    'This page is generated by `bun tools/scripts/update-evolution-reports.ts --write-md` from the current 300-case benchmark and hard-negative benchmark.',
    '',
    '## Current Best Result',
    '',
    `- Selected default tradeoff: \`${winner.variant.title}\``,
    `- Main cross-validated MAE: \`${winner.crossValidatedSummary.meanAbsoluteError}\``,
    `- Hard-negative MAE: \`${winner.hardNegativeSummary.meanAbsoluteError}\``,
    '',
    '## Summary Table',
    '',
    '| Step | Main CV MAE | Main CV Median | Main CV Within 10 | Main CV Within 20 | Hard-Negative MAE |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
    ...results.map((result) => `| ${result.variant.title} | ${result.crossValidatedSummary.meanAbsoluteError} | ${result.crossValidatedSummary.medianAbsoluteError} | ${result.crossValidatedSummary.within10}/${BENCHMARK_CASES.length} | ${result.crossValidatedSummary.within20}/${BENCHMARK_CASES.length} | ${result.hardNegativeSummary.meanAbsoluteError} |`),
    '',
    '## Step By Step',
    '',
    ...results.flatMap((result) => [
      `### ${result.variant.title}`,
      '',
      result.variant.description,
      '',
      `- Main cross-validated MAE: \`${result.crossValidatedSummary.meanAbsoluteError}\``,
      `- Hard-negative MAE: \`${result.hardNegativeSummary.meanAbsoluteError}\``,
      '',
    ]),
    '## How To Read This Page',
    '',
    '- The main table is for side-by-side comparison of each low-latency variant on the same current corpus.',
    '- Lower hard-negative MAE is only useful when the main cross-validated MAE stays competitive.',
    '- The selected default tradeoff is the current best benchmark result, not a permanent narrative recommendation.',
    '',
  ].join('\n')
}

function renderWordingDoc(report: WordingReport) {
  return [
    '# Wording Experiments',
    '',
    'This page is generated by `bun tools/scripts/update-evolution-reports.ts --write-md` from a targeted wording set built on current-corpus misses.',
    '',
    '## Question',
    '',
    'Can score quality improve on current 300-case misses without changing the model, just by rewriting the question or rubric wording?',
    '',
    '## Aggregate Result',
    '',
    '| Variant | Cases | MAE | Median | Avg Improvement vs Baseline | Improved Cases | Worsened Cases |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...report.variantSummaries.map((item) => `| ${toTitle(item.variant)} | ${item.count} | ${item.meanAbsoluteError} | ${item.medianAbsoluteError} | ${item.averageImprovement} | ${item.improvedCases} | ${item.worsenedCases} |`),
    '',
    '## By Pattern',
    '',
    '| Pattern | Best Variant | Key Result |',
    '| --- | --- | --- |',
    ...report.patternSummaries.map((pattern) => {
      const best = [...pattern.variants].sort((left, right) => right.averageImprovement - left.averageImprovement)[0]
      return `| ${toTitle(pattern.pattern)} | ${toTitle(best?.variant ?? 'baseline')} | MAE ${best?.meanAbsoluteError ?? 'n/a'}, avg improvement ${best?.averageImprovement ?? 'n/a'} |`
    }),
    '',
    '## Best Variant By Case',
    '',
    '| Case | Pattern | Best Variant | Baseline Abs Diff | Best Abs Diff | Improvement |',
    '| --- | --- | --- | ---: | ---: | ---: |',
    ...report.bestByCase
      .sort((left, right) => right.bestImprovement - left.bestImprovement)
      .slice(0, 12)
      .map((item) => `| \`${item.caseId}\` | ${toTitle(item.pattern)} | ${toTitle(item.bestVariant)} | ${item.baselineAbsDiff} | ${item.bestAbsDiff} | ${item.bestImprovement} |`),
    '',
    '## How To Use These Results',
    '',
    '- Positive improvement means the rewritten wording reduced absolute error relative to the baseline wording for that case.',
    '- The aggregate table shows whether a variant helps broadly or only on a narrow subset.',
    '- Use this page as a diagnostic benchmark, not as a generated interpretation of why a variant won.',
    '',
  ].join('\n')
}

function renderScoringImprovementDoc(lowLatencyResults: LowLatencyResult[], adaptiveResults: { selected: AdaptiveSummary }, wordingReport: WordingReport) {
  const lowLatencyWinner = selectLowLatencyWinner(lowLatencyResults)
  const wordingWinner = bestWordingVariant(wordingReport)
  return [
    '# Scoring Improvement',
    '',
    'This page is generated by `bun tools/scripts/update-evolution-reports.ts --write-md` and provides a stable summary table across the current improvement experiments.',
    '',
    '## Experiments Included',
    '',
    '- low-latency helper passes on the current 300-case corpus',
    '- adaptive refinement on fast-versus-full scoring',
    '- targeted wording experiments on current-corpus misses',
    '',
    '## Current Summary',
    '',
    '| Experiment | Current Best Result | Main Metric | Secondary Metric |',
    '| --- | --- | ---: | ---: |',
    `| Low-Latency | \`${lowLatencyWinner.variant.title}\` | ${lowLatencyWinner.crossValidatedSummary.meanAbsoluteError} main CV MAE | ${lowLatencyWinner.hardNegativeSummary.meanAbsoluteError} hard-negative MAE |`,
    `| Adaptive Refinement | \`${adaptiveResults.selected.label}\` | ${adaptiveResults.selected.combinedSkipRate}% skip rate | ${adaptiveResults.selected.main.meanAbsoluteError} main MAE |`,
    wordingWinner
      ? `| Wording Experiments | \`${wordingWinner.variant}\` | ${wordingWinner.averageImprovement} avg improvement | ${wordingWinner.meanAbsoluteError} MAE |`
      : '| Wording Experiments | n/a | n/a | n/a |',
    '',
    '## Linked Pages',
    '',
    '- [Adaptive Refinement](/guide/adaptive-refinement)',
    '- [Low-Latency Improvement](/guide/low-latency-improvement)',
    '- [Wording Experiments](/guide/wording-experiments)',
    '- [Model Bakeoff](/guide/model-bakeoff)',
    '',
  ].join('\n')
}

function renderModelBakeoffDoc(report: ModelBakeoffReport) {
  const sortedByMain = [...report.results].sort((left, right) => left.mainCrossValidatedSummary.meanAbsoluteError - right.mainCrossValidatedSummary.meanAbsoluteError)
  const sortedByHard = [...report.results].sort((left, right) => left.hardNegativeCrossValidatedSummary.meanAbsoluteError - right.hardNegativeCrossValidatedSummary.meanAbsoluteError)
  const bestMain = sortedByMain[0]
  const bestHard = sortedByHard[0]
  const smallest = [...report.results].sort((left, right) => (left.sizeBytes ?? Number.POSITIVE_INFINITY) - (right.sizeBytes ?? Number.POSITIVE_INFINITY))[0]

  return [
    '# Model Bakeoff',
    '',
    'This page is generated by `bun tools/scripts/update-evolution-reports.ts --only model-bakeoff --write-md` against the current 300-case corpus and its matching hard-negative set.',
    '',
    '## At A Glance',
    '',
    bestMain ? `- Best main benchmark: \`${bestMain.modelId}\` (CV MAE \`${bestMain.mainCrossValidatedSummary.meanAbsoluteError}\`)` : '- Best main benchmark: n/a',
    bestHard ? `- Best hard-negative benchmark: \`${bestHard.modelId}\` (CV MAE \`${bestHard.hardNegativeCrossValidatedSummary.meanAbsoluteError}\`)` : '- Best hard-negative benchmark: n/a',
    smallest ? `- Smallest payload: \`${smallest.modelId}\` (${smallest.sizeLabel})` : '- Smallest payload: n/a',
    '',
    '## Cross-Validated Comparison',
    '',
    '| Model | q8 Size | Main MAE | Main Median | Hard MAE | Hard Median | Load Time | Total Time |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...sortedByMain.map((result) => `| ${result.modelId} | ${result.sizeLabel} | ${result.mainCrossValidatedSummary.meanAbsoluteError} | ${result.mainCrossValidatedSummary.medianAbsoluteError} | ${result.hardNegativeCrossValidatedSummary.meanAbsoluteError} | ${result.hardNegativeCrossValidatedSummary.medianAbsoluteError} | ${formatDuration(result.loadDurationMs)} | ${formatDuration(result.totalDurationMs)} |`),
    '',
    '## Candidate Notes',
    '',
    ...sortedByMain.flatMap((result) => [
      `### ${result.modelId}`,
      '',
      `- ${result.note}`,
      `- q8 payload: ${result.sizeLabel}`,
      `- Load time: ${formatDuration(result.loadDurationMs)}`,
      `- Main CV MAE: ${result.mainCrossValidatedSummary.meanAbsoluteError}`,
      `- Hard-negative CV MAE: ${result.hardNegativeCrossValidatedSummary.meanAbsoluteError}`,
      '',
    ]),
    '## How To Read This Page',
    '',
    '- Main cross-validated MAE is the primary fairness metric for corpus fit.',
    '- Hard-negative cross-validated MAE shows resistance to topical over-scoring.',
    '- Payload size, load time, and total time matter because these candidates are intended for local CLI and local-runtime scoring.',
    '',
    ...(report.failures.length > 0
      ? [
          '## Failures',
          '',
          ...report.failures.map((failure) => `- ${failure.modelId}: ${failure.error}`),
          '',
        ]
      : []),
  ].join('\n')
}

function mean(values: number[]) {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length
}

function median(values: number[]) {
  if (values.length === 0) {
    return 0
  }
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.floor(sorted.length / 2)] ?? 0
}

function round(value: number) {
  return Math.round(value * 10) / 10
}

function toTitle(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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

  const mb = value / (1024 * 1024)
  return `${round(mb)} MB`
}

function formatDuration(valueMs: number) {
  if (valueMs >= 60_000) {
    const minutes = Math.floor(valueMs / 60_000)
    const seconds = (valueMs % 60_000) / 1000
    return `${minutes}m ${round(seconds)}s`
  }

  return `${round(valueMs / 1000)}s`
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
