import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { BENCHMARK_CASES, type BenchmarkCase, type BenchmarkCriterion } from '../benchmark/cases'
import { WORDING_EXPERIMENTS, type WordingExperiment, type WordingExperimentPattern } from '../benchmark/wording-variants'
import {
  computeCalibratedOverallScore,
  createTransformersQualityScorer,
  resolveQualityScorerConfig,
  type QualityScoreResult,
} from '@browser-quality-scorer/core'

type VariantKey = 'baseline' | 'question_explicit' | 'criteria_explicit' | 'both_explicit'

type VariantResult = {
  caseId: string
  kind: BenchmarkCase['kind']
  profile: BenchmarkCase['profile']
  pattern: WordingExperimentPattern
  rationale: string
  variant: VariantKey
  question: string
  criteria: BenchmarkCriterion[]
  answer: string
  referenceOverall: number
  appOverall: number
  diff: number
  absDiff: number
  gate: number
  answerSupport: number
  constraintPresence: number
  constraintRespect: number
}

type VariantSummary = {
  variant: VariantKey
  count: number
  meanAbsoluteError: number
  medianAbsoluteError: number
  averageImprovement: number
  improvedCases: number
  worsenedCases: number
  improvedBy5OrMore: number
  worsenedBy5OrMore: number
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

const caseMap = new Map(BENCHMARK_CASES.map((testCase) => [testCase.id, testCase]))
const experimentResults: VariantResult[] = []

for (const experiment of WORDING_EXPERIMENTS) {
  const baseCase = caseMap.get(experiment.caseId)

  if (!baseCase) {
    throw new Error(`Missing benchmark case for wording experiment: ${experiment.caseId}`)
  }

  const variantInputs: Array<{ variant: VariantKey; question: string; criteria: BenchmarkCriterion[] }> = [
    {
      variant: 'baseline',
      question: baseCase.question,
      criteria: baseCase.criteria,
    },
    {
      variant: 'question_explicit',
      question: experiment.explicitQuestion,
      criteria: baseCase.criteria,
    },
    {
      variant: 'criteria_explicit',
      question: baseCase.question,
      criteria: rewriteCriteria(baseCase.criteria, experiment.explicitCriteria),
    },
    {
      variant: 'both_explicit',
      question: experiment.explicitQuestion,
      criteria: rewriteCriteria(baseCase.criteria, experiment.explicitCriteria),
    },
  ]

  for (const variantInput of variantInputs) {
    const scoreResult = await scorer.score({
      question: variantInput.question,
      response: baseCase.answer,
      criteria: variantInput.criteria.map((criterion) => criterion.label),
    })
    experimentResults.push(
      toVariantResult(baseCase, experiment, variantInput.variant, variantInput.question, variantInput.criteria, scoreResult),
    )
  }
}

const groupedByCase = groupBy(experimentResults, (result) => result.caseId)
const variantSummaries = summarizeVariants(experimentResults, groupedByCase)
const patternSummaries = summarizePatterns(experimentResults, groupedByCase)
const bestByCase = Array.from(groupedByCase.values()).map(getCaseImprovementSummary)

await mkdir(REPORTS_DIR, { recursive: true })
await Bun.write(
  fileURLToPath(new URL('../reports/wording-experiments.json', import.meta.url)),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      caseCount: WORDING_EXPERIMENTS.length,
      variantSummaries,
      patternSummaries,
      bestByCase,
      results: experimentResults,
    },
    null,
    2,
  ),
)

await Bun.write(
  fileURLToPath(new URL('../reports/wording-experiments.md', import.meta.url)),
  renderMarkdown({
    variantSummaries,
    patternSummaries,
    bestByCase,
    resultsByCase: groupedByCase,
  }),
)

console.log(
  JSON.stringify(
    {
      caseCount: WORDING_EXPERIMENTS.length,
      variantSummaries,
      topImprovements: bestByCase
        .filter((item) => item.bestImprovement > 0)
        .sort((left, right) => right.bestImprovement - left.bestImprovement)
        .slice(0, 8),
      topRegressions: bestByCase
        .filter((item) => item.bestImprovement <= 0)
        .sort((left, right) => left.bestImprovement - right.bestImprovement)
        .slice(0, 5),
    },
    null,
    2,
  ),
)

function toVariantResult(
  baseCase: BenchmarkCase,
  experiment: WordingExperiment,
  variant: VariantKey,
  question: string,
  criteria: BenchmarkCriterion[],
  scoreResult: QualityScoreResult,
): VariantResult {
  const weightedOverall = computeCalibratedOverallScore(
    {
      rawOverall: weightedPercent(criteria, scoreResult.scores) / 100,
      question,
      response: baseCase.answer,
      answerSupport: scoreResult.answerSupport,
      criterionScores: scoreResult.scores,
      structuralScore: scoreResult.structuralScore,
    },
    scorerConfig,
  )
  const appOverall = round(weightedOverall.overallCalibrated * 100)
  const referenceOverall = weightedPercent(baseCase.criteria, baseCase.referenceScores)
  const diff = appOverall - referenceOverall

  return {
    caseId: baseCase.id,
    kind: baseCase.kind,
    profile: baseCase.profile,
    pattern: experiment.pattern,
    rationale: experiment.rationale,
    variant,
    question,
    criteria,
    answer: baseCase.answer,
    referenceOverall,
    appOverall,
    diff,
    absDiff: Math.abs(diff),
    gate: round(scoreResult.gate),
    answerSupport: round(scoreResult.answerSupport),
    constraintPresence: round(scoreResult.constraintPresence),
    constraintRespect: round(scoreResult.constraintRespect),
  }
}

function rewriteCriteria(baseCriteria: BenchmarkCriterion[], labels: string[]) {
  return baseCriteria.map((criterion, index) => ({
    label: labels[index] ?? criterion.label,
    weight: criterion.weight,
  }))
}

function summarizeVariants(results: VariantResult[], groupedByCase: Map<string, VariantResult[]>) {
  return (['baseline', 'question_explicit', 'criteria_explicit', 'both_explicit'] as VariantKey[]).map((variant) => {
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
      improvedBy5OrMore: improvements.filter((value) => value >= 5).length,
      worsenedBy5OrMore: improvements.filter((value) => value <= -5).length,
    } satisfies VariantSummary
  })
}

function summarizePatterns(results: VariantResult[], groupedByCase: Map<string, VariantResult[]>) {
  const patterns = Array.from(new Set(results.map((result) => result.pattern)))
  return patterns.map((pattern) => ({
    pattern,
    variants: (['baseline', 'question_explicit', 'criteria_explicit', 'both_explicit'] as VariantKey[]).map((variant) => {
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

function getCaseImprovementSummary(results: VariantResult[]) {
  const baseline = results.find((result) => result.variant === 'baseline')

  if (!baseline) {
    throw new Error(`Missing baseline result for case ${results[0]?.caseId ?? 'unknown'}`)
  }

  const variants = results
    .filter((result) => result.variant !== 'baseline')
    .map((result) => ({
      variant: result.variant,
      appOverall: result.appOverall,
      absDiff: result.absDiff,
      improvement: round(baseline.absDiff - result.absDiff),
    }))
    .sort((left, right) => right.improvement - left.improvement)

  const best = variants[0]

  return {
    caseId: baseline.caseId,
    kind: baseline.kind,
    profile: baseline.profile,
    pattern: baseline.pattern,
    baselineOverall: baseline.appOverall,
    baselineAbsDiff: baseline.absDiff,
    bestVariant: best?.variant ?? 'baseline',
    bestOverall: best?.appOverall ?? baseline.appOverall,
    bestAbsDiff: best?.absDiff ?? baseline.absDiff,
    bestImprovement: best?.improvement ?? 0,
    rationale: baseline.rationale,
  }
}

function renderMarkdown(payload: {
  variantSummaries: VariantSummary[]
  patternSummaries: Array<{
    pattern: WordingExperimentPattern
    variants: Array<{
      variant: VariantKey
      count: number
      meanAbsoluteError: number
      averageImprovement: number
      improvedCases: number
      worsenedCases: number
    }>
  }>
  bestByCase: Array<{
    caseId: string
    kind: BenchmarkCase['kind']
    profile: BenchmarkCase['profile']
    pattern: WordingExperimentPattern
    baselineOverall: number
    baselineAbsDiff: number
    bestVariant: VariantKey | 'baseline'
    bestOverall: number
    bestAbsDiff: number
    bestImprovement: number
    rationale: string
  }>
  resultsByCase: Map<string, VariantResult[]>
}) {
  const lines = [
    '# Question And Criteria Wording Experiments',
    '',
    'This report tests whether changing question wording and criterion wording can materially change scores on cases the current scorer handles poorly.',
    '',
    'Method:',
    '',
    '- Start from poorly performing cases in the current xsmall benchmark.',
    '- Keep the same answer and reference score.',
    '- Compare four variants for each case:',
    '  - baseline wording',
    '  - question rewritten to surface the goal and constraints more explicitly',
    '  - criteria rewritten to name the concrete factors instead of generic rubric labels',
    '  - both rewritten together',
    '- Score each variant with the current shipped xsmall model and current runtime calibration.',
    '',
    '## Aggregate Results',
    '',
    '| Variant | Cases | MAE | Median | Avg improvement vs baseline | Improved cases | Worsened cases | Improved by 5+ | Worsened by 5+ |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...payload.variantSummaries.map(
      (summary) =>
        `| ${summary.variant} | ${summary.count} | ${summary.meanAbsoluteError} | ${summary.medianAbsoluteError} | ${summary.averageImprovement} | ${summary.improvedCases} | ${summary.worsenedCases} | ${summary.improvedBy5OrMore} | ${summary.worsenedBy5OrMore} |`,
    ),
    '',
    '## By Pattern',
    '',
  ]

  for (const patternSummary of payload.patternSummaries) {
    lines.push(`### ${patternSummary.pattern}`, '')
    lines.push('| Variant | Cases | MAE | Avg improvement vs baseline | Improved | Worsened |')
    lines.push('| --- | ---: | ---: | ---: | ---: | ---: |')
    lines.push(
      ...patternSummary.variants.map(
        (summary) =>
          `| ${summary.variant} | ${summary.count} | ${summary.meanAbsoluteError} | ${summary.averageImprovement} | ${summary.improvedCases} | ${summary.worsenedCases} |`,
      ),
    )
    lines.push('')
  }

  const biggestWins = [...payload.bestByCase]
    .filter((item) => item.bestImprovement > 0)
    .sort((left, right) => right.bestImprovement - left.bestImprovement)
  const noWins = [...payload.bestByCase]
    .filter((item) => item.bestImprovement <= 0)
    .sort((left, right) => left.bestImprovement - right.bestImprovement)

  lines.push('## Biggest Wins', '')
  lines.push(
    ...biggestWins.slice(0, 10).map(
      (item) =>
        `- ${item.caseId}: baseline abs diff ${item.baselineAbsDiff}, best ${item.bestVariant} abs diff ${item.bestAbsDiff}, improvement ${item.bestImprovement}`,
    ),
    '',
  )

  lines.push('## Cases With No Improvement', '')
  lines.push(
    ...(noWins.length > 0
      ? noWins.map(
          (item) =>
            `- ${item.caseId}: baseline abs diff ${item.baselineAbsDiff}, best variant ${item.bestVariant}, improvement ${item.bestImprovement}`,
        )
      : ['- Every selected case improved under at least one wording variant.']),
    '',
  )

  lines.push('## Per-Case Detail', '')

  for (const [caseId, results] of payload.resultsByCase.entries()) {
    const ordered = [...results].sort((left, right) => variantRank(left.variant) - variantRank(right.variant))
    const baseline = ordered.find((result) => result.variant === 'baseline')

    if (!baseline) {
      continue
    }

    lines.push(`### ${caseId}`, '')
    lines.push(`- Kind/profile: ${baseline.kind} / ${baseline.profile}`)
    lines.push(`- Pattern: ${baseline.pattern}`)
    lines.push(`- Rationale: ${baseline.rationale}`)
    lines.push(`- Reference overall: ${baseline.referenceOverall}`)
    lines.push(`- Answer: ${truncate(baseline.answer, 240)}`)
    lines.push('')
    lines.push('| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |')
    lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: |')
    lines.push(
      ...ordered.map((result) => {
        const improvement = round(baseline.absDiff - result.absDiff)
        return `| ${result.variant} | ${result.appOverall} | ${result.absDiff} | ${improvement} | ${result.gate} | ${result.answerSupport} | ${result.constraintRespect} |`
      }),
    )
    lines.push('')
    lines.push(`Baseline question: ${baseline.question}`)
    lines.push('')
    lines.push(...ordered.filter((result) => result.variant !== 'baseline').map((result) => `${result.variant} question: ${result.question}`))
    lines.push('')
    lines.push(`Baseline criteria: ${baseline.criteria.map((criterion) => criterion.label).join(' | ')}`)
    lines.push('')
    lines.push(
      ...ordered
        .filter((result) => result.variant !== 'baseline')
        .map((result) => `${result.variant} criteria: ${result.criteria.map((criterion) => criterion.label).join(' | ')}`),
    )
    lines.push('')
  }

  lines.push('## Practical Takeaways', '')
  lines.push(
    '- Explicit question wording and explicit criteria wording do not help equally. The effect is case-dependent.',
    '- Rewriting criteria to name the exact factors often helps comparison and constraint-sensitive cases more than rewriting the question alone.',
    '- Rewriting the question to separate `goal` and `constraint` often helps planning and advice cases when the original question packs the limits into one clause.',
    '- Some cases remain hard even with better wording. That means the model limitation is real, not just prompt phrasing.',
    '',
  )

  return `${lines.join('\n')}\n`
}

function baselineFor(groupedByCase: Map<string, VariantResult[]>, caseId: string) {
  const baseline = groupedByCase.get(caseId)?.find((result) => result.variant === 'baseline')

  if (!baseline) {
    throw new Error(`Missing baseline result for case ${caseId}`)
  }

  return baseline
}

function groupBy<T>(items: T[], keyFn: (item: T) => string) {
  const groups = new Map<string, T[]>()

  for (const item of items) {
    const key = keyFn(item)
    const existing = groups.get(key)

    if (existing) {
      existing.push(item)
    } else {
      groups.set(key, [item])
    }
  }

  return groups
}

function variantRank(variant: VariantKey) {
  switch (variant) {
    case 'baseline':
      return 0
    case 'question_explicit':
      return 1
    case 'criteria_explicit':
      return 2
    case 'both_explicit':
      return 3
  }
}

function weightedPercent(criteria: BenchmarkCriterion[], scores: number[]) {
  return round(criteria.reduce((sum, criterion, index) => sum + criterion.weight * 100 * (scores[index] ?? 0), 0) / 100)
}

function mean(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function median(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
  }

  return sorted[middle] ?? 0
}

function truncate(text: string, limit: number) {
  return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`
}

function round(value: number) {
  return Math.round(value * 10) / 10
}
