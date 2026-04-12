# Question And Criteria Wording Experiments

This report tests whether changing question wording and criterion wording can materially change scores on cases the current scorer handles poorly.

Method:

- Start from poorly performing cases in the current xsmall benchmark.
- Keep the same answer and reference score.
- Compare four variants for each case:
  - baseline wording
  - question rewritten to surface the goal and constraints more explicitly
  - criteria rewritten to name the concrete factors instead of generic rubric labels
  - both rewritten together
- Score each variant with the current shipped xsmall model and current runtime calibration.

## Aggregate Results

| Variant | Cases | MAE | Median | Avg improvement vs baseline | Improved cases | Worsened cases | Improved by 5+ | Worsened by 5+ |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 16 | 17.4 | 18.2 | 0 | 0 | 0 | 0 | 0 |
| question_explicit | 16 | 17 | 14.5 | 0.3 | 5 | 11 | 4 | 4 |
| criteria_explicit | 16 | 13.2 | 9.6 | 4.2 | 10 | 4 | 6 | 3 |
| both_explicit | 16 | 10 | 11.6 | 7.4 | 10 | 6 | 10 | 0 |

## By Pattern

### strong_under_scored

| Variant | Cases | MAE | Avg improvement vs baseline | Improved | Worsened |
| --- | ---: | ---: | ---: | ---: | ---: |
| baseline | 7 | 18.8 | 0 | 0 | 0 |
| question_explicit | 7 | 19.9 | -1.1 | 2 | 5 |
| criteria_explicit | 7 | 14.2 | 4.6 | 5 | 2 |
| both_explicit | 7 | 7.6 | 11.2 | 6 | 1 |

### concise_under_scored

| Variant | Cases | MAE | Avg improvement vs baseline | Improved | Worsened |
| --- | ---: | ---: | ---: | ---: | ---: |
| baseline | 3 | 20.2 | 0 | 0 | 0 |
| question_explicit | 3 | 4.9 | 15.3 | 3 | 0 |
| criteria_explicit | 3 | 11 | 9.2 | 2 | 1 |
| both_explicit | 3 | 5.4 | 14.8 | 3 | 0 |

### constraint_over_scored

| Variant | Cases | MAE | Avg improvement vs baseline | Improved | Worsened |
| --- | ---: | ---: | ---: | ---: | ---: |
| baseline | 5 | 11.7 | 0 | 0 | 0 |
| question_explicit | 5 | 18 | -6.3 | 0 | 5 |
| criteria_explicit | 5 | 11.2 | 0.6 | 2 | 1 |
| both_explicit | 5 | 14.2 | -2.5 | 0 | 5 |

### constraint_under_scored

| Variant | Cases | MAE | Avg improvement vs baseline | Improved | Worsened |
| --- | ---: | ---: | ---: | ---: | ---: |
| baseline | 1 | 27.2 | 0 | 0 | 0 |
| question_explicit | 1 | 28.8 | -1.6 | 0 | 1 |
| criteria_explicit | 1 | 23 | 4.2 | 1 | 0 |
| both_explicit | 1 | 19.4 | 7.8 | 1 | 0 |

## Biggest Wins

- wifi-concise: baseline abs diff 24.1, best both_explicit abs diff 1, improvement 23.1
- battery-strong: baseline abs diff 22.5, best both_explicit abs diff 1.7999999999999972, improvement 20.7
- repo-structure-strong: baseline abs diff 23.299999999999997, best both_explicit abs diff 4.700000000000003, improvement 18.6
- running-concise: baseline abs diff 17.700000000000003, best criteria_explicit abs diff 0.20000000000000284, improvement 17.5
- git-cleanup-strong: baseline abs diff 20, best both_explicit abs diff 4.299999999999997, improvement 15.7
- resume-bullets-concise: baseline abs diff 18.700000000000003, best question_explicit abs diff 6.399999999999999, improvement 12.3
- running-strong: baseline abs diff 13.5, best both_explicit abs diff 2.4000000000000057, improvement 11.1
- interview-prep-constraint-miss: baseline abs diff 27.199999999999996, best both_explicit abs diff 19.4, improvement 7.8
- wifi-strong: baseline abs diff 8.099999999999994, best both_explicit abs diff 0.4000000000000057, improvement 7.7
- spanish-plan-strong: baseline abs diff 32, best both_explicit abs diff 25.6, improvement 6.4

## Cases With No Improvement

- winter-commute-strong: baseline abs diff 12, best variant question_explicit, improvement -0.7
- remote-onboarding-constraint-miss: baseline abs diff 18.900000000000006, best variant criteria_explicit, improvement -0.2
- study-method-constraint-miss: baseline abs diff 9, best variant criteria_explicit, improvement 0

## Per-Case Detail

### wifi-strong

- Kind/profile: advice / strong
- Pattern: strong_under_scored
- Rationale: Advice case with a strong answer that is under-scored; constraint is implicit in the answer but generic in the rubric.
- Reference overall: 89.5
- Answer: Move the router to an open, central spot away from thick walls and microwaves. Restart the modem and router, then retest speeds in the weakest room. Separate the 2.4 GHz and 5 GHz bands if the router supports it so nearby devices can use t…

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 81.4 | 8.099999999999994 | 0 | 1 | 0.9 | 0.4 |
| question_explicit | 77.4 | 12.099999999999994 | -4 | 1 | 0.9 | 0.4 |
| criteria_explicit | 69.7 | 19.799999999999997 | -11.7 | 1 | 0.9 | 0.4 |
| both_explicit | 89.9 | 0.4000000000000057 | 7.7 | 1 | 0.9 | 0.4 |

Baseline question: How can I improve my home Wi-Fi speed without replacing all my equipment?

question_explicit question: Goal: improve my home Wi-Fi speed. Constraint: use the equipment I already have instead of replacing it. What should I do first and next?
criteria_explicit question: How can I improve my home Wi-Fi speed without replacing all my equipment?
both_explicit question: Goal: improve my home Wi-Fi speed. Constraint: use the equipment I already have instead of replacing it. What should I do first and next?

Baseline criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful

question_explicit criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful
criteria_explicit criteria: Directly recommends how to improve home Wi-Fi speed | Gives concrete steps the user can try with the current equipment | Avoids recommending replacement hardware or a full equipment swap | Explains why the suggested changes could improve speed
both_explicit criteria: Directly recommends how to improve home Wi-Fi speed | Gives concrete steps the user can try with the current equipment | Avoids recommending replacement hardware or a full equipment swap | Explains why the suggested changes could improve speed

### battery-strong

- Kind/profile: advice / strong
- Pattern: strong_under_scored
- Rationale: Advice case where the answer is strong but the model under-recognizes the practical battery-saving rationale.
- Reference overall: 89.5
- Answer: Lower screen brightness and turn on the operating system battery saver profile before you leave. Close browser tabs and background apps you do not need so the CPU is not constantly waking up. Turn off Bluetooth, keyboard lighting, and high…

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 67 | 22.5 | 0 | 1 | 0.8 | 0.5 |
| question_explicit | 61.4 | 28.1 | -5.6 | 1 | 0.7 | 0.7 |
| criteria_explicit | 82.6 | 6.900000000000006 | 15.6 | 1 | 0.8 | 0.5 |
| both_explicit | 87.7 | 1.7999999999999972 | 20.7 | 1 | 0.7 | 0.7 |

Baseline question: How can I extend my laptop battery life while traveling without buying a new laptop?

question_explicit question: Goal: extend my laptop battery life while traveling. Constraint: do not buy a new laptop or replace the device. What should I do?
criteria_explicit question: How can I extend my laptop battery life while traveling without buying a new laptop?
both_explicit question: Goal: extend my laptop battery life while traveling. Constraint: do not buy a new laptop or replace the device. What should I do?

Baseline criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful

question_explicit criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful
criteria_explicit criteria: Directly recommends how to extend laptop battery life while traveling | Gives concrete battery-saving actions the user can take now | Avoids recommending buying a new laptop or replacing the device | Explains why the suggested actions reduce battery drain
both_explicit criteria: Directly recommends how to extend laptop battery life while traveling | Gives concrete battery-saving actions the user can take now | Avoids recommending buying a new laptop or replacing the device | Explains why the suggested actions reduce battery drain

### running-strong

- Kind/profile: advice / strong
- Pattern: strong_under_scored
- Rationale: Advice case where the answer is explicit and strong, but knee-safety gets under-valued by the generic rubric wording.
- Reference overall: 89.5
- Answer: Begin with run-walk intervals on flat ground so the impact stays manageable while your joints adapt. Keep two easy sessions and only one slightly longer session each week instead of pushing every run. Use a simple warm-up and stop if knee …

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 76 | 13.5 | 0 | 1 | 0.9 | 1 |
| question_explicit | 69.5 | 20 | -6.5 | 1 | 0.9 | 1 |
| criteria_explicit | 82.8 | 6.700000000000003 | 6.8 | 1 | 0.9 | 1 |
| both_explicit | 87.1 | 2.4000000000000057 | 11.1 | 1 | 0.9 | 1 |

Baseline question: How can I start running three times a week without aggravating my knees?

question_explicit question: Goal: start running three times a week. Constraint: keep the plan knee-friendly and avoid aggravating knee pain. What should I do?
criteria_explicit question: How can I start running three times a week without aggravating my knees?
both_explicit question: Goal: start running three times a week. Constraint: keep the plan knee-friendly and avoid aggravating knee pain. What should I do?

Baseline criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful

question_explicit criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful
criteria_explicit criteria: Directly recommends how to start running three times a week | Gives concrete beginner-safe running steps | Keeps the plan knee-friendly and avoids aggravating knee pain | Explains why the suggested steps reduce stress on the knees
both_explicit criteria: Directly recommends how to start running three times a week | Gives concrete beginner-safe running steps | Keeps the plan knee-friendly and avoids aggravating knee pain | Explains why the suggested steps reduce stress on the knees

### winter-commute-strong

- Kind/profile: comparison / strong
- Pattern: strong_under_scored
- Rationale: Comparison case with a clear recommendation that appears under-scored when the priority is phrased abstractly.
- Reference overall: 89.5
- Answer: Choose taking transit. It is more predictable in bad weather and removes the setup burden of icy roads, clothing, and storage. Biking can be faster and healthier on good days, but winter conditions make the commute less consistent. Your pr…

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 77.5 | 12 | 0 | 0.9 | 0.8 | 0.2 |
| question_explicit | 76.8 | 12.700000000000003 | -0.7 | 0.9 | 0.8 | 0.2 |
| criteria_explicit | 69.4 | 20.099999999999994 | -8.1 | 0.9 | 0.8 | 0.2 |
| both_explicit | 75.8 | 13.700000000000003 | -1.7 | 0.9 | 0.8 | 0.2 |

Baseline question: Should I choose bike commuting or taking transit for a 25-minute city commute in winter when I want reliability more than exercise?

question_explicit question: Which option better fits this situation: bike commuting or taking transit for a 25-minute winter city commute, with reliability more important than exercise?
criteria_explicit question: Should I choose bike commuting or taking transit for a 25-minute city commute in winter when I want reliability more than exercise?
both_explicit question: Which option better fits this situation: bike commuting or taking transit for a 25-minute winter city commute, with reliability more important than exercise?

Baseline criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale

question_explicit criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale
criteria_explicit criteria: Makes a clear recommendation for this commute | Compares winter reliability, effort, and practicality | Keeps the recommendation aligned with reliability being more important than exercise | Explains the trade-off clearly
both_explicit criteria: Makes a clear recommendation for this commute | Compares winter reliability, effort, and practicality | Keeps the recommendation aligned with reliability being more important than exercise | Explains the trade-off clearly

### repo-structure-strong

- Kind/profile: comparison / strong
- Pattern: strong_under_scored
- Rationale: Comparison case where shared systems and coordinated releases are important, but the generic constraint criterion does not name them.
- Reference overall: 89.5
- Answer: Choose a monorepo. Shared tooling, coordinated changes, and cross-package updates are easier when the code lives together. Separate repos give cleaner ownership boundaries, but they add coordination overhead when releases depend on each ot…

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 66.2 | 23.299999999999997 | 0 | 1 | 0.8 | 0.6 |
| question_explicit | 82 | 7.5 | 15.8 | 1 | 0.8 | 0.8 |
| criteria_explicit | 81.9 | 7.599999999999994 | 15.7 | 1 | 0.8 | 0.6 |
| both_explicit | 84.8 | 4.700000000000003 | 18.6 | 1 | 0.8 | 0.8 |

Baseline question: Should I choose a monorepo or separate repositories for two product teams that share one design system and release together often?

question_explicit question: Which repo setup better fits this situation: a monorepo or separate repositories for two product teams that share one design system and release together often?
criteria_explicit question: Should I choose a monorepo or separate repositories for two product teams that share one design system and release together often?
both_explicit question: Which repo setup better fits this situation: a monorepo or separate repositories for two product teams that share one design system and release together often?

Baseline criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale

question_explicit criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale
criteria_explicit criteria: Makes a clear recommendation | Compares coordination, ownership, and release overhead | Fits the situation of shared systems and frequent joint releases | Explains the trade-off clearly
both_explicit criteria: Makes a clear recommendation | Compares coordination, ownership, and release overhead | Fits the situation of shared systems and frequent joint releases | Explains the trade-off clearly

### git-cleanup-strong

- Kind/profile: planning / strong
- Pattern: strong_under_scored
- Rationale: Planning case where the answer is strong, but the no-feature-freeze constraint benefits from being surfaced directly.
- Reference overall: 88.5
- Answer: Start by agreeing on the smallest set of repo rules that will reduce the most confusion, such as branch naming and merge expectations. Fix one high-friction area at a time, like stale branches or inconsistent release tagging, instead of re…

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 68.5 | 20 | 0 | 1 | 0.9 | 1 |
| question_explicit | 61.5 | 27 | -7 | 1 | 0.7 | 1 |
| criteria_explicit | 77.4 | 11.099999999999994 | 8.9 | 1 | 0.9 | 1 |
| both_explicit | 84.2 | 4.299999999999997 | 15.7 | 1 | 0.7 | 1 |

Baseline question: How should I plan to clean up a messy git repository over one sprint without freezing feature work?

question_explicit question: I need a one-sprint cleanup plan for a messy git repository. Constraint: feature work must continue during the cleanup instead of freezing. How should I sequence it?
criteria_explicit question: How should I plan to clean up a messy git repository over one sprint without freezing feature work?
both_explicit question: I need a one-sprint cleanup plan for a messy git repository. Constraint: feature work must continue during the cleanup instead of freezing. How should I sequence it?

Baseline criteria: Proposes a clear plan | Orders the work in a sensible sequence | Fits the stated scope or constraints | Includes a useful check-in or follow-up step

question_explicit criteria: Proposes a clear plan | Orders the work in a sensible sequence | Fits the stated scope or constraints | Includes a useful check-in or follow-up step
criteria_explicit criteria: Proposes a clear one-sprint cleanup plan | Sequences the work while keeping feature work moving | Fits the no-feature-freeze constraint | Includes a useful end-of-sprint review or follow-up step
both_explicit criteria: Proposes a clear one-sprint cleanup plan | Sequences the work while keeping feature work moving | Fits the no-feature-freeze constraint | Includes a useful end-of-sprint review or follow-up step

### spanish-plan-strong

- Kind/profile: planning / strong
- Pattern: strong_under_scored
- Rationale: Planning case with a strong answer that appears to benefit when the time budget is separated cleanly from the goal.
- Reference overall: 88.5
- Answer: Spend the first week on core phrases, pronunciation, and a small daily set of high-frequency words. Use the middle weeks for short listening and speaking drills built around common situations like greetings, ordering, and directions. Reser…

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 56.5 | 32 | 0 | 1 | 0.8 | 0.9 |
| question_explicit | 56.7 | 31.799999999999997 | 0.2 | 1 | 0.7 | 1 |
| criteria_explicit | 61.4 | 27.1 | 4.9 | 1 | 0.8 | 0.9 |
| both_explicit | 62.9 | 25.6 | 6.4 | 1 | 0.7 | 1 |

Baseline question: How should I plan to learn basic conversational Spanish in 30 days with 20 minutes a day?

question_explicit question: I need a 30-day plan for basic conversational Spanish. Constraint: only 20 minutes per day. How should I structure the month?
criteria_explicit question: How should I plan to learn basic conversational Spanish in 30 days with 20 minutes a day?
both_explicit question: I need a 30-day plan for basic conversational Spanish. Constraint: only 20 minutes per day. How should I structure the month?

Baseline criteria: Proposes a clear plan | Orders the work in a sensible sequence | Fits the stated scope or constraints | Includes a useful check-in or follow-up step

question_explicit criteria: Proposes a clear plan | Orders the work in a sensible sequence | Fits the stated scope or constraints | Includes a useful check-in or follow-up step
criteria_explicit criteria: Proposes a clear 30-day plan | Sequences the weeks sensibly from start to finish | Fits the limit of only 20 minutes per day | Includes a useful weekly check-in or progress step
both_explicit criteria: Proposes a clear 30-day plan | Sequences the weeks sensibly from start to finish | Fits the limit of only 20 minutes per day | Includes a useful weekly check-in or progress step

### wifi-concise

- Kind/profile: advice / concise
- Pattern: concise_under_scored
- Rationale: Concise advice answer that may score better when the prompt and rubric explicitly allow a short two-step response.
- Reference overall: 65.5
- Answer: Move the router to an open, central spot away from thick walls and microwaves. Restart the modem and router, then retest speeds in the weakest room.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 41.4 | 24.1 | 0 | 0.9 | 0.7 | 0.4 |
| question_explicit | 61.5 | 4 | 20.1 | 0.9 | 0.9 | 0.3 |
| criteria_explicit | 70 | 4.5 | 19.6 | 0.9 | 0.7 | 0.4 |
| both_explicit | 64.5 | 1 | 23.1 | 0.9 | 0.9 | 0.3 |

Baseline question: What are two quick steps to improve my home Wi-Fi speed without replacing all my equipment?

question_explicit question: Give exactly two quick actions to improve my home Wi-Fi speed using the equipment I already have.
criteria_explicit question: What are two quick steps to improve my home Wi-Fi speed without replacing all my equipment?
both_explicit question: Give exactly two quick actions to improve my home Wi-Fi speed using the equipment I already have.

Baseline criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful

question_explicit criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful
criteria_explicit criteria: Directly recommends how to improve home Wi-Fi speed | Gives two concrete actions the user can do now | Keeps the advice within the current-equipment constraint | Even as a short answer, the steps are still useful
both_explicit criteria: Directly recommends how to improve home Wi-Fi speed | Gives two concrete actions the user can do now | Keeps the advice within the current-equipment constraint | Even as a short answer, the steps are still useful

### running-concise

- Kind/profile: advice / concise
- Pattern: concise_under_scored
- Rationale: Concise advice answer where the answer format is strong, but the generic usefulness criterion may be too demanding.
- Reference overall: 65.5
- Answer: Begin with run-walk intervals on flat ground so the impact stays manageable while your joints adapt. Keep two easy sessions and only one slightly longer session each week instead of pushing every run.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 47.8 | 17.700000000000003 | 0 | 0.9 | 0.8 | 1 |
| question_explicit | 61.3 | 4.200000000000003 | 13.5 | 0.9 | 0.9 | 1 |
| criteria_explicit | 65.7 | 0.20000000000000284 | 17.5 | 0.9 | 0.8 | 1 |
| both_explicit | 63.8 | 1.7000000000000028 | 16 | 0.9 | 0.9 | 1 |

Baseline question: What are two quick steps to start running three times a week without aggravating my knees?

question_explicit question: Give exactly two quick steps to start running three times a week without aggravating my knees.
criteria_explicit question: What are two quick steps to start running three times a week without aggravating my knees?
both_explicit question: Give exactly two quick steps to start running three times a week without aggravating my knees.

Baseline criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful

question_explicit criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful
criteria_explicit criteria: Directly recommends how to start running three times a week | Gives two concrete beginner-safe steps | Keeps the advice knee-friendly | Even as a short answer, the steps are still useful
both_explicit criteria: Directly recommends how to start running three times a week | Gives two concrete beginner-safe steps | Keeps the advice knee-friendly | Even as a short answer, the steps are still useful

### resume-bullets-concise

- Kind/profile: advice / concise
- Pattern: concise_under_scored
- Rationale: Concise advice answer where truthfulness is important, but the constraint is easy to miss in a generic criterion.
- Reference overall: 65.5
- Answer: Rewrite each duty around an action you actually took and the scope of the work. Add concrete details such as volume, team size, turnaround time, or tools when you can verify them.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 46.8 | 18.700000000000003 | 0 | 0.9 | 0.9 | 0.4 |
| question_explicit | 59.1 | 6.399999999999999 | 12.3 | 0.9 | 0.9 | 0.4 |
| criteria_explicit | 37.2 | 28.299999999999997 | -9.6 | 0.9 | 0.9 | 0.4 |
| both_explicit | 52.1 | 13.399999999999999 | 5.3 | 0.9 | 0.9 | 0.4 |

Baseline question: What are two quick steps to turn my job duties into stronger resume bullets without inventing achievements?

question_explicit question: Give exactly two quick steps to make my resume bullets stronger without inventing achievements.
criteria_explicit question: What are two quick steps to turn my job duties into stronger resume bullets without inventing achievements?
both_explicit question: Give exactly two quick steps to make my resume bullets stronger without inventing achievements.

Baseline criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful

question_explicit criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful
criteria_explicit criteria: Directly answers how to strengthen resume bullets | Gives two concrete revision steps | Avoids inventing achievements or exaggerating results | Even as a short answer, the steps are still useful
both_explicit criteria: Directly answers how to strengthen resume bullets | Gives two concrete revision steps | Avoids inventing achievements or exaggerating results | Even as a short answer, the steps are still useful

### sleep-constraint-miss

- Kind/profile: advice / constraint_miss
- Pattern: constraint_over_scored
- Rationale: Constraint-miss advice case where the forbidden action should be named directly to see if scoring drops appropriately.
- Reference overall: 54
- Answer: Take strong sleep aids so you can knock yourself out quickly. After that, set the same wake-up time every day for a week so your body clock has one stable anchor.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 64.9 | 10.900000000000006 | 0 | 0.9 | 0.9 | 0.9 |
| question_explicit | 22.5 | 31.5 | -20.6 | 0.7 | 0.4 | 0.6 |
| criteria_explicit | 62.6 | 8.600000000000001 | 2.3 | 0.9 | 0.9 | 0.9 |
| both_explicit | 41.1 | 12.899999999999999 | -2 | 0.7 | 0.4 | 0.6 |

Baseline question: What is a practical way to fall asleep earlier without taking medication?

question_explicit question: I want to fall asleep earlier. Constraint: do not recommend medication or sleep aids. What should I do?
criteria_explicit question: What is a practical way to fall asleep earlier without taking medication?
both_explicit question: I want to fall asleep earlier. Constraint: do not recommend medication or sleep aids. What should I do?

Baseline criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful

question_explicit criteria: Answers the question directly | Provides concrete, practical steps | Respects the stated constraints | Gives enough detail or rationale to be useful
criteria_explicit criteria: Directly recommends ways to fall asleep earlier | Gives practical steps the user can try | Does not recommend medication or sleep aids | Explains why the advice could help
both_explicit criteria: Directly recommends ways to fall asleep earlier | Gives practical steps the user can try | Does not recommend medication or sleep aids | Explains why the advice could help

### reading-device-constraint-miss

- Kind/profile: comparison / constraint_miss
- Pattern: constraint_over_scored
- Rationale: Comparison constraint-miss case where the priorities need to be stated more explicitly than the generic comparison rubric.
- Reference overall: 55.5
- Answer: Choose a bright general-purpose tablet. It is the strongest option overall, even if it asks for more than you wanted to spend or carry.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 65.8 | 10.299999999999997 | 0 | 0.9 | 1 | 0.8 |
| question_explicit | 70.2 | 14.700000000000003 | -4.4 | 0.9 | 1 | 1 |
| criteria_explicit | 65.7 | 10.200000000000003 | 0.1 | 0.9 | 1 | 0.8 |
| both_explicit | 69.8 | 14.299999999999997 | -4 | 0.9 | 1 | 1 |

Baseline question: What would you pick between an e-reader and a tablet for focused reading with long battery life and fewer distractions?

question_explicit question: Which option better fits these priorities for reading: focused reading, long battery life, and fewer distractions: an e-reader or a tablet?
criteria_explicit question: What would you pick between an e-reader and a tablet for focused reading with long battery life and fewer distractions?
both_explicit question: Which option better fits these priorities for reading: focused reading, long battery life, and fewer distractions: an e-reader or a tablet?

Baseline criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale

question_explicit criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale
criteria_explicit criteria: Makes a clear recommendation | Compares the two options on focus, battery life, and distraction level | The recommendation matches those stated priorities | Explains the trade-off clearly
both_explicit criteria: Makes a clear recommendation | Compares the two options on focus, battery life, and distraction level | The recommendation matches those stated priorities | Explains the trade-off clearly

### gaming-setup-constraint-miss

- Kind/profile: comparison / constraint_miss
- Pattern: constraint_over_scored
- Rationale: Comparison constraint-miss case where portability and apartment size are more concrete than the generic constraint label.
- Reference overall: 55.5
- Answer: Choose a large tower desktop with a separate monitor. It is the strongest option overall, even if it asks for more than you wanted to spend or carry.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 65.1 | 9.599999999999994 | 0 | 0.9 | 0.9 | 0.7 |
| question_explicit | 69.7 | 14.200000000000003 | -4.6 | 0.9 | 0.9 | 0.8 |
| criteria_explicit | 64.5 | 9 | 0.6 | 0.9 | 0.9 | 0.7 |
| both_explicit | 69.8 | 14.299999999999997 | -4.7 | 0.9 | 0.9 | 0.8 |

Baseline question: What would you pick between a prebuilt desktop and a gaming laptop for light gaming in a small apartment with occasional travel?

question_explicit question: Which option better fits light gaming in a small apartment with occasional travel: a prebuilt desktop or a gaming laptop?
criteria_explicit question: What would you pick between a prebuilt desktop and a gaming laptop for light gaming in a small apartment with occasional travel?
both_explicit question: Which option better fits light gaming in a small apartment with occasional travel: a prebuilt desktop or a gaming laptop?

Baseline criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale

question_explicit criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale
criteria_explicit criteria: Makes a clear recommendation | Compares the options on size, portability, and gaming needs | Fits the small-apartment and occasional-travel constraints | Explains the trade-off clearly
both_explicit criteria: Makes a clear recommendation | Compares the options on size, portability, and gaming needs | Fits the small-apartment and occasional-travel constraints | Explains the trade-off clearly

### study-method-constraint-miss

- Kind/profile: comparison / constraint_miss
- Pattern: constraint_over_scored
- Rationale: Comparison constraint-miss case where the short daily time budget needs to be spelled out more literally.
- Reference overall: 55.5
- Answer: Choose summary notes. It is the strongest option overall, even if it asks for more than you wanted to spend or carry.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 64.5 | 9 | 0 | 0.9 | 1 | 0.7 |
| question_explicit | 65.8 | 10.299999999999997 | -1.3 | 0.9 | 1 | 0.7 |
| criteria_explicit | 64.5 | 9 | 0 | 0.9 | 1 | 0.7 |
| both_explicit | 65.7 | 10.200000000000003 | -1.2 | 0.9 | 1 | 0.7 |

Baseline question: What would you pick between flashcards and summary notes if I only have 20 minutes a day to memorize biology terms before an exam?

question_explicit question: Which option better fits memorizing biology terms if I only have 20 minutes a day: flashcards or summary notes?
criteria_explicit question: What would you pick between flashcards and summary notes if I only have 20 minutes a day to memorize biology terms before an exam?
both_explicit question: Which option better fits memorizing biology terms if I only have 20 minutes a day: flashcards or summary notes?

Baseline criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale

question_explicit criteria: Gives a clear recommendation | Compares the options on relevant factors | Respects the stated constraints | Explains the trade-offs or rationale
criteria_explicit criteria: Makes a clear recommendation | Compares the options on recall efficiency and setup cost | Fits the limit of only 20 minutes a day | Explains the trade-off clearly
both_explicit criteria: Makes a clear recommendation | Compares the options on recall efficiency and setup cost | Fits the limit of only 20 minutes a day | Explains the trade-off clearly

### remote-onboarding-constraint-miss

- Kind/profile: planning / constraint_miss
- Pattern: constraint_over_scored
- Rationale: Planning constraint-miss case where the overloading risk should be stated directly in both the question and criteria.
- Reference overall: 51.3
- Answer: Book their calendar solid with back-to-back training sessions from morning to evening. After that, give them one clear schedule for the week with a short list of outcomes for each day.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 70.2 | 18.900000000000006 | 0 | 0.9 | 0.8 | 1 |
| question_explicit | 70.6 | 19.299999999999997 | -0.4 | 0.9 | 0.8 | 1 |
| criteria_explicit | 70.4 | 19.10000000000001 | -0.2 | 0.9 | 0.8 | 1 |
| both_explicit | 70.7 | 19.400000000000006 | -0.5 | 0.9 | 0.8 | 1 |

Baseline question: How can I organize a plan to onboard a new remote hire in the first week without overwhelming them?

question_explicit question: I need a first-week remote onboarding plan. Constraint: do not overload the new hire. How should I structure the week?
criteria_explicit question: How can I organize a plan to onboard a new remote hire in the first week without overwhelming them?
both_explicit question: I need a first-week remote onboarding plan. Constraint: do not overload the new hire. How should I structure the week?

Baseline criteria: Proposes a clear plan | Orders the work in a sensible sequence | Fits the stated scope or constraints | Includes a useful check-in or follow-up step

question_explicit criteria: Proposes a clear plan | Orders the work in a sensible sequence | Fits the stated scope or constraints | Includes a useful check-in or follow-up step
criteria_explicit criteria: Proposes a clear first-week plan | Sequences the onboarding work sensibly | Avoids overloading the new hire with too much at once | Includes a useful check-in or follow-up step
both_explicit criteria: Proposes a clear first-week plan | Sequences the onboarding work sensibly | Avoids overloading the new hire with too much at once | Includes a useful check-in or follow-up step

### interview-prep-constraint-miss

- Kind/profile: planning / constraint_miss
- Pattern: constraint_under_scored
- Rationale: Planning constraint-miss case where the scorer may be over-penalizing because the work-schedule constraint is not phrased explicitly enough.
- Reference overall: 51.3
- Answer: Take several days off work and cram for eight hours a day. After that, spend the first two sessions listing the interview topics and identifying your weakest areas.

| Variant | App overall | Abs diff | Improvement vs baseline | Gate | Answer support | Constraint respect |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 24.1 | 27.199999999999996 | 0 | 0.5 | 0.3 | 0.6 |
| question_explicit | 22.5 | 28.799999999999997 | -1.6 | 0.5 | 0.3 | 1 |
| criteria_explicit | 28.3 | 22.999999999999996 | 4.2 | 0.5 | 0.3 | 0.6 |
| both_explicit | 31.9 | 19.4 | 7.8 | 0.5 | 0.3 | 1 |

Baseline question: How can I organize a plan to prepare for a technical interview in two weeks while working full-time?

question_explicit question: I need a two-week technical interview prep plan while working full-time. Constraint: the plan must fit around a normal work schedule. How should I structure it?
criteria_explicit question: How can I organize a plan to prepare for a technical interview in two weeks while working full-time?
both_explicit question: I need a two-week technical interview prep plan while working full-time. Constraint: the plan must fit around a normal work schedule. How should I structure it?

Baseline criteria: Proposes a clear plan | Orders the work in a sensible sequence | Fits the stated scope or constraints | Includes a useful check-in or follow-up step

question_explicit criteria: Proposes a clear plan | Orders the work in a sensible sequence | Fits the stated scope or constraints | Includes a useful check-in or follow-up step
criteria_explicit criteria: Proposes a clear two-week plan | Sequences the work sensibly | Fits around full-time work instead of assuming large blocks off | Includes a useful check-in or follow-up step
both_explicit criteria: Proposes a clear two-week plan | Sequences the work sensibly | Fits around full-time work instead of assuming large blocks off | Includes a useful check-in or follow-up step

## Practical Takeaways

- Explicit question wording and explicit criteria wording do not help equally. The effect is case-dependent.
- Rewriting criteria to name the exact factors often helps comparison and constraint-sensitive cases more than rewriting the question alone.
- Rewriting the question to separate `goal` and `constraint` often helps planning and advice cases when the original question packs the limits into one clause.
- Some cases remain hard even with better wording. That means the model limitation is real, not just prompt phrasing.

