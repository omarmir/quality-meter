# API

This page describes the public package API for `@browser-quality-scorer/core`.

## Installation

```bash
bun add @browser-quality-scorer/core
```

Peer dependency:

```bash
bun add @huggingface/transformers
```

## Package Exports

Main entry:

```ts
import {
  createTransformersQualityScorer,
  createQualityScorerWorkerClient,
  decideQualityRefinement,
  estimateQualityContextBudget,
  resolveQualityScorerConfig,
  computeCalibratedOverallScore,
  QUALITY_SCORE_BANDS,
  QUALITY_SCORE_TONE_BY_BAND,
  resolveQualityScorePresentation,
  DEFAULT_QUALITY_SCORER_CONFIG,
  DEFAULT_ADAPTIVE_REFINEMENT_CONFIG,
} from '@browser-quality-scorer/core'
```

Worker entry:

```ts
import { registerQualityScorerWorker } from '@browser-quality-scorer/core/worker-runtime'
```

## Core Types

### `QualityCriterionInput`

```ts
type QualityCriterionInput =
  | string
  | {
      label: string
      weight?: number
    }
```

You can pass criteria either as plain strings or weighted objects.

- plain strings default to weight `1`
- object weights are relative positive numbers and are normalized internally for the overall score

### `QualityScoreInput`

```ts
type QualityScoreInput = {
  question?: string
  response: string
  criteria: QualityCriterionInput[]
}
```

This is the main scoring input.

- `question` is optional, but recommended
- `response` is the answer being evaluated
- `criteria` is the rubric as either short criterion strings or `{ label, weight }` objects

### `QualityScoreOptions`

```ts
type QualityScoreOptions = {
  mode?: 'fast' | 'full'
}
```

- `fast` is the lightweight pass
- `full` is the more thorough pass

### `QualityScoreResult`

```ts
type QualityScoreResult = {
  criteria: string[]
  weightedCriteria: QualityWeightedCriterion[]
  normalizedCriteria: string[]
  scores: number[]
  rawScores: number[]
  gate: number
  answerSupport: number
  constraintPresence: number
  constraintRespect: number
  deterministicConstraintPresence: number
  deterministicConstraintRespect: number
  structuralScore: number
  topicAlignment: number
  taskType: QualityTaskType
  overallRaw: number
  weakAnswerGate: number
  overallAdjustedRaw: number
  overallCalibrated: number
  overallPercent: number
  band: QualityScoreBand
  tone: QualityScoreTone
  breakdown: QualityCriterionScore[]
}
```

Important fields:

- `overallPercent`: display-oriented overall score based on the weighted criterion average before gating and calibration
- `band`: stable machine-oriented band key for product logic
- `tone`: display tone aligned with the band
- `weightedCriteria`: the resolved input criteria with explicit weights
- `breakdown`: per-criterion scores plus weight metadata
- `answerSupport`: how strongly the response appears to actually answer the question
- `topicAlignment`: how strongly the answer still appears to be about the same subject as the question and rubric
- `weakAnswerGate`: suppression factor for weak or generic answers
- `taskType`: inferred task class used by low-latency checks

### `QUALITY_SCORE_BANDS`

```ts
const QUALITY_SCORE_BANDS = ['off_track', 'mixed_fit', 'strong_fit']
```

### `QualityScoreBand`

```ts
type QualityScoreBand = 'off_track' | 'mixed_fit' | 'strong_fit'
```

### `QualityScoreTone`

```ts
type QualityScoreTone = 'error' | 'warning' | 'success'
```

### `resolveQualityScorePresentation(overallPercent)`

```ts
const presentation = resolveQualityScorePresentation(result.overallPercent)

presentation.band
presentation.tone
```

Use this when you only have an `overallPercent` and want the same language-agnostic band/tone metadata that the scorer includes on `QualityScoreResult`.

### `QualityWeightedCriterion`

```ts
type QualityWeightedCriterion = {
  label: string
  weight: number
}
```

`weight` is the resolved positive relative weight that the scorer used for overall aggregation.

### `QualityCriterionScore`

```ts
type QualityCriterionScore = {
  label: string
  weight: number
  weightShare: number
  raw: number
  percent: number
}
```

`weightShare` is the normalized `0..1` share of total criterion weight.

### `QualityContextBudget`

```ts
type QualityContextBudget = {
  evaluationText: string
  estimatedPremiseTokens: number
  safePremiseTokenBudget: number
  safePremiseCharBudget: number
  isNearLimit: boolean
  isOverLimit: boolean
}
```

Use this before scoring if you need to warn users when the question and response are getting too large for the model budget.

## Configuration

### `QualityScorerConfigInput`

```ts
type QualityScorerConfigInput = {
  modelId?: string
  dtype?: 'auto' | 'q8' | 'fp32' | 'fp16' | 'int8' | 'uint8' | 'q4' | 'bnb4' | 'q4f16'
  hypothesisTemplate?: string
  modelSource?: Partial<QualityModelSourceConfig>
  limits?: Partial<QualityBudgetConfig>
  lowLatency?: Partial<QualityLowLatencyConfig>
  criterionCalibration?: CalibrationCurve | null
  overallCalibration?: CalibrationCurve | null
}
```

### `QualityModelSourceConfig`

```ts
type QualityModelSourceConfig = {
  mode: 'local' | 'url' | 'huggingface'
  localModelPath: string
  remoteHost: string
  remotePathTemplate: string
  revision: string
  useBrowserCache: boolean | 'auto'
}
```

Supported source modes:

- `local`: same-origin or bundled model assets
- `url`: custom remote host
- `huggingface`: Hugging Face Hub

### `QualityLowLatencyConfig`

```ts
type QualityLowLatencyConfig = {
  useDeterministicConstraintChecks: boolean
  useTaskStructureChecks: boolean
  useCriterionNormalization: boolean
}
```

### Defaults

```ts
DEFAULT_QUALITY_SCORER_CONFIG
DEFAULT_ADAPTIVE_REFINEMENT_CONFIG
```

The default scorer config currently uses:

- `modelId: 'Xenova/nli-deberta-v3-xsmall'`
- `dtype: 'q8'`
- `modelSource.mode: 'local'`

## Direct Scorer API

### `createTransformersQualityScorer(config?)`

```ts
const scorer = createTransformersQualityScorer(config)
```

Returns a `QualityScorer`:

```ts
type QualityScorer = {
  readonly config: QualityScorerConfig
  loadModel(callbacks?: QualityScorerLoadCallbacks): Promise<void>
  score(input: QualityScoreInput, options?: QualityScoreOptions): Promise<QualityScoreResult>
  estimateBudget(input: QualityScoreInput): QualityContextBudget
  reset(nextConfig?: QualityScorerConfigInput): void
}
```

Example:

```ts
const scorer = createTransformersQualityScorer({
  modelSource: {
    mode: 'huggingface',
  },
})

await scorer.loadModel()

const result = await scorer.score({
  question: 'How can I improve my home Wi-Fi speed without replacing all my equipment?',
  response: 'Move the router to a central spot and retest before buying hardware.',
  criteria: [
    { label: 'Answers the question directly', weight: 4 },
    { label: 'Provides concrete, practical steps', weight: 4 },
    { label: 'Avoids recommending replacement hardware', weight: 2 },
  ],
})
```

## Worker Client API

### `createQualityScorerWorkerClient(options)`

```ts
const client = createQualityScorerWorkerClient({
  config,
  createWorker: () => new Worker(new URL('./quality.worker.ts', import.meta.url), { type: 'module' }),
  onModelStatus(event) {
    // loading / ready / error
  },
  onModelProgress(event) {
    // byte-level model progress
  },
})
```

Options:

```ts
type QualityScorerWorkerClientOptions = {
  config: QualityScorerConfigInput
  createWorker: () => Worker
  onModelStatus?: (event: QualityModelStatusEvent) => void
  onModelProgress?: (event: QualityModelProgressEvent) => void
}
```

Returned client:

```ts
type QualityScorerWorkerClient = {
  loadModel(nextConfig?: QualityScorerConfigInput): Promise<void>
  score(input: QualityScoreInput, options?: QualityScoreOptions): Promise<QualityScoreResult>
  estimateBudget(input: QualityScoreInput): QualityContextBudget
  reset(nextConfig?: QualityScorerConfigInput): Promise<void>
  terminate(): void
  getConfig(): QualityScorerConfig
}
```

Worker entry file:

```ts
/// <reference lib="webworker" />
import { registerQualityScorerWorker } from '@browser-quality-scorer/core/worker-runtime'

registerQualityScorerWorker()
```

## Adaptive Refinement API

### `decideQualityRefinement(input)`

```ts
const decision = decideQualityRefinement({
  fastResult,
  question,
  response,
  criteria,
  policy: 'adaptive',
})
```

Input:

```ts
{
  fastResult: QualityScoreResult
  question: string
  response: string
  criteria: QualityCriterionInput[]
  policy?: 'always' | 'adaptive' | 'never'
  config?: Partial<QualityAdaptiveRefinementConfig>
}
```

Output:

```ts
type QualityRefinementDecision = {
  shouldRunFullPass: boolean
  reason:
    | 'obvious_failure'
    | 'stable_strong'
    | 'mid_band'
    | 'constraint_risk'
    | 'task_risk'
    | 'quick_only'
    | 'always_full'
  riskBand: 'low' | 'medium' | 'high'
  fastOverallPercent: number
}
```

Typical usage:

```ts
const fastResult = await client.score(input, { mode: 'fast' })

const decision = decideQualityRefinement({
  fastResult,
  question: input.question ?? '',
  response: input.response,
  criteria: input.criteria,
  policy: 'adaptive',
})

if (decision.shouldRunFullPass) {
  const fullResult = await client.score(input, { mode: 'full' })
}
```

## Utility Functions

### `resolveQualityScorerConfig(config?)`

Resolves partial config into the full runtime config with defaults applied.

### `estimateQualityContextBudget(input, config?)`

Estimates whether your prompt and rubric are likely to exceed the safe model budget.

### `computeCalibratedOverallScore(input, config?)`

Computes the calibrated overall score from raw criterion scores plus answer-quality gating.

If you are using weighted criteria and call this utility directly, pass your own weighted `rawOverall`.

### `calibrateQualityOverall(score, config?)`

Applies overall calibration only.

### `getQualityModelSourceLocation(config?)`

Returns the resolved model location as a display-friendly string.

### `isRemoteModelSource(config?)`

Returns whether the current model source is remote rather than local.

## Model Status And Progress Events

### `QualityModelStatusEvent`

```ts
type QualityModelStatusEvent = {
  phase: 'idle' | 'loading' | 'ready' | 'error'
  message: string
}
```

### `QualityModelProgressEvent`

```ts
type QualityModelProgressEvent = {
  progress: number
  loaded: number
  total: number
  file?: string
}
```

## Minimal Worker Example

```ts
import { createQualityScorerWorkerClient, decideQualityRefinement } from '@browser-quality-scorer/core'

const client = createQualityScorerWorkerClient({
  config: {
    modelSource: { mode: 'huggingface' },
  },
  createWorker: () =>
    new Worker(new URL('./quality.worker.ts', import.meta.url), {
      type: 'module',
    }),
})

await client.loadModel()

const input = {
  question: 'How can I improve my home Wi-Fi speed without replacing all my equipment?',
  response: 'Move the router to a central spot and retest before buying hardware.',
  criteria: [
    { label: 'Answers the question directly', weight: 4 },
    { label: 'Provides concrete, practical steps', weight: 4 },
    { label: 'Avoids recommending replacement hardware', weight: 2 },
  ],
}

const fastResult = await client.score(input, { mode: 'fast' })
const decision = decideQualityRefinement({
  fastResult,
  question: input.question,
  response: input.response,
  criteria: input.criteria,
})

const finalResult = decision.shouldRunFullPass
  ? await client.score(input, { mode: 'full' })
  : fastResult
```

## Notes

- The direct scorer API can run in any runtime that supports `@huggingface/transformers` and the required model-loading and inference dependencies.
- The worker APIs are browser-specific because they rely on Web Workers.
- Worker-backed usage is the recommended path for interactive browser UIs.
- If you care about UX stability, use `fast` plus `decideQualityRefinement(...)` rather than always forcing `full`.
- If prompt length matters in your UI, call `estimateQualityContextBudget(...)` before scoring.
