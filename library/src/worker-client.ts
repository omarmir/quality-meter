import { estimateQualityContextBudget, resolveQualityScorerConfig } from './defaults'
import type {
  QualityScoreOptions,
  QualityScoreResult,
  QualityScorerWorkerClient,
  QualityScorerWorkerClientOptions,
  QualityWorkerEvent,
  QualityWorkerRequest,
} from './types'

type PendingScoreRequest = {
  resolve: (result: QualityScoreResult) => void
  reject: (error: Error) => void
}

export function createQualityScorerWorkerClient(options: QualityScorerWorkerClientOptions): QualityScorerWorkerClient {
  let config = resolveQualityScorerConfig(options.config)
  let worker = options.createWorker()
  let requestCounter = 0
  let pendingLoad: { resolve: () => void; reject: (error: Error) => void } | null = null
  const pendingScores = new Map<string, PendingScoreRequest>()

  worker.addEventListener('message', handleWorkerMessage)
  worker.addEventListener('error', handleWorkerCrash)

  return {
    async loadModel(nextConfig) {
      if (nextConfig) {
        config = resolveQualityScorerConfig(nextConfig)
      }

      if (pendingLoad) {
        return new Promise<void>((resolve, reject) => {
          const currentPending = pendingLoad!
          pendingLoad = {
            resolve: () => {
              currentPending.resolve()
              resolve()
            },
            reject: (error) => {
              currentPending.reject(error)
              reject(error)
            },
          }
        })
      }

      return new Promise<void>((resolve, reject) => {
        pendingLoad = { resolve, reject }
        post({ type: 'INIT_MODEL', config })
      })
    },

    async score(input, options: QualityScoreOptions = {}) {
      const requestId = createRequestId()

      return new Promise<QualityScoreResult>((resolve, reject) => {
        pendingScores.set(requestId, { resolve, reject })
        post({
          type: 'SCORE_RESPONSE',
          requestId,
          input,
          options,
        })
      })
    },

    estimateBudget(input) {
      return estimateQualityContextBudget(input, config)
    },

    async reset(nextConfig = config) {
      worker.removeEventListener('message', handleWorkerMessage)
      worker.removeEventListener('error', handleWorkerCrash)
      worker.terminate()
      worker = options.createWorker()
      worker.addEventListener('message', handleWorkerMessage)
      worker.addEventListener('error', handleWorkerCrash)
      pendingLoad = null
      pendingScores.clear()
      config = resolveQualityScorerConfig(nextConfig)
      await new Promise<void>((resolve, reject) => {
        pendingLoad = { resolve, reject }
        post({ type: 'INIT_MODEL', config })
      })
    },

    terminate() {
      worker.removeEventListener('message', handleWorkerMessage)
      worker.removeEventListener('error', handleWorkerCrash)
      worker.terminate()
      failAllPending('The quality scorer worker was terminated.')
    },

    getConfig() {
      return config
    },
  }

  function createRequestId() {
    requestCounter += 1
    return `quality-score-${requestCounter}`
  }

  function post(message: QualityWorkerRequest) {
    worker.postMessage(message)
  }

  function handleWorkerMessage(event: MessageEvent<QualityWorkerEvent>) {
    const message = event.data

    switch (message.type) {
      case 'MODEL_STATUS':
        options.onModelStatus?.({
          phase: message.phase,
          message: message.message,
        })

        if (message.phase === 'ready') {
          pendingLoad?.resolve()
          pendingLoad = null
        } else if (message.phase === 'error') {
          const error = new Error(message.message)
          pendingLoad?.reject(error)
          pendingLoad = null
        }
        break

      case 'MODEL_PROGRESS':
        options.onModelProgress?.({
          progress: message.progress,
          loaded: message.loaded,
          total: message.total,
          file: message.file,
        })
        break

      case 'SCORE_RESULT': {
        const pending = pendingScores.get(message.requestId)

        if (!pending) {
          break
        }

        pendingScores.delete(message.requestId)
        pending.resolve(message.result)
        break
      }

      case 'WORKER_ERROR': {
        const error = new Error(message.message)

        if (message.requestId) {
          const pending = pendingScores.get(message.requestId)

          if (pending) {
            pendingScores.delete(message.requestId)
            pending.reject(error)
            break
          }
        }

        pendingLoad?.reject(error)
        pendingLoad = null
        failAllPending(message.message)
        break
      }
    }
  }

  function handleWorkerCrash() {
    failAllPending('The quality scorer worker crashed.')
    pendingLoad?.reject(new Error('The quality scorer worker crashed.'))
    pendingLoad = null
  }

  function failAllPending(message: string) {
    for (const [requestId, pending] of pendingScores.entries()) {
      pending.reject(new Error(message))
      pendingScores.delete(requestId)
    }
  }
}
