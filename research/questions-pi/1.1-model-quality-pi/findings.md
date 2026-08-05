# RQ-model-quality-pi — Findings

**Setup**: game-of-life-example-mapping × v6.2.1-phase-continuation-pi × n=5 per cell (11 cells, all filled). This RQ measures the **model effect on code quality and TDD discipline** in a harness-constant setting. Primary axes: `smell_total` (**Smell Total**), `cognitive_max`, `mccabe_max` — all **lower = better**. `tests_passing` (internal) and `verification_pct` (external, game-of-life-verification) serve as the correctness gate. All models via pi harness / Requesty.

**Reasoning caveat**: All models run in the native reasoning default (no `-no-thinking` arm in this RQ). `glm-5-1` and `glm-5-2` are a direct intra-family version comparison.

**Quality gating**: Quality metrics are only meaningful if the code works. `qwen3-235b` (0 % `tests_passing`) and `gpt-5-6-terra` (80 %) therefore carry no quality trophy — low smell/complexity values on non-passing code are not a quality signal.

## Overview — code quality, lower = better (only cells with `tests_passing` = 100 %)

| Model | `smell_total` | `cognitive_max` | `mccabe_max` | `code_mass` | `cc_longest_function` | `tests_passing` |
|---|---|---|---|---|---|---|
| glm-5-2 | **1.0** 🏆 | 7.8 | 6.6 | 178.2 | 22.6 | 100 % |
| sonnet-5 | 2.2 | **6.6** 🏆 | **5.0** 🏆 | 183.0 | 19.6 | 100 % |
| kimi-k3-sference | 2.4 | 7.0 | 5.8 | 143.8 | **15.0** 🏆 | 100 % |
| kimi-k2-7 | 3.0 | 10.8 | 7.2 | 150.4 | 21.6 | 100 % |
| glm-5-1 | 3.2 | 9.6 | 7.6 | 183.2 | 27.2 | 100 % |
| opus-4-8 | 3.4 | 9.6 | 6.8 | 149.2 | 17.4 | 100 % |
| gpt-5-6-sol | 3.6 | 13.4 | 9.4 | **134.8** 🏆 | 21.2 | 100 % |
| deepseek-v4-pro | 4.0 | 14.0 | 10.2 | 158.4 | 25.4 | 100 % |
| minimax-m3 | 8.4 | **6.6** 🏆 | 5.2 | 212.2 | **15.0** 🏆 | 100 % |
| — 80 %/0 % (no trophy) | | | | | | |
| gpt-5-6-terra | 6.0 | 7.8 | 6.0 | 136.4 | 23.2 | 80 % |
| qwen3-235b | 1.8 | 6.4 | 3.4 | 248.0 | 46.6 | 0 % |

Direction: all five quality metrics **lower = better** (`smell_total` = **Smell Total**, `code_mass` = **Code Mass (APP)**, `cc_longest_function` = **Complexity Peak**). Trophies only among the correctness-complete cells (`tests_passing` = 100 %). At `cognitive_max` sonnet-5 and minimax-m3 tie at 6.6, with kimi-k3-sference (7.0) inside the same noise band. At `code_mass` gpt-5-6-sol leads (134.8); at `cc_longest_function` kimi-k3-sference and minimax-m3 tie at 15.0.

---

## F-1.1 — glm-5-2 delivers the cleanest code, sonnet the lowest complexity

Among the eight correctness-complete models, `glm-5-2` leads on **Smell Total** (1.0, against 2.2–8.4 for the rest), while `sonnet-5` takes both complexity measures (`cognitive_max` 6.6 tied with minimax-m3, `mccabe_max` 5.0). No model dominates all three axes: glm-5-2 is smell-poor, but cognitive_max 7.8; sonnet is complexity-poor, but smell 2.2.

| Model | `smell_total` | `cognitive_max` | `mccabe_max` | `code_mass` |
|---|---|---|---|---|
| glm-5-2 | 1.0 | 7.8 | 6.6 | 178 |
| sonnet-5 | 2.2 | 6.6 | 5.0 | 183 |
| kimi-k3-sference | 2.4 | 7.0 | 5.8 | 144 |
| kimi-k2-7 | 3.0 | 10.8 | 7.2 | 150 |
| opus-4-8 | 3.4 | 9.6 | 6.8 | 149 |

**Interpretation.** The models spread measurably on game-of-life over `smell_total` and `cognitive_max` (H2 confirmed: the pi harness is discriminating). The quality axes are partly orthogonal — a model with little smell does not automatically have low cyclomatic complexity. `glm-5-2` and `glm-5-1` both reach `verification_pct = 1.00`, but the newer version is measurably cleaner (`smell_total` 1.0 vs. 3.2, `cognitive_max` 7.8 vs. 9.6, `cc_longest_function` 22.6 vs. 27.2). The top of the complexity field (sonnet-5 and minimax-m3 at 6.6, kimi-k3-sference at 7.0) is separated by less than one σ — the three are practically indistinguishable there.

---

## F-1.2 — deepseek and gpt-5-6-sol solve the kata correctly, but with high complexity

`deepseek-v4-pro` and `gpt-5-6-sol` both reach `verification_pct = 1.00` and `tests_passing = 100 %`, but carry the highest cyclomatic and cognitive complexity of the green field: `cognitive_max` 14.0 and 13.4 respectively, `mccabe_max` 10.2 and 9.4 — roughly twice as high as sonnet (6.6 / 5.0).

| Model | `verification_pct` | `cognitive_max` | `mccabe_max` | `smell_total` |
|---|---|---|---|---|
| deepseek-v4-pro | 1.00 | 14.0 | 10.2 | 4.0 |
| gpt-5-6-sol | 1.00 | 13.4 | 9.4 | 3.6 |
| sonnet-5 | 1.00 | 6.6 | 5.0 | 2.2 |

**Interpretation.** Correctness and code complexity are decoupled: the same perfect external verification is reached by sonnet with half as complex code. Anyone optimizing only for `verification_pct` overlooks that deepseek/gpt-sol produce more maintenance-intensive code — on game-of-life the signal is small (max ~14), but it scales with kata size.

---

## F-1.3 — Correctness clusters at the top, with qwen as total fail

On the easier game-of-life kata, eight of eleven models reach `verification_pct = 1.00`; the continuation-drop fix (v6.2.1) ensures that kimi/minimax/qwen also run through the TDD loop. `qwen3-235b` forms the floor: it builds code (`cli_built = true`), but rarely gets it green (`tests_passing = 0 %`, `verification_pct = 0.40`).

| Model | `verification_pct` | `tests_passing` rate |
|---|---|---|
| opus-4-8, sonnet-5, gpt-5-6-sol, glm-5-1, glm-5-2, kimi-k2-7, kimi-k3-sference, deepseek-v4-pro | 1.00 | 100 % |
| minimax-m3 | 0.87 | 100 % |
| gpt-5-6-terra | 0.59 | 80 % |
| qwen3-235b | 0.40 | 0 % |

**Interpretation.** The qwen pattern is consistent across harness and kata with RQ-model-novel-pi (claim-office): qwen produces an implementation that passes neither internally nor externally — a real competence deficit, not an abort. Its `verification_pct` of 0.40 alongside `tests_passing = 0 %` means external scenarios sometimes pass on code its own test suite rejects. The easier kata lifts the overall level (eight perfect models vs. six on claim-office), but separates the weak ones just as clearly.

---

## F-1.4 — TDD discipline varies strongly without correlating with correctness

Among the correctness-perfect models, `predictions_total` spans from 8.2 (kimi-k3-sference) to 19.4 (opus-4-8) and `cycle_count` from 8.6 (opus) to 14.8 (sonnet). sonnet reaches perfect correctness with 4.8 predictions — the fewest of all, clearly below the field.

| Model (verified 1.0) | `cycle_count` | `predictions_total` | `refactorings_applied` |
|---|---|---|---|
| sonnet-5 | 14.8 | 4.8 | 3.2 |
| kimi-k3-sference | 14.6 | 8.2 | 3.0 |
| opus-4-8 | 8.6 | 19.4 | 3.0 |
| glm-5-2 | 10.8 | 11.2 | 5.8 |
| kimi-k2-7 | 9.6 | 13.6 | 3.4 |
| gpt-5-6-sol | 9.0 | 10.0 | 5.0 |

**Interpretation.** As in RQ-model-novel-pi (F-1.3), marker compliance is not a necessary condition for correctness (H3/H4). sonnet-5 solves game-of-life perfectly with 4.8 predictions, opus needs 19.4 for the same result. The two ends of the `cycle_count` range are occupied by models with opposite prediction behaviour — sonnet-5 and kimi-k3-sference run the most cycles (14.8 / 14.6) with the fewest predictions (4.8 / 8.2), opus the fewest cycles (8.6) with the most predictions (19.4). `cycle_count`/`predictions_total` measure workflow conformance, not result quality.

---

## F-1.5 — Cost spreads by a factor of 4.7 at comparable quality

The estimated run cost among the correctness-complete models ranges from ~$0.60/run (kimi-k2-7) to ~$2.83 (sonnet-5). The two Kimi generations are the cheapest cells in the field, `sonnet-5` and `glm-5-2` the most expensive. The failed/partly failed models lie in between (qwen ~$0.96 at 0 % tests_passing, gpt-5-6-terra ~$0.67 at 80 %).

| Model (`tests_passing` 100 %) | `cost_usd` (estimate/run) | `duration_seconds` | `total_tokens` | `smell_total` | `cognitive_max` |
|---|---|---|---|---|---|
| kimi-k2-7 | **$0.60** 🏆 | 234 | 1.34 M | 3.0 | 10.8 |
| kimi-k3-sference | $0.64 | 359 | 1.02 M | 2.4 | 7.0 |
| minimax-m3 | $0.77 | 4121 | 4.68 M | 8.4 | 6.6 |
| deepseek-v4-pro | $0.83 | **200** 🏆 | 1.38 M | 4.0 | 14.0 |
| gpt-5-6-sol | $1.09 | 240 | **661 k** 🏆 | 3.6 | 13.4 |
| opus-4-8 | $2.00 | 339 | 1.23 M | 3.4 | 9.6 |
| glm-5-1 | $2.10 | 1649 | 1.41 M | 3.2 | 9.6 |
| glm-5-2 | $2.53 | 883 | 4.36 M | 1.0 | 7.8 |
| sonnet-5 | $2.83 | 1216 | 3.66 M | 2.2 | 6.6 |

Direction: `cost_usd`, `duration_seconds` (wall clock), `total_tokens` — lower = better. Trophy only among `tests_passing` = 100 %. At `duration_seconds` deepseek-v4-pro leads (200 s), at `total_tokens` gpt-5-6-sol (661 k).

**Cost caveat.** `cost_usd` is a **list-price estimate** (Requesty tariffs per 1M tokens × measured tokens, `research/model-pricing.md`), not a billed amount — without workspace-specific discounts or smart-routing savings. Requesty provides no inline cost (`usage = null`), so values are backfilled by `compute-cost.py`; token counts are after the parser fix (correct `cache_read` summation). All eight cells now route over cache-discounted paths, so the column is comparable across models.

**Interpretation.** `kimi-k3-sference` is the "cheap AND clean" cell this field previously lacked: at $0.64 it is within four cents of the cheapest model, while placing third on **Smell Total** (2.4) and inside the leading noise band on `cognitive_max` (7.0 against 6.6). Compared to `sonnet-5` — the closest quality profile — it costs roughly a quarter and runs in under a third of the wall clock, at 1.02 M tokens against 3.66 M. `glm-5-2` still holds the smell crown (1.0) but costs four times as much. Wall clock and tokens do not run parallel to cost: `deepseek-v4-pro` and `gpt-5-6-sol` are fastest at ~200–240 s and gpt-5-6-sol is the most token-frugal at 661 k, while `minimax-m3` falls far out of the range at 4121 s and 4.68 M tokens despite low cost (~$0.77) — the cheap run buys its price with extreme runtime and token volume.

---

## F-1.6 — The kimi version jump improves every quality axis at the same price

`kimi-k3-sference` improves over `kimi-k2-7` on every quality axis — `cognitive_max` 7.0 vs. 10.8, `mccabe_max` 5.8 vs. 7.2, `smell_total` 2.4 vs. 3.0, `cc_longest_function` 15.0 vs. 21.6 — while both reach `verification_pct = 1.00` and 100 % `tests_passing`. Run cost is effectively unchanged ($0.64 vs. $0.60) at 24 % fewer tokens.

| Model | `smell_total` | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `cost_usd` | `duration_seconds` | `total_tokens` |
|---|---|---|---|---|---|---|---|
| kimi-k2-7 | 3.0 | 10.8 | 7.2 | 21.6 | $0.60 | 234 | 1.34 M |
| kimi-k3-sference | 2.4 | 7.0 | 5.8 | 15.0 | $0.64 | 359 | 1.02 M |

**Interpretation.** H1c holds: the newer Kimi generation writes measurably less complex code, and the `cognitive_max` gap (10.8 → 7.0) is the clearest intra-family jump in this RQ — larger than the GLM 5.1 → 5.2 step. The **Complexity Peak** improvement is the sharpest single move (21.6 → 15.0, from mid-field to joint best). One confound remains: the two versions route through different backproviders (K2.7 via TensorX, K3 via Sference), so provider-side differences cannot be separated from model behaviour. Cost is no longer a confound — both routes bill with a cache discount, and the 4-cent gap is inside estimate noise. The improvement costs 53 % more wall clock (234 → 359 s) while consuming fewer tokens, i.e. K3 spends longer per token rather than producing more. `cycle_count` rises from 9.6 to 14.6 while `predictions_total` falls from 13.6 to 8.2 — more marked TDD cycles carrying fewer predictions, consistent with F-1.4 (marker compliance ≠ result quality).

---

**Data caveat.** One qwen3-235b run (`12-20-43`) was created without a metadata header (missing `record-run` field); kata/workflow/model were added retroactively from the directory name so that it counts toward the quality metrics. No external `verification_pct` exists for this run, so the qwen verification figure is based on n=4.

**Route change for kimi-k3.** This cell was re-measured on 2026-08-04. The earlier `kimi-k3-nebius` runs were discarded rather than reused: both Requesty routes to K3 were unstable through 2026-07-28/29 (sference dying mid-run with `502 "problem with the provider stream"`, nebius with timeouts and retry exhaustion), so it could not be established which values reflect the model and which the provider. After Requesty reported the stream issue fixed, the cell was refilled on `requesty/sference/kimi-k3` at 5/5 `ok`. The discarded runs are archived metrics-only under `experiments/runs/_archive/kimi-k3-preroute-fix-2026-08-04/`. The route change also moves the cost basis: sference bills with a cache discount, nebius did not.

**Cost backfill.** pi writes a `cost_usd` scaffold of 0 whenever Requesty returns no inline usage, so every pi cell's cost is computed after the fact by `compute-cost.py` (token × list price) rather than read from the harness.
