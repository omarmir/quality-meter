export type WordingExperimentPattern =
  | 'strong_under_scored'
  | 'concise_under_scored'
  | 'constraint_over_scored'
  | 'constraint_under_scored'

export type WordingExperiment = {
  caseId: string
  pattern: WordingExperimentPattern
  rationale: string
  explicitQuestion: string
  explicitCriteria: string[]
}

export const WORDING_EXPERIMENTS: WordingExperiment[] = [
  {
    caseId: 'wifi-strong',
    pattern: 'strong_under_scored',
    rationale: 'Advice case with a strong answer that is under-scored; constraint is implicit in the answer but generic in the rubric.',
    explicitQuestion:
      'Goal: improve my home Wi-Fi speed. Constraint: use the equipment I already have instead of replacing it. What should I do first and next?',
    explicitCriteria: [
      'Directly recommends how to improve home Wi-Fi speed',
      'Gives concrete steps the user can try with the current equipment',
      'Avoids recommending replacement hardware or a full equipment swap',
      'Explains why the suggested changes could improve speed',
    ],
  },
  {
    caseId: 'battery-strong',
    pattern: 'strong_under_scored',
    rationale: 'Advice case where the answer is strong but the model under-recognizes the practical battery-saving rationale.',
    explicitQuestion:
      'Goal: extend my laptop battery life while traveling. Constraint: do not buy a new laptop or replace the device. What should I do?',
    explicitCriteria: [
      'Directly recommends how to extend laptop battery life while traveling',
      'Gives concrete battery-saving actions the user can take now',
      'Avoids recommending buying a new laptop or replacing the device',
      'Explains why the suggested actions reduce battery drain',
    ],
  },
  {
    caseId: 'running-strong',
    pattern: 'strong_under_scored',
    rationale: 'Advice case where the answer is explicit and strong, but knee-safety gets under-valued by the generic rubric wording.',
    explicitQuestion:
      'Goal: start running three times a week. Constraint: keep the plan knee-friendly and avoid aggravating knee pain. What should I do?',
    explicitCriteria: [
      'Directly recommends how to start running three times a week',
      'Gives concrete beginner-safe running steps',
      'Keeps the plan knee-friendly and avoids aggravating knee pain',
      'Explains why the suggested steps reduce stress on the knees',
    ],
  },
  {
    caseId: 'winter-commute-strong',
    pattern: 'strong_under_scored',
    rationale: 'Comparison case with a clear recommendation that appears under-scored when the priority is phrased abstractly.',
    explicitQuestion:
      'Which option better fits this situation: bike commuting or taking transit for a 25-minute winter city commute, with reliability more important than exercise?',
    explicitCriteria: [
      'Makes a clear recommendation for this commute',
      'Compares winter reliability, effort, and practicality',
      'Keeps the recommendation aligned with reliability being more important than exercise',
      'Explains the trade-off clearly',
    ],
  },
  {
    caseId: 'repo-structure-strong',
    pattern: 'strong_under_scored',
    rationale: 'Comparison case where shared systems and coordinated releases are important, but the generic constraint criterion does not name them.',
    explicitQuestion:
      'Which repo setup better fits this situation: a monorepo or separate repositories for two product teams that share one design system and release together often?',
    explicitCriteria: [
      'Makes a clear recommendation',
      'Compares coordination, ownership, and release overhead',
      'Fits the situation of shared systems and frequent joint releases',
      'Explains the trade-off clearly',
    ],
  },
  {
    caseId: 'git-cleanup-strong',
    pattern: 'strong_under_scored',
    rationale: 'Planning case where the answer is strong, but the no-feature-freeze constraint benefits from being surfaced directly.',
    explicitQuestion:
      'I need a one-sprint cleanup plan for a messy git repository. Constraint: feature work must continue during the cleanup instead of freezing. How should I sequence it?',
    explicitCriteria: [
      'Proposes a clear one-sprint cleanup plan',
      'Sequences the work while keeping feature work moving',
      'Fits the no-feature-freeze constraint',
      'Includes a useful end-of-sprint review or follow-up step',
    ],
  },
  {
    caseId: 'spanish-plan-strong',
    pattern: 'strong_under_scored',
    rationale: 'Planning case with a strong answer that appears to benefit when the time budget is separated cleanly from the goal.',
    explicitQuestion:
      'I need a 30-day plan for basic conversational Spanish. Constraint: only 20 minutes per day. How should I structure the month?',
    explicitCriteria: [
      'Proposes a clear 30-day plan',
      'Sequences the weeks sensibly from start to finish',
      'Fits the limit of only 20 minutes per day',
      'Includes a useful weekly check-in or progress step',
    ],
  },
  {
    caseId: 'wifi-concise',
    pattern: 'concise_under_scored',
    rationale: 'Concise advice answer that may score better when the prompt and rubric explicitly allow a short two-step response.',
    explicitQuestion:
      'Give exactly two quick actions to improve my home Wi-Fi speed using the equipment I already have.',
    explicitCriteria: [
      'Directly recommends how to improve home Wi-Fi speed',
      'Gives two concrete actions the user can do now',
      'Keeps the advice within the current-equipment constraint',
      'Even as a short answer, the steps are still useful',
    ],
  },
  {
    caseId: 'running-concise',
    pattern: 'concise_under_scored',
    rationale: 'Concise advice answer where the answer format is strong, but the generic usefulness criterion may be too demanding.',
    explicitQuestion:
      'Give exactly two quick steps to start running three times a week without aggravating my knees.',
    explicitCriteria: [
      'Directly recommends how to start running three times a week',
      'Gives two concrete beginner-safe steps',
      'Keeps the advice knee-friendly',
      'Even as a short answer, the steps are still useful',
    ],
  },
  {
    caseId: 'resume-bullets-concise',
    pattern: 'concise_under_scored',
    rationale: 'Concise advice answer where truthfulness is important, but the constraint is easy to miss in a generic criterion.',
    explicitQuestion:
      'Give exactly two quick steps to make my resume bullets stronger without inventing achievements.',
    explicitCriteria: [
      'Directly answers how to strengthen resume bullets',
      'Gives two concrete revision steps',
      'Avoids inventing achievements or exaggerating results',
      'Even as a short answer, the steps are still useful',
    ],
  },
  {
    caseId: 'sleep-constraint-miss',
    pattern: 'constraint_over_scored',
    rationale: 'Constraint-miss advice case where the forbidden action should be named directly to see if scoring drops appropriately.',
    explicitQuestion:
      'I want to fall asleep earlier. Constraint: do not recommend medication or sleep aids. What should I do?',
    explicitCriteria: [
      'Directly recommends ways to fall asleep earlier',
      'Gives practical steps the user can try',
      'Does not recommend medication or sleep aids',
      'Explains why the advice could help',
    ],
  },
  {
    caseId: 'reading-device-constraint-miss',
    pattern: 'constraint_over_scored',
    rationale: 'Comparison constraint-miss case where the priorities need to be stated more explicitly than the generic comparison rubric.',
    explicitQuestion:
      'Which option better fits these priorities for reading: focused reading, long battery life, and fewer distractions: an e-reader or a tablet?',
    explicitCriteria: [
      'Makes a clear recommendation',
      'Compares the two options on focus, battery life, and distraction level',
      'The recommendation matches those stated priorities',
      'Explains the trade-off clearly',
    ],
  },
  {
    caseId: 'gaming-setup-constraint-miss',
    pattern: 'constraint_over_scored',
    rationale: 'Comparison constraint-miss case where portability and apartment size are more concrete than the generic constraint label.',
    explicitQuestion:
      'Which option better fits light gaming in a small apartment with occasional travel: a prebuilt desktop or a gaming laptop?',
    explicitCriteria: [
      'Makes a clear recommendation',
      'Compares the options on size, portability, and gaming needs',
      'Fits the small-apartment and occasional-travel constraints',
      'Explains the trade-off clearly',
    ],
  },
  {
    caseId: 'study-method-constraint-miss',
    pattern: 'constraint_over_scored',
    rationale: 'Comparison constraint-miss case where the short daily time budget needs to be spelled out more literally.',
    explicitQuestion:
      'Which option better fits memorizing biology terms if I only have 20 minutes a day: flashcards or summary notes?',
    explicitCriteria: [
      'Makes a clear recommendation',
      'Compares the options on recall efficiency and setup cost',
      'Fits the limit of only 20 minutes a day',
      'Explains the trade-off clearly',
    ],
  },
  {
    caseId: 'remote-onboarding-constraint-miss',
    pattern: 'constraint_over_scored',
    rationale: 'Planning constraint-miss case where the overloading risk should be stated directly in both the question and criteria.',
    explicitQuestion:
      'I need a first-week remote onboarding plan. Constraint: do not overload the new hire. How should I structure the week?',
    explicitCriteria: [
      'Proposes a clear first-week plan',
      'Sequences the onboarding work sensibly',
      'Avoids overloading the new hire with too much at once',
      'Includes a useful check-in or follow-up step',
    ],
  },
  {
    caseId: 'interview-prep-constraint-miss',
    pattern: 'constraint_under_scored',
    rationale: 'Planning constraint-miss case where the scorer may be over-penalizing because the work-schedule constraint is not phrased explicitly enough.',
    explicitQuestion:
      'I need a two-week technical interview prep plan while working full-time. Constraint: the plan must fit around a normal work schedule. How should I structure it?',
    explicitCriteria: [
      'Proposes a clear two-week plan',
      'Sequences the work sensibly',
      'Fits around full-time work instead of assuming large blocks off',
      'Includes a useful check-in or follow-up step',
    ],
  },
]
