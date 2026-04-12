# Wording Experiments

This page summarizes the targeted wording experiment run on 16 poorly performing benchmark cases.

## Question

Can score quality improve without changing the model, just by rewriting the question or the rubric?

## Variants Tested

- baseline wording
- question rewritten to make goal and constraints more explicit
- criteria rewritten to name concrete factors instead of generic rubric labels
- both rewritten together

## Aggregate Result

| Variant | Cases | MAE | Median | Avg Improvement vs Baseline | Improved Cases | Worsened Cases |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | 16 | 17.2 | 18.9 | 0.0 | 0 | 0 |
| Question explicit | 16 | 16.5 | 14.5 | 0.7 | 6 | 10 |
| Criteria explicit | 16 | 12.5 | 8.8 | 4.8 | 11 | 3 |
| Both explicit | 16 | 9.5 | 10.1 | 7.7 | 12 | 4 |

## Strongest Pattern

The most reliable win was not “make the question longer.”

It was:

- make the goal and constraint explicit when helpful
- rewrite criteria so they name the actual factors to score

In this experiment, explicit criteria helped more consistently than explicit questions alone.

## By Pattern

| Pattern | Best Variant | Key Result |
| --- | --- | --- |
| Strong under-scored | Both explicit | MAE improved from 18.4 to 7.3 |
| Concise under-scored | Both explicit or question explicit | MAE improved from 20.5 to 4.7 |
| Constraint over-scored | Criteria explicit | Question rewrites often made these worse |
| Constraint under-scored | Both explicit | Small sample, but still improved |

## Biggest Wins

Largest improvements in the source report included:

- `wifi-concise`: +22.9
- `battery-strong`: +19.4
- `git-cleanup-strong`: +19.2
- `running-concise`: +19.0
- `resume-bullets-concise`: +12.0

## Practical Guidance

- Prefer criteria that name concrete success factors.
- Avoid relying only on generic labels like “answers directly” or “provides rationale.”
- For concise-answer tasks, explicitly state the expected shape of the answer.
- For constraint-sensitive tasks, criteria wording is usually safer than making the question longer.

## Takeaways

- Wording matters a lot.
- Criteria wording matters more consistently than question wording alone.
- Some hard cases still remain hard even after rewriting, which means the limitation is not just prompt phrasing.
