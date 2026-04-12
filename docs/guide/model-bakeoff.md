# Model Bakeoff

This page summarizes the cross-validated model comparison used to choose the current default baseline.

## Winner

`Xenova/nli-deberta-v3-xsmall` is the best overall candidate in the current scorer stack.

Why it won:

- best main benchmark result in the bakeoff
- best size among the tested candidates
- better hard-negative result than the previous shipped `small` baseline

## Summary

- Best main benchmark: `Xenova/nli-deberta-v3-xsmall`
- Best hard-negative benchmark: `MoritzLaurer/ModernBERT-base-zeroshot-v2.0`
- Smallest payload: `Xenova/nli-deberta-v3-xsmall`

## Cross-Validated Comparison

| Model | q8 Size | Main MAE | Main Within 10 | Hard MAE | Hard Within 10 | Load Time |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Xenova/nli-deberta-v3-xsmall | 83.2 MB | 8.8 | 61/100 | 17.6 | 4/100 | 0.9s |
| Xenova/nli-deberta-v3-small | 164.5 MB | 10.1 | 52/100 | 24.5 | 0/100 | 1.1s |
| Xenova/deberta-v3-base-tasksource-nli | 233.0 MB | 10.4 | 56/100 | 23.3 | 0/100 | 1.5s |
| MoritzLaurer/ModernBERT-base-zeroshot-v2.0 | 143.9 MB | 29.8 | 30/100 | 13.0 | 44/100 | 1.2s |
| onnx-community/distilbart-mnli-12-3-ONNX | 246.2 MB | 37.3 | 24/100 | 14.0 | 38/100 | 1.5s |

## What The Table Means

### `xsmall`

Best overall tradeoff. It improved the main benchmark, improved the hard-negative benchmark versus the earlier shipped baseline, and cut payload size roughly in half.

### `small`

Reasonable, but dominated by `xsmall` on both accuracy and payload.

### `deberta-v3-base-tasksource-nli`

Larger and slower without a clear benchmark win.

### `ModernBERT`

Very strong on hard negatives, but not usable here as a default because the main benchmark collapses.

### `DistilBART`

Not competitive in this scoring setup.

## Recommendation

- Keep `Xenova/nli-deberta-v3-xsmall` as the default baseline.
- Continue testing any future scorer change against both the main benchmark and the hard-negative benchmark.
- Do not replace the baseline based on hard-negative strength alone if the main benchmark degrades sharply.
