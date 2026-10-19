# RQ-end-refactor-opus48 — Findings

Does the exact-hybrid-v5-end-refactor-cc result from RQ-1.12 hold on **Opus 4.8 (no-thinking)**: does correctness stay intact, does the end-refactor pass deliver at least hybrid-v4 code quality, does the bundle-break pattern from RQ-1.9/RQ-1.10 (self-termination, `verification_pct` collapse) appear on the new model — and does the **kata asymmetry** from F-1.12.2 reproduce (the end pass works on multi-file codebases, is noise on single-file libraries)?

Data: 30 runs, `example-mapping`, `opus-4-8-no-thinking` (direct API). Per kata 5 hybrid-v4 + 5 hybrid-v4.4 + 5 v6.5. Source: [summary.md](summary.md), [runs.csv](runs.csv).

**Methodology note:** The two katas are **never averaged** (claim-office Code Mass (APP) ~870 vs game-of-life ~168) — each has its own block, and the workflow comparison happens exclusively *within* a kata.

## Overview

`cognitive_max` as the primary code quality indicator (lower = better). 🏆 = best value per kata (spread ≥ 1 σ).

| Kata | hybrid-v4 (baseline) | hybrid-v4.4 (per-cycle) | hybrid-v5 (end-refactor) |
|---|---:|---:|---:|
| claim-office | 3.4 | 3.6 | **2.8** 🏆 |
| game-of-life | 5.6 | 3.2 | **2.4** 🏆 |

On **both** katas hybrid-v5 has the lowest `cognitive_max`. On claim-office hybrid-v4.4 (3.6) does not get below the hybrid-v4 baseline (3.4) (no per-cycle gain); on game-of-life `cognitive_max` falls monotonically hybrid-v4 → hybrid-v4.4 → v6.5. The ranking therefore diverges from the 4.7 study (RQ-1.12, where hybrid-v4.4 was the robust peak winner) — the effective refactor lever is model-dependent too.

---

## Kata claim-office (multi-file CLI codebase: cli.ts + domain.ts)

Trophy 🏆 = best value in the column (spread ≥ 1 σ); ties all get one. Correctness gating: quality/cost trophies only for cells with mean `verification_pct ≥ 0.90`. hybrid-v4 has 1/5 runs with `verification_pct = 0` (a CLI contract break, see F-1.13.2), mean 0.80 — it is therefore excluded from the quality and cost trophies; its values stand for context.

### Correctness (higher = better; primary)

| Workflow | `verification_pct` (rate %) | `tests_passing %` | `completed_within_budget %` |
|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 80 | **100** 🏆 | **100** 🏆 |
| exact-hybrid-v4.4-metric-refactor-cc | **100** 🏆 | **100** 🏆 | **100** 🏆 |
| exact-hybrid-v5-end-refactor-cc | **100** 🏆 | **100** 🏆 | **100** 🏆 |

- `verification_pct` is rate-based here (the share of runs with pct = 1.0). hybrid-v4: 4/5 perfect, 1/5 at 0.0 (mean 0.80). hybrid-v4.4 and hybrid-v5: 5/5 perfect.
- Only `ok` runs count as replicates, so every counted run finished within budget.

### Code quality (lower = better)

| Workflow | `cognitive_max` | `mccabe_max` | `longest_function` | `avg_loc_per_function` | `code_mass` | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 3.4 | 3.8 | 21.2 | 4.19 | 882.2 | 1.0 |
| exact-hybrid-v4.4-metric-refactor-cc | 3.6 | 4.0 | **15.6** 🏆 | 4.44 | **843** 🏆 | **0.0** 🏆 |
| exact-hybrid-v5-end-refactor-cc | **2.8** 🏆 | **3.2** 🏆 | 16.0 | **3.81** 🏆 | 872.6 | **0.0** 🏆 |

- `mccabe_avg` (1.51 / 1.48 / 1.47) and `smell_complexity` (0/0/0) are practically identical across all three workflows — no trophy, omitted from the table.
- `longest_function`: hybrid-v4.4 (15.6) and hybrid-v5 (16.0) are within 1 σ of each other; both below hybrid-v4 (21.2, σ 8.87).

### Cost (lower = better)

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) |
|---|---:|---:|
| exact-hybrid-v4-cleaned-cc | 3196 | 95.6 M |
| exact-hybrid-v4.4-metric-refactor-cc | **3064** 🏆 | **99.3 M** 🏆 |
| exact-hybrid-v5-end-refactor-cc | **3221** 🏆 | **98.4 M** 🏆 |

- All three token means sit within 3.7 M of each other at σ 14–35 M, and all three wallclock means within 160 s at σ 378–1010 s — a dead heat on both axes. The eligible cells (hybrid-v4.4, hybrid-v5) therefore both carry the trophy; hybrid-v4 is gated out (see above) and would not change the reading.

---

## Kata game-of-life (single-file library, no cross-file lever)

All 15 runs green (`tests_passing` 5/5, `verification_pct` 1.0, `completed_within_budget` 5/5 per workflow) — no correctness gating needed, no trace of a bundle break. 🏆 = best value per column (spread ≥ 1 σ).

### Code quality (lower = better)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `longest_function` | `avg_loc_per_function` | `code_mass` | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 5.6 | 3.87 | 5.0 | 11.8 | 4.89 | 171.8 | 2.0 |
| exact-hybrid-v4.4-metric-refactor-cc | 3.2 | 2.7 | **3.6** 🏆 | **8.6** 🏆 | 4.75 | **164.2** 🏆 | **0.0** 🏆 |
| exact-hybrid-v5-end-refactor-cc | **2.4** 🏆 | **2.1** 🏆 | **3.4** 🏆 | 9.4 | 4.76 | 168.4 | **0.0** 🏆 |

- `cognitive_max` 5.6 → 3.2 → 2.4 falls monotonically; the v6.5 lead over hybrid-v4 is ≈ 2.3 σ (robust).
- `mccabe_max` 3.6 vs 3.4 (hybrid-v4.4/hybrid-v5) are within 1 σ of each other; both below hybrid-v4 (5.0, σ 1.41).
- `code_mass` 171.8 / 164.2 / 168.4: all within 1 σ (σ 10–19) — on the small library there is **no** Code Mass (APP) difference between the workflows.
- `avg_loc_per_function` 4.89 / 4.75 / 4.76: practically identical.

### Cost (lower = better)

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) | σ tokens |
|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | **579** 🏆 | **9.0 M** 🏆 | 2.2 M |
| exact-hybrid-v4.4-metric-refactor-cc | 679 | 11.4 M | 1.9 M |
| exact-hybrid-v5-end-refactor-cc | 747 | 11.6 M | 1.6 M |

- Costs rise monotonically with refactor intensity: hybrid-v5 +29 % wallclock / +30 % tokens, hybrid-v4.4 +17 % / +27 % against hybrid-v4. The refactor surcharge is robust (spread > 1 σ).

---

## F-1.13.1 — exact-hybrid-v5-end-refactor-cc preserves correctness on Opus 4.8; the core RQ-1.12 result replicates

The additional end-refactor pass damages correctness on **neither** kata. All 5/5 v6.5 runs per kata pass all internal vitest tests and reach `verification_pct = 1.0`; on claim-office all 5/5 write `experiment-done.txt`. The bundle-break pattern documented in RQ-1.9 / RQ-1.10 (self-termination after <½ the baseline cycles, `verification_pct` collapse with internal tests intact) does **not** occur on the new model.

| Kata | Workflow | n | tests_passing | verification_pct (perfect/n) | completed_within_budget |
|---|---|---:|:-:|:-:|:-:|
| claim-office | exact-hybrid-v4-cleaned-cc | 5 | 5/5 | 4/5 (+1 CLI contract break) | 5/5 |
| claim-office | exact-hybrid-v4.4-metric-refactor-cc | 5 | 5/5 | 5/5 | 5/5 |
| claim-office | exact-hybrid-v5-end-refactor-cc | 5 | 5/5 | **5/5** | 5/5 |
| game-of-life | exact-hybrid-v4-cleaned-cc | 5 | 5/5 | 5/5 | 5/5 |
| game-of-life | exact-hybrid-v4.4-metric-refactor-cc | 5 | 5/5 | 5/5 | 5/5 |
| game-of-life | exact-hybrid-v5-end-refactor-cc | 5 | 5/5 | **5/5** | 5/5 |

Plausibility: the end-refactor pass runs outside the TDD cycle dynamics with stable tests as a safety net; a refactoring that turned the tests red would be immediately visible on the CLI verification path. On 4.8 hybrid-v5 matches the RQ-1.12 observation on 4.7 (5/5 there too, verification_pct 0.99). hybrid-v5's `cycle_count` variance is particularly tight on 4.8 (claim-office σ 1.79, 36–40 cycles; GoL σ 0.55, 8–9 cycles) — the workflow stabilizes the cycle count rather than aborting early. On GoL the end pass fires in every run (211–256 `end-refactor` calls in the transcript) without touching correctness.

---

## F-1.13.2 — On Opus 4.8 the bare hybrid-v4 baseline is less robust than hybrid-v4.4/hybrid-v5; one CLI contract break from bypassing the workflow

This finding is claim-office-specific: the CLI contract is only checked there against an external verification suite. On game-of-life (vitest-internal, no CLI entry point) all 15 runs are perfect, hybrid-v4 included — the baseline weakness shows up only against the external CLI contract.

Unlike hybrid-v4.4 and hybrid-v5 (5/5 perfect each), hybrid-v4 has one non-perfect run on claim-office × 4.8:

- **CLI contract break (`verification_pct = 0.0`):** The CLI builds (`cli_built = true`), but the agent built `src/cli.ts` with a self-invented `operation` dispatch field in the input schema. The verification suite sends the agreed schema without `operation` → all 15 scenarios answer `Unknown operation: undefined`, exit 1. The internal tests (`quote`/`claim` directly) stay green (`tests_passing = true`), only the external CLI contract is missed. In the transcript the agent justifies this explicitly: *"this was a plain file-creation/wiring task, not a TDD cycle, so I created it directly rather than going through the red/green/refactor skills"* — it deliberately wrote the CLI entry point outside the TDD workflow and guessed the contract wrong in the process.

| Workflow | perfect | CLI contract break | tests_passing |
|---|:-:|:-:|:-:|
| exact-hybrid-v4-cleaned-cc | 4/5 | 1/5 | 5/5 |
| exact-hybrid-v4.4-metric-refactor-cc | 5/5 | 0/5 | 5/5 |
| exact-hybrid-v5-end-refactor-cc | 5/5 | 0/5 | 5/5 |

Plausibility: hybrid-v4.4 and hybrid-v5 inherit the same per-cycle part as hybrid-v4 but add a deterministic measurement/refactor step on the code (hybrid-v4.4 per cycle, hybrid-v5 at the end) that touches the whole `src/` tree once more — including `cli.ts`. This additional whole-src contact can correct the faulty CLI contract before the run ends. hybrid-v4 lacks that second look. At n=5 this is a single data point and not a defensible rate — but the pattern (4.8 takes liberties in CLI wiring that the contract does not allow) matches the model-dependent drift that RQ-1.13 was set up for.

---

## F-1.13.3 — Metric-driven refactor is worth it on both katas; hybrid-v5 leads on `cognitive_max`, hybrid-v4.4/hybrid-v5 are otherwise level — no workflow is strictly better

Both refactor variants push the `cognitive_max` below the hybrid-v4 baseline, on both katas — **metric-driven refactor is worth it**. But "strictly better on all quality metrics" holds for neither of them:

**claim-office (multi-file):**

| Metric | hybrid-v4 | hybrid-v4.4 | hybrid-v5 | reading |
|---|---:|---:|---:|---|
| `cognitive_max` | 3.4 | 3.6 | **2.8** | hybrid-v4.4 not below hybrid-v4 (no per-cycle gain!); hybrid-v5 ahead |
| `mccabe_max` | 3.8 | 4.0 | **3.2** | hybrid-v5 ahead (σ 0–0.45) |
| `longest_function` | 21.2 | **15.6** | 16.0 | hybrid-v4.4 ≈ hybrid-v5, both below hybrid-v4 |
| `avg_loc_per_function` | 4.19 | 4.44 | **3.81** | hybrid-v5 ahead |
| `code_mass` | 882.2 | **843** | 872.6 | within σ (53–98) — weak |
| `smell_total` | 1.0 | **0.0** | **0.0** | hybrid-v4.4 = hybrid-v5 |

**game-of-life (single-file):**

| Metric | hybrid-v4 | hybrid-v4.4 | hybrid-v5 | reading |
|---|---:|---:|---:|---|
| `cognitive_max` | 5.6 | 3.2 | **2.4** | falls monotonically; hybrid-v5 ≈ 2.3 σ below hybrid-v4 (robust) |
| `cognitive_avg` | 3.87 | 2.7 | **2.1** | falls monotonically |
| `mccabe_max` | 5.0 | **3.6** | **3.4** | hybrid-v4.4 ≈ hybrid-v5, both ≪ hybrid-v4 |
| `longest_function` | 11.8 | **8.6** | 9.4 | hybrid-v4.4 ≈ hybrid-v5 |
| `code_mass` | 171.8 | **164.2** | 168.4 | within σ (10–19) — no difference |
| `smell_total` | 2.0 | **0.0** | **0.0** | hybrid-v4.4 = hybrid-v5 |

Two points at which the presumption "hybrid-v4.4/hybrid-v5 strictly better than hybrid-v4" breaks:

1. **`code_mass`**: on both katas all three workflows sit within 1 σ — the refactor buys **no** lower Code Mass (APP). (On 4.7/GoL hybrid-v4 even won here; on 4.8 it is a tie.)
2. **`cognitive_max` on claim-office**: hybrid-v4.4 (3.6) does **not** get below hybrid-v4 (3.4) — the per-cycle refactor does not lower the `cognitive_max` on the multi-file kata at all; only hybrid-v5 (2.8) does, and only narrowly.

Robust and cross-kata are only `smell_total` = 0 (hybrid-v4.4/hybrid-v5 deterministically clean against hybrid-v4's residual smells of 1.0 / 2.0) and v6.5's `cognitive_max`/`mccabe_max` lead. The ranking diverges from 4.7 (RQ-1.12): there hybrid-v4.4 was the robust peak winner on both katas, here it is hybrid-v5 — the effective refactor lever is model-dependent.

---

## F-1.13.4 — Cost is kata-dependent: on claim-office all three within σ, on game-of-life rising monotonically with refactor intensity

**claim-office** — unlike on 4.7 (where hybrid-v4.4 needed ~2.4× as many tokens as hybrid-v4/hybrid-v5), all three sit close together:

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) | σ tokens |
|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 3196 | 95.6 M | 34.7 M |
| exact-hybrid-v4.4-metric-refactor-cc | 3064 | 99.3 M | 34.0 M |
| exact-hybrid-v5-end-refactor-cc | 3221 | 98.4 M | 13.8 M |

On claim-office the v6.5 end pass produces **no** notable token surcharge over hybrid-v4 (+3 % in the mean, clearly within σ) and is level with it on wallclock (3221 vs 3196 s). v6.4's 4.7 token penalty (~2.4×) does **not** replicate on 4.8 — 4.8 evidently performs the per-cycle measurements far more token-frugally. hybrid-v5 also has by far the tightest token and wallclock variance (σ 13.8 M; wallclock σ 378 s), i.e. the most predictable costs of the three.

**game-of-life** — on the small library, by contrast, costs rise monotonically and robustly (spread > 1 σ):

| Workflow | `duration_seconds` (mean) | `total_tokens` (mean) | vs hybrid-v4 |
|---|---:|---:|---|
| exact-hybrid-v4-cleaned-cc | 579 | 9.0 M | — |
| exact-hybrid-v4.4-metric-refactor-cc | 679 | 11.4 M | +17 % s / +27 % tok |
| exact-hybrid-v5-end-refactor-cc | 747 | 11.6 M | +29 % s / +30 % tok |

On GoL the refactor therefore pays a clear surcharge — and the end pass (hybrid-v5) is the most expensive here on both axes, for a complexity gain that sits within σ of hybrid-v4.4. The missing cost spread on claim-office follows from the per-cycle dynamics dominating there (~35–41 cycles) plus high run-to-run variance, which makes the refactor surcharge vanish into the noise.

---

## F-1.13.5 — TDD discipline intact on 4.8 for all three workflows, on both katas

The cycle metrics confirm that the per-cycle part runs cleanly on 4.8:

| Kata | Metric | hybrid-v4 | hybrid-v4.4 | hybrid-v5 |
|---|---|---:|---:|---:|
| claim-office | `cycle_count` | 37.8 | 40.8 | 37.8 |
| claim-office | `refactorings_applied` | 35.5 | 25.8 | 28.0 |
| claim-office | `predictions_correct_rate` | 99.7 % | 99.8 % | 99.5 % |
| claim-office | `tests_passed_immediately` | 18.5 | 12.0 | 11.2 |
| game-of-life | `cycle_count` | 8.8 | 9.0 | 8.4 |
| game-of-life | `refactorings_applied` | 5.6 | 7.6 | 7.2 |
| game-of-life | `predictions_correct_rate` | 98.6 % | 100 % | 97.6 % |
| game-of-life | `tests_passed_immediately` | 3.8 | 0.0 | 0.8 |

`predictions_correct_rate` sits at ~97.6–100 % (pooled) on both katas — Opus 4.8 hits its red-phase predictions near-perfectly. On claim-office hybrid-v5 has the tightest `cycle_count` variance (σ 1.79), the hybrid-v4 variance is the largest (σ 8.85), driven by the CLI-break run (25 cycles). `cycle_count`, `refactorings_applied` and `tests_passed_immediately` are the legacy counters; the most recent hybrid-v4 run carries only the phase-chain metrics, so the hybrid-v4 claim-office values rest on n=4 (`predictions_correct_rate` on all 5). The per-cycle part of hybrid-v5 is byte-identical to hybrid-v4, and the cycle counts confirm it (GoL 8.4 vs 8.8, claim-office 37.8 vs 37.8). No demotivation of the per-cycle refactor from knowing about the end pass is detectable.

---

## F-1.13.6 — No global v6.5 promotion on 4.8; the F-1.12.2 kata asymmetry replicates only partly

Taken together across both katas:

| Axis | claim-office (multi-file) | game-of-life (single-file) |
|---|---|---|
| best complexity workflow | hybrid-v5 (`cognitive_max` 2.8); hybrid-v4.4 not below hybrid-v4 | hybrid-v5 (2.4), monotonic hybrid-v4 > hybrid-v4.4 > hybrid-v5 |
| end-pass added value (hybrid-v5 vs hybrid-v4.4) | narrowly ahead on `cognitive_max`/`mccabe_max` | narrowly ahead on `cognitive_max`, otherwise equal within σ |
| Code Mass (APP) | all three within σ | all three within σ |
| correctness | held (hybrid-v5/hybrid-v4.4 5/5; hybrid-v4 4/5) | held (all 5/5) |
| cost | all three within σ | rising monotonically; hybrid-v5 most expensive |

On both katas hybrid-v4.4/hybrid-v5 beat the hybrid-v4 baseline on `cognitive_max` and on `smell_total` — **metric-driven refactor is worth it** and does not break correctness. But no arm is a global winner, and hybrid-v5 is **not** a general replacement for hybrid-v4:

- The **end pass hybrid-v5** has the lowest `cognitive_max` on both katas on 4.8 — unlike on 4.7, where it was pure noise on the single-file GoL library (F-1.12.2). The kata asymmetry found there therefore replicates **only partly**: the `cognitive_max` gain survives on 4.8 on GoL too (2.4 vs 5.6, ≈ 2.3 σ). What does **not** survive is a Code Mass (APP) advantage — on 4.7/claim-office that was the actual end-pass added value (−11 % cross-file consolidation), and on 4.8 `code_mass` sits in the σ noise on both katas. The specific cross-file lever is therefore no longer detectable on 4.8; what remains is a general reduction in complexity.
- The **per-cycle refactor hybrid-v4.4** loses its 4.7 special role on 4.8: on claim-office it does not lower `cognitive_max` against hybrid-v4 at all (3.6 vs 3.4), and on GoL it stays behind v6.5.
- **hybrid-v4** remains the most parsimonious choice when minimal Code Mass (APP)/cost takes priority (especially on GoL, where hybrid-v4 has the lowest costs) — but it is the least robust on claim-office (CLI contract break, F-1.13.2).

The recommendation remains task-/model-dependent and joins the recurring "kata-dependent recommendation" pattern (cf. RQ-1.4, RQ-1.8/1.9, F-1.12.5): no refactor workflow generalizes cleanly across kata types **and** models.

---

## Operational lessons (non-RQ findings)

- **opus-4-8 direct API: a transient Portkey 400 on the first call.** The v6.5 smoke run initially died on `API Error: 400 Either x-portkey-config or x-portkey-provider header is required` (exit 1, no `429` → not captured by the run-batch.sh retry). An identical repeat run went through cleanly; two further opus-4-8 runs the same day were green as well. The 400 is transient/config-dependent, not a deterministic model or routing defect. The `MODEL_CONFIGS` comment in `run-batch.sh` ("Env vars blanked → native OAuth") is out of date — opus-4-8 in fact goes through the same Portkey `.env` route as 4.7, just with a bare model label. Downstream risk: a 400 in a multi-run batch is simply lost (no auto-retry). To avoid that, add `400 x-portkey-config` to the run-batch.sh transient detection.
- **TDD markers live in `metrics.json` under `summary_metrics`, not under `final_metrics`.** `final_metrics.cycle_count`/`.refactorings_applied`/`.predictions_*` do not exist as keys at all — `final_metrics` carries only code/correctness metrics (lines_of_code, code_mass, cognitive_*, mccabe_*, tests_passing, verification_*). The TDD discipline fields sit in the sibling block `summary_metrics` (cycle_count, refactorings_applied, predictions_correct/total), and `aggregate-by-query.py` reads them correctly from there (`sm = metrics.get("summary_metrics")`). That is the normal state (the 4.7 runs from RQ-1.12 show it too), not a bug — a spot-check that queries `jq .final_metrics.cycle_count` wrongly gets `null` and looks like a silent zero metric; the correct query is `jq .summary_metrics.cycle_count`.
- **Routing confounding relative to RQ-1.12:** opus-4-8 (direct API) and the RQ-1.12 numbers (opus-4-7 Portkey/Vertex-EU) share no cell. Cross-RQ comparisons of absolute values (e.g. hybrid-v5 code_mass 780 on 4.7 vs 872 on 4.8) are routing- AND model-confounded and are to be read as context only, not as a pure model effect.
