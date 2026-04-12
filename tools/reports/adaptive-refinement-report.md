# Adaptive Refinement Report

This report evaluates whether the app should skip the expensive full pass after a fast pass when the fast result already looks decisive.

## Baseline Always-Full Runtime

- Main benchmark MAE: 5.8
- Hard-negative MAE: 18.1

## Selected Adaptive Policy

- Label: low 10/0.25/15, low-stop only
- Combined full-pass skip rate: 9%
- Main skip rate: 18%
- Hard-negative skip rate: 0%
- Main benchmark MAE: 5.8
- Hard-negative MAE: 18.1
- Strong-profile MAE: 6.6
- Off-topic average score: 0.3
- Met success criteria: no

### Config

```json
{
  "lowStopOverallPercent": 10,
  "lowStopAnswerSupport": 0.25,
  "lowStopMaxCriterionPercent": 15,
  "lowStopSecondaryOverallBuffer": 5,
  "lowStopLowCriterionShare": 0.66,
  "highStopOverallPercent": 100,
  "highStopMinCriterionPercent": 100,
  "highStopSpreadPercent": 0,
  "highStopWeakAnswerGate": 1,
  "disableHighStopForConstraintQuestions": true,
  "disableHighStopForTaskTypes": [
    "comparison",
    "planning"
  ]
}
```

## Main Benchmark by Kind

- advice: count 35, MAE 5.9, reference avg 54.3, app avg 49.7
- comparison: count 35, MAE 5, reference avg 53, app avg 52.6
- planning: count 30, MAE 6.6, reference avg 52, app avg 49.5

## Main Benchmark by Profile

- strong: count 20, MAE 6.6, reference avg 89.2, app avg 82.9
- partial: count 20, MAE 4.2, reference avg 59.2, app avg 58.1
- constraint_miss: count 20, MAE 9.3, reference avg 53.7, app avg 55.6
- concise: count 20, MAE 8.5, reference avg 63.6, app avg 56.3
- off_topic: count 20, MAE 0.3, reference avg 0, app avg 0.3

## Hard-Negative by Kind

- advice: count 35, MAE 19, reference avg 26, app avg 45
- comparison: count 35, MAE 18.6, reference avg 27.5, app avg 46.1
- planning: count 30, MAE 16.5, reference avg 23.3, app avg 39.8

## Top Candidate Configs

| Label | Success | Skip % | Main MAE | Hard-Neg MAE | Strong MAE | Off-topic avg |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| low 10/0.25/15, high 92/82/8/0.88 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/82/8/0.92 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/82/8/0.95 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/82/10/0.88 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/82/10/0.92 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/82/10/0.95 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/82/12/0.88 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/82/12/0.92 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/82/12/0.95 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |
| low 10/0.25/15, high 92/85/8/0.88 | no | 9 | 5.8 | 18.1 | 6.6 | 0.3 |

## Largest Regressions vs Always-Full Runtime

- winter-commute-off-topic: ref 0, adaptive 0, mode fast, reason obvious_failure
- study-method-off-topic: ref 0, adaptive 2, mode fast, reason obvious_failure
- wifi-strong: ref 89.5, adaptive 86, mode full, reason constraint_risk
- wifi-partial: ref 62.5, adaptive 57, mode full, reason constraint_risk
- wifi-constraint-miss: ref 54, adaptive 51, mode full, reason constraint_risk
- wifi-concise: ref 65.5, adaptive 46, mode full, reason constraint_risk
- wifi-off-topic: ref 0, adaptive 0, mode fast, reason obvious_failure
- meal-prep-strong: ref 89.5, adaptive 82, mode full, reason mid_band
- meal-prep-partial: ref 62.5, adaptive 65, mode full, reason mid_band
- meal-prep-constraint-miss: ref 54, adaptive 44, mode full, reason mid_band
- meal-prep-concise: ref 65.5, adaptive 53, mode full, reason mid_band
- meal-prep-off-topic: ref 0, adaptive 1, mode fast, reason obvious_failure
- sleep-strong: ref 89.5, adaptive 87, mode full, reason constraint_risk
- sleep-partial: ref 62.5, adaptive 65, mode full, reason constraint_risk
- sleep-constraint-miss: ref 54, adaptive 66, mode full, reason constraint_risk
