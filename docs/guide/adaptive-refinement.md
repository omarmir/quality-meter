# Adaptive Refinement

This page summarizes the benchmark sweep for adaptive refinement: fast pass first, then full pass only when needed.

## Goal

The goal was to reduce latency without damaging score quality.

In practice, that means:

- skip the full pass when the fast result is already decisive
- preserve full-pass behavior on ambiguous or high-stakes cases

## Outcome

The only policy that held up was a conservative low-stop rule.

Selected policy:

- skip only for obvious failures
- do not skip strong or mid-band answers
- do not rely on aggressive high-stop rules

## Selected Policy Metrics

| Metric | Value |
| --- | ---: |
| Combined full-pass skip rate | 9% |
| Main benchmark skip rate | 18% |
| Hard-negative skip rate | 0% |
| Main benchmark MAE | 5.8 |
| Hard-negative MAE | 18.1 |
| Strong-profile MAE | 6.6 |
| Off-topic average score | 0.3 |

## Selected Threshold Shape

The kept configuration is effectively:

- `overall <= 10`
- `answerSupport <= 0.25`
- `max criterion <= 15`

That means the fast pass can end the process only when the answer already looks clearly off track.

## Why The Conservative Policy Won

- It improves perceived responsiveness for obvious junk or unrelated answers.
- It avoids introducing regressions on concise, strong, comparison, and constraint-sensitive cases.
- More aggressive “high-stop” policies did not survive the benchmark sweep.

## Main Benchmark Snapshot

| Kind | Count | MAE |
| --- | ---: | ---: |
| Advice | 35 | 5.9 |
| Comparison | 35 | 5.0 |
| Planning | 30 | 6.6 |

## Hard-Negative Snapshot

| Kind | Count | MAE |
| --- | ---: | ---: |
| Advice | 35 | 19.0 |
| Comparison | 35 | 18.6 |
| Planning | 30 | 16.5 |

## Takeaways

- Adaptive refinement is worth keeping as an obvious-failure guard.
- It is not a major global latency win.
- The benchmark supports a narrow rule, not a broad “skip full pass when score looks good” strategy.
