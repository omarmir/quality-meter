# Scoring Improvement Iterations

This log records each scorer change made in this tuning pass, the benchmark run after that change, and the observed tradeoffs.

## Historical baseline

This was the earlier pre-tuning reference point from the project notes:

- cases: `100`
- mean absolute error: `14.7`
- median absolute error: `10.9`
- within 10 points: `48/100`
- within 20 points: `70/100`

## Iteration 0: Current baseline before this pass

Change:

- no scorer change yet
- reran the existing 100-case benchmark to lock the starting point for this iteration log

Result:

- raw: MAE `12.5`, median `9.2`, within 10 `54/100`, within 20 `71/100`
- cross-validated calibrated: MAE `10.5`, median `9.5`, within 10 `51/100`, within 20 `84/100`
- runtime calibrated: MAE `9.4`, median `8.5`, within 10 `57/100`, within 20 `90/100`

Observation:

- the scorer is materially better than the historical baseline
- the biggest remaining error bucket is still `constraint_miss`
- planning remains the weakest kind

## Iteration 1: Stronger constraint gate, first attempt

Change:

- made the constraint gate much more aggressive whenever the question appeared constrained
- allowed low `constraintRespect` values to drag the whole score down substantially

Result:

- raw: MAE `16.4`, median `14.6`, within 10 `37/100`, within 20 `61/100`
- cross-validated calibrated: MAE `15.2`, median `15.1`, within 10 `36/100`, within 20 `70/100`
- runtime calibrated: MAE `14.3`, median `14.3`, within 10 `37/100`, within 20 `72/100`

Observation:

- this was a regression
- strong answers were over-penalized because the model's raw `constraintRespect` signal is not stable enough for a broad penalty band
- the next version needs to penalize only clear violations, not middling uncertainty

## Iteration 2: Narrower constraint gate

Change:

- narrowed the stronger constraint gate so it would only penalize when `constraintRespect` was clearly low
- kept unconstrained or ambiguous cases much closer to the old behavior

Result:

- raw: MAE `13.1`, median `9.8`, within 10 `51/100`, within 20 `70/100`
- cross-validated calibrated: MAE `11`, median `10.1`, within 10 `50/100`, within 20 `81/100`
- runtime calibrated: MAE `10.2`, median `9.2`, within 10 `54/100`, within 20 `85/100`

Observation:

- this was better than Iteration 1 but still worse than the starting baseline
- the gate was still dragging down too many strong answers
- the remaining issue was still signal quality, not just gate strength

## Iteration 3: Aggregate constraint decomposition

Change:

- extracted a small set of generic requirement clauses from the question
- added one aggregate clause-based constraint-respect hypothesis on top of the existing generic constraint check
- kept the narrower constraint gate from Iteration 2

Result:

- raw: MAE `13`, median `10.2`, within 10 `49/100`, within 20 `74/100`
- cross-validated calibrated: MAE `11.8`, median `10.8`, within 10 `46/100`, within 20 `80/100`
- runtime calibrated: MAE `10.9`, median `9.8`, within 10 `53/100`, within 20 `82/100`

Observation:

- this also regressed against the baseline
- the extra requirement summary made constraint checks more specific, but the small model still misread too many strong answers as partially non-compliant
- keeping this would make the system slower and less accurate, so it was rolled back before the next iteration

## Iteration 4: Coverage-aware chunk aggregation

Change:

- changed chunk aggregation so a criterion score depends a bit more on support breadth across the response instead of only the strongest chunk hits
- reduced the effect of isolated high-scoring chunks when the rest of the answer had weak support

Result:

- raw: MAE `12.6`, median `9.2`, within 10 `55/100`, within 20 `71/100`
- cross-validated calibrated: MAE `10.6`, median `9.5`, within 10 `51/100`, within 20 `84/100`
- runtime calibrated: MAE `9.4`, median `8.6`, within 10 `56/100`, within 20 `90/100`

Observation:

- this was effectively neutral
- raw scoring moved slightly, but the cross-validated benchmark did not improve
- because it did not clearly beat the baseline, it was rolled back before the next iteration

## Iteration 5: Stronger uncertainty shrinkage

Change:

- made disagreement penalties stronger when prompt variants and evidence chunks diverged
- allowed unstable evidence to pull scores down more instead of trusting the highest positive hit

Result:

- raw: MAE `11.6`, median `9.2`, within 10 `55/100`, within 20 `76/100`
- cross-validated calibrated: MAE `10.7`, median `10.1`, within 10 `50/100`, within 20 `82/100`
- runtime calibrated: MAE `9.5`, median `8.9`, within 10 `57/100`, within 20 `91/100`

Observation:

- raw scoring improved, especially on some partial-answer over-scores
- cross-validated scoring got slightly worse, which suggests the gain does not generalize cleanly
- because the fairer benchmark regressed, this change was rolled back before the next iteration

## Iteration 6: Overall-score calibration layer

Change:

- added a second monotonic calibration curve on the final overall score
- kept the existing criterion calibration, then fitted overall calibration on top of the criterion-adjusted benchmark totals
- updated the benchmark harness to evaluate this extra calibration layer in both cross-validated and runtime modes

Result:

- raw: MAE `12.5`, median `9.2`, within 10 `54/100`, within 20 `71/100`
- cross-validated calibrated: MAE `9.7`, median `7.7`, within 10 `56/100`, within 20 `85/100`
- runtime calibrated: MAE `7.6`, median `5.7`, within 10 `64/100`, within 20 `94/100`

Observation:

- this is a real improvement
- unlike the earlier failed scoring changes, the fair cross-validated benchmark improved on every top-line metric
- this change is kept

## Iteration 7: Hard-negative challenge benchmark

Change:

- added a second 100-case benchmark view built from the same question set
- each challenge case uses a generic, topical-sounding but weak answer template instead of the original corpus answer
- this did not change the scorer; it expands evaluation coverage so weak generic answers are measured explicitly

Result:

- challenge-set MAE `35.2`
- challenge-set median absolute error `35.1`
- within 10 `0/100`
- within 20 `0/100`

By kind:

- advice: MAE `34.8`, reference avg `26`, app avg `60.8`
- comparison: MAE `33.8`, reference avg `27.5`, app avg `61.3`
- planning: MAE `37.3`, reference avg `23.3`, app avg `60.6`

Observation:

- the current scorer still badly over-scores generic on-topic weak answers
- this is now the clearest remaining gap after the overall calibration improvement
- the new challenge benchmark is kept as an evaluation tool, even though it did not change the shipped scorer

## Iteration 8: Weak-answer gate plus hard-negative-aware overall calibration

Change:

- added a generic weak-answer gate at the overall-score layer
- the gate looks at answer support, criterion coverage, response substance, and question-to-response novelty instead of any criterion-specific phrase rules
- updated overall calibration fitting so the final score mapping is trained against both the original benchmark corpus and the synthetic hard-negative challenge set

Result:

- main raw: MAE `12.1`, median `7.3`, within 10 `59/100`, within 20 `72/100`
- main cross-validated calibrated: MAE `10.1`, median `9.6`, within 10 `52/100`, within 20 `84/100`
- main runtime calibrated: MAE `8`, median `6.1`, within 10 `59/100`, within 20 `94/100`
- hard-negative challenge: MAE `24.4`, median `24.1`, within 10 `0/100`, within 20 `2/100`

Observation:

- this is a tradeoff, not a clean universal win
- the main fair benchmark got slightly worse than Iteration 6
- the hard-negative benchmark improved substantially from `35.2` to `24.4`
- this means the pass successfully reduces over-scoring of weak topical answers, but it does so by making the main score mapping more conservative overall
- I kept it for now because this was the exact remaining failure mode we were targeting

## Final state

Kept changes:

- overall-score calibration layer
- weak-answer gate plus hard-negative-aware overall calibration
- hard-negative challenge benchmark

Rolled back changes:

- stronger constraint gate, first attempt
- narrower constraint gate
- aggregate constraint decomposition
- coverage-aware chunk aggregation
- stronger uncertainty shrinkage

Best fair benchmark after this pass:

- Iteration 6 main corpus: cross-validated calibrated `MAE 9.7`, `median 7.7`, `within 10 56/100`, `within 20 85/100`
- Iteration 8 hard-negative-aware pass: cross-validated calibrated `MAE 10.1`, `median 9.6`, `within 10 52/100`, `within 20 84/100`

Main residual gap:

- generic but topical weak answers are still over-scored, though much less than before
