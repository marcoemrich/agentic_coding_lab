# RQ-end-refactor-v62 — Findings

Does a metric-driven refactor pass deliver a code quality gain over the hybrid-v4 per-cycle baseline — and does the lever work better **continuously** (hybrid-v4.4 per-cycle) or as a **one-off whole-src end pass** (hybrid-v5)? Tested on two kata types: the multi-file CLI codebase **claim-office** (cli.ts + domain.ts) and the single-file library **game-of-life**.

Data: 43 runs, `example-mapping`, opus-4-7. Source: [summary.md](summary.md), [runs.csv](runs.csv).

**Methodology note:** The two katas are **never averaged** (claim-office Code Mass (APP) ~800 vs game-of-life ~160) — each has its own block, and the workflow comparison happens exclusively *within* a kata. opus-4-7 ran over two routings (portkey/native), treated as the same model: code quality and correctness are routing-invariant, `duration_seconds`/`total_tokens` are not (hardware/caching) → costs separated per routing, cost trophies only within the same routing.

## Overview

Complexity Peak `cognitive_max` as the primary code quality indicator (lower = better). 🏆 = best value per kata (spread ≥ 1 σ).

| Kata | hybrid-v4 (baseline) | hybrid-v4.4 (per-cycle) | hybrid-v5 (end-refactor) |
|---|---:|---:|---:|
| claim-office | 5.0 | **2.4** 🏆 | 2.8 |
| game-of-life | 4.0 | **2.2** 🏆 | 3.0 |

On **both** katas the per-cycle refactor hybrid-v4.4 lowers the Complexity Peak furthest. hybrid-v5 sits in between — close to hybrid-v4.4 on claim-office, close to the baseline on GoL (F-1.12.1 / F-1.12.2).

---

## Kata claim-office (multi-file CLI codebase: cli.ts + domain.ts)

### Code quality (lower = better)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `mccabe_avg` | `cc_longest_function` | `cc_avg_loc_per_function` | Code Mass (APP) | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 5.00 | 1.91 | 4.50 | 1.53 | 12.4 | 4.22 | 878.5 | 0.38 |
| exact-hybrid-v4.4-metric-refactor-cc | **2.40** 🏆 | **1.27** 🏆 | **3.00** 🏆 | 1.40 | 13.0 | 4.37 | 804.6 | **0.00** 🏆 |
| exact-hybrid-v5-end-refactor-cc | 2.80 | 1.39 | 3.40 | **1.44** | **11.0** 🏆 | **3.66** 🏆 | **780.4** 🏆 | **0.00** 🏆 |

- The `mccabe_avg` spread 1.53→1.40→1.44 is < 1 σ — no trophy.
- `smell_total` tie: hybrid-v4.4 and hybrid-v5 both at 0; hybrid-v4 has 3 of 8 runs with smell ≥ 1.

### Correctness + discipline (correctness higher = better)

| Workflow | `tests_passing %` | `verification_pct` (Mean / Min) | `cycle_count` | `refactorings_applied` | `predictions_correct_rate %` |
|---|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | **100** 🏆 | 0.96 / 0.73 | 37.4 | 24.9 | **97.2** 🏆 |
| exact-hybrid-v4.4-metric-refactor-cc | **100** 🏆 | **0.99** 🏆 / 0.93 | 40.2 | 30.4 | 89.6 |
| exact-hybrid-v5-end-refactor-cc | **100** 🏆 | **0.99** 🏆 / 0.93 | 35.8 | 23.6 | 94.4 |

### Cost (separated per routing — lower = better)

| Workflow | routing | n | `duration_s` | `total_tokens` |
|---|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | portkey | 8 | 2530 | 44.4 M |
| exact-hybrid-v5-end-refactor-cc | portkey | 5 | 3014 | 42.4 M |
| exact-hybrid-v4.4-metric-refactor-cc | native | 5 | 5284 | 102.3 M |

No cost trophy is awarded, deliberately: hybrid-v4.4 ran native, hybrid-v4/hybrid-v5 portkey — not a routing-clean comparison. Within portkey, hybrid-v5 (42.4 M, 3014 s) is level with the hybrid-v4 baseline (44.4 M, 2530 s) on tokens at ~+19 % wallclock — the pure end-pass surcharge. The high hybrid-v4.4 absolute value is routing-confounded, but its high variance is real (F-1.12.4).

---

## Kata game-of-life (single-file library, no cross-file lever)

### Code quality (lower = better)

| Workflow | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `cc_longest_function` | `cc_avg_loc_per_function` | Code Mass (APP) | `smell_total` |
|---|---:|---:|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | 4.00 | 2.83 | 4.13 | 11.47 | 4.75 | **153.8** 🏆 | 2.13 |
| exact-hybrid-v4.4-metric-refactor-cc | **2.20** 🏆 | **1.83** 🏆 | 3.40 | **8.40** 🏆 | 4.66 | 168.4 | **0.00** 🏆 |
| exact-hybrid-v5-end-refactor-cc | 3.00 | 2.20 | **3.20** | 9.80 | **4.08** | 168.0 | **0.00** 🏆 |

- `mccabe_max` 4.13→3.40→3.20: all within 1 σ → no robust winner.
- hybrid-v4 has the lowest Code Mass (APP) (both refactor variants add net code on the tiny library).

### Correctness + discipline (correctness higher = better)

| Workflow | `tests_passing %` | `verification_pct` | `cycle_count` | `refactorings_applied` | `predictions_correct_rate %` |
|---|---:|---:|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | **100** 🏆 | **1.0** 🏆 | 8.6 | 8.2 | **100** 🏆 |
| exact-hybrid-v4.4-metric-refactor-cc | **100** 🏆 | **1.0** 🏆 | 9.4 | 9.4 | 98.9 |
| exact-hybrid-v5-end-refactor-cc | **100** 🏆 | **1.0** 🏆 | 9.6 | 9.6 | **100** 🏆 |

### Cost (separated per routing — lower = better)

| Workflow | routing | n | `duration_s` | `total_tokens` |
|---|---|---:|---:|---:|
| exact-hybrid-v4-cleaned-cc | native | 5 | 898 | 10.1 M |
| exact-hybrid-v4.4-metric-refactor-cc | native | 5 | 1064 | 11.0 M |
| exact-hybrid-v5-end-refactor-cc | native | 5 | 1332 | 12.3 M |
| exact-hybrid-v4-cleaned-cc | portkey | 10 | 627 | 8.3 M |

Under **native** (comparable): hybrid-v4.4 +18 % wallclock / +9 % tokens, hybrid-v5 +48 % / +22 % against hybrid-v4 — hybrid-v4.4 buys the complexity gain more cheaply. The portkey hybrid-v4 row is informative only; its lower wallclock is a routing effect (different caching), not a workflow effect.

---

## F-1.12.1 — On both katas the per-cycle refactor hybrid-v4.4 is the robust Complexity Peak winner

The continuous metric-driven refactor (hybrid-v4.4) pushes `cognitive_max` and `cognitive_avg` furthest below the hybrid-v4 baseline on **both** kata types:

| Metric | Kata | hybrid-v4 | hybrid-v4.4 | hybrid-v5 | hybrid-v4.4 vs hybrid-v4 |
|---|---|---:|---:|---:|---|
| `cognitive_max` | claim-office | 5.0 | **2.4** | 2.8 | −2.6 (≈ 1.5 σ) **robust** |
| `cognitive_max` | game-of-life | 4.0 | **2.2** | 3.0 | −1.8 (> 1 σ) **robust** |
| `cognitive_avg` | claim-office | 1.91 | **1.27** | 1.39 | −0.64 (≈ 1 σ) **robust** |
| `cognitive_avg` | game-of-life | 2.83 | **1.83** | 2.2 | −1.0 (> 1 σ) **robust** |

The effect is stable across katas: a refactor that locally dismantles the complexity just created in *every* cycle keeps the Complexity Peak lower than both the refactor-poor baseline and the one-off end pass. On claim-office the larger hybrid-v4 sample (n=8) supports the baseline value; on GoL hybrid-v4.4 has the lowest variance of all three arms (σ 0.84) — the gain there is stable across all 5 runs.

Correctness stays untouched throughout (F-1.12.3): the bundle-break risk from RQ-1.9/1.10 occurs in neither variant.

---

## F-1.12.2 — The end refactor hybrid-v5 works only on the multi-file codebase; on the single-file library it is noise

The one-off whole-src end pass (hybrid-v5) behaves kata-dependently:

- **claim-office** (cli.ts + domain.ts): hybrid-v5 is largely level with hybrid-v4.4 (`cognitive_max` 2.8 vs 2.4, spread < 1 σ) and delivers the **lowest** Code Mass (APP) (780.4 vs hybrid-v4's 878.5, −11 %, Δ ≈ 1.1 σ), the **shortest** function (`cc_longest_function` 11.0, −11 %) and the **most compact** average function (`cc_avg_loc_per_function` 3.66, −13 %, Δ ≈ 1.5 σ). Here the whole-src view has genuine cross-file substance to consolidate — function inlining and parameter destructuring across file boundaries are explicitly documented in the run logs ("inlined `processStep` into `run`", "destructured `processClaim` parameters").
- **game-of-life** (single-file): hybrid-v5's `cognitive_max` of 3.0 is statistically indistinguishable from hybrid-v4 (4.0) — shaped by one outlier (4 of 5 runs = 2, one = 7; σ 2.24). Code Mass (APP) even rises (168.0 vs 153.8). On the tiny library there is no cross-file duplication for the end pass to work on.

The only cross-kata robust v6.5 advantage is `smell_total` = 0 (deterministic, as with hybrid-v4.4) against the hybrid-v4 residual smells (claim-office 0.38, GoL 2.13).

Mechanism reading: hybrid-v4.4 (per-cycle) and hybrid-v5 (whole-src end) are **complementary** on the multi-file kata — hybrid-v4.4 focuses on local Complexity Peak in the function just touched, hybrid-v5 on cross-file consolidation (shorter average function, lower Code Mass (APP)). A follow-up RQ could test hybrid-v6 = hybrid-v4.4 + end refactor to see whether the two mechanisms add up.

---

## F-1.12.3 — Correctness and TDD discipline intact everywhere; no bundle break

No cell breaks: `tests_passing` = 100 % everywhere, `verification_pct` claim-office 0.96–0.99 / GoL 1.0. On claim-office all 5/5 v6.5 runs write `experiment-done.txt` and reach `verification_pct ≥ 0.93` (mean 0.99, identical to hybrid-v4.4). The bundle-break risk documented in RQ-1.9/RQ-1.10 does **not** occur — both refactor variants leave correctness untouched.

Plausibility: the end-refactor pass runs outside the TDD cycle dynamics with stable tests as a safety net; a refactoring that turned tests red would be immediately visible on the CLI verification path.

TDD discipline is preserved. The per-cycle part of hybrid-v5 is byte-identical to hybrid-v4, and the cycle metrics confirm it (claim-office `cycle_count` 35.8 vs 37.4, `refactorings_applied` 23.6 vs 24.9, `predictions_correct_rate` 94.4 % vs 97.2 % — all within 1 σ). No demotivation of the per-cycle refactor from knowing about the end pass is detectable. The lower claim-office v6.4 `predictions_correct_rate` (89.6 % pooled) is sampling variance, not a discipline break.

---

## F-1.12.4 — Costs rise monotonically with refactor intensity; per-cycle is cost-unpredictable on large codebases

Costs are comparable only **within the same routing**. On game-of-life (all native) wallclock rises monotonically with refactor effort:

| Workflow (GoL, native) | `duration_s` | vs hybrid-v4 | `total_tokens` | vs hybrid-v4 |
|---|---:|---|---:|---|
| exact-hybrid-v4-cleaned-cc | 898 | — | 10.1 M | — |
| exact-hybrid-v4.4-metric-refactor-cc | 1064 | +18 % | 11.0 M | +9 % |
| exact-hybrid-v5-end-refactor-cc | 1332 | +48 % | 12.3 M | +22 % |

On the small GoL library the end pass hybrid-v5 pays the highest surcharge for the weakest effect (F-1.12.2); hybrid-v4.4 is the cheaper vehicle for the complexity gain there.

On claim-office the direct comparison is routing-confounded (hybrid-v4.4 native, hybrid-v4/hybrid-v5 portkey), but a real workflow effect remains visible: the native hybrid-v4.4 cell consumes ~102 M tokens (max 9197 s wallclock) with large variance (σ 17 M). The per-cycle refactor measures ESLint + McCabe pre/post in *every* one of the ~40 cycles and drags the full build plus a model round trip through each time — on the large CLI codebase that diverges strongly. The capped-iterative end pass (hybrid-v5) is by comparison more cost-predictable. **Reading:** per-cycle refactor is more cost-unpredictable than the end pass on large codebases — under a hard token/wallclock brake, hybrid-v5 is the more calculable vehicle.

---

## F-1.12.5 — No global v6.5 baseline promotion; metric-driven refactor is worth it, but the effective point of leverage is kata-dependent

Taken together:

| Axis | claim-office (multi-file) | game-of-life (single-file) |
|---|---|---|
| best complexity workflow | hybrid-v4.4 (per-cycle), hybrid-v5 close behind | hybrid-v4.4 (per-cycle), hybrid-v5 = noise |
| end-pass added value (hybrid-v5 vs hybrid-v4.4) | level + lowest Code Mass (APP) | none, Code Mass (APP) rises |
| correctness | held (≥ 0.96) | held (1.0) |
| cost | hybrid-v4.4 varies strongly; hybrid-v5 calculable | hybrid-v4.4 +18 %, hybrid-v5 +48 % (native) |

Both refactor variants beat the hybrid-v4 baseline on the Complexity Peak — **metric-driven refactor is worth it** and does not break correctness. But no arm is a global winner:

- The **per-cycle refactor hybrid-v4.4** is the most robust complexity lever across both kata types — at the price of high costs that are poorly predictable on large codebases.
- The **end refactor hybrid-v5** pays off only where there is cross-file substance to consolidate (multi-file codebases): there it delivers the lowest Code Mass (APP) at more calculable cost. On single-file tasks it is a full surcharge for no robust gain.
- **hybrid-v4** remains the most parsimonious choice when minimal Code Mass (APP)/cost takes priority over a minimal Complexity Peak (especially on small katas).

hybrid-v5 is therefore **not** a general replacement for hybrid-v4. The recommendation is task-/kata-dependent and joins the recurring "kata-dependent recommendation" pattern (cf. RQ-1.4, RQ-1.8/1.9): no refactor workflow winner generalizes across kata types.

---

## Operational lessons (non-RQ findings)

- **External session cut remained visible:** 1 of 6 v6.5 run attempts (16 %) ran into an external session cut (run of 05-28 00:19; `exit=0`, but `experiment-done.txt` missing, `run.log` aborted mid-red, 6 min wallclock vs the 37 min baseline, `end-refactor` never called). The `run-batch.sh` cap detection of 05-27 did not catch it because no cap signature appeared in run.log — presumably a Vertex-side cut. In the refill batch (05-28 06:01) the same detection recognized a different session as an external cut and retried automatically; the retry ran cleanly. The detection heuristic therefore catches some cases, not all.
- **Aggregator skip convention:** Invalidated runs must be *prefixed* with `_` (e.g. `_invalidated_<original>_<reason>`). A `__invalidated` suffix is not enough — `aggregate-by-query.py` and `batch-plan-from-rq.py` skip only dirs that begin with `_`.
- **Container vs host analyze-run:** the refill run had `analyze_status=ok` in the container, but `final_metrics.*` were null. A host-side `analyze-run.sh <run_dir>` (with an absolute path) filled in all values. Before `aggregate-by-query.py`, always spot-check with `jq '.final_metrics.code_mass' …`.
- **Routing-mixed cells (game-of-life):** since the merge with the former RQ-1.14, the GoL cells contain both native (RQ-1.14 fill) and portkey runs (older workflow-dev runs). opus-4-7 is treated as the same model; only cost metrics are read separately per routing. Two broken GoL v6.5 portkey runs (`model may not exist`, 0 cycles) were removed from the pool during the merge.
