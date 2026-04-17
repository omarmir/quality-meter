import { describe, expect, test } from 'bun:test'
import { computeTopicAlignment, computeTopicAlignmentGate } from './scoring'

describe('computeTopicAlignment', () => {
  const question =
    'What does this funding agreement description say the funding is for, what targets it is expected to achieve, and how those targets will be delivered?'
  const criteria = [
    'States the concrete purpose of the funding, not just a general description of the agreement',
    'Names the specific targets, outcomes, or deliverables the funding is meant to achieve',
    'Explains the planned approach, activities, or delivery method for achieving those targets',
  ]

  test('returns very low alignment for obvious off-topic answers', () => {
    const response =
      'Start with the router placement before buying new hardware. Move it into an open, central spot away from thick walls and microwaves.'

    expect(computeTopicAlignment(question, response, criteria)).toBe(0)
  })

  test('returns strong alignment for on-topic funding summaries', () => {
    const response =
      'This agreement provides $750,000 to expand youth employment support in three rural communities and targets 300 participants, 180 completed training plans, and 120 job placements through workshops, case management, and employer partnerships.'

    expect(computeTopicAlignment(question, response, criteria)).toBeGreaterThan(0)
  })
})

describe('computeTopicAlignmentGate', () => {
  test('strongly suppresses high-confidence scores when topic alignment is absent', () => {
    const gate = computeTopicAlignmentGate(0, 0.9, [0.95, 0.92, 0.94])

    expect(gate).toBeLessThan(0.15)
  })

  test('keeps the gate open when topic alignment is strong', () => {
    const gate = computeTopicAlignmentGate(1, 0.9, [0.95, 0.92, 0.94])

    expect(gate).toBe(1)
  })
})
