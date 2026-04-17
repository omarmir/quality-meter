import { DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG } from './defaults'
import type { QualityScoreBand, QualityScorePresentationConfig, QualityScoreTone } from './types'

export type QualityScorePresentation = {
  band: QualityScoreBand
  tone: QualityScoreTone
}

export const QUALITY_SCORE_BANDS = [
  'off_track',
  'mixed_fit',
  'strong_fit'
] as const satisfies readonly QualityScoreBand[]

export const QUALITY_SCORE_TONE_BY_BAND: Record<QualityScoreBand, QualityScoreTone> = {
  ...DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand,
}

/**
 * Resolves display-oriented quality band metadata from an overall percentage.
 */
export function resolveQualityScorePresentation(
  overallPercent: number,
  config: Partial<QualityScorePresentationConfig> = {},
): QualityScorePresentation {
  const resolvedConfig: QualityScorePresentationConfig = {
    ...DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG,
    ...config,
    toneByBand: {
      ...DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand,
      ...(config.toneByBand ?? {}),
    },
  }

  if (overallPercent >= resolvedConfig.strongFitMinPercent) {
    return {
      band: 'strong_fit',
      tone: resolvedConfig.toneByBand.strong_fit
    }
  }

  if (overallPercent >= resolvedConfig.mixedFitMinPercent) {
    return {
      band: 'mixed_fit',
      tone: resolvedConfig.toneByBand.mixed_fit
    }
  }

  return {
    band: 'off_track',
    tone: resolvedConfig.toneByBand.off_track
  }
}
