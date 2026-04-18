# Browser Quality Scorer

Reusable browser-side response scoring package for:

- model loading with `@huggingface/transformers`
- zero-shot criterion scoring
- task-aware structure checks
- worker-backed scoring clients
- context-budget estimation

## Install From GitHub

This repo stays a monorepo, so the installable package is published to a dedicated GitHub branch and matching package tags instead of the default source branch.

Latest stable package snapshot:

```bash
npm install github:omarmir/quality-meter#package-release
bun add github:omarmir/quality-meter#package-release
```

Pinned stable package snapshot:

```bash
npm install github:omarmir/quality-meter#pkg-v0.1.0
bun add github:omarmir/quality-meter#pkg-v0.1.0
```

Notes:

- `package-release` is the moving latest-stable ref.
- `pkg-vX.Y.Z` tags are immutable version-style refs for pinned installs.
- the Git-installable package includes the local model assets, so installs are materially heavier than a code-only package.

## Main API

```ts
import {
  createTransformersQualityScorer,
  createQualityScorerWorkerClient,
  decideQualityRefinement,
  estimateQualityContextBudget,
  QUALITY_SCORE_BANDS,
  QUALITY_SCORE_TONE_BY_BAND,
  resolveQualityScorePresentation,
} from '@browser-quality-scorer/core'
```

## Direct Usage

```ts
const scorer = createTransformersQualityScorer({
  modelId: 'Xenova/nli-deberta-v3-xsmall',
  dtype: 'q8',
  modelSource: {
    mode: 'local',
    localModelPath: '/models/',
    revision: 'main',
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

String criteria still work. If you pass criterion objects, `weight` is a relative positive number, so a criterion with `weight: 4` counts twice as much toward `overallPercent` as a criterion with `weight: 2`. The returned `breakdown` includes both `weight` and `weightShare`.

The returned score result also includes display-oriented band metadata:

- `band`: `off_track | mixed_fit | strong_fit`
- `tone`: `error | warning | success`
- `QUALITY_SCORE_BANDS`: stable band ordering for UI maps
- `QUALITY_SCORE_TONE_BY_BAND`: stable tone map keyed by band

Products should map those language-agnostic band values to their own localized labels and summaries.

If you already have only a numeric score and want the same band/tone metadata outside the scorer result, you can resolve it directly:

```ts
const presentation = resolveQualityScorePresentation(result.overallPercent)
console.log(presentation.band) // "strong_fit"
console.log(QUALITY_SCORE_TONE_BY_BAND[presentation.band]) // "success"
```

## Worker Usage

Main thread:

```ts
const client = createQualityScorerWorkerClient({
  config: {
    modelId: 'Xenova/nli-deberta-v3-xsmall',
    dtype: 'q8',
    modelSource: {
      mode: 'local',
      localModelPath: '/models/',
      revision: 'main',
    },
  },
  createWorker: () => new Worker(new URL('./quality.worker.ts', import.meta.url), { type: 'module' }),
})

await client.loadModel()
const result = await client.score({ question, response, criteria })
```

## Adaptive Refinement Helper

If your UI uses a fast pass plus an optional full pass, the package exposes the same helper the demo app uses:

```ts
import { decideQualityRefinement } from '@browser-quality-scorer/core'

const fastResult = await client.score({ question, response, criteria }, { mode: 'fast' })
const decision = decideQualityRefinement({
  fastResult,
  question,
  response,
  criteria,
})

if (decision.shouldRunFullPass) {
  const fullResult = await client.score({ question, response, criteria }, { mode: 'full' })
}
```

Current default behavior:

- skip the full pass only for clearly off-track fast results
- keep the full pass for mid-band, comparison, planning, and constraint-sensitive cases
- do not assume stable high scores are safe to skip by default

Worker entry:

```ts
/// <reference lib="webworker" />
import { registerQualityScorerWorker } from '@browser-quality-scorer/core/worker-runtime'

registerQualityScorerWorker()
```

## Model Source Modes

```ts
modelSource: {
  mode: 'local' | 'url' | 'huggingface',
  localModelPath: '/models/',
  remoteHost: 'https://huggingface.co/',
  remotePathTemplate: '{model}/resolve/{revision}/',
  revision: 'main',
  useBrowserCache: 'auto',
}
```

- `local`: load from bundled/same-origin assets only
- `url`: load from a custom remote host using `remoteHost + remotePathTemplate`
- `huggingface`: load from the Hugging Face Hub

## Low-Latency Layers

```ts
lowLatency: {
  useDeterministicConstraintChecks: false,
  useTaskStructureChecks: true,
  useCriterionNormalization: false,
}
```

Defaults:

- task-type structure checks are enabled
- deterministic constraint checks are available but off by default
- criterion normalization is available but off by default
- adaptive refinement defaults to a conservative low-stop-only policy

Rationale:

- structure checks improved the shipped hard-negative benchmark without materially hurting the fair benchmark
- deterministic constraint checks were effectively neutral in the current corpus
- criterion normalization improved the fair benchmark but regressed hard negatives too sharply to enable by default
- adaptive refinement only held up as an obvious-failure stop, so the default does not skip strong results just because the fast score is high

## Authoring Guidance

If you are building a product on top of this library, prompt and criterion wording matter a lot.

Start here:

- [AUTHORING_GUIDE.md](./AUTHORING_GUIDE.md)
- [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md)

Short version:

- write questions with explicit goals and constraints
- keep criteria short and single-purpose
- name the exact factor you care about instead of using vague rubric labels
- if a constraint matters, make it a criterion too

Example:

Instead of:

- `Respects the stated constraints`

Prefer:

- `Avoids recommending replacement hardware or a full equipment swap`
- `Fits around full-time work instead of assuming large blocks off`
- `Keeps the plan knee-friendly and avoids aggravating knee pain`
