# RQ-model-quality-oc — Findings

**Setup**: game-of-life-example-mapping × exact-single-context-v2-testlist-fix-oc × n=5 per cell (30 runs total, all completed). The two DeepSeek cells are Requesty/tensorx only (`deepseek-v4-{flash,pro}-requesty`, all runs from 2026-10-19). As of 2026-10-19.

## Overview

Code quality as primary outcome (lower = better except where noted); correctness (`verification_pct`, higher = better) as gating precondition.

| Metric | Direction | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash | kimi-k2-6 | deepseek-v4-flash-requesty | deepseek-v4-pro-requesty |
|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | higher | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | 0.57 | **1.00** 🏆 | **1.00** 🏆 |
| `verification_pct` (std) | lower | **0.00** 🏆 | **0.00** 🏆 | **0.00** 🏆 | 0.40 | **0.00** 🏆 | **0.00** 🏆 |
| `tests_passing` (rate) | higher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| `completed_within_budget` (rate) | higher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| `smell_total` (mean) | lower | 3.6 | 2.8 | 4.0 | 4.4 | **0.4** 🏆 | **0.8** 🏆 |
| `cognitive_max` (mean) | lower | 11.4 | 11.6 | 16.0 | 9.4 | **8.2** 🏆 | **9.6** 🏆 |
| `cognitive_avg` (mean) | lower | 8.03 | 7.8 | 14.07 | 8.4 | **5.23** 🏆 | **6.17** 🏆 |
| `mccabe_max` (mean) | lower | **7.6** 🏆 | **7.0** 🏆 | 10.4 | 7.6 | **7.6** 🏆 | **8.2** 🏆 |
| `mccabe_avg` (mean) | lower | **2.91** 🏆 | **3.39** 🏆 | 6.0 | 4.85 | **3.2** 🏆 | **3.35** 🏆 |
| `longest_function` (mean) | lower | **18.6** 🏆 | **19.8** 🏆 | **18.6** 🏆 | 15.2 | **15.2** 🏆 | 20.8 |
| `avg_loc_per_function` (mean) | lower | **7.59** 🏆 | 10.05 | 15.63 | 9.9 | 12.52 | 12.0 |
| `median_loc_per_function` (mean) | lower | **3.3** 🏆 | 8.5 | 14.9 | 8.3 | 11.8 | 11.6 |
| `code_mass` (mean) | lower (at equal correctness) | **160.4** 🏆 | 193.4 | 200.0 | 111.0 | 177.6 | **171.6** 🏆 |
| `lines_of_code` (mean) | lower (at equal correctness) | **38.2** 🏆 | 46.4 | 52.2 | 22.4 | **39.0** 🏆 | **40.0** 🏆 |
| `tests_total` (mean) | higher | **9.4** 🏆 | **9.8** 🏆 | 8.4 | 7.0 | **9.0** 🏆 | **9.8** 🏆 |
| `cycle_count` (legacy, mean) | — | 3.0 | 2.2 | 7.0 | 5.0 | —¹ | —¹ |
| `refactorings_applied` (legacy, mean) | — | 1.6 | 2.4 | 3.6 | 3.4 | —¹ | —¹ |
| `predictions_total` (mean) | higher (skill compliance) | **4.8** 🏆 | **4.4** 🏆 | 0.4 | 2.0 | **5.8** 🏆 | 1.8 |
| `duration_seconds` (mean) | lower | 231 | 835 | 153 | 1083 | 407 | **126** 🏆 |
| `total_tokens` (mean) | lower | **1.82 M** 🏆 | 2.96 M | 2.80 M | 2.28 M | 2.45 M | **1.62 M** 🏆 |
| `cost_usd` (mean, $/run) | lower (at equal correctness) | $1.84 | $0.74 | $1.06 | $1.06 | **$0.24** 🏆 | $0.81 |
| `cost_usd` (mean, $/perfect-run) | lower | $1.84 | $0.74 | $1.06 | $2.65 | **$0.24** 🏆 | $0.81 |

**Trophy rule on correctness gating**: Trophies for quality/efficiency metrics go only to models with mean `verification_pct ≥ 0.90`. Kimi-K2 drops out of the pool at 0.57 mean (3 of 5 runs below 0.5) — its low `cognitive_max` (9.4), low `lines_of_code` (22.4), low `code_mass` (111.0) and short functions are partly stub artifacts (too few tests).

**Tie rule**: a cell shares the trophy when its gap to the row's best value is smaller than the smaller of the two cells' σ. That is why several rows carry three or four 🏆 — on `mccabe_max`, `mccabe_avg` and `longest_function` the eligible field is not separable.

¹ The DeepSeek runs carry only the phase-chain metrics; the legacy counters `cycle_count` and `refactorings_applied` are not written for them. Both are ambivalent anyway (more cycles ≠ better, depending on skill compliance) — no trophy. `predictions_total` is exceptionally noted with a direction here: it measures compliance with the single-context-v2 skill format.

**DeepSeek route**: both DeepSeek cells run through Requesty with backprovider `tensorx`. On that route `deepseek-v4-pro` emits no reasoning tokens in any of its five runs, while `deepseek-v4-flash` reasons (17.0 k reasoning tokens per run on average). The pro cell is therefore a non-reasoning configuration — see F-1.8.

**Cost calculation**: per run from `transcript-metrics.json.total_tokens` × pricing per 1M tokens; `reasoning` tokens are billed at the output rate. `cost_usd` is not a declared outcome of this RQ, so these values are computed here, not taken from `runs.csv`. The price sources differ by model and date: Anthropic pricing page (Opus), OpenRouter API (GLM/Kimi) and Vertex Standard (Gemini Flash) as of 2026-05-28; the Requesty model list (tensorx) as of 2026-10-19 for both DeepSeek cells (`research/model-pricing.md`).

| Model | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| deepseek-v4-flash (Requesty tensorx) | $0.25 | $0.30 | $0.06 |
| deepseek-v4-pro (Requesty tensorx) | $1.75 | $3.50 | $0.44 |

No gateway markup included.

**Cost breakdown per mean run** (tokens as mean over n=5):

| Model | input → cost | output (+reasoning) → cost | cache_read → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 116 k × $5.00 = $0.58 | 16.9 k × $25.00 = $0.42 | 1.68 M × $0.50 = $0.84 | **$1.84** |
| glm-5-1 | 144 k × $0.98 = $0.14 | 30.9 k × $3.08 = $0.10 | 2.79 M × $0.18 = $0.50 | **$0.74** |
| kimi-k2-6 | 371 k × $0.73 = $0.27 | 27.7 k × $3.49 = $0.10 | 1.88 M × $0.37 = $0.70 | **$1.06** |
| gemini-3-5-flash | 400 k × $1.50 = $0.60 | 11.2 k × $9.00 = $0.10 | 2.39 M × $0.15 = $0.36 | **$1.06** |
| deepseek-v4-flash-requesty | 430 k × $0.25 = $0.11 | 33.9 k × $0.30 = $0.01 | 1.99 M × $0.06 = $0.12 | **$0.24** |
| deepseek-v4-pro-requesty | 39.4 k × $1.75 = $0.07 | 12.9 k × $3.50 = $0.05 | 1.57 M × $0.44 = $0.69 | **$0.81** |

`$/perfect-run` scales with the share of runs with `verification_pct = 1.0`: Kimi $1.06/run × (5/2 verified) = **$2.65** per correct solution. Other models 5/5 verified → unchanged.

The pro cell's cost is dominated by cache reads (1.57 M tokens at $0.44): it sends little fresh input (39.4 k against 430 k for flash) but pays 7× flash's cache-read rate.

---

## F-1.1 — Opus 4.7 writes the smallest functions

Opus delivers the smallest functions (`avg_loc_per_function`, `median_loc_per_function`) **at full external correctness**. In overall size it is not separable from the DeepSeek cells: `lines_of_code` is level with both (38.2 against 39.0 / 40.0), Code Mass (APP) with deepseek-v4-pro (160.4 against 171.6), all within one σ. Token consumption is level with deepseek-v4-pro (1.82 M against 1.62 M) and below the other four models (2.28–2.96 M).

| Model | lines_of_code | code_mass | avg_loc_per_function | median_loc_per_function | total_tokens |
|---|---|---|---|---|---|
| **opus-4-7-portkey** | **38.2** 🏆 | **160.4** 🏆 | **7.59** 🏆 | **3.3** 🏆 | **1.82 M** 🏆 |
| deepseek-v4-pro-requesty | **40.0** 🏆 | **171.6** 🏆 | 12.0 | 11.6 | **1.62 M** 🏆 |
| deepseek-v4-flash-requesty | **39.0** 🏆 | 177.6 | 12.52 | 11.8 | 2.45 M |
| glm-5-1 | 46.4 | 193.4 | 10.05 | 8.5 | 2.96 M |
| gemini-3-5-flash | 52.2 | 200.0 | 15.63 | 14.9 | 2.80 M |
| kimi-k2-6\* | 22.4 | 111.0 | 9.9 | 8.3 | 2.28 M |

\* not trophy-eligible (`verification_pct` < 0.90).

The median LoC/function of 3.3 (vs 8.3–14.9 for the others) means: Opus consistently extracts small helpers. The DeepSeek cells write about as many lines, but in fewer, longer functions (`median_loc_per_function` 11.6–11.8). At `avg_loc_per_function` Opus, at 7.59, is about half the size of Gemini Flash (15.63).

---

## F-1.2 — GLM 5.1 holds the Opus level in complexity

GLM 5.1 reaches values equal to or better than Opus 4.7 across `smell_total`, `cognitive_*` and `mccabe_*`. Both clearly beat Gemini Flash (`cognitive_max` gap 4.4–4.6 points). The lowest complexity in the field belongs to the DeepSeek cells (F-1.9).

| Metric | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash |
|---|---|---|---|
| smell_total | 3.6 | **2.8** | 4.0 |
| cognitive_max | **11.4** | 11.6 | 16.0 |
| cognitive_avg | 8.03 | **7.8** | 14.07 |
| mccabe_max | 7.6 | **7.0** | 10.4 |
| mccabe_avg | **2.91** | 3.39 | 6.0 |

Bold marks the better of Opus and GLM per row; trophies across the full field are in the Overview. GLM 5.1 thereby confirms here too (game-of-life) the impression from RQ-model-novel-oc (claim-office): near-Opus quality at OpenRouter prices. In function size, however, Opus is clearly more compact (F-1.1).

---

## F-1.3 — Kimi-K2 writes too few tests, fails external verification

5/5 Kimi runs report `tests_passing=true`, but only 2/5 reach `verification_pct = 1.0` (the rest: 0.20, 0.27, 0.40). Mean `tests_total` is the lowest at 7.0 (vs Opus 9.4, GLM 9.8, Gemini Flash 8.4, deepseek-flash 9.0, deepseek-pro 9.8) with the highest spread (std 2.74, range 4–9).

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

At 153 s/run Gemini Flash is the second-fastest model (deepseek-pro 126 s, Opus 231 s, deepseek-flash 407 s, GLM 835 s, Kimi 1083 s) and reaches full correctness, but writes the most complex code: highest `cognitive_max` (16.0), `cognitive_avg` (14.07), `mccabe_max` (10.4), `mccabe_avg` (6.0) and the longest functions on average (`avg_loc_per_function` 15.63 vs Opus 7.59). Trade-off: speed against maintainability.

---

## F-1.5 — Skill-tool compliance is model-dependent

v5.1-oc requires prediction markers per red phase. Across the six models four different compliance profiles emerge:

| Model | predictions_total (mean) | predictions_correct (mean) | Compliance profile |
|---|---|---|---|
| deepseek-v4-flash-requesty | **5.8** 🏆 | 5.8 (100%) | High mean, erratic (per run 14 / 8 / 3 / 2 / 2) |
| opus-4-7-portkey | **4.8** 🏆 | 4.8 (100%) | Consistent, format-faithful |
| glm-5-1 | **4.4** 🏆 | 4.4 (100%) | Consistent, format-faithful |
| kimi-k2-6 | 2.0 | 2.0 (100%) | Partial, drifts into inline mode |
| deepseek-v4-pro-requesty | 1.8 | 1.6 (89%) | Partial, drifts into inline mode |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | Ignores the format almost entirely |

Where predictions are written, they are nearly 100 % correct — i.e. the marker drop is not an accuracy problem, but a question of format compliance. Confirms H3 from the RQ README: a low `cycle_count` (Gemini Flash 7.0) with a low `predictions_total` (0.4) is not "weak TDD discipline", but a failure to recognize the skill format. deepseek-flash has the highest mean but not the most consistent compliance: two runs carry most of it (14 and 8), the other three write 2–3 predictions, so its σ (5.22) is the largest in the field. The three leading cells are within 1 σ of each other, hence three 🏆.

---

## F-1.6 — DeepSeek-V4-Flash: cheapest path to the correct solution

DeepSeek-V4-Flash reaches full external correctness (5/5 perfect, std 0.00) at a per-run cost of ~$0.24 — about 3× below the next-cheapest model (GLM-5.1 $0.74) and 7.7× below Opus ($1.84). It does not pay for this in code quality: it has the lowest `smell_total` (0.4) and `cognitive_max` (8.2) in the field and is level with Opus in `lines_of_code` (39.0 against 38.2). Its weakness is function size (`median_loc_per_function` 11.8 against 3.3 for Opus).

| Model | $/perfect-run | duration | LoC | cognitive_max |
|---|---|---|---|---|
| **deepseek-v4-flash-requesty** | **$0.24** 🏆 | 407 s | **39.0** 🏆 | **8.2** 🏆 |
| glm-5-1 | $0.74 | 835 s | 46.4 | 11.6 |
| deepseek-v4-pro-requesty | $0.81 | **126 s** 🏆 | **40.0** 🏆 | **9.6** 🏆 |
| gemini-3-5-flash | $1.06 | 153 s | 52.2 | 16.0 |
| opus-4-7-portkey | $1.84 | 231 s | **38.2** 🏆 | 11.4 |

The cost comparison crosses price sources (tensorx list prices 2026-10 for DeepSeek, OpenRouter/Vertex/Anthropic 2026-05 for the others, see Overview); the gap to GLM (3×) is large enough not to hinge on that.

---

## F-1.8 — DeepSeek-V4-Pro on tensorx runs without reasoning: fastest cell, weakest skill compliance among the DeepSeek cells

On the Requesty/tensorx route `deepseek-v4-pro` emits 0 reasoning tokens in all five runs; `deepseek-v4-flash` on the same route emits 17.0 k per run. The pro cell is the fastest in the field and the leanest in tokens, while staying at full correctness:

| Metric | deepseek-v4-pro-requesty | deepseek-v4-flash-requesty |
|---|---|---|
| reasoning tokens (mean) | 0 | 17.0 k |
| `duration_seconds` | **126** (σ 6.04) | 407 (σ 75.39) |
| `total_tokens` | **1.62 M** | 2.45 M |
| `verification_pct` | 1.00 | 1.00 |
| `predictions_total` | 1.8 | **5.8** |

The duration gap is far outside both σ (126 ± 6 against 407 ± 75, and 153 ± 28 for the next-fastest model, Gemini Flash). Skill compliance is low — 1.8 predictions per run, one run with none — but that cannot be pinned on the missing reasoning: flash's mean rests on two runs (F-1.5). On game-of-life, the non-reasoning configuration loses no correctness and no code quality against its reasoning sibling.

---

## F-1.9 — The DeepSeek cells write the least smelly and least complex code

Both DeepSeek cells lead the field in `smell_total`, `cognitive_max` and `cognitive_avg`, at full correctness:

| Metric | deepseek-v4-flash-requesty | deepseek-v4-pro-requesty | best other eligible cell |
|---|---|---|---|
| `smell_total` | **0.4** (σ 0.89) | **0.8** (σ 1.79) | 2.8 (GLM, σ 2.68) |
| `cognitive_max` | **8.2** (σ 1.64) | **9.6** (σ 4.72) | 11.4 (Opus, σ 4.83) |
| `cognitive_avg` | **5.23** (σ 2.18) | **6.17** (σ 2.87) | 7.8 (GLM, σ 2.93) |

The `smell_total` gap to the rest of the field (0.4–0.8 against 2.8–4.0) exceeds the DeepSeek cells' σ; four of five runs in each DeepSeek cell have zero smells. The complexity gaps are smaller relative to their σ, but point the same way in both cells. The lead does not extend to `mccabe_max`, where every eligible cell but Gemini Flash is inseparable, or to function size, where Opus stays ahead (F-1.1).
