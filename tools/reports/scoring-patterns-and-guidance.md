# Scoring Patterns And Prompt Guidance

This note summarizes how the current shipped browser scorer behaves after the switch to `Xenova/nli-deberta-v3-xsmall` and the addition of task-type structure checks, based on the latest benchmark runs.

Supporting reports:

- [benchmark-report.md](./benchmark-report.md)
- [hard-negative-report.md](./hard-negative-report.md)
- [benchmark-history.md](./benchmark-history.md)

## Current Baseline

- Model: `Xenova/nli-deberta-v3-xsmall`
- Low-latency layers enabled by default:
  - task-type structure checks
- Main benchmark, cross-validated:
  - MAE `8.8`
  - median `7.8`
  - within 10 `57/100`
  - within 20 `91/100`
- Hard-negative benchmark:
  - MAE `15.9`
  - median `14.8`
  - within 10 `7/100`
  - within 20 `79/100`

## Where The Scorer Does Well

- It is very strong on obvious off-topic answers.
  - Main benchmark `off_topic` profile MAE is `0.4`.
- It does well on partial but still relevant answers.
  - Main benchmark `partial` profile MAE is `6.1`.
- It generally handles structured planning and comparison prompts better than the old `small` baseline.
- It responds well to answers that are clearly segmented, action-oriented, and contain real content rather than vague filler.

## Where The Scorer Does Poorly

- It still under-scores many strong answers.
  - Main benchmark `strong` profile average is `75.6` vs reference `89.2`.
- It under-scores concise but good answers.
  - Main benchmark `concise` profile average is `55.5` vs reference `63.6`.
- It still over-scores generic topical answers.
  - The hard-negative benchmark remains the clearest failure mode.
- It is still weak on some constraint handling.
  - Main benchmark `constraint_miss` profile MAE is `13.2`.
- Comparison answers are fragile when they give a recommendation without clearly analyzing trade-offs.

## Typical Failure Patterns

### Under-scoring Strong Answers

These usually have the right content, but the scorer still lands too low when:

- the answer is concise instead of fully developed
- the answer implies constraint satisfaction rather than stating it plainly
- the answer is strong overall but any single criterion remains only moderately supported

Examples from the benchmark:

- strong Wi-Fi answer
- strong battery answer
- strong running answer
- strong planning answers with clear sequencing but limited explicit follow-up wording

### Over-scoring Weak Topical Answers

These usually stay on-topic but are too generic:

- “Choose the option that seems stronger overall...”
- “Start with the main thing... keep it simple... adjust later...”

Those answers borrow words from the question and sound plausible, but they do not provide enough concrete evidence or constraint handling.

### Constraint Misses

The model still misses some cases where the answer is on-topic but violates the user's actual boundaries, for example:

- ignoring `without overwhelming them`
- ignoring `carry-on luggage only`
- ignoring `without taking medication`
- ignoring budget or time limits when the answer still sounds relevant

## Why It Behaves This Way

The scorer:

- evaluates `Question + Response` together
- rewrites criteria into positive and negative hypotheses
- scores the full response and smaller evidence chunks
- applies an answer-validity gate
- applies a soft constraint gate
- applies a task-type structure check at the overall-score layer
- applies a weak-answer penalty at the overall-score layer

This means it is best at detecting:

- obvious irrelevance
- missing content
- visible structure
- direct, explicit compliance signals

It is weaker at:

- implicit compliance
- subtle constraint violations
- distinguishing “generic but plausible” from “actually good”

## Best Practices For Writing Questions

- Put the actual task first.
  - Good: `How can I improve my home Wi-Fi speed without replacing all my equipment?`
- State hard boundaries explicitly.
  - Good: `without replacing all my equipment`
  - Good: `in 30 days`
  - Good: `with 20 minutes a day`
  - Good: `carry-on luggage only`
- Use concrete limits instead of vague preferences.
  - Better: `under $50`
  - Worse: `reasonably affordable`
- Keep the question focused on one decision or one plan.
- If this is a comparison, include the decision axes directly in the question.
  - Good: `for focused reading, long battery life, and fewer distractions`

## Best Practices For Writing Constraints

- Use explicit boundary phrases:
  - `without ...`
  - `only ...`
  - `under ...`
  - `within ...`
  - `in X days`
  - `with X minutes a day`
  - `for a team of X`
- Prefer measurable constraints over soft preferences.
  - Better: `under 2 hours on Sunday`
  - Worse: `not too time-consuming`
- Keep each important constraint atomic.
  - Better: `under $50` and `carry-on luggage only`
  - Worse: one long sentence containing many loosely connected limitations
- Put critical constraints close to the main ask, not buried at the end.
- If a constraint matters a lot, make it a criterion too.
  - Example: `Fits the stated constraints`
  - Example: `Stays within the budget`
  - Example: `Keeps the plan realistic for 20 minutes a day`

## Best Practices For Writing Criteria

- Keep criteria short.
- Make each criterion test one thing only.
- Prefer verb-led or direct response phrasing.

Good criteria:

- `Answers the question directly`
- `Provides concrete, practical steps`
- `Fits the stated constraints`
- `Explains the trade-offs clearly`
- `Orders the work in a sensible sequence`

Weak criteria:

- `Is thoughtful and useful and practical`
- `Is good`
- `Provides a strong and compelling and nuanced answer`

Avoid:

- combining multiple ideas into one criterion
- subjective language with no observable target
- criteria that overlap so heavily they all mean the same thing

## Best Practices For Answers If You Want Reliable Scoring

- Answer directly in the first sentence.
- Use visible structure:
  - `First... Then... Finally...`
- Include concrete actions, not just recommendations.
- Add one short rationale when useful.
- Restate or visibly honor the main constraint when it matters.
- For comparisons, name the chosen option and at least one trade-off.
- For planning, make sequence explicit.

## Practical Templates

### Advice Question

```text
How can I [goal] without [constraint]?
```

Example:

```text
How can I improve my home Wi-Fi speed without replacing all my equipment?
```

Suggested criteria:

- `Answers the question directly`
- `Provides concrete, practical steps`
- `Fits the stated constraints`
- `Gives enough detail or rationale to be useful`

### Comparison Question

```text
What would you pick between [option A] and [option B] for [use case] with [constraints]?
```

Example:

```text
What would you pick between an e-reader and a tablet for focused reading with long battery life and fewer distractions?
```

Suggested criteria:

- `Gives a clear recommendation`
- `Compares the options on relevant factors`
- `Fits the stated constraints`
- `Explains the trade-offs or rationale`

### Planning Question

```text
How should I plan to [goal] in [time limit] with [resource constraint]?
```

Example:

```text
How should I plan to learn basic conversational Spanish in 30 days with 20 minutes a day?
```

Suggested criteria:

- `Proposes a clear plan`
- `Orders the work in a sensible sequence`
- `Fits the stated scope or constraints`
- `Includes a useful check-in or follow-up step`

## Short Version

If the goal is to get the best scoring behavior from the current system:

1. Write the question with explicit, concrete limits.
2. Turn critical limits into their own criteria.
3. Keep each criterion short and single-purpose.
4. Favor answers with direct wording, visible sequencing, and concrete steps.
5. Do not rely on vague “sounds good” language. This scorer performs best on explicit signals.
