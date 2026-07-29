# RQ-model-novel-pi — Findings

**Setup**: claim-office-example-mapping × v6.2.1-phase-continuation-pi, 17 cells, `min_replicates` = 5 (16 cells at n=5, `kimi-k3-nebius-no-thinking` at n=3). Primary outcome: `verification_pct` (**Correctness (external)**, 15 external scenarios, 0.0–1.0). All models via pi harness / Requesty.

**Coverage caveat (unstable cells)**: four cells do not carry the full replicate weight and are excluded from every ranking, trophy and cluster statement below:

| Cell | n | without timeout | Reason |
|---|---:|---:|---|
| `kimi-k3-nebius` | 5 | **1** | nebius route unstable on claim-office; runs take 1.5–2.5 h and mostly exceed the 7200 s budget |
| `kimi-k3-nebius-no-thinking` | **3** | 2 | below `min_replicates`; refill attempts died at provider `404`/timeout |
| `minimax-m3` | 5 | **2** | timeout-heavy |
| `minimax-m3-no-thinking` | 5 | **4** | timeout-heavy |

The K3 cells are reported as **unstable** rather than filled: their means rest on 1–2 completed runs and are not comparable with the fully covered cells. Both `minimax-m3` arms appear in the tables because n=5 is reached, but their high σ is partly a timeout artifact, not model variance alone. Details and route evidence in `README.md` → "Model selection".

**Workflow caveat**: Cells aggregate v6.2-with-why-cleaned-pi and v6.2.1-phase-continuation-pi together (OR match, canonically labeled as v6.2.1). v6.2.1 fixes only the continuation drop at the test-list→red transition (kimi/minimax/qwen aborted there: only `*.spec.ts`, no `cli.ts`) and is considered outcome-neutral. Affected drop runs were replaced by v6.2.1 runs; the remaining cells stay unchanged v6.2 runs.

**Reasoning caveat**: `<id>` = native reasoning default, `<id>-no-thinking` = `--thinking off`. The switch demonstrably takes effect only for `opus-4-8`; for the remaining models the arm comparison is a test of controllability itself (see `README.md` → "Reasoning state"). `glm-5-2`, `gpt-5-6-sol`, `gpt-5-6-terra` have only one arm.

## Overview — Correctness (external), higher = better

| Model | `verification_pct` mean | σ | `tests_passing` rate | n |
|---|---|---|---|---:|
| opus-4-8-no-thinking | **1.00** 🏆 | 0.00 | 100 % | 5 |
| glm-5-2 | **1.00** 🏆 | 0.00 | 100 % | 5 |
| gpt-5-6-sol | **1.00** 🏆 | 0.00 | 100 % | 5 |
| kimi-k2-7 | **1.00** 🏆 | 0.00 | 100 % | 5 |
| opus-4-8 | **0.99** 🏆 | 0.03 | 100 % | 5 |
| sonnet-5-no-thinking | 0.84 | 0.15 | 100 % | 5 |
| deepseek-v4-pro-no-thinking | 0.80 | 0.45 | 80 % | 5 |
| minimax-m3-no-thinking | 0.77 | 0.44 | 80 % | 5 |
| kimi-k2-7-no-thinking | 0.73 | 0.42 | 80 % | 5 |
| sonnet-5 | 0.72 | 0.19 | 100 % | 5 |
| gpt-5-6-terra | 0.69 | 0.42 | 80 % | 5 |
| deepseek-v4-pro | 0.60 | 0.55 | 100 % | 5 |
| minimax-m3 | 0.20 | 0.45 | 100 % | 5 |
| qwen3-235b | 0.00 | 0.00 | 0 % | 5 |
| qwen3-235b-no-thinking | 0.00 | 0.00 | 0 % | 5 |
| _kimi-k3-nebius-no-thinking_ (unstable) | _0.93_ | _0.07_ | _100 %_ | _3_ |
| _kimi-k3-nebius_ (unstable) | _0.52_ | _0.49_ | _100 %_ | _5 (1 without timeout)_ |

🏆 only for the five models with `verification_pct ≥ 0.99` at σ ≤ 0.03 (reproducibly perfect). The graded middle (0.60–0.84) carries no trophy — there the spread within σ is not separable from neighbors. The two **K3 cells are set in italics and carry no trophy**: their values rest on 1–3 completed runs (see coverage caveat) and are not comparable with the fully covered cells — `kimi-k3-nebius-no-thinking` would otherwise rank sixth on the strength of two runs.

---

## F-1.1 — Correctness clusters dichotomously, with a graded middle zone

`verification_pct` is not distributed evenly, but in two measuring groups plus one that never reached the measurement: a **perfect cluster** (opus-4-8 both arms, glm-5-2, gpt-5-6-sol, kimi-k2-7: mean ≈ 1.00, σ ≤ 0.03) and a **graded middle** (sonnet, deepseek, kimi-no-thinking, gpt-5-6-terra, minimax: 0.20–0.84 with high σ). The perfect cluster is tight and reproducible; the middle is unstable run to run.

| Cluster | Models | `verification_pct` | σ range |
|---|---|---|---|
| Perfect | opus-4-8, opus-4-8-no-thinking, glm-5-2, gpt-5-6-sol, kimi-k2-7 | 0.99–1.00 | 0.00–0.03 |
| Graded | sonnet-5(-no-thinking), deepseek(-no-thinking), kimi-k2-7-no-thinking, gpt-5-6-terra, minimax-m3(-no-thinking) | 0.20–0.84 | 0.15–0.55 |
| Not measured (drop-out) | qwen3-235b, qwen3-235b-no-thinking | 0.00 | 0.00 |

**Interpretation.** claim-office-example-mapping acts as a pass/fail filter for the extremes (H2), but not strictly binary: five model families resolve some of the five constructed ambiguities correctly and others not, depending on the run. The high σ in the middle (up to 0.55) means that the same cell fluctuates between 0 and 15 passed scenarios across the five replicates — the ambiguity resolution is unstable for these models, not consistently wrong.

The third row is **not a correctness cluster**: qwen3's 0.00 comes from a phase-transition drop-out, not from wrong ambiguity resolution (F-1.2). It stands in the table so the cell is not read as missing, but it carries no statement about qwen3's ability. Notable in the measuring groups: `kimi-k2-7` (reasoning on) is reproducibly perfect, while its `-no-thinking` arm lies in the graded middle (0.73, σ 0.42) — the only case in which a reasoning arm crosses the cluster boundary.

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

**Interpretation.** `cli_built = true` with `tests_total ≈ 0` is the signature: the scaffolding exists, the TDD loop never starts. `v6.2.1-phase-continuation-pi` was built precisely for this drop — for qwen3 on claim-office **it does not fix it**; the three partial runs (14–18 tests) come from the same workflow as the seven that stall.

Consequences for reading the other tables: the qwen3 values for `code_mass`, `lines_of_code`, `cc_longest_function` and `cycle_count` describe **an unfinished implementation**, not a model style. A `code_mass` of 251–296 is a fragment, not parsimony; a **Complexity Peak** spread of 3 to 78 is the difference between a stub and a half-written function, not an architectural decision. No model ranking may be derived from these cells.

Whether qwen3-235b can solve claim-office at all is **open**. Answering it requires a workflow whose phase transition holds for this model — not more replicates of the same cell. This distinguishes qwen3 substantively from `minimax-m3`, which builds code, gets the internal tests green (100 %) and fails only on the external verification.

---

## F-1.3 — TDD discipline and correctness do not correlate

Models with perfect correctness differ by more than an order of magnitude in TDD marker compliance. `glm-5-2` reaches `verification_pct = 1.00` with 31 `predictions_total`; `opus-4-8` reaches the same with 70 predictions. `kimi-k2-7` likewise reaches 1.00 with only 37.6 predictions, while `minimax-m3` with a comparable 18.4 predictions delivers only 0.20 correctness.

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

Where both arms exist, the `verification_pct` difference between `<id>` and `<id>-no-thinking` mostly lies within σ. For `opus-4-8` — the only model with a demonstrably effective switch — both arms are ≈ 1.00. For the models whose switch is without effect according to the rope-riddle probe, the arms scatter without a consistent direction (sonnet-off 0.84 vs on 0.72; deepseek-off 0.80 vs on 0.60; minimax-off 0.77 vs on 0.20; kimi, by contrast, off 0.73 vs on 1.00).

| Model | on (`<id>`) | off (`-no-thinking`) | Δ (off − on) |
|---|---|---|---|
| opus-4-8 | 0.99 | 1.00 | +0.01 |
| sonnet-5 | 0.72 | 0.84 | +0.12 |
| deepseek-v4-pro | 0.60 | 0.80 | +0.20 |
| kimi-k2-7 | 1.00 | 0.73 | −0.27 |
| minimax-m3 | 0.20 | 0.77 | +0.57 |
| _kimi-k3-nebius_ (unstable) | _0.52_ | _0.93_ | _+0.41_ |

**Interpretation.** Even for opus, where the switch demonstrably turns thinking blocks on and off, correctness does not move. For the remaining models the "off" arm is the same routing path as "on" (switch without effect, checked empirically) — the Δ there are replicate noise (all within the σ of 0.42–0.55 of the respective cells), not reasoning effects. That the Δ come out sometimes positive (minimax +0.57), sometimes negative (kimi −0.27), without the switch having any effect at all, confirms: it is noise, not a reasoning signal. Across this RQ the native reasoning state is not a predictor for `verification_pct`.

The K3 row carries no weight in either direction. Its Δ of +0.41 is the second-largest in the table, but the two arms differ in **completion rate** rather than in reasoning: the "on" arm finished 1 of 5 runs within budget, the "off" arm 2 of 3, and the two timeout runs in the "on" arm score 0.00 purely because the 7200 s elapsed before `cli.ts` was written (`cli_built = false`, tests green). Remove those two and the arms are indistinguishable. K3 also never went through the rope-riddle probe, so it is not even established that its switch does anything. Reading this as a reasoning effect would mean reading a budget artifact.

---

## F-1.5 — Perfect correctness at widely differing cost

Among the five reproducibly perfect cells (`verification_pct ≥ 0.99`) the estimated run cost spans almost an order of magnitude: `gpt-5-6-sol` solves the kata perfectly for ~$2.54/run, opus-4-8 costs ~$14.43 — roughly 5.7×. The estimate applies the current Requesty token tariffs (as of 2026-07-25, `research/model-pricing.md`) to the per-run measured token breakdown (input/output/cache).

| Model (verified ≥ 0.99) | `cost_usd` (estimate/run) | σ | `duration_seconds` | `code_mass` | `cc_longest_function` | `smell_total` |
|---|---|---|---|---|---|---|
| gpt-5-6-sol | **$2.54** 🏆 | 0.65 | **503** 🏆 | **462** 🏆 | 24.0 | 15.4 |
| kimi-k2-7 | $6.79 | 1.46 | 2214 | 851 | 19.4 | **0.0** 🏆 |
| glm-5-2 | $7.76 | 4.51 | 2818 | 761 | 24.0 | 0.2 |
| opus-4-8-no-thinking | $13.68 | 3.17 | 1656 | 895 | **18.2** 🏆 | **0.0** 🏆 |
| opus-4-8 | $14.43 | 2.98 | 1884 | 782 | 22.0 | 0.4 |

Direction: `cost_usd`, `duration_seconds`, `code_mass` (**Code Mass (APP)**), `cc_longest_function` (**Complexity Peak**), `smell_total` (**Smell Total**) — lower = better. Trophies only among the correctness-perfect cells (correctness gating: models with low cost but incomplete verification show stubs/aborts, not frugality). At `smell_total` kimi-k2-7 and opus-4-8-no-thinking share the trophy (both 0.0). `gpt-5-6-terra` ($0.60/run) is cheaper, but with `verification_pct = 0.69` not in the perfect cluster and therefore without a trophy.

**Cost caveat.** `cost_usd` is a **list-price estimate** (Requesty tariffs per 1M tokens × measured tokens), not a billed amount — without workspace-specific discounts or smart-routing savings (30–80 % possible through caching according to the provider). Requesty provides no inline cost (`usage = null`), so token × price is the only way. The token counts, and hence the cost, are considerably higher after the parser fix (correct `cache_read` summation over the main thread) than in earlier estimates. All 17 cells now have an estimate.

Until 2026-07-29 the K3 cells read `cost_usd = 0.00`, which looked like a measurement and would have made K3 the cheapest model of the RQ. It was an artifact of two defects: pi writes a cost scaffold of `0` when Requesty returns no usage, and `compute-cost.py` never replaced it — given an RQ dir it read the run ids positionally from column 0 of `runs.csv` (which is `kata`, not `run_id`), found no matching run directory and reported "processing 0 runs" with exit 0, and its price table was missing the `kimi-k3-nebius-no-thinking` tariff. Both fixed; the cells below carry recomputed values.

**The most expensive cells in the RQ are the two unstable K3 ones** — `kimi-k3-nebius` $20.13/run and `kimi-k3-nebius-no-thinking` $24.20, both above `opus-4-8` at $14.43, and neither in the perfect cluster. Two things drive this and neither is model appetite: the nebius tariff carries no cache discount ($3.00/$15.00 per 1M vs. sference $2.25/$11.25), and the runs are the longest in the study (mean 5959–7327 s), so a run that times out still bills the full two hours. A K3 cost comparison against the other models therefore measures route and budget as much as model.

**Interpretation.** `gpt-5-6-sol` is by far the cheapest among the perfect models (~$2.54/run, ~1/5.7 of the Opus cost) and at the same time the fastest — the price is the highest **Smell Total** of the group (15.4 vs. ≤ 0.4 for the others). The **Complexity Peak** lies close together across all five perfect cells (18–24 lines longest function) — unlike the unstable qwen spread, the structure here is consistently compact; opus-4-8-no-thinking holds the lowest peak at 18.2. `kimi-k2-7` is the interesting middle path: perfect correctness, **Smell Total 0.0** (best of the group, level with opus-4-8-no-thinking) and, at ~$6.79, roughly half as expensive as opus. Anyone needing perfect correctness at minimal code smell for moderate cost finds the best compromise in kimi-k2-7; anyone putting cost and latency above all else and tolerating some smell picks `gpt-5-6-sol`; the Opus arms ($13.68–14.43) deliver the same correctness at minimal smell and the lowest Complexity Peak, but at the highest price.
