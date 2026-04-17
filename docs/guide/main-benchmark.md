# Main Benchmark

This page summarizes the current handwritten 100-case benchmark for the shipped scorer setup.

## At A Glance

- Cases: `100`
- Best display path: runtime calibrated scoring
- Runtime calibrated MAE: `4.8`
- Runtime calibrated median absolute error: `2.8`
- Runtime calibrated within 10 points: `89/100`
- Runtime calibrated within 20 points: `99/100`

## Top-Line Metrics

| View | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw scoring | 6.5 | 3.9 | 74/100 | 97/100 |
| Cross-validated calibrated | 5.2 | 3.0 | 87/100 | 98/100 |
| Runtime calibrated | 4.8 | 2.8 | 89/100 | 99/100 |

## Corpus Shape

The benchmark is a handwritten agreement-summary corpus:

- `25` scenarios
- `5` domains: workforce, health, housing, infrastructure, community
- `4` answer profiles per scenario: `bad`, `mixed`, `good`, `off_topic`

## By Domain

Runtime calibrated results:

| Domain | Count | MAE | Reference Avg | App Avg |
| --- | ---: | ---: | ---: | ---: |
| Community | 20 | 6.3 | 49.0 | 52.5 |
| Health | 20 | 2.7 | 49.2 | 49.2 |
| Housing | 20 | 4.8 | 49.1 | 51.7 |
| Infrastructure | 20 | 5.1 | 49.1 | 49.9 |
| Workforce | 20 | 5.1 | 49.0 | 50.6 |

## By Profile

Runtime calibrated results:

| Profile | Count | MAE | Reference Avg | App Avg |
| --- | ---: | ---: | ---: | ---: |
| Bad | 25 | 8.6 | 31.6 | 39.6 |
| Mixed | 25 | 3.9 | 67.9 | 69.0 |
| Good | 25 | 4.5 | 96.8 | 92.3 |
| Off topic | 25 | 2.3 | 0.0 | 2.3 |

## What The Numbers Say

- Off-topic detection is materially better than before the topic-alignment gate.
- `Mixed` answers now land close to target on average.
- The remaining misses are mostly purpose-only `bad` answers that still sound plausible enough to over-score.
- The scorer is still mildly conservative on some strong answers, but the dominant residual issue on this corpus is vague on-topic over-scoring.

## Biggest Miss Patterns

The largest misses in the benchmark are mostly:

- vague `bad` answers that still state the funded program purpose clearly
- a smaller set of `mixed` answers that mention delivery and target categories but not concrete numbers
- a few residual off-topic cases that still keep some generic agreement-style phrasing

Representative examples from the report include:

- `food-security-breakfast-bad`
- `homelessness-prevention-rent-bank-bad`
- `newcomer-language-jobs-mixed`
- `afterschool-stem-off-topic`

## Takeaways

- The benchmark is now strong enough to use as a calibration and regression corpus for agreement-summary work.
- The most important bug fixed in this pass was the strong-fit failure on obviously off-topic answers.
- Better authoring still matters, but the scorer now has a much firmer floor against domain-mismatch cases.
