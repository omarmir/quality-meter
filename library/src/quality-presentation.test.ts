import { describe, expect, test } from 'bun:test'
import { resolveQualityScorePresentation } from './quality-presentation'

describe('resolveQualityScorePresentation', () => {
  test('returns the off-track presentation for low scores', () => {
    expect(resolveQualityScorePresentation(22)).toEqual({
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
    })
  })

  test('returns the mixed-fit presentation for mid-band scores', () => {
    expect(resolveQualityScorePresentation(55)).toEqual({
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
    })
  })

  test('returns the strong-fit presentation for high scores', () => {
    expect(resolveQualityScorePresentation(82)).toEqual({
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
    })
  })
})

