/// <reference lib="webworker" />

import { createTransformersQualityScorer } from './transformers-quality-scorer'
import { resolveQualityScorerConfig } from './defaults'
import type {
  QualityScorer,
  QualityWorkerEvent,
  QualityWorkerRequest,
} from './types'

export function registerQualityScorerWorker(scope: DedicatedWorkerGlobalScope = self as DedicatedWorkerGlobalScope) {
  let scorer: QualityScorer | null = null
  let serializedConfig = ''

  scope.onmessage = async (event: MessageEvent<QualityWorkerRequest>) => {
    const message = event.data

    switch (message.type) {
      case 'INIT_MODEL':
        try {
          const nextConfig = resolveQualityScorerConfig(message.config)

          if (!scorer || serializedConfig !== JSON.stringify(nextConfig)) {
            scorer = createTransformersQualityScorer(nextConfig)
            serializedConfig = JSON.stringify(nextConfig)
          }

          await scorer.loadModel({
            onStatus: (status) => post(scope, { type: 'MODEL_STATUS', ...status }),
            onProgress: (progress) => post(scope, { type: 'MODEL_PROGRESS', ...progress }),
          })
        } catch (error) {
          post(scope, {
            type: 'WORKER_ERROR',
            message: getErrorMessage(error),
          })
        }
        break

      case 'SCORE_RESPONSE':
        try {
          if (!scorer) {
            throw new Error('Model is not initialized. Call loadModel() before scoring.')
          }

          const result = await scorer.score(message.input, message.options)
          post(scope, {
            type: 'SCORE_RESULT',
            requestId: message.requestId,
            result,
          })
        } catch (error) {
          post(scope, {
            type: 'WORKER_ERROR',
            requestId: message.requestId,
            message: getErrorMessage(error),
          })
        }
        break
    }
  }
}

function post(scope: DedicatedWorkerGlobalScope, message: QualityWorkerEvent) {
  scope.postMessage(message)
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown quality worker error.'
}
