import type { ProgressInfo } from '@huggingface/transformers'
import { env, pipeline } from '@huggingface/transformers'
import { computeWeightedCriterionAverage, resolveQualityCriteria } from './criteria'
import { computeCalibratedOverallScore, resolveQualityScorerConfig, estimateQualityContextBudget } from './defaults'
import { scoreCriteriaWithClassifier, type ZeroShotClassifier } from './evaluator'
import { resolveQualityScorePresentation } from './quality-presentation'
import type {
  QualityScoreResult,
  QualityScorer,
  QualityScorerConfigInput,
  QualityScorerLoadCallbacks,
  QualityWeightedCriterion,
} from './types'
import type { QualityScorerConfig } from './types'

export function createTransformersQualityScorer(config: QualityScorerConfigInput = {}): QualityScorer {
  let resolvedConfig = resolveQualityScorerConfig(config)
  let classifier: ZeroShotClassifier | null = null
  let classifierPromise: Promise<ZeroShotClassifier> | null = null
  let lastProgressFile = ''
  const constraintPresenceCache = new Map<string, number>()

  return {
    get config() {
      return resolvedConfig
    },

    async loadModel(callbacks = {}) {
      await ensureClassifier(callbacks)
    },

    async score(input, options = {}) {
      const model = await ensureClassifier()
      const trimmedQuestion = (input.question ?? '').trim()
      const resolvedCriteria = resolveQualityCriteria(input.criteria)
      const output = await scoreCriteriaWithClassifier(
        model,
        trimmedQuestion,
        input.response,
        resolvedCriteria.map((criterion) => criterion.label),
        {
          criterionCalibration: resolvedConfig.criterionCalibration,
          mode: options.mode,
          lowLatency: resolvedConfig.lowLatency,
          cachedConstraintPresence: trimmedQuestion
            ? (constraintPresenceCache.get(trimmedQuestion) ?? null)
            : null,
        },
      )

      if (trimmedQuestion) {
        constraintPresenceCache.set(trimmedQuestion, output.constraintPresence)
      }

      return formatQualityScoreResult(
        resolvedCriteria,
        output.normalizedCriteria,
        output.scores,
        output.rawScores,
        output,
        {
          question: input.question ?? '',
          response: input.response,
          config: resolvedConfig,
        },
      )
    },

    estimateBudget(input) {
      return estimateQualityContextBudget(input, resolvedConfig)
    },

    reset(nextConfig = resolvedConfig) {
      resolvedConfig = resolveQualityScorerConfig(nextConfig)
      classifier = null
      classifierPromise = null
      lastProgressFile = ''
      constraintPresenceCache.clear()
    },
  }

  async function ensureClassifier(callbacks: QualityScorerLoadCallbacks = {}) {
    if (classifier) {
      return classifier
    }

    if (!classifierPromise) {
      classifierPromise = (async () => {
        callbacks.onStatus?.({
          phase: 'loading',
          message: buildLoadingMessage(resolvedConfig),
        })

        applyEnvironmentConfig(resolvedConfig)

        const instance = (await pipeline(resolvedConfig.task, resolvedConfig.modelId, {
          dtype: resolvedConfig.dtype,
          local_files_only: resolvedConfig.modelSource.mode === 'local',
          revision: resolvedConfig.modelSource.revision,
          progress_callback: (progress: ProgressInfo) => {
            if ('file' in progress && progress.file) {
              lastProgressFile = progress.file
            }

            if (progress.status === 'progress_total') {
              callbacks.onProgress?.({
                progress: progress.progress,
                loaded: progress.loaded,
                total: progress.total,
                file: lastProgressFile,
              })
            }
          },
        })) as ZeroShotClassifier

        classifier = instance
        callbacks.onStatus?.({
          phase: 'ready',
          message: buildReadyMessage(resolvedConfig),
        })

        return instance
      })().catch((error) => {
        classifier = null
        classifierPromise = null

        callbacks.onStatus?.({
          phase: 'error',
          message: getErrorMessage(error),
        })

        throw error
      })
    }

    return classifierPromise
  }
}

function applyEnvironmentConfig(config: QualityScorerConfig) {
  env.allowLocalModels = config.modelSource.mode === 'local'
  env.allowRemoteModels = config.modelSource.mode !== 'local'
  env.localModelPath = config.modelSource.localModelPath
  env.remoteHost = config.modelSource.remoteHost
  env.remotePathTemplate = config.modelSource.remotePathTemplate
  env.useBrowserCache = resolveBrowserCacheSetting(config)
}

function resolveBrowserCacheSetting(config: QualityScorerConfig) {
  if (config.modelSource.useBrowserCache !== 'auto') {
    return config.modelSource.useBrowserCache
  }

  return (
    typeof globalThis !== 'undefined' &&
    'caches' in globalThis &&
    typeof globalThis.caches?.open === 'function' &&
    Boolean(globalThis.isSecureContext)
  )
}

function formatQualityScoreResult(
  criteria: QualityWeightedCriterion[],
  normalizedCriteria: string[],
  scores: number[],
  rawScores: number[],
  meta: {
    gate: number
    answerSupport: number
    constraintPresence: number
    constraintRespect: number
    deterministicConstraintPresence: number
    deterministicConstraintRespect: number
    structuralScore: number
    taskType: QualityScoreResult['taskType']
  },
  context: {
    question: string
    response: string
    config: QualityScorerConfig
  },
): QualityScoreResult {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
  const breakdown = criteria.map((criterion, index) => {
    const raw = scores[index] ?? 0

    return {
      label: criterion.label,
      weight: criterion.weight,
      weightShare: totalWeight > 0 ? criterion.weight / totalWeight : 1 / Math.max(1, criteria.length),
      raw,
      percent: Math.round(raw * 100),
    }
  })

  const overall = computeCalibratedOverallScore(
    {
      rawOverall: computeWeightedCriterionAverage(criteria, scores),
      question: context.question,
      response: context.response,
      answerSupport: meta.answerSupport,
      criterionScores: scores,
      structuralScore: meta.structuralScore,
    },
    context.config,
  )
  const presentation = resolveQualityScorePresentation(overall.overallPercent)

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
    taskType: meta.taskType,
    overallRaw: overall.overallRaw,
    weakAnswerGate: overall.weakAnswerGate,
    overallAdjustedRaw: overall.overallAdjustedRaw,
    overallCalibrated: overall.overallCalibrated,
    overallPercent: overall.overallPercent,
    band: presentation.band,
    tone: presentation.tone,
    breakdown,
  }
}

function buildLoadingMessage(config: QualityScorerConfig) {
  const cacheEnabled = resolveBrowserCacheSetting(config)
  const modelKind = `${config.dtype} ${config.modelId}`

  if (config.modelSource.mode === 'huggingface') {
    return cacheEnabled
      ? `Loading ${modelKind} from the Hugging Face Hub. Browser cache is available.`
      : `Loading ${modelKind} from the Hugging Face Hub. Persistent browser cache is unavailable in this context.`
  }

  if (config.modelSource.mode === 'url') {
    return cacheEnabled
      ? `Loading ${modelKind} from the configured remote model host. Browser cache is available.`
      : `Loading ${modelKind} from the configured remote model host. Persistent browser cache is unavailable in this context.`
  }

  return cacheEnabled
    ? `Loading ${modelKind} from same-origin local assets.`
    : `Loading ${modelKind} from same-origin local assets. Browser cache is unavailable in this context, so files will load without persistent cache.`
}

function buildReadyMessage(config: QualityScorerConfig) {
  const cacheEnabled = resolveBrowserCacheSetting(config)

  if (config.modelSource.mode === 'huggingface') {
    return cacheEnabled
      ? `${config.dtype} model ready. Scoring now runs locally in-browser and Hugging Face assets can be cached.`
      : `${config.dtype} model ready. Scoring now runs locally in-browser, but persistent browser caching is unavailable in this context.`
  }

  if (config.modelSource.mode === 'url') {
    return cacheEnabled
      ? `${config.dtype} model ready. Scoring now runs locally in-browser and remote assets can be cached.`
      : `${config.dtype} model ready. Scoring now runs locally in-browser, but persistent browser caching is unavailable in this context.`
  }

  return cacheEnabled
    ? `${config.dtype} model ready. Scoring now runs locally in-browser from bundled files.`
    : `${config.dtype} model ready. Scoring now runs locally in-browser from bundled files, but this context does not support persistent browser caching.`
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown quality scorer error.'
}
