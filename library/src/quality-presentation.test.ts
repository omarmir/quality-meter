import { describe, expect, test } from 'bun:test'
import { resolveQualityScorePresentation } from './quality-presentation'

describe('resolveQualityScorePresentation', () => {
  test('returns the off-track presentation for low scores', () => {
    expect(resolveQualityScorePresentation(22)).toEqual({
      band: 'off_track',
      tone: 'error'
    })
  })

  test('returns the mixed-fit presentation for mid-band scores', () => {
    expect(resolveQualityScorePresentation(55)).toEqual({
      band: 'mixed_fit',
      tone: 'warning'
    })
  })

  test('returns the strong-fit presentation for high scores', () => {
    expect(resolveQualityScorePresentation(82)).toEqual({
      band: 'strong_fit',
      tone: 'success'
    })
  })
})
