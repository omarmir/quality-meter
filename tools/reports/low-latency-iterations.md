# Low-Latency Improvement Iterations

This report benchmarks the recommended low-latency scoring layers one step at a time on the current `Xenova/nli-deberta-v3-xsmall` baseline.

Benchmark conventions:

- Main benchmark numbers are reported in raw, cross-validated calibrated, and runtime calibrated modes.
- Hard-negative numbers use runtime calibration because that is the end-user display path.
- Cross-validated main benchmark is the fairest top-line metric.

Final decision:

- keep task-type structure checks in the shipped default
- keep deterministic constraint checks off by default
- keep criterion normalization opt-in only

## Summary Table

| Step | Main CV MAE | Main CV Median | Main CV Within 10 | Main CV Within 20 | Hard-Negative MAE | Hard-Negative Median | Hard-Negative Within 10 | Hard-Negative Within 20 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | 8.8 | 6.9 | 61/100 | 87/100 | 17.5 | 16.3 | 4/100 | 73/100 |
| Step 1: Deterministic Constraint Checks | 9 | 6.9 | 61/100 | 87/100 | 17.5 | 16.3 | 4/100 | 73/100 |
| Step 2: Task-Type Structure Checks | 8.9 | 7.8 | 56/100 | 91/100 | 15.9 | 14.9 | 7/100 | 79/100 |
| Step 3: Criterion Normalization | 8.3 | 6.6 | 62/100 | 90/100 | 19.5 | 20.5 | 4/100 | 47/100 |

## Step Detail

### Baseline

Current scorer stack with the new low-latency layers disabled.

Baseline for comparison.

| Mode | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Main raw | 7.7 | 4.6 | 77/100 | 88/100 |
| Main cross-validated | 8.8 | 6.9 | 61/100 | 87/100 |
| Main runtime | 7.4 | 5.3 | 68/100 | 92/100 |
| Hard-negative runtime | 17.5 | 16.3 | 4/100 | 73/100 |

### Step 1: Deterministic Constraint Checks

Adds lightweight constraint extraction and violation checks on top of the NLI-based constraint gate.

Delta vs baseline: main CV MAE +0.2, hard-negative MAE +0.

| Mode | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Main raw | 7.7 | 4.6 | 76/100 | 87/100 |
| Main cross-validated | 9 | 6.9 | 61/100 | 87/100 |
| Main runtime | 7.5 | 5.4 | 68/100 | 92/100 |
| Hard-negative runtime | 17.5 | 16.3 | 4/100 | 73/100 |

### Step 2: Task-Type Structure Checks

Keeps deterministic constraint checks and adds task-aware structure scoring for advice, comparison, and planning.

Delta vs baseline: main CV MAE +0.1, hard-negative MAE -1.6.

| Mode | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Main raw | 7.2 | 5.2 | 69/100 | 92/100 |
| Main cross-validated | 8.9 | 7.8 | 56/100 | 91/100 |
| Main runtime | 7.5 | 6.3 | 67/100 | 95/100 |
| Hard-negative runtime | 15.9 | 14.9 | 7/100 | 79/100 |

### Step 3: Criterion Normalization

Keeps the earlier layers and rewrites generic criteria into more explicit scoring criteria before running NLI.

Delta vs baseline: main CV MAE -0.5, hard-negative MAE +2.

| Mode | MAE | Median | Within 10 | Within 20 |
| --- | ---: | ---: | ---: | ---: |
| Main raw | 9.2 | 6.2 | 61/100 | 84/100 |
| Main cross-validated | 8.3 | 6.6 | 62/100 | 90/100 |
| Main runtime | 6.9 | 4.9 | 74/100 | 95/100 |
| Hard-negative runtime | 19.5 | 20.5 | 4/100 | 47/100 |
