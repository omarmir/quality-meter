import { clampScore } from './scoring'

const CALIBRATION_FLOOR = 0.2
const MAX_CALIBRATION_BLEND = 0.5

export type CalibrationPoint = {
  raw: number
  target: number
  weight?: number
}

export type CalibrationCurve = {
  xs: number[]
  ys: number[]
}

export function fitIsotonicCalibration(points: CalibrationPoint[]): CalibrationCurve | null {
  const sortedPoints = points
    .filter((point) => Number.isFinite(point.raw) && Number.isFinite(point.target))
    .map((point) => ({
      raw: clampScore(point.raw),
      target: clampScore(point.target),
      weight: point.weight && Number.isFinite(point.weight) ? Math.max(0.0001, point.weight) : 1,
    }))
    .sort((left, right) => left.raw - right.raw)

  if (sortedPoints.length === 0) {
    return null
  }

  const blocks = sortedPoints.map((point) => ({
    minRaw: point.raw,
    maxRaw: point.raw,
    weightedTargetSum: point.target * point.weight,
    totalWeight: point.weight,
  }))

  for (let index = 0; index < blocks.length - 1; ) {
    const currentAverage = blocks[index].weightedTargetSum / blocks[index].totalWeight
    const nextAverage = blocks[index + 1].weightedTargetSum / blocks[index + 1].totalWeight

    if (currentAverage <= nextAverage) {
      index += 1
      continue
    }

    blocks[index] = {
      minRaw: blocks[index].minRaw,
      maxRaw: blocks[index + 1].maxRaw,
      weightedTargetSum: blocks[index].weightedTargetSum + blocks[index + 1].weightedTargetSum,
      totalWeight: blocks[index].totalWeight + blocks[index + 1].totalWeight,
    }
    blocks.splice(index + 1, 1)

    if (index > 0) {
      index -= 1
    }
  }

  const knots: Array<{ x: number; y: number }> = []

  for (const block of blocks) {
    const fittedValue = clampScore(block.weightedTargetSum / block.totalWeight)
    knots.push({ x: block.minRaw, y: fittedValue })

    if (block.maxRaw > block.minRaw) {
      knots.push({ x: block.maxRaw, y: fittedValue })
    }
  }

  const dedupedKnots = dedupeKnots(knots)

  return {
    xs: dedupedKnots.map((knot) => knot.x),
    ys: dedupedKnots.map((knot) => knot.y),
  }
}

export function applyCalibrationCurve(score: number, curve: CalibrationCurve) {
  const clampedScore = clampScore(score)

  if (clampedScore <= CALIBRATION_FLOOR) {
    return clampedScore
  }

  if (curve.xs.length === 0 || curve.ys.length === 0 || curve.xs.length !== curve.ys.length) {
    return clampedScore
  }

  if (curve.xs.length === 1) {
    return blendScore(clampedScore, curve.ys[0] ?? clampedScore)
  }

  if (clampedScore <= curve.xs[0]) {
    return blendScore(clampedScore, curve.ys[0] ?? clampedScore)
  }

  for (let index = 1; index < curve.xs.length; index += 1) {
    const leftX = curve.xs[index - 1] ?? 0
    const rightX = curve.xs[index] ?? 1
    const rightY = curve.ys[index] ?? clampedScore
    const leftY = curve.ys[index - 1] ?? rightY

    if (clampedScore <= rightX) {
      if (rightX <= leftX) {
        return blendScore(clampedScore, rightY)
      }

      const ratio = (clampedScore - leftX) / (rightX - leftX)
      return blendScore(clampedScore, leftY + ratio * (rightY - leftY))
    }
  }

  return blendScore(clampedScore, curve.ys[curve.ys.length - 1] ?? clampedScore)
}

function dedupeKnots(knots: Array<{ x: number; y: number }>) {
  const deduped: Array<{ x: number; y: number }> = []

  for (const knot of knots) {
    const previous = deduped[deduped.length - 1]

    if (!previous || previous.x !== knot.x) {
      deduped.push(knot)
      continue
    }

    previous.y = clampScore((previous.y + knot.y) / 2)
  }

  return deduped
}

function blendScore(rawScore: number, calibratedScore: number) {
  const blend = smoothstep(CALIBRATION_FLOOR, 0.9, rawScore) * MAX_CALIBRATION_BLEND
  return clampScore(rawScore * (1 - blend) + clampScore(calibratedScore) * blend)
}

function smoothstep(min: number, max: number, value: number) {
  if (max <= min) {
    return value >= max ? 1 : 0
  }

  const t = clampScore((value - min) / (max - min))
  return t * t * (3 - 2 * t)
}
