import type { QualityScoreBand, QualityScoreTone } from './types'

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
  off_track: 'error',
  mixed_fit: 'warning',
  strong_fit: 'success'
}

/**
 * Resolves display-oriented quality band metadata from an overall percentage.
 */
export function resolveQualityScorePresentation(overallPercent: number): QualityScorePresentation {
  if (overallPercent >= 70) {
    return {
      band: 'strong_fit',
      tone: QUALITY_SCORE_TONE_BY_BAND.strong_fit
    }
  }

  if (overallPercent >= 45) {
    return {
      band: 'mixed_fit',
      tone: QUALITY_SCORE_TONE_BY_BAND.mixed_fit
    }
  }

  return {
    band: 'off_track',
    tone: QUALITY_SCORE_TONE_BY_BAND.off_track
  }
}
