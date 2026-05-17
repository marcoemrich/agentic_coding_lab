# v6.5.4-refactor-cut-only — Changes vs v6.5.1-orchestration-audited

Derived from `v6.5.1-orchestration-audited`. Applies
**only** Finding-10 cut 10b (refactor.md mid-file
DO/DON'T) and keeps both 10a (refactor.md "Remember"
end-of-file) and 10c (red/SKILL.md DO/DON'T).

## Motivation

RQ-15 and RQ-16 together produced a counter-intuitive
result:

- The end-of-file "Remember" section in refactor.md is
  the Floor-Anker. v6.5.2 (cut) lost discipline; v6.5.3
  (kept) restored it.
- The mid-file refactor.md DO/DON'T (10b) appears to be
  dekorativ — both v6.5.2 and v6.5.3 cut it and both
  showed quality improvements (`cognitive_max` 4.0 / 3.5
  vs v6.5.1's 5.6).
- The red/SKILL.md DO/DON'T (10c) was assumed dekorativ
  too, but v6.5.3 (cut) showed `predictions_correct_rate`
  drop to 95.8 % (vs v6.5.1's 98.9 %, v6.5.2's 99.4 %).
  v6.5.2 cut the same block but its rate held because of
  a confounder (shorter cycles → fewer prediction
  opportunities).

v6.5.4 isolates: keep both Floor-Anker (10a "Remember")
AND prediction scaffolding (10c red/SKILL.md DO/DON'T),
remove only the mid-file refactor.md DO/DON'T (10b).

If the F-16.4 hypothesis is correct, v6.5.4 should
combine:
- v6.5.3's quality wins (`cognitive_max` ≤ 4)
- v6.5.1's prediction hygiene (≥ 98.9 %)
- v6.5.1's discipline floor (`tests_passed_immediately = 0`,
  `refactorings_applied ≥ 7`)

That would make v6.5.4 a clean Pareto-improvement over
v6.5.1 without the trade-offs of v6.5.2 (lost floor) or
v6.5.3 (lost pred-rate).

## Parser markers (MARKERS.md) — verified preserved

- Marker 1 `Skill ∈ {test-list, red, green}` — unchanged
- Marker 2 `Red Phase Complete` — unchanged
- Marker 3 `(Correct|Incorrect)` prediction lines — unchanged
- Marker 4 `experiment-done.txt` / `DONE` — unchanged

## Cuts applied

- **`refactor.md` "Important Guidelines" DO/DON'T**
  (−16 lines, mid-file) — DO bullets duplicate Mission
  items or Process steps; DON'T bullets invert
  Refactoring Rules, Process Step 3, or Mission item 5.
  RQ-15/16 showed this cut has no Floor effect and
  no pred-rate effect.

Net: `refactor.md` 270 → 254 lines.

## Cuts NOT applied (deliberately kept)

- **`refactor.md` "Remember" section** (8 lines,
  end-of-file) — kept as Floor-Anker. RQ-16 F-16.1
  confirmed: removing this drops `tests_passed_immediately`
  from 0/10 to 1/10 and floor `refactorings_applied`
  from 7 to 5.
- **`red/SKILL.md` "Important Guidelines" DO/DON'T**
  (kept) — prediction-hygiene scaffolding. RQ-16 F-16.4
  suggested removing this is the cause of v6.5.3's
  pred-rate drop to 95.8 %.

## Hypothesis

- **H1 (Quality wins from v6.5.3 transfer)**:
  `cognitive_max` and `cc_longest_function` within 1 σ
  of v6.5.3's 3.5 / 12.0 values. The cut that produced
  the quality wins (10b mid-file DO/DON'T) is still
  applied.
- **H2 (Discipline floor from v6.5.1/v6.5.3 holds)**:
  `tests_passed_immediately = 0/10`,
  `refactorings_applied ≥ 7` floor,
  σ `refactorings_applied` within 1.5× of v6.5.1's 0.42.
- **H3 (Prediction hygiene from v6.5.1 returns)**:
  `predictions_correct_rate` ≥ 98 %. If this holds,
  F-16.4 hypothesis is confirmed — 10c was the cause
  of v6.5.3's pred-rate drop.
- **H4 (Cost between v6.5.1 and v6.5.3)**: `total_tokens`
  in the 7.8–8.6 M range. The "Remember" section is
  kept, so deep refactor work persists; no large token
  reduction expected.
- **H5 (Correctness)**: 100 % tests_passing, 100 %
  verification_pct.

## Three possible outcomes

| Result | Interpretation | Promotion |
|---|---|---|
| All H1–H4 hold | v6.5.4 is the clean Pareto-improvement: quality + floor + pred-rate all wins, no regression | Promote v6.5.4 |
| H1 holds but H3 doesn't | Pred-rate drop in v6.5.3 had another cause (not 10c). Stay with v6.5.3 as quality champion or v6.5.1 as discipline champion | No new promotion |
| H1 doesn't hold | Quality wins required cutting both DO/DON'T blocks together (interaction effect). v6.5.3 stays as quality champion with documented pred-rate trade-off | Confirm v6.5.3 |

## Explicitly NOT changed

Everything else from v6.5.1-orchestration-audited remains
identical: skills layout, frontmatter, Mandatory Procedure
preamble, Wrong Predictions Are Data section, settings.json,
refactor.md decoupling, rationale additions, terminology.
