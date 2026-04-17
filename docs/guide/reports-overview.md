# Reports Overview

This page is the short version of the benchmark and tuning story.

If you only want the current state, the main answer is:

- the scorer is in decent shape for product-style feedback
- the current default stack now includes an explicit topic-alignment gate
- the current benchmark evidence comes from a handwritten 300-case agreement-summary corpus
- the biggest remaining weakness is still vague on-topic answers that mention the program purpose but stay light on concrete targets or delivery detail
- wording and rubric quality still matter a lot

## Current State

The shipped setup is:

- model: `Xenova/nli-deberta-v3-xsmall`
- current low-latency default: task-type structure checks plus topic-alignment gating
- adaptive refinement: conservative low-stop only

The current benchmark is a handwritten 300-case corpus built around agreement-summary tasks across workforce, health, housing, infrastructure, and community domains. Each scenario includes `bad`, `mixed`, `good`, and `off_topic` answers written directly into the repo.

## Headline Metrics

### Handwritten Benchmark

| Metric | Value |
| --- | ---: |
| Cases | 300 |
| Runtime calibrated MAE | 4.3 |
| Runtime calibrated median | 2.7 |
| Within 10 points | 270/300 |
| Within 20 points | 293/300 |

## What Is Working Well

- Off-topic answers are now handled much more reliably on this corpus than they were before the topic-alignment gate.
- `good` answers are now very close to target on average after recalibration.
- The `xsmall` baseline remains a good fit for this local scoring workflow because the benchmark gains came from scoring logic and calibration, not from switching to a larger model.

## Main Weakness

The clearest remaining problem is still generic, topical weak answers.

These answers often:

- sound relevant
- mirror the shape of the prompt
- avoid obvious mistakes
- still fail to provide concrete or grounded help

That makes them easy to over-score unless the scorer has strong enough signals for substance, structure, specificity, and topic alignment.

## What The Tuning Work Changed

- Topic-alignment gating now suppresses obviously off-domain answers before they can surface as strong fits.
- A domain-agnostic criterion-grounding layer now caps vague answers when a rubric asks for concrete targets, outputs, or delivery details and those details are missing.
- The handwritten benchmark also produced a new calibration curve fitted to this corpus instead of the older synthetic family generator.

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
- [Adaptive Refinement](/guide/adaptive-refinement)
- [Scoring Improvement](/guide/scoring-improvement)
- [Low-Latency Improvement](/guide/low-latency-improvement)
- [Wording Experiments](/guide/wording-experiments)
- [Model Bakeoff](/guide/model-bakeoff)
