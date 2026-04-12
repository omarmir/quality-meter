import { clampScore, mean } from './scoring'

const CONTENT_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'between',
  'by',
  'do',
  'for',
  'from',
  'how',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'my',
  'of',
  'on',
  'or',
  'should',
  'that',
  'the',
  'this',
  'to',
  'what',
  'which',
  'while',
  'with',
  'without',
  'would',
  'you',
  'your',
])

const NEGATION_TOKENS = new Set(['no', 'not', 'without', 'avoid', 'avoids', 'avoiding', "don't", 'do', 'never'])
const ACTION_VERBS = new Set([
  'add',
  'adjust',
  'audit',
  'begin',
  'check',
  'choose',
  'close',
  'compare',
  'create',
  'cut',
  'decide',
  'draft',
  'focus',
  'group',
  'identify',
  'list',
  'lower',
  'measure',
  'move',
  'note',
  'pick',
  'plan',
  'prioritize',
  'reduce',
  'remove',
  'restart',
  'review',
  'schedule',
  'separate',
  'set',
  'sort',
  'split',
  'start',
  'stop',
  'test',
  'track',
  'turn',
  'use',
  'write',
])
const COMPARISON_CUES = ['choose', 'pick', 'prefer', 'recommend', 'better', 'best', 'go with']
const TRADEOFF_CUES = ['but', 'however', 'while', 'although', 'trade-off', 'tradeoff', 'on the other hand']
const SEQUENCE_CUES = ['first', 'then', 'next', 'after', 'before', 'finally', 'start', 'begin', 'week', 'day', 'phase', 'step']
const FOLLOW_UP_CUES = ['review', 'retest', 'revisit', 'check', 'follow up', 'follow-up', 'measure', 'adjust', 'retrospective']
const MONEY_PATTERN = /\$?\d+(?:\.\d+)?/g

export type QualityTaskType = 'advice' | 'comparison' | 'planning' | 'unknown'

export type ExtractedConstraint = {
  category: 'avoid' | 'budget' | 'timeline' | 'effort' | 'priority'
  summary: string
  tokens: string[]
  maxValue?: number
  unit?: string
}

export type StructuredConstraintAssessment = {
  extracted: ExtractedConstraint[]
  presence: number
  respect: number
  violations: string[]
}

export type TaskStructureAssessment = {
  taskType: QualityTaskType
  score: number
  reasons: string[]
}

export type CriterionNormalizationResult = {
  taskType: QualityTaskType
  goalSummary: string
  constraintSummary: string
  prioritySummary: string
  optionSummary: string
  normalizedCriteria: string[]
}

export function detectQualityTaskType(question: string, criteria: string[] = []): QualityTaskType {
  const text = `${question} ${criteria.join(' ')}`.toLowerCase()

  if (
    /\bbetween\b/.test(text) ||
    /\b(?:vs\.?|versus)\b/.test(text) ||
    /\bwhich\b/.test(text) ||
    /\bcompare\b/.test(text) ||
    /\btrade-?off\b/.test(text) ||
    /\boption\b/.test(text)
  ) {
    return 'comparison'
  }

  if (
    /\bplan\b/.test(text) ||
    /\bsequence\b/.test(text) ||
    /\bsprint\b/.test(text) ||
    /\btimeline\b/.test(text) ||
    /\bcheck-?in\b/.test(text) ||
    /\bfollow-?up\b/.test(text)
  ) {
    return 'planning'
  }

  if (/\bhow can i\b/.test(text) || /\bwhat should i\b/.test(text) || /\bpractical steps\b/.test(text)) {
    return 'advice'
  }

  return 'unknown'
}

export function normalizeCriteriaForScoring(question: string, criteria: string[]) {
  const taskType = detectQualityTaskType(question, criteria)
  const goalSummary = extractGoalSummary(question, taskType)
  const constraints = extractConstraints(question)
  const constraintSummary = constraints.map((constraint) => constraint.summary).join('; ')
  const prioritySummary = extractPrioritySummary(question)
  const optionSummary = extractOptionSummary(question)

  return {
    taskType,
    goalSummary,
    constraintSummary,
    prioritySummary,
    optionSummary,
    normalizedCriteria: criteria.map((criterion) =>
      normalizeCriterionForScoring(criterion, {
        taskType,
        goalSummary,
        constraintSummary,
        prioritySummary,
        optionSummary,
      }),
    ),
  } satisfies CriterionNormalizationResult
}

export function assessDeterministicConstraints(question: string, response: string): StructuredConstraintAssessment {
  const extracted = extractConstraints(question)

  if (extracted.length === 0) {
    return {
      extracted,
      presence: 0,
      respect: 1,
      violations: [],
    }
  }

  const normalizedResponse = normalizeText(response)
  const responseTokens = contentTokens(normalizedResponse)
  const violations = extracted
    .map((constraint) => detectConstraintViolation(constraint, normalizedResponse, responseTokens))
    .filter((violation): violation is string => Boolean(violation))

  const presence = clampScore(0.5 + extracted.length * 0.15)

  if (violations.length === 0) {
    return {
      extracted,
      presence,
      respect: 1,
      violations,
    }
  }

  return {
    extracted,
    presence,
    respect: clampScore(1 - Math.min(0.8, violations.length * 0.35)),
    violations,
  }
}

export function assessTaskStructure(question: string, response: string, criteria: string[]): TaskStructureAssessment {
  const taskType = detectQualityTaskType(question, criteria)
  const normalizedResponse = normalizeText(response)
  const segments = splitIntoSegments(normalizedResponse)
  const loweredResponse = normalizedResponse.toLowerCase()
  const reasons: string[] = []

  if (taskType === 'comparison') {
    const options = extractOptions(question)
    const optionMentions = options.map((option) => containsPhrase(loweredResponse, option.toLowerCase()) ? 1 : 0)
    const recommendation = COMPARISON_CUES.some((cue) => loweredResponse.includes(cue)) ? 1 : 0
    const tradeoff = TRADEOFF_CUES.some((cue) => loweredResponse.includes(cue)) ? 1 : 0
    const score = mean([
      options.length === 2 ? mean(optionMentions) : 0.75,
      recommendation,
      tradeoff,
    ])

    if (mean(optionMentions) >= 0.5) {
      reasons.push('mentions the compared options')
    }
    if (recommendation) {
      reasons.push('makes a recommendation')
    }
    if (tradeoff) {
      reasons.push('includes trade-off language')
    }

    return { taskType, score: clampScore(score), reasons }
  }

  if (taskType === 'planning') {
    const sequenceCount = SEQUENCE_CUES.filter((cue) => loweredResponse.includes(cue)).length
    const followUp = FOLLOW_UP_CUES.some((cue) => loweredResponse.includes(cue)) ? 1 : 0
    const score = mean([
      clampScore((segments.length - 1) / 3),
      clampScore(sequenceCount / 2),
      followUp,
    ])

    if (segments.length >= 2) {
      reasons.push('has multiple steps')
    }
    if (sequenceCount > 0) {
      reasons.push('uses sequence markers')
    }
    if (followUp) {
      reasons.push('includes a review or follow-up cue')
    }

    return { taskType, score: clampScore(score), reasons }
  }

  if (taskType === 'advice') {
    const segmentStarts = segments.map((segment) => firstContentToken(segment))
    const actionStarts = segmentStarts.filter((token) => token && ACTION_VERBS.has(token)).length
    const score = mean([
      clampScore(actionStarts / Math.max(2, segments.length)),
      clampScore((segments.length - 0.5) / 2.5),
      loweredResponse.endsWith('?') ? 0 : 1,
    ])

    if (actionStarts > 0) {
      reasons.push('starts steps with action verbs')
    }
    if (segments.length >= 2) {
      reasons.push('has more than one concrete step')
    }

    return { taskType, score: clampScore(score), reasons }
  }

  return {
    taskType,
    score: 1,
    reasons,
  }
}

function normalizeCriterionForScoring(
  criterion: string,
  context: Omit<CriterionNormalizationResult, 'normalizedCriteria'>,
) {
  const trimmedCriterion = criterion.trim()

  if (!trimmedCriterion) {
    return criterion
  }

  if (/answers the question directly/i.test(trimmedCriterion) && context.goalSummary) {
    return `Directly answers the question about ${context.goalSummary}`
  }

  if (/provides concrete, practical steps/i.test(trimmedCriterion)) {
    return context.taskType === 'planning'
      ? 'Gives concrete steps the user can follow in the plan'
      : 'Gives concrete steps the user can take now'
  }

  if (/gives enough detail or rationale to be useful/i.test(trimmedCriterion)) {
    return 'Explains why the suggested response should help'
  }

  if (/gives a clear recommendation/i.test(trimmedCriterion)) {
    return context.optionSummary
      ? `Makes a clear recommendation between ${context.optionSummary}`
      : 'Makes a clear recommendation'
  }

  if (/compares the options on relevant factors/i.test(trimmedCriterion)) {
    return context.prioritySummary
      ? `Compares the options on ${context.prioritySummary}`
      : 'Compares the options on the key decision factors'
  }

  if (/explains the trade-offs or rationale/i.test(trimmedCriterion)) {
    return context.prioritySummary
      ? `Explains the trade-offs relative to ${context.prioritySummary}`
      : 'Explains the trade-offs clearly'
  }

  if (/proposes a clear plan/i.test(trimmedCriterion) && context.goalSummary) {
    return `Proposes a clear plan to ${context.goalSummary}`
  }

  if (/orders the work in a sensible sequence/i.test(trimmedCriterion)) {
    return 'Sequences the work in a sensible order'
  }

  if (/includes a useful check-in or follow-up step/i.test(trimmedCriterion)) {
    return 'Includes a useful review or follow-up step'
  }

  if (/(respects|fits) the stated (scope or )?constraints/i.test(trimmedCriterion) && context.constraintSummary) {
    return `Fits the stated constraint: ${context.constraintSummary}`
  }

  return trimmedCriterion
}

function extractGoalSummary(question: string, taskType: QualityTaskType) {
  const normalizedQuestion = question.trim().replace(/[?]+$/g, '')

  if (!normalizedQuestion) {
    return ''
  }

  const withoutSplit = normalizedQuestion.split(/\bwithout\b/i)[0] ?? normalizedQuestion
  const withSplit = withoutSplit.split(/\bwith\b/i)[0] ?? withoutSplit
  const forSplit = taskType === 'comparison' ? withoutSplit : withSplit

  const cleaned = forSplit
    .replace(/^(?:goal:\s*)/i, '')
    .replace(/^(?:how can i|what should i try first if i need to|what should i|what are two quick steps to|what is a practical way to|how should i plan to|what plan would you suggest to|how can i organize a plan to|what is a short plan to|should i choose|which is the better choice,|which should i choose for now,|what would you pick between|i need to decide between)\s*/i, '')
    .replace(/\b(?:should i choose|which option better fits this situation:|what would you pick between)\b/i, '')
    .trim()

  return cleaned.replace(/^(?:to\s+)/i, '').trim()
}

function extractPrioritySummary(question: string) {
  const normalizedQuestion = question.trim().replace(/[?]+$/g, '')

  const forMatch = normalizedQuestion.match(/\bfor\s+(.+?)(?:\s+(?:with|when|while)\b|$)/i)
  if (forMatch?.[1]) {
    return cleanupSummary(forMatch[1])
  }

  const moreThanMatch = normalizedQuestion.match(/\b(.+?)\s+more than\s+(.+?)(?:$|[,.?])/i)
  if (moreThanMatch?.[0]) {
    return cleanupSummary(moreThanMatch[0])
  }

  return ''
}

function extractOptionSummary(question: string) {
  const options = extractOptions(question)
  return options.length === 2 ? `${options[0]} and ${options[1]}` : ''
}

function extractOptions(question: string) {
  const betweenMatch = question.match(/\bbetween\s+(.+?)\s+and\s+(.+?)(?:\s+(?:for|with|when|while|in)\b|[?.]|$)/i)
  if (betweenMatch) {
    return [cleanupSummary(betweenMatch[1]), cleanupSummary(betweenMatch[2])].filter(Boolean)
  }

  const chooseMatch = question.match(/\bchoose\s+(.+?)\s+or\s+(.+?)(?:\s+(?:for|with|when|while|in)\b|[?.]|$)/i)
  if (chooseMatch) {
    return [cleanupSummary(chooseMatch[1]), cleanupSummary(chooseMatch[2])].filter(Boolean)
  }

  return []
}

function extractConstraints(question: string) {
  const constraints: ExtractedConstraint[] = []
  const normalizedQuestion = normalizeText(question)

  for (const match of normalizedQuestion.matchAll(/\bwithout\s+([^?.!,;]+)/gi)) {
    const summary = cleanupSummary(match[1] ?? '')
    if (summary) {
      constraints.push({
        category: 'avoid',
        summary: `without ${summary}`,
        tokens: contentTokens(summary),
      })
    }
  }

  for (const match of normalizedQuestion.matchAll(/\b(?:under|below|less than)\s+\$?(\d+(?:\.\d+)?)/gi)) {
    const maxValue = Number(match[1] ?? 0)
    if (Number.isFinite(maxValue) && maxValue > 0) {
      constraints.push({
        category: 'budget',
        summary: `under $${maxValue}`,
        tokens: [],
        maxValue,
        unit: 'dollars',
      })
    }
  }

  for (const match of normalizedQuestion.matchAll(/\bwith\s+(\d+(?:\.\d+)?)\s+(minutes?|hours?)\s+(?:a|per)\s+day/gi)) {
    const maxValue = Number(match[1] ?? 0)
    const unit = (match[2] ?? '').toLowerCase()
    if (Number.isFinite(maxValue) && maxValue > 0) {
      constraints.push({
        category: 'effort',
        summary: `with ${maxValue} ${unit} a day`,
        tokens: [],
        maxValue: convertToMinutes(maxValue, unit),
        unit: 'minutes_per_day',
      })
    }
  }

  for (const match of normalizedQuestion.matchAll(/\b(?:in|within)\s+(\d+(?:\.\d+)?)\s+(days?|weeks?|months?|sprints?)/gi)) {
    const maxValue = Number(match[1] ?? 0)
    const unit = (match[2] ?? '').toLowerCase()
    if (Number.isFinite(maxValue) && maxValue > 0) {
      constraints.push({
        category: 'timeline',
        summary: `within ${maxValue} ${unit}`,
        tokens: [],
        maxValue: convertToDays(maxValue, unit),
        unit: 'days',
      })
    }
  }

  const priorityMatch = normalizedQuestion.match(/\b([a-z][^?.!,;]+?)\s+more than\s+([a-z][^?.!,;]+)/i)
  if (priorityMatch) {
    constraints.push({
      category: 'priority',
      summary: cleanupSummary(priorityMatch[0]),
      tokens: contentTokens(priorityMatch[0]),
    })
  }

  return dedupeConstraints(constraints)
}

function detectConstraintViolation(constraint: ExtractedConstraint, response: string, responseTokens: string[]) {
  if (constraint.category === 'budget' && constraint.maxValue !== undefined) {
    const amounts = Array.from(response.matchAll(MONEY_PATTERN))
      .map((match) => Number((match[0] ?? '').replace(/[^0-9.]/g, '')))
      .filter((value) => Number.isFinite(value))

    if (amounts.some((value) => value > constraint.maxValue! * 1.15)) {
      return `mentions a cost above ${constraint.summary}`
    }

    return ''
  }

  if ((constraint.category === 'effort' || constraint.category === 'timeline') && constraint.maxValue !== undefined) {
    const responseDurations = extractResponseDurations(response, constraint.unit === 'days' ? 'days' : 'minutes_per_day')

    if (responseDurations.some((value) => value > constraint.maxValue! * 1.35)) {
      return `mentions a duration beyond ${constraint.summary}`
    }

    return ''
  }

  if (constraint.category === 'avoid') {
    if (constraint.tokens.length === 0) {
      return ''
    }

    const overlap = constraint.tokens.filter((token) => responseTokens.includes(token))
    if (overlap.length >= Math.min(2, constraint.tokens.length)) {
      const negated = overlap.every((token) => isTokenNegated(response, token))
      return negated ? '' : `reuses forbidden constraint language from "${constraint.summary}"`
    }
  }

  if (constraint.category === 'priority' && constraint.tokens.length > 0) {
    const overlap = constraint.tokens.filter((token) => responseTokens.includes(token))
    if (overlap.length === 0) {
      return 'does not surface the stated priority'
    }
  }

  return ''
}

function dedupeConstraints(constraints: ExtractedConstraint[]) {
  const seen = new Set<string>()

  return constraints.filter((constraint) => {
    const key = `${constraint.category}:${constraint.summary}`
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function convertToMinutes(value: number, unit: string) {
  return unit.startsWith('hour') ? value * 60 : value
}

function convertToDays(value: number, unit: string) {
  if (unit.startsWith('week')) {
    return value * 7
  }
  if (unit.startsWith('month')) {
    return value * 30
  }
  if (unit.startsWith('sprint')) {
    return value * 14
  }
  return value
}

function extractResponseDurations(response: string, mode: 'days' | 'minutes_per_day') {
  const matches = Array.from(response.matchAll(/(\d+(?:\.\d+)?)\s+(minutes?|hours?|days?|weeks?|months?)(?:\s+(?:a|per)\s+day)?/gi))

  return matches
    .map((match) => {
      const value = Number(match[1] ?? 0)
      const unit = (match[2] ?? '').toLowerCase()
      const perDay = /\s(?:a|per)\s+day$/i.test(match[0] ?? '')

      if (!Number.isFinite(value) || value <= 0) {
        return null
      }

      if (mode === 'minutes_per_day') {
        if (unit.startsWith('hour')) {
          return value * 60
        }
        if (unit.startsWith('minute') && perDay) {
          return value
        }
        if (unit.startsWith('minute')) {
          return value
        }
        return null
      }

      if (unit.startsWith('day')) {
        return value
      }
      if (unit.startsWith('week')) {
        return value * 7
      }
      if (unit.startsWith('month')) {
        return value * 30
      }
      return null
    })
    .filter((value): value is number => value !== null)
}

function splitIntoSegments(text: string) {
  const normalizedText = text.replace(/\r\n/g, '\n').trim()

  if (!normalizedText) {
    return []
  }

  const sentenceSegments = normalizedText
    .split(/(?<=[.?!])\s+|\n+/)
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (sentenceSegments.length > 1) {
    return sentenceSegments
  }

  return normalizedText
    .split(/[;•·]+|\s+-\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
}

function cleanupSummary(text: string) {
  return text.replace(/[?.!,;:]+$/g, '').trim()
}

function normalizeText(text: string) {
  return text.replace(/\r\n/g, '\n').trim()
}

function contentTokens(text: string) {
  return (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter(
    (token) => token.length > 2 && !CONTENT_STOP_WORDS.has(token),
  )
}

function firstContentToken(text: string) {
  return contentTokens(text)[0] ?? ''
}

function containsPhrase(text: string, phrase: string) {
  return Boolean(phrase) && text.includes(phrase)
}

function isTokenNegated(text: string, token: string) {
  const normalized = text.toLowerCase()
  const tokenIndex = normalized.indexOf(token.toLowerCase())

  if (tokenIndex === -1) {
    return false
  }

  const window = normalized.slice(Math.max(0, tokenIndex - 24), tokenIndex)
  return Array.from(NEGATION_TOKENS).some((cue) => window.includes(cue))
}
