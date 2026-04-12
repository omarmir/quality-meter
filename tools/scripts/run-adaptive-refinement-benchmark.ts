import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BENCHMARK_CASES, type BenchmarkCase, type BenchmarkKind, type BenchmarkProfile } from '../benchmark/cases'
import { createHardNegativeCases } from '../benchmark/hard-negatives'
import {
  DEFAULT_ADAPTIVE_REFINEMENT_CONFIG,
  createTransformersQualityScorer,
  decideQualityRefinement,
  resolveQualityScorerConfig,
  type QualityAdaptiveRefinementConfig,
  type QualityRefinementDecision,
  type QualityScoreResult,
} from '@browser-quality-scorer/core'

type CaseFixture = {
  id: string
  kind: BenchmarkKind
  profile: BenchmarkProfile
  question: string
  answer: string
  criteria: BenchmarkCase['criteria']
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

type CaseSummary = {
  meanAbsoluteError: number
  medianAbsoluteError: number
  within10: number
  within20: number
}

type GroupSummary = {
  name: string
  count: number
  meanAbsoluteError: number
  averageReference: number
  averageApp: number
}

type AdaptiveSummary = {
  label: string
  config: QualityAdaptiveRefinementConfig
  main: CaseSummary
  hardNegative: CaseSummary
  combinedSkipRate: number
  mainSkipRate: number
  hardNegativeSkipRate: number
  strongMae: number
  offTopicAverage: number
  mainByKind: GroupSummary[]
  mainByProfile: GroupSummary[]
  hardNegativeByKind: GroupSummary[]
  topRegressions: AdaptiveCaseResult[]
  metSuccessCriteria: boolean
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

const baseFixtures = BENCHMARK_CASES.map((testCase) => ({
  id: testCase.id,
  kind: testCase.kind,
  profile: testCase.profile,
  question: testCase.question,
  answer: testCase.answer,
  criteria: testCase.criteria,
  referenceOverall: weightedPercent(testCase.criteria, testCase.referenceScores),
})) satisfies CaseFixture[]

const hardNegativeFixtures = createHardNegativeCases(BENCHMARK_CASES).map((testCase) => ({
  id: testCase.id,
  kind: testCase.kind,
  profile: 'constraint_miss',
  question: testCase.question,
  answer: testCase.answer,
  criteria: testCase.criteria,
  referenceOverall: testCase.referenceOverall,
})) satisfies CaseFixture[]

const evaluatedBase = await evaluateFixtures(baseFixtures)
const evaluatedHardNegative = await evaluateFixtures(hardNegativeFixtures)

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
const thresholdCandidates = buildAdaptiveConfigs()
const candidateSummaries = thresholdCandidates.map((config) =>
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

await mkdir(REPORTS_DIR, { recursive: true })
await Bun.write(
  fileURLToPath(new URL('../reports/adaptive-refinement-report.md', import.meta.url)),
  renderMarkdown({
    selected,
    baselineMainSummary,
    baselineHardNegativeSummary,
    candidateSummaries,
  }),
)
await Bun.write(
  fileURLToPath(new URL('../reports/adaptive-refinement-results.json', import.meta.url)),
  JSON.stringify(
    {
      selected,
      baselineMainSummary,
      baselineHardNegativeSummary,
      topCandidates: [...candidateSummaries]
        .sort((left, right) => {
          return (
            Number(right.metSuccessCriteria) - Number(left.metSuccessCriteria) ||
            right.combinedSkipRate - left.combinedSkipRate ||
            left.main.meanAbsoluteError - right.main.meanAbsoluteError ||
            left.hardNegative.meanAbsoluteError - right.hardNegative.meanAbsoluteError
          )
        })
        .slice(0, 25)
        .map((candidate) => ({
          label: candidate.label,
          config: candidate.config,
          main: candidate.main,
          hardNegative: candidate.hardNegative,
          combinedSkipRate: candidate.combinedSkipRate,
          mainSkipRate: candidate.mainSkipRate,
          hardNegativeSkipRate: candidate.hardNegativeSkipRate,
          strongMae: candidate.strongMae,
          offTopicAverage: candidate.offTopicAverage,
          metSuccessCriteria: candidate.metSuccessCriteria,
        })),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      selected: {
        config: selected.config,
        combinedSkipRate: selected.combinedSkipRate,
        mainMae: selected.main.meanAbsoluteError,
        hardNegativeMae: selected.hardNegative.meanAbsoluteError,
        strongMae: selected.strongMae,
        offTopicAverage: selected.offTopicAverage,
        metSuccessCriteria: selected.metSuccessCriteria,
      },
    },
    null,
    2,
  ),
)

async function evaluateFixtures(fixtures: CaseFixture[]) {
  const evaluated: EvaluatedFixture[] = []

  for (const fixture of fixtures) {
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

    return toAdaptiveCaseResult(
      fixture,
      decision.shouldRunFullPass ? fixture.fullResult : fixture.fastResult,
      decision,
    )
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

    return toAdaptiveCaseResult(
      fixture,
      decision.shouldRunFullPass ? fixture.fullResult : fixture.fastResult,
      decision,
    )
  })

  const mainSummary = summarizeCases(mainResults)
  const hardNegativeSummary = summarizeCases(hardNegativeResults)
  const allResults = [...mainResults, ...hardNegativeResults]
  const combinedSkipRate = round((allResults.filter((result) => result.usedMode === 'fast').length / allResults.length) * 100)
  const mainSkipRate = round((mainResults.filter((result) => result.usedMode === 'fast').length / mainResults.length) * 100)
  const hardNegativeSkipRate = round(
    (hardNegativeResults.filter((result) => result.usedMode === 'fast').length / hardNegativeResults.length) * 100,
  )
  const strongItems = mainResults.filter((result) => result.profile === 'strong')
  const strongMae = round(strongItems.reduce((sum, item) => sum + item.absDiff, 0) / Math.max(1, strongItems.length))
  const offTopicItems = mainResults.filter((result) => result.profile === 'off_topic')
  const offTopicAverage = round(offTopicItems.reduce((sum, item) => sum + item.finalOverall, 0) / Math.max(1, offTopicItems.length))
  const topRegressions = [...mainResults]
    .map((result, index) => ({
      adaptive: result,
      baseline: mainFixtures[index]?.fullResult.overallPercent ?? result.finalOverall,
      baselineDiff: result.finalOverall - (mainFixtures[index]?.fullResult.overallPercent ?? result.finalOverall),
    }))
    .sort((left, right) => Math.abs(right.baselineDiff) - Math.abs(left.baselineDiff))
    .slice(0, 15)
    .map((item) => item.adaptive)

  const metSuccessCriteria =
    combinedSkipRate >= 25 &&
    mainSummary.meanAbsoluteError - baselineMainSummary.meanAbsoluteError <= 0.35 &&
    hardNegativeSummary.meanAbsoluteError - baselineHardNegativeSummary.meanAbsoluteError <= 0.5 &&
    strongMae - summarizeStrongMae(mainFixtures) <= 0.75 &&
    offTopicAverage <= 1

  return {
    label: describeConfig(config),
    config,
    main: mainSummary,
    hardNegative: hardNegativeSummary,
    combinedSkipRate,
    mainSkipRate,
    hardNegativeSkipRate,
    strongMae,
    offTopicAverage,
    mainByKind: summarizeBy(mainResults, 'kind'),
    mainByProfile: summarizeBy(mainResults, 'profile'),
    hardNegativeByKind: summarizeBy(hardNegativeResults, 'kind'),
    topRegressions,
    metSuccessCriteria,
  }
}

function chooseAdaptiveWinner(candidates: AdaptiveSummary[]) {
  return [...candidates]
    .filter((candidate) => candidate.metSuccessCriteria)
    .sort((left, right) => {
      return (
        right.combinedSkipRate - left.combinedSkipRate ||
        left.main.meanAbsoluteError - right.main.meanAbsoluteError ||
        left.hardNegative.meanAbsoluteError - right.hardNegative.meanAbsoluteError ||
        left.offTopicAverage - right.offTopicAverage
      )
    })[0]
}

function chooseLowStopOnlyWinner(candidates: AdaptiveSummary[]) {
  return [...candidates]
    .filter((candidate) => isLowStopOnly(candidate.config))
    .sort((left, right) => {
      const leftPenalty =
        left.main.meanAbsoluteError + left.hardNegative.meanAbsoluteError + Math.max(0, left.offTopicAverage - 1) * 3
      const rightPenalty =
        right.main.meanAbsoluteError + right.hardNegative.meanAbsoluteError + Math.max(0, right.offTopicAverage - 1) * 3

      return (
        right.combinedSkipRate - left.combinedSkipRate ||
        leftPenalty - rightPenalty ||
        left.strongMae - right.strongMae
      )
    })[0]
}

function isLowStopOnly(config: QualityAdaptiveRefinementConfig) {
  return (
    config.highStopOverallPercent >= 100 &&
    config.highStopMinCriterionPercent >= 100 &&
    config.highStopSpreadPercent === 0 &&
    config.highStopWeakAnswerGate >= 1
  )
}

function buildAdaptiveConfigs() {
  const lowStopOverallPercent = [10, 12, 15, 18, 20]
  const lowStopAnswerSupport = [0.2, 0.25, 0.3, 0.35]
  const lowStopMaxCriterionPercent = [15, 18, 20, 25]
  const highStopOverallPercent = [92, 94, 96]
  const highStopMinCriterionPercent = [82, 85, 88]
  const highStopSpreadPercent = [8, 10, 12]
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
  const diff = round(finalOverall - fixture.referenceOverall)

  return {
    ...fixture,
    finalOverall,
    diff,
    absDiff: Math.abs(diff),
    usedMode: scoreResult === (fixture as EvaluatedFixture).fastResult ? 'fast' : 'full',
    decision,
  }
}

function summarizeCases(results: AdaptiveCaseResult[]): CaseSummary {
  const diffs = [...results.map((result) => result.absDiff)].sort((left, right) => left - right)
  return {
    meanAbsoluteError: round(diffs.reduce((sum, value) => sum + value, 0) / Math.max(1, diffs.length)),
    medianAbsoluteError: round(diffs[Math.floor(diffs.length / 2)] ?? 0),
    within10: results.filter((result) => result.absDiff <= 10).length,
    within20: results.filter((result) => result.absDiff <= 20).length,
  }
}

function summarizeBy(
  results: AdaptiveCaseResult[],
  key: 'kind' | 'profile',
): GroupSummary[] {
  const names = Array.from(new Set(results.map((result) => result[key])))

  return names.map((name) => {
    const items = results.filter((result) => result[key] === name)
    return {
      name,
      count: items.length,
      meanAbsoluteError: round(items.reduce((sum, item) => sum + item.absDiff, 0) / Math.max(1, items.length)),
      averageReference: round(items.reduce((sum, item) => sum + item.referenceOverall, 0) / Math.max(1, items.length)),
      averageApp: round(items.reduce((sum, item) => sum + item.finalOverall, 0) / Math.max(1, items.length)),
    }
  })
}

function summarizeStrongMae(fixtures: EvaluatedFixture[]) {
  const items = fixtures
    .filter((fixture) => fixture.profile === 'strong')
    .map((fixture) => Math.abs(round(fixture.fullResult.overallPercent - fixture.referenceOverall)))

  return round(items.reduce((sum, item) => sum + item, 0) / Math.max(1, items.length))
}

function weightedPercent(criteria: BenchmarkCase['criteria'], scores: number[]) {
  return round(
    criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / 100,
  )
}

function describeConfig(config: QualityAdaptiveRefinementConfig) {
  const highStop =
    config.highStopOverallPercent >= 100
      ? 'low-stop only'
      : `high ${config.highStopOverallPercent}/${config.highStopMinCriterionPercent}/${config.highStopSpreadPercent}/${config.highStopWeakAnswerGate}`

  return `low ${config.lowStopOverallPercent}/${config.lowStopAnswerSupport}/${config.lowStopMaxCriterionPercent}, ${highStop}`
}

function renderMarkdown(input: {
  selected: AdaptiveSummary
  baselineMainSummary: CaseSummary
  baselineHardNegativeSummary: CaseSummary
  candidateSummaries: AdaptiveSummary[]
}) {
  const selected = input.selected
  const topCandidates = [...input.candidateSummaries]
    .sort((left, right) => {
      return (
        Number(right.metSuccessCriteria) - Number(left.metSuccessCriteria) ||
        right.combinedSkipRate - left.combinedSkipRate ||
        left.main.meanAbsoluteError - right.main.meanAbsoluteError ||
        left.hardNegative.meanAbsoluteError - right.hardNegative.meanAbsoluteError
      )
    })
    .slice(0, 10)

  return [
    '# Adaptive Refinement Report',
    '',
    'This report evaluates whether the app should skip the expensive full pass after a fast pass when the fast result already looks decisive.',
    '',
    '## Baseline Always-Full Runtime',
    '',
    `- Main benchmark MAE: ${input.baselineMainSummary.meanAbsoluteError}`,
    `- Hard-negative MAE: ${input.baselineHardNegativeSummary.meanAbsoluteError}`,
    '',
    '## Selected Adaptive Policy',
    '',
    `- Label: ${selected.label}`,
    `- Combined full-pass skip rate: ${selected.combinedSkipRate}%`,
    `- Main skip rate: ${selected.mainSkipRate}%`,
    `- Hard-negative skip rate: ${selected.hardNegativeSkipRate}%`,
    `- Main benchmark MAE: ${selected.main.meanAbsoluteError}`,
    `- Hard-negative MAE: ${selected.hardNegative.meanAbsoluteError}`,
    `- Strong-profile MAE: ${selected.strongMae}`,
    `- Off-topic average score: ${selected.offTopicAverage}`,
    `- Met success criteria: ${selected.metSuccessCriteria ? 'yes' : 'no'}`,
    '',
    '### Config',
    '',
    '```json',
    JSON.stringify(selected.config, null, 2),
    '```',
    '',
    '## Main Benchmark by Kind',
    '',
    ...selected.mainByKind.map(
      (group) =>
        `- ${group.name}: count ${group.count}, MAE ${group.meanAbsoluteError}, reference avg ${group.averageReference}, app avg ${group.averageApp}`,
    ),
    '',
    '## Main Benchmark by Profile',
    '',
    ...selected.mainByProfile.map(
      (group) =>
        `- ${group.name}: count ${group.count}, MAE ${group.meanAbsoluteError}, reference avg ${group.averageReference}, app avg ${group.averageApp}`,
    ),
    '',
    '## Hard-Negative by Kind',
    '',
    ...selected.hardNegativeByKind.map(
      (group) =>
        `- ${group.name}: count ${group.count}, MAE ${group.meanAbsoluteError}, reference avg ${group.averageReference}, app avg ${group.averageApp}`,
    ),
    '',
    '## Top Candidate Configs',
    '',
    '| Label | Success | Skip % | Main MAE | Hard-Neg MAE | Strong MAE | Off-topic avg |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: |',
    ...topCandidates.map(
      (candidate) =>
        `| ${candidate.label} | ${candidate.metSuccessCriteria ? 'yes' : 'no'} | ${candidate.combinedSkipRate} | ${candidate.main.meanAbsoluteError} | ${candidate.hardNegative.meanAbsoluteError} | ${candidate.strongMae} | ${candidate.offTopicAverage} |`,
    ),
    '',
    '## Largest Regressions vs Always-Full Runtime',
    '',
    ...selected.topRegressions.map(
      (result) =>
        `- ${result.id}: ref ${result.referenceOverall}, adaptive ${result.finalOverall}, mode ${result.usedMode}, reason ${result.decision.reason}`,
    ),
    '',
  ].join('\n')
}

function round(value: number) {
  return Math.round(value * 10) / 10
}
