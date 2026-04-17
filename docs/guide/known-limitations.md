# Known Limitations

This note documents the main weaknesses of the current default scorer stack so library users know what to expect.

These observations are based on the current default setup:

- model: `Xenova/nli-deberta-v3-xsmall`
- scorer: question-aware zero-shot NLI with calibration, weak-answer gating, and task-type structure checks
- benchmark: the handwritten English agreement-summary corpus in this repository

## High-Level Limitations

### Scores Are Useful Signals, Not Ground Truth

The scorer produces calibrated quality estimates. It does not produce a definitive rubric grade.

Use it for:

- ranking drafts
- surfacing weak answers
- rough quality meters
- automated feedback loops

Do not use it as the only authority for:

- high-stakes evaluation
- policy enforcement
- hiring or admissions decisions
- medical, legal, or financial judgment

### Performance Depends Heavily On Prompt And Criterion Wording

The scorer is sensitive to:

- question wording
- criterion wording
- whether constraints are explicit
- whether criteria are generic or concrete

This is why the package includes an [Authoring Guide](/guide/authoring).

## Current Failure Modes

### Strong Answers Can Still Be Under-Scored

This is one of the most common remaining issues.

Typical pattern:

- the answer is good
- the answer is concise or moderately implicit
- the scorer lands too low

The default benchmark still shows under-scoring on many `strong` answers.

### Generic Topical Answers Can Still Be Over-Scored

The scorer is better than it used to be, especially for clearly off-topic answers, but this failure mode still exists.

Typical pattern:

- the answer repeats the program purpose
- it sounds plausible
- it gives little concrete substance on targets or delivery
- it still receives a middling score

This is now the main residual error pattern in the handwritten 100-case benchmark.

### Adaptive Refinement Is Intentionally Conservative

The library now exposes an adaptive fast/full decision helper, and the demo app uses it in balanced mode.

Important:

- the kept default only skips the full pass for clearly off-track fast results
- it does not broadly skip high fast scores
- the benchmark sweep showed that aggressive high-stop policies were not reliable enough

So adaptive refinement helps responsiveness on obvious failures, but it is not a large latency win across all answer types.

### Constraint Handling Is Imperfect

The scorer can still miss cases where:

- the answer is on-topic
- the answer sounds coherent
- the answer quietly violates the user’s limits

Examples:

- ignoring a time budget
- ignoring portability limits
- recommending a forbidden move such as medication or buying hardware

Important:

- the package has a soft global constraint gate
- this is helpful, but it is not a hard rule engine
- if a constraint really matters, you should make it an explicit criterion

### Concise Answers Are Fragile

Very short but still good answers can be under-scored.

Why:

- the scorer uses a surface-length and segment-aware validity gate
- short answers provide less evidence for multiple criteria
- concise answers can look thinner than they really are

This is especially visible on two-step or “just give me the answer” prompts.

### Comparison Questions Are Sensitive To Missing Trade-Offs

A comparison answer can be penalized if it:

- makes a recommendation
- stays on-topic
- but does not clearly state trade-offs or decision axes

Comparison tasks benefit more than most from explicit criteria wording.

## Implementation-Level Constraints

### Token Budget Is Limited

The scorer uses a model with a finite context window. In the current defaults:

- token limit: `512`
- estimated chars per token: `4`

Long questions, long answers, or very long criteria can reduce scoring quality through truncation pressure.

Use `estimateQualityContextBudget(...)` before scoring if you need to guard against this.

### The Scorer Works Best In English

The current benchmark and calibration are English-first.

The package can still run on other languages depending on the chosen model, but the reported behavior and tuning in this repository should be treated as English-specific evidence.

### Calibration Is Model-Specific

The default calibration curves were fit for the current default scorer stack.

If you change:

- model
- dtype
- hypothesis behavior
- rubric style

then the old calibration may no longer be a good fit.

In that case you should rerun the benchmark and refit calibration.

## What Library Users Should Do

To reduce these weaknesses in real use:

1. Write explicit questions and criteria.
2. Make critical constraints their own criteria.
3. Avoid vague multi-purpose criteria.
4. Prefer concrete, observable rubric wording.
5. Use the score as a quality signal, not a final judgment.
6. If you change models, rerun benchmarks and recalibrate.

## Related Docs

- [Authoring Guide](/guide/authoring)
- [What Is This?](/guide/what-is-this)
- [API](/guide/api)
