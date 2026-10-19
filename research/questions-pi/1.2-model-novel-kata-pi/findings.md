# RQ-model-novel-pi — Findings

**Setup**: claim-office-example-mapping × exact-hybrid-v4.2-phase-continuation-pi, 18 cells, `min_replicates` = 5, all 18 complete. Primary outcome: `verification_pct` (**Correctness (external)**, 15 external scenarios, 0.0–1.0). All models via pi harness / Requesty. Only runs with `exit_reason = ok` count; timeouts are not replicates.

**Timeout caveat (minimax-m3)**: both MiniMax arms run longest in the RQ. `minimax-m3` takes 4937–13297 s per ok run (`duration_seconds` mean 8832), `minimax-m3-no-thinking` 3316–13707 s (mean 7313). Both arms have lost fill attempts to the 2 h timeout; those runs are not replicates and are not in the data. Durations above 7200 s include the batch's retry backoff.

**Route change caveat (kimi-k3)**: the K3 cell was re-measured on 2026-08-04 on `requesty/sference/kimi-k3` and now completes 5/5 without timeout. The earlier `kimi-k3-nebius` runs — an unstable cell at 1/5 completed — were discarded rather than reused, since with both Requesty routes failing it could not be established which values reflect the model and which the provider. K3 also has **no `-no-thinking` arm**: `--thinking off` provably does not take effect on this route. Details in `README.md` → "Model selection" and "Reasoning state".

**Workflow caveat**: Cells aggregate exact-hybrid-v4-cleaned-pi and exact-hybrid-v4.2-phase-continuation-pi together (OR match, canonically labeled as hybrid-v4.2). hybrid-v4.2 fixes only the continuation drop at the test-list→red transition (kimi/minimax/qwen aborted there: only `*.spec.ts`, no `cli.ts`) and is considered outcome-neutral. Affected drop runs were replaced by hybrid-v4.2 runs; the remaining cells stay unchanged hybrid-v4 runs.

**Reasoning caveat**: `<id>` = native reasoning default, `<id>-no-thinking` = `--thinking off`. The switch demonstrably takes effect for `opus-4-8` and `opus-5-requesty` — both on the Vertex EU route; for the remaining models the arm comparison is a test of controllability itself (see `README.md` → "Reasoning state"). `glm-5-2`, `kimi-k3-sference`, `gpt-5-6-sol`, `gpt-5-6-terra` have only one arm.

## Overview — Correctness (external), higher = better

| Model | `verification_pct` mean | σ | `tests_passing` rate | n |
|---|---|---|---|---:|
| opus-4-8-no-thinking | **1.00** 🏆 | 0.00 | 100 % | 5 |
| glm-5-2 | **1.00** 🏆 | 0.00 | 100 % | 5 |
| gpt-5-6-sol | **1.00** 🏆 | 0.00 | 100 % | 5 |
| kimi-k2-7 | **1.00** 🏆 | 0.00 | 100 % | 5 |
| kimi-k3-sference | **0.99** 🏆 | 0.03 | 100 % | 5 |
| opus-4-8 | **0.99** 🏆 | 0.03 | 100 % | 5 |
| minimax-m3-no-thinking | 0.97 | 0.06 | 80 % | 5 |
| opus-5-requesty | 0.96 | 0.09 | 100 % | 5 |
| opus-5-requesty-no-thinking | 0.96 | 0.09 | 100 % | 5 |
| sonnet-5-no-thinking | 0.84 | 0.15 | 100 % | 5 |
| deepseek-v4-pro-no-thinking | 0.80 | 0.45 | 80 % | 5 |
| minimax-m3 | 0.76 | 0.43 | 100 % | 5 |
| kimi-k2-7-no-thinking | 0.73 | 0.42 | 80 % | 5 |
| sonnet-5 | 0.72 | 0.19 | 100 % | 5 |
| gpt-5-6-terra | 0.69 | 0.42 | 80 % | 5 |
| deepseek-v4-pro | 0.60 | 0.55 | 100 % | 5 |
| qwen3-235b | 0.00 | 0.00 | 0 % | 5 |
| qwen3-235b-no-thinking | 0.00 | 0.00 | 0 % | 5 |

🏆 for the six models with `verification_pct ≥ 0.99` at σ ≤ 0.03 (reproducibly perfect). The near-perfect cells (0.96–0.97) and the graded middle (0.60–0.84) carry no trophy — there the spread within σ is not separable from neighbors.

---

## F-1.1 — Correctness clusters dichotomously, with a graded middle zone

`verification_pct` is not distributed evenly, but in two measuring groups plus one that never reached the measurement: a **perfect cluster** (opus-4-8 both arms, glm-5-2, gpt-5-6-sol, kimi-k2-7: mean ≈ 1.00, σ ≤ 0.03) and a **graded middle** (sonnet, deepseek, kimi-no-thinking, gpt-5-6-terra, minimax-m3: 0.60–0.84 with high σ). The perfect cluster is tight and reproducible; the middle is unstable run to run.

| Cluster | Models | `verification_pct` | σ range |
|---|---|---|---|
| Perfect | opus-4-8, opus-4-8-no-thinking, glm-5-2, gpt-5-6-sol, kimi-k2-7, kimi-k3-sference | 0.99–1.00 | 0.00–0.03 |
| Near-perfect | minimax-m3-no-thinking, opus-5-requesty, opus-5-requesty-no-thinking | 0.96–0.97 | 0.06–0.09 |
| Graded | sonnet-5(-no-thinking), deepseek(-no-thinking), kimi-k2-7-no-thinking, gpt-5-6-terra, minimax-m3 | 0.60–0.84 | 0.15–0.55 |
| Not measured (drop-out) | qwen3-235b, qwen3-235b-no-thinking | 0.00 | 0.00 |

**Interpretation.** claim-office-example-mapping acts as a pass/fail filter for the extremes (H2), but not strictly binary: five model families resolve some of the five constructed ambiguities correctly and others not, depending on the run. The high σ in the middle (up to 0.55) means that the same cell fluctuates between 0 and 15 passed scenarios across the five replicates — the ambiguity resolution is unstable for these models, not consistently wrong.

The last row is **not a correctness cluster**: qwen3's 0.00 comes from a phase-transition drop-out, not from wrong ambiguity resolution (F-1.2). It stands in the table so the cell is not read as missing, but it carries no statement about qwen3's ability. Notable in the measuring groups: `kimi-k2-7` (reasoning on) is reproducibly perfect, while its `-no-thinking` arm lies in the graded middle (0.73, σ 0.42). `minimax-m3` crosses the boundary the other way round: graded in the default arm (0.76, σ 0.43), near-perfect with `--thinking off` (0.97). Both models reason in both arms (F-1.4), so neither crossing is a reasoning effect.

The **near-perfect** row is a category of its own rather than the top of the graded middle. Both Opus 5 arms score identically: four runs at 15/15 and one at 12/15 each. `minimax-m3-no-thinking` has the same shape — four runs at 15/15 and one at 13/15, whose internal suite also ended red (hence the 80 % `tests_passing` rate). That is not the run-to-run instability of the graded models, whose replicates swing between 0 and 15 — it is a few scenarios missed once per cell, against an otherwise perfect record. These cells sit below the perfect cluster on the mean and above the graded middle in kind.

---

## F-1.2 — qwen3-235b drops out at the phase transition; `verification_pct = 0` is not a model statement

`qwen3-235b` reaches `verification_pct = 0.00` and a `tests_passing` rate of 0 % in both arms. The cause is **not** a failed implementation but an aborted one: the runs end at the test-list→red transition. The test list is written in full, then the model treats the turn as finished.

| Symptom | Value across the 10 runs (both arms) |
|---|---|
| `it.todo(...)` entries in `claim-office.spec.ts` | 19–54 (test list complete) |
| implemented `it(...)` tests | **0–1 in 7 of 10 runs**; 14/15/18 in the remaining three |
| `duration_seconds` | 19–2158 s against a ~7200 s budget — most end in under 2 min |
| `cli_built` | `true` throughout |
| `tests_total` | 0–1 in 7 runs |

**Interpretation.** `cli_built = true` with `tests_total ≈ 0` is the signature: the scaffolding exists, the TDD loop never starts. `exact-hybrid-v4.2-phase-continuation-pi` was built precisely for this drop — for qwen3 on claim-office **it does not fix it**; the three partial runs (14–18 tests) come from the same workflow as the seven that stall.

Consequences for reading the other tables: the qwen3 values for `code_mass`, `lines_of_code`, `longest_function` and `cycle_count` describe **an unfinished implementation**, not a model style. A `code_mass` of 251–296 is a fragment, not parsimony; a `longest_function` spread of 3 to 78 is the difference between a stub and a half-written function, not an architectural decision. No model ranking may be derived from these cells.

Whether qwen3-235b can solve claim-office at all is **open**. Answering it requires a workflow whose phase transition holds for this model — not more replicates of the same cell. This distinguishes qwen3 substantively from `minimax-m3`, which builds code, gets the internal tests green (100 %) and loses points only on the external verification (0.76).

---

## F-1.3 — TDD discipline and correctness do not correlate

Models with perfect correctness differ by more than an order of magnitude in TDD marker compliance. `glm-5-2` reaches `verification_pct = 1.00` with 31 `predictions_total`; `opus-4-8` reaches the same with 70 predictions. `kimi-k2-7` likewise reaches 1.00 with 37.6 predictions, while `sonnet-5` with a comparable 38.2 predictions delivers only 0.72 correctness.

| Model (verified ≥ 0.99) | `verification_pct` | `cycle_count` | `predictions_total` | `refactorings_applied` |
|---|---|---|---|---|
| gpt-5-6-sol | 1.00 | 17.8 | 20.8 | 8.4 |
| kimi-k2-7 | 1.00 | 23.4 | 37.6 | 12.0 |
| glm-5-2 | 1.00 | 44.8 | 31.2 | 15.6 |
| opus-4-8-no-thinking | 1.00 | 51.0 | 63.2 | 15.8 |
| opus-4-8 | 0.99 | 40.2 | 70.0 | 19.4 |

**Interpretation.** Test-first marker compliance (`predictions_total`, `cycle_count`) is not a necessary condition for correctness (H4). gpt-5-6-sol and kimi-k2-7 solve the kata just as perfectly with half to a third of the Opus prediction volume. Marker compliance measures workflow conformance, not result quality — these are separate axes.

---

## F-1.4 — The reasoning switch does not shift correctness

Where both arms exist, the `verification_pct` difference between `<id>` and `<id>-no-thinking` mostly lies within σ. For the two models with a demonstrably effective switch — `opus-4-8` and `opus-5-requesty`, both on the Vertex EU route — the arms are ≈ 1.00 and exactly equal respectively. For the models whose switch is without effect according to the rope-riddle probe, the arms scatter without a consistent direction (sonnet-off 0.84 vs on 0.72; deepseek-off 0.80 vs on 0.60; minimax-off 0.97 vs on 0.76; kimi, by contrast, off 0.73 vs on 1.00).

| Model | on (`<id>`) | off (`-no-thinking`) | Δ (off − on) | switch effective |
|---|---|---|---|---|
| opus-5-requesty | 0.96 | 0.96 | **0.00** | yes |
| opus-4-8 | 0.99 | 1.00 | +0.01 | yes |
| sonnet-5 | 0.72 | 0.84 | +0.12 | no |
| deepseek-v4-pro | 0.60 | 0.80 | +0.20 | no |
| kimi-k2-7 | 1.00 | 0.73 | −0.27 | no |
| minimax-m3 | 0.76 | 0.97 | +0.21 | no |

`minimax-m3` reasons in both arms under the kata as well, not only in the rope-riddle probe: every ok run of the `-no-thinking` arm carries `"type":"thinking"` blocks (1292–21389 per transcript, against 665–11059 in the default arm). Its Δ therefore compares two samples of the same reasoning state. It rests on the default arm's spread (σ 0.43): one run at 0.00 against four at 0.87–1.00.

**Interpretation.** The two cells where the switch demonstrably works carry the argument: `opus-5-requesty` moves by exactly 0.00 (both arms 4× 15/15 and 1× 12/15), `opus-4-8` by 0.01. Turning reasoning off costs these models no correctness at all. For the remaining models the "off" arm is the same routing path as "on" (switch without effect, checked empirically) — the Δ there are replicate noise (all within the σ of 0.42–0.55 of the respective cells), not reasoning effects. That the Δ come out sometimes positive (deepseek +0.20, minimax +0.21), sometimes negative (kimi −0.27), without the switch having any effect at all, confirms: it is noise, not a reasoning signal. Across this RQ the native reasoning state is not a predictor for `verification_pct`.

The Opus 5 arms were the empirical test the README set up: the model entered with both arms on the assumption that it shares `opus-4-8`'s Vertex EU route and therefore its controllability. The transcripts confirm it — 0 `thinking_delta` in all five `-no-thinking` runs against 505–1006 in the default arm, with no overlap. Opus 5 is thus the second model in this RQ with a working switch, and the two cells stay separate rather than being merged.

`kimi-k3-sference` has no row here because it has no second arm. Measured under this kata, an `--thinking off` run produced **more** reasoning than the default (5439 vs. 4568 `thinking_delta`, at a higher share of the run), and its outcome landed inside the default-arm distribution. A second cell would have sampled the same state twice under a label suggesting otherwise — the same reason `glm-5-2` and the two GPT cells are single-arm.

---

## F-1.5 — High correctness at widely differing cost

Among the nine cells that pass the correctness gate (`verification_pct ≥ 0.90`) the estimated run cost spans more than an order of magnitude: `minimax-m3-no-thinking` solves the kata for ~$1.76/run, `opus-5-requesty-no-thinking` costs ~$21.43 — roughly 12×. Within the reproducibly perfect cluster (≥ 0.99) the span is `gpt-5-6-sol` at ~$2.54 against `opus-4-8` at ~$14.43, roughly 5.7×. The estimate applies the current Requesty token tariffs (`research/model-pricing.md`) to the per-run measured token breakdown (input/output/cache).

| Model (verified ≥ 0.90) | `verification_pct` | `cost_usd` (estimate/run) | σ | `duration_seconds` | `code_mass` | `longest_function` | `smell_total` |
|---|---|---|---|---|---|---|---|
| minimax-m3-no-thinking | 0.97 | **$1.76** 🏆 | 0.48 | 7313 | 807 | 28.8 | 1.2 |
| gpt-5-6-sol | 1.00 | $2.54 | 0.65 | **503** 🏆 | **462** 🏆 | 24.0 | 15.4 |
| kimi-k3-sference | 0.99 | $3.56 | 0.54 | 1929 | 666 | 21.4 | 0.4 |
| kimi-k2-7 | 1.00 | $6.79 | 1.46 | 2214 | 851 | 19.4 | **0.0** 🏆 |
| glm-5-2 | 1.00 | $7.76 | 4.51 | 2818 | 761 | 24.0 | 0.2 |
| opus-4-8-no-thinking | 1.00 | $13.68 | 3.17 | 1656 | 895 | 18.2 | **0.0** 🏆 |
| opus-4-8 | 0.99 | $14.43 | 2.98 | 1884 | 782 | 22.0 | 0.4 |
| opus-5-requesty | 0.96 | $18.53 | 1.64 | 2802 | 766 | 12.8 | 2.4 |
| opus-5-requesty-no-thinking | 0.96 | $21.43 | 3.21 | 3142 | 762 | **9.2** 🏆 | **0.0** 🏆 |

Direction: `cost_usd`, `duration_seconds`, `code_mass` (**Code Mass (APP)**), `longest_function`, `smell_total` (**Smell Total**) — lower = better. Trophies only among cells with `verification_pct ≥ 0.90` (correctness gating: models with low cost but incomplete verification show stubs/aborts, not frugality). A trophy is shared when the gap to the best value is smaller than the smaller σ of the two cells. At `smell_total` kimi-k2-7, opus-4-8-no-thinking and opus-5-requesty-no-thinking share the trophy (all 0.0). At `cost_usd` the gap from `minimax-m3-no-thinking` to `gpt-5-6-sol` ($0.78) exceeds both σ, so the trophy is not shared. At `longest_function` `opus-5-requesty-no-thinking` (9.2, σ 1.1) leads its own default arm (12.8) by more than σ. `gpt-5-6-terra` ($0.60/run) is cheaper still, but with `verification_pct = 0.69` below the gate and therefore without a trophy.

The two **Opus 5** cells are the most expensive of the RQ — above `opus-4-8` at $14.43 and roughly 7–8× `gpt-5-6-sol` — and lead the field on `longest_function` (9.2 and 12.8 against 18.2 for the best Opus 4.8 cell), at a **Smell Total** of 0.0 and 2.4. The price does not buy sloppier structure; it buys the shortest functions of the RQ, at 0.96 rather than perfect correctness.

`minimax-m3-no-thinking` sits at the opposite end: the cheapest cell above the gate, but at 7313 s per run the second-slowest of the RQ after its own default arm, with the longest `longest_function` (28.8) of the gated field and a **Code Mass (APP)** of 807. Low price here is bought with wall clock and timeout risk (see timeout caveat), not with correctness.

**Cost caveat.** `cost_usd` is a **list-price estimate** (Requesty tariffs per 1M tokens × measured tokens), not a billed amount — without workspace-specific discounts or smart-routing savings (30–80 % possible through caching according to the provider). Requesty provides no inline cost (`usage = null`), so pi writes a scaffold of `0` and every value here is backfilled by `compute-cost.py`. Token counts are after the parser fix (correct `cache_read` summation over the main thread).

**Interpretation.** `gpt-5-6-sol` is the cheapest of the perfect models (~$2.54/run, ~1/5.7 of the Opus 4.8 cost) and the fastest cell of the RQ — the price is the highest **Smell Total** of the gated field (15.4 vs. ≤ 2.4 for the others). `minimax-m3-no-thinking` undercuts it on cost but needs fourteen times the wall clock. `kimi-k3-sference` is the strongest all-round cell: third-cheapest at $3.56, second-lowest **Code Mass (APP)** at 666 and near-zero smell (0.4), at a mid-field `longest_function` (21.4) — it buys this with wall clock (1929 s, roughly four times gpt-5-6-sol). `kimi-k2-7` holds **Smell Total 0.0** level with opus-4-8-no-thinking and opus-5-requesty-no-thinking at about half the Opus 4.8 cost. Anyone needing perfect correctness at minimal smell for moderate cost picks kimi-k2-7 or kimi-k3-sference; anyone putting cost and latency above all else and tolerating smell picks `gpt-5-6-sol`; the Opus 4.8 arms ($13.68–14.43) deliver the same correctness at minimal smell but lead on no metric; the Opus 5 arms ($18.53–21.43) are the only ones that buy a structural lead (`longest_function`) with their premium.
