import type { CalibrationCurve } from './calibration-core'
import type { QualityTaskType } from './low-latency'

export type QualityModelPhase = 'idle' | 'loading' | 'ready' | 'error'

export type QualityModelSourceMode = 'local' | 'url' | 'huggingface'

export type QualityModelSourceConfig = {
  mode: QualityModelSourceMode
  localModelPath: string
  remoteHost: string
  remotePathTemplate: string
  revision: string
  useBrowserCache: boolean | 'auto'
}

export type QualityBudgetConfig = {
  modelTokenLimit: number
  estimatedCharsPerToken: number
  tokenBuffer: number
  minSafePremiseTokens: number
}

export type QualityLowLatencyConfig = {
  useDeterministicConstraintChecks: boolean
  useTaskStructureChecks: boolean
  useCriterionNormalization: boolean
}

export type QualityScorerConfig = {
  task: 'zero-shot-classification'
  modelId: string
  dtype: 'auto' | 'q8' | 'fp32' | 'fp16' | 'int8' | 'uint8' | 'q4' | 'bnb4' | 'q4f16'
  hypothesisTemplate: string
  modelSource: QualityModelSourceConfig
  limits: QualityBudgetConfig
  lowLatency: QualityLowLatencyConfig
  criterionCalibration: CalibrationCurve | null
  overallCalibration: CalibrationCurve | null
}

export type QualityScorerConfigInput = Partial<Omit<QualityScorerConfig, 'modelSource' | 'limits'>> & {
  modelSource?: Partial<QualityModelSourceConfig>
  limits?: Partial<QualityBudgetConfig>
  lowLatency?: Partial<QualityLowLatencyConfig>
}

export type QualityScoreInput = {
  question?: string
  response: string
  criteria: string[]
}

export type QualityScoreMode = 'fast' | 'full'

export type QualityScoreOptions = {
  mode?: QualityScoreMode
}

export type QualityRefinementPolicy = 'always' | 'adaptive' | 'never'

export type QualityAdaptiveRefinementConfig = {
  lowStopOverallPercent: number
  lowStopAnswerSupport: number
  lowStopMaxCriterionPercent: number
  lowStopSecondaryOverallBuffer: number
  lowStopLowCriterionShare: number
  highStopOverallPercent: number
  highStopMinCriterionPercent: number
  highStopSpreadPercent: number
  highStopWeakAnswerGate: number
  disableHighStopForConstraintQuestions: boolean
  disableHighStopForTaskTypes: QualityTaskType[]
}

export type QualityRefinementDecision = {
  shouldRunFullPass: boolean
  reason:
    | 'obvious_failure'
    | 'stable_strong'
    | 'mid_band'
    | 'constraint_risk'
    | 'task_risk'
    | 'quick_only'
    | 'always_full'
  riskBand: 'low' | 'medium' | 'high'
  fastOverallPercent: number
}

export type QualityCriterionScore = {
  label: string
  raw: number
  percent: number
}

export type QualityScoreResult = {
  criteria: string[]
  normalizedCriteria: string[]
  scores: number[]
  rawScores: number[]
  gate: number
  answerSupport: number
  constraintPresence: number
  constraintRespect: number
  deterministicConstraintPresence: number
  deterministicConstraintRespect: number
  structuralScore: number
  taskType: QualityTaskType
  overallRaw: number
  weakAnswerGate: number
  overallAdjustedRaw: number
  overallCalibrated: number
  overallPercent: number
  breakdown: QualityCriterionScore[]
}

export type QualityContextBudget = {
  evaluationText: string
  estimatedPremiseTokens: number
  safePremiseTokenBudget: number
  safePremiseCharBudget: number
  isNearLimit: boolean
  isOverLimit: boolean
}

export type QualityModelStatusEvent = {
  phase: QualityModelPhase
  message: string
}

export type QualityModelProgressEvent = {
  progress: number
  loaded: number
  total: number
  file?: string
}

export type QualityScorerLoadCallbacks = {
  onStatus?: (event: QualityModelStatusEvent) => void
  onProgress?: (event: QualityModelProgressEvent) => void
}

export type QualityScorer = {
  readonly config: QualityScorerConfig
  loadModel(callbacks?: QualityScorerLoadCallbacks): Promise<void>
  score(input: QualityScoreInput, options?: QualityScoreOptions): Promise<QualityScoreResult>
  estimateBudget(input: QualityScoreInput): QualityContextBudget
  reset(nextConfig?: QualityScorerConfigInput): void
}

export type QualityScorerWorkerClientOptions = {
  config: QualityScorerConfigInput
  createWorker: () => Worker
  onModelStatus?: (event: QualityModelStatusEvent) => void
  onModelProgress?: (event: QualityModelProgressEvent) => void
}

export type QualityScorerWorkerClient = {
  loadModel(nextConfig?: QualityScorerConfigInput): Promise<void>
  score(input: QualityScoreInput, options?: QualityScoreOptions): Promise<QualityScoreResult>
  estimateBudget(input: QualityScoreInput): QualityContextBudget
  reset(nextConfig?: QualityScorerConfigInput): Promise<void>
  terminate(): void
  getConfig(): QualityScorerConfig
}

export type QualityWorkerRequest =
  | {
      type: 'INIT_MODEL'
      config: QualityScorerConfig
    }
  | {
      type: 'SCORE_RESPONSE'
      requestId: string
      input: QualityScoreInput
      options?: QualityScoreOptions
    }

export type QualityWorkerEvent =
  | {
      type: 'MODEL_STATUS'
      phase: QualityModelPhase
      message: string
    }
  | {
      type: 'MODEL_PROGRESS'
      progress: number
      loaded: number
      total: number
      file?: string
    }
  | {
      type: 'SCORE_RESULT'
      requestId: string
      result: QualityScoreResult
    }
  | {
      type: 'WORKER_ERROR'
      requestId?: string
      message: string
    }
