import { access, mkdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { BENCHMARK_CASES } from '../benchmark/cases'

type GroupSummary = {
  name: string
  count: number
  meanAbsoluteError: number
  averageReference: number
  averageApp: number
}

type MissSummary = {
  id: string
  referenceOverall: number
  appOverall: number
  diff: number
  absDiff: number
}

type BenchmarkSummary = {
  meanAbsoluteError: number
  medianAbsoluteError: number
  within10: number
  within20: number
  byKind?: GroupSummary[]
  byProfile?: GroupSummary[]
  topMisses?: MissSummary[]
}

type BenchmarkResults = {
  rawSummary: BenchmarkSummary
  crossValidatedSummary: BenchmarkSummary
  runtimeSummary: BenchmarkSummary
}

type HardNegativeResults = {
  caseCount: number
  meanAbsoluteError: number
  medianAbsoluteError: number
  within10: number
  within20: number
  byKind: GroupSummary[]
  topMisses: MissSummary[]
}

type LowLatencyResult = {
  variant: {
    id: string
    title: string
    description: string
  }
  rawSummary: BenchmarkSummary
  crossValidatedSummary: BenchmarkSummary
  runtimeSummary: BenchmarkSummary
  hardNegativeSummary: BenchmarkSummary
}

type AdaptiveTopRegression = {
  id: string
  referenceOverall: number
  finalOverall: number
  diff: number
  absDiff: number
}

type AdaptiveSummary = {
  label: string
  main: BenchmarkSummary
  hardNegative: BenchmarkSummary
  combinedSkipRate: number
  mainSkipRate: number
  hardNegativeSkipRate: number
  goodMae: number
  offTopicAverage: number
  mainByKind: GroupSummary[]
  mainByProfile: GroupSummary[]
  hardNegativeByKind: GroupSummary[]
  topRegressions: AdaptiveTopRegression[]
}

type AdaptiveResults = {
  selected: AdaptiveSummary
  baselineMainSummary: BenchmarkSummary
  baselineHardNegativeSummary: BenchmarkSummary
  topCandidates: AdaptiveSummary[]
}

type WordingVariantSummary = {
  variant: string
  count: number
  meanAbsoluteError: number
  medianAbsoluteError: number
  averageImprovement: number
  improvedCases: number
  worsenedCases: number
}

type WordingPatternSummary = {
  pattern: string
  variants: Array<{
    variant: string
    count: number
    meanAbsoluteError: number
    averageImprovement: number
    improvedCases: number
    worsenedCases: number
  }>
}

type WordingCaseSummary = {
  caseId: string
  pattern: string
  baselineAbsDiff: number
  bestVariant: string
  bestAbsDiff: number
  bestImprovement: number
}

type WordingReport = {
  caseCount: number
  variantSummaries: WordingVariantSummary[]
  patternSummaries: WordingPatternSummary[]
  bestByCase: WordingCaseSummary[]
}

type ModelBakeoffResult = {
  modelId: string
  sizeLabel: string
  note: string
  loadDurationMs: number
  totalDurationMs: number
  mainCrossValidatedSummary: BenchmarkSummary
  hardNegativeCrossValidatedSummary: BenchmarkSummary
}

type ModelBakeoffReport = {
  generatedAt: string
  elapsedMs: number
  candidates: Array<{ id: string; label: string; note: string }>
  results: ModelBakeoffResult[]
  failures: Array<{ modelId: string; error: string }>
}

type ScoringImprovementReport = {
  generatedAt: string
  lowLatency: {
    selectedVariant: string
    mainMae: number
    hardNegativeMae: number
  }
  adaptive: {
    selectedPolicy: string
    combinedSkipRate: number
    mainMae: number
    hardNegativeMae: number
  }
  wording: {
    selectedVariant: string
    averageImprovement: number
    meanAbsoluteError: number
  } | null
}

type ReportKey =
  | 'main'
  | 'hard-negative'
  | 'adaptive'
  | 'scoring-improvement'
  | 'low-latency'
  | 'wording-exp'
  | 'model-bakeoff'

const ROOT_DIR = fileURLToPath(new URL('../../', import.meta.url))
const REPORTS_DIR = fileURLToPath(new URL('../reports/', import.meta.url))
const DOCS_DIR = fileURLToPath(new URL('../../docs/guide/', import.meta.url))

const PATHS = {
  mainJson: fileURLToPath(new URL('../reports/benchmark-results.json', import.meta.url)),
  hardNegativeJson: fileURLToPath(new URL('../reports/hard-negative-results.json', import.meta.url)),
  adaptiveJson: fileURLToPath(new URL('../reports/adaptive-refinement-results.json', import.meta.url)),
  lowLatencyJson: fileURLToPath(new URL('../reports/low-latency-iterations.json', import.meta.url)),
  wordingJson: fileURLToPath(new URL('../reports/wording-experiments.json', import.meta.url)),
  scoringImprovementJson: fileURLToPath(new URL('../reports/scoring-improvement.json', import.meta.url)),
  modelBakeoffJson: fileURLToPath(new URL('../reports/model-bakeoff.json', import.meta.url)),
  mainDoc: fileURLToPath(new URL('../../docs/guide/main-benchmark.md', import.meta.url)),
  hardNegativeDoc: fileURLToPath(new URL('../../docs/guide/hard-negative-benchmark.md', import.meta.url)),
  adaptiveDoc: fileURLToPath(new URL('../../docs/guide/adaptive-refinement.md', import.meta.url)),
  lowLatencyDoc: fileURLToPath(new URL('../../docs/guide/low-latency-improvement.md', import.meta.url)),
  wordingDoc: fileURLToPath(new URL('../../docs/guide/wording-experiments.md', import.meta.url)),
  scoringImprovementDoc: fileURLToPath(new URL('../../docs/guide/scoring-improvement.md', import.meta.url)),
  modelBakeoffDoc: fileURLToPath(new URL('../../docs/guide/model-bakeoff.md', import.meta.url)),
} as const

const rawReport = Bun.argv[2]
const report = normalizeReportKey(rawReport)
const writeJson = Bun.argv.includes('--write-json')
const explicitUseCache = Bun.argv.includes('--use-cache')
const writeMd = Bun.argv.includes('--write-md')
const useWebGpu = Bun.argv.includes('--use-webgpu')
const modelsIndex = Bun.argv.findIndex((arg) => arg === '--models')
const modelsArg = modelsIndex >= 0 ? Bun.argv[modelsIndex + 1] : null

if (!report) {
  throw new Error('Usage: bun tools/scripts/run-report.ts <main|hard-negative|adaptive|scoring-improvement|low-latency|wording-exp|model-bakeoff> [--write-json|--use-cache] [--write-md] [--use-webgpu]')
}

if (writeJson && explicitUseCache) {
  throw new Error('Use either --write-json or --use-cache, not both.')
}

const useCache = explicitUseCache || !writeJson

await mkdir(REPORTS_DIR, { recursive: true })
await mkdir(DOCS_DIR, { recursive: true })

if (writeJson) {
  await refreshArtifacts(report, modelsArg, useWebGpu)
}

switch (report) {
  case 'main': {
    const data = await Bun.file(PATHS.mainJson).json() as BenchmarkResults
    console.log(JSON.stringify(summarizeMain(data), null, 2))
    if (writeMd) {
      await Bun.write(PATHS.mainDoc, renderMainBenchmarkDoc(data))
      console.log(`\nUpdated docs:\n- ${PATHS.mainDoc}`)
    }
    break
  }
  case 'hard-negative': {
    const data = await Bun.file(PATHS.hardNegativeJson).json() as HardNegativeResults
    console.log(JSON.stringify(summarizeHardNegative(data), null, 2))
    if (writeMd) {
      await Bun.write(PATHS.hardNegativeDoc, renderHardNegativeDoc(data))
      console.log(`\nUpdated docs:\n- ${PATHS.hardNegativeDoc}`)
    }
    break
  }
  case 'adaptive': {
    const data = await Bun.file(PATHS.adaptiveJson).json() as AdaptiveResults
    console.log(JSON.stringify(summarizeAdaptive(data), null, 2))
    if (writeMd) {
      await Bun.write(PATHS.adaptiveDoc, renderAdaptiveDoc(data))
      console.log(`\nUpdated docs:\n- ${PATHS.adaptiveDoc}`)
    }
    break
  }
  case 'low-latency': {
    const data = await Bun.file(PATHS.lowLatencyJson).json() as LowLatencyResult[]
    console.log(JSON.stringify(summarizeLowLatency(data), null, 2))
    if (writeMd) {
      await Bun.write(PATHS.lowLatencyDoc, renderLowLatencyDoc(data))
      console.log(`\nUpdated docs:\n- ${PATHS.lowLatencyDoc}`)
    }
    break
  }
  case 'wording-exp': {
    const data = await Bun.file(PATHS.wordingJson).json() as WordingReport
    console.log(JSON.stringify(summarizeWording(data), null, 2))
    if (writeMd) {
      await Bun.write(PATHS.wordingDoc, renderWordingDoc(data))
      console.log(`\nUpdated docs:\n- ${PATHS.wordingDoc}`)
    }
    break
  }
  case 'model-bakeoff': {
    await ensureCacheAllowed(useCache, PATHS.modelBakeoffJson, 'model-bakeoff')
    const data = await Bun.file(PATHS.modelBakeoffJson).json() as ModelBakeoffReport
    console.log(JSON.stringify(summarizeModelBakeoff(data), null, 2))
    if (writeMd) {
      await Bun.write(PATHS.modelBakeoffDoc, renderModelBakeoffDoc(data))
      console.log(`\nUpdated docs:\n- ${PATHS.modelBakeoffDoc}`)
    }
    break
  }
  case 'scoring-improvement': {
    const data =
      await fileExists(PATHS.scoringImprovementJson)
        ? await Bun.file(PATHS.scoringImprovementJson).json() as ScoringImprovementReport
        : await buildScoringImprovementReportFromCache()
    console.log(JSON.stringify(data, null, 2))
    if (writeMd) {
      await Bun.write(PATHS.scoringImprovementDoc, renderScoringImprovementDoc(data))
      console.log(`\nUpdated docs:\n- ${PATHS.scoringImprovementDoc}`)
    }
    break
  }
}

async function refreshArtifacts(reportKey: ReportKey, models: string | null, useWebGpuFlag: boolean) {
  switch (reportKey) {
    case 'main':
      await runStep('Main benchmark', withWebGpuFlag(['tools/scripts/run-benchmark.ts'], useWebGpuFlag))
      break
    case 'hard-negative':
      await runStep('Hard-negative benchmark', withWebGpuFlag(['tools/scripts/run-hard-negative-benchmark.ts'], useWebGpuFlag))
      break
    case 'adaptive':
      await runStep('Adaptive report', withWebGpuFlag(['tools/scripts/update-evolution-reports.ts', '--only', 'adaptive'], useWebGpuFlag))
      break
    case 'low-latency':
      await runStep('Low-latency report', withWebGpuFlag(['tools/scripts/update-evolution-reports.ts', '--only', 'low-latency'], useWebGpuFlag))
      break
    case 'wording-exp':
      await runStep('Wording report', withWebGpuFlag(['tools/scripts/update-evolution-reports.ts', '--only', 'wording'], useWebGpuFlag))
      break
    case 'model-bakeoff': {
      const args = ['tools/scripts/update-evolution-reports.ts', '--only', 'model-bakeoff']
      if (models) {
        args.push('--models', models)
      }
      await runStep('Model bakeoff report', withWebGpuFlag(args, useWebGpuFlag))
      break
    }
    case 'scoring-improvement': {
      await runStep('Adaptive report', withWebGpuFlag(['tools/scripts/update-evolution-reports.ts', '--only', 'adaptive'], useWebGpuFlag))
      await runStep('Low-latency report', withWebGpuFlag(['tools/scripts/update-evolution-reports.ts', '--only', 'low-latency'], useWebGpuFlag))
      await runStep('Wording report', withWebGpuFlag(['tools/scripts/update-evolution-reports.ts', '--only', 'wording'], useWebGpuFlag))
      const data = await buildScoringImprovementReportFromCache()
      await Bun.write(PATHS.scoringImprovementJson, JSON.stringify(data, null, 2))
      break
    }
  }
}

function withWebGpuFlag(args: string[], useWebGpuFlag: boolean) {
  return useWebGpuFlag ? [...args, '--use-webgpu'] : args
}

async function runStep(label: string, args: string[]) {
  console.log(`\n=== ${label} ===`)
  const child = spawn('bun', args, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  })

  const exitCode = await new Promise<number>((resolve, reject) => {
    child.once('error', reject)
    child.once('close', (code) => resolve(code ?? 1))
  })

  if (exitCode !== 0) {
    throw new Error(`${label} failed with exit code ${exitCode}`)
  }
}

function normalizeReportKey(value: string | undefined): ReportKey | null {
  switch (value) {
    case 'main':
    case 'hard-negative':
    case 'adaptive':
    case 'scoring-improvement':
    case 'low-latency':
    case 'wording-exp':
    case 'model-bakeoff':
      return value
    default:
      return null
  }
}

async function ensureCacheAllowed(useCacheMode: boolean, path: string, reportKey: string) {
  if (useCacheMode && !(await fileExists(path))) {
    throw new Error(`No cached JSON artifact for ${reportKey}. Run with --write-json first.`)
  }
}

async function fileExists(path: string) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function buildScoringImprovementReportFromCache(): Promise<ScoringImprovementReport> {
  const lowLatency = await Bun.file(PATHS.lowLatencyJson).json() as LowLatencyResult[]
  const adaptive = await Bun.file(PATHS.adaptiveJson).json() as AdaptiveResults
  const wording = await Bun.file(PATHS.wordingJson).json() as WordingReport
  const lowLatencyWinner = selectLowLatencyWinner(lowLatency)
  const wordingWinner = bestWordingVariant(wording)

  return {
    generatedAt: new Date().toISOString(),
    lowLatency: {
      selectedVariant: lowLatencyWinner.variant.title,
      mainMae: lowLatencyWinner.crossValidatedSummary.meanAbsoluteError,
      hardNegativeMae: lowLatencyWinner.hardNegativeSummary.meanAbsoluteError,
    },
    adaptive: {
      selectedPolicy: adaptive.selected.label,
      combinedSkipRate: adaptive.selected.combinedSkipRate,
      mainMae: adaptive.selected.main.meanAbsoluteError,
      hardNegativeMae: adaptive.selected.hardNegative.meanAbsoluteError,
    },
    wording: wordingWinner
      ? {
          selectedVariant: wordingWinner.variant,
          averageImprovement: wordingWinner.averageImprovement,
          meanAbsoluteError: wordingWinner.meanAbsoluteError,
        }
      : null,
  }
}

function summarizeMain(data: BenchmarkResults) {
  return {
    report: 'main',
    runtime: compactSummary(data.runtimeSummary, BENCHMARK_CASES.length),
    crossValidated: compactSummary(data.crossValidatedSummary, BENCHMARK_CASES.length),
    raw: compactSummary(data.rawSummary, BENCHMARK_CASES.length),
  }
}

function summarizeHardNegative(data: HardNegativeResults) {
  return {
    report: 'hard-negative',
    runtime: {
      meanAbsoluteError: benchmarkResultsValue(data.meanAbsoluteError),
      medianAbsoluteError: benchmarkResultsValue(data.medianAbsoluteError),
      within10: `${data.within10}/${data.caseCount}`,
      within20: `${data.within20}/${data.caseCount}`,
    },
  }
}

function summarizeAdaptive(data: AdaptiveResults) {
  return {
    report: 'adaptive',
    selected: data.selected.label,
    combinedSkipRate: data.selected.combinedSkipRate,
    mainMae: data.selected.main.meanAbsoluteError,
    hardNegativeMae: data.selected.hardNegative.meanAbsoluteError,
    goodMae: data.selected.goodMae,
    offTopicAverage: data.selected.offTopicAverage,
  }
}

function summarizeLowLatency(data: LowLatencyResult[]) {
  return {
    report: 'low-latency',
    variants: data.map((item) => ({
      id: item.variant.id,
      title: item.variant.title,
      mainCrossValidated: compactSummary(item.crossValidatedSummary, BENCHMARK_CASES.length),
      hardNegative: compactSummary(item.hardNegativeSummary, BENCHMARK_CASES.length),
    })),
  }
}

function summarizeWording(data: WordingReport) {
  return {
    report: 'wording-exp',
    caseCount: data.caseCount,
    variantSummaries: data.variantSummaries,
    topImprovements: data.bestByCase.slice(0, 6),
  }
}

function summarizeModelBakeoff(data: ModelBakeoffReport) {
  return {
    report: 'model-bakeoff',
    candidates: data.results.map((result) => ({
      modelId: result.modelId,
      size: result.sizeLabel,
      mainCv: compactSummary(result.mainCrossValidatedSummary, BENCHMARK_CASES.length),
      hardCv: compactSummary(result.hardNegativeCrossValidatedSummary, BENCHMARK_CASES.length),
      loadMs: round(result.loadDurationMs),
      totalMs: round(result.totalDurationMs),
    })),
    failures: data.failures,
  }
}

function renderMainBenchmarkDoc(results: BenchmarkResults) {
  const raw = results.rawSummary
  const crossValidated = results.crossValidatedSummary
  const runtime = results.runtimeSummary
  const scenarioCount = BENCHMARK_CASES.length / 4
  const domains = runtime.byKind ?? []
  const profiles = runtime.byProfile ?? []

  return renderTemplate({
    title: 'Main Benchmark',
    command: 'bun run report:main --write-json --write-md',
    atAGlance: [
      `Cases: \`${BENCHMARK_CASES.length}\``,
      'Best display path: runtime calibrated scoring',
      `Runtime calibrated MAE: \`${formatNumber(runtime.meanAbsoluteError)}\``,
      `Runtime calibrated median absolute error: \`${formatNumber(runtime.medianAbsoluteError)}\``,
      `Runtime calibrated within 10 points: \`${runtime.within10}/${BENCHMARK_CASES.length}\``,
      `Runtime calibrated within 20 points: \`${runtime.within20}/${BENCHMARK_CASES.length}\``,
    ],
    topLineMetrics: [
      '| View | MAE | Median | Within 10 | Within 20 |',
      '| --- | ---: | ---: | ---: | ---: |',
      `| Raw scoring | ${formatNumber(raw.meanAbsoluteError)} | ${formatNumber(raw.medianAbsoluteError)} | ${raw.within10}/${BENCHMARK_CASES.length} | ${raw.within20}/${BENCHMARK_CASES.length} |`,
      `| Cross-validated calibrated | ${formatNumber(crossValidated.meanAbsoluteError)} | ${formatNumber(crossValidated.medianAbsoluteError)} | ${crossValidated.within10}/${BENCHMARK_CASES.length} | ${crossValidated.within20}/${BENCHMARK_CASES.length} |`,
      `| Runtime calibrated | ${formatNumber(runtime.meanAbsoluteError)} | ${formatNumber(runtime.medianAbsoluteError)} | ${runtime.within10}/${BENCHMARK_CASES.length} | ${runtime.within20}/${BENCHMARK_CASES.length} |`,
    ],
    corpusShape: [
      'The benchmark is a handwritten corpus of structured program and service summary tasks:',
      '',
      `- \`${scenarioCount}\` scenarios`,
      `- \`${domains.length}\` domains: ${domains.map((group) => group.name).join(', ')}`,
      `- \`${profiles.length}\` answer profiles per scenario: ${profiles.map((group) => `\`${group.name}\``).join(', ')}`,
    ],
    byDomain: renderGroupTable('Domain', domains),
    byProfile: renderGroupTable('Profile', profiles),
    largestMisses: renderMissTable(runtime.topMisses ?? []),
    howToRead: [
      '- Use runtime calibrated metrics as the display view for the shipped scorer.',
      '- Use cross-validated calibrated metrics as the fairest comparison when judging scorer changes.',
      '- Use the domain and profile tables to see where error is concentrated without embedding run-specific narrative in the page.',
    ],
  })
}

function renderHardNegativeDoc(results: HardNegativeResults) {
  return renderTemplate({
    title: 'Hard Negative Benchmark',
    command: 'bun run report:hard-negative --write-json --write-md',
    atAGlance: [
      `Cases: \`${results.caseCount}\``,
      `Runtime calibrated MAE: \`${formatNumber(results.meanAbsoluteError)}\``,
      `Median absolute error: \`${formatNumber(results.medianAbsoluteError)}\``,
      `Within 10 points: \`${results.within10}/${results.caseCount}\``,
      `Within 20 points: \`${results.within20}/${results.caseCount}\``,
    ],
    topLineMetrics: [
      '| Metric | Value |',
      '| --- | ---: |',
      `| MAE | ${formatNumber(results.meanAbsoluteError)} |`,
      `| Median absolute error | ${formatNumber(results.medianAbsoluteError)} |`,
      `| Within 10 points | ${results.within10}/${results.caseCount} |`,
      `| Within 20 points | ${results.within20}/${results.caseCount} |`,
    ],
    corpusShape: [
      'This benchmark is derived from the same handwritten main corpus and replaces each answer with a topical but weak hard-negative response.',
      '',
      `- \`${results.caseCount}\` synthetic hard-negative cases`,
      `- \`${results.byKind.length}\` domains: ${results.byKind.map((group) => group.name).join(', ')}`,
      `- same question set as the main benchmark`,
    ],
    byDomain: renderGroupTable('Domain', results.byKind),
    byProfile: ['This report does not persist profile-level slices. It tracks one synthetic failure mode across the full corpus.'],
    largestMisses: renderMissTable(results.topMisses),
    howToRead: [
      '- This benchmark isolates resistance to topical but weak answers generated from the same corpus.',
      '- Lower MAE and lower app averages indicate better resistance to over-scoring generic filler.',
      '- Compare this page with the main benchmark before accepting scorer changes.',
    ],
  })
}

function renderAdaptiveDoc(input: AdaptiveResults) {
  const selected = input.selected
  return renderTemplate({
    title: 'Adaptive Refinement',
    command: 'bun run report:adaptive --write-json --write-md',
    atAGlance: [
      `Cases: \`${BENCHMARK_CASES.length}\` main + \`${BENCHMARK_CASES.length}\` hard-negative`,
      `Selected policy: \`${selected.label}\``,
      `Combined full-pass skip rate: \`${selected.combinedSkipRate}%\``,
      `Main benchmark MAE: \`${selected.main.meanAbsoluteError}\``,
      `Hard-negative MAE: \`${selected.hardNegative.meanAbsoluteError}\``,
    ],
    topLineMetrics: [
      '| Metric | Value |',
      '| --- | ---: |',
      `| Combined full-pass skip rate | ${selected.combinedSkipRate}% |`,
      `| Main benchmark skip rate | ${selected.mainSkipRate}% |`,
      `| Hard-negative skip rate | ${selected.hardNegativeSkipRate}% |`,
      `| Main benchmark MAE | ${selected.main.meanAbsoluteError} |`,
      `| Hard-negative MAE | ${selected.hardNegative.meanAbsoluteError} |`,
      `| Good-profile MAE | ${selected.goodMae} |`,
      `| Off-topic average score | ${selected.offTopicAverage} |`,
    ],
    corpusShape: [
      'This report compares fast-pass versus full-pass scoring on the same handwritten corpus and its matching hard-negative set.',
      '',
      `- \`${input.topCandidates.length}\` candidate adaptive policies stored`,
      `- \`${BENCHMARK_CASES.length}\` main benchmark cases`,
      `- \`${BENCHMARK_CASES.length}\` hard-negative cases`,
    ],
    byDomain: renderGroupTable('Domain', selected.mainByKind),
    byProfile: renderGroupTable('Profile', selected.mainByProfile),
    largestMisses: renderAdaptiveMissTable(selected.topRegressions),
    howToRead: [
      '- Higher skip rates mean more fast-pass cases and lower expected latency.',
      '- Main and hard-negative MAE should be compared together before treating a policy as viable.',
      '- Good-profile MAE and off-topic average show whether the policy harms strong answers or leaks score into obvious failures.',
    ],
  })
}

function renderLowLatencyDoc(results: LowLatencyResult[]) {
  const winner = selectLowLatencyWinner(results)
  return renderTemplate({
    title: 'Low-Latency Improvement',
    command: 'bun run report:low-latency --write-json --write-md',
    atAGlance: [
      `Cases: \`${BENCHMARK_CASES.length}\` main + \`${BENCHMARK_CASES.length}\` hard-negative`,
      `Selected default tradeoff: \`${winner.variant.title}\``,
      `Main cross-validated MAE: \`${winner.crossValidatedSummary.meanAbsoluteError}\``,
      `Hard-negative MAE: \`${winner.hardNegativeSummary.meanAbsoluteError}\``,
      `Compared variants: \`${results.length}\``,
    ],
    topLineMetrics: [
      '| Variant | Main CV MAE | Main CV Median | Main CV Within 10 | Main CV Within 20 | Hard-Negative MAE |',
      '| --- | ---: | ---: | ---: | ---: | ---: |',
      ...results.map((result) => `| ${result.variant.title} | ${result.crossValidatedSummary.meanAbsoluteError} | ${result.crossValidatedSummary.medianAbsoluteError} | ${result.crossValidatedSummary.within10}/${BENCHMARK_CASES.length} | ${result.crossValidatedSummary.within20}/${BENCHMARK_CASES.length} | ${result.hardNegativeSummary.meanAbsoluteError} |`),
    ],
    corpusShape: [
      'This report compares low-latency helper variants on the current handwritten corpus and its matching hard-negative set.',
      '',
      `- \`${results.length}\` low-latency variants`,
      `- \`${BENCHMARK_CASES.length}\` main benchmark cases`,
      `- \`${BENCHMARK_CASES.length}\` hard-negative cases`,
    ],
    byDomain: ['This artifact stores per-variant summary metrics only. Domain-level slices are not persisted for the low-latency sweep.'],
    byProfile: ['This artifact stores per-variant summary metrics only. Profile-level slices are not persisted for the low-latency sweep.'],
    largestMisses: ['This artifact stores per-variant summary metrics only. Case-level miss lists are not persisted for the low-latency sweep.'],
    howToRead: [
      '- The top-line table is for side-by-side comparison of each low-latency variant on the same current corpus.',
      '- Lower hard-negative MAE is only useful when the main cross-validated MAE stays competitive.',
      '- The selected default tradeoff is the current best benchmark result, not a permanent narrative recommendation.',
    ],
  })
}

function renderWordingDoc(report: WordingReport) {
  const patternCount = report.patternSummaries.length
  return renderTemplate({
    title: 'Wording Experiments',
    command: 'bun run report:wording-exp --write-json --write-md',
    atAGlance: [
      `Cases: \`${report.caseCount}\` targeted miss cases`,
      `Compared variants: \`${report.variantSummaries.length}\``,
      `Tracked wording patterns: \`${patternCount}\``,
      `Best aggregate variant: \`${bestWordingVariant(report)?.variant ?? 'n/a'}\``,
      `Best aggregate improvement: \`${bestWordingVariant(report)?.averageImprovement ?? 0}\``,
    ],
    topLineMetrics: [
      '| Variant | Cases | MAE | Median | Avg Improvement vs Baseline | Improved Cases | Worsened Cases |',
      '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
      ...report.variantSummaries.map((item) => `| ${toTitle(item.variant)} | ${item.count} | ${item.meanAbsoluteError} | ${item.medianAbsoluteError} | ${item.averageImprovement} | ${item.improvedCases} | ${item.worsenedCases} |`),
    ],
    corpusShape: [
      'This report reruns a targeted subset of current-corpus misses with alternate question and rubric wording.',
      '',
      `- \`${report.caseCount}\` targeted cases`,
      `- \`${patternCount}\` wording-pattern buckets`,
      `- \`${report.variantSummaries.length}\` prompt/rubric variants per case`,
    ],
    byDomain: ['This artifact stores targeted case summaries rather than domain-level slices.'],
    byProfile: ['This artifact stores targeted case summaries rather than profile-level slices.'],
    largestMisses: [
      '| Case | Pattern | Best Variant | Baseline Abs Diff | Best Abs Diff | Improvement |',
      '| --- | --- | --- | ---: | ---: | ---: |',
      ...report.bestByCase
        .sort((left, right) => right.bestImprovement - left.bestImprovement)
        .slice(0, 12)
        .map((item) => `| \`${item.caseId}\` | ${toTitle(item.pattern)} | ${toTitle(item.bestVariant)} | ${item.baselineAbsDiff} | ${item.bestAbsDiff} | ${item.bestImprovement} |`),
    ],
    howToRead: [
      '- Positive improvement means the rewritten wording reduced absolute error relative to the baseline wording for that case.',
      '- The top-line table shows whether a variant helps broadly or only on a narrow subset.',
      '- Use this page as a diagnostic benchmark, not as a generated interpretation of why a variant won.',
    ],
  })
}

function renderScoringImprovementDoc(report: ScoringImprovementReport) {
  return renderTemplate({
    title: 'Scoring Improvement',
    command: 'bun run report:scoring-improvement --write-json --write-md',
    atAGlance: [
      'Cases: derived from the cached adaptive, low-latency, and wording experiment artifacts',
      `Low-latency winner: \`${report.lowLatency.selectedVariant}\``,
      `Adaptive winner: \`${report.adaptive.selectedPolicy}\``,
      `Wording winner: \`${report.wording?.selectedVariant ?? 'n/a'}\``,
      `Adaptive skip rate: \`${report.adaptive.combinedSkipRate}%\``,
    ],
    topLineMetrics: [
      '| Experiment | Current Best Result | Main Metric | Secondary Metric |',
      '| --- | --- | ---: | ---: |',
      `| Low-Latency | \`${report.lowLatency.selectedVariant}\` | ${report.lowLatency.mainMae} main CV MAE | ${report.lowLatency.hardNegativeMae} hard-negative MAE |`,
      `| Adaptive Refinement | \`${report.adaptive.selectedPolicy}\` | ${report.adaptive.combinedSkipRate}% skip rate | ${report.adaptive.mainMae} main MAE |`,
      report.wording
        ? `| Wording Experiments | \`${report.wording.selectedVariant}\` | ${report.wording.averageImprovement} avg improvement | ${report.wording.meanAbsoluteError} MAE |`
        : '| Wording Experiments | n/a | n/a | n/a |',
    ],
    corpusShape: [
      'This report is a derived summary built from the adaptive, low-latency, and wording experiment artifacts.',
      '',
      '- adaptive refinement artifact',
      '- low-latency sweep artifact',
      '- wording experiments artifact',
    ],
    byDomain: ['Use the linked component reports for domain-level slices. This summary report stores only the selected top-line outcomes.'],
    byProfile: ['Use the linked component reports for profile-level slices. This summary report stores only the selected top-line outcomes.'],
    largestMisses: ['Use the linked component reports for case-level miss tables. This summary report stores only selected top-line outcomes.'],
    howToRead: [
      '- This page is a compact index over the improvement experiments rather than a standalone benchmark run.',
      '- Use it to see the current selected result in each experiment family.',
      '- Follow the linked component pages when you need benchmark-level detail.',
    ],
  })
}

function renderModelBakeoffDoc(report: ModelBakeoffReport) {
  const sortedByMain = [...report.results].sort((left, right) => left.mainCrossValidatedSummary.meanAbsoluteError - right.mainCrossValidatedSummary.meanAbsoluteError)
  const bestMain = sortedByMain[0]
  const bestHard = [...report.results].sort((left, right) => left.hardNegativeCrossValidatedSummary.meanAbsoluteError - right.hardNegativeCrossValidatedSummary.meanAbsoluteError)[0]
  return renderTemplate({
    title: 'Model Bakeoff',
    command: 'bun run report:model-bakeoff --write-json --write-md',
    atAGlance: [
      `Candidates: \`${report.results.length}\` completed`,
      `Best main benchmark: \`${bestMain?.modelId ?? 'n/a'}\``,
      `Best hard-negative benchmark: \`${bestHard?.modelId ?? 'n/a'}\``,
      `Failures: \`${report.failures.length}\``,
      `Elapsed time: \`${formatDuration(report.elapsedMs)}\``,
    ],
    topLineMetrics: [
      '| Model | q8 Size | Main MAE | Main Median | Hard MAE | Hard Median | Load Time | Total Time |',
      '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
      ...sortedByMain.map((result) => `| ${result.modelId} | ${result.sizeLabel} | ${result.mainCrossValidatedSummary.meanAbsoluteError} | ${result.mainCrossValidatedSummary.medianAbsoluteError} | ${result.hardNegativeCrossValidatedSummary.meanAbsoluteError} | ${result.hardNegativeCrossValidatedSummary.medianAbsoluteError} | ${formatDuration(result.loadDurationMs)} | ${formatDuration(result.totalDurationMs)} |`),
    ],
    corpusShape: [
      'This report compares local model candidates against the same main corpus and hard-negative corpus.',
      '',
      `- \`${report.results.length}\` evaluated candidates`,
      `- \`${BENCHMARK_CASES.length}\` main benchmark cases`,
      `- \`${BENCHMARK_CASES.length}\` hard-negative cases`,
    ],
    byDomain: ['This artifact stores per-model summary metrics only. Domain-level slices are not persisted for the bakeoff.'],
    byProfile: ['This artifact stores per-model summary metrics only. Profile-level slices are not persisted for the bakeoff.'],
    largestMisses: report.failures.length > 0
      ? [
          '| Model | Failure |',
          '| --- | --- |',
          ...report.failures.map((failure) => `| \`${failure.modelId}\` | ${failure.error.replace(/\n+/g, ' ')} |`),
        ]
      : ['This artifact stores per-model summary metrics only. Case-level miss lists are not persisted for the bakeoff.'],
    howToRead: [
      '- Main cross-validated MAE is the primary fairness metric for corpus fit.',
      '- Hard-negative cross-validated MAE shows resistance to topical over-scoring.',
      '- Payload size, load time, and total time matter because these candidates are intended for local CLI and local-runtime scoring.',
    ],
  })
}

function renderTemplate(input: {
  title: string
  command: string
  atAGlance: string[]
  topLineMetrics: string[]
  corpusShape: string[]
  byDomain: string[]
  byProfile: string[]
  largestMisses: string[]
  howToRead: string[]
}) {
  return [
    `# ${input.title}`,
    '',
    `This page is generated by \`${input.command}\`.`,
    '',
    '## Update Command',
    '',
    '```bash',
    input.command,
    '```',
    '',
    '## At A Glance',
    '',
    ...input.atAGlance.map((line) => `- ${line}`),
    '',
    '## Top-Line Metrics',
    '',
    ...input.topLineMetrics,
    '',
    '## Corpus Shape',
    '',
    ...input.corpusShape,
    '',
    '## By Domain',
    '',
    ...input.byDomain,
    '',
    '## By Profile',
    '',
    ...input.byProfile,
    '',
    '## Largest Misses',
    '',
    ...input.largestMisses,
    '',
    '## How To Read This Page',
    '',
    ...input.howToRead,
    '',
  ].join('\n')
}

function renderGroupTable(label: string, groups: GroupSummary[]) {
  if (groups.length === 0) {
    return [`This artifact does not persist ${label.toLowerCase()}-level slices.`]
  }

  return [
    '| ' + label + ' | Count | MAE | Reference Avg | App Avg |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...groups.map((group) => `| ${toTitle(group.name)} | ${group.count} | ${formatNumber(group.meanAbsoluteError)} | ${formatNumber(group.averageReference)} | ${formatNumber(group.averageApp)} |`),
  ]
}

function renderMissTable(misses: MissSummary[]) {
  if (misses.length === 0) {
    return ['This artifact does not persist case-level miss rows.']
  }

  return [
    '| Case | Reference Overall | App Overall | Diff | Absolute Diff |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...misses.slice(0, 12).map((item) => `| \`${item.id}\` | ${formatNumber(item.referenceOverall)} | ${formatNumber(item.appOverall)} | ${formatSignedNumber(item.diff)} | ${formatNumber(item.absDiff)} |`),
  ]
}

function renderAdaptiveMissTable(misses: AdaptiveTopRegression[]) {
  if (misses.length === 0) {
    return ['This artifact does not persist case-level miss rows.']
  }

  return [
    '| Case | Reference Overall | App Overall | Diff | Absolute Diff |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...misses.slice(0, 12).map((item) => `| \`${item.id}\` | ${formatNumber(item.referenceOverall)} | ${formatNumber(item.finalOverall)} | ${formatSignedNumber(item.diff)} | ${formatNumber(item.absDiff)} |`),
  ]
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
    })[0] ?? baseline
}

function bestWordingVariant(report: WordingReport) {
  return [...report.variantSummaries]
    .filter((item) => item.variant !== 'baseline')
    .sort((left, right) => right.averageImprovement - left.averageImprovement)[0]
}

function compactSummary(summary: BenchmarkSummary, caseCount: number) {
  return {
    meanAbsoluteError: benchmarkResultsValue(summary.meanAbsoluteError),
    medianAbsoluteError: benchmarkResultsValue(summary.medianAbsoluteError),
    within10: `${summary.within10}/${caseCount}`,
    within20: `${summary.within20}/${caseCount}`,
  }
}

function benchmarkResultsValue(value: number) {
  return Number(formatNumber(value))
}

function formatNumber(value: number) {
  const rounded = round(value)
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function formatSignedNumber(value: number) {
  const formatted = formatNumber(Math.abs(value))
  if (value > 0) {
    return `+${formatted}`
  }
  if (value < 0) {
    return `-${formatted}`
  }
  return '0'
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

function formatDuration(valueMs: number) {
  if (valueMs >= 60_000) {
    const minutes = Math.floor(valueMs / 60_000)
    const seconds = (valueMs % 60_000) / 1000
    return `${minutes}m ${round(seconds)}s`
  }

  return `${round(valueMs / 1000)}s`
}
