# Scoring Improvement

This page condenses the scorer tuning log into the changes that mattered.

## Starting Point

Historical baseline:

| MAE | Median | Within 10 | Within 20 |
| ---: | ---: | ---: | ---: |
| 14.7 | 10.9 | 48/100 | 70/100 |

Iteration 0 baseline for this tuning pass:

| View | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw | 12.5 | 9.2 | 54/100 | 71/100 |
| Cross-validated calibrated | 10.5 | 9.5 | 51/100 | 84/100 |
| Runtime calibrated | 9.4 | 8.5 | 57/100 | 90/100 |

## What Was Tried

### Rolled Back

- stronger constraint gate
- narrower constraint gate
- aggregate constraint decomposition
- coverage-aware chunk aggregation
- stronger uncertainty shrinkage

These changes either regressed the fair benchmark or did not beat the baseline clearly enough to keep.

### Kept

- overall-score calibration layer
- hard-negative challenge benchmark
- weak-answer gate plus hard-negative-aware overall calibration

## Most Important Turning Point

Iteration 6, the added overall-score calibration layer, produced the cleanest fair-benchmark improvement.

| View | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw | 12.5 | 9.2 | 54/100 | 71/100 |
| Cross-validated calibrated | 9.7 | 7.7 | 56/100 | 85/100 |
| Runtime calibrated | 7.6 | 5.7 | 64/100 | 94/100 |

## Hard-Negative Coverage Changed Priorities

Iteration 7 did not change the shipped scorer. It added the hard-negative benchmark and showed the remaining weakness directly.

| Benchmark | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Hard-negative challenge | 35.2 | 35.1 | 0/100 | 0/100 |

That made it clear the scorer still badly over-scored generic topical answers.

## Later Tradeoff

Iteration 8 added the weak-answer gate and hard-negative-aware overall calibration.

Main benchmark:

| View | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Cross-validated calibrated | 10.1 | 9.6 | 52/100 | 84/100 |

Hard-negative benchmark:

| View | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Runtime calibrated | 24.4 | 24.1 | 0/100 | 2/100 |

This was not a clean universal win, but it materially improved the failure mode it targeted.

## Final Read

- Calibration delivered the clearest fair-benchmark improvement.
- Hard-negative resistance required a tradeoff.
- The tuning pass improved the scorer a lot, but generic weak answers still remain the core residual problem.
