# Model Bakeoff Report

Generated: 2026-04-11T17:09:44.012Z
Candidates: 5
Elapsed: 21m 16.9s

## Summary

- Best main benchmark: Xenova/nli-deberta-v3-xsmall (cross-validated MAE 8.8, size 83.2 MB)
- Best hard-negative benchmark: MoritzLaurer/ModernBERT-base-zeroshot-v2.0 (cross-validated MAE 13, size 143.9 MB)
- Smallest payload: Xenova/nli-deberta-v3-xsmall (83.2 MB)

## Cross-Validated Comparison

| Model | q8 size | Main MAE | Main median | Main within 10 | Main within 20 | Hard MAE | Hard median | Hard within 10 | Hard within 20 | Load | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Xenova/nli-deberta-v3-xsmall | 83.2 MB | 8.8 | 6.9 | 61/100 | 87/100 | 17.6 | 16.4 | 4/100 | 73/100 | 0.9s | 2m 50.6s |
| Xenova/nli-deberta-v3-small | 164.5 MB | 10.1 | 9.6 | 52/100 | 84/100 | 24.5 | 23.9 | 0/100 | 2/100 | 1.1s | 2m 49.4s |
| Xenova/deberta-v3-base-tasksource-nli | 233.0 MB | 10.4 | 8.7 | 56/100 | 83/100 | 23.3 | 22.7 | 0/100 | 10/100 | 1.5s | 5m 21.6s |
| MoritzLaurer/ModernBERT-base-zeroshot-v2.0 | 143.9 MB | 29.8 | 27.7 | 30/100 | 45/100 | 13 | 11.8 | 44/100 | 74/100 | 1.2s | 4m 55.2s |
| onnx-community/distilbart-mnli-12-3-ONNX | 246.2 MB | 37.3 | 41.4 | 24/100 | 28/100 | 14 | 14.6 | 38/100 | 65/100 | 1.5s | 5m 20.0s |

## Per-Model Notes

### Xenova/nli-deberta-v3-xsmall

- Label: DeBERTa v3 xsmall
- Note: Current recommended baseline. Smallest DeBERTa-family candidate and the best overall tradeoff in this bakeoff.
- q8 artifact size: 83.2 MB
- Cold load time: 0.9s
- Base benchmark time: 2m 6.6s
- Hard-negative benchmark time: 42.9s
- Total time: 2m 50.6s
- Main cross-validated: MAE 8.8, median 6.9, within 10 61/100, within 20 87/100
- Hard-negative cross-validated: MAE 17.6, median 16.4, within 10 4/100, within 20 73/100
- Main raw: MAE 7.7; runtime calibrated: MAE 7.4
- Hard-negative raw: MAE 19.4; runtime calibrated: MAE 17.5

### Xenova/nli-deberta-v3-small

- Label: DeBERTa v3 small
- Note: Previous q8 baseline before the switch to xsmall.
- q8 artifact size: 164.5 MB
- Cold load time: 1.1s
- Base benchmark time: 2m 6.1s
- Hard-negative benchmark time: 42.1s
- Total time: 2m 49.4s
- Main cross-validated: MAE 10.1, median 9.6, within 10 52/100, within 20 84/100
- Hard-negative cross-validated: MAE 24.5, median 23.9, within 10 0/100, within 20 2/100
- Main raw: MAE 12.1; runtime calibrated: MAE 8
- Hard-negative raw: MAE 31.6; runtime calibrated: MAE 24.4

### Xenova/deberta-v3-base-tasksource-nli

- Label: DeBERTa v3 base tasksource NLI
- Note: Largest DeBERTa candidate in this shortlist. Accuracy-first option if browser budget allows it.
- q8 artifact size: 233.0 MB
- Cold load time: 1.5s
- Base benchmark time: 3m 59.0s
- Hard-negative benchmark time: 1m 20.9s
- Total time: 5m 21.6s
- Main cross-validated: MAE 10.4, median 8.7, within 10 56/100, within 20 83/100
- Hard-negative cross-validated: MAE 23.3, median 22.7, within 10 0/100, within 20 10/100
- Main raw: MAE 11.1; runtime calibrated: MAE 8.2
- Hard-negative raw: MAE 27.6; runtime calibrated: MAE 23.1

### MoritzLaurer/ModernBERT-base-zeroshot-v2.0

- Label: ModernBERT base zeroshot
- Note: Compact base-sized zero-shot model with a stronger architecture-size tradeoff than the current baseline.
- q8 artifact size: 143.9 MB
- Cold load time: 1.2s
- Base benchmark time: 3m 38.9s
- Hard-negative benchmark time: 1m 15.1s
- Total time: 4m 55.2s
- Main cross-validated: MAE 29.8, median 27.7, within 10 30/100, within 20 45/100
- Hard-negative cross-validated: MAE 13, median 11.8, within 10 44/100, within 20 74/100
- Main raw: MAE 29.7; runtime calibrated: MAE 29.4
- Hard-negative raw: MAE 12.3; runtime calibrated: MAE 12.9

### onnx-community/distilbart-mnli-12-3-ONNX

- Label: DistilBART MNLI
- Note: Older MNLI baseline. Included to test whether architecture differences help despite the larger payload.
- q8 artifact size: 246.2 MB
- Cold load time: 1.5s
- Base benchmark time: 3m 57.6s
- Hard-negative benchmark time: 1m 20.8s
- Total time: 5m 20.0s
- Main cross-validated: MAE 37.3, median 41.4, within 10 24/100, within 20 28/100
- Hard-negative cross-validated: MAE 14, median 14.6, within 10 38/100, within 20 65/100
- Main raw: MAE 38.2; runtime calibrated: MAE 37.2
- Hard-negative raw: MAE 14.1; runtime calibrated: MAE 14
