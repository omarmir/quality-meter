# Hard Negative Benchmark

This page summarizes the synthetic hard-negative benchmark: 100 topical but weak answers designed to expose over-scoring.

## At A Glance

- Cases: `100`
- Runtime calibrated MAE: `15.9`
- Median absolute error: `14.8`
- Within 10 points: `7/100`
- Within 20 points: `79/100`

## Why This Benchmark Exists

The main benchmark is not enough on its own. A scorer can look reasonable on normal answers and still badly over-score generic, on-topic filler.

This benchmark stress-tests exactly that failure mode.

## Top-Line Metrics

| Metric | Value |
| --- | ---: |
| MAE | 15.9 |
| Median absolute error | 14.8 |
| Within 10 points | 7/100 |
| Within 20 points | 79/100 |

## By Kind

| Kind | Count | MAE | Reference Avg | App Avg |
| --- | ---: | ---: | ---: | ---: |
| Advice | 35 | 17.2 | 26.0 | 43.2 |
| Comparison | 35 | 16.4 | 27.5 | 43.9 |
| Planning | 30 | 13.8 | 23.3 | 37.1 |

## Failure Pattern

The weak answers in this set often:

- sound topical
- echo the task shape
- avoid saying anything obviously wrong
- still fail to give concrete, grounded help

Those answers should land low, but the scorer can still treat them as more useful than they are.

## Typical Misses

The worst misses cluster around generic template answers such as:

- vague “choose the stronger option” comparison replies
- vague “start with the main thing and adjust later” advice replies
- planning answers that imitate structure without adding substance

Examples called out in the original report include:

- `reading-device-constraint-miss-hard-negative`
- `email-backlog-partial-hard-negative`
- `winter-commute-constraint-miss-hard-negative`
- `wifi-partial-hard-negative`

## Takeaways

- This remains the clearest residual weakness in the scorer.
- The shipped low-latency structure checks help here, but they do not fully solve it.
- Any future scoring change should still be evaluated against this benchmark, not just the main corpus.
