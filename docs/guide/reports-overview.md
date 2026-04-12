# Reports Overview

This page is the short version of the benchmark and tuning story.

If you only want the current state, the main answer is:

- the scorer is in decent shape for product-style feedback
- the current default model choice is justified by measured results
- the biggest remaining weakness is generic, topical weak answers
- wording and rubric quality still matter a lot

## Current State

The shipped setup is:

- model: `Xenova/nli-deberta-v3-xsmall`
- current low-latency default: task-type structure checks enabled
- adaptive refinement: conservative low-stop only

That stack was chosen because it gave the best overall balance across:

- main benchmark quality
- hard-negative resistance
- model size
- runtime cost

## Headline Metrics

### Main benchmark

| Metric | Value |
| --- | ---: |
| Cases | 100 |
| Runtime calibrated MAE | 7.4 |
| Runtime calibrated median | 6.3 |
| Within 10 points | 67/100 |
| Within 20 points | 96/100 |

### Hard-negative benchmark

| Metric | Value |
| --- | ---: |
| Cases | 100 |
| Runtime calibrated MAE | 15.9 |
| Median absolute error | 14.8 |
| Within 10 points | 7/100 |
| Within 20 points | 79/100 |

## What Is Working Well

- Off-topic answers are handled well.
- Comparison tasks are the most stable major task type.
- The `xsmall` baseline is clearly better than the earlier `small` baseline while also cutting payload size roughly in half.
- Task-type structure checks improve hard-negative behavior enough to justify keeping them in the default stack.

## Main Weakness

The clearest remaining problem is not random junk. It is generic, topical weak answers.

These answers often:

- sound relevant
- mirror the shape of the prompt
- avoid obvious mistakes
- still fail to provide concrete or grounded help

That makes them easy to over-score unless the scorer has strong enough signals for substance, structure, and specificity.

## Why `xsmall` Won

The model bakeoff did not produce a perfect model. It produced the best tradeoff.

`Xenova/nli-deberta-v3-xsmall` won because it:

- had the best main benchmark result in the bakeoff
- beat the earlier `small` baseline on hard negatives too
- had the smallest q8 payload in the group

Some other candidates were stronger on hard negatives, but not strong enough overall to replace it.

## What The Tuning Work Changed

The most important scorer improvement was the added overall-score calibration layer.

That delivered the cleanest fair-benchmark gain without relying on brittle heuristic changes.

Other experiments were more mixed:

- stronger constraint gating regressed too many strong answers
- deterministic constraint checks were basically neutral
- criterion normalization improved the fair benchmark but hurt hard negatives too much to enable by default

So the kept stack is fairly conservative. The project only kept changes that survived both benchmark views.

## What Adaptive Refinement Really Does

Adaptive refinement is useful, but narrower than it sounds.

The kept policy only skips the full pass for obvious failures. It does not broadly skip full scoring for strong-looking answers.

That means:

- better responsiveness for clearly off-track answers
- limited overall skip rate
- little benchmark risk

It is a practical latency optimization, not a huge compute reduction.

## What The Wording Experiments Showed

One of the strongest findings in the whole project is that rubric wording matters a lot.

The most reliable improvements came from:

- making criteria explicit and concrete
- sometimes making the question’s goal and constraint more explicit too

The safest pattern was not simply “make the prompt longer.”

It was:

- clear question
- explicit goal and constraint when useful
- criteria that name the exact factors the answer should satisfy

## Practical Reading Of The Results

If you are using this library, the main implications are:

- use it for feedback, ranking, and relative comparison, not as a perfect judge
- test against both normal answers and hard negatives
- spend time on rubric wording
- expect concise and strong answers to still be the hardest cases

## Where To Go Next

Use the detailed pages if you need depth:

- [Main Benchmark](/guide/main-benchmark)
- [Hard Negative Benchmark](/guide/hard-negative-benchmark)
- [Adaptive Refinement](/guide/adaptive-refinement)
- [Scoring Improvement](/guide/scoring-improvement)
- [Low-Latency Improvement](/guide/low-latency-improvement)
- [Wording Experiments](/guide/wording-experiments)
- [Model Bakeoff](/guide/model-bakeoff)
