# Benchmark History

This document consolidates the benchmark history for the browser quality scorer so the project has one place to read the tuning timeline, the current benchmark state, and the model comparison results.

Supporting artifacts:

- [benchmark-report.md](./benchmark-report.md)
- [hard-negative-report.md](./hard-negative-report.md)
- [adaptive-refinement-report.md](./adaptive-refinement-report.md)
- [scoring-improvement-iterations.md](./scoring-improvement-iterations.md)
- [model-bakeoff.md](./model-bakeoff.md)
- [wording-experiments.md](./wording-experiments.md)
- [adaptive-refinement-results.json](./adaptive-refinement-results.json)
- [benchmark-results.json](./benchmark-results.json)
- [model-bakeoff.json](./model-bakeoff.json)
- [wording-experiments.json](./wording-experiments.json)

## Benchmark Sets

- Main benchmark:
  100 manually judged cases spanning `advice`, `comparison`, and `planning`, with profiles including `strong`, `partial`, `concise`, `off_topic`, and `constraint_miss`.
- Hard-negative benchmark:
  100 synthetic weak-answer cases derived from the same questions. These are topical but low-quality answers designed to expose over-scoring.

## Metric Conventions

- `MAE`: mean absolute error against the reference score.
- `Median`: median absolute error.
- `Within 10`: number of cases within 10 points of the reference score.
- `Within 20`: number of cases within 20 points of the reference score.
- `Cross-validated` is the fairest calibration-aware metric to compare across scorer variants and models.
- `Runtime calibrated` is the optimistic metric the shipped app would display after fitting calibration on the full benchmark set.

## Scorer Tuning Timeline

### Historical Baseline

This was the early reference point before the more recent scorer work:

| Stage | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Historical baseline | 14.7 | 10.9 | 48/100 | 70/100 |

### Iteration 0: Starting Point For The Current Tuning Pass

| Stage | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw | 12.5 | 9.2 | 54/100 | 71/100 |
| Cross-validated calibrated | 10.5 | 9.5 | 51/100 | 84/100 |
| Runtime calibrated | 9.4 | 8.5 | 57/100 | 90/100 |

### Iteration 6: Best Fair Main-Benchmark Result During Tuning

This was the point where the extra overall calibration layer delivered a real win on the fair benchmark:

| Stage | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw | 12.5 | 9.2 | 54/100 | 71/100 |
| Cross-validated calibrated | 9.7 | 7.7 | 56/100 | 85/100 |
| Runtime calibrated | 7.6 | 5.7 | 64/100 | 94/100 |

### Iteration 7: Hard-Negative Coverage Added

This did not change the shipped scorer. It expanded evaluation coverage:

| Benchmark | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Hard-negative challenge | 35.2 | 35.1 | 0/100 | 0/100 |

### Iteration 8: Previous Shipped Scorer State On `Xenova/nli-deberta-v3-small`

This was the kept scorer stack before the baseline model switch, while the app still used `Xenova/nli-deberta-v3-small`.

Main benchmark:

| Stage | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw | 12.1 | 7.3 | 59/100 | 72/100 |
| Cross-validated calibrated | 10.1 | 9.6 | 52/100 | 84/100 |
| Runtime calibrated | 8.0 | 6.1 | 59/100 | 94/100 |

Hard-negative benchmark:

| Benchmark | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Hard-negative challenge | 24.4 | 24.1 | 0/100 | 2/100 |

Interpretation:

- The previous shipped scorer was slightly worse than Iteration 6 on the main fair benchmark.
- It is materially better than Iteration 6 on the hard-negative failure mode we were targeting.
- The main residual gap is still generic but topical weak answers and some constraint handling.

### Baseline Model Switch: `Xenova/nli-deberta-v3-xsmall`

After the bakeoff, the app baseline and local bundle were switched from `Xenova/nli-deberta-v3-small` to `Xenova/nli-deberta-v3-xsmall`, then the benchmark and calibration pipeline were rerun.

Main benchmark on the new baseline:

| Stage | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw | 7.7 | 4.6 | 77/100 | 88/100 |
| Cross-validated calibrated | 8.8 | 6.9 | 61/100 | 87/100 |
| Runtime calibrated | 7.4 | 5.3 | 68/100 | 92/100 |

Hard-negative benchmark on the new baseline:

| Benchmark | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Runtime calibrated hard-negative challenge | 17.5 | 16.3 | 4/100 | 73/100 |

Interpretation:

- The model switch is a real improvement, not a marginal one.
- It improves both the main benchmark and the hard-negative benchmark.
- It also reduces the bundled q8 payload from `164.5 MB` to `83.2 MB`.

### Low-Latency Structure Pass

After the model switch, I evaluated three new low-latency additions:

- deterministic constraint checks
- task-type structure checks
- criterion normalization

Only the task-type structure checks were kept in the shipped default.

Iteration results are documented in [low-latency-iterations.md](./low-latency-iterations.md).

Current shipped default on `Xenova/nli-deberta-v3-xsmall` with task-type structure checks enabled:

Main benchmark:

| Stage | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw | 7.1 | 5.2 | 69/100 | 93/100 |
| Cross-validated calibrated | 8.8 | 7.8 | 57/100 | 91/100 |
| Runtime calibrated | 7.4 | 6.3 | 67/100 | 96/100 |

Hard-negative benchmark:

| Benchmark | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Runtime calibrated hard-negative challenge | 15.9 | 14.8 | 7/100 | 79/100 |

Interpretation:

- deterministic constraint checks were effectively neutral and were left off
- task-type structure checks materially improved the hard-negative benchmark
- criterion normalization improved the fair benchmark but regressed hard negatives sharply, so it remains opt-in rather than default

### Adaptive Balanced Mode

After the explicit quick-only mode shipped, I evaluated whether the default balanced mode should selectively skip the full pass when the fast pass already looks decisive.

Result:

- the only adaptive policy that held up was a conservative low-stop rule
- selected config: `overall <= 10`, `answerSupport <= 0.25`, `max criterion <= 15`
- this skips the full pass for obvious failures only
- measured combined skip rate: `9%`
- main benchmark MAE stayed at `5.8`
- hard-negative MAE stayed at `18.1`
- the more aggressive high-stop variants did not survive the benchmark sweep

Interpretation:

- adaptive refinement is worth keeping, but only as an obvious-failure guard
- it improves perceived responsiveness for clearly unrelated or junk answers
- it does not create a large overall reduction in full-pass work because strong, concise, comparison, and constraint-sensitive answers still need the deeper pass

See [adaptive-refinement-report.md](./adaptive-refinement-report.md) for the full sweep and selected threshold config.

## Current Scorer Comparison Summary

This table compares the most important checkpoints:

| Checkpoint | Main CV MAE | Main CV Median | Main CV Within 10 | Main CV Within 20 | Hard-Negative Benchmark MAE |
| --- | ---: | ---: | ---: | ---: | ---: |
| Historical baseline | 14.7 | 10.9 | 48/100 | 70/100 | n/a |
| Iteration 0 baseline | 10.5 | 9.5 | 51/100 | 84/100 | n/a |
| Iteration 6 best fair main benchmark | 9.7 | 7.7 | 56/100 | 85/100 | 35.2 |
| Iteration 8 previous shipped scorer on `small` | 10.1 | 9.6 | 52/100 | 84/100 | 24.4 |
| Post-switch shipped scorer on `xsmall` | 8.8 | 6.9 | 61/100 | 87/100 | 17.5 |
| Current shipped scorer on `xsmall` + structure checks | 8.8 | 7.8 | 57/100 | 91/100 | 15.9 |

## Model Bakeoff

The bakeoff compared the current shipped scorer stack across five client-side q8 model candidates.

Cross-validated results:

| Model | q8 size | Main MAE | Main median | Main within 10 | Main within 20 | Hard MAE | Hard median | Hard within 10 | Hard within 20 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Xenova/nli-deberta-v3-xsmall | 83.2 MB | 8.8 | 6.9 | 61/100 | 87/100 | 17.6 | 16.4 | 4/100 | 73/100 |
| Xenova/nli-deberta-v3-small | 164.5 MB | 10.1 | 9.6 | 52/100 | 84/100 | 24.5 | 23.9 | 0/100 | 2/100 |
| Xenova/deberta-v3-base-tasksource-nli | 233.0 MB | 10.4 | 8.7 | 56/100 | 83/100 | 23.3 | 22.7 | 0/100 | 10/100 |
| MoritzLaurer/ModernBERT-base-zeroshot-v2.0 | 143.9 MB | 29.8 | 27.7 | 30/100 | 45/100 | 13.0 | 11.8 | 44/100 | 74/100 |
| onnx-community/distilbart-mnli-12-3-ONNX | 246.2 MB | 37.3 | 41.4 | 24/100 | 28/100 | 14.0 | 14.6 | 38/100 | 65/100 |

Interpretation:

- `Xenova/nli-deberta-v3-xsmall` is the best overall candidate in the current scorer setup.
- It beats the current `Xenova/nli-deberta-v3-small` baseline on both the main benchmark and the hard-negative benchmark.
- It also cuts the q8 payload roughly in half.
- `ModernBERT-base-zeroshot-v2.0` is strong on hard negatives but collapses on the main benchmark, so it is not a clean replacement.
- `deberta-v3-base-tasksource-nli` is larger than the current baseline without a meaningful overall win.
- `distilbart-mnli-12-3-ONNX` is not competitive in this setup.

## Current Recommendation

The baseline-model recommendation has already been applied:

1. Keep `Xenova/nli-deberta-v3-xsmall` as the default local/browser baseline.
2. Keep task-type structure checks enabled in the default scorer.
3. Keep deterministic constraint checks and criterion normalization as opt-in only.
4. Use the current `xsmall` + structure-check benchmark as the baseline for any future scorer or model work.

That recommendation is based on measured results, not model-card assumptions:

- smaller payload: `83.2 MB` vs `164.5 MB`
- better main cross-validated MAE: `8.8` vs `10.1`
- better hard-negative benchmark MAE: `15.9` vs `24.4`

## Wording Experiment Summary

After the switch to `xsmall`, I ran a targeted wording experiment on 16 poorly performing benchmark cases to test whether changing question wording and criterion wording can materially improve the score without changing the model.

Aggregate result on those 16 hard cases:

| Variant | MAE | Median | Avg improvement vs baseline | Improved cases | Worsened cases |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline wording | 18.9 | 19.7 | 0.0 | 0 | 0 |
| Question rewritten only | 16.6 | 16.7 | 2.3 | 5 | 10 |
| Criteria rewritten only | 13.7 | 13.5 | 5.2 | 13 | 2 |
| Question and criteria rewritten | 10.3 | 11.8 | 8.7 | 13 | 2 |

Pattern takeaways:

- For strong under-scored answers, rewriting both the question and the criteria was the best strategy.
- For concise under-scored answers, rewriting the question alone often helped a lot because it made the short-answer format explicit.
- For constraint-over-scored cases, rewriting the question alone usually made things worse.
- For those same constraint cases, rewriting criteria to name the exact priority or forbidden move was more reliable than rewriting the question.

Practical implication:

- If the user wants better scoring, the safest improvement is usually not “make the question longer.”
- The safer improvement is:
  - keep the question clear and explicit
  - rewrite the criteria so they name the exact factors and constraints the answer should satisfy
- The strongest general pattern in this experiment was to combine:
  - an explicit `goal + constraint` question
  - criteria that name the concrete factors directly instead of using generic rubric labels

## Regeneration Commands

Use these commands to refresh the benchmark artifacts:

```bash
bun scripts/run-benchmark.ts
bun scripts/run-hard-negative-benchmark.ts
bun scripts/run-model-bakeoff.ts
bun scripts/run-wording-experiments.ts
bun scripts/run-low-latency-iterations.ts
```
