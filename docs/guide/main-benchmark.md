# Main Benchmark

This page summarizes the current handwritten 300-case benchmark for the shipped scorer setup.

## At A Glance

- Cases: `300`
- Best display path: runtime calibrated scoring
- Runtime calibrated MAE: `4.3`
- Runtime calibrated median absolute error: `2.7`
- Runtime calibrated within 10 points: `270/300`
- Runtime calibrated within 20 points: `293/300`

## Top-Line Metrics

| View | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw scoring | 5.8 | 3.2 | 236/300 | 290/300 |
| Cross-validated calibrated | 4.4 | 2.7 | 269/300 | 293/300 |
| Runtime calibrated | 4.3 | 2.7 | 270/300 | 293/300 |

## Corpus Shape

The benchmark is a handwritten agreement-summary corpus:

- `75` scenarios
- `5` domains: workforce, health, housing, infrastructure, community
- `4` answer profiles per scenario: `bad`, `mixed`, `good`, `off_topic`

## By Domain

Runtime calibrated results:

| Domain | Count | MAE | Reference Avg | App Avg |
| --- | ---: | ---: | ---: | ---: |
| Community | 64 | 4.4 | 49.0 | 51.3 |
| Health | 56 | 4.2 | 49.1 | 49.3 |
| Housing | 64 | 3.9 | 49.1 | 50.6 |
| Infrastructure | 56 | 4.0 | 49.1 | 49.3 |
| Workforce | 60 | 4.8 | 49.0 | 51.1 |

## By Profile

Runtime calibrated results:

| Profile | Count | MAE | Reference Avg | App Avg |
| --- | ---: | ---: | ---: | ---: |
| Bad | 75 | 7.4 | 31.6 | 34.8 |
| Mixed | 75 | 5.3 | 68.0 | 69.0 |
| Good | 75 | 1.8 | 96.7 | 94.9 |
| Off topic | 75 | 2.6 | 0.0 | 2.6 |

## What The Numbers Say

- Off-topic detection is materially better than before the topic-alignment gate.
- `Good` answers now land very close to target on average.
- The remaining misses are still dominated by purpose-only `bad` answers that sound plausible enough to over-score.
- The stricter domain-agnostic specificity caps introduced a smaller secondary pattern of under-scored `mixed` answers that describe target categories and delivery methods without concrete counts.

## Biggest Miss Patterns

The largest misses in the benchmark are mostly:

- vague `bad` answers that still state the task’s core purpose clearly
- a smaller set of `mixed` answers that mention delivery and target categories but not concrete numbers
- a few residual off-topic cases that still keep some generic agreement-style phrasing

Representative examples from the report include:

- `food-security-breakfast-bad`
- `indigenous-remote-workforce-bad`
- `asthma-home-visits-mixed`
- `modular-housing-site-setup-mixed`

## Takeaways

- The benchmark is now large enough to use as a calibration and regression corpus for agreement-summary work.
- The most important bug fixed in this pass was the strong-fit failure on obviously off-topic answers.
- Better authoring still matters, but the scorer now has a much firmer floor against domain-mismatch cases and generic rubric gaming.
