import type {
  QualityLocalizedText,
  QualityScoreBand,
  QualityScoreTone,
} from './types'

export type QualityScorePresentation = {
  band: QualityScoreBand
  tone: QualityScoreTone
  label: QualityLocalizedText
  summary: QualityLocalizedText
}

const QUALITY_SCORE_PRESENTATIONS: QualityScorePresentation[] = [
  {
    band: 'off_track',
    tone: 'error',
    label: {
      en: 'Off track',
      fr: 'Hors trajectoire',
    },
    summary: {
      en: 'The response needs more work to match the prompt.',
      fr: 'La reponse doit etre retravaillee pour mieux repondre a la consigne.',
    },
  },
  {
    band: 'mixed_fit',
    tone: 'warning',
    label: {
      en: 'Mixed fit',
      fr: 'Adequation partielle',
    },
    summary: {
      en: 'The response is usable but some criteria remain under-supported.',
      fr: 'La reponse est utilisable, mais certains criteres demeurent insuffisamment couverts.',
    },
  },
  {
    band: 'strong_fit',
    tone: 'success',
    label: {
      en: 'Strong fit',
      fr: 'Bonne adequation',
    },
    summary: {
      en: 'The response aligns well with the configured question and criteria.',
      fr: 'La reponse correspond bien a la question et aux criteres configures.',
    },
  },
]

/**
 * Resolves display-oriented quality band metadata from an overall percentage.
 */
export function resolveQualityScorePresentation(overallPercent: number): QualityScorePresentation {
  if (overallPercent >= 70) {
    return QUALITY_SCORE_PRESENTATIONS[2]!
  }

  if (overallPercent >= 45) {
    return QUALITY_SCORE_PRESENTATIONS[1]!
  }

  return QUALITY_SCORE_PRESENTATIONS[0]!
}

