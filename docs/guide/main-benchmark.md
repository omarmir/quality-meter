# Main Benchmark

This page summarizes the current 100-case main benchmark for the shipped scorer setup.

## At A Glance

- Cases: `100`
- Best display path: runtime calibrated scoring
- Runtime calibrated MAE: `7.4`
- Runtime calibrated median absolute error: `6.3`
- Runtime calibrated within 10 points: `67/100`
- Runtime calibrated within 20 points: `96/100`

## Top-Line Metrics

| View | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Raw scoring | 7.1 | 5.2 | 69/100 | 93/100 |
| Cross-validated calibrated | 8.8 | 7.8 | 57/100 | 91/100 |
| Runtime calibrated | 7.4 | 6.3 | 67/100 | 96/100 |

## By Kind

Runtime calibrated results:

| Kind | Count | MAE | Reference Avg | App Avg |
| --- | ---: | ---: | ---: | ---: |
| Advice | 35 | 8.2 | 54.3 | 47.0 |
| Comparison | 35 | 6.2 | 53.0 | 50.3 |
| Planning | 30 | 8.0 | 52.0 | 47.0 |

## By Profile

Runtime calibrated results:

| Profile | Count | MAE | Reference Avg | App Avg |
| --- | ---: | ---: | ---: | ---: |
| Strong | 20 | 10.0 | 89.2 | 79.2 |
| Partial | 20 | 5.7 | 59.2 | 55.3 |
| Constraint miss | 20 | 9.9 | 53.7 | 52.5 |
| Concise | 20 | 11.2 | 63.6 | 53.4 |
| Off topic | 20 | 0.4 | 0.0 | 0.4 |

## What The Numbers Say

- Off-topic detection is strong.
- Comparison tasks are the most stable major category in the current setup.
- Concise answers and strong answers are still the hardest profiles to score well.
- The scorer is still somewhat conservative on strong answers, with the largest under-scoring concentrated there.

## Biggest Miss Patterns

The largest misses in the benchmark are mostly:

- strong answers that are useful but do not line up cleanly with generic rubric wording
- concise answers that do enough, but look under-supported to the model
- some constraint-sensitive cases where the answer is stronger than the constraint signal suggests

Representative examples from the report include:

- `spanish-plan-strong`
- `battery-strong`
- `wifi-concise`
- `running-concise`
- `remote-onboarding-constraint-miss`

## Takeaways

- The benchmark is good enough for product-style feedback, especially when the goal is ranking or relative comparison.
- The main remaining quality gap is not obvious junk detection. It is fair treatment of concise and strong answers.
- Better authoring and selective refinement matter as much as raw model choice for these cases.
