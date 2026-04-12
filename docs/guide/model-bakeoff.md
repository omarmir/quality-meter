# Model Bakeoff

This page summarizes the latest cross-validated model comparison on the current shipped scorer stack.

## Recommendation

`Xenova/nli-deberta-v3-xsmall` remains the recommended default baseline.

Why it still wins:

- smallest payload in the group
- near-best main benchmark result without collapsing hard negatives
- materially better hard-negative result than the larger DeBERTa-family alternatives
- avoids the strong-answer regression seen in the multilingual and hard-negative-specialist candidates

## Summary

- Best main benchmark: `Xenova/nli-deberta-v3-small`
- Best hard-negative benchmark: `MoritzLaurer/ModernBERT-base-zeroshot-v2.0`
- Smallest payload: `Xenova/nli-deberta-v3-xsmall`

## Cross-Validated Comparison

| Model | q8 Size | Main MAE | Main Within 10 | Hard MAE | Hard Within 10 | Load Time |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Xenova/nli-deberta-v3-small | 164.5 MB | 8.6 | 59/100 | 23.0 | 0/100 | 1.2s |
| Xenova/deberta-v3-base-tasksource-nli | 233.0 MB | 8.7 | 61/100 | 21.6 | 0/100 | 1.7s |
| Xenova/nli-deberta-v3-xsmall | 83.2 MB | 8.8 | 57/100 | 16.0 | 7/100 | 0.9s |
| onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX | 102.4 MB | 13.1 | 61/100 | 12.9 | 25/100 | 0.7s |
| MoritzLaurer/ModernBERT-base-zeroshot-v2.0 | 143.9 MB | 29.9 | 30/100 | 12.6 | 45/100 | 1.1s |
| onnx-community/distilbart-mnli-12-3-ONNX | 246.2 MB | 37.4 | 24/100 | 14.0 | 39/100 | 1.4s |

## What The Table Means

### `xsmall`

Best default tradeoff. It stays close to the best main-benchmark result, is much stronger than `small` and `deberta-v3-base-tasksource-nli` on hard negatives, and keeps the smallest q8 payload.

### `small`

It narrowly wins the main benchmark, but the hard-negative benchmark is much worse and the payload is almost double `xsmall`.

### `deberta-v3-base-tasksource-nli`

Close on the main benchmark, but larger, slower, and much worse on hard negatives.

### `Multilingual MiniLMv2`

Interesting multilingual candidate. It improves the hard-negative benchmark substantially and runs very quickly in this harness, but it regresses the main English benchmark too sharply to replace the default. It is a better fit for a separate multilingual profile than for the current English baseline.

### `ModernBERT`

Very strong on hard negatives, but not usable here as a default because the main benchmark collapses.

### `DistilBART`

Not competitive in this scoring setup.

## Recommendation

- Keep `Xenova/nli-deberta-v3-xsmall` as the default baseline.
- Treat `onnx-community/multilingual-MiniLMv2-L6-mnli-xnli-ONNX` as a multilingual-profile candidate, not a drop-in English replacement.
- Continue testing any future scorer change against both the main benchmark and the hard-negative benchmark.
- Do not replace the baseline based on hard-negative strength alone if the main benchmark degrades sharply.
