type CalibrationPoint = {
    raw: number;
    target: number;
    weight?: number;
};
type CalibrationCurve = {
    xs: number[];
    ys: number[];
};
declare function fitIsotonicCalibration(points: CalibrationPoint[]): CalibrationCurve | null;
declare function applyCalibrationCurve(score: number, curve: CalibrationCurve): number;

type QualityTaskType = 'advice' | 'comparison' | 'planning' | 'unknown';
type ExtractedConstraint = {
    category: 'avoid' | 'budget' | 'timeline' | 'effort' | 'priority';
    summary: string;
    tokens: string[];
    maxValue?: number;
    unit?: string;
};
type StructuredConstraintAssessment = {
    extracted: ExtractedConstraint[];
    presence: number;
    respect: number;
    violations: string[];
};
type TaskStructureAssessment = {
    taskType: QualityTaskType;
    score: number;
    reasons: string[];
};
type CriterionNormalizationResult = {
    taskType: QualityTaskType;
    goalSummary: string;
    constraintSummary: string;
    prioritySummary: string;
    optionSummary: string;
    normalizedCriteria: string[];
};
declare function detectQualityTaskType(question: string, criteria?: string[]): QualityTaskType;
declare function normalizeCriteriaForScoring(question: string, criteria: string[]): {
    taskType: QualityTaskType;
    goalSummary: string;
    constraintSummary: string;
    prioritySummary: string;
    optionSummary: string;
    normalizedCriteria: string[];
};
declare function assessDeterministicConstraints(question: string, response: string): StructuredConstraintAssessment;
declare function assessTaskStructure(question: string, response: string, criteria: string[]): TaskStructureAssessment;

type QualityModelPhase = 'idle' | 'loading' | 'ready' | 'error';
type QualityModelSourceMode = 'local' | 'url' | 'huggingface';
type QualityModelSourceConfig = {
    mode: QualityModelSourceMode;
    localModelPath: string;
    remoteHost: string;
    remotePathTemplate: string;
    revision: string;
    useBrowserCache: boolean | 'auto';
};
type QualityBudgetConfig = {
    modelTokenLimit: number;
    estimatedCharsPerToken: number;
    tokenBuffer: number;
    minSafePremiseTokens: number;
};
type QualityLowLatencyConfig = {
    useDeterministicConstraintChecks: boolean;
    useTaskStructureChecks: boolean;
    useCriterionNormalization: boolean;
};
type QualityScorerConfig = {
    task: 'zero-shot-classification';
    modelId: string;
    dtype: 'auto' | 'q8' | 'fp32' | 'fp16' | 'int8' | 'uint8' | 'q4' | 'bnb4' | 'q4f16';
    hypothesisTemplate: string;
    modelSource: QualityModelSourceConfig;
    limits: QualityBudgetConfig;
    lowLatency: QualityLowLatencyConfig;
    criterionCalibration: CalibrationCurve | null;
    overallCalibration: CalibrationCurve | null;
};
type QualityScorerConfigInput = Partial<Omit<QualityScorerConfig, 'modelSource' | 'limits'>> & {
    modelSource?: Partial<QualityModelSourceConfig>;
    limits?: Partial<QualityBudgetConfig>;
    lowLatency?: Partial<QualityLowLatencyConfig>;
};
type QualityScoreInput = {
    question?: string;
    response: string;
    criteria: QualityCriterionInput[];
    config?: QualityScoreRequestConfig;
};
type QualityScoreMode = 'fast' | 'full';
type QualityScoreOptions = {
    mode?: QualityScoreMode;
};
type QualityRefinementPolicy = 'always' | 'adaptive' | 'never';
type QualityAdaptiveRefinementConfig = {
    lowStopOverallPercent: number;
    lowStopAnswerSupport: number;
    lowStopMaxCriterionPercent: number;
    lowStopSecondaryOverallBuffer: number;
    lowStopLowCriterionShare: number;
    highStopOverallPercent: number;
    highStopMinCriterionPercent: number;
    highStopSpreadPercent: number;
    highStopWeakAnswerGate: number;
    disableHighStopForConstraintQuestions: boolean;
    disableHighStopForTaskTypes: QualityTaskType[];
};
type QualityScorePresentationConfig = {
    mixedFitMinPercent: number;
    strongFitMinPercent: number;
    toneByBand: Record<QualityScoreBand, QualityScoreTone>;
};
type QualityScoreRequestConfig = {
    presentation?: Partial<QualityScorePresentationConfig>;
    adaptiveRefinementPolicy?: QualityRefinementPolicy;
    adaptiveRefinement?: Partial<QualityAdaptiveRefinementConfig>;
};
type QualityRefinementDecision = {
    shouldRunFullPass: boolean;
    reason: 'obvious_failure' | 'stable_strong' | 'mid_band' | 'constraint_risk' | 'task_risk' | 'quick_only' | 'always_full';
    riskBand: 'low' | 'medium' | 'high';
    fastOverallPercent: number;
};
type QualityCriterionScore = {
    label: string;
    weight: number;
    weightShare: number;
    raw: number;
    percent: number;
};
type QualityScoreBand = 'off_track' | 'mixed_fit' | 'strong_fit';
type QualityScoreTone = 'error' | 'warning' | 'success';
type QualityCriterionInput = string | {
    label: string;
    weight?: number;
};
type QualityWeightedCriterion = {
    label: string;
    weight: number;
};
type QualityScoreResult = {
    criteria: string[];
    weightedCriteria: QualityWeightedCriterion[];
    normalizedCriteria: string[];
    scores: number[];
    rawScores: number[];
    gate: number;
    answerSupport: number;
    constraintPresence: number;
    constraintRespect: number;
    deterministicConstraintPresence: number;
    deterministicConstraintRespect: number;
    structuralScore: number;
    topicAlignment: number;
    taskType: QualityTaskType;
    overallRaw: number;
    weakAnswerGate: number;
    overallAdjustedRaw: number;
    overallCalibrated: number;
    overallPercent: number;
    band: QualityScoreBand;
    tone: QualityScoreTone;
    breakdown: QualityCriterionScore[];
};
type QualityContextBudget = {
    evaluationText: string;
    estimatedPremiseTokens: number;
    safePremiseTokenBudget: number;
    safePremiseCharBudget: number;
    isNearLimit: boolean;
    isOverLimit: boolean;
};
type QualityModelStatusEvent = {
    phase: QualityModelPhase;
    message: string;
};
type QualityModelProgressEvent = {
    progress: number;
    loaded: number;
    total: number;
    file?: string;
};
type QualityScorerLoadCallbacks = {
    onStatus?: (event: QualityModelStatusEvent) => void;
    onProgress?: (event: QualityModelProgressEvent) => void;
};
type QualityScorer = {
    readonly config: QualityScorerConfig;
    loadModel(callbacks?: QualityScorerLoadCallbacks): Promise<void>;
    score(input: QualityScoreInput, options?: QualityScoreOptions): Promise<QualityScoreResult>;
    estimateBudget(input: QualityScoreInput): QualityContextBudget;
    reset(nextConfig?: QualityScorerConfigInput): void;
};
type QualityScorerWorkerClientOptions = {
    config: QualityScorerConfigInput;
    createWorker: () => Worker;
    onModelStatus?: (event: QualityModelStatusEvent) => void;
    onModelProgress?: (event: QualityModelProgressEvent) => void;
};
type QualityScorerWorkerClient = {
    loadModel(nextConfig?: QualityScorerConfigInput): Promise<void>;
    score(input: QualityScoreInput, options?: QualityScoreOptions): Promise<QualityScoreResult>;
    estimateBudget(input: QualityScoreInput): QualityContextBudget;
    reset(nextConfig?: QualityScorerConfigInput): Promise<void>;
    terminate(): void;
    getConfig(): QualityScorerConfig;
};
type QualityWorkerRequest = {
    type: 'INIT_MODEL';
    config: QualityScorerConfig;
} | {
    type: 'SCORE_RESPONSE';
    requestId: string;
    input: QualityScoreInput;
    options?: QualityScoreOptions;
};
type QualityWorkerEvent = {
    type: 'MODEL_STATUS';
    phase: QualityModelPhase;
    message: string;
} | {
    type: 'MODEL_PROGRESS';
    progress: number;
    loaded: number;
    total: number;
    file?: string;
} | {
    type: 'SCORE_RESULT';
    requestId: string;
    result: QualityScoreResult;
} | {
    type: 'WORKER_ERROR';
    requestId?: string;
    message: string;
};

declare const DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG: QualityScorePresentationConfig;
declare const DEFAULT_ADAPTIVE_REFINEMENT_CONFIG: QualityAdaptiveRefinementConfig;
declare const DEFAULT_QUALITY_SCORER_CONFIG: QualityScorerConfig;
declare function resolveQualityScorerConfig(config?: QualityScorerConfigInput): QualityScorerConfig;
declare function estimateQualityContextBudget(input: Pick<QualityScoreInput, 'question' | 'response' | 'criteria'>, config?: QualityScorerConfigInput): QualityContextBudget;
declare function calibrateQualityOverall(score: number, config?: QualityScorerConfigInput): number;
declare function computeCalibratedOverallScore(input: {
    rawOverall: number;
    question?: string;
    response: string;
    answerSupport: number;
    criterionScores: number[];
    structuralScore?: number;
    topicAlignment?: number;
}, config?: QualityScorerConfigInput): {
    overallRaw: number;
    weakAnswerGate: number;
    overallAdjustedRaw: number;
    overallCalibrated: number;
    overallPercent: number;
};
declare function isRemoteModelSource(config?: QualityScorerConfigInput): boolean;
declare function getQualityModelSourceLocation(config?: QualityScorerConfigInput): string;
declare function estimateTokenCountWithConfig(text: string, config?: QualityScorerConfigInput): number;
declare function getSafePremiseTokenBudgetWithConfig(criteria: string[], config?: QualityScorerConfigInput): number;

declare const MODEL_TOKEN_LIMIT = 512;
declare const ESTIMATED_CHARS_PER_TOKEN = 4;
declare const HYPOTHESIS_TEMPLATE = "{}";
declare const TOKEN_BUFFER = 12;
declare const MIN_SAFE_PREMISE_TOKENS = 128;
type HypothesisPair = {
    positive: string;
    negative: string;
};
declare function buildEvaluationText(question: string, response: string): string;
declare function parseEvaluationText(inputText: string): {
    question: string;
    response: string;
};
declare function createAnswerValidityHypothesisEnsemble(question: string): HypothesisPair[];
declare function createConstraintPresenceHypothesisEnsemble(): HypothesisPair[];
declare function createConstraintRespectHypothesisEnsemble(): HypothesisPair[];
declare function normalizeCriterionText(criterion: string): string;
declare function createCriterionHypothesis(criterion: string): string;
declare function createCriterionHypothesisEnsemble(criterion: string): HypothesisPair[];
declare function createCriterionHypotheses(criterion: string): {
    positive: string;
    negative: string;
};
declare function estimateTokenCount(text: string): number;
declare function getSafePremiseTokenBudget(criteria: string[]): number;
declare function splitResponseIntoEvidenceChunks(response: string): string[];
declare function pairSupportScore(positiveScore: number, negativeScore: number): number;
declare function aggregateChunkSupport(chunkScores: number[], fallbackScore: number): number;
declare function aggregatePromptScores(promptScores: number[]): number;
declare function computeAnswerValidityGate(answerSupport: number, response: string): number;
declare function computeConstraintGate(constraintPresence: number, constraintRespect: number): number;
declare function computeWeakAnswerGate(question: string, response: string, answerSupport: number, criterionScores: number[]): number;
declare function computeTopicAlignment(question: string, response: string, criteria?: string[]): number;
declare function computeTopicAlignmentGate(topicAlignment: number, answerSupport: number, criterionScores: number[]): number;
declare function computeTaskStructureGate(structuralScore: number, answerSupport: number, criterionScores: number[]): number;
declare function computeUncertaintyShrinkage(promptScores: number[], evidenceScores: number[]): number;
declare function mean(values: number[]): number;
declare function median(values: number[]): number;
declare function standardDeviation(values: number[]): number;
declare function spread(values: number[]): number;
declare function clampScore(score: number): number;
declare function countResponseSegments(response: string): number;

type ZeroShotClassificationOutput = {
    labels: string[];
    scores: number[];
};
type ZeroShotClassifier = (text: string, candidateLabels: string[], options: {
    multi_label: true;
    hypothesis_template?: string;
}) => Promise<ZeroShotClassificationOutput>;
type CriterionScoreResult = {
    criteria: string[];
    normalizedCriteria: string[];
    scores: number[];
    rawScores: number[];
    gate: number;
    answerSupport: number;
    constraintPresence: number;
    constraintRespect: number;
    deterministicConstraintPresence: number;
    deterministicConstraintRespect: number;
    structuralScore: number;
    taskType: ReturnType<typeof detectQualityTaskType>;
};
type ScoreCriteriaOptions = {
    criterionCalibration?: CalibrationCurve | null;
    mode?: QualityScoreMode;
    lowLatency?: {
        useDeterministicConstraintChecks: boolean;
        useTaskStructureChecks: boolean;
        useCriterionNormalization: boolean;
    };
    cachedConstraintPresence?: number | null;
};
declare function scoreCriteriaWithClassifier(classifier: ZeroShotClassifier, question: string, response: string, criteria: string[], options?: ScoreCriteriaOptions): Promise<CriterionScoreResult>;

type QualityScorePresentation = {
    band: QualityScoreBand;
    tone: QualityScoreTone;
};
declare const QUALITY_SCORE_BANDS: readonly ["off_track", "mixed_fit", "strong_fit"];
declare const QUALITY_SCORE_TONE_BY_BAND: Record<QualityScoreBand, QualityScoreTone>;
/**
 * Resolves display-oriented quality band metadata from an overall percentage.
 */
declare function resolveQualityScorePresentation(overallPercent: number, config?: Partial<QualityScorePresentationConfig>): QualityScorePresentation;

type DecideQualityRefinementInput = {
    fastResult: QualityScoreResult;
    question: string;
    response: string;
    criteria: QualityCriterionInput[];
    policy?: QualityRefinementPolicy;
    config?: Partial<QualityAdaptiveRefinementConfig>;
    requestConfig?: QualityScoreRequestConfig;
};
declare function decideQualityRefinement(input: DecideQualityRefinementInput): QualityRefinementDecision;
declare function hasQuestionConstraintMarkers(question: string): boolean;

declare function createTransformersQualityScorer(config?: QualityScorerConfigInput): QualityScorer;

declare function createQualityScorerWorkerClient(options: QualityScorerWorkerClientOptions): QualityScorerWorkerClient;

export { type CalibrationCurve, type CalibrationPoint, type CriterionNormalizationResult, type CriterionScoreResult, DEFAULT_ADAPTIVE_REFINEMENT_CONFIG, DEFAULT_QUALITY_SCORER_CONFIG, DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG, ESTIMATED_CHARS_PER_TOKEN, type ExtractedConstraint, HYPOTHESIS_TEMPLATE, type HypothesisPair, MIN_SAFE_PREMISE_TOKENS, MODEL_TOKEN_LIMIT, QUALITY_SCORE_BANDS, QUALITY_SCORE_TONE_BY_BAND, type QualityAdaptiveRefinementConfig, type QualityBudgetConfig, type QualityContextBudget, type QualityCriterionInput, type QualityCriterionScore, type QualityLowLatencyConfig, type QualityModelPhase, type QualityModelProgressEvent, type QualityModelSourceConfig, type QualityModelSourceMode, type QualityModelStatusEvent, type QualityRefinementDecision, type QualityRefinementPolicy, type QualityScoreBand, type QualityScoreInput, type QualityScoreMode, type QualityScoreOptions, type QualityScorePresentation, type QualityScorePresentationConfig, type QualityScoreRequestConfig, type QualityScoreResult, type QualityScoreTone, type QualityScorer, type QualityScorerConfig, type QualityScorerConfigInput, type QualityScorerLoadCallbacks, type QualityScorerWorkerClient, type QualityScorerWorkerClientOptions, type QualityTaskType, type QualityWeightedCriterion, type QualityWorkerEvent, type QualityWorkerRequest, type ScoreCriteriaOptions, type StructuredConstraintAssessment, TOKEN_BUFFER, type TaskStructureAssessment, type ZeroShotClassifier, aggregateChunkSupport, aggregatePromptScores, applyCalibrationCurve, assessDeterministicConstraints, assessTaskStructure, buildEvaluationText, calibrateQualityOverall, clampScore, computeAnswerValidityGate, computeCalibratedOverallScore, computeConstraintGate, computeTaskStructureGate, computeTopicAlignment, computeTopicAlignmentGate, computeUncertaintyShrinkage, computeWeakAnswerGate, countResponseSegments, createAnswerValidityHypothesisEnsemble, createConstraintPresenceHypothesisEnsemble, createConstraintRespectHypothesisEnsemble, createCriterionHypotheses, createCriterionHypothesis, createCriterionHypothesisEnsemble, createQualityScorerWorkerClient, createTransformersQualityScorer, decideQualityRefinement, detectQualityTaskType, estimateQualityContextBudget, estimateTokenCount, estimateTokenCountWithConfig, fitIsotonicCalibration, getQualityModelSourceLocation, getSafePremiseTokenBudget, getSafePremiseTokenBudgetWithConfig, hasQuestionConstraintMarkers, isRemoteModelSource, mean, median, normalizeCriteriaForScoring, normalizeCriterionText, pairSupportScore, parseEvaluationText, resolveQualityScorePresentation, resolveQualityScorerConfig, scoreCriteriaWithClassifier, splitResponseIntoEvidenceChunks, spread, standardDeviation };
