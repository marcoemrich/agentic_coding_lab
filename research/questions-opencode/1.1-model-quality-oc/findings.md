# RQ-model-quality-oc — Findings

**Setup**: game-of-life-example-mapping × v5.1-testlist-scope-fix-oc × n=5 per cell (30 runs total, 29 without timeout). As of 2026-05-28.

## Overview

Code quality as primary outcome (lower = better except where noted); correctness (`verification_pct`, higher = better) as gating precondition.

| Metric | Direction | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash | kimi-k2-6 | deepseek-v4-flash | deepseek-v4-pro |
|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | higher | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | 0.57 | **1.00** 🏆 | 0.85 |
| `verification_pct` (std) | lower | **0.00** 🏆 | **0.00** 🏆 | **0.00** 🏆 | 0.40 | **0.00** 🏆 | 0.33 |
| `tests_passing` (rate) | higher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | 80% |
| `completed_within_budget` (rate) | higher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | 80% |
| `smell_total` (mean) | lower | 3.6 | **2.8** 🏆 | 4.0 | 4.4 | 4.0 | 4.2 |
| `cognitive_max` (mean) | lower | **11.4** 🏆 | **11.6** 🏆 | 16.0 | 9.4 | 13.2 | 11.4 |
| `cognitive_avg` (mean) | lower | **8.03** 🏆 | **7.8** 🏆 | 14.07 | 8.4 | 8.78 | 10.6 |
| `mccabe_max` (mean) | lower | 7.6 | **7.0** 🏆 | 10.4 | 7.6 | 9.4 | 8.6 |
| `mccabe_avg` (mean) | lower | **2.91** 🏆 | 3.39 | 6.0 | 4.85 | 3.99 | 3.28 |
| `cc_longest_function` (mean) | lower | **18.6** 🏆 | 19.8 | **18.6** 🏆 | 15.2 | 27.6 | 15.0 |
| `cc_avg_loc_per_function` (mean) | lower | **7.59** 🏆 | 10.05 | 15.63 | 9.9 | 13.10 | 9.53 |
| `cc_median_loc_per_function` (mean) | lower | **3.3** 🏆 | 8.5 | 14.9 | 8.3 | 9.8 | 7.0 |
| `lines_of_code` (mean) | lower (at equal correctness) | **38.2** 🏆 | 46.4 | 52.2 | 22.4 | 44.8 | 24.6 |
| `tests_total` (mean) | higher | **9.4** 🏆 | **9.8** 🏆 | 8.4 | 7.0 | **9.2** 🏆 | 8.6 |
| `cycle_count` (mean) | — | 3.0 | 2.2 | 7.0 | 5.0 | 5.4 | 7.6 |
| `refactorings_applied` (mean) | — | 1.6 | 2.4 | 3.6 | 3.4 | 4.8 | 4.6 |
| `predictions_total` (mean) | higher (skill compliance) | **4.8** 🏆 | 4.4 | 0.4 | 2.0 | 1.4 | **6.2** 🏆 |
| `duration_seconds` (mean) | lower | 231 | 835 | **153** 🏆 | 1083 | 612 | 2381 |
| `total_tokens` (mean) | lower | **1.82 M** 🏆 | 2.96 M | 2.80 M | 2.28 M | 2.71 M | 2.82 M |
| `cost_usd` (mean, $/run) | lower (at equal correctness) | $1.84 | $0.74 | $1.06 | $1.06 | **$0.10** 🏆 | $0.37 |
| `cost_usd` (mean, $/perfect-run) | lower | $1.84 | $0.74 | $1.06 | $2.65 | **$0.10** 🏆 | $0.46 |

**Trophy rule on correctness gating**: Trophies for quality/efficiency metrics go only to models with `verification_pct = 1.0`. Kimi-K2 drops out of the pool at 0.57 mean (3 of 5 runs below 0.5) — its low `cognitive_max` (9.4), low `lines_of_code` (22.4) and short functions are partly stub artifacts (too few tests). DeepSeek-V4-Pro narrowly drops out of the pool at 0.85 — 4/5 runs are perfect, but 1 run timed out at 0.27 verification, so its low `code_mass` (124) and `lines_of_code` (24.6) do not count as clean winners. `cycle_count` and `refactorings_applied` are ambivalent (more cycles ≠ better, depending on skill compliance) — no trophy. `predictions_total` is exceptionally noted with a direction here: it measures compliance with the v5.1 skill format.

`cognitive_max`, `cognitive_avg` and `cc_longest_function`: Opus and GLM are separated by less than 1 σ — spread rule → both 🏆. At `cc_longest_function` Flash is exactly level with Opus (18.6) → third 🏆.

**Cost calculation**: per run from `transcript-metrics.json.total_tokens` × pricing per 1M tokens. Sources 2026-05-28: Anthropic pricing page (Opus), OpenRouter API (GLM/Kimi/DeepSeek), Vertex Standard (Gemini Flash). `reasoning` tokens are billed at the output rate. DeepSeek cache read is not explicitly stated on OpenRouter; conservative estimate 25 % of the input price.

| Model | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| deepseek-v4-flash (OpenRouter) | $0.10 | $0.20 | $0.025 (25%) |
| deepseek-v4-pro (OpenRouter) | $0.44 | $0.87 | $0.11 (25%) |

Portkey gateway markup not included.

**Cost breakdown per mean run** (tokens as mean over n=5):

| Model | input → cost | output (+reasoning) → cost | cache_read → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 116 k × $5.00 = $0.58 | 16.9 k × $25.00 = $0.42 | 1.68 M × $0.50 = $0.84 | **$1.84** |
| glm-5-1 | 144 k × $0.98 = $0.14 | 30.9 k × $3.08 = $0.10 | 2.79 M × $0.18 = $0.50 | **$0.74** |
| kimi-k2-6 | 371 k × $0.73 = $0.27 | 27.7 k × $3.49 = $0.10 | 1.88 M × $0.37 = $0.70 | **$1.06** |
| gemini-3-5-flash | 400 k × $1.50 = $0.60 | 11.2 k × $9.00 = $0.10 | 2.39 M × $0.15 = $0.36 | **$1.06** |
| deepseek-v4-flash | 299 k × $0.10 = $0.03 | 30.5 k × $0.20 = $0.01 | 2.38 M × $0.025 = $0.06 | **$0.10** |
| deepseek-v4-pro | 110 k × $0.44 = $0.05 | 32.9 k × $0.87 = $0.03 | 2.68 M × $0.11 = $0.29 | **$0.37** |

`$/perfect-run` scales with the share of runs with `verification_pct = 1.0`: Kimi $1.06/run × (5/2 verified) = **$2.65** per correct solution. DeepSeek-V4-Pro $0.37/run × (5/4 verified) = **$0.46**. Other models 5/5 verified → unchanged.

---

## F-1.1 — Opus 4.7 writes the most compact implementation

Opus delivers the shortest solution across all code-volume and function-size metrics (LoC, code_mass, cc_avg/median_loc_per_function) **at full external correctness** and at the same time has the lowest token consumption (1.82 M vs 2.28–2.96 M for the other models with `verification_pct = 1.0`).

| Model | lines_of_code | cc_avg_loc | cc_median_loc | total_tokens |
|---|---|---|---|---|
| **opus-4-7-portkey** | **38.2** 🏆 | **7.59** 🏆 | **3.3** 🏆 | **1.82 M** 🏆 |
| glm-5-1 | 46.4 | 10.05 | 8.5 | 2.96 M |
| gemini-3-5-flash | 52.2 | 15.63 | 14.9 | 2.80 M |
| deepseek-v4-flash | 44.8 | 13.10 | 9.8 | 2.71 M |
| kimi-k2-6\* | 22.4 | 9.9 | 8.3 | 2.28 M |
| deepseek-v4-pro\* | 24.6 | 9.53 | 7.0 | 2.82 M |

\* not trophy-eligible (verification_pct < 1.0).

The median LoC/function of 3.3 (vs 7.0–14.9 for the others) means: Opus consistently extracts small helpers. At `cc_avg_loc_per_function` Opus, at 7.59, is about half the size of Gemini Flash (15.63) and 40 % more compact than DeepSeek-V4-Flash (13.10).

---

## F-1.2 — GLM 5.1 holds the Opus level in complexity

GLM 5.1 reaches values equal to or better than Opus 4.7 across `smell_total`, `cognitive_*` and `mccabe_max`. Both clearly beat Gemini Flash and DeepSeek-V4-Flash (cognitive-max spread 1.6–4.4 points).

| Metric | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash | deepseek-v4-flash |
|---|---|---|---|---|
| smell_total | 3.6 | **2.8** 🏆 | 4.0 | 4.0 |
| cognitive_max | **11.4** 🏆 | **11.6** 🏆 | 16.0 | 13.2 |
| cognitive_avg | **8.03** 🏆 | **7.8** 🏆 | 14.07 | 8.78 |
| mccabe_max | 7.6 | **7.0** 🏆 | 10.4 | 9.4 |
| mccabe_avg | **2.91** 🏆 | 3.39 | 6.0 | 3.99 |

GLM 5.1 thereby confirms here too (game-of-life) the impression from RQ-model-novel-oc (claim-office): near-Opus quality at OpenRouter prices. In code volume, however, Opus is clearly more compact (F-1.1).

---

## F-1.3 — Kimi-K2 writes too few tests, fails external verification

5/5 Kimi runs report `tests_passing=true`, but only 2/5 reach `verification_pct = 1.0` (the rest: 0.20, 0.27, 0.40). Mean `tests_total` is the lowest at 7.0 (vs Opus 9.4, GLM 9.8, Flash 8.4, deepseek-flash 9.2) with the highest spread (std 2.74, range 4–9).

Pattern: Kimi minimizes the test list and then implements only what its own reduced suite demands — the internal vitest runs green, but the external `game-of-life-verification` suite uncovers cases Kimi never tested in the first place. This is exactly the pattern `claim-office-verification` was originally built against: internally green tests are no proof of correctness.

| Run | verification_pct | tests_total |
|---|---|---|
| 1 | 1.00 | 9 |
| 2 | 1.00 | 9 |
| 3 | 0.40 | 7 |
| 4 | 0.27 | 6 |
| 5 | 0.20 | 4 |

---

## F-1.4 — Gemini 3.5 Flash: fast, but the most complex code

At 153 s/run Flash is by far the fastest (Opus 231 s, deepseek-flash 612 s, GLM 835 s, Kimi 1083 s, deepseek-pro 2381 s) and reaches full correctness, but writes the most complex code: highest `cognitive_max` (16), `cognitive_avg` (14.07), `mccabe_max` (10.4), `mccabe_avg` (6.0) and the longest functions on average (cc_avg 15.63 vs Opus 7.59). Trade-off: speed against maintainability.

---

## F-1.5 — Skill-tool compliance is model-dependent

v5.1-oc requires prediction markers per red phase. Across the six models four different compliance profiles emerge:

| Model | predictions_total (mean) | predictions_correct (mean) | Compliance profile |
|---|---|---|---|
| deepseek-v4-pro | **6.2** 🏆 | 5.6 (90%) | Consistent, format-faithful |
| opus-4-7-portkey | **4.8** 🏆 | 4.8 (100%) | Consistent, format-faithful |
| glm-5-1 | 4.4 | 4.4 (100%) | Consistent, format-faithful |
| kimi-k2-6 | 2.0 | 2.0 (100%) | Partial, drifts into inline mode |
| deepseek-v4-flash | 1.4 | 1.4 (100%) | Partial, drifts into inline mode |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | Ignores the format almost entirely |

Where predictions are written, they are nearly 100 % correct — i.e. the marker drop is not an accuracy problem, but a question of format compliance. Confirms H3 from the RQ README: a low `cycle_count` (Flash 7.0) with a low `predictions_total` (0.4) is not "weak TDD discipline", but a failure to recognize the skill format. At the same time deepseek-v4-pro shows the highest skill compliance with 6.2 predictions_total — and also the highest `cycle_count` (7.6).

---

## F-1.6 — DeepSeek-V4-Flash: cheapest path to the correct solution

DeepSeek-V4-Flash reaches full external correctness (5/5 perfect, std 0.00) at a per-run cost of ~$0.10 — an order of magnitude below the next-cheapest models (GLM-5.1 $0.74, deepseek-v4-pro $0.37, gemini-flash and kimi $1.06). At `tests_total` (9.2) and `mccabe_avg` (3.99) it sits mid-field, in code size (LoC 44.8, code_mass 189) at the upper end — the trade-off is clear: cheap + correct vs compact.

| Model | $/perfect-run | duration | LoC | cognitive_max |
|---|---|---|---|---|
| **deepseek-v4-flash** | **$0.10** 🏆 | 612 s | 44.8 | 13.2 |
| glm-5-1 | $0.74 | 835 s | 46.4 | **11.6** 🏆 |
| gemini-3-5-flash | $1.06 | **153 s** 🏆 | 52.2 | 16.0 |
| opus-4-7-portkey | $1.84 | 231 s | **38.2** 🏆 | **11.4** 🏆 |

For pure correctness without a complexity requirement, Flash is 18× cheaper than Opus here. The code-volume premium (44.8 vs 38.2 LoC) is small.

---

## F-1.7 — DeepSeek-V4-Pro: skill-compliance champion, but tail risk in duration

With `predictions_total = 6.2` and `cycle_count = 7.6`, DeepSeek-V4-Pro produces the most structured TDD chain of all models — beyond Opus (4.8) and GLM (4.4). Prediction accuracy stays high at 90 % (5.6/6.2).

BUT: 1 of 5 runs hit the 7202 s container timeout (`verification_pct = 0.27`, `tests_passing = false`); the mean duration is the highest of all models at 2381 s and extremely variable at std=2704 s (range 854–7202 s). The other 4 runs are stable at ~1100 s with perfect verification.

| Run | duration_s | verification_pct | predictions_total | cycle_count |
|---|---|---|---|---|
| 1 (timeout) | 7202 | 0.27 | 3 | 6 |
| 2 | 1326 | 1.00 | 6 | 7 |
| 3 | 854 | 1.00 | 5 | 8 |
| 4 | 1417 | 1.00 | 7 | 8 |
| 5 | 1107 | 1.00 | 11 | 9 |

The finding parallels the skill-loop issue documented for Gemini 2.5 Pro in the RQ README, but in milder form (4/5 instead of 0/3 successes). For production use Pro needs auto-recovery mechanics or a shorter timeout — in the lab setting the `completed_within_budget = 80 %` signal is sufficient.
