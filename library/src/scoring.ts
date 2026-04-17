export const MODEL_TOKEN_LIMIT = 512
export const ESTIMATED_CHARS_PER_TOKEN = 4
export const HYPOTHESIS_TEMPLATE = '{}'
export const TOKEN_BUFFER = 12
export const MIN_SAFE_PREMISE_TOKENS = 128

const PROBABILITY_EPSILON = 1e-6
const CONTENT_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'because',
  'but',
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
  'so',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'to',
  'use',
  'using',
  'what',
  'when',
  'which',
  'while',
  'with',
  'without',
  'would',
  'you',
  'your',
])
const TOPIC_STOP_WORDS = new Set([
  ...CONTENT_STOP_WORDS,
  'about',
  'activity',
  'activities',
  'approach',
  'clear',
  'concrete',
  'deliver',
  'deliverables',
  'delivered',
  'delivery',
  'describe',
  'description',
  'detail',
  'details',
  'directly',
  'enough',
  'expected',
  'explain',
  'explains',
  'for',
  'general',
  'helpful',
  'implementation',
  'include',
  'includes',
  'method',
  'methods',
  'name',
  'named',
  'names',
  'outcome',
  'outcomes',
  'overview',
  'planned',
  'plan',
  'program',
  'purpose',
  'question',
  'recipient',
  'response',
  'result',
  'results',
  'say',
  'says',
  'specific',
  'state',
  'stated',
  'states',
  'support',
  'summary',
  'target',
  'targets',
  'through',
  'useful',
  'work',
])
const LINKING_VERBS = new Set(['is', 'are', 'was', 'were'])
const VERB_STARTERS = new Set([
  'answer',
  'answers',
  'address',
  'addresses',
  'provide',
  'provides',
  'use',
  'uses',
  'include',
  'includes',
  'explain',
  'explains',
  'give',
  'gives',
  'mention',
  'mentions',
  'cite',
  'cites',
  'compare',
  'compares',
  'describe',
  'describes',
  'identify',
  'identifies',
  'show',
  'shows',
  'state',
  'states',
  'offer',
  'offers',
  'suggest',
  'suggests',
  'cover',
  'covers',
  'discuss',
  'discusses',
  'note',
  'notes',
  'contain',
  'contains',
  'support',
  'supports',
  'justify',
  'justifies',
  'clarify',
  'clarifies',
  'follow',
  'follows',
  'reference',
  'references',
  'acknowledge',
  'acknowledges',
  'summarize',
  'summarizes',
  'connect',
  'connects',
  'focus',
  'focuses',
  'recommend',
  'recommends',
  'outline',
  'outlines',
  'has',
  'have',
])

export type HypothesisPair = {
  positive: string
  negative: string
}

export function buildEvaluationText(question: string, response: string) {
  const trimmedQuestion = question.trim()
  const trimmedResponse = response.trim()

  if (!trimmedQuestion) {
    return trimmedResponse
  }

  return `Question:\n${trimmedQuestion}\n\nResponse:\n${trimmedResponse}`
}

export function parseEvaluationText(inputText: string) {
  const marker = '\n\nResponse:\n'

  if (inputText.startsWith('Question:\n') && inputText.includes(marker)) {
    const [questionBlock, responseBlock] = inputText.split(marker)

    return {
      question: questionBlock.replace(/^Question:\n/, '').trim(),
      response: responseBlock.trim(),
    }
  }

  return {
    question: '',
    response: inputText.trim(),
  }
}

export function createAnswerValidityHypothesisEnsemble(question: string) {
  if (!question.trim()) {
    return createPrefixedHypothesisEnsemble({
      positive: 'The response is coherent and useful.',
      negative: 'The response is not coherent or useful.',
    })
  }

  return createPrefixedHypothesisEnsemble({
    positive: 'The response answers the question well.',
    negative: 'The response does not answer the question well.',
  })
}

export function createConstraintPresenceHypothesisEnsemble(): HypothesisPair[] {
  return [
    {
      positive: 'The question includes clear constraints, limits, or requirements that the response should follow.',
      negative: 'The question does not include important constraints, limits, or requirements beyond the main request.',
    },
    {
      positive: 'The question sets boundaries or conditions that a good response should respect.',
      negative: 'The question is mostly open-ended and does not set meaningful boundaries or conditions.',
    },
  ]
}

export function createConstraintRespectHypothesisEnsemble(): HypothesisPair[] {
  return [
    ...createPrefixedHypothesisEnsemble({
      positive: 'The response stays within the limits and restrictions stated in the question.',
      negative: 'The response recommends going outside the limits or restrictions stated in the question.',
    }),
    ...createPrefixedHypothesisEnsemble({
      positive: 'The response follows the user boundaries in the question instead of bypassing them.',
      negative: 'The response bypasses or overrides the user boundaries in the question.',
    }),
  ]
}

export function normalizeCriterionText(criterion: string) {
  return criterion.trim().replace(/[.?!]+$/g, '')
}

export function createCriterionHypothesis(criterion: string) {
  return createCriterionHypotheses(criterion).positive
}

export function createCriterionHypothesisEnsemble(criterion: string): HypothesisPair[] {
  return createPrefixedHypothesisEnsemble(createCriterionHypotheses(criterion))
}

export function createCriterionHypotheses(criterion: string) {
  const normalizedCriterion = normalizeCriterionText(criterion)

  if (!normalizedCriterion) {
    return {
      positive: 'The response satisfies the criterion.',
      negative: 'The response does not satisfy the criterion.',
    }
  }

  if (/^the response\b/i.test(normalizedCriterion)) {
    const positive = ensureSentence(normalizedCriterion)
    return {
      positive,
      negative: negateResponseSentence(positive),
    }
  }

  const loweredCriterion = lowerFirst(normalizedCriterion)
  const [firstWord = '', ...restWords] = loweredCriterion.split(/\s+/)
  const remainder = restWords.join(' ')

  if (LINKING_VERBS.has(firstWord)) {
    const predicate = remainder || 'relevant'

    return {
      positive: `The response ${firstWord} ${predicate}.`,
      negative: `The response is not ${predicate}.`,
    }
  }

  if (looksVerbPhrase(firstWord, restWords.length)) {
    return {
      positive: `The response ${loweredCriterion}.`,
      negative: `The response does not ${toBaseVerb(firstWord)}${remainder ? ` ${remainder}` : ''}.`,
    }
  }

  return {
    positive: `The response is ${loweredCriterion}.`,
    negative: `The response is not ${loweredCriterion}.`,
  }
}

export function estimateTokenCount(text: string) {
  const trimmed = text.trim()

  if (!trimmed) {
    return 0
  }

  return Math.ceil(trimmed.length / ESTIMATED_CHARS_PER_TOKEN)
}

export function getSafePremiseTokenBudget(criteria: string[]) {
  const longestHypothesisTokens = Math.max(
    ...criteria
      .filter(Boolean)
      .flatMap((criterion) =>
        createCriterionHypothesisEnsemble(criterion).flatMap(({ positive, negative }) => [
          estimateTokenCount(positive),
          estimateTokenCount(negative),
        ]),
      ),
    estimateTokenCount(createCriterionHypothesis('criterion')),
  )

  return Math.max(MIN_SAFE_PREMISE_TOKENS, MODEL_TOKEN_LIMIT - longestHypothesisTokens - TOKEN_BUFFER)
}

export function splitResponseIntoEvidenceChunks(response: string) {
  const segments = splitIntoSegments(response)

  if (segments.length <= 1) {
    return []
  }

  const chunks: string[] = []
  const seen = new Set<string>()

  const addChunk = (value: string) => {
    const normalized = value.trim()

    if (!normalized || seen.has(normalized)) {
      return
    }

    seen.add(normalized)
    chunks.push(normalized)
  }

  for (let index = 0; index < segments.length - 1; index += 1) {
    addChunk(`${segments[index]} ${segments[index + 1]}`)
  }

  addChunk(segments[0] ?? '')
  addChunk(segments[segments.length - 1] ?? '')

  if (segments.length > 2) {
    addChunk(segments[Math.floor((segments.length - 1) / 2)] ?? '')
  }

  return chunks.slice(0, 8)
}

export function pairSupportScore(positiveScore: number, negativeScore: number) {
  const positiveLogit = logit(clampProbability(positiveScore))
  const negativeLogit = logit(clampProbability(negativeScore))
  return clampScore(2 * sigmoid(positiveLogit - negativeLogit) - 1)
}

export function aggregateChunkSupport(chunkScores: number[], fallbackScore: number) {
  if (chunkScores.length === 0) {
    return fallbackScore
  }

  const rankedScores = [...chunkScores].sort((left, right) => right - left)
  const topChunkScores = rankedScores.slice(0, Math.min(2, rankedScores.length))
  return mean(topChunkScores)
}

export function aggregatePromptScores(promptScores: number[]) {
  if (promptScores.length === 0) {
    return 0
  }

  return median(promptScores)
}

export function computeAnswerValidityGate(answerSupport: number, response: string) {
  const wordGate = smoothstep(4, 28, countWordTokens(response))
  const segmentGate = smoothstep(0.5, 3, countResponseSegments(response))
  let surfaceGate = Math.cbrt(wordGate * segmentGate)

  if (response.trim().endsWith('?')) {
    surfaceGate *= 0.35
  }

  const supportGate = smoothstep(0.05, 0.7, answerSupport)
  return clampScore(Math.sqrt(surfaceGate * supportGate))
}

export function computeConstraintGate(constraintPresence: number, constraintRespect: number) {
  const presenceWeight = smoothstep(0.2, 0.7, constraintPresence)
  const effectiveConstraintScore = 1 - presenceWeight * (1 - constraintRespect)
  return clampScore(0.92 + 0.08 * effectiveConstraintScore)
}

export function computeWeakAnswerGate(
  question: string,
  response: string,
  answerSupport: number,
  criterionScores: number[],
) {
  if (criterionScores.length === 0) {
    return 1
  }

  const meanCriterion = mean(criterionScores)
  const medianCriterion = median(criterionScores)
  const weakestCriterion = Math.min(...criterionScores)
  const surfaceStrength = Math.sqrt(
    smoothstep(8, 30, countWordTokens(response)) * smoothstep(0.8, 2.6, countResponseSegments(response)),
  )
  const noveltyStrength = smoothstep(0.12, 0.45, computeNovelContentRatio(question, response))
  const supportExcess = clampScore(answerSupport - meanCriterion)
  const weakCoverage = 1 - smoothstep(0.2, 0.55, weakestCriterion)
  const middlingCoverage = 1 - smoothstep(0.35, 0.72, medianCriterion)
  const genericity = clampScore(supportExcess * 0.5 + weakCoverage * 0.2 + middlingCoverage * 0.3)
  const penalty = clampScore(genericity * 0.5 + (1 - noveltyStrength) * 0.35 + (1 - surfaceStrength) * 0.15)

  return clampScore(1 - 0.3 * penalty)
}

export function computeTopicAlignment(question: string, response: string, criteria: string[] = []) {
  const promptTopicTokens = extractTopicTokens([question, ...criteria].join(' '))

  if (promptTopicTokens.length < 2) {
    return 1
  }

  const responseTopicTokens = new Set(extractTopicTokens(response))

  if (responseTopicTokens.size === 0) {
    return 0
  }

  const matchedTopicTokens = promptTopicTokens.filter((token) => responseTopicTokens.has(token))
  const denominator = Math.max(2, Math.min(4, promptTopicTokens.length))

  return clampScore(matchedTopicTokens.length / denominator)
}

export function computeTopicAlignmentGate(
  topicAlignment: number,
  answerSupport: number,
  criterionScores: number[],
) {
  if (criterionScores.length === 0) {
    return 1
  }

  const meanCriterion = mean(criterionScores)
  const medianCriterion = median(criterionScores)
  const scorePressure = clampScore(meanCriterion * 0.6 + medianCriterion * 0.4)
  const supportPressure = smoothstep(0.3, 0.85, answerSupport)
  const offTopicRisk = 1 - smoothstep(0.08, 0.28, topicAlignment)
  const pressure = Math.max(scorePressure, supportPressure)
  const penalty = clampScore(offTopicRisk * pressure)

  return clampScore(1 - 0.92 * penalty)
}

export function computeTaskStructureGate(structuralScore: number, answerSupport: number, criterionScores: number[]) {
  if (criterionScores.length === 0) {
    return 1
  }

  const meanCriterion = mean(criterionScores)
  const softness = clampScore((answerSupport * 0.45 + meanCriterion * 0.55 - 0.3) / 0.5)
  const structuralPenalty = clampScore(1 - structuralScore)
  return clampScore(1 - 0.12 * structuralPenalty * softness)
}

export function computeUncertaintyShrinkage(promptScores: number[], evidenceScores: number[]) {
  const promptSpread = spread(promptScores)
  const evidenceSpread = spread(evidenceScores)
  const evidenceStdev = standardDeviation(evidenceScores)
  const disagreement = clampScore(promptSpread * 0.45 + evidenceSpread * 0.35 + (evidenceStdev / 0.3) * 0.2)

  return clampScore(0.78 + 0.22 * (1 - disagreement))
}

export function mean(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function median(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  const sortedValues = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sortedValues.length / 2)

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middle - 1] + sortedValues[middle]) / 2
  }

  return sortedValues[middle] ?? 0
}

export function standardDeviation(values: number[]) {
  if (values.length <= 1) {
    return 0
  }

  const average = mean(values)
  const variance = mean(values.map((value) => (value - average) ** 2))
  return Math.sqrt(variance)
}

export function spread(values: number[]) {
  if (values.length <= 1) {
    return 0
  }

  return Math.max(...values) - Math.min(...values)
}

export function clampScore(score: number) {
  if (!Number.isFinite(score)) {
    return 0
  }

  return Math.min(1, Math.max(0, score))
}

export function countResponseSegments(response: string) {
  return splitIntoSegments(response).length
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

function looksVerbPhrase(firstWord: string, restLength: number) {
  if (!firstWord) {
    return false
  }

  if (VERB_STARTERS.has(firstWord)) {
    return true
  }

  return restLength > 0 && /(?:ies|es|s)$/.test(firstWord) && !/ss$/.test(firstWord)
}

function negateResponseSentence(sentence: string) {
  const normalizedSentence = ensureSentence(sentence)
  const match = normalizedSentence.match(/^The response\s+(.+?)[.?!]$/i)

  if (!match) {
    return `It is false that ${lowerFirst(normalizedSentence)}`
  }

  const predicate = match[1].trim()
  return `The response ${negatePredicate(predicate)}.`
}

function negatePredicate(predicate: string) {
  const [firstWord = '', ...restWords] = predicate.split(/\s+/)
  const remainder = restWords.join(' ')

  if (LINKING_VERBS.has(firstWord)) {
    return `is not ${remainder}`.trim()
  }

  if (firstWord === 'has' || firstWord === 'have') {
    return `does not have${remainder ? ` ${remainder}` : ''}`
  }

  return `does not ${toBaseVerb(firstWord)}${remainder ? ` ${remainder}` : ''}`
}

function toBaseVerb(word: string) {
  if (word.endsWith('ies') && word.length > 3) {
    return `${word.slice(0, -3)}y`
  }

  if (/(sses|shes|ches|xes|zes|oes)$/.test(word)) {
    return word.slice(0, -2)
  }

  if (word.endsWith('ses') && word.length > 3) {
    return word.slice(0, -1)
  }

  if (word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1)
  }

  return word
}

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

function ensureSentence(text: string) {
  return /[.?!]$/.test(text) ? text : `${text}.`
}

function countWordTokens(text: string) {
  return (text.match(/[A-Za-z0-9']+/g) ?? []).length
}

function computeNovelContentRatio(question: string, response: string) {
  const responseTokens = contentTokens(response)

  if (responseTokens.length === 0) {
    return 0
  }

  const responseTokenSet = new Set(responseTokens)
  const questionTokenSet = new Set(contentTokens(question))
  let novelCount = 0

  for (const token of responseTokenSet) {
    if (!questionTokenSet.has(token)) {
      novelCount += 1
    }
  }

  return novelCount / responseTokenSet.size
}

function extractTopicTokens(text: string) {
  const rawTokens = text.toLowerCase().match(/[a-z0-9']+/g) ?? []
  const seen = new Set<string>()
  const topicTokens: string[] = []

  for (const token of rawTokens) {
    if (token.length <= 2 || TOPIC_STOP_WORDS.has(token)) {
      continue
    }

    const stemmed = stemTopicToken(token)
    if (stemmed.length <= 2 || TOPIC_STOP_WORDS.has(stemmed) || seen.has(stemmed)) {
      continue
    }

    seen.add(stemmed)
    topicTokens.push(stemmed)
  }

  return topicTokens
}

function smoothstep(min: number, max: number, value: number) {
  if (max <= min) {
    return value >= max ? 1 : 0
  }

  const t = clampScore((value - min) / (max - min))
  return t * t * (3 - 2 * t)
}


function clampProbability(value: number) {
  if (!Number.isFinite(value)) {
    return PROBABILITY_EPSILON
  }

  return Math.min(1 - PROBABILITY_EPSILON, Math.max(PROBABILITY_EPSILON, value))
}

function sigmoid(value: number) {
  if (value >= 0) {
    const exponent = Math.exp(-value)
    return 1 / (1 + exponent)
  }

  const exponent = Math.exp(value)
  return exponent / (1 + exponent)
}

function logit(value: number) {
  return Math.log(value / (1 - value))
}

function createPrefixedHypothesisEnsemble(basePair: HypothesisPair): HypothesisPair[] {
  return ['', 'Overall, ', 'In context, '].map((prefix) => ({
    positive: prefixSentence(prefix, basePair.positive),
    negative: prefixSentence(prefix, basePair.negative),
  }))
}

function prefixSentence(prefix: string, sentence: string) {
  if (!prefix) {
    return sentence
  }

  return `${prefix}${lowerFirst(sentence)}`
}

function contentTokens(text: string) {
  return (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter(
    (token) => token.length > 2 && !CONTENT_STOP_WORDS.has(token),
  )
}

function stemTopicToken(token: string) {
  if (token.endsWith('ies') && token.length > 4) {
    return `${token.slice(0, -3)}y`
  }

  if (token.endsWith('ing') && token.length > 5) {
    return token.slice(0, -3)
  }

  if (token.endsWith('ed') && token.length > 4) {
    return token.slice(0, -2)
  }

  if (token.endsWith('ment') && token.length > 6) {
    return token.slice(0, -4)
  }

  if (token.endsWith('tion') && token.length > 6) {
    return token.slice(0, -4)
  }

  if (token.endsWith('s') && token.length > 4 && !token.endsWith('ss')) {
    return token.slice(0, -1)
  }

  return token
}
