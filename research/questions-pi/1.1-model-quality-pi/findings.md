# RQ-model-quality-pi — Findings

**Setup**: game-of-life-example-mapping × v6.2.1-phase-continuation-pi × n=5 per cell (10 cells, all filled). This RQ measures the **model effect on code quality and TDD discipline** in a harness-constant setting. Primary axes: `smell_total` (**Smell Total**), `cognitive_max`, `mccabe_max` — all **lower = better**. `tests_passing` (internal) and `verification_pct` (external, game-of-life-verification) serve as the correctness gate. All models via pi harness / Requesty.

**Reasoning caveat**: All models run in the native reasoning default (no `-no-thinking` arm in this RQ). `glm-5-1` and `glm-5-2` are a direct intra-family version comparison.

**Quality gating**: Quality metrics are only meaningful if the code works. `qwen3-235b` (0 % `tests_passing`) and the 80 % models (glm-5-1, gpt-5-6-terra) therefore carry no quality trophy — low smell/complexity values on non-passing code are not a quality signal.

## Overview — code quality, lower = better (only cells with `tests_passing` = 100 %)

| Model | `smell_total` | `cognitive_max` | `mccabe_max` | `code_mass` | `cc_longest_function` | `tests_passing` |
|---|---|---|---|---|---|---|
| glm-5-2 | **1.0** 🏆 | 7.8 | 6.6 | 178.2 | 22.6 | 100 % |
| sonnet-5 | 2.2 | **6.6** 🏆 | **5.0** 🏆 | 183.0 | 19.6 | 100 % |
| kimi-k2-7 | 3.0 | 10.8 | 7.2 | 150.4 | 21.6 | 100 % |
| opus-4-8 | 3.4 | 9.6 | 6.8 | 149.2 | 17.4 | 100 % |
| gpt-5-6-sol | 3.6 | 13.4 | 9.4 | **134.8** 🏆 | 21.2 | 100 % |
| deepseek-v4-pro | 4.0 | 14.0 | 10.2 | 158.4 | 25.4 | 100 % |
| minimax-m3 | 8.4 | **6.6** 🏆 | 5.2 | 212.2 | **15.0** 🏆 | 100 % |
| — 80 %/0 % (no trophy) | | | | | | |
| glm-5-1 | 2.2 | 7.2 | 6.0 | 144.8 | 22.2 | 80 % |
| gpt-5-6-terra | 6.0 | 7.8 | 6.0 | 136.4 | 23.2 | 80 % |
| qwen3-235b | 1.8 | 6.4 | 3.4 | 206.6 | 42.4 | 0 % |

Direction: all five quality metrics **lower = better** (`smell_total` = **Smell Total**, `code_mass` = **Code Mass (APP)**, `cc_longest_function` = **Complexity Peak**). Trophies only among the correctness-complete cells (`tests_passing` = 100 %). At `cognitive_max` sonnet-5 and minimax-m3 share the best value (6.6) — minimax carries it too, since `tests_passing` = 100 %, despite only 0.87 external verification. At `code_mass` gpt-5-6-sol leads (134.8), at `cc_longest_function` minimax-m3 (15.0).

---

## F-1.1 — glm-5-2 delivers the cleanest code, sonnet the lowest complexity

Among the seven correctness-complete models, `glm-5-2` leads on **Smell Total** (1.0, against 2.2–8.4 for the rest) and `sonnet-5` on both complexity measures (`cognitive_max` 6.6, `mccabe_max` 5.0). No model dominates all three axes: glm-5-2 is smell-poor, but cognitive_max 7.8; sonnet is complexity-poor, but smell 2.2.

| Model | `smell_total` | `cognitive_max` | `mccabe_max` | `code_mass` |
|---|---|---|---|---|
| glm-5-2 | 1.0 | 7.8 | 6.6 | 178 |
| sonnet-5 | 2.2 | 6.6 | 5.0 | 183 |
| kimi-k2-7 | 3.0 | 10.8 | 7.2 | 150 |
| opus-4-8 | 3.4 | 9.6 | 6.8 | 149 |

**Interpretation.** The models spread measurably on game-of-life over `smell_total` and `cognitive_max` (H2 confirmed: the pi harness is discriminating). The quality axes are partly orthogonal — a model with little smell does not automatically have low cyclomatic complexity. `glm-5-2` improves over `glm-5-1` in `verification_pct` (1.00 vs. 0.80, F-1.3), at a similar quality profile.

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

On the easier game-of-life kata, seven of ten models reach `verification_pct = 1.00`; the continuation-drop fix (v6.2.1) ensures that kimi/minimax/qwen also run through the TDD loop. `qwen3-235b` forms the floor: it builds code (`cli_built = true`), but never gets it green (`tests_passing = 0 %`, `verification_pct = 0.25` over the n=4 with a verification result).

| Model | `verification_pct` | `tests_passing` rate |
|---|---|---|
| opus-4-8, sonnet-5, gpt-5-6-sol, glm-5-2, kimi-k2-7, deepseek-v4-pro | 1.00 | 100 % |
| minimax-m3 | 0.87 | 100 % |
| glm-5-1 | 0.80 | 80 % |
| gpt-5-6-terra | 0.59 | 80 % |
| qwen3-235b | 0.25 | 0 % |

**Interpretation.** The qwen pattern is consistent across harness and kata with RQ-model-novel-pi (claim-office): qwen produces an implementation that passes neither internally nor externally — a real competence deficit, not an abort. The easier kata lifts the overall level (seven perfect models vs. five on claim-office), but separates the weak ones just as clearly.

---

## F-1.4 — TDD discipline varies strongly without correlating with correctness

Among the correctness-perfect models, `predictions_total` spans from 10 (gpt-5-6-sol) to 19 (opus-4-8) and `cycle_count` from 8.6 (opus) to 14.8 (sonnet). sonnet reaches perfect correctness with the fewest predictions (4.8) of all — clearly below the field.

| Model (verified 1.0) | `cycle_count` | `predictions_total` | `refactorings_applied` |
|---|---|---|---|
| sonnet-5 | 14.8 | 4.8 | 3.2 |
| opus-4-8 | 8.6 | 19.4 | 3.0 |
| glm-5-2 | 10.8 | 11.2 | 5.8 |
| kimi-k2-7 | 9.6 | 13.6 | 3.4 |
| gpt-5-6-sol | 9.0 | 10.0 | 5.0 |

**Interpretation.** As in RQ-model-novel-pi (F-1.3), marker compliance is not a necessary condition for correctness (H3/H4). sonnet-5 solves game-of-life perfectly with 4.8 predictions, opus needs 19.4 for the same result. `cycle_count`/`predictions_total` measure workflow conformance, not result quality.

---

## F-1.5 — Cost spreads by a factor of 6 at comparable quality

The estimated run cost ranges from ~$0.60/run (kimi, correctness-complete) to ~$2.83 (sonnet). Among the correctness-complete, qualitatively strong models, `kimi-k2-7` is cheapest at ~$0.60/run, `sonnet-5` (~$2.83) and `glm-5-2` (~$2.53) the most expensive. The failed/partly failed models lie in between (qwen ~$0.72 at 0 % tests_passing, gpt-5-6-terra ~$0.67 / glm-5-1 ~$1.74 at 80 %).

| Model (`tests_passing` 100 %) | `cost_usd` (estimate/run) | `duration_seconds` | `total_tokens` | `smell_total` | `cognitive_max` |
|---|---|---|---|---|---|
| kimi-k2-7 | **$0.60** 🏆 | 234 | 1,338,798 | 3.0 | 10.8 |
| minimax-m3 | $0.77 | 4121 | 4,676,979 | 8.4 | 6.6 |
| deepseek-v4-pro | $0.83 | **200** 🏆 | 1,378,866 | 4.0 | 14.0 |
| gpt-5-6-sol | $1.09 | 240 | **661,453** 🏆 | 3.6 | 13.4 |
| opus-4-8 | $2.00 | 339 | 1,230,420 | 3.4 | 9.6 |
| glm-5-2 | $2.53 | 883 | 4,360,550 | 1.0 | 7.8 |
| sonnet-5 | $2.83 | 1216 | 3,664,000 | 2.2 | 6.6 |

Direction: `cost_usd`, `duration_seconds` (wall clock), `total_tokens` — lower = better. Trophy only among `tests_passing` = 100 %. At `duration_seconds` deepseek-v4-pro leads (200 s), at `total_tokens` gpt-5-6-sol (661k).

**Cost caveat.** `cost_usd` is a **list-price estimate** (Requesty tariffs per 1M tokens × measured tokens, `research/model-pricing.md`, as of 2026-07-25), not a billed amount — without workspace-specific discounts or smart-routing savings. Requesty provides no inline cost (`usage = null`); token counts after the parser fix (correct `cache_read` summation).

**Interpretation.** The cheapest qualitatively convincing compromise is `glm-5-2` or `sonnet-5`: best quality (smell 1.0 / complexity 6.6-5.0), but at the upper price end. Anyone prioritizing cost and tolerating moderate complexity picks `kimi-k2-7` (~$0.60, 1/5 of sonnet) with smell 3.0 — acceptable, but cognitive_max 10.8. A "cheap AND clean" model is missing in this field: the smell-poorest models (glm-5-2, sonnet) are at the same time the most expensive. Wall clock and tokens do not run parallel to cost: `deepseek-v4-pro` and `gpt-5-6-sol` are fastest at ~200–240 s and gpt-5-6-sol is the most token-frugal at 661k, while `minimax-m3` falls far out of the range at 4121 s and 4.7 M tokens despite low cost (~$0.77) — the cheap run buys its price with extreme runtime and token volume.

---

**Data caveat.** One qwen3-235b run (`12-20-43`) was created without a metadata header (missing `record-run` field); kata/workflow/model were added retroactively from the directory name so that it counts toward the quality metrics. No external `verification_pct` exists for this run, so the qwen verification figure is based on n=4.
