# RQ-model-quality-cursor — Findings

Model effect on code quality and TDD discipline over the **cursor-cli harness**
(`cursor-agent`), kata `game-of-life-example-mapping`, workflow
`v6.2.1-phase-continuation-cursor`. n=5 per cell.

**Coverage is partial.** The `opus-cursor` cell is empty: the Cursor Pro plan's
monthly Opus allowance was exhausted on 2026-07-28 (`ActionRequiredError`,
resets 2026-08-02). H1 (Anthropic anchor) and the Opus half of H2 are therefore
**not yet answerable**. The two cells below are complete and internally valid.

Model IDs: `composer-cursor` → `composer-2.5`, `grok-cursor` →
`cursor-grok-4.5-medium`, `opus-cursor` → `claude-opus-4-8-medium` (pending).

All 10 runs delegate refactoring to an isolated subagent
(`marker_source: subagent-calls`, zero `## Refactor` text markers) — this is the
first cursor data measured under the corrected architecture.

## Overview

Code-quality metrics **lower = better**; correctness and TDD-discipline metrics
**higher = better**. All cells reach 100 % correctness, so quality trophies are
not correctness-gated here.

| Metric (direction) | composer-cursor | grok-cursor | opus-cursor |
|---|---:|---:|---:|
| Code Mass (APP) `code_mass` (↓) | 211.2 | **151.6** 🏆 | pending |
| Production LoC `lines_of_code` (↓) | 68.2 | **39.2** 🏆 | pending |
| `cognitive_max` (Complexity Peak, ↓) | **7.8** 🏆 | 9.2 | pending |
| `cognitive_avg` (↓) | **4.97** 🏆 | 7.9 | pending |
| `mccabe_max` (↓) | **6.2** 🏆 | 7.8 | pending |
| `mccabe_avg` (↓) | **2.4** 🏆 | 3.47 | pending |
| `cc_longest_function` (↓) | 25.4 | **21.8** 🏆 | pending |
| `cc_median_loc_per_function` (↓) | **3.3** 🏆 | 8.2 | pending |
| Smell Total `smell_total` (↓) | **3.0** 🏆 | **2.8** 🏆 | pending |
| Correctness (internal) `tests_passing` (↑) | **100 %** 🏆 | **100 %** 🏆 | pending |
| Correctness (external) `verification_pct` (↑) | **100 %** 🏆 | **100 %** 🏆 | pending |
| `refactorings_applied` (↑) | 3.6 | **5.0** 🏆 | pending |
| `duration_seconds` (↓) | **331** 🏆 | 585 | pending |
| `total_tokens` (↓) | **1.13 M** 🏆 | 1.33 M | pending |

`smell_total` carries two trophies: 3.0 vs 2.8 at σ ≈ 0.7–0.8 is well inside one
σ — no meaningful winner. `cost_usd` is empty for all runs; the cursor-cli path
(Cursor subscription) reports no per-run cost.

---

## F-1.1 — Parsimony and low complexity come apart, and they swap sides

The two models split cleanly across two opposing quality axes.

| Axis | composer | grok | Δ / σ |
|---|---:|---:|---|
| Production LoC (↓) | 68.2 | **39.2** 🏆 | 29 pts, σ 11.7 / 4.3 → > 2σ |
| Code Mass (APP) (↓) | 211.2 | **151.6** 🏆 | 60 pts, σ ≈ 24 both → > 2σ |
| `cognitive_avg` (↓) | **4.97** 🏆 | 7.9 | 2.9 pts, σ 3.7 / 2.4 → < 1σ |
| `mccabe_avg` (↓) | **2.4** 🏆 | 3.47 | 1.1 pts, σ ≈ 0.9 both → ≈ 1σ |

Grok wins volume decisively (both > 2σ). Composer wins the complexity axis, but
only weakly — `cognitive_avg` is inside one σ and `mccabe_avg` sits right at it.

The one sharp structural difference is `cc_median_loc_per_function`: composer
3.3 vs grok 8.2 (σ 0.27 / 3.63). Composer decomposes into many very small
functions; grok writes fewer, longer ones. That single choice explains both
columns — many small functions raise total LoC and mass while lowering
per-function complexity.

Only the volume axis is resolved. The complexity axis is within noise at n=5 and
needs more replicates before either model can be called the low-complexity
choice.

---

## F-1.2 — Grok refactors more, and both models are perfectly correct

`refactorings_applied`: grok 5.0 (σ 0.71) vs composer 3.6 (σ 1.52) — about 1σ,
a real but modest lead. Grok also runs more cycles (8.4 vs 7.4) on marginally
fewer tests (7.8 vs 8.4).

Correctness does not discriminate: **both cells are 100 % on both measures**
(`tests_passing`, `verification_pct`), σ = 0 throughout. On this kata the
cursor-cli harness is not correctness-limiting for either model, so the quality
metrics above are a clean signal rather than a by-product of failure.

Grok pays for its extra work in time and tokens: 585 s vs 331 s, 1.33 M vs
1.13 M tokens. Composer is the cheaper and faster model at equal correctness.

---

## F-1.3 — Composer under-uses the prediction markers; its 100 % rate is a ceiling artifact

`predictions_correct` equals `predictions_total` in **every one of the 10 runs** —
not one `Incorrect` line anywhere in the transcripts. The prediction-accuracy
metric therefore carries no signal on this kata; it is at ceiling for both
models and must not be read as "both models predict perfectly well".

What does differ is marker **density**:

| model | preds / cycle | `Red Phase Complete` gates per `## Red` |
|---|---:|---|
| composer-cursor | 0.5 – 1.2 | ≈ 1 |
| grok-cursor | 1.45 – 2.29 | ≈ 2 |

The workflow contract expects two prediction lines per red phase (compilation +
runtime). Grok is close to compliant; composer emits roughly half, skipping the
block on many cycles.

So the raw `predictions_total` gap (14.8 vs 6.4) measures **marker compliance,
not TDD discipline**. Composer reaches the same correctness with fewer explicit
predictions. This is the same decoupling seen on pi/oc: marker usage and result
quality are independent axes.

---

## Caveats

- **Opus cell missing** — the RQ is 2 of 3 cells. No cross-harness Anthropic
  anchor (H1) and no Opus/Composer comparison (H2) until after 2026-08-02.
- **Wide within-cell variance.** Composer's `cognitive_max` spans 2–12 across
  five replicates (σ 4.27). Differences under ~1σ in this RQ should be treated
  as unresolved, not as small effects.
- **Separate tariff.** Cost runs through the Cursor subscription, not Requesty
  (pi/OC) or the Anthropic list price (CC), and `cost_usd` is empty. No
  cross-harness cost comparison from this RQ.
- **Routing/harness confound.** All cells run cursor-cli with the cursor
  workflow. No 1:1 transfer of these model values to RQ-model-quality (CC),
  -oc or -pi.
- `verification_pct` mirrors `tests_passing` here — game-of-life has no separate
  external suite; the correctness anchor is `tests_passing` (internal).
