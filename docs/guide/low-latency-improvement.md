# Low-Latency Improvement

This page summarizes the lightweight scoring layers tested on top of the `Xenova/nli-deberta-v3-xsmall` baseline.

## Final Decision

- Keep task-type structure checks in the default scorer.
- Keep deterministic constraint checks off by default.
- Keep criterion normalization opt-in only.

## Summary Table

| Step | Main CV MAE | Main CV Median | Main CV Within 10 | Main CV Within 20 | Hard-Negative MAE |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline | 8.8 | 6.9 | 61/100 | 87/100 | 17.5 |
| Step 1: Deterministic Constraint Checks | 9.0 | 6.9 | 61/100 | 87/100 | 17.5 |
| Step 2: Task-Type Structure Checks | 8.9 | 7.8 | 56/100 | 91/100 | 15.9 |
| Step 3: Criterion Normalization | 8.3 | 6.6 | 62/100 | 90/100 | 19.5 |

## Step By Step

### Baseline

The unmodified `xsmall` scorer after the model switch.

### Step 1: Deterministic Constraint Checks

- Main benchmark: effectively neutral
- Hard-negative benchmark: no improvement

This was not strong enough to justify enabling by default.

### Step 2: Task-Type Structure Checks

- Main benchmark: roughly neutral
- Hard-negative benchmark: meaningful improvement

This was the best default tradeoff, so it stayed on.

### Step 3: Criterion Normalization

- Main benchmark: modest improvement
- Hard-negative benchmark: clear regression

This helps some fair-scoring cases but hurts the failure mode that matters most, so it stays opt-in.

## Takeaways

- Lightweight heuristics can help, but they need to be judged against both benchmarks.
- Task-aware structure checks are the only low-latency addition that clearly earned a place in the default stack.
- Better fair-benchmark scores alone are not enough if hard negatives regress sharply.
