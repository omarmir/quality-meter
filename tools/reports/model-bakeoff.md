# Model Bakeoff Report

Generated: 2026-04-12T17:59:47.227Z
Candidates: 6
Elapsed: 21m 51.9s

## Summary

- Best main benchmark: Xenova/nli-deberta-v3-small (cross-validated MAE 8.6, size 164.5 MB)
- Best hard-negative benchmark: MoritzLaurer/ModernBERT-base-zeroshot-v2.0 (cross-validated MAE 12.6, size 143.9 MB)
- Smallest payload: Xenova/nli-deberta-v3-xsmall (83.2 MB)

## Cross-Validated Comparison

| Model | q8 size | Main MAE | Main median | Main within 10 | Main within 20 | Hard MAE | Hard median | Hard within 10 | Hard within 20 | Load | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Xenova/nli-deberta-v3-small | 164.5 MB | 8.6 | 6.9 | 59/100 | 93/100 | 23 | 22.9 | 0/100 | 7/100 | 1.2s | 2m 47.9s |
| Xenova/deberta-v3-base-tasksource-nli | 233.0 MB | 8.7 | 7.8 | 61/100 | 90/100 | 21.6 | 21.6 | 0/100 | 28/100 | 1.7s | 5m 21.0s |
| Xenova/nli-deberta-v3-xsmall | 83.2 MB | 8.8 | 7.8 | 57/100 | 91/100 | 16 | 14.9 | 7/100 | 82/100 | 0.9s | 2m 48.9s |
| onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX | 102.4 MB | 13.1 | 6.2 | 61/100 | 72/100 | 12.9 | 13.8 | 25/100 | 93/100 | 0.7s | 44.0s |
| MoritzLaurer/ModernBERT-base-zeroshot-v2.0 | 143.9 MB | 29.9 | 28.4 | 30/100 | 44/100 | 12.6 | 10.9 | 45/100 | 76/100 | 1.1s | 4m 53.5s |
| onnx-community/distilbart-mnli-12-3-ONNX | 246.2 MB | 37.4 | 41.4 | 24/100 | 28/100 | 14 | 14.6 | 39/100 | 65/100 | 1.4s | 5m 16.6s |

## Per-Model Notes

### Xenova/nli-deberta-v3-small

- Label: DeBERTa v3 small
- Note: Previous q8 baseline before the switch to xsmall.
- q8 artifact size: 164.5 MB
- Cold load time: 1.2s
- Base benchmark time: 2m 6.4s
- Hard-negative benchmark time: 40.2s
- Total time: 2m 47.9s
- Main cross-validated: MAE 8.6, median 6.9, within 10 59/100, within 20 93/100
- Hard-negative cross-validated: MAE 23, median 22.9, within 10 0/100, within 20 7/100
- Main raw: MAE 10.4; runtime calibrated: MAE 6.7
- Hard-negative raw: MAE 28.6; runtime calibrated: MAE 23

### Xenova/deberta-v3-base-tasksource-nli

- Label: DeBERTa v3 base tasksource NLI
- Note: Largest DeBERTa candidate in this shortlist. Accuracy-first option if browser budget allows it.
- q8 artifact size: 233.0 MB
- Cold load time: 1.7s
- Base benchmark time: 4m 2.8s
- Hard-negative benchmark time: 1m 16.3s
- Total time: 5m 21.0s
- Main cross-validated: MAE 8.7, median 7.8, within 10 61/100, within 20 90/100
- Hard-negative cross-validated: MAE 21.6, median 21.6, within 10 0/100, within 20 28/100
- Main raw: MAE 9.6; runtime calibrated: MAE 6.5
- Hard-negative raw: MAE 24.6; runtime calibrated: MAE 21.4

### Xenova/nli-deberta-v3-xsmall

- Label: DeBERTa v3 xsmall
- Note: Current recommended baseline. Smallest DeBERTa-family candidate and the best overall tradeoff in this bakeoff.
- q8 artifact size: 83.2 MB
- Cold load time: 0.9s
- Base benchmark time: 2m 7.5s
- Hard-negative benchmark time: 40.3s
- Total time: 2m 48.9s
- Main cross-validated: MAE 8.8, median 7.8, within 10 57/100, within 20 91/100
- Hard-negative cross-validated: MAE 16, median 14.9, within 10 7/100, within 20 82/100
- Main raw: MAE 7.1; runtime calibrated: MAE 7.4
- Hard-negative raw: MAE 17.3; runtime calibrated: MAE 15.9

### onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX

- Label: Multilingual MiniLMv2 L6 MNLI/XNLI
- Note: Multilingual zero-shot candidate proposed for French support. Included here to measure English-regression risk before any profile split.
- q8 artifact size: 102.4 MB
- Cold load time: 0.7s
- Base benchmark time: 32.9s
- Hard-negative benchmark time: 10.2s
- Total time: 44.0s
- Main cross-validated: MAE 13.1, median 6.2, within 10 61/100, within 20 72/100
- Hard-negative cross-validated: MAE 12.9, median 13.8, within 10 25/100, within 20 93/100
- Main raw: MAE 13.9; runtime calibrated: MAE 12.2
- Hard-negative raw: MAE 11.5; runtime calibrated: MAE 12.9

### MoritzLaurer/ModernBERT-base-zeroshot-v2.0

- Label: ModernBERT base zeroshot
- Note: Compact base-sized zero-shot model with a stronger architecture-size tradeoff than the current baseline.
- q8 artifact size: 143.9 MB
- Cold load time: 1.1s
- Base benchmark time: 3m 41.2s
- Hard-negative benchmark time: 1m 11.0s
- Total time: 4m 53.5s
- Main cross-validated: MAE 29.9, median 28.4, within 10 30/100, within 20 44/100
- Hard-negative cross-validated: MAE 12.6, median 10.9, within 10 45/100, within 20 76/100
- Main raw: MAE 30; runtime calibrated: MAE 29.7
- Hard-negative raw: MAE 11.9; runtime calibrated: MAE 12.5

### onnx-community/distilbart-mnli-12-3-ONNX

- Label: DistilBART MNLI
- Note: Older MNLI baseline. Included to test whether architecture differences help despite the larger payload.
- q8 artifact size: 246.2 MB
- Cold load time: 1.4s
- Base benchmark time: 3m 58.6s
- Hard-negative benchmark time: 1m 16.4s
- Total time: 5m 16.6s
- Main cross-validated: MAE 37.4, median 41.4, within 10 24/100, within 20 28/100
- Hard-negative cross-validated: MAE 14, median 14.6, within 10 39/100, within 20 65/100
- Main raw: MAE 38.4; runtime calibrated: MAE 37.3
- Hard-negative raw: MAE 14.2; runtime calibrated: MAE 14.1

