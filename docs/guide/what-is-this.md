# What Is This?

`@browser-quality-scorer/core` is a quality scoring library for scoring a response against a small rubric of criteria.

It is designed for cases where you have:

- a question or task
- a candidate response
- a few criteria that describe what a good answer should do, optionally with weights

The library scores the response against those criteria and returns both an overall score and a per-criterion breakdown.

## What It Does

At a high level, the package gives you:

- model loading with `@huggingface/transformers`
- zero-shot criterion scoring
- worker-backed scoring clients
- fast and full scoring modes
- adaptive refinement decisions
- context-budget estimation
- task-aware structure checks and weak-answer gating

The main package exports include:

```ts
import {
  createTransformersQualityScorer,
  createQualityScorerWorkerClient,
  decideQualityRefinement,
  estimateQualityContextBudget,
} from '@browser-quality-scorer/core'
```

## Typical Use

You provide:

```ts
{
  question: 'How can I improve my home Wi-Fi speed without replacing all my equipment?',
  response: 'Move the router to a central spot and retest before buying hardware.',
  criteria: [
    { label: 'Answers the question directly', weight: 4 },
    { label: 'Provides concrete, practical steps', weight: 4 },
    { label: 'Avoids recommending replacement hardware', weight: 2 }
  ]
}
```

Criteria can be plain strings or `{ label, weight }` objects. Plain strings default to weight `1`, and weighted criteria affect the final overall aggregation.

And the scorer returns:

- an overall score based on the weighted criterion average
- per-criterion scores with weight metadata
- answer support and gating signals
- calibrated percentages for display

## Runtime Model

The library supports two main usage patterns.

### Direct scorer

Use `createTransformersQualityScorer(...)` if you want to load the model and score directly in the current runtime or thread.

That path is not limited to the browser. It can also run server-side in runtimes that support `@huggingface/transformers` and the required model-loading and inference dependencies.

### Worker-backed scorer

Use `createQualityScorerWorkerClient(...)` if you want to keep model loading and scoring inside a Web Worker so the UI stays responsive.

This is the pattern used by the example app and docs example.

Worker entry:

```ts
/// <reference lib="webworker" />
import { registerQualityScorerWorker } from '@browser-quality-scorer/core/worker-runtime'

registerQualityScorerWorker()
```

## Fast Pass And Full Pass

The scorer supports two scoring modes:

- `fast`: a lighter pass for quick feedback
- `full`: a more thorough pass

If your UI wants both speed and stability, the package also exposes `decideQualityRefinement(...)`.

That lets you:

1. run a fast pass first
2. inspect whether the fast result is clearly off-track or still ambiguous
3. run the full pass only when needed

This is the adaptive refinement flow used in the demo.

## How It Scores

The library is not just checking whether the response shares words with a criterion. The scorer adds several layers to make rubric scoring more usable:

- Question-aware premise: the question and response are evaluated together so context-dependent checks use the actual prompt.
- Positive and negative hypotheses: each criterion is rewritten into both support and contradiction forms.
- Prompt ensemble: multiple generic phrasings are used so one brittle wording matters less.
- Chunked evidence search: the scorer checks both the whole response and smaller evidence chunks.
- Answer-validity gate: weak or incoherent answers can have their scores suppressed.
- Constraint gate: responses can be penalized when they appear to ignore explicit boundaries in the question.
- Uncertainty shrinkage: disagreement across prompt variants reduces confidence.
- Monotonic calibration: criterion and overall scores are calibrated for display.
- Weak-answer gate: generic but vaguely relevant answers can still be pushed down.
- Context-budget guard: the package estimates whether the prompt plus rubric are getting too large for the model.
- Adaptive refinement: the full pass runs only when the fast pass does not already look decisively resolved.

## Model Sources

The scorer supports three model source modes:

- `local`: load bundled or same-origin assets
- `url`: load from a custom remote host
- `huggingface`: load directly from the Hugging Face Hub

That makes it usable in local demos, browser apps, server-side deployments, and setups that host model files separately.

## What This Library Is Good For

This package is a good fit when you want:

- rubric scoring for narrative answers
- local evaluation without a dedicated scorer service
- a responsive UI with worker-backed inference
- quick first-pass feedback with an optional refine step
- a reusable scoring primitive for product or experiment work

## What It Is Not

This is not a general-purpose judge model or a guaranteed source of truth.

It is a small scoring system for rubric-based answer evaluation. Prompt wording, criterion wording, constraints, and task framing all matter. If you are building a real product on top of it, the authoring guidance and known limitations still matter as much as the raw runtime API.
