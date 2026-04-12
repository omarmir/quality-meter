# Benchmark Report

Cases: 100

## Raw Scoring

Mean absolute error: 7.1
Median absolute error: 5.2
Within 10 points: 69/100
Within 20 points: 93/100

By kind:
- advice: count 35, MAE 6.5, reference avg 54.3, app avg 51.6
- comparison: count 35, MAE 7.4, reference avg 53, app avg 53
- planning: count 30, MAE 7.6, reference avg 52, app avg 52.5

By profile:
- concise: count 20, MAE 8.8, reference avg 63.6, app avg 58.9
- constraint_miss: count 20, MAE 13.1, reference avg 53.7, app avg 60.4
- off_topic: count 20, MAE 0.4, reference avg 0, app avg 0.4
- partial: count 20, MAE 5.2, reference avg 59.2, app avg 60.7
- strong: count 20, MAE 8.2, reference avg 89.2, app avg 81.4

## Cross-Validated Calibrated Scoring

Mean absolute error: 8.8
Median absolute error: 7.8
Within 10 points: 57/100
Within 20 points: 91/100

By kind:
- advice: count 35, MAE 9.5, reference avg 54.3, app avg 46
- comparison: count 35, MAE 8.3, reference avg 53, app avg 50.2
- planning: count 30, MAE 8.5, reference avg 52, app avg 47.3

By profile:
- concise: count 20, MAE 12.1, reference avg 63.6, app avg 53.1
- constraint_miss: count 20, MAE 11.5, reference avg 53.7, app avg 54.8
- off_topic: count 20, MAE 0.4, reference avg 0, app avg 0.4
- partial: count 20, MAE 6, reference avg 59.2, app avg 56.1
- strong: count 20, MAE 14.2, reference avg 89.2, app avg 75

## Runtime Calibrated Scoring

Mean absolute error: 7.4
Median absolute error: 6.3
Within 10 points: 67/100
Within 20 points: 96/100

By kind:
- advice: count 35, MAE 8.2, reference avg 54.3, app avg 47
- comparison: count 35, MAE 6.2, reference avg 53, app avg 50.3
- planning: count 30, MAE 8, reference avg 52, app avg 47

By profile:
- concise: count 20, MAE 11.2, reference avg 63.6, app avg 53.4
- constraint_miss: count 20, MAE 9.9, reference avg 53.7, app avg 52.5
- off_topic: count 20, MAE 0.4, reference avg 0, app avg 0.4
- partial: count 20, MAE 5.7, reference avg 59.2, app avg 55.3
- strong: count 20, MAE 10, reference avg 89.2, app avg 79.2

## Calibration Curve

Criterion calibration knots: (0, 0.1), (0, 0.3), (0, 0.4), (0.1, 0.4), (0.1, 0.6), (0.9, 0.6), (0.9, 0.7), (0.9, 0.8), (0.9, 0.8), (0.9, 0.9), (1, 0.9), (1, 0.9), (1, 0.9), (1, 1)
Overall calibration knots: (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0, 0), (0.1, 0.1), (0.2, 0.2), (0.3, 0.2), (0.3, 0.2), (0.4, 0.2), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.4, 0.3), (0.5, 0.3), (0.5, 0.3), (0.5, 0.3), (0.5, 0.4), (0.5, 0.4), (0.5, 0.4), (0.5, 0.4), (0.5, 0.5), (0.5, 0.5), (0.5, 0.5), (0.5, 0.5), (0.5, 0.6), (0.5, 0.6), (0.6, 0.6), (0.6, 0.6), (0.7, 0.6), (0.7, 0.7), (0.7, 0.7), (0.7, 0.8), (0.8, 0.8), (0.8, 0.9), (0.9, 0.9), (0.9, 0.9), (1, 1)

## Top Cross-Validated Misses

- spanish-plan-strong: ref 88.5, app 55.7, diff -32.8, gate 1, answer 0.8, constraint 1
  Q: How should I plan to learn basic conversational Spanish in 30 days with 20 minutes a day?
  A: Spend the first week on core phrases, pronunciation, and a small daily set of high-frequency words. Use the middle weeks for short listenin…
- interview-prep-constraint-miss: ref 51.3, app 25.2, diff -26.1, gate 0.5, answer 0.3, constraint 0.6
  Q: How can I organize a plan to prepare for a technical interview in two weeks while working full-time?
  A: Take several days off work and cram for eight hours a day. After that, spend the first two sessions listing the interview topics and identi…
- battery-strong: ref 89.5, app 63.5, diff -26, gate 1, answer 0.8, constraint 0.5
  Q: How can I extend my laptop battery life while traveling without buying a new laptop?
  A: Lower screen brightness and turn on the operating system battery saver profile before you leave. Close browser tabs and background apps you…
- winter-commute-strong: ref 89.5, app 64.3, diff -25.2, gate 0.9, answer 0.8, constraint 0.1
  Q: Should I choose bike commuting or taking transit for a 25-minute city commute in winter when I want…
  A: Choose taking transit. It is more predictable in bad weather and removes the setup burden of icy roads, clothing, and storage. Biking can b…
- git-cleanup-strong: ref 88.5, app 63.7, diff -24.8, gate 1, answer 0.9, constraint 1
  Q: How should I plan to clean up a messy git repository over one sprint without freezing feature work?
  A: Start by agreeing on the smallest set of repo rules that will reduce the most confusion, such as branch naming and merge expectations. Fix …
- wifi-concise: ref 65.5, app 41.5, diff -24, gate 0.9, answer 0.7, constraint 0.3
  Q: What are two quick steps to improve my home Wi-Fi speed without replacing all my equipment?
  A: Move the router to an open, central spot away from thick walls and microwaves. Restart the modem and router, then retest speeds in the weak…
- remote-onboarding-constraint-miss: ref 51.3, app 74.6, diff 23.3, gate 0.9, answer 0.8, constraint 1
  Q: How can I organize a plan to onboard a new remote hire in the first week without overwhelming them?
  A: Book their calendar solid with back-to-back training sessions from morning to evening. After that, give them one clear schedule for the wee…
- repo-structure-strong: ref 89.5, app 68.2, diff -21.3, gate 1, answer 0.8, constraint 0.7
  Q: Should I choose a monorepo or separate repositories for two product teams that share one design sys…
  A: Choose a monorepo. Shared tooling, coordinated changes, and cross-package updates are easier when the code lives together. Separate repos g…
- running-strong: ref 89.5, app 69, diff -20.5, gate 1, answer 0.9, constraint 1
  Q: How can I start running three times a week without aggravating my knees?
  A: Begin with run-walk intervals on flat ground so the impact stays manageable while your joints adapt. Keep two easy sessions and only one sl…
- running-concise: ref 65.5, app 45.6, diff -19.9, gate 0.9, answer 0.8, constraint 1
  Q: What are two quick steps to start running three times a week without aggravating my knees?
  A: Begin with run-walk intervals on flat ground so the impact stays manageable while your joints adapt. Keep two easy sessions and only one sl…
- resume-bullets-concise: ref 65.5, app 46.2, diff -19.3, gate 0.9, answer 0.9, constraint 0.4
  Q: What are two quick steps to turn my job duties into stronger resume bullets without inventing achie…
  A: Rewrite each duty around an action you actually took and the scope of the work. Add concrete details such as volume, team size, turnaround …
- git-cleanup-concise: ref 62, app 44.2, diff -17.8, gate 0.9, answer 0.8, constraint 1
  Q: What is a short plan to clean up a messy git repository over one sprint without freezing feature wo…
  A: Start by agreeing on the smallest set of repo rules that will reduce the most confusion, such as branch naming and merge expectations. Fix …
- wifi-strong: ref 89.5, app 72, diff -17.5, gate 1, answer 0.9, constraint 0.4
  Q: How can I improve my home Wi-Fi speed without replacing all my equipment?
  A: Move the router to an open, central spot away from thick walls and microwaves. Restart the modem and router, then retest speeds in the weak…
- reading-device-constraint-miss: ref 55.5, app 73, diff 17.5, gate 0.9, answer 1, constraint 0.8
  Q: What would you pick between an e-reader and a tablet for focused reading with long battery life and…
  A: Choose a bright general-purpose tablet. It is the strongest option overall, even if it asks for more than you wanted to spend or carry.
- resume-bullets-partial: ref 62.5, app 45.3, diff -17.2, gate 0.9, answer 0.8, constraint 0.3
  Q: What should I try first if I need to turn my job duties into stronger resume bullets without invent…
  A: Rewrite each duty around an action you actually took and the scope of the work. Then test the result before deciding what to change next.
