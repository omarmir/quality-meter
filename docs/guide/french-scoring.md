# French Scoring

This page describes the most credible path for adding French scoring to the library.

## Summary

- Keep English on the current `Xenova/nli-deberta-v3-xsmall` baseline.
- Add French as a separate scoring profile instead of trying to force it through the English stack.
- Do not ship French on the current defaults without a dedicated benchmark and calibration pass.

The main reason is simple: the current system is not just using a model. It also relies on English-specific hypothesis generation, heuristics, and benchmark assumptions.

## Why A Separate Profile Is Needed

The project history is benchmark-first and English-first. The safest extension is to keep that pattern:

- new profile
- new benchmark
- new calibration
- no silent reuse of English assumptions

The existing reports already show how benchmark-driven the project is:

- [Benchmark history](/guide/reports-overview)
- [Wording experiments](/guide/wording-experiments)

## Current Blockers

French is blocked by structural assumptions in the scoring stack, not just by missing calibration.

### English hypothesis generation

Criterion hypotheses are currently derived with English-oriented sentence rules in `library/src/scoring.ts:212`.

That works for criteria like `Answers the question directly`, but French criteria such as `Repond directement a la question` do not naturally map through the same grammar logic.

### English lexical heuristics

Task detection, normalization, and low-latency cues are currently keyed off English words and phrases in `library/src/low-latency.ts:123`.

Examples include:

- task-type detection keywords
- structure cues
- comparison markers
- planning markers
- advice markers

### English constraint markers

Adaptive refinement still uses English-only constraint markers in `library/src/adaptive-refinement.ts:123`.

That means French constraint-sensitive questions would not be detected consistently.

### English-tied benchmark pipeline

The benchmark and calibration pipeline is currently hard-wired to the English baseline setup in `tools/scripts/run-benchmark.ts:73`.

Right now there is one default scorer path and one calibration flow, not a language-aware profile system.

## Proposed Direction

### Add explicit language profiles

Add a scorer config field:

```ts
language: 'en' | 'fr'
```

Each scorer or worker instance should stay single-language. The app should route requests to the right profile instead of trying to switch language behavior inside one loaded scorer instance.

### Keep English as-is

- `en`: keep `Xenova/nli-deberta-v3-xsmall`

This avoids destabilizing the current English benchmark.

### Start French on a separate model

- `fr`: start with `onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX`

The working assumption should be that French needs its own model profile unless the benchmark proves otherwise.

## Core Implementation Changes

### Structured criteria

Add structured criterion input so French can use explicit hypotheses instead of deriving everything from English-style rewriting:

```ts
type QualityCriterionInput =
  | string
  | {
      label: string
      positiveHypothesis?: string
      negativeHypothesis?: string
    }
```

For French, this is important. It lets the caller supply good French hypotheses directly.

### Internal language packs

Add internal language packs for:

- evaluation text markers
- answer-validity hypotheses
- constraint-presence and constraint-respect hypotheses
- task-type detection cues
- structure cues
- negation tokens
- stop words
- duration and constraint regexes
- adaptive-refinement constraint markers

### Conservative French defaults

French low-latency defaults should start conservative:

- `useTaskStructureChecks: false`
- `useDeterministicConstraintChecks: false`
- `useCriterionNormalization: false`

That avoids shipping English-biased heuristics under a French label.

### No translate-to-English runtime path

Translate-to-English should not be the primary runtime path.

It conflicts with the project’s local/browser-first design and adds another hidden failure surface:

- translation quality
- extra latency
- extra model or service dependency
- harder debugging when scores look wrong

## Benchmark And Calibration Work

French should ship only after it has its own benchmark and calibration flow.

### French benchmark shape

Mirror the English benchmark:

- 100 manually judged cases
- kinds: `advice`, `comparison`, `planning`
- profiles: `strong`, `partial`, `constraint_miss`, `concise`, `off_topic`

Also add:

- 100 French hard-negative cases
- a smaller French wording-experiment set

### Separate French calibration

French criterion calibration and overall calibration should be fit separately from English.

The generated output should become:

- a language-keyed calibration map, or
- per-language profile modules

### Script changes

Benchmark scripts should accept a language or profile target and emit per-profile reports instead of one global default path.

## Testing Plan

Add unit tests for:

- French hypothesis generation
- task-type detection
- constraint extraction
- duration parsing
- negation handling
- adaptive constraint markers

Add integration tests for:

- French corpus ordering, such as `strong > concise > partial > constraint_miss > off_topic`
- English regression safety when `language: 'en'`
- worker/client smoke tests with parallel English and French scorers

## Assumptions

- French is allowed to use a separate profile and a separate model.
- Initial French candidate: `onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX`
- If that model misses the French benchmark, replace the French profile model without changing English.

## Recommended Next Step

The immediate next step is not implementation polish. It is measurement.

Specifically:

1. add language-aware profile plumbing
2. build a native French benchmark and hard-negative set
3. run a first model probe with French-specific calibration disabled
4. only then decide whether the initial French model is good enough to justify deeper heuristic work

Without that benchmark pass, French would be guesswork.

## External References

- Current English baseline: <https://huggingface.co/cross-encoder/nli-deberta-v3-xsmall>
- Multilingual browser-ready candidate: <https://huggingface.co/onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX>
