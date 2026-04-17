<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import {
  DEFAULT_ADAPTIVE_REFINEMENT_CONFIG,
  DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG,
  resolveQualityScorePresentation,
} from "@browser-quality-scorer/core"
import type {
  QualityModelProgressEvent,
  QualityRefinementPolicy,
  QualityScoreBand,
  QualityScorePresentationConfig,
  QualityRefinementDecision,
  QualityScoreMode,
  QualityScoreResult,
  QualityScoreTone,
  QualityScorerWorkerClient,
} from "@browser-quality-scorer/core"

type CriterionRow = {
  id: string
  label: string
  weight: number
}

let nextCriterionId = 4
let requestCounter = 0
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const localModelBasePath = `${import.meta.env.BASE_URL}models/`

const question = ref(
  "What does this funding agreement description say the funding is for, what targets it is expected to achieve, and how those targets will be delivered?",
)
const answer = ref(
  "This agreement provides $750,000 to expand youth employment support for unemployed people ages 18 to 24 in three rural communities. The funded program targets 300 participants, 180 completed training plans, and 120 job placements by March 31, 2027. The organization will achieve this through weekly job-readiness workshops, one-on-one case management, employer partnerships for placements, and monthly progress reviews against enrolment and placement targets.",
)
const criteria = ref<CriterionRow[]>([
  {
    id: "criterion-1",
    label: "States the concrete purpose of the funding, not just a general description of the agreement",
    weight: 4,
  },
  {
    id: "criterion-2",
    label: "Names the specific targets, outcomes, or deliverables the funding is meant to achieve",
    weight: 4,
  },
  {
    id: "criterion-3",
    label: "Explains the planned approach, activities, or delivery method for achieving those targets",
    weight: 2,
  },
])

const scorerClient = ref<QualityScorerWorkerClient | null>(null)
const modelPhase = ref<"idle" | "loading" | "ready" | "error">("idle")
const modelMessage = ref("Preparing the in-browser model.")
const modelProgress = ref<QualityModelProgressEvent | null>(null)
const isScoring = ref(false)
const scoringPhase = ref<"idle" | "fast" | "full">("idle")
const errorMessage = ref("")
const result = ref<QualityScoreResult | null>(null)
const scoreMode = ref<QualityScoreMode | null>(null)
const refinementDecision = ref<QualityRefinementDecision | null>(null)
const activeRequestId = ref<number | null>(null)
const queuedAutoScore = ref(false)
const isResultStale = ref(false)
const configurationPanelOpen = ref(false)

const refinementPolicy = ref<QualityRefinementPolicy>("adaptive")
const lowStopOverallPercent = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopOverallPercent)
const lowStopAnswerSupport = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopAnswerSupport)
const lowStopMaxCriterionPercent = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopMaxCriterionPercent)
const lowStopSecondaryOverallBuffer = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopSecondaryOverallBuffer)
const lowStopLowCriterionShare = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopLowCriterionShare)
const highStopOverallPercent = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.highStopOverallPercent)
const highStopMinCriterionPercent = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.highStopMinCriterionPercent)
const highStopSpreadPercent = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.highStopSpreadPercent)
const highStopWeakAnswerGate = ref(DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.highStopWeakAnswerGate)
const disableHighStopForConstraintQuestions = ref(
  DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.disableHighStopForConstraintQuestions,
)
const disableHighStopForComparison = ref(
  DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.disableHighStopForTaskTypes.includes("comparison"),
)
const disableHighStopForPlanning = ref(
  DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.disableHighStopForTaskTypes.includes("planning"),
)

const mixedFitMinPercent = ref(DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.mixedFitMinPercent)
const strongFitMinPercent = ref(DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.strongFitMinPercent)
const offTrackTone = ref<QualityScoreTone>(DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand.off_track)
const mixedFitTone = ref<QualityScoreTone>(DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand.mixed_fit)
const strongFitTone = ref<QualityScoreTone>(DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand.strong_fit)

const SCORE_LABELS: Record<QualityScoreBand, string> = {
  off_track: "Off track",
  mixed_fit: "Mixed fit",
  strong_fit: "Strong fit",
}

const SCORE_SUMMARIES: Record<QualityScoreBand, string> = {
  off_track: "The response needs more work to match the prompt.",
  mixed_fit: "The response is usable but some criteria remain under-supported.",
  strong_fit: "The response aligns well with the configured question and criteria.",
}

const normalizedCriteria = computed(() =>
  criteria.value
    .map((item) => ({
      label: item.label.trim(),
      weight: resolveCriterionWeight(item.weight),
    }))
    .filter((item) => item.label),
)
const adaptiveRequestConfig = computed(() => ({
  adaptiveRefinementPolicy: refinementPolicy.value,
  adaptiveRefinement: {
    lowStopOverallPercent: lowStopOverallPercent.value,
    lowStopAnswerSupport: lowStopAnswerSupport.value,
    lowStopMaxCriterionPercent: lowStopMaxCriterionPercent.value,
    lowStopSecondaryOverallBuffer: lowStopSecondaryOverallBuffer.value,
    lowStopLowCriterionShare: lowStopLowCriterionShare.value,
    highStopOverallPercent: highStopOverallPercent.value,
    highStopMinCriterionPercent: highStopMinCriterionPercent.value,
    highStopSpreadPercent: highStopSpreadPercent.value,
    highStopWeakAnswerGate: highStopWeakAnswerGate.value,
    disableHighStopForConstraintQuestions:
      disableHighStopForConstraintQuestions.value,
    disableHighStopForTaskTypes: [
      ...(disableHighStopForComparison.value ? ["comparison" as const] : []),
      ...(disableHighStopForPlanning.value ? ["planning" as const] : []),
    ],
  },
}))
const presentationConfig = computed<Partial<QualityScorePresentationConfig>>(() => ({
  mixedFitMinPercent: mixedFitMinPercent.value,
  strongFitMinPercent: strongFitMinPercent.value,
  toneByBand: {
    off_track: offTrackTone.value,
    mixed_fit: mixedFitTone.value,
    strong_fit: strongFitTone.value,
  },
}))
const requestConfig = computed(() => ({
  ...adaptiveRequestConfig.value,
  presentation: presentationConfig.value,
}))
const scoreAffectingSignature = computed(() =>
  [
    question.value.trim(),
    answer.value.trim(),
    normalizedCriteria.value
      .map((item) => `${item.label}\u0000${item.weight}`)
      .join("\u0001"),
    JSON.stringify(adaptiveRequestConfig.value),
  ].join("\u0001"),
)
const canScore = computed(
  () =>
    modelPhase.value === "ready" &&
    question.value.trim().length > 0 &&
    answer.value.trim().length > 0 &&
    normalizedCriteria.value.length > 0,
)
const overallPercent = computed(() => result.value?.overallPercent ?? null)
const displayedPresentation = computed(() =>
  overallPercent.value === null
    ? null
    : resolveQualityScorePresentation(overallPercent.value, presentationConfig.value),
)
const resolveEnglishBandLabel = (band: QualityScoreBand | null | undefined) =>
  band ? SCORE_LABELS[band] : ""
const resolveEnglishBandSummary = (band: QualityScoreBand | null | undefined) =>
  band ? SCORE_SUMMARIES[band] : ""

const gaugeSummary = computed(() => {
  if (errorMessage.value) return errorMessage.value
  if (isScoring.value && scoringPhase.value === "fast") {
    return "Running the quick pass for immediate feedback."
  }
  if (isScoring.value && scoringPhase.value === "full") {
    return "The fast pass looked ambiguous, so the full adaptive pass is refining the score."
  }
  if (result.value) {
    if (
      scoreMode.value === "fast" &&
      refinementDecision.value?.reason === "obvious_failure"
    ) {
      return `${resolveEnglishBandSummary(displayedPresentation.value?.band)} The adaptive gate skipped the full pass because the fast result already looked decisively off track.`
    }
    if (
      scoreMode.value === "fast" &&
      refinementDecision.value?.reason === "stable_strong"
    ) {
      return `${resolveEnglishBandSummary(displayedPresentation.value?.band)} The adaptive gate skipped the full pass because the fast result already looked stable at the top end.`
    }
    return resolveEnglishBandSummary(displayedPresentation.value?.band)
  }
  return "Scoring updates automatically after typing stops."
})
const statusIcon = computed(() => {
  switch (modelPhase.value) {
    case "ready":
      return "check"
    case "loading":
      return "sync"
    case "error":
      return "warning"
    default:
      return "idle"
  }
})
const statusTone = computed(() => {
  switch (modelPhase.value) {
    case "ready":
      return "text-green-500"
    case "loading":
      return "text-amber-400"
    case "error":
      return "text-rose-400"
    default:
      return "text-(--vp-c-text-2)"
  }
})
const bandTone = computed(() => {
  switch (displayedPresentation.value?.tone) {
    case "success":
      return "text-green-500"
    case "warning":
      return "text-amber-400"
    case "error":
      return "text-rose-400"
    default:
      return "text-(--vp-c-text-2)"
  }
})
const scoreButtonLabel = computed(() => {
  if (modelPhase.value === "loading") return "Loading model..."
  if (isScoring.value && scoringPhase.value === "fast") return "Quick pass..."
  if (isScoring.value && scoringPhase.value === "full") return "Refining..."
  return result.value ? "Rescore now" : "Score response"
})
const isRefiningAfterQuickPass = computed(
  () => isScoring.value && scoringPhase.value === "full" && scoreMode.value === "fast" && Boolean(result.value),
)
const isAnswerCalculating = computed(() => isScoring.value && (isResultStale.value || !result.value))
const modelProgressPercent = computed(() => {
  if (modelProgress.value?.total && modelProgress.value.total > 0) {
    return Math.max(
      0,
      Math.min(100, Math.round((modelProgress.value.loaded / modelProgress.value.total) * 100)),
    )
  }

  if (typeof modelProgress.value?.progress === "number") {
    return Math.max(0, Math.min(100, Math.round(modelProgress.value.progress)))
  }

  return 0
})
const modelProgressLabel = computed(() => {
  if (!modelProgress.value) return ""

  const loaded = formatBytes(modelProgress.value.loaded)
  const total = formatBytes(modelProgress.value.total)

  if (loaded && total) {
    return `${loaded} / ${total}`
  }

  if (total) {
    return total
  }

  return ""
})

onMounted(() => {
  void initializeScorer()
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  scorerClient.value?.terminate()
  scorerClient.value = null
})

watch(scoreAffectingSignature, () => {
  errorMessage.value = ""

  if (
    !question.value.trim() ||
    !answer.value.trim() ||
    normalizedCriteria.value.length === 0
  ) {
    result.value = null
    scoreMode.value = null
    refinementDecision.value = null
    isResultStale.value = false
    return
  }

  if (activeRequestId.value !== null) {
    activeRequestId.value = null
    queuedAutoScore.value = true
  }

  if (result.value) isResultStale.value = true
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    if (modelPhase.value !== "ready") return
    if (isScoring.value) {
      queuedAutoScore.value = true
      return
    }
    requestScore()
  }, 450)
})

watch(modelPhase, (phase) => {
  if (
    phase === "ready" &&
    !result.value &&
    question.value.trim() &&
    answer.value.trim() &&
    normalizedCriteria.value.length > 0
  ) {
    requestScore()
  }
})

function addCriterion() {
  criteria.value.push({ id: `criterion-${nextCriterionId++}`, label: "", weight: 1 })
}

function removeCriterion(id: string) {
  if (criteria.value.length === 1) return
  criteria.value = criteria.value.filter((item) => item.id !== id)
}

async function initializeScorer() {
  const { createQualityScorerWorkerClient } =
    await import("@browser-quality-scorer/core")

  scorerClient.value = createQualityScorerWorkerClient({
    config: {
      modelSource: {
        mode: "local",
        localModelPath: localModelBasePath,
        useBrowserCache: "auto",
      },
    },
    createWorker: () =>
      new Worker(new URL("./quality-scorer.worker.ts", import.meta.url), {
        type: "module",
      }),
    onModelStatus: (status) => {
      modelPhase.value = status.phase
      modelMessage.value = status.message

      if (status.phase === "loading" && !modelProgress.value) {
        modelProgress.value = { progress: 0, loaded: 0, total: 0 }
      }

      if (status.phase === "ready") {
        modelProgress.value = { progress: 100, loaded: modelProgress.value?.total ?? 0, total: modelProgress.value?.total ?? 0 }
      }
    },
    onModelProgress: (progress) => {
      modelProgress.value = progress
    },
  })

  await loadModel()
}

async function loadModel() {
  if (!scorerClient.value) return

  errorMessage.value = ""
  modelPhase.value = "loading"
  modelMessage.value = "Loading the in-browser model."
  modelProgress.value = { progress: 0, loaded: 0, total: 0 }

  try {
    await scorerClient.value.loadModel()
  } catch (error) {
    modelPhase.value = "error"
    modelMessage.value =
      error instanceof Error ? error.message : "The model could not be loaded."
    errorMessage.value = modelMessage.value
  }
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return ""

  const units = ["B", "KB", "MB", "GB"]
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  const digits = size >= 100 || unitIndex === 0 ? 0 : size >= 10 ? 1 : 2
  return `${size.toFixed(digits)} ${units[unitIndex]}`
}

function resolveCriterionWeight(weight: number) {
  return Number.isFinite(weight) && weight > 0 ? weight : 1
}

function scoreResponse() {
  requestScore()
}

function requestScore() {
  if (!scorerClient.value || !canScore.value) return

  errorMessage.value = ""
  isScoring.value = true
  scoringPhase.value = "fast"
  queuedAutoScore.value = false
  isResultStale.value = Boolean(result.value)
  requestCounter += 1
  activeRequestId.value = requestCounter
  void runScoreCycle(activeRequestId.value)
}

function flushQueuedAutoScore() {
  if (
    !queuedAutoScore.value ||
    modelPhase.value !== "ready" ||
    isScoring.value
  ) {
    return
  }

  queuedAutoScore.value = false
  requestScore()
}

async function runScoreCycle(requestId: number) {
  const client = scorerClient.value
  if (!client) {
    isScoring.value = false
    scoringPhase.value = "idle"
    activeRequestId.value = null
    return
  }

  const input = {
    question: question.value.trim(),
    response: answer.value.trim(),
    criteria: normalizedCriteria.value,
    config: requestConfig.value,
  }

  try {
    const { decideQualityRefinement } = await import("@browser-quality-scorer/core")

    const quickResult = await client.score(input, { mode: "fast" })

    if (requestId !== activeRequestId.value) {
      finalizeAbortedScoreCycle()
      return
    }

    const decision = decideQualityRefinement({
      fastResult: quickResult,
      question: input.question,
      response: input.response,
      criteria: input.criteria,
      requestConfig: input.config,
    })

    applyScoreResult(quickResult, "fast", decision)

    if (!decision.shouldRunFullPass) {
      finalizeCompletedScoreCycle(requestId)
      return
    }

    scoringPhase.value = "full"

    const fullResult = await client.score(input, { mode: "full" })

    if (requestId !== activeRequestId.value) {
      finalizeAbortedScoreCycle()
      return
    }

    applyScoreResult(fullResult, "full", decision)
    finalizeCompletedScoreCycle(requestId)
  } catch (error) {
    if (requestId !== activeRequestId.value && activeRequestId.value !== null) {
      return
    }

    errorMessage.value =
      error instanceof Error
        ? error.message
        : "The response could not be scored."
    isScoring.value = false
    scoringPhase.value = "idle"
    activeRequestId.value = null
    flushQueuedAutoScore()
  }
}

function finalizeCompletedScoreCycle(requestId: number) {
  if (requestId !== activeRequestId.value) return
  isScoring.value = false
  scoringPhase.value = "idle"
  activeRequestId.value = null
  flushQueuedAutoScore()
}

function finalizeAbortedScoreCycle() {
  if (activeRequestId.value !== null) return
  isScoring.value = false
  scoringPhase.value = "idle"
  flushQueuedAutoScore()
}

function applyScoreResult(
  nextResult: QualityScoreResult,
  nextMode: QualityScoreMode,
  nextDecision: QualityRefinementDecision | null,
) {
  result.value = nextResult
  scoreMode.value = nextMode
  refinementDecision.value = nextDecision
  isResultStale.value = false
}

function resetConfigurations() {
  refinementPolicy.value = "adaptive"
  lowStopOverallPercent.value = DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopOverallPercent
  lowStopAnswerSupport.value = DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopAnswerSupport
  lowStopMaxCriterionPercent.value = DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopMaxCriterionPercent
  lowStopSecondaryOverallBuffer.value =
    DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopSecondaryOverallBuffer
  lowStopLowCriterionShare.value = DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.lowStopLowCriterionShare
  highStopOverallPercent.value = DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.highStopOverallPercent
  highStopMinCriterionPercent.value = DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.highStopMinCriterionPercent
  highStopSpreadPercent.value = DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.highStopSpreadPercent
  highStopWeakAnswerGate.value = DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.highStopWeakAnswerGate
  disableHighStopForConstraintQuestions.value =
    DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.disableHighStopForConstraintQuestions
  disableHighStopForComparison.value =
    DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.disableHighStopForTaskTypes.includes("comparison")
  disableHighStopForPlanning.value =
    DEFAULT_ADAPTIVE_REFINEMENT_CONFIG.disableHighStopForTaskTypes.includes("planning")
  mixedFitMinPercent.value = DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.mixedFitMinPercent
  strongFitMinPercent.value = DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.strongFitMinPercent
  offTrackTone.value = DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand.off_track
  mixedFitTone.value = DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand.mixed_fit
  strongFitTone.value = DEFAULT_QUALITY_SCORE_PRESENTATION_CONFIG.toneByBand.strong_fit
}

function handleConfigurationToggle(event: Event) {
  configurationPanelOpen.value = (event.currentTarget as HTMLDetailsElement).open
}

function criterionTone(percent: number) {
  if (percent >= 70) return "success"
  if (percent >= 45) return "warning"
  return "error"
}
</script>

<template>
  <section class="[&_.header-anchor]:hidden">
    <section>
      <h2 class="mt-0! border-t-0! pt-0!">Example</h2>
      This example shows the quality scorer with an editable question, criteria
      list, criterion weights, fit gauge, and detailed scoring breakdown.
      <p>
        <span
          class="mr-2 inline-flex size-6 align-middle"
          :class="statusTone"
          aria-hidden="true">
          <svg
            v-if="statusIcon === 'check'"
            viewBox="0 0 24 24"
            fill="none"
            class="size-6 stroke-current [stroke-linecap:round] [stroke-linejoin:round] stroke-[1.8]">
            <path d="M5 12.5 9.2 16.7 19 7.5" />
          </svg>
          <svg
            v-else-if="statusIcon === 'sync'"
            viewBox="0 0 24 24"
            fill="none"
            class="size-6 stroke-current [stroke-linecap:round] [stroke-linejoin:round] stroke-[1.8]">
            <path d="M20 12a8 8 0 0 0-13.66-5.66M4 12a8 8 0 0 0 13.66 5.66" />
            <path d="M6.2 3.8v3.9h3.9M17.8 20.2v-3.9h-3.9" />
          </svg>
          <svg
            v-else-if="statusIcon === 'warning'"
            viewBox="0 0 24 24"
            fill="none"
            class="size-6 stroke-current [stroke-linecap:round] [stroke-linejoin:round] stroke-[1.8]">
            <path d="M12 4 21 20H3L12 4Z" />
            <path d="M12 9v5" />
            <path d="M12 17h.01" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            class="size-6 stroke-current [stroke-linecap:round] [stroke-linejoin:round] stroke-[1.8]">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l2.5 2.5" />
          </svg>
        </span>
        <strong>{{
          modelPhase === "ready"
            ? "Ready"
            : modelPhase === "loading"
              ? "Loading"
              : modelPhase === "error"
                ? "Error"
                : "Idle"
        }}</strong>
        {{ " " }}{{ modelMessage }}
      </p>
      <div v-if="modelPhase === 'loading' || modelProgressPercent > 0" class="mt-4">
        <div
          class="h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--vp-c-text-1)_10%,transparent)]">
          <div
            class="h-full rounded-full bg-[linear-gradient(90deg,var(--vp-c-brand-1),var(--vp-c-brand-2))] transition-[width] duration-300"
            :style="{ width: `${modelProgressPercent}%` }" />
        </div>
        <p class="mt-2 text-sm text-(--vp-c-text-2)">
          {{ modelProgressPercent }}%
          <span v-if="modelProgressLabel">{{ ` (${modelProgressLabel})` }}</span>
        </p>
      </div>
      <p v-if="modelPhase === 'error'">
        <button
          class="inline-flex min-h-11 items-center justify-center rounded-full border border-(--vp-button-brand-border) bg-(--vp-button-brand-bg) px-5 text-sm font-semibold text-(--vp-button-brand-text) transition-colors hover:border-(--vp-button-brand-hover-border) hover:bg-(--vp-button-brand-hover-bg)"
          type="button"
          @click="loadModel">
          Retry model load
        </button>
      </p>
    </section>

    <section>
      <h2>Question and criteria</h2>
      <textarea
        v-model="question"
        rows="4"
        class="w-full max-w-full rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition-colors placeholder:text-(--vp-c-text-3) focus:border-(--vp-c-brand-1)"
        placeholder="Ask the question the answer should satisfy." />

	      <div class="mt-4 flex items-center justify-between gap-4">
	        <h3 class="my-0 text-lg font-semibold">Criteria</h3>
	        <button
	          class="inline-flex min-h-11 items-center justify-center rounded-full border border-(--vp-button-brand-border) bg-(--vp-button-brand-bg) px-5 text-sm font-semibold text-(--vp-button-brand-text) transition-colors hover:border-(--vp-button-brand-hover-border) hover:bg-(--vp-button-brand-hover-bg)"
	          type="button"
	          @click="addCriterion">
	          Add criterion
	        </button>
	      </div>
	      <p class="mt-2 text-sm text-(--vp-c-text-2)">
	        Weights are relative. A criterion with weight 4 counts twice as much
	        toward the final overall score as one with weight 2.
	      </p>

	      <div class="mt-4 grid gap-3">
	        <div
	          v-for="(criterion, index) in criteria"
	          :key="criterion.id"
	          class="grid items-center gap-3 sm:grid-cols-[2rem_minmax(0,1fr)_6.5rem_auto]">
	          <span class="text-center text-(--vp-c-text-2)">{{ index + 1 }}</span>
	          <input
	            v-model="criterion.label"
	            class="w-full min-w-0 rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition-colors placeholder:text-(--vp-c-text-3) focus:border-(--vp-c-brand-1)"
	            type="text"
	            :placeholder="`Criterion ${index + 1}`" />
	          <input
	            v-model.number="criterion.weight"
	            aria-label="Criterion weight"
	            class="w-full min-w-0 rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-3 py-3 text-center text-(--vp-c-text-1) shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition-colors placeholder:text-(--vp-c-text-3) focus:border-(--vp-c-brand-1)"
	            type="number"
	            min="1"
	            step="1"
	            placeholder="1" />
	          <button
	            class="inline-flex min-h-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--vp-c-danger-1)_35%,var(--vp-c-divider))] bg-[color-mix(in_srgb,var(--vp-c-danger-1)_12%,var(--vp-c-bg-soft))] px-5 text-sm font-medium text-(--vp-c-danger-1) transition-colors hover:bg-[color-mix(in_srgb,var(--vp-c-danger-1)_18%,var(--vp-c-bg-soft))] disabled:cursor-not-allowed disabled:opacity-60 sm:justify-self-start"
	            type="button"
	            :disabled="criteria.length === 1"
	            @click="removeCriterion(criterion.id)">
	            Remove
	          </button>
	        </div>
	      </div>
    </section>

    <section>
      <h2>Answer</h2>
      <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_5rem]">
        <textarea
          v-model="answer"
          rows="10"
          class="min-h-68 w-full max-w-full rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition-colors placeholder:text-(--vp-c-text-3) focus:border-(--vp-c-brand-1)"
          placeholder="Paste the answer you want to score." />
        <div
          class="flex min-h-68 flex-col items-center justify-center rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-3 py-4">
          <div
            class="relative h-full min-h-60 w-3 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--vp-c-text-1)_10%,transparent)]"
            :class="isRefiningAfterQuickPass ? 'animate-pulse' : ''"
            aria-hidden="true">
            <div
              v-if="!isAnswerCalculating"
              class="absolute inset-x-0 bottom-0 rounded-full bg-[linear-gradient(180deg,rgba(62,175,124,0.95)_0%,rgba(231,167,59,0.95)_55%,rgba(224,108,117,0.95)_100%)]"
              :style="{ height: `${overallPercent ?? 0}%` }" />
          </div>
        </div>
      </div>
      <template v-if="isScoring && !result">
        <div
          class="mt-4 h-7 w-56 animate-pulse rounded-full bg-(--vp-c-bg-soft)" />
        <div
          class="mt-3 h-5 w-72 animate-pulse rounded-full bg-(--vp-c-bg-soft)" />
      </template>
      <p v-else class="text-lg font-medium" :class="isAnswerCalculating && !isRefiningAfterQuickPass ? 'text-(--vp-c-text-2)' : bandTone">
        {{ isAnswerCalculating && !isRefiningAfterQuickPass ? "Calculating" : resolveEnglishBandLabel(displayedPresentation?.band) || "No score yet" }}
        <span v-if="isRefiningAfterQuickPass" class="align-middle text-sm font-normal text-(--vp-c-text-2)">
          (<span class="inline-flex items-center gap-1 align-middle">
            <span
              class="h-1.5 w-1.5 animate-bounce rounded-full bg-(--vp-c-brand-1) [animation-delay:-0.2s]" />
            <span
              class="h-1.5 w-1.5 animate-bounce rounded-full bg-(--vp-c-brand-1) [animation-delay:-0.1s]" />
            <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-(--vp-c-brand-1)" />
            refining
          </span>)
        </span>
        <span v-else-if="scoreMode && !isAnswerCalculating" class="align-middle text-sm font-normal text-(--vp-c-text-2)">
          ({{ scoreMode === "fast" ? "Quick pass" : "Full pass" }})
        </span>
      </p>
      <p>
        <button
          class="inline-flex min-h-11 items-center justify-center rounded-full border border-(--vp-button-brand-border) bg-(--vp-button-brand-bg) px-5 text-sm font-semibold text-(--vp-button-brand-text) transition-colors hover:border-(--vp-button-brand-hover-border) hover:bg-(--vp-button-brand-hover-bg) disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          :disabled="!canScore || isScoring"
          @click="scoreResponse">
          {{ scoreButtonLabel }}
        </button>
      </p>
    </section>

    <section>
      <details
        class="rounded-2xl border border-(--vp-c-divider) bg-[color-mix(in_srgb,var(--vp-c-bg-soft)_86%,transparent)]"
        :open="configurationPanelOpen"
        @toggle="handleConfigurationToggle">
        <summary class="cursor-pointer list-none px-5 py-4 marker:hidden">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="my-0 text-lg font-semibold">Configurations</h2>
              <p class="mt-1 text-sm text-(--vp-c-text-2)">
                Refinement settings trigger rescoring. Display-band settings remap the current score instantly.
              </p>
            </div>
            <span class="text-sm text-(--vp-c-text-2)">
              {{ configurationPanelOpen ? "Collapse" : "Expand" }}
            </span>
          </div>
        </summary>

        <div class="border-t border-(--vp-c-divider) px-5 py-5">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p class="my-0 text-sm text-(--vp-c-text-2)">
              These values are passed with the score request instead of changing the worker’s global config.
            </p>
            <button
              class="inline-flex min-h-10 items-center justify-center rounded-full border border-(--vp-c-divider) bg-(--vp-c-bg-elv) px-4 text-sm font-medium text-(--vp-c-text-1) transition-colors hover:border-(--vp-c-brand-1) hover:text-(--vp-c-brand-1)"
              type="button"
              @click="resetConfigurations">
              Reset defaults
            </button>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <section>
              <h3 class="mt-0 text-base font-semibold">Adaptive refinement</h3>
              <p class="mt-1 text-sm text-(--vp-c-text-2)">
                Controls when the fast pass is accepted and when the full pass must still run.
              </p>

              <div class="mt-4 grid gap-3">
                <label class="grid gap-1.5">
                  <span class="text-sm font-medium">Policy</span>
                  <select
                    v-model="refinementPolicy"
                    class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)">
                    <option value="adaptive">Adaptive</option>
                    <option value="always">Always run full</option>
                    <option value="never">Fast only</option>
                  </select>
                </label>

                <div class="grid gap-3 sm:grid-cols-2">
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Low-stop overall %</span>
                    <input
                      v-model.number="lowStopOverallPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Low-stop answer support</span>
                    <input
                      v-model.number="lowStopAnswerSupport"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Low-stop max criterion %</span>
                    <input
                      v-model.number="lowStopMaxCriterionPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Secondary overall buffer</span>
                    <input
                      v-model.number="lowStopSecondaryOverallBuffer"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Low-criterion share</span>
                    <input
                      v-model.number="lowStopLowCriterionShare"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">High-stop overall %</span>
                    <input
                      v-model.number="highStopOverallPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">High-stop min criterion %</span>
                    <input
                      v-model.number="highStopMinCriterionPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">High-stop spread %</span>
                    <input
                      v-model.number="highStopSpreadPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">High-stop weak-answer gate</span>
                    <input
                      v-model.number="highStopWeakAnswerGate"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                </div>

                <label class="inline-flex items-center gap-3 rounded-xl border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3">
                  <input
                    v-model="disableHighStopForConstraintQuestions"
                    type="checkbox"
                    class="size-4 rounded border-(--vp-c-divider)" />
                  <span class="text-sm">Disable high-stop for constraint-sensitive questions</span>
                </label>
                <label class="inline-flex items-center gap-3 rounded-xl border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3">
                  <input
                    v-model="disableHighStopForComparison"
                    type="checkbox"
                    class="size-4 rounded border-(--vp-c-divider)" />
                  <span class="text-sm">Disable high-stop for comparison tasks</span>
                </label>
                <label class="inline-flex items-center gap-3 rounded-xl border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3">
                  <input
                    v-model="disableHighStopForPlanning"
                    type="checkbox"
                    class="size-4 rounded border-(--vp-c-divider)" />
                  <span class="text-sm">Disable high-stop for planning tasks</span>
                </label>
              </div>
            </section>

            <section>
              <h3 class="mt-0 text-base font-semibold">Display bands</h3>
              <p class="mt-1 text-sm text-(--vp-c-text-2)">
                These remap the current overall percent into band and tone output without rerunning the model.
              </p>

              <div class="mt-4 grid gap-3">
                <div class="grid gap-3 sm:grid-cols-2">
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Mixed-fit minimum %</span>
                    <input
                      v-model.number="mixedFitMinPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Strong-fit minimum %</span>
                    <input
                      v-model.number="strongFitMinPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)" />
                  </label>
                </div>

                <div class="grid gap-3 sm:grid-cols-3">
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Off-track tone</span>
                    <select
                      v-model="offTrackTone"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)">
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                    </select>
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Mixed-fit tone</span>
                    <select
                      v-model="mixedFitTone"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)">
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                    </select>
                  </label>
                  <label class="grid gap-1.5">
                    <span class="text-sm font-medium">Strong-fit tone</span>
                    <select
                      v-model="strongFitTone"
                      class="rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) px-4 py-3 text-(--vp-c-text-1) outline-none transition-colors focus:border-(--vp-c-brand-1)">
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                    </select>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </details>
    </section>

    <section>
      <h2>Detailed scoring</h2>
      <template v-if="isScoring && !result">
        <div
          class="mt-4 h-10 w-64 animate-pulse rounded-full bg-(--vp-c-bg-soft)" />
        <div class="mt-4 space-y-3">
          <div
            class="h-5 w-full animate-pulse rounded-full bg-(--vp-c-bg-soft)" />
          <div
            class="h-5 w-full animate-pulse rounded-full bg-(--vp-c-bg-soft)" />
          <div
            class="h-5 w-2/3 animate-pulse rounded-full bg-(--vp-c-bg-soft)" />
        </div>
      </template>
      <template v-else-if="result">
        <div :class="isRefiningAfterQuickPass ? 'animate-pulse' : ''">
          <p class="flex items-baseline gap-3">
            <strong class="text-4xl leading-none"
              >{{ result.overallPercent }}%</strong
            >
            <span class="text-lg font-medium" :class="bandTone">
              {{ resolveEnglishBandLabel(displayedPresentation?.band) || "Scored" }}
            </span>
            <span
              v-if="isRefiningAfterQuickPass"
              class="align-middle text-sm font-normal text-(--vp-c-text-2)">
              (<span class="inline-flex items-center gap-1 align-middle">
                <span
                  class="h-1.5 w-1.5 animate-bounce rounded-full bg-(--vp-c-brand-1) [animation-delay:-0.2s]" />
                <span
                  class="h-1.5 w-1.5 animate-bounce rounded-full bg-(--vp-c-brand-1) [animation-delay:-0.1s]" />
                <span
                  class="h-1.5 w-1.5 animate-bounce rounded-full bg-(--vp-c-brand-1)" />
                refining
              </span>)
            </span>
            <span v-else-if="scoreMode" class="text-(--vp-c-text-2)">
              ({{ scoreMode === "fast" ? "Quick pass" : "Full pass" }})
            </span>
          </p>
          <dl class="my-4 space-y-1.5">
            <div class="flex justify-between gap-4">
              <dt>Answer support</dt>
              <dd>{{ Math.round(result.answerSupport * 100) }}%</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt>Weak-answer gate</dt>
              <dd>{{ Math.round(result.weakAnswerGate * 100) }}%</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt>Topic alignment</dt>
              <dd>{{ Math.round(result.topicAlignment * 100) }}%</dd>
            </div>
            <div v-if="scoreMode" class="flex justify-between gap-4">
              <dt>Current pass</dt>
              <dd>{{ scoreMode === "fast" ? "Fast" : "Full" }}</dd>
            </div>
          </dl>

	          <div v-for="item in result.breakdown" :key="item.label" class="mt-4">
	            <div class="flex items-center justify-between gap-4">
	              <strong>{{ item.label }}</strong>
	              <span>{{ item.percent }}%</span>
	            </div>
	            <p class="mt-1 text-sm text-(--vp-c-text-2)">
	              Weight {{ Math.round(item.weightShare * 100) }}% of overall
	              (raw {{ item.weight }})
	            </p>
	            <div
	              class="mt-1.5 h-3 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--vp-c-text-1)_10%,transparent)]">
	              <div
	                class="h-full rounded-full"
	                :class="
                  criterionTone(item.percent) === 'success'
                    ? 'bg-[linear-gradient(90deg,#279d6a,#7fd6a8)]'
                    : criterionTone(item.percent) === 'warning'
                      ? 'bg-[linear-gradient(90deg,#c47b24,#edbd67)]'
                      : 'bg-[linear-gradient(90deg,#c54e4c,#f0a5a0)]'
                "
                :style="{ width: `${item.percent}%` }" />
            </div>
          </div>
        </div>
      </template>
      <p v-else>
        {{
          isScoring
            ? "The model is evaluating the answer against each criterion."
            : "Run the scorer to populate the fit gauge and detailed criterion breakdown."
        }}
      </p>
      <p v-if="errorMessage" class="text-rose-400">{{ errorMessage }}</p>
    </section>
  </section>
</template>
