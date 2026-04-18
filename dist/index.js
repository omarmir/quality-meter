// library/src/scoring.ts
var MODEL_TOKEN_LIMIT = 512;
var ESTIMATED_CHARS_PER_TOKEN = 4;
var HYPOTHESIS_TEMPLATE = "{}";
var TOKEN_BUFFER = 12;
var MIN_SAFE_PREMISE_TOKENS = 128;
var PROBABILITY_EPSILON = 1e-6;
var CONTENT_STOP_WORDS = /* @__PURE__ */ new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "because",
  "but",
  "by",
  "do",
  "for",
  "from",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "my",
  "of",
  "on",
  "or",
  "so",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "to",
  "use",
  "using",
  "what",
  "when",
  "which",
  "while",
  "with",
  "without",
  "would",
  "you",
  "your"
]);
var TOPIC_STOP_WORDS = /* @__PURE__ */ new Set([
  ...CONTENT_STOP_WORDS,
  "about",
  "activity",
  "activities",
  "approach",
  "clear",
  "concrete",
  "deliver",
  "deliverables",
  "delivered",
  "delivery",
  "describe",
  "description",
  "detail",
  "details",
  "directly",
  "enough",
  "expected",
  "explain",
  "explains",
  "for",
  "general",
  "helpful",
  "implementation",
  "include",
  "includes",
  "method",
  "methods",
  "name",
  "named",
  "names",
  "outcome",
  "outcomes",
  "overview",
  "planned",
  "plan",
  "program",
  "purpose",
  "question",
  "recipient",
  "response",
  "result",
  "results",
  "say",
  "says",
  "specific",
  "state",
  "stated",
  "states",
  "support",
  "summary",
  "target",
  "targets",
  "through",
  "useful",
  "work"
]);
var LINKING_VERBS = /* @__PURE__ */ new Set(["is", "are", "was", "were"]);
var VERB_STARTERS = /* @__PURE__ */ new Set([
  "answer",
  "answers",
  "address",
  "addresses",
  "provide",
  "provides",
  "use",
  "uses",
  "include",
  "includes",
  "explain",
  "explains",
  "give",
  "gives",
  "mention",
  "mentions",
  "cite",
  "cites",
  "compare",
  "compares",
  "describe",
  "describes",
  "identify",
  "identifies",
  "show",
  "shows",
  "state",
  "states",
  "offer",
  "offers",
  "suggest",
  "suggests",
  "cover",
  "covers",
  "discuss",
  "discusses",
  "note",
  "notes",
  "contain",
  "contains",
  "support",
  "supports",
  "justify",
  "justifies",
  "clarify",
  "clarifies",
  "follow",
  "follows",
  "reference",
  "references",
  "acknowledge",
  "acknowledges",
  "summarize",
  "summarizes",
  "connect",
  "connects",
  "focus",
  "focuses",
  "recommend",
  "recommends",
  "outline",
  "outlines",
  "has",
  "have"
]);
function buildEvaluationText(question, response) {
  const trimmedQuestion = question.trim();
  const trimmedResponse = response.trim();
  if (!trimmedQuestion) {
    return trimmedResponse;
  }
  return `Question:
${trimmedQuestion}

Response:
${trimmedResponse}`;
}
function parseEvaluationText(inputText) {
  const marker = "\n\nResponse:\n";
  if (inputText.startsWith("Question:\n") && inputText.includes(marker)) {
    const [questionBlock, responseBlock] = inputText.split(marker);
    return {
      question: questionBlock.replace(/^Question:\n/, "").trim(),
      response: responseBlock.trim()
    };
  }
  return {
    question: "",
    response: inputText.trim()
  };
}
function createAnswerValidityHypothesisEnsemble(question) {
  if (!question.trim()) {
    return createPrefixedHypothesisEnsemble({
      positive: "The response is coherent and useful.",
      negative: "The response is not coherent or useful."
    });
  }
  return createPrefixedHypothesisEnsemble({
    positive: "The response answers the question well.",
    negative: "The response does not answer the question well."
  });
}
function createConstraintPresenceHypothesisEnsemble() {
  return [
    {
      positive: "The question includes clear constraints, limits, or requirements that the response should follow.",
      negative: "The question does not include important constraints, limits, or requirements beyond the main request."
    },
    {
      positive: "The question sets boundaries or conditions that a good response should respect.",
      negative: "The question is mostly open-ended and does not set meaningful boundaries or conditions."
    }
  ];
}
function createConstraintRespectHypothesisEnsemble() {
  return [
    ...createPrefixedHypothesisEnsemble({
      positive: "The response stays within the limits and restrictions stated in the question.",
      negative: "The response recommends going outside the limits or restrictions stated in the question."
    }),
    ...createPrefixedHypothesisEnsemble({
      positive: "The response follows the user boundaries in the question instead of bypassing them.",
      negative: "The response bypasses or overrides the user boundaries in the question."
    })
  ];
}
function normalizeCriterionText(criterion) {
  return criterion.trim().replace(/[.?!]+$/g, "");
}
function createCriterionHypothesis(criterion) {
  return createCriterionHypotheses(criterion).positive;
}
function createCriterionHypothesisEnsemble(criterion) {
  return createPrefixedHypothesisEnsemble(createCriterionHypotheses(criterion));
}
function createCriterionHypotheses(criterion) {
  const normalizedCriterion = normalizeCriterionText(criterion);
  if (!normalizedCriterion) {
    return {
      positive: "The response satisfies the criterion.",
      negative: "The response does not satisfy the criterion."
    };
  }
  if (/^the response\b/i.test(normalizedCriterion)) {
    const positive = ensureSentence(normalizedCriterion);
    return {
      positive,
      negative: negateResponseSentence(positive)
    };
  }
  const loweredCriterion = lowerFirst(normalizedCriterion);
  const [firstWord = "", ...restWords] = loweredCriterion.split(/\s+/);
  const remainder = restWords.join(" ");
  if (LINKING_VERBS.has(firstWord)) {
    const predicate = remainder || "relevant";
    return {
      positive: `The response ${firstWord} ${predicate}.`,
      negative: `The response is not ${predicate}.`
    };
  }
  if (looksVerbPhrase(firstWord, restWords.length)) {
    return {
      positive: `The response ${loweredCriterion}.`,
      negative: `The response does not ${toBaseVerb(firstWord)}${remainder ? ` ${remainder}` : ""}.`
    };
  }
  return {
    positive: `The response is ${loweredCriterion}.`,
    negative: `The response is not ${loweredCriterion}.`
  };
}
function estimateTokenCount(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }
  return Math.ceil(trimmed.length / ESTIMATED_CHARS_PER_TOKEN);
}
function getSafePremiseTokenBudget(criteria) {
  const longestHypothesisTokens = Math.max(
    ...criteria.filter(Boolean).flatMap(
      (criterion) => createCriterionHypothesisEnsemble(criterion).flatMap(({ positive, negative }) => [
        estimateTokenCount(positive),
        estimateTokenCount(negative)
      ])
    ),
    estimateTokenCount(createCriterionHypothesis("criterion"))
  );
  return Math.max(MIN_SAFE_PREMISE_TOKENS, MODEL_TOKEN_LIMIT - longestHypothesisTokens - TOKEN_BUFFER);
}
function splitResponseIntoEvidenceChunks(response) {
  const segments = splitIntoSegments(response);
  if (segments.length <= 1) {
    return [];
  }
  const chunks = [];
  const seen = /* @__PURE__ */ new Set();
  const addChunk = (value) => {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    chunks.push(normalized);
  };
  for (let index = 0; index < segments.length - 1; index += 1) {
    addChunk(`${segments[index]} ${segments[index + 1]}`);
  }
  addChunk(segments[0] ?? "");
  addChunk(segments[segments.length - 1] ?? "");
  if (segments.length > 2) {
    addChunk(segments[Math.floor((segments.length - 1) / 2)] ?? "");
  }
  return chunks.slice(0, 8);
}
function pairSupportScore(positiveScore, negativeScore) {
  const positiveLogit = logit(clampProbability(positiveScore));
  const negativeLogit = logit(clampProbability(negativeScore));
  return clampScore(2 * sigmoid(positiveLogit - negativeLogit) - 1);
}
function aggregateChunkSupport(chunkScores, fallbackScore) {
  if (chunkScores.length === 0) {
    return fallbackScore;
  }
  const rankedScores = [...chunkScores].sort((left, right) => right - left);
  const topChunkScores = rankedScores.slice(0, Math.min(2, rankedScores.length));
  return mean(topChunkScores);
}
function aggregatePromptScores(promptScores) {
  if (promptScores.length === 0) {
    return 0;
  }
  return median(promptScores);
}
function computeAnswerValidityGate(answerSupport, response) {
  const wordGate = smoothstep(4, 28, countWordTokens(response));
  const segmentGate = smoothstep(0.5, 3, countResponseSegments(response));
  let surfaceGate = Math.cbrt(wordGate * segmentGate);
  if (response.trim().endsWith("?")) {
    surfaceGate *= 0.35;
  }
  const supportGate = smoothstep(0.05, 0.7, answerSupport);
  return clampScore(Math.sqrt(surfaceGate * supportGate));
}
function computeConstraintGate(constraintPresence, constraintRespect) {
  const presenceWeight = smoothstep(0.2, 0.7, constraintPresence);
  const effectiveConstraintScore = 1 - presenceWeight * (1 - constraintRespect);
  return clampScore(0.92 + 0.08 * effectiveConstraintScore);
}
function computeWeakAnswerGate(question, response, answerSupport, criterionScores) {
  if (criterionScores.length === 0) {
    return 1;
  }
  const meanCriterion = mean(criterionScores);
  const medianCriterion = median(criterionScores);
  const weakestCriterion = Math.min(...criterionScores);
  const surfaceStrength = Math.sqrt(
    smoothstep(8, 30, countWordTokens(response)) * smoothstep(0.8, 2.6, countResponseSegments(response))
  );
  const noveltyStrength = smoothstep(0.12, 0.45, computeNovelContentRatio(question, response));
  const supportExcess = clampScore(answerSupport - meanCriterion);
  const weakCoverage = 1 - smoothstep(0.2, 0.55, weakestCriterion);
  const middlingCoverage = 1 - smoothstep(0.35, 0.72, medianCriterion);
  const genericity = clampScore(supportExcess * 0.5 + weakCoverage * 0.2 + middlingCoverage * 0.3);
  const penalty = clampScore(genericity * 0.5 + (1 - noveltyStrength) * 0.35 + (1 - surfaceStrength) * 0.15);
  return clampScore(1 - 0.3 * penalty);
}
function computeTopicAlignment(question, response, criteria = []) {
  const promptTopicTokens = extractTopicTokens([question, ...criteria].join(" "));
  if (promptTopicTokens.length < 2) {
    return 1;
  }
  const responseTopicTokens = new Set(extractTopicTokens(response));
  if (responseTopicTokens.size === 0) {
    return 0;
  }
  const matchedTopicTokens = promptTopicTokens.filter((token) => responseTopicTokens.has(token));
  const denominator = Math.max(2, Math.min(4, promptTopicTokens.length));
  return clampScore(matchedTopicTokens.length / denominator);
}
function computeTopicAlignmentGate(topicAlignment, answerSupport, criterionScores) {
  if (criterionScores.length === 0) {
    return 1;
  }
  const meanCriterion = mean(criterionScores);
  const medianCriterion = median(criterionScores);
  const scorePressure = clampScore(meanCriterion * 0.6 + medianCriterion * 0.4);
  const supportPressure = smoothstep(0.3, 0.85, answerSupport);
  const offTopicRisk = 1 - smoothstep(0.08, 0.28, topicAlignment);
  const pressure = Math.max(scorePressure, supportPressure);
  const penalty = clampScore(offTopicRisk * pressure);
  return clampScore(1 - 0.92 * penalty);
}
function computeTaskStructureGate(structuralScore, answerSupport, criterionScores) {
  if (criterionScores.length === 0) {
    return 1;
  }
  const meanCriterion = mean(criterionScores);
  const softness = clampScore((answerSupport * 0.45 + meanCriterion * 0.55 - 0.3) / 0.5);
  const structuralPenalty = clampScore(1 - structuralScore);
  return clampScore(1 - 0.12 * structuralPenalty * softness);
}
function computeUncertaintyShrinkage(promptScores, evidenceScores) {
  const promptSpread = spread(promptScores);
  const evidenceSpread = spread(evidenceScores);
  const evidenceStdev = standardDeviation(evidenceScores);
  const disagreement = clampScore(promptSpread * 0.45 + evidenceSpread * 0.35 + evidenceStdev / 0.3 * 0.2);
  return clampScore(0.78 + 0.22 * (1 - disagreement));
}
function mean(values) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function median(values) {
  if (values.length === 0) {
    return 0;
  }
  const sortedValues = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sortedValues.length / 2);
  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
  }
  return sortedValues[middle] ?? 0;
}
function standardDeviation(values) {
  if (values.length <= 1) {
    return 0;
  }
  const average = mean(values);
  const variance = mean(values.map((value) => (value - average) ** 2));
  return Math.sqrt(variance);
}
function spread(values) {
  if (values.length <= 1) {
    return 0;
  }
  return Math.max(...values) - Math.min(...values);
}
function clampScore(score) {
  if (!Number.isFinite(score)) {
    return 0;
  }
  return Math.min(1, Math.max(0, score));
}
function countResponseSegments(response) {
  return splitIntoSegments(response).length;
}
function splitIntoSegments(text) {
  const normalizedText = text.replace(/\r\n/g, "\n").trim();
  if (!normalizedText) {
    return [];
  }
  const sentenceSegments = normalizedText.split(/(?<=[.?!])\s+|\n+/).map((segment) => segment.trim()).filter(Boolean);
  if (sentenceSegments.length > 1) {
    return sentenceSegments;
  }
  return normalizedText.split(/[;•·]+|\s+-\s+/).map((segment) => segment.trim()).filter(Boolean);
}
function looksVerbPhrase(firstWord, restLength) {
  if (!firstWord) {
    return false;
  }
  if (VERB_STARTERS.has(firstWord)) {
    return true;
  }
  return restLength > 0 && /(?:ies|es|s)$/.test(firstWord) && !/ss$/.test(firstWord);
}
function negateResponseSentence(sentence) {
  const normalizedSentence = ensureSentence(sentence);
  const match = normalizedSentence.match(/^The response\s+(.+?)[.?!]$/i);
  if (!match) {
    return `It is false that ${lowerFirst(normalizedSentence)}`;
  }
  const predicate = match[1].trim();
  return `The response ${negatePredicate(predicate)}.`;
}
function negatePredicate(predicate) {
  const [firstWord = "", ...restWords] = predicate.split(/\s+/);
  const remainder = restWords.join(" ");
  if (LINKING_VERBS.has(firstWord)) {
    return `is not ${remainder}`.trim();
  }
  if (firstWord === "has" || firstWord === "have") {
    return `does not have${remainder ? ` ${remainder}` : ""}`;
  }
  return `does not ${toBaseVerb(firstWord)}${remainder ? ` ${remainder}` : ""}`;
}
function toBaseVerb(word) {
  if (word.endsWith("ies") && word.length > 3) {
    return `${word.slice(0, -3)}y`;
  }
  if (/(sses|shes|ches|xes|zes|oes)$/.test(word)) {
    return word.slice(0, -2);
  }
  if (word.endsWith("ses") && word.length > 3) {
    return word.slice(0, -1);
  }
  if (word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}
function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
function ensureSentence(text) {
  return /[.?!]$/.test(text) ? text : `${text}.`;
}
function countWordTokens(text) {
  return (text.match(/[A-Za-z0-9']+/g) ?? []).length;
}
function computeNovelContentRatio(question, response) {
  const responseTokens = contentTokens(response);
  if (responseTokens.length === 0) {
    return 0;
  }
  const responseTokenSet = new Set(responseTokens);
  const questionTokenSet = new Set(contentTokens(question));
  let novelCount = 0;
  for (const token of responseTokenSet) {
    if (!questionTokenSet.has(token)) {
      novelCount += 1;
    }
  }
  return novelCount / responseTokenSet.size;
}
function extractTopicTokens(text) {
  const rawTokens = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const seen = /* @__PURE__ */ new Set();
  const topicTokens = [];
  for (const token of rawTokens) {
    if (token.length <= 2 || TOPIC_STOP_WORDS.has(token)) {
      continue;
    }
    const stemmed = stemTopicToken(token);
    if (stemmed.length <= 2 || TOPIC_STOP_WORDS.has(stemmed) || seen.has(stemmed)) {
      continue;
    }
    seen.add(stemmed);
    topicTokens.push(stemmed);
  }
  return topicTokens;
}
function smoothstep(min, max, value) {
  if (max <= min) {
    return value >= max ? 1 : 0;
  }
  const t = clampScore((value - min) / (max - min));
  return t * t * (3 - 2 * t);
}
function clampProbability(value) {
  if (!Number.isFinite(value)) {
    return PROBABILITY_EPSILON;
  }
  return Math.min(1 - PROBABILITY_EPSILON, Math.max(PROBABILITY_EPSILON, value));
}
function sigmoid(value) {
  if (value >= 0) {
    const exponent2 = Math.exp(-value);
    return 1 / (1 + exponent2);
  }
  const exponent = Math.exp(value);
  return exponent / (1 + exponent);
}
function logit(value) {
  return Math.log(value / (1 - value));
}
function createPrefixedHypothesisEnsemble(basePair) {
  return ["", "Overall, ", "In context, "].map((prefix) => ({
    positive: prefixSentence(prefix, basePair.positive),
    negative: prefixSentence(prefix, basePair.negative)
  }));
}
function prefixSentence(prefix, sentence) {
  if (!prefix) {
    return sentence;
  }
  return `${prefix}${lowerFirst(sentence)}`;
}
function contentTokens(text) {
  return (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter(
    (token) => token.length > 2 && !CONTENT_STOP_WORDS.has(token)
  );
}
function stemTopicToken(token) {
  if (token.endsWith("ies") && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }
  if (token.endsWith("ing") && token.length > 5) {
    return token.slice(0, -3);
  }
  if (token.endsWith("ed") && token.length > 4) {
    return token.slice(0, -2);
  }
  if (token.endsWith("ment") && token.length > 6) {
    return token.slice(0, -4);
  }
  if (token.endsWith("tion") && token.length > 6) {
    return token.slice(0, -4);
  }
  if (token.endsWith("s") && token.length > 4 && !token.endsWith("ss")) {
    return token.slice(0, -1);
  }
  return token;
}

// library/src/calibration-core.ts
var CALIBRATION_FLOOR = 0.2;
var MAX_CALIBRATION_BLEND = 0.5;
function fitIsotonicCalibration(points) {
  const sortedPoints = points.filter((point) => Number.isFinite(point.raw) && Number.isFinite(point.target)).map((point) => ({
    raw: clampScore(point.raw),
    target: clampScore(point.target),
    weight: point.weight && Number.isFinite(point.weight) ? Math.max(1e-4, point.weight) : 1
  })).sort((left, right) => left.raw - right.raw);
  if (sortedPoints.length === 0) {
    return null;
  }
  const blocks = sortedPoints.map((point) => ({
    minRaw: point.raw,
    maxRaw: point.raw,
    weightedTargetSum: point.target * point.weight,
    totalWeight: point.weight
  }));
  for (let index = 0; index < blocks.length - 1; ) {
    const currentAverage = blocks[index].weightedTargetSum / blocks[index].totalWeight;
    const nextAverage = blocks[index + 1].weightedTargetSum / blocks[index + 1].totalWeight;
    if (currentAverage <= nextAverage) {
      index += 1;
      continue;
    }
    blocks[index] = {
      minRaw: blocks[index].minRaw,
      maxRaw: blocks[index + 1].maxRaw,
      weightedTargetSum: blocks[index].weightedTargetSum + blocks[index + 1].weightedTargetSum,
      totalWeight: blocks[index].totalWeight + blocks[index + 1].totalWeight
    };
    blocks.splice(index + 1, 1);
    if (index > 0) {
      index -= 1;
    }
  }
  const knots = [];
  for (const block of blocks) {
    const fittedValue = clampScore(block.weightedTargetSum / block.totalWeight);
    knots.push({ x: block.minRaw, y: fittedValue });
    if (block.maxRaw > block.minRaw) {
      knots.push({ x: block.maxRaw, y: fittedValue });
    }
  }
  const dedupedKnots = dedupeKnots(knots);
  return {
    xs: dedupedKnots.map((knot) => knot.x),
    ys: dedupedKnots.map((knot) => knot.y)
  };
}
function applyCalibrationCurve(score, curve) {
  const clampedScore = clampScore(score);
  if (clampedScore <= CALIBRATION_FLOOR) {
    return clampedScore;
  }
  if (curve.xs.length === 0 || curve.ys.length === 0 || curve.xs.length !== curve.ys.length) {
    return clampedScore;
  }
  if (curve.xs.length === 1) {
    return blendScore(clampedScore, curve.ys[0] ?? clampedScore);
  }
  if (clampedScore <= curve.xs[0]) {
    return blendScore(clampedScore, curve.ys[0] ?? clampedScore);
  }
  for (let index = 1; index < curve.xs.length; index += 1) {
    const leftX = curve.xs[index - 1] ?? 0;
    const rightX = curve.xs[index] ?? 1;
    const rightY = curve.ys[index] ?? clampedScore;
    const leftY = curve.ys[index - 1] ?? rightY;
    if (clampedScore <= rightX) {
      if (rightX <= leftX) {
        return blendScore(clampedScore, rightY);
      }
      const ratio = (clampedScore - leftX) / (rightX - leftX);
      return blendScore(clampedScore, leftY + ratio * (rightY - leftY));
    }
  }
  return blendScore(clampedScore, curve.ys[curve.ys.length - 1] ?? clampedScore);
}
function dedupeKnots(knots) {
  const deduped = [];
  for (const knot of knots) {
    const previous = deduped[deduped.length - 1];
    if (!previous || previous.x !== knot.x) {
      deduped.push(knot);
      continue;
    }
    previous.y = clampScore((previous.y + knot.y) / 2);
  }
  return deduped;
}
function blendScore(rawScore, calibratedScore) {
  const blend = smoothstep2(CALIBRATION_FLOOR, 0.9, rawScore) * MAX_CALIBRATION_BLEND;
  return clampScore(rawScore * (1 - blend) + clampScore(calibratedScore) * blend);
}
function smoothstep2(min, max, value) {
  if (max <= min) {
    return value >= max ? 1 : 0;
  }
  const t = clampScore((value - min) / (max - min));
  return t * t * (3 - 2 * t);
}

// library/src/criteria.ts
var DEFAULT_CRITERION_WEIGHT = 1;
function resolveQualityCriteria(criteria) {
  return criteria.map((criterion) => {
    if (typeof criterion === "string") {
      return {
        label: criterion.trim(),
        weight: DEFAULT_CRITERION_WEIGHT
      };
    }
    return {
      label: criterion.label.trim(),
      weight: resolveCriterionWeight(criterion.weight)
    };
  });
}
function computeWeightedCriterionAverage(criteria, scores) {
  if (criteria.length === 0) {
    return 0;
  }
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  if (totalWeight <= 0) {
    return scores.reduce((sum, score) => sum + (score ?? 0), 0) / criteria.length;
  }
  return criteria.reduce((sum, criterion, index) => sum + criterion.weight * (scores[index] ?? 0), 0) / totalWeight;
}
function resolveCriterionWeight(weight) {
  if (typeof weight !== "number" || !Number.isFinite(weight) || weight <= 0) {
    return DEFAULT_CRITERION_WEIGHT;
  }
  return weight;
}

// library/src/generated-calibration.ts
var DEFAULT_CRITERION_CALIBRATION = {
  xs: [0, 64e-4, 6426e-6, 6568e-6, 6606e-6, 7173e-6, 7516e-6, 7573e-6, 794e-5, 8302e-6, 8432e-6, 8597e-6, 9658e-6, 0.010563, 0.013264, 0.014096, 0.016332, 0.016554, 0.017744, 0.019573, 0.02, 0.020082, 0.020206, 0.020526, 0.020645, 0.022414, 0.02328, 0.023486, 0.023666, 0.024813, 0.025417, 0.0256, 0.025945, 0.026273, 0.026349, 0.026867, 0.029629, 0.030183, 0.032434, 0.033882, 0.035136, 0.035151, 0.035289, 0.035291, 0.035376, 0.037939, 0.041449, 0.04405, 0.045413, 0.046555, 0.049964, 0.05, 0.07943, 0.08, 0.236383, 0.25, 0.35, 0.4, 0.5, 0.744146, 0.75, 0.871372, 0.874573, 0.899056, 0.9, 0.924277, 0.928143, 0.947426, 0.949579, 0.949673, 0.950041, 0.950333, 0.950512, 0.950641, 0.958797, 0.959055, 0.959299, 0.959476, 0.984621, 0.984638, 0.985531, 0.985532, 0.990271, 0.990406, 0.9993, 0.999426, 0.999504, 1],
  ys: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6585e-6, 6585e-6, 0.074366, 0.074366, 0.125405, 0.182948, 0.479797, 0.489949, 0.65, 0.66, 0.67, 0.685714, 0.685714, 0.698182, 0.698182, 0.816667, 0.816667, 0.845, 0.845, 0.9, 0.9, 0.9, 0.900952, 0.900952, 0.903333, 0.903333, 0.919663, 0.919663, 0.921, 0.921, 0.933537, 0.933537, 0.934136, 0.934136, 0.946667, 0.946667, 1]
};
var DEFAULT_OVERALL_CALIBRATION = {
  xs: [0, 4762e-6, 48e-4, 4889e-6, 9122e-6, 9435e-6, 9438e-6, 9516e-6, 9551e-6, 9602e-6, 9635e-6, 9773e-6, 9775e-6, 9786e-6, 9791e-6, 9808e-6, 9813e-6, 9813e-6, 9815e-6, 9815e-6, 9816e-6, 9817e-6, 9821e-6, 9822e-6, 9822e-6, 9827e-6, 9828e-6, 9828e-6, 9829e-6, 983e-5, 9859e-6, 9862e-6, 9864e-6, 9875e-6, 9891e-6, 9898e-6, 0.010721, 0.011382, 0.011582, 0.012417, 0.012805, 0.012995, 0.013045, 0.013046, 0.013052, 0.013084, 0.013096, 0.013097, 0.013173, 0.013249, 0.014929, 0.021415, 0.021638, 0.023715, 0.025217, 0.025884, 0.027589, 0.030137, 0.030925, 0.030938, 0.03139, 0.033488, 0.039284, 0.047995, 0.053345, 0.055371, 0.059673, 0.072498, 0.073874, 0.077667, 0.087984, 0.089489, 0.095358, 0.1, 0.120519, 0.179151, 0.25, 0.258236, 0.267918, 0.268875, 0.269174, 0.269955, 0.270112, 0.28496, 0.285373, 0.285931, 0.286641, 0.287059, 0.288916, 0.290238, 0.292023, 0.298973, 0.303975, 0.309335, 0.311949, 0.312092, 0.313665, 0.316595, 0.31681, 0.326508, 0.326616, 0.327595, 0.328583, 0.329091, 0.33081, 0.345178, 0.346865, 0.352028, 0.353718, 0.355094, 0.356449, 0.358232, 0.359852, 0.363298, 0.371844, 0.372518, 0.375512, 0.376746, 0.379753, 0.389561, 0.390463, 0.399754, 0.405717, 0.414053, 0.417211, 0.428249, 0.428387, 0.431262, 0.440809, 0.44317, 0.443184, 0.444837, 0.44502, 0.463377, 0.464453, 0.492414, 0.5, 0.537057, 0.558059, 0.560506, 0.563071, 0.564645, 0.568526, 0.646983, 0.647665, 0.672586, 0.679464, 0.679902, 0.732638, 0.734673, 0.743695, 0.75, 0.771886, 0.803868, 0.9, 0.906886, 0.932833, 0.933816, 0.971946, 1],
  ys: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.065882, 0.065882, 0.265474, 0.265474, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.316, 0.437333, 0.437333, 0.4616, 0.4616, 0.473143, 0.473143, 0.498, 0.498, 0.498, 0.498, 0.635, 0.635, 0.675, 0.675, 0.676, 0.679, 0.679, 0.683, 0.683, 0.702089, 0.702089, 0.94056, 0.94056, 0.966364, 0.966364, 0.966717, 0.966717, 1]
};

// library/src/low-latency.ts
var CONTENT_STOP_WORDS2 = /* @__PURE__ */ new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "between",
  "by",
  "do",
  "for",
  "from",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "my",
  "of",
  "on",
  "or",
  "should",
  "that",
  "the",
  "this",
  "to",
  "what",
  "which",
  "while",
  "with",
  "without",
  "would",
  "you",
  "your"
]);
var NEGATION_TOKENS = /* @__PURE__ */ new Set(["no", "not", "without", "avoid", "avoids", "avoiding", "don't", "do", "never"]);
var ACTION_VERBS = /* @__PURE__ */ new Set([
  "add",
  "adjust",
  "audit",
  "begin",
  "check",
  "choose",
  "close",
  "compare",
  "create",
  "cut",
  "decide",
  "draft",
  "focus",
  "group",
  "identify",
  "list",
  "lower",
  "measure",
  "move",
  "note",
  "pick",
  "plan",
  "prioritize",
  "reduce",
  "remove",
  "restart",
  "review",
  "schedule",
  "separate",
  "set",
  "sort",
  "split",
  "start",
  "stop",
  "test",
  "track",
  "turn",
  "use",
  "write"
]);
var COMPARISON_CUES = ["choose", "pick", "prefer", "recommend", "better", "best", "go with"];
var TRADEOFF_CUES = ["but", "however", "while", "although", "trade-off", "tradeoff", "on the other hand"];
var SEQUENCE_CUES = ["first", "then", "next", "after", "before", "finally", "start", "begin", "week", "day", "phase", "step"];
var FOLLOW_UP_CUES = ["review", "retest", "revisit", "check", "follow up", "follow-up", "measure", "adjust", "retrospective"];
var MONEY_PATTERN = /\$?\d+(?:\.\d+)?/g;
function detectQualityTaskType(question, criteria = []) {
  const text = `${question} ${criteria.join(" ")}`.toLowerCase();
  if (/\bbetween\b/.test(text) || /\b(?:vs\.?|versus)\b/.test(text) || /\bwhich\b/.test(text) || /\bcompare\b/.test(text) || /\btrade-?off\b/.test(text) || /\boption\b/.test(text)) {
    return "comparison";
  }
  if (/\bplan\b/.test(text) || /\bsequence\b/.test(text) || /\bsprint\b/.test(text) || /\btimeline\b/.test(text) || /\bcheck-?in\b/.test(text) || /\bfollow-?up\b/.test(text)) {
    return "planning";
  }
  if (/\bhow can i\b/.test(text) || /\bwhat should i\b/.test(text) || /\bpractical steps\b/.test(text)) {
    return "advice";
  }
  return "unknown";
}
function normalizeCriteriaForScoring(question, criteria) {
  const taskType = detectQualityTaskType(question, criteria);
  const goalSummary = extractGoalSummary(question, taskType);
  const constraints = extractConstraints(question);
  const constraintSummary = constraints.map((constraint) => constraint.summary).join("; ");
  const prioritySummary = extractPrioritySummary(question);
  const optionSummary = extractOptionSummary(question);
  return {
    taskType,
    goalSummary,
    constraintSummary,
    prioritySummary,
    optionSummary,
    normalizedCriteria: criteria.map(
      (criterion) => normalizeCriterionForScoring(criterion, {
        taskType,
        goalSummary,
        constraintSummary,
        prioritySummary,
        optionSummary
      })
    )
  };
}
function assessDeterministicConstraints(question, response) {
  const extracted = extractConstraints(question);
  if (extracted.length === 0) {
    return {
      extracted,
      presence: 0,
      respect: 1,
      violations: []
    };
  }
  const normalizedResponse = normalizeText(response);
  const responseTokens = contentTokens2(normalizedResponse);
  const violations = extracted.map((constraint) => detectConstraintViolation(constraint, normalizedResponse, responseTokens)).filter((violation) => Boolean(violation));
  const presence = clampScore(0.5 + extracted.length * 0.15);
  if (violations.length === 0) {
    return {
      extracted,
      presence,
      respect: 1,
      violations
    };
  }
  return {
    extracted,
    presence,
    respect: clampScore(1 - Math.min(0.8, violations.length * 0.35)),
    violations
  };
}
function assessTaskStructure(question, response, criteria) {
  const taskType = detectQualityTaskType(question, criteria);
  const normalizedResponse = normalizeText(response);
  const segments = splitIntoSegments2(normalizedResponse);
  const loweredResponse = normalizedResponse.toLowerCase();
  const reasons = [];
  if (taskType === "comparison") {
    const options = extractOptions(question);
    const optionMentions = options.map((option) => containsPhrase(loweredResponse, option.toLowerCase()) ? 1 : 0);
    const recommendation = COMPARISON_CUES.some((cue) => loweredResponse.includes(cue)) ? 1 : 0;
    const tradeoff = TRADEOFF_CUES.some((cue) => loweredResponse.includes(cue)) ? 1 : 0;
    const score = mean([
      options.length === 2 ? mean(optionMentions) : 0.75,
      recommendation,
      tradeoff
    ]);
    if (mean(optionMentions) >= 0.5) {
      reasons.push("mentions the compared options");
    }
    if (recommendation) {
      reasons.push("makes a recommendation");
    }
    if (tradeoff) {
      reasons.push("includes trade-off language");
    }
    return { taskType, score: clampScore(score), reasons };
  }
  if (taskType === "planning") {
    const sequenceCount = SEQUENCE_CUES.filter((cue) => loweredResponse.includes(cue)).length;
    const followUp = FOLLOW_UP_CUES.some((cue) => loweredResponse.includes(cue)) ? 1 : 0;
    const score = mean([
      clampScore((segments.length - 1) / 3),
      clampScore(sequenceCount / 2),
      followUp
    ]);
    if (segments.length >= 2) {
      reasons.push("has multiple steps");
    }
    if (sequenceCount > 0) {
      reasons.push("uses sequence markers");
    }
    if (followUp) {
      reasons.push("includes a review or follow-up cue");
    }
    return { taskType, score: clampScore(score), reasons };
  }
  if (taskType === "advice") {
    const segmentStarts = segments.map((segment) => firstContentToken(segment));
    const actionStarts = segmentStarts.filter((token) => token && ACTION_VERBS.has(token)).length;
    const score = mean([
      clampScore(actionStarts / Math.max(2, segments.length)),
      clampScore((segments.length - 0.5) / 2.5),
      loweredResponse.endsWith("?") ? 0 : 1
    ]);
    if (actionStarts > 0) {
      reasons.push("starts steps with action verbs");
    }
    if (segments.length >= 2) {
      reasons.push("has more than one concrete step");
    }
    return { taskType, score: clampScore(score), reasons };
  }
  return {
    taskType,
    score: 1,
    reasons
  };
}
function normalizeCriterionForScoring(criterion, context) {
  const trimmedCriterion = criterion.trim();
  if (!trimmedCriterion) {
    return criterion;
  }
  if (/answers the question directly/i.test(trimmedCriterion) && context.goalSummary) {
    return `Directly answers the question about ${context.goalSummary}`;
  }
  if (/provides concrete, practical steps/i.test(trimmedCriterion)) {
    return context.taskType === "planning" ? "Gives concrete steps the user can follow in the plan" : "Gives concrete steps the user can take now";
  }
  if (/gives enough detail or rationale to be useful/i.test(trimmedCriterion)) {
    return "Explains why the suggested response should help";
  }
  if (/gives a clear recommendation/i.test(trimmedCriterion)) {
    return context.optionSummary ? `Makes a clear recommendation between ${context.optionSummary}` : "Makes a clear recommendation";
  }
  if (/compares the options on relevant factors/i.test(trimmedCriterion)) {
    return context.prioritySummary ? `Compares the options on ${context.prioritySummary}` : "Compares the options on the key decision factors";
  }
  if (/explains the trade-offs or rationale/i.test(trimmedCriterion)) {
    return context.prioritySummary ? `Explains the trade-offs relative to ${context.prioritySummary}` : "Explains the trade-offs clearly";
  }
  if (/proposes a clear plan/i.test(trimmedCriterion) && context.goalSummary) {
    return `Proposes a clear plan to ${context.goalSummary}`;
  }
  if (/orders the work in a sensible sequence/i.test(trimmedCriterion)) {
    return "Sequences the work in a sensible order";
  }
  if (/includes a useful check-in or follow-up step/i.test(trimmedCriterion)) {
    return "Includes a useful review or follow-up step";
  }
  if (/(respects|fits) the stated (scope or )?constraints/i.test(trimmedCriterion) && context.constraintSummary) {
    return `Fits the stated constraint: ${context.constraintSummary}`;
  }
  return trimmedCriterion;
}
function extractGoalSummary(question, taskType) {
  const normalizedQuestion = question.trim().replace(/[?]+$/g, "");
  if (!normalizedQuestion) {
    return "";
  }
  const withoutSplit = normalizedQuestion.split(/\bwithout\b/i)[0] ?? normalizedQuestion;
  const withSplit = withoutSplit.split(/\bwith\b/i)[0] ?? withoutSplit;
  const forSplit = taskType === "comparison" ? withoutSplit : withSplit;
  const cleaned = forSplit.replace(/^(?:goal:\s*)/i, "").replace(/^(?:how can i|what should i try first if i need to|what should i|what are two quick steps to|what is a practical way to|how should i plan to|what plan would you suggest to|how can i organize a plan to|what is a short plan to|should i choose|which is the better choice,|which should i choose for now,|what would you pick between|i need to decide between)\s*/i, "").replace(/\b(?:should i choose|which option better fits this situation:|what would you pick between)\b/i, "").trim();
  return cleaned.replace(/^(?:to\s+)/i, "").trim();
}
function extractPrioritySummary(question) {
  const normalizedQuestion = question.trim().replace(/[?]+$/g, "");
  const forMatch = normalizedQuestion.match(/\bfor\s+(.+?)(?:\s+(?:with|when|while)\b|$)/i);
  if (forMatch?.[1]) {
    return cleanupSummary(forMatch[1]);
  }
  const moreThanMatch = normalizedQuestion.match(/\b(.+?)\s+more than\s+(.+?)(?:$|[,.?])/i);
  if (moreThanMatch?.[0]) {
    return cleanupSummary(moreThanMatch[0]);
  }
  return "";
}
function extractOptionSummary(question) {
  const options = extractOptions(question);
  return options.length === 2 ? `${options[0]} and ${options[1]}` : "";
}
function extractOptions(question) {
  const betweenMatch = question.match(/\bbetween\s+(.+?)\s+and\s+(.+?)(?:\s+(?:for|with|when|while|in)\b|[?.]|$)/i);
  if (betweenMatch) {
    return [cleanupSummary(betweenMatch[1]), cleanupSummary(betweenMatch[2])].filter(Boolean);
  }
  const chooseMatch = question.match(/\bchoose\s+(.+?)\s+or\s+(.+?)(?:\s+(?:for|with|when|while|in)\b|[?.]|$)/i);
  if (chooseMatch) {
    return [cleanupSummary(chooseMatch[1]), cleanupSummary(chooseMatch[2])].filter(Boolean);
  }
  return [];
}
function extractConstraints(question) {
  const constraints = [];
  const normalizedQuestion = normalizeText(question);
  for (const match of normalizedQuestion.matchAll(/\bwithout\s+([^?.!,;]+)/gi)) {
    const summary = cleanupSummary(match[1] ?? "");
    if (summary) {
      constraints.push({
        category: "avoid",
        summary: `without ${summary}`,
        tokens: contentTokens2(summary)
      });
    }
  }
  for (const match of normalizedQuestion.matchAll(/\b(?:under|below|less than)\s+\$?(\d+(?:\.\d+)?)/gi)) {
    const maxValue = Number(match[1] ?? 0);
    if (Number.isFinite(maxValue) && maxValue > 0) {
      constraints.push({
        category: "budget",
        summary: `under $${maxValue}`,
        tokens: [],
        maxValue,
        unit: "dollars"
      });
    }
  }
  for (const match of normalizedQuestion.matchAll(/\bwith\s+(\d+(?:\.\d+)?)\s+(minutes?|hours?)\s+(?:a|per)\s+day/gi)) {
    const maxValue = Number(match[1] ?? 0);
    const unit = (match[2] ?? "").toLowerCase();
    if (Number.isFinite(maxValue) && maxValue > 0) {
      constraints.push({
        category: "effort",
        summary: `with ${maxValue} ${unit} a day`,
        tokens: [],
        maxValue: convertToMinutes(maxValue, unit),
        unit: "minutes_per_day"
      });
    }
  }
  for (const match of normalizedQuestion.matchAll(/\b(?:in|within)\s+(\d+(?:\.\d+)?)\s+(days?|weeks?|months?|sprints?)/gi)) {
    const maxValue = Number(match[1] ?? 0);
    const unit = (match[2] ?? "").toLowerCase();
    if (Number.isFinite(maxValue) && maxValue > 0) {
      constraints.push({
        category: "timeline",
        summary: `within ${maxValue} ${unit}`,
        tokens: [],
        maxValue: convertToDays(maxValue, unit),
        unit: "days"
      });
    }
  }
  const priorityMatch = normalizedQuestion.match(/\b([a-z][^?.!,;]+?)\s+more than\s+([a-z][^?.!,;]+)/i);
  if (priorityMatch) {
    constraints.push({
      category: "priority",
      summary: cleanupSummary(priorityMatch[0]),
      tokens: contentTokens2(priorityMatch[0])
    });
  }
  return dedupeConstraints(constraints);
}
function detectConstraintViolation(constraint, response, responseTokens) {
  if (constraint.category === "budget" && constraint.maxValue !== void 0) {
    const amounts = Array.from(response.matchAll(MONEY_PATTERN)).map((match) => Number((match[0] ?? "").replace(/[^0-9.]/g, ""))).filter((value) => Number.isFinite(value));
    if (amounts.some((value) => value > constraint.maxValue * 1.15)) {
      return `mentions a cost above ${constraint.summary}`;
    }
    return "";
  }
  if ((constraint.category === "effort" || constraint.category === "timeline") && constraint.maxValue !== void 0) {
    const responseDurations = extractResponseDurations(response, constraint.unit === "days" ? "days" : "minutes_per_day");
    if (responseDurations.some((value) => value > constraint.maxValue * 1.35)) {
      return `mentions a duration beyond ${constraint.summary}`;
    }
    return "";
  }
  if (constraint.category === "avoid") {
    if (constraint.tokens.length === 0) {
      return "";
    }
    const overlap = constraint.tokens.filter((token) => responseTokens.includes(token));
    if (overlap.length >= Math.min(2, constraint.tokens.length)) {
      const negated = overlap.every((token) => isTokenNegated(response, token));
      return negated ? "" : `reuses forbidden constraint language from "${constraint.summary}"`;
    }
  }
  if (constraint.category === "priority" && constraint.tokens.length > 0) {
    const overlap = constraint.tokens.filter((token) => responseTokens.includes(token));
    if (overlap.length === 0) {
      return "does not surface the stated priority";
    }
  }
  return "";
}
function dedupeConstraints(constraints) {
  const seen = /* @__PURE__ */ new Set();
  return constraints.filter((constraint) => {
    const key = `${constraint.category}:${constraint.summary}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function convertToMinutes(value, unit) {
  return unit.startsWith("hour") ? value * 60 : value;
}
function convertToDays(value, unit) {
  if (unit.startsWith("week")) {
    return value * 7;
  }
  if (unit.startsWith("month")) {
    return value * 30;
  }
  if (unit.startsWith("sprint")) {
    return value * 14;
  }
  return value;
}
function extractResponseDurations(response, mode) {
  const matches = Array.from(response.matchAll(/(\d+(?:\.\d+)?)\s+(minutes?|hours?|days?|weeks?|months?)(?:\s+(?:a|per)\s+day)?/gi));
  return matches.map((match) => {
    const value = Number(match[1] ?? 0);
    const unit = (match[2] ?? "").toLowerCase();
    const perDay = /\s(?:a|per)\s+day$/i.test(match[0] ?? "");
    if (!Number.isFinite(value) || value <= 0) {
      return null;
    }
    if (mode === "minutes_per_day") {
      if (unit.startsWith("hour")) {
        return value * 60;
      }
      if (unit.startsWith("minute") && perDay) {
        return value;
      }
      if (unit.startsWith("minute")) {
        return value;
      }
      return null;
    }
    if (unit.startsWith("day")) {
      return value;
    }
    if (unit.startsWith("week")) {
      return value * 7;
    }
    if (unit.startsWith("month")) {
      return value * 30;
    }
    return null;
  }).filter((value) => value !== null);
}
function splitIntoSegments2(text) {
  const normalizedText = text.replace(/\r\n/g, "\n").trim();
  if (!normalizedText) {
    return [];
  }
  const sentenceSegments = normalizedText.split(/(?<=[.?!])\s+|\n+/).map((segment) => segment.trim()).filter(Boolean);
  if (sentenceSegments.length > 1) {
    return sentenceSegments;
  }
  return normalizedText.split(/[;•·]+|\s+-\s+/).map((segment) => segment.trim()).filter(Boolean);
}
function cleanupSummary(text) {
  return text.replace(/[?.!,;:]+$/g, "").trim();
}
function normalizeText(text) {
  return text.replace(/\r\n/g, "\n").trim();
}
function contentTokens2(text) {
  return (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter(
    (token) => token.length > 2 && !CONTENT_STOP_WORDS2.has(token)
  );
}
function firstContentToken(text) {
  return contentTokens2(text)[0] ?? "";
}
function containsPhrase(text, phrase) {
  return Boolean(phrase) && text.includes(phrase);
}
function isTokenNegated(text, token) {
  const normalized = text.toLowerCase();
  const tokenIndex = normalized.indexOf(token.toLowerCase());
  if (tokenIndex === -1) {
    return false;
  }
  const window = normalized.slice(Math.max(0, tokenIndex - 24), tokenIndex);
  return Array.from(NEGATION_TOKENS).some((cue) => window.includes(cue));
}

// library/src/defaults.ts
var DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG = {
  mixedFitMinPercent: 45,
  strongFitMinPercent: 70,
  toneByBand: {
    off_track: "error",
    mixed_fit: "warning",
    strong_fit: "success"
  }
};
var DEFAULT_ADAPTIVE_REFINEMENT_CONFIG = {
  lowStopOverallPercent: 10,
  lowStopAnswerSupport: 0.25,
  lowStopMaxCriterionPercent: 15,
  lowStopSecondaryOverallBuffer: 5,
  lowStopLowCriterionShare: 0.66,
  highStopOverallPercent: 100,
  highStopMinCriterionPercent: 100,
  highStopSpreadPercent: 0,
  highStopWeakAnswerGate: 1,
  disableHighStopForConstraintQuestions: true,
  disableHighStopForTaskTypes: ["comparison", "planning"]
};
var DEFAULT_QUALITY_SCORER_CONFIG = {
  task: "zero-shot-classification",
  modelId: "Xenova/nli-deberta-v3-xsmall",
  dtype: "q8",
  hypothesisTemplate: HYPOTHESIS_TEMPLATE,
  modelSource: {
    mode: "local",
    localModelPath: "/models/",
    remoteHost: "https://huggingface.co/",
    remotePathTemplate: "{model}/resolve/{revision}/",
    revision: "main",
    useBrowserCache: "auto"
  },
  limits: {
    modelTokenLimit: MODEL_TOKEN_LIMIT,
    estimatedCharsPerToken: ESTIMATED_CHARS_PER_TOKEN,
    tokenBuffer: TOKEN_BUFFER,
    minSafePremiseTokens: MIN_SAFE_PREMISE_TOKENS
  },
  lowLatency: {
    useDeterministicConstraintChecks: false,
    useTaskStructureChecks: true,
    useCriterionNormalization: false
  },
  criterionCalibration: DEFAULT_CRITERION_CALIBRATION,
  overallCalibration: DEFAULT_OVERALL_CALIBRATION
};
function resolveQualityScorerConfig(config = {}) {
  return {
    ...DEFAULT_QUALITY_SCORER_CONFIG,
    ...config,
    modelSource: {
      ...DEFAULT_QUALITY_SCORER_CONFIG.modelSource,
      ...config.modelSource
    },
    limits: {
      ...DEFAULT_QUALITY_SCORER_CONFIG.limits,
      ...config.limits
    },
    lowLatency: {
      ...DEFAULT_QUALITY_SCORER_CONFIG.lowLatency,
      ...config.lowLatency
    },
    criterionCalibration: config.criterionCalibration === void 0 ? DEFAULT_QUALITY_SCORER_CONFIG.criterionCalibration : config.criterionCalibration,
    overallCalibration: config.overallCalibration === void 0 ? DEFAULT_QUALITY_SCORER_CONFIG.overallCalibration : config.overallCalibration,
    hypothesisTemplate: config.hypothesisTemplate ?? DEFAULT_QUALITY_SCORER_CONFIG.hypothesisTemplate,
    dtype: config.dtype ?? DEFAULT_QUALITY_SCORER_CONFIG.dtype,
    modelId: config.modelId ?? DEFAULT_QUALITY_SCORER_CONFIG.modelId,
    task: "zero-shot-classification"
  };
}
function estimateQualityContextBudget(input, config = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config);
  const evaluationText = buildEvaluationText(input.question ?? "", input.response);
  const estimatedPremiseTokens = estimateTokenCountWithConfig(evaluationText, resolvedConfig);
  const resolvedCriteria = resolveQualityCriteria(input.criteria);
  const scoringCriteria = resolvedConfig.lowLatency.useCriterionNormalization ? normalizeCriteriaForScoring(
    input.question ?? "",
    resolvedCriteria.map((criterion) => criterion.label)
  ).normalizedCriteria : resolvedCriteria.map((criterion) => criterion.label);
  const safePremiseTokenBudget = getSafePremiseTokenBudgetWithConfig(scoringCriteria, resolvedConfig);
  const safePremiseCharBudget = safePremiseTokenBudget * resolvedConfig.limits.estimatedCharsPerToken;
  return {
    evaluationText,
    estimatedPremiseTokens,
    safePremiseTokenBudget,
    safePremiseCharBudget,
    isNearLimit: estimatedPremiseTokens < safePremiseTokenBudget && estimatedPremiseTokens >= safePremiseTokenBudget * 0.9,
    isOverLimit: estimatedPremiseTokens > safePremiseTokenBudget
  };
}
function calibrateQualityOverall(score, config = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config);
  if (!resolvedConfig.overallCalibration) {
    return score;
  }
  return applyCalibrationCurve(score, resolvedConfig.overallCalibration);
}
function computeCalibratedOverallScore(input, config = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config);
  const overallRaw = clampScore(input.rawOverall);
  const weakAnswerGate = computeWeakAnswerGate(
    input.question ?? "",
    input.response,
    input.answerSupport,
    input.criterionScores
  );
  const taskStructureGate = resolvedConfig.lowLatency.useTaskStructureChecks ? computeTaskStructureGate(input.structuralScore ?? 1, input.answerSupport, input.criterionScores) : 1;
  const topicAlignmentGate = computeTopicAlignmentGate(
    input.topicAlignment ?? 1,
    input.answerSupport,
    input.criterionScores
  );
  const overallAdjustedRaw = clampScore(overallRaw * weakAnswerGate * taskStructureGate * topicAlignmentGate);
  const overallCalibrated = resolvedConfig.overallCalibration ? applyCalibrationCurve(overallAdjustedRaw, resolvedConfig.overallCalibration) : overallAdjustedRaw;
  return {
    overallRaw,
    weakAnswerGate: clampScore(weakAnswerGate * taskStructureGate * topicAlignmentGate),
    overallAdjustedRaw,
    overallCalibrated,
    overallPercent: Math.round(overallCalibrated * 100)
  };
}
function isRemoteModelSource(config = {}) {
  return resolveQualityScorerConfig(config).modelSource.mode !== "local";
}
function getQualityModelSourceLocation(config = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config);
  if (resolvedConfig.modelSource.mode === "local") {
    return `${resolvedConfig.modelSource.localModelPath}${resolvedConfig.modelId}`;
  }
  return [
    resolvedConfig.modelSource.remoteHost,
    resolvedConfig.modelSource.remotePathTemplate.replaceAll("{model}", resolvedConfig.modelId).replaceAll("{revision}", encodeURIComponent(resolvedConfig.modelSource.revision))
  ].join("").replace(/([^:]\/)\/+/g, "$1");
}
function estimateTokenCountWithConfig(text, config = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config);
  return estimateTokenCountWithCharsPerToken(text, resolvedConfig.limits.estimatedCharsPerToken);
}
function getSafePremiseTokenBudgetWithConfig(criteria, config = {}) {
  const resolvedConfig = resolveQualityScorerConfig(config);
  const longestHypothesisTokens = Math.max(
    ...criteria.filter(Boolean).flatMap(
      (criterion) => createCriterionHypothesisEnsemble(criterion).flatMap(({ positive, negative }) => [
        estimateTokenCountWithCharsPerToken(positive, resolvedConfig.limits.estimatedCharsPerToken),
        estimateTokenCountWithCharsPerToken(negative, resolvedConfig.limits.estimatedCharsPerToken)
      ])
    ),
    estimateTokenCountWithCharsPerToken("criterion", resolvedConfig.limits.estimatedCharsPerToken)
  );
  return Math.max(
    resolvedConfig.limits.minSafePremiseTokens,
    resolvedConfig.limits.modelTokenLimit - longestHypothesisTokens - resolvedConfig.limits.tokenBuffer
  );
}
function estimateTokenCountWithCharsPerToken(text, charsPerToken) {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }
  return Math.ceil(trimmed.length / Math.max(1, charsPerToken));
}

// library/src/evaluator.ts
async function scoreCriteriaWithClassifier(classifier, question, response, criteria, options = {}) {
  const trimmedCriteria = criteria.map((criterion) => criterion.trim());
  const scoreMode = options.mode ?? "full";
  const normalization = options.lowLatency?.useCriterionNormalization ? normalizeCriteriaForScoring(question, trimmedCriteria) : {
    taskType: detectQualityTaskType(question, trimmedCriteria),
    goalSummary: "",
    constraintSummary: "",
    prioritySummary: "",
    optionSummary: "",
    normalizedCriteria: trimmedCriteria
  };
  const scoringCriteria = normalization.normalizedCriteria;
  const fullInputText = buildEvaluationText(question, response);
  const chunkTexts = scoreMode === "fast" ? [] : splitResponseIntoEvidenceChunks(response).map((chunk) => buildEvaluationText(question, chunk));
  const criterionHypothesisEnsembles = scoringCriteria.map((criterion) => {
    const ensemble = createCriterionHypothesisEnsemble(criterion);
    return scoreMode === "fast" ? ensemble.slice(0, 1) : ensemble;
  });
  const criterionLabels = dedupeLabels(
    criterionHypothesisEnsembles.flatMap((ensemble) => ensemble.flatMap(({ positive, negative }) => [positive, negative]))
  );
  const answerSupportEnsemble = limitEnsemble(createAnswerValidityHypothesisEnsemble(question), scoreMode);
  const answerSupportLabels = dedupeLabels(
    answerSupportEnsemble.flatMap(({ positive, negative }) => [positive, negative])
  );
  const constraintRespectEnsemble = question.trim() && scoreMode !== "fast" ? limitEnsemble(createConstraintRespectHypothesisEnsemble(), scoreMode) : [];
  const constraintRespectLabels = dedupeLabels(
    constraintRespectEnsemble.flatMap(({ positive, negative }) => [positive, negative])
  );
  const fullEvidenceLabels = dedupeLabels([...criterionLabels, ...answerSupportLabels, ...constraintRespectLabels]);
  const chunkEvidenceLabels = dedupeLabels([...criterionLabels, ...answerSupportLabels]);
  const fullEvidenceMap = await classifyLabelSetAcrossTexts(classifier, [fullInputText], fullEvidenceLabels);
  const chunkEvidenceMaps = chunkTexts.length === 0 ? [] : await classifyLabelSetAcrossTexts(classifier, chunkTexts, chunkEvidenceLabels);
  const criterionEvidenceMaps = [...fullEvidenceMap, ...chunkEvidenceMaps];
  const answerSupport = scoreHypothesisEnsembleFromEvidenceMaps(criterionEvidenceMaps, answerSupportEnsemble);
  let constraintPresence = 0;
  let constraintRespect = 1;
  let deterministicConstraintPresence = 0;
  let deterministicConstraintRespect = 1;
  let structuralScore = 1;
  if (question.trim()) {
    if (scoreMode === "fast") {
      constraintPresence = typeof options.cachedConstraintPresence === "number" ? options.cachedConstraintPresence : 0;
      constraintRespect = 1;
    } else if (typeof options.cachedConstraintPresence === "number") {
      constraintPresence = options.cachedConstraintPresence;
    } else {
      constraintPresence = await scoreHypothesisEnsembleAcrossEvidence(
        classifier,
        [question.trim()],
        limitEnsemble(createConstraintPresenceHypothesisEnsemble(), scoreMode)
      );
    }
    if (constraintRespectEnsemble.length > 0) {
      constraintRespect = scoreHypothesisEnsembleFromEvidenceMaps(fullEvidenceMap, constraintRespectEnsemble);
    }
  }
  if (options.lowLatency?.useDeterministicConstraintChecks && question.trim()) {
    const deterministicConstraints = assessDeterministicConstraints(question, response);
    deterministicConstraintPresence = deterministicConstraints.presence;
    deterministicConstraintRespect = deterministicConstraints.respect;
    constraintPresence = Math.max(constraintPresence, deterministicConstraintPresence);
    if (deterministicConstraintRespect < 0.999) {
      constraintRespect = Math.min(constraintRespect, 0.1 + 0.8 * deterministicConstraintRespect);
    }
  }
  if (options.lowLatency?.useTaskStructureChecks) {
    structuralScore = assessTaskStructure(question, response, scoringCriteria).score;
  }
  const answerGate = computeAnswerValidityGate(answerSupport, response);
  const constraintGate = computeConstraintGate(constraintPresence, constraintRespect);
  const gate = clampScore(answerGate * constraintGate);
  const rawScores = criterionHypothesisEnsembles.map((ensemble) => {
    const promptScores = ensemble.map((pair) => {
      const fullScore = readPairScore(criterionEvidenceMaps[0], pair);
      const chunkScores = criterionEvidenceMaps.slice(1).map((labelMap) => readPairScore(labelMap, pair));
      const chunkSupport = aggregateChunkSupport(chunkScores, fullScore);
      return clampScore(fullScore * 0.6 + chunkSupport * 0.4);
    });
    const fullPromptScores = ensemble.map((pair) => readPairScore(criterionEvidenceMaps[0], pair));
    const chunkPromptScores = criterionEvidenceMaps.slice(1).flatMap(
      (labelMap) => ensemble.map((pair) => readPairScore(labelMap, pair))
    );
    const ensembleScore = aggregatePromptScores(promptScores);
    const shrinkage = computeUncertaintyShrinkage(promptScores, [...fullPromptScores, ...chunkPromptScores]);
    return clampScore(ensembleScore * shrinkage * gate);
  });
  const topicAlignment = computeTopicAlignment(question, response, trimmedCriteria);
  const topicAlignmentGate = computeTopicAlignmentGate(topicAlignment, answerSupport, rawScores);
  const adjustedRawScores = rawScores.map(
    (score, index) => Math.min(score, estimateCriterionSpecificityCap(question, trimmedCriteria[index] ?? "", response)) * topicAlignmentGate
  );
  const calibration = options.criterionCalibration === void 0 ? DEFAULT_CRITERION_CALIBRATION : options.criterionCalibration;
  const scores = calibration ? adjustedRawScores.map((score) => applyCalibrationCurve(score, calibration)) : adjustedRawScores;
  return {
    criteria: trimmedCriteria,
    normalizedCriteria: scoringCriteria,
    scores,
    rawScores: adjustedRawScores,
    gate,
    answerSupport,
    constraintPresence,
    constraintRespect,
    deterministicConstraintPresence,
    deterministicConstraintRespect,
    structuralScore,
    taskType: normalization.taskType
  };
}
function estimateCriterionSpecificityCap(question, criterion, response) {
  const promptText = `${question} ${criterion}`.toLowerCase();
  const criterionText = criterion.toLowerCase();
  const isMethodCriterion = /\b(explains?|describes?|outlines?|shows?)\b/.test(criterionText) && /\b(deliver(?:ed|y)?|implemented?|run|operate[sd]?|carried out|completed?|through|via|using|with)\b/.test(criterionText);
  if (/\b(targets?|outcomes?|deliverables?|outputs?|results?|metrics?|milestones?|measurable|specific|numbers?|amounts?|dates?|counts?|participants?|clients?|households?|learners?|placements?|completions?|sessions?|visits?|units?|sites?)\b/.test(
    criterionText
  )) {
    return estimateTargetSpecificity(criterion, response);
  }
  if (isMethodCriterion || /\b(approach|activities|delivery method|delivery|implementation|method|steps?|process|deliver(?:ed|y)? (?:the )?(?:work|program|service|project|initiative|support|training|upgrades?)|how .*deliver)\b/.test(
    criterionText
  )) {
    return estimateMethodSpecificity(criterion, response);
  }
  if (/\b(purpose|what .*for|what is being funded|service|program|intervention|initiative|goal|focus|states?)\b/.test(
    criterionText
  ) && /\b(states?|describes?|summarizes?|identifies?|names?)\b/.test(criterionText)) {
    return estimatePurposeSpecificity(criterion, response);
  }
  if (/\b(question directly|directly answers?)\b/.test(criterionText) && promptText.includes("what")) {
    return estimatePurposeSpecificity(criterion, response);
  }
  return 1;
}
function estimatePurposeSpecificity(criterion, response) {
  const normalized = response.toLowerCase();
  const criterionOverlap = countCriterionContentOverlap(criterion, response);
  if (criterionOverlap >= 3) {
    return 1;
  }
  if (criterionOverlap >= 2) {
    return 0.75;
  }
  if (/\b(provides?|supports?|funds?|expands?|launches?|builds?|delivers?|offers?|operates?|restores?|upgrades?)\b/.test(
    normalized
  )) {
    return 0.4;
  }
  return 0.25;
}
function estimateTargetSpecificity(criterion, response) {
  const normalized = response.toLowerCase();
  const numericMatches = normalized.match(/\b\d[\d,]*(?:\.\d+)?\b/g) ?? [];
  const criterionOverlap = countCriterionContentOverlap(criterion, response);
  if (numericMatches.length > 0) {
    return 1;
  }
  const targetCues = countCueMatches(normalized, [
    "aims to",
    "targets",
    "job placements",
    "placements",
    "participants",
    "households",
    "visits",
    "sessions",
    "workshops",
    "training plans",
    "youth",
    "families",
    "clients",
    "by march",
    "by june",
    "by december",
    "over the next year"
  ]);
  if (targetCues >= 3 || criterionOverlap >= 2) {
    return 0.5;
  }
  if (targetCues >= 1 || criterionOverlap >= 1) {
    return 0.35;
  }
  if (/\b(improve results|local needs|better outcomes|respond to need|more people|increase access|improve service)\b/.test(normalized)) {
    return 0.08;
  }
  return 0.08;
}
function estimateMethodSpecificity(criterion, response) {
  const normalized = response.toLowerCase();
  const criterionOverlap = countCriterionContentOverlap(criterion, response);
  const deliveryCues = countCueMatches(normalized, [
    "through",
    "by",
    "via",
    "work with",
    "partner with",
    "weekly",
    "monthly",
    "one-on-one",
    "case management",
    "workshops",
    "referrals",
    "outreach",
    "site visits",
    "training",
    "reviews",
    "installations",
    "classes",
    "meals",
    "routes",
    "schedule",
    "scheduled",
    "facilitators",
    "staff support",
    "inspection",
    "triage",
    "assessment",
    "assessments",
    "rotation"
  ]);
  if (deliveryCues >= 4 || criterionOverlap >= 3) {
    return 1;
  }
  if (deliveryCues >= 2 || criterionOverlap >= 2) {
    return 0.82;
  }
  if (deliveryCues >= 1 || criterionOverlap >= 1) {
    return 0.32;
  }
  return 0.08;
}
function countCueMatches(text, cues) {
  return cues.filter((cue) => text.includes(cue)).length;
}
function countCriterionContentOverlap(criterion, response) {
  const criterionTokens = extractCriterionContentTokens(criterion);
  const responseTokens = new Set((response.toLowerCase().match(/[a-z0-9']+/g) ?? []).map(normalizeHeuristicToken));
  return criterionTokens.filter((token) => responseTokens.has(token)).length;
}
function extractCriterionContentTokens(text) {
  const stopWords = /* @__PURE__ */ new Set([
    "agreement",
    "approach",
    "concrete",
    "deliver",
    "delivered",
    "delivery",
    "deliverables",
    "explains",
    "expected",
    "focus",
    "funded",
    "funding",
    "general",
    "goal",
    "identifies",
    "initiative",
    "method",
    "names",
    "number",
    "numbers",
    "outcomes",
    "planned",
    "process",
    "program",
    "purpose",
    "question",
    "service",
    "specificity",
    "specific",
    "states",
    "step",
    "steps",
    "targets",
    "that",
    "the",
    "what"
  ]);
  return Array.from(
    new Set(
      (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).map(normalizeHeuristicToken).filter((token) => token.length > 3 && !stopWords.has(token))
    )
  );
}
function normalizeHeuristicToken(token) {
  if (token.endsWith("ies") && token.length > 4) {
    return `${token.slice(0, -3)}y`;
  }
  if (token.endsWith("ing") && token.length > 5) {
    return token.slice(0, -3);
  }
  if (token.endsWith("ed") && token.length > 4) {
    return token.slice(0, -2);
  }
  if (token.endsWith("s") && token.length > 4 && !token.endsWith("ss")) {
    return token.slice(0, -1);
  }
  return token;
}
async function scoreHypothesisEnsembleAcrossEvidence(classifier, evidenceTexts, ensemble) {
  const labels = dedupeLabels(ensemble.flatMap(({ positive, negative }) => [positive, negative]));
  const evidenceMaps = await classifyLabelSetAcrossTexts(classifier, evidenceTexts, labels);
  return scoreHypothesisEnsembleFromEvidenceMaps(evidenceMaps, ensemble);
}
function scoreHypothesisEnsembleFromEvidenceMaps(evidenceMaps, ensemble) {
  const promptScores = ensemble.map((pair) => {
    const fullScore = readPairScore(evidenceMaps[0], pair);
    const chunkScores = evidenceMaps.slice(1).map((labelMap) => readPairScore(labelMap, pair));
    const chunkSupport = aggregateChunkSupport(chunkScores, fullScore);
    return clampScore(fullScore * 0.65 + chunkSupport * 0.35);
  });
  const evidenceScores = evidenceMaps.flatMap((labelMap) => ensemble.map((pair) => readPairScore(labelMap, pair)));
  const shrinkage = computeUncertaintyShrinkage(promptScores, evidenceScores);
  return clampScore(aggregatePromptScores(promptScores) * shrinkage);
}
async function classifyLabelSetAcrossTexts(classifier, texts, labels) {
  const labelMaps = [];
  for (const text of texts) {
    const output = await classifier(text, labels, {
      multi_label: true,
      hypothesis_template: HYPOTHESIS_TEMPLATE
    });
    labelMaps.push(outputToLabelMap(output));
  }
  return labelMaps;
}
function outputToLabelMap(output) {
  const labelMap = /* @__PURE__ */ new Map();
  output.labels.forEach((label, index) => {
    labelMap.set(label, output.scores[index] ?? 0);
  });
  return labelMap;
}
function readPairScore(labelMap, pair) {
  return pairSupportScore(labelMap.get(pair.positive) ?? 0, labelMap.get(pair.negative) ?? 0);
}
function dedupeLabels(labels) {
  return Array.from(new Set(labels));
}
function limitEnsemble(ensemble, scoreMode) {
  return scoreMode === "fast" ? ensemble.slice(0, 1) : ensemble;
}

// library/src/quality-presentation.ts
var QUALITY_SCORE_BANDS = [
  "off_track",
  "mixed_fit",
  "strong_fit"
];
var QUALITY_SCORE_TONE_BY_BAND = {
  ...DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand
};
function resolveQualityScorePresentation(overallPercent, config = {}) {
  const resolvedConfig = {
    ...DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG,
    ...config,
    toneByBand: {
      ...DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand,
      ...config.toneByBand ?? {}
    }
  };
  if (overallPercent >= resolvedConfig.strongFitMinPercent) {
    return {
      band: "strong_fit",
      tone: resolvedConfig.toneByBand.strong_fit
    };
  }
  if (overallPercent >= resolvedConfig.mixedFitMinPercent) {
    return {
      band: "mixed_fit",
      tone: resolvedConfig.toneByBand.mixed_fit
    };
  }
  return {
    band: "off_track",
    tone: resolvedConfig.toneByBand.off_track
  };
}

// library/src/adaptive-refinement.ts
function decideQualityRefinement(input) {
  const policy = input.policy ?? input.requestConfig?.adaptiveRefinementPolicy ?? "adaptive";
  if (policy === "never") {
    return {
      shouldRunFullPass: false,
      reason: "quick_only",
      riskBand: "low",
      fastOverallPercent: input.fastResult.overallPercent
    };
  }
  if (policy === "always") {
    return {
      shouldRunFullPass: true,
      reason: "always_full",
      riskBand: "medium",
      fastOverallPercent: input.fastResult.overallPercent
    };
  }
  const config = {
    ...DEFAULT_ADAPTIVE_REFINEMENT_CONFIG,
    ...input.requestConfig?.adaptiveRefinement ?? {},
    ...input.config
  };
  const criterionPercents = input.fastResult.breakdown.map((criterion) => criterion.percent);
  const maxCriterionPercent = criterionPercents.length === 0 ? 0 : Math.max(...criterionPercents);
  const minCriterionPercent = criterionPercents.length === 0 ? 0 : Math.min(...criterionPercents);
  const spreadPercent = criterionPercents.length <= 1 ? 0 : maxCriterionPercent - minCriterionPercent;
  const lowCriterionShare = criterionPercents.length === 0 ? 0 : criterionPercents.filter((percent) => percent <= config.lowStopMaxCriterionPercent).length / criterionPercents.length;
  const taskType = resolveTaskType(input.fastResult.taskType, input.question, input.criteria);
  const hasConstraintRisk = hasQuestionConstraintRisk(input.question, input.response);
  if (input.fastResult.overallPercent <= config.lowStopOverallPercent && input.fastResult.answerSupport <= config.lowStopAnswerSupport && maxCriterionPercent <= config.lowStopMaxCriterionPercent || input.fastResult.overallPercent <= config.lowStopOverallPercent + config.lowStopSecondaryOverallBuffer && input.fastResult.answerSupport <= config.lowStopAnswerSupport && lowCriterionShare >= config.lowStopLowCriterionShare) {
    return {
      shouldRunFullPass: false,
      reason: "obvious_failure",
      riskBand: "low",
      fastOverallPercent: input.fastResult.overallPercent
    };
  }
  if (hasConstraintRisk) {
    return {
      shouldRunFullPass: true,
      reason: "constraint_risk",
      riskBand: "high",
      fastOverallPercent: input.fastResult.overallPercent
    };
  }
  if (config.disableHighStopForTaskTypes.includes(taskType)) {
    return {
      shouldRunFullPass: true,
      reason: "task_risk",
      riskBand: "high",
      fastOverallPercent: input.fastResult.overallPercent
    };
  }
  const allowHighStop = (!config.disableHighStopForConstraintQuestions || !hasQuestionConstraintMarkers(input.question)) && !config.disableHighStopForTaskTypes.includes(taskType);
  if (allowHighStop && input.fastResult.overallPercent >= config.highStopOverallPercent && minCriterionPercent >= config.highStopMinCriterionPercent && spreadPercent <= config.highStopSpreadPercent && input.fastResult.weakAnswerGate >= config.highStopWeakAnswerGate) {
    return {
      shouldRunFullPass: false,
      reason: "stable_strong",
      riskBand: "low",
      fastOverallPercent: input.fastResult.overallPercent
    };
  }
  return {
    shouldRunFullPass: true,
    reason: "mid_band",
    riskBand: "medium",
    fastOverallPercent: input.fastResult.overallPercent
  };
}
function hasQuestionConstraintMarkers(question) {
  const normalized = question.toLowerCase();
  return /\bwithout\b/.test(normalized) || /\bonly\b/.test(normalized) || /\bwithin\b/.test(normalized) || /\bunder\b/.test(normalized) || /\bbelow\b/.test(normalized) || /\bless than\b/.test(normalized) || /\bat most\b/.test(normalized) || /\bno more than\b/.test(normalized) || /\$\d/.test(normalized) || /\b\d+\s*(?:minutes?|hours?|days?|weeks?|months?|sprints?)\b/.test(normalized);
}
function hasQuestionConstraintRisk(question, response) {
  if (!hasQuestionConstraintMarkers(question)) {
    return false;
  }
  return assessDeterministicConstraints(question, response).presence > 0;
}
function resolveTaskType(taskType, question, criteria) {
  return taskType === "unknown" ? detectQualityTaskType(
    question,
    resolveQualityCriteria(criteria).map((criterion) => criterion.label)
  ) : taskType;
}

// library/src/transformers-quality-scorer.ts
import { env, pipeline } from "@huggingface/transformers";
function createTransformersQualityScorer(config = {}) {
  let resolvedConfig = resolveQualityScorerConfig(config);
  let classifier = null;
  let classifierPromise = null;
  let lastProgressFile = "";
  const constraintPresenceCache = /* @__PURE__ */ new Map();
  return {
    get config() {
      return resolvedConfig;
    },
    async loadModel(callbacks = {}) {
      await ensureClassifier(callbacks);
    },
    async score(input, options = {}) {
      const model = await ensureClassifier();
      const trimmedQuestion = (input.question ?? "").trim();
      const resolvedCriteria = resolveQualityCriteria(input.criteria);
      const output = await scoreCriteriaWithClassifier(
        model,
        trimmedQuestion,
        input.response,
        resolvedCriteria.map((criterion) => criterion.label),
        {
          criterionCalibration: resolvedConfig.criterionCalibration,
          mode: options.mode,
          lowLatency: resolvedConfig.lowLatency,
          cachedConstraintPresence: trimmedQuestion ? constraintPresenceCache.get(trimmedQuestion) ?? null : null
        }
      );
      if (trimmedQuestion) {
        constraintPresenceCache.set(trimmedQuestion, output.constraintPresence);
      }
      return formatQualityScoreResult(
        resolvedCriteria,
        output.normalizedCriteria,
        output.scores,
        output.rawScores,
        output,
        {
          input,
          response: input.response,
          config: resolvedConfig
        }
      );
    },
    estimateBudget(input) {
      return estimateQualityContextBudget(input, resolvedConfig);
    },
    reset(nextConfig = resolvedConfig) {
      resolvedConfig = resolveQualityScorerConfig(nextConfig);
      classifier = null;
      classifierPromise = null;
      lastProgressFile = "";
      constraintPresenceCache.clear();
    }
  };
  async function ensureClassifier(callbacks = {}) {
    if (classifier) {
      return classifier;
    }
    if (!classifierPromise) {
      classifierPromise = (async () => {
        callbacks.onStatus?.({
          phase: "loading",
          message: buildLoadingMessage(resolvedConfig)
        });
        applyEnvironmentConfig(resolvedConfig);
        const instance = await pipeline(resolvedConfig.task, resolvedConfig.modelId, {
          dtype: resolvedConfig.dtype,
          local_files_only: resolvedConfig.modelSource.mode === "local",
          revision: resolvedConfig.modelSource.revision,
          progress_callback: (progress) => {
            if ("file" in progress && progress.file) {
              lastProgressFile = progress.file;
            }
            if (progress.status === "progress_total") {
              callbacks.onProgress?.({
                progress: progress.progress,
                loaded: progress.loaded,
                total: progress.total,
                file: lastProgressFile
              });
            }
          }
        });
        classifier = instance;
        callbacks.onStatus?.({
          phase: "ready",
          message: buildReadyMessage(resolvedConfig)
        });
        return instance;
      })().catch((error) => {
        classifier = null;
        classifierPromise = null;
        callbacks.onStatus?.({
          phase: "error",
          message: getErrorMessage(error)
        });
        throw error;
      });
    }
    return classifierPromise;
  }
}
function applyEnvironmentConfig(config) {
  env.allowLocalModels = config.modelSource.mode === "local";
  env.allowRemoteModels = config.modelSource.mode !== "local";
  env.localModelPath = config.modelSource.localModelPath;
  env.remoteHost = config.modelSource.remoteHost;
  env.remotePathTemplate = config.modelSource.remotePathTemplate;
  env.useBrowserCache = resolveBrowserCacheSetting(config);
}
function resolveBrowserCacheSetting(config) {
  if (config.modelSource.useBrowserCache !== "auto") {
    return config.modelSource.useBrowserCache;
  }
  return typeof globalThis !== "undefined" && "caches" in globalThis && typeof globalThis.caches?.open === "function" && Boolean(globalThis.isSecureContext);
}
function formatQualityScoreResult(criteria, normalizedCriteria, scores, rawScores, meta, context) {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  const topicAlignment = computeTopicAlignment(
    context.input.question ?? "",
    context.response,
    criteria.map((criterion) => criterion.label)
  );
  const breakdown = criteria.map((criterion, index) => {
    const raw = scores[index] ?? 0;
    return {
      label: criterion.label,
      weight: criterion.weight,
      weightShare: totalWeight > 0 ? criterion.weight / totalWeight : 1 / Math.max(1, criteria.length),
      raw,
      percent: Math.round(raw * 100)
    };
  });
  const overall = computeCalibratedOverallScore(
    {
      rawOverall: computeWeightedCriterionAverage(criteria, scores),
      question: context.input.question ?? "",
      response: context.response,
      answerSupport: meta.answerSupport,
      criterionScores: scores,
      structuralScore: meta.structuralScore,
      topicAlignment
    },
    context.config
  );
  const presentation = resolveQualityScorePresentation(
    overall.overallPercent,
    context.input.config?.presentation
  );
  return {
    criteria: criteria.map((criterion) => criterion.label),
    weightedCriteria: criteria,
    normalizedCriteria,
    scores,
    rawScores,
    gate: meta.gate,
    answerSupport: meta.answerSupport,
    constraintPresence: meta.constraintPresence,
    constraintRespect: meta.constraintRespect,
    deterministicConstraintPresence: meta.deterministicConstraintPresence,
    deterministicConstraintRespect: meta.deterministicConstraintRespect,
    structuralScore: meta.structuralScore,
    topicAlignment,
    taskType: meta.taskType,
    overallRaw: overall.overallRaw,
    weakAnswerGate: overall.weakAnswerGate,
    overallAdjustedRaw: overall.overallAdjustedRaw,
    overallCalibrated: overall.overallCalibrated,
    overallPercent: overall.overallPercent,
    band: presentation.band,
    tone: presentation.tone,
    breakdown
  };
}
function buildLoadingMessage(config) {
  const cacheEnabled = resolveBrowserCacheSetting(config);
  const modelKind = `${config.dtype} ${config.modelId}`;
  if (config.modelSource.mode === "huggingface") {
    return cacheEnabled ? `Loading ${modelKind} from the Hugging Face Hub. Browser cache is available.` : `Loading ${modelKind} from the Hugging Face Hub. Persistent browser cache is unavailable in this context.`;
  }
  if (config.modelSource.mode === "url") {
    return cacheEnabled ? `Loading ${modelKind} from the configured remote model host. Browser cache is available.` : `Loading ${modelKind} from the configured remote model host. Persistent browser cache is unavailable in this context.`;
  }
  return cacheEnabled ? `Loading ${modelKind} from same-origin local assets.` : `Loading ${modelKind} from same-origin local assets. Browser cache is unavailable in this context, so files will load without persistent cache.`;
}
function buildReadyMessage(config) {
  const cacheEnabled = resolveBrowserCacheSetting(config);
  if (config.modelSource.mode === "huggingface") {
    return cacheEnabled ? `${config.dtype} model ready. Scoring now runs locally in-browser and Hugging Face assets can be cached.` : `${config.dtype} model ready. Scoring now runs locally in-browser, but persistent browser caching is unavailable in this context.`;
  }
  if (config.modelSource.mode === "url") {
    return cacheEnabled ? `${config.dtype} model ready. Scoring now runs locally in-browser and remote assets can be cached.` : `${config.dtype} model ready. Scoring now runs locally in-browser, but persistent browser caching is unavailable in this context.`;
  }
  return cacheEnabled ? `${config.dtype} model ready. Scoring now runs locally in-browser from bundled files.` : `${config.dtype} model ready. Scoring now runs locally in-browser from bundled files, but this context does not support persistent browser caching.`;
}
function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown quality scorer error.";
}

// library/src/worker-client.ts
function createQualityScorerWorkerClient(options) {
  let config = resolveQualityScorerConfig(options.config);
  let worker = options.createWorker();
  let requestCounter = 0;
  let pendingLoad = null;
  const pendingScores = /* @__PURE__ */ new Map();
  worker.addEventListener("message", handleWorkerMessage);
  worker.addEventListener("error", handleWorkerCrash);
  return {
    async loadModel(nextConfig) {
      if (nextConfig) {
        config = resolveQualityScorerConfig(nextConfig);
      }
      if (pendingLoad) {
        return new Promise((resolve, reject) => {
          const currentPending = pendingLoad;
          pendingLoad = {
            resolve: () => {
              currentPending.resolve();
              resolve();
            },
            reject: (error) => {
              currentPending.reject(error);
              reject(error);
            }
          };
        });
      }
      return new Promise((resolve, reject) => {
        pendingLoad = { resolve, reject };
        post({ type: "INIT_MODEL", config });
      });
    },
    async score(input, options2 = {}) {
      const requestId = createRequestId();
      return new Promise((resolve, reject) => {
        pendingScores.set(requestId, { resolve, reject });
        post({
          type: "SCORE_RESPONSE",
          requestId,
          input,
          options: options2
        });
      });
    },
    estimateBudget(input) {
      return estimateQualityContextBudget(input, config);
    },
    async reset(nextConfig = config) {
      worker.removeEventListener("message", handleWorkerMessage);
      worker.removeEventListener("error", handleWorkerCrash);
      worker.terminate();
      worker = options.createWorker();
      worker.addEventListener("message", handleWorkerMessage);
      worker.addEventListener("error", handleWorkerCrash);
      pendingLoad = null;
      pendingScores.clear();
      config = resolveQualityScorerConfig(nextConfig);
      await new Promise((resolve, reject) => {
        pendingLoad = { resolve, reject };
        post({ type: "INIT_MODEL", config });
      });
    },
    terminate() {
      worker.removeEventListener("message", handleWorkerMessage);
      worker.removeEventListener("error", handleWorkerCrash);
      worker.terminate();
      failAllPending("The quality scorer worker was terminated.");
    },
    getConfig() {
      return config;
    }
  };
  function createRequestId() {
    requestCounter += 1;
    return `quality-score-${requestCounter}`;
  }
  function post(message) {
    worker.postMessage(message);
  }
  function handleWorkerMessage(event) {
    const message = event.data;
    switch (message.type) {
      case "MODEL_STATUS":
        options.onModelStatus?.({
          phase: message.phase,
          message: message.message
        });
        if (message.phase === "ready") {
          pendingLoad?.resolve();
          pendingLoad = null;
        } else if (message.phase === "error") {
          const error = new Error(message.message);
          pendingLoad?.reject(error);
          pendingLoad = null;
        }
        break;
      case "MODEL_PROGRESS":
        options.onModelProgress?.({
          progress: message.progress,
          loaded: message.loaded,
          total: message.total,
          file: message.file
        });
        break;
      case "SCORE_RESULT": {
        const pending = pendingScores.get(message.requestId);
        if (!pending) {
          break;
        }
        pendingScores.delete(message.requestId);
        pending.resolve(message.result);
        break;
      }
      case "WORKER_ERROR": {
        const error = new Error(message.message);
        if (message.requestId) {
          const pending = pendingScores.get(message.requestId);
          if (pending) {
            pendingScores.delete(message.requestId);
            pending.reject(error);
            break;
          }
        }
        pendingLoad?.reject(error);
        pendingLoad = null;
        failAllPending(message.message);
        break;
      }
    }
  }
  function handleWorkerCrash() {
    failAllPending("The quality scorer worker crashed.");
    pendingLoad?.reject(new Error("The quality scorer worker crashed."));
    pendingLoad = null;
  }
  function failAllPending(message) {
    for (const [requestId, pending] of pendingScores.entries()) {
      pending.reject(new Error(message));
      pendingScores.delete(requestId);
    }
  }
}
export {
  DEFAULT_ADAPTIVE_REFINEMENT_CONFIG,
  DEFAULT_QUALITY_SCORER_CONFIG,
  DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG,
  ESTIMATED_CHARS_PER_TOKEN,
  HYPOTHESIS_TEMPLATE,
  MIN_SAFE_PREMISE_TOKENS,
  MODEL_TOKEN_LIMIT,
  QUALITY_SCORE_BANDS,
  QUALITY_SCORE_TONE_BY_BAND,
  TOKEN_BUFFER,
  aggregateChunkSupport,
  aggregatePromptScores,
  applyCalibrationCurve,
  assessDeterministicConstraints,
  assessTaskStructure,
  buildEvaluationText,
  calibrateQualityOverall,
  clampScore,
  computeAnswerValidityGate,
  computeCalibratedOverallScore,
  computeConstraintGate,
  computeTaskStructureGate,
  computeTopicAlignment,
  computeTopicAlignmentGate,
  computeUncertaintyShrinkage,
  computeWeakAnswerGate,
  countResponseSegments,
  createAnswerValidityHypothesisEnsemble,
  createConstraintPresenceHypothesisEnsemble,
  createConstraintRespectHypothesisEnsemble,
  createCriterionHypotheses,
  createCriterionHypothesis,
  createCriterionHypothesisEnsemble,
  createQualityScorerWorkerClient,
  createTransformersQualityScorer,
  decideQualityRefinement,
  detectQualityTaskType,
  estimateQualityContextBudget,
  estimateTokenCount,
  estimateTokenCountWithConfig,
  fitIsotonicCalibration,
  getQualityModelSourceLocation,
  getSafePremiseTokenBudget,
  getSafePremiseTokenBudgetWithConfig,
  hasQuestionConstraintMarkers,
  isRemoteModelSource,
  mean,
  median,
  normalizeCriteriaForScoring,
  normalizeCriterionText,
  pairSupportScore,
  parseEvaluationText,
  resolveQualityScorePresentation,
  resolveQualityScorerConfig,
  scoreCriteriaWithClassifier,
  splitResponseIntoEvidenceChunks,
  spread,
  standardDeviation
};
