export type BenchmarkKind = 'advice' | 'comparison' | 'planning'
export type BenchmarkProfile = 'strong' | 'partial' | 'constraint_miss' | 'concise' | 'off_topic'

export type BenchmarkCriterion = {
  label: string
  weight: number
}

export type BenchmarkCase = {
  id: string
  kind: BenchmarkKind
  profile: BenchmarkProfile
  question: string
  criteria: BenchmarkCriterion[]
  answer: string
  referenceScores: number[]
}

const ADVICE_CRITERIA: BenchmarkCriterion[] = [
  { label: 'Answers the question directly', weight: 30 },
  { label: 'Provides concrete, practical steps', weight: 30 },
  { label: 'Respects the stated constraints', weight: 20 },
  { label: 'Gives enough detail or rationale to be useful', weight: 20 },
]

const COMPARISON_CRITERIA: BenchmarkCriterion[] = [
  { label: 'Gives a clear recommendation', weight: 30 },
  { label: 'Compares the options on relevant factors', weight: 25 },
  { label: 'Respects the stated constraints', weight: 25 },
  { label: 'Explains the trade-offs or rationale', weight: 20 },
]

const PLANNING_CRITERIA: BenchmarkCriterion[] = [
  { label: 'Proposes a clear plan', weight: 30 },
  { label: 'Orders the work in a sensible sequence', weight: 25 },
  { label: 'Fits the stated scope or constraints', weight: 25 },
  { label: 'Includes a useful check-in or follow-up step', weight: 20 },
]

const REFERENCE_SCORES: Record<BenchmarkKind, Record<BenchmarkProfile, number[]>> = {
  advice: {
    strong: [0.95, 0.9, 0.9, 0.8],
    partial: [0.8, 0.55, 0.85, 0.25],
    constraint_miss: [0.8, 0.7, 0.05, 0.4],
    concise: [0.85, 0.6, 0.9, 0.2],
    off_topic: [0, 0, 0, 0],
  },
  comparison: {
    strong: [0.95, 0.9, 0.9, 0.8],
    partial: [0.8, 0.35, 0.8, 0.2],
    constraint_miss: [0.85, 0.75, 0.05, 0.5],
    concise: [0.85, 0.45, 0.85, 0.25],
    off_topic: [0, 0, 0, 0],
  },
  planning: {
    strong: [0.95, 0.9, 0.9, 0.75],
    partial: [0.8, 0.45, 0.8, 0.15],
    constraint_miss: [0.85, 0.7, 0.05, 0.35],
    concise: [0.8, 0.55, 0.85, 0.15],
    off_topic: [0, 0, 0, 0],
  },
}

type AdviceFamily = {
  id: string
  goal: string
  constraint: string
  steps: [string, string, string]
  rationale: string
  ignoredConstraintMove: string
}

type ComparisonFamily = {
  id: string
  optionA: string
  optionB: string
  constraint: string
  recommended: string
  reason: string
  tradeoff: string
  constraintFit: string
  ignoresConstraint: string
}

type PlanningFamily = {
  id: string
  goal: string
  constraint: string
  steps: [string, string, string]
  followUp: string
  ignoresConstraint: string
}

const OFF_TOPIC_ANSWERS = [
  'Nothing.',
  'What are you talking about?',
  "I don't know.",
  'No idea.',
  'Maybe later.',
]

function makeAdviceCases(family: AdviceFamily, index: number): BenchmarkCase[] {
  return [
    {
      id: `${family.id}-strong`,
      kind: 'advice',
      profile: 'strong',
      question: `How can I ${family.goal} ${family.constraint}?`,
      criteria: ADVICE_CRITERIA,
      answer: `${family.steps[0]}. ${family.steps[1]}. ${family.steps[2]}. ${family.rationale}.`,
      referenceScores: REFERENCE_SCORES.advice.strong,
    },
    {
      id: `${family.id}-partial`,
      kind: 'advice',
      profile: 'partial',
      question: `What should I try first if I need to ${family.goal} ${family.constraint}?`,
      criteria: ADVICE_CRITERIA,
      answer: `${family.steps[0]}. Then test the result before deciding what to change next.`,
      referenceScores: REFERENCE_SCORES.advice.partial,
    },
    {
      id: `${family.id}-constraint-miss`,
      kind: 'advice',
      profile: 'constraint_miss',
      question: `What is a practical way to ${family.goal} ${family.constraint}?`,
      criteria: ADVICE_CRITERIA,
      answer: `${family.ignoredConstraintMove}. After that, ${lowerFirst(family.steps[0])}.`,
      referenceScores: REFERENCE_SCORES.advice.constraint_miss,
    },
    {
      id: `${family.id}-concise`,
      kind: 'advice',
      profile: 'concise',
      question: `What are two quick steps to ${family.goal} ${family.constraint}?`,
      criteria: ADVICE_CRITERIA,
      answer: `${family.steps[0]}. ${family.steps[1]}.`,
      referenceScores: REFERENCE_SCORES.advice.concise,
    },
    {
      id: `${family.id}-off-topic`,
      kind: 'advice',
      profile: 'off_topic',
      question: `I need to ${family.goal} ${family.constraint}. What should I do?`,
      criteria: ADVICE_CRITERIA,
      answer: OFF_TOPIC_ANSWERS[index % OFF_TOPIC_ANSWERS.length],
      referenceScores: REFERENCE_SCORES.advice.off_topic,
    },
  ]
}

function makeComparisonCases(family: ComparisonFamily, index: number): BenchmarkCase[] {
  return [
    {
      id: `${family.id}-strong`,
      kind: 'comparison',
      profile: 'strong',
      question: `Should I choose ${family.optionA} or ${family.optionB} ${family.constraint}?`,
      criteria: COMPARISON_CRITERIA,
      answer: `Choose ${family.recommended}. ${family.reason}. ${family.tradeoff}. ${family.constraintFit}.`,
      referenceScores: REFERENCE_SCORES.comparison.strong,
    },
    {
      id: `${family.id}-partial`,
      kind: 'comparison',
      profile: 'partial',
      question: `Which is the better choice, ${family.optionA} or ${family.optionB} ${family.constraint}?`,
      criteria: COMPARISON_CRITERIA,
      answer: `Pick ${family.recommended}. It should work better overall for your situation.`,
      referenceScores: REFERENCE_SCORES.comparison.partial,
    },
    {
      id: `${family.id}-constraint-miss`,
      kind: 'comparison',
      profile: 'constraint_miss',
      question: `What would you pick between ${family.optionA} and ${family.optionB} ${family.constraint}?`,
      criteria: COMPARISON_CRITERIA,
      answer: `Choose ${family.ignoresConstraint}. It is the strongest option overall, even if it asks for more than you wanted to spend or carry.`,
      referenceScores: REFERENCE_SCORES.comparison.constraint_miss,
    },
    {
      id: `${family.id}-concise`,
      kind: 'comparison',
      profile: 'concise',
      question: `Which should I choose for now, ${family.optionA} or ${family.optionB} ${family.constraint}?`,
      criteria: COMPARISON_CRITERIA,
      answer: `Choose ${family.recommended} because ${lowerFirst(family.reason).replace(/[.]+$/g, '')}.`,
      referenceScores: REFERENCE_SCORES.comparison.concise,
    },
    {
      id: `${family.id}-off-topic`,
      kind: 'comparison',
      profile: 'off_topic',
      question: `I need to decide between ${family.optionA} and ${family.optionB} ${family.constraint}. What do you think?`,
      criteria: COMPARISON_CRITERIA,
      answer: OFF_TOPIC_ANSWERS[(index + 1) % OFF_TOPIC_ANSWERS.length],
      referenceScores: REFERENCE_SCORES.comparison.off_topic,
    },
  ]
}

function makePlanningCases(family: PlanningFamily, index: number): BenchmarkCase[] {
  return [
    {
      id: `${family.id}-strong`,
      kind: 'planning',
      profile: 'strong',
      question: `How should I plan to ${family.goal} ${family.constraint}?`,
      criteria: PLANNING_CRITERIA,
      answer: `${family.steps[0]}. ${family.steps[1]}. ${family.steps[2]}. ${family.followUp}.`,
      referenceScores: REFERENCE_SCORES.planning.strong,
    },
    {
      id: `${family.id}-partial`,
      kind: 'planning',
      profile: 'partial',
      question: `What plan would you suggest to ${family.goal} ${family.constraint}?`,
      criteria: PLANNING_CRITERIA,
      answer: `${family.steps[0]}. Then keep moving through the rest when you have time.`,
      referenceScores: REFERENCE_SCORES.planning.partial,
    },
    {
      id: `${family.id}-constraint-miss`,
      kind: 'planning',
      profile: 'constraint_miss',
      question: `How can I organize a plan to ${family.goal} ${family.constraint}?`,
      criteria: PLANNING_CRITERIA,
      answer: `${family.ignoresConstraint}. After that, ${lowerFirst(family.steps[0])}.`,
      referenceScores: REFERENCE_SCORES.planning.constraint_miss,
    },
    {
      id: `${family.id}-concise`,
      kind: 'planning',
      profile: 'concise',
      question: `What is a short plan to ${family.goal} ${family.constraint}?`,
      criteria: PLANNING_CRITERIA,
      answer: `${family.steps[0]}. ${family.steps[1]}.`,
      referenceScores: REFERENCE_SCORES.planning.concise,
    },
    {
      id: `${family.id}-off-topic`,
      kind: 'planning',
      profile: 'off_topic',
      question: `I need to ${family.goal} ${family.constraint}. How would you approach it?`,
      criteria: PLANNING_CRITERIA,
      answer: OFF_TOPIC_ANSWERS[(index + 2) % OFF_TOPIC_ANSWERS.length],
      referenceScores: REFERENCE_SCORES.planning.off_topic,
    },
  ]
}

const adviceFamilies: AdviceFamily[] = [
  {
    id: 'wifi',
    goal: 'improve my home Wi-Fi speed',
    constraint: 'without replacing all my equipment',
    steps: [
      'Move the router to an open, central spot away from thick walls and microwaves',
      'Restart the modem and router, then retest speeds in the weakest room',
      'Separate the 2.4 GHz and 5 GHz bands if the router supports it so nearby devices can use the faster band',
    ],
    rationale: 'These changes reduce interference and help you see whether placement or settings are the real bottleneck',
    ignoredConstraintMove: 'Buy a new mesh system and a premium router first',
  },
  {
    id: 'meal-prep',
    goal: 'prep work lunches for the week',
    constraint: 'in under two hours on Sunday',
    steps: [
      'Choose one protein, one grain, and two vegetables so you can batch-cook everything at once',
      'Roast the vegetables and cook the grain while the protein is in the oven or pan',
      'Pack the lunches assembly-line style and add one simple sauce or seasoning at the end so the meals do not all taste the same',
    ],
    rationale: 'Keeping the menu narrow saves setup time and gives you repeatable lunches without spending the whole afternoon cooking',
    ignoredConstraintMove: 'Cook a different hot lunch from scratch every night instead',
  },
  {
    id: 'sleep',
    goal: 'fall asleep earlier',
    constraint: 'without taking medication',
    steps: [
      'Set the same wake-up time every day for a week so your body clock has one stable anchor',
      'Move bright screens and stimulating tasks out of the last hour before bed',
      'Use a short wind-down routine such as dim lights, reading, and a cool room so your body gets a repeatable cue',
    ],
    rationale: 'A consistent wake time and a predictable pre-sleep routine usually shift bedtime more reliably than trying to force sleep in the moment',
    ignoredConstraintMove: 'Take strong sleep aids so you can knock yourself out quickly',
  },
  {
    id: 'email-backlog',
    goal: 'cut down my work email backlog',
    constraint: 'without missing important messages',
    steps: [
      'Create a quick filter for your manager, direct reports, and calendar invites so high-priority mail is visible first',
      'Process the inbox in short passes by archiving, replying, or flagging instead of rereading everything',
      'Block one focused cleanup session a day until the backlog is down, and stop using the inbox as a to-do list',
    ],
    rationale: 'Priority filters keep urgent mail visible while short decision-based passes prevent the backlog from growing again',
    ignoredConstraintMove: 'Delete everything older than a week and start fresh',
  },
  {
    id: 'battery',
    goal: 'extend my laptop battery life while traveling',
    constraint: 'without buying a new laptop',
    steps: [
      'Lower screen brightness and turn on the operating system battery saver profile before you leave',
      'Close browser tabs and background apps you do not need so the CPU is not constantly waking up',
      'Turn off Bluetooth, keyboard lighting, and high-refresh settings when you are away from power for long stretches',
    ],
    rationale: 'Battery drain usually comes from display power and background activity, so simple setting changes can buy you more hours quickly',
    ignoredConstraintMove: 'Replace the laptop with a newer model that has a bigger battery',
  },
  {
    id: 'running',
    goal: 'start running three times a week',
    constraint: 'without aggravating my knees',
    steps: [
      'Begin with run-walk intervals on flat ground so the impact stays manageable while your joints adapt',
      'Keep two easy sessions and only one slightly longer session each week instead of pushing every run',
      'Use a simple warm-up and stop if knee pain sharpens instead of treating discomfort as a sign to push harder',
    ],
    rationale: 'A gradual load and flatter routes reduce the jump in stress that often irritates knees when someone starts running again',
    ignoredConstraintMove: 'Sign up for a hard interval class and try to run every day right away',
  },
  {
    id: 'resume-bullets',
    goal: 'turn my job duties into stronger resume bullets',
    constraint: 'without inventing achievements',
    steps: [
      'Rewrite each duty around an action you actually took and the scope of the work',
      'Add concrete details such as volume, team size, turnaround time, or tools when you can verify them',
      'Pair routine responsibilities with the result they supported so the bullet reads like an outcome instead of a task list',
    ],
    rationale: 'Specific scope and visible results make truthful bullets sound stronger without crossing into exaggeration',
    ignoredConstraintMove: 'Add bigger numbers and titles than you really had so the bullets stand out',
  },
]

const comparisonFamilies: ComparisonFamily[] = [
  {
    id: 'study-method',
    optionA: 'flashcards',
    optionB: 'summary notes',
    constraint: 'if I only have 20 minutes a day to memorize biology terms before an exam',
    recommended: 'flashcards',
    reason: 'They force active recall in short sessions, which is a better fit for memorization than rereading notes',
    tradeoff: 'Summary notes are still useful for seeing the big picture, but they are easier to skim without checking what you actually remember',
    constraintFit: 'The short daily time box favors a method you can repeat quickly without setup',
    ignoresConstraint: 'summary notes',
  },
  {
    id: 'city-stay',
    optionA: 'a hotel',
    optionB: 'an Airbnb',
    constraint: 'for a weekend city trip on a tight budget without renting a car',
    recommended: 'a hotel',
    reason: 'A simple hotel near transit is easier to price clearly and avoids extra cleaning or check-in friction',
    tradeoff: 'An Airbnb may give you more space, but the added fees and location trade-offs can wipe out the headline savings',
    constraintFit: 'When you are staying briefly and moving around by transit, predictability matters more than extra room',
    ignoresConstraint: 'an Airbnb far outside the center',
  },
  {
    id: 'reading-device',
    optionA: 'an e-reader',
    optionB: 'a tablet',
    constraint: 'for focused reading with long battery life and fewer distractions',
    recommended: 'an e-reader',
    reason: 'The display is easier on the eyes for long reading sessions and the battery lasts much longer',
    tradeoff: 'A tablet is more flexible for apps and video, but that flexibility also brings notifications and a shorter battery window',
    constraintFit: 'Your constraint is focused reading, so the narrower device is actually the better match',
    ignoresConstraint: 'a bright general-purpose tablet',
  },
  {
    id: 'gaming-setup',
    optionA: 'a prebuilt desktop',
    optionB: 'a gaming laptop',
    constraint: 'for light gaming in a small apartment with occasional travel',
    recommended: 'a gaming laptop',
    reason: 'It covers both the small-space setup and the travel requirement without needing separate gear',
    tradeoff: 'A desktop usually gives more upgrade room for the money, but it locks you into one location',
    constraintFit: 'Because you need portability sometimes, the all-in-one trade-off is worth it here',
    ignoresConstraint: 'a large tower desktop with a separate monitor',
  },
  {
    id: 'request-tracker',
    optionA: 'a spreadsheet',
    optionB: 'a lightweight database',
    constraint: 'for tracking support requests in a five-person team that needs basic reporting',
    recommended: 'a lightweight database',
    reason: 'It gives you cleaner status fields, fewer version conflicts, and easier filtering once multiple people are updating records',
    tradeoff: 'A spreadsheet is faster to start, but it becomes messy when the team needs reliable ownership and history',
    constraintFit: 'The team is small, but shared updates and reporting still justify a bit more structure',
    ignoresConstraint: 'a custom enterprise ticketing platform',
  },
  {
    id: 'winter-commute',
    optionA: 'bike commuting',
    optionB: 'taking transit',
    constraint: 'for a 25-minute city commute in winter when I want reliability more than exercise',
    recommended: 'taking transit',
    reason: 'It is more predictable in bad weather and removes the setup burden of icy roads, clothing, and storage',
    tradeoff: 'Biking can be faster and healthier on good days, but winter conditions make the commute less consistent',
    constraintFit: 'Your priority is reliability, so weather-proofing matters more than the fitness upside',
    ignoresConstraint: 'biking every day no matter the weather',
  },
  {
    id: 'repo-structure',
    optionA: 'a monorepo',
    optionB: 'separate repositories',
    constraint: 'for two product teams that share one design system and release together often',
    recommended: 'a monorepo',
    reason: 'Shared tooling, coordinated changes, and cross-package updates are easier when the code lives together',
    tradeoff: 'Separate repos give cleaner ownership boundaries, but they add coordination overhead when releases depend on each other',
    constraintFit: 'Because the teams already share infrastructure and ship together, the integration cost matters more than strict repo isolation',
    ignoresConstraint: 'separate repositories with no shared tooling',
  },
]

const planningFamilies: PlanningFamily[] = [
  {
    id: 'interview-prep',
    goal: 'prepare for a technical interview',
    constraint: 'in two weeks while working full-time',
    steps: [
      'Spend the first two sessions listing the interview topics and identifying your weakest areas',
      'Block four short practice sessions for coding, system design, and behavioral stories across the week',
      'Use the second week for timed practice and one or two mock interviews instead of starting new material',
    ],
    followUp: 'At the end of each week, note which prompts still slow you down and focus the next sessions there',
    ignoresConstraint: 'Take several days off work and cram for eight hours a day',
  },
  {
    id: 'carry-on-trip',
    goal: 'pack for a three-day rainy trip',
    constraint: 'with carry-on luggage only',
    steps: [
      'Start with the fixed essentials such as travel documents, chargers, medication, and one waterproof outer layer',
      'Choose one neutral shoe and a small set of layered outfits that all work together',
      'Pack toiletries in travel sizes and leave bulky just-in-case items behind unless they are truly hard to replace',
    ],
    followUp: 'Before zipping the bag, remove one nonessential item from each category so you keep margin for the return trip',
    ignoresConstraint: 'Bring a full-size suitcase so you can pack extra options for every weather change',
  },
  {
    id: 'remote-onboarding',
    goal: 'onboard a new remote hire in the first week',
    constraint: 'without overwhelming them',
    steps: [
      'Give them one clear schedule for the week with a short list of outcomes for each day',
      'Front-load access, tools, and one or two key relationships before piling on deeper process documents',
      'End each day with a short check-in so questions surface before confusion compounds',
    ],
    followUp: 'Use the Friday review to capture open questions and decide what should move into week two',
    ignoresConstraint: 'Book their calendar solid with back-to-back training sessions from morning to evening',
  },
  {
    id: 'git-cleanup',
    goal: 'clean up a messy git repository',
    constraint: 'over one sprint without freezing feature work',
    steps: [
      'Start by agreeing on the smallest set of repo rules that will reduce the most confusion, such as branch naming and merge expectations',
      'Fix one high-friction area at a time, like stale branches or inconsistent release tagging, instead of refactoring the whole workflow at once',
      'Document the new path in the repo and roll it out through normal feature work rather than a big-bang migration',
    ],
    followUp: 'At the end of the sprint, review which parts people ignored and tighten the process there before adding more rules',
    ignoresConstraint: 'Stop all feature development until the entire repository history and workflow are redesigned',
  },
  {
    id: 'scope-meeting',
    goal: 'run a one-hour stakeholder meeting to narrow product scope',
    constraint: 'without drifting into open-ended brainstorming',
    steps: [
      'Send one short pre-read with the decision you need and the options already on the table',
      'Use the meeting to review the goal, confirm constraints, and time-box the discussion of each option',
      'Spend the final part of the meeting capturing the decision, open risks, and the single owner for next actions',
    ],
    followUp: 'Send the summary the same day so people react to the actual decision instead of reopening the whole discussion later',
    ignoresConstraint: 'Invite everyone to throw out new ideas for the full hour before talking about the original decision',
  },
  {
    id: 'spanish-plan',
    goal: 'learn basic conversational Spanish',
    constraint: 'in 30 days with 20 minutes a day',
    steps: [
      'Spend the first week on core phrases, pronunciation, and a small daily set of high-frequency words',
      'Use the middle weeks for short listening and speaking drills built around common situations like greetings, ordering, and directions',
      'Reserve the final week for repetition, shadowing, and tiny live practice sessions instead of adding lots of new material',
    ],
    followUp: 'At the end of each week, record yourself speaking for one minute so you can hear what still feels slow or unclear',
    ignoresConstraint: 'Sign up for a heavy textbook course that expects two-hour study blocks every day',
  },
]

export const BENCHMARK_CASES: BenchmarkCase[] = [
  ...adviceFamilies.flatMap((family, index) => makeAdviceCases(family, index)),
  ...comparisonFamilies.flatMap((family, index) => makeComparisonCases(family, index)),
  ...planningFamilies.flatMap((family, index) => makePlanningCases(family, index)),
]

if (BENCHMARK_CASES.length !== 100) {
  throw new Error(`Expected 100 benchmark cases, received ${BENCHMARK_CASES.length}.`)
}

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}
