# Authoring Guide

This guide is for library users who want the best scoring behavior from the default scorer stack.

These recommendations are based on the current default setup:

- model: `Xenova/nli-deberta-v3-xsmall`
- scorer: question-aware zero-shot NLI with criterion hypotheses, chunked evidence search, calibration, weak-answer gating, and task-type structure checks
- evaluation data: the current English benchmark corpus in this repository

If you swap models, these patterns may change somewhat. The broad advice still holds.

## Short Version

If you want the scorer to behave as well as possible:

1. Write the question with explicit, concrete limits.
2. Keep the question focused on one task, one decision, or one plan.
3. Write criteria that name the exact factors you care about.
4. Keep each criterion single-purpose.
5. If a constraint matters, make it a criterion too.

## What Works Best

The scorer performs best when:

- the question states a clear goal
- hard constraints are explicit
- criteria describe observable qualities
- the answer is direct, concrete, and visibly structured

Examples of explicit constraints:

- `without replacing the equipment`
- `in 30 days`
- `with 20 minutes a day`
- `under $50`
- `carry-on luggage only`
- `while working full-time`

## How To Write Good Questions

### Prefer Explicit Goal + Constraint Wording

Better:

```text
How can I improve my home Wi-Fi speed without replacing all my equipment?
```

Better for some hard cases:

```text
Goal: improve my home Wi-Fi speed. Constraint: use the equipment I already have instead of replacing it. What should I do first and next?
```

Why:

- the scorer evaluates `Question + Response` together
- clear constraint phrasing gives the model a cleaner premise
- explicit goal wording reduces ambiguity

### Keep The Question Focused

Better:

```text
How should I plan to learn basic conversational Spanish in 30 days with 20 minutes a day?
```

Worse:

```text
How should I get better at Spanish fast, stay motivated, find good resources, and maybe improve my pronunciation too?
```

Why:

- one focused goal produces cleaner criterion matching
- broad multi-part questions create mixed evidence and weaker scores

### Use Concrete Limits Instead Of Soft Preferences

Better:

```text
under $50
in one sprint
with 20 minutes a day
without taking medication
```

Worse:

```text
reasonably affordable
pretty quick
not too complicated
fairly practical
```

Why:

- the scorer handles explicit boundaries better than fuzzy preferences
- vague wording is easier for the model to ignore or misread

## How To Write Good Criteria

### Make Criteria Single-Purpose

Better:

- `Answers the question directly`
- `Provides concrete, practical steps`
- `Fits the stated constraints`
- `Explains the trade-offs clearly`

Worse:

- `Is useful, practical, thoughtful, and clear`
- `Provides a strong and nuanced answer`

Why:

- the scorer rewrites each criterion into positive and negative hypotheses
- one criterion should measure one thing
- compound criteria make evidence noisier

### Name The Exact Factor, Not A Generic Rubric Label

This was the strongest result in the wording experiments.

Generic:

- `Respects the stated constraints`

Better:

- `Avoids recommending replacement hardware or a full equipment swap`
- `Fits around full-time work instead of assuming large blocks off`
- `Keeps the plan knee-friendly and avoids aggravating knee pain`
- `Compares winter reliability, effort, and practicality`

Why:

- generic criteria help, but explicit criteria are usually better
- naming the actual factor reduces scorer ambiguity

### If A Constraint Matters, Turn It Into A Criterion

This is one of the best practical rules for library users.

Example:

Question:

```text
How should I plan to clean up a messy git repository over one sprint without freezing feature work?
```

Better criteria:

- `Proposes a clear one-sprint cleanup plan`
- `Sequences the work while keeping feature work moving`
- `Fits the no-feature-freeze constraint`
- `Includes a useful end-of-sprint review or follow-up step`

Why:

- the global constraint gate is soft
- a dedicated constraint criterion directly affects the weighted score

## Best Patterns By Task Type

### Advice Tasks

Question template:

```text
How can I [goal] without [constraint]?
```

Best criteria style:

- `Directly recommends how to [goal]`
- `Gives concrete steps the user can take now`
- `Avoids [forbidden move]`
- `Explains why the suggestion should help`

### Comparison Tasks

Question template:

```text
Which option better fits [situation or priorities]: [option A] or [option B]?
```

Best criteria style:

- `Makes a clear recommendation`
- `Compares the options on [exact decision axes]`
- `Matches the stated priorities`
- `Explains the trade-off clearly`

Important:

- comparison questions often work better when the decision axes are named directly in the question
- for constraints, explicit criteria usually help more than rewriting the question alone

### Planning Tasks

Question template:

```text
I need a [time-boxed] plan for [goal]. Constraint: [constraint]. How should I structure it?
```

Best criteria style:

- `Proposes a clear [time-boxed] plan`
- `Sequences the work sensibly`
- `Fits [specific time, effort, or scope constraint]`
- `Includes a useful check-in or follow-up step`

## What The Wording Experiments Showed

On the selected poor-performing cases:

- rewriting the question alone helped some cases, but was inconsistent
- rewriting criteria was much more reliable
- rewriting both question and criteria was the strongest general strategy

Key pattern:

- for strong under-scored answers, explicit criteria were the biggest help
- for concise under-scored answers, explicit question wording helped a lot
- for constraint-sensitive cases, explicit criteria were safer than question-only rewrites

## Recommended Workflow For Library Users

When you build a rubric:

1. Draft the question normally.
2. Rewrite the question so the goal and constraint are explicit if needed.
3. Replace generic criteria with exact-factor criteria.
4. Split compound criteria into separate checks.
5. Add a dedicated criterion for each critical constraint.

## Examples

### Weak Version

Question:

```text
What should I do about my Wi-Fi?
```

Criteria:

- `Is helpful`
- `Is practical`

### Better Version

Question:

```text
How can I improve my home Wi-Fi speed without replacing all my equipment?
```

Criteria:

- `Answers the question directly`
- `Provides concrete, practical steps`
- `Avoids recommending replacement hardware or a full equipment swap`
- `Uses an example to make the advice easier to apply`

## Related Docs

- [What Is This?](/guide/what-is-this)
- [API](/guide/api)
- [Known Limitations](/guide/known-limitations)
