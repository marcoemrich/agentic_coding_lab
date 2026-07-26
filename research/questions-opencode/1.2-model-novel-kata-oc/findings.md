# RQ-model-novel-oc — Findings

**Setup**: claim-office-example-mapping × v5.1-testlist-scope-fix-oc × n=5 per cell (40 runs total, 8 models). As of 2026-05-28.

## Overview

Correctness (external) (`verification_pct`, higher = better) as primary outcome; code-quality metrics secondary (lower = better except where noted).

| Metric | Direction | opus-4-7-portkey | glm-5-1 | mistral-medium-3-5 | kimi-k2-6 | gemini-3-5-flash | deepseek-v4-flash | deepseek-v4-pro | minimax-m2-7 |
|---|---|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | higher | **1.00** 🏆 | **1.00** 🏆 | 0.95 | 0.84 | 0.80 | 0.60 | 0.60 | 0.04 |
| `verification_pct` (std) | lower | **0.00** 🏆 | **0.00** 🏆 | 0.09 | 0.26 | 0.45 | 0.55 | 0.55 | 0.09 |
| `smell_total` (mean) | lower | **0.8** 🏆 | 4.0 | 23.6 | 20 | 18 | 13.4 | 16.6 | 10.2 |
| `cognitive_max` (mean) | lower | **9.8** 🏆 | 12.2 | 74.8 | 21.8 | 40.2 | 11.6 | 17.4 | 11.4 |
| `mccabe_max` (mean) | lower | **7.6** 🏆 | 9.2 | 33.6 | 17.6 | 23.4 | 9.2 | 11.0 | 7.6 |
| `cc_longest_function` (mean) | lower | **25.4** 🏆 | 28.8 | 120 | 54.4 | 98.4 | 31.6 | 42.2 | 30.0 |
| `code_mass` (mean) | lower (at equal correctness) | **759.6** 🏆 | 816 | 712.6 | 741 | 526 | 566.2 | 554.6 | 364.4 |
| `total_tokens` (mean) | lower (at equal correctness) | **8.06 M** 🏆 | 10.97 M | 13.65 M | 6.65 M | 7.02 M | 6.77 M | 4.46 M | 8.48 M |
| `cost_usd` (mean, $/run) | lower (at equal correctness) | $5.90 | **$2.10** 🏆 | $24.69 † | $2.78 | $2.23 | $0.28 ‡ | $0.11 ‡ | $2.40 |
| `cycle_count` (mean) | — | 1.2 | 2.0 | 1.2 | 2.0 | 2.2 | 3.2 | 2.6 | 4.8 |
| `predictions_total` (mean) | — | 2.4 | 4.0 | 0.8 | 0.4 | 0.4 | 2.0 | 2.6 | 2.6 |
| `duration_seconds` (mean) | lower | **664** 🏆 | 1726 | 4051 | 1811 | 395 | 1279 | 956 | 1428 |

`cycle_count` and `predictions_total` are ambivalent metrics without a clear direction — no trophy. For `code_mass`, `total_tokens` and `cost_usd` less is better, but only meaningful at comparable correctness: MiniMax's low values are a stub artifact (verification 0.04), Flash's values are pulled by the 3-LoC abort run (see F-1.2), DeepSeek-flash/pro lie clearly below the gating threshold at vpt=0.60, Mistral narrowly below it at vpt=0.95 — hence no trophy in each of those cases. Cost efficiency at actually usable correctness: see F-1.6.

‡ DeepSeek cost refers to all n=5 runs including the two CLI-contract aborts of 27 May. On the three perfect runs (vpt=1.0) the mean cost is $0.32 (flash) and $0.16 (pro) respectively — both therefore ~1/7 of GLM 5.1 and ~1/20 of Opus. Pricing source: OpenRouter API (`deepseek-v4-flash` paid tier $0.10/$0.20/$0.02 cache_read; `deepseek-v4-pro` $0.435/$0.87/$0.003625 cache_read per 1M tokens, as of 2026-05-28). The DeepSeek cost profile is real, the trophy is nonetheless not awarded because of gating — see F-1.8.

† Mistral cost is dominated by missing OpenCode prompt caching (no `prompt_cache_key`); with caching active the value would be ~$3.25/run instead of $24.69. Details in the cost section and F-1.7.

**Trophy rule on correctness gating**: Trophies for quality/efficiency metrics (`smell_*`, `cognitive_*`, `mccabe_*`, `cc_*`, `duration_seconds`, `total_tokens`, `cost_usd`) are awarded only to models with `verification_pct = 1.0`. Rationale: low complexity / short duration / low cost with a non-correct implementation does not measure what the metric claims to measure, but stub or abort artifacts. In this study Opus and GLM 5.1 are vpt=1.0 — both qualify. Trophy allocation within this pool: Opus wins code quality (smells, complexity, code mass) and wallclock; GLM 5.1 wins cost. `total_tokens` to Opus (8.06 M vs 10.97 M). Mistral at vpt=0.95 narrowly drops out of the pool — see F-1.7 for the Mistral-specific profile (high correctness paired with clearly higher complexity and cost values).

**Cost calculation**: per run from `transcript-metrics.json.total_tokens` × pricing per 1M tokens. Sources 2026-05-26: Anthropic pricing page (Opus), OpenRouter API `/api/v1/models` (GLM/Kimi/MiniMax), Vertex Standard (Gemini Flash), Mistral Docs model card (Mistral Medium 3.5).

| Model | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| minimax-m2-7 (OpenRouter) | $0.279 | $1.20 | $0.279 (no cache rate listed by OpenRouter → input rate as a conservative upper bound) |
| mistral-medium-3-5 (Mistral Direct) | $1.50 | $7.50 | $0.15 (10% of the input rate, per the Mistral docs [Prompt caching](https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching)) |
| deepseek-v4-flash (OpenRouter paid) | $0.10 | $0.20 | $0.02 |
| deepseek-v4-pro (OpenRouter) | $0.435 | $0.87 | $0.003625 |

Portkey markup not included (Portkey lists no model-specific surcharge, gateway plan costs are separate tier flat rates).

**Cost breakdown per mean run** (tokens as mean over n=5, cost columns = tokens × rate):

| Model | input (mean) → cost | output (mean) → cost | cache_read (mean) → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 143 k × $5.00 = $0.71 | 50.2 k × $25.00 = $1.25 | 7.86 M × $0.50 = $3.93 | **$5.90** |
| glm-5-1 | 143 k × $0.98 = $0.14 | 7.7 k × $3.08 = $0.02 | 10.77 M × $0.18 = $1.94 | **$2.10** |
| kimi-k2-6 | 649 k × $0.73 = $0.47 | 26.8 k × $3.49 = $0.09 | 5.97 M × $0.37 = $2.21 | **$2.78** |
| gemini-3-5-flash | 635 k × $1.50 = $0.95 | 35.7 k × $9.00 = $0.32 | 6.35 M × $0.15 = $0.95 | **$2.23** |
| minimax-m2-7 | 234 k × $0.279 = $0.07 | 38.4 k × $1.20 = $0.05 | 8.21 M × $0.279 = $2.29 | **$2.40** |
| mistral-medium-3-5 | 16.05 M × $1.50 = $24.08 | 63.2 k × $7.50 = $0.47 | 0.95 M × $0.15 = $0.14 | **$24.69** |
| deepseek-v4-flash | 1.73 M × $0.10 = $0.17 | 26.4 k × $0.20 = $0.005 | 4.99 M × $0.02 = $0.10 | **$0.28** |
| deepseek-v4-pro | 183 k × $0.435 = $0.08 | 20.8 k × $0.87 = $0.02 | 4.24 M × $0.003625 = $0.015 | **$0.11** |

Note: the `total_tokens` field in the overview table is misleading about cost — e.g. Opus' "8 M tokens" are ~97 % `cache_read`, which under Anthropic pricing costs only 10 % of the input price (cache hit ↔ 0.1×). Real input per Opus run is ~140 k tokens; the cache tokens come from repeatedly loaded system prompts/tool definitions, which in the skill workflow are traversed multiple times over several skill calls per run. For the OpenRouter models the cache ratio is similar, but the cache rate varies per provider (GLM $0.18, Kimi $0.37, MiniMax no cache rate listed → input rate as a conservative upper bound).

**The Mistral cost outlier is an OpenCode integration artifact, not Mistral pricing**: Mistral Medium 3.5 falls massively out of the range at $24.69/run (4× Opus, 12× GLM). The cause is not the model pricing rate ($1.50/$7.50 is comparable to Gemini Flash), but the **caching behavior of the OpenCode-Mistral integration**. Token distribution for Mistral: 93 % `input`, 7 % `cache_read`. For Opus: 1.4 % `input`, 98 % `cache_read`. Mistral does indeed have a prompt cache rate of 10 % of the input rate ($0.15/M), but caching is explicitly **opt-in via `prompt_cache_key`** in the Mistral API ([Mistral Docs / Prompt caching](https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching)). OpenCode, or rather the `@ai-sdk/openai-compatible` provider NPM it uses, does not set this key — hence only the ~5 % of tokens that Mistral recognizes automatically via KV-cache prefix match end up in the cache.

Hypothetical scenarios with `prompt_cache_key` active (same token volume, but 99 % cache hit as with Opus on Anthropic):

| Scenario | Cache hit rate | Mistral cost/run | Comparison |
|---|---|---|---|
| As-measured (OpenCode status quo) | ~5 % | $24.69 | 4× Opus |
| With moderate caching | ~70 % | $9.91 | Factor 2 below Opus, double GLM |
| With aggressive caching (Anthropic level) | ~99 % | $3.25 | Sonnet level, ~50 % above GLM |

In a model comparison that holds the OpenCode harness constant, the status-quo value ($24.69) is the relevant figure — because that is what a production OpenCode pipeline actually costs today. But: **the cost result is therefore not a robust model finding about Mistral**, it hangs on the integration detail. With the Mistral direct API plus a `prompt_cache_key` patch, or with another harness with native caching support, Mistral would land in the GLM/Sonnet cost range.

For non-cacheable workloads (CI/CD pipelines that reset containers without a cache, multi-tenant without a shared cache) the status-quo value would by contrast be the realistic one — there Opus' 12× cost advantage from the cache_read trick also disappears.

n_cost basis: Mistral cost computed on n=4 out of n=5 (1 run from 2026-05-26_10-32-44 had no `transcript-metrics.json` — presumably a tracking artifact from being started in parallel with the CC smoke). Verification, code-quality and wallclock values are all computed on n=5.

---

## F-1.1 — Opus 4.7 and GLM 5.1 reach full correctness; trade-off code quality ↔ cost

Two models achieve perfect correctness (external) across all 5 replicates (15/15 in every run, `verification_pct = 1.00 ± 0.00`): Opus 4.7 and GLM 5.1. On the secondary axes the choice is a clear trade-off:

| Metric | opus-4-7-portkey | glm-5-1 | Winner |
|---|---|---|---|
| smell_total mean ± std | 0.8 ± 0.45 | 4.0 ± 6.16 | Opus 5× better |
| cognitive_max mean ± std | 9.8 ± 1.79 | 12.2 ± 4.15 | Opus 24 % lower |
| mccabe_max mean | 7.6 | 9.2 | Opus 21 % lower |
| cc_longest_function mean | 25.4 | 28.8 | Opus 12 % lower |
| code_mass mean ± std | 759.6 ± 33.8 | 816 ± 68.6 | Opus 7 % smaller, half the spread |
| duration_seconds mean | 664 | 1726 | Opus 2.6× faster |
| **cost_usd / run** | **$5.90** | **$2.10** | **GLM 2.8× cheaper** |

GLM 5.1 shows two bimodal code-quality runs (smell 14 and 6) among three clean ones (smell 0) — that explains the σ spread. Correctness remains unaffected by it.

Pattern: For pure **correctness guarantee** GLM 5.1 is the clearly better choice (same determinism, ~a third of the cost, trade-off: ~2.6× wallclock and somewhat less clean code). If code quality (readability, complexity) is a hard goal, the Opus premium pays off. Mistral Medium 3.5 comes close (vpt=0.95, σ=0.09) and thematically belongs nearer to this cluster than to the Kimi/Flash bimodals — but is classified by an opposing profile (high complexity, highest cost), see F-1.7.

---

## F-1.2 — Kimi K2.6 and Gemini 3.5 Flash: top correctness with a variance tail

Both models achieve perfect verification in the majority of runs, but each drops off markedly once — the spread only shows at n=5:

| Model | verification distribution (n=5) | mean | std |
|---|---|---|---|
| kimi-k2-6 | 15, 15, 15, 12, 6 | 0.84 | 0.26 |
| gemini-3-5-flash | 15, 15, 15, 15, 0 | 0.80 | 0.45 |

Flash is **bimodal** (4× perfect, 1× total fail) — the 0/15 run additionally has `tests_passing = false` and `code_mass = 3` (a nearly empty implementation), so a workflow abort, not spec misunderstanding. Kimi degrades gradually (12/15, 6/15) without an internal test fail. Both reach top level, but n=5 reveals a reliability gap against Opus' deterministic perfection.

---

## F-1.3 — MiniMax M2.7: stable spec misunderstanding, not an isolated case

Over 5 replicates MiniMax achieves a hit only once at all (3/15), otherwise 0/15 (mean 0.04, std 0.09). 4 of 5 runs are green in the internal tests (`tests_passing = true`) with an average of 30.8 self-written tests — the model consistently builds a different spec than the verification suite expects. The smoke finding (n=1: 0/15) and the probe (n=3: 0,3,0) are fully confirmed.

| Run | verification | tests_passing | tests_total | code_mass |
|---|---|---|---|---|
| Replicates (n=5) | 0, 0, 0, 0, 3 | true ×4, false ×1 | 2–54 | 18–700 |

A classic claim-office ambiguity effect: the model reads the EM spec self-consistently, but divergently from the intended resolution. Confirms the construction of the kata as a robust filter for spec comprehension (memory `[[kata-construction-pretest-required]]`).

---

## F-1.4 — Prediction-format compliance is NOT predictive of correctness

The marker compliance of the v5.1-oc workflow (prediction lines in the red-phase block) does not correlate with `verification_pct`:

| Model | predictions_total | predictions_correct | verification_pct |
|---|---|---|---|
| glm-5-1 | 4.0 | 4.0 (100%) | 1.00 |
| minimax-m2-7 | 2.6 | 2.2 (85%) | 0.04 |
| opus-4-7-portkey | 2.4 | 2.4 (100%) | 1.00 |
| mistral-medium-3-5 | 0.8 | 0.8 (100%) | 0.95 |
| kimi-k2-6 | 0.4 | 0.4 (100%) | 0.84 |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | 0.80 |

The two most extreme prediction frequencies sit at opposite correctness ends: GLM 4.0/run with perfect correctness, MiniMax 2.6/run with near-zero correctness. Kimi, Flash and Mistral largely ignore the format (0.4–0.8/run) and still sit at or near the top. Marker compliance measures the adoption of the workflow affordance, not the TDD substance. Confirms H4 from the RQ README.

---

## F-1.5 — Code Mass spread within a model: Flash and MiniMax bimodal/wide

`code_mass` and `cycle_count` show very different spreads per model:

| Model | code_mass range | code_mass std | cycle_count range |
|---|---|---|---|
| opus-4-7-portkey | 717–797 | 34 | 1–2 |
| glm-5-1 | 705–877 | 69 | 1–3 |
| kimi-k2-6 | 674–800 | 58 | 1–3 |
| mistral-medium-3-5 | 589–877 | 117 | 0–2 |
| gemini-3-5-flash | 3–680 | 293 | 1–4 |
| minimax-m2-7 | 18–700 | 290 | 1–18 |

Opus, GLM and Kimi consistently write ~700–880 LoC with moderate spread (std 34–69); Mistral sits in between at std 117 and, despite high test counts (23–66 tests per run, see F-1.7), writes only 1.2 cycles on average — Mistral produces large test batches in one sweep instead of classic red-green-refactor steps. Flash and MiniMax trigger the "it was done" heuristic variably — Flash can abort at 3 LoC (see F-1.2 bimodality), MiniMax varies between a minimal stub and a full implementation. `cycle_count = 18` in one MiniMax run (outlier) points to loop behavior without completion — the run did complete within budget (`completed_within_budget = true`), but the number of red skill calls is 9× higher than the median.

Conclusion: the workflow self-abort heuristic is model-dependent; it does not reliably protect against "model stops too early" (Flash bimodality), "model loops until the budget cap" (MiniMax outlier) or "model skips cycles and writes everything at once" (Mistral profile).

---

## F-1.6 — Cost efficiency per perfect run: GLM 5.1 deterministic AND cheap

In the simple "cost per run" view (overview table) GLM ($2.10), Flash ($2.23) and MiniMax ($2.40) look cheapest, Mistral ($24.69) falls clearly out of the range. More meaningful is the question: what does a **guaranteed perfect** run cost (verification 1.00, i.e. 15/15), including the retries that would be needed for the failures?

| Model | n_perfect / n | $/run (mean) | $/perfect run (cond.) | expected $/perfect result (with retry) |
|---|---|---|---|---|
| deepseek-v4-pro | 3/5 | 0.11 | 0.16 | **$0.19** 🏆 ‡ |
| deepseek-v4-flash | 3/5 | 0.28 | 0.32 | $0.46 ‡ |
| glm-5-1 | 5/5 | 2.10 | 2.10 | $2.10 (deterministic) |
| opus-4-7-portkey | 5/5 | 5.90 | 5.90 | $5.90 (deterministic) |
| gemini-3-5-flash | 4/5 | 2.23 | 2.69 | $2.78 |
| minimax-m2-7 | 0/5 | 2.40 | — | ∞ (no perfect run in n=5) |
| kimi-k2-6 | 3/5 | 2.78 | 2.27 | $4.63 |
| mistral-medium-3-5 | 3/5 | 24.69 | 24.69 | $41.16 † |

"Expected" = total cost of the 5 runs / number of perfect runs — operationally: if a perfect result is the goal and non-perfect runs are discarded, then this is the cost-per-acceptance figure.

GLM 5.1 wins clearly: deterministically perfect (5/5) at $2.10/run, ~3× cheaper than Opus' $5.90 at the same reliability. Kimi and Flash compete on the cost axis, but both have a reliability tail: Kimi degrades (3/5 perfect) and rises in expectation to $4.63; Flash has one total fail (4/5 → $2.78 expected, just behind GLM but stochastic). MiniMax drops out entirely.

Mistral writes perfect correctness in 3/5 runs, but under the current OpenCode caching behavior the expected cost per perfect result is $41.16. † This figure is integration-specific: with `prompt_cache_key` active (see cost section) the per-run cost would be ~$3.25, the expected-perfect cost ~$5.42 — which puts Mistral at the Opus level cost-wise, with clearly weaker code quality (F-1.7). Status quo, without a caching patch, Mistral is the most expensive choice among the vpt ≥ 0.8 models in this study.

Trophy situation: On the **expected-perfect-cost** axis DeepSeek V4 Pro wins with $0.19 — a factor of ~11 cheaper than GLM 5.1 and ~31 cheaper than Opus. On the **deterministically perfect** axis (5/5) GLM 5.1 remains the most robust choice ($2.10, std=0); DeepSeek-pro/flash have only 3/5 with the CLI contract trap (F-1.8). Operationally: whoever builds retry logic around the kata runs cheapest per perfect result with DeepSeek pro; whoever cannot have a retry takes GLM. Opus remains relevant for high code-quality demands (F-1.1), not for a pure correctness guarantee.

† Mistral cost in the OpenCode harness is dominated by missing prompt caching, not by Mistral pricing — see the cost section above.

‡ The DeepSeek cost advantage is real (OpenRouter pricing $0.10–$0.87 per 1M tokens plus aggressive cache reads at $0.02–$0.0036/M), but the 3/5 correctness rating is half CLI-contract drop (F-1.8) — on the three perfect runs the model currently shows full level. A repetition with n=5 without the early smoke bias would presumably shift the expected cost toward determinism.

---

## F-1.8 — DeepSeek V4 (flash + pro): workflow-compat drop dominates over spec comprehension

Both DeepSeek V4 variants show a temporally separated bimodal picture at n=5: the two earliest runs (smokes from 2026-05-27) abort with verification 0/15, the three subsequent runs (2026-05-28) reach 15/15 verification.

| Model | verification distribution (n=5) | mean | std |
|---|---|---|---|
| deepseek-v4-flash | 0, 0, 15, 15, 15 | 0.60 | 0.55 |
| deepseek-v4-pro | 0, 0, 15, 15, 15 | 0.60 | 0.55 |

The two zero runs are **not** spec misunderstandings (as in F-1.3 with MiniMax), but mechanical CLI contract violations:
- `deepseek-v4-flash` (1st zero run): no `src/cli.ts` written — the verification suite cannot invoke the entry point (`code_mass = 0`, `tests_passing = false`).
- `deepseek-v4-flash` (2nd zero run): `cli.ts` present, but input-schema drift (`category/declaredValue` instead of `type`) — the suite yields empty stdout.
- `deepseek-v4-pro` analogously: once no `cli.ts`, once `runCLI()` defined but never called anywhere.

On the three perfect runs both models are correctness-stable and produce code quality close to the GLM level:

| Metric (n=3, only vpt=1.0) | deepseek-v4-flash | deepseek-v4-pro |
|---|---|---|
| `smell_total` mean | 17.3 | 21.7 |
| `cognitive_max` mean | 13.3 | 22.0 |
| `mccabe_max` mean | 10.7 | 14.0 |
| `cc_longest_function` mean | 40.7 | 51.3 |
| `code_mass` mean | 738 | 702 |
| `duration_seconds` mean | 1576 | 1163 |
| `cycle_count` mean | 4.3 | 2.7 |
| `tests_total` mean | 38.7 | 37.7 |
| `cost_usd` mean | $0.32 | $0.16 |

On the correct half the DeepSeek models are more capable than the overview suggests — code quality lies between GLM and Kimi, wallclock mid-field. The correct runs cannot be explained by "the model is weaker", only by "the model stumbles over the CLI wrapper contract in the early runs".

Methodological conclusion: the five-replicate picture mixes two different failure modes (workflow-compat drop vs. model performance) into a mean correctness of 0.60. **The mean is misleading here**: it says neither "the model fails systematically at the kata" (like MiniMax) nor "the model is good" — it only says "the model triggered a workflow-compat trap in this sample and then did not hit it again". Possible explanations for the split 27 May ↔ 28 May: (a) routing/provider-side stabilization at OpenRouter, (b) luck variance in sampling, (c) a slight container/plan change between the days. None of these is isolable in the data.

A follow-up measurement without the 27 May bias would allow a more precise characterization; on the current data both DeepSeek variants are classified in the top cluster **conditional on a successful CLI setup**, but **unconditionally** mid-field.

---

## F-1.7 — Mistral Medium 3.5: high correctness against high complexity and highest cost

Mistral Medium 3.5 reaches `verification_pct = 0.95 ± 0.09` over n=5 replicates (distribution 15, 15, 14, 15, 12) — the second-highest correctness after Opus/GLM and with the second-smallest spread in the entire model set. On the secondary axes, however, an opposing profile to the other top models emerges:

| Metric | Mistral | Opus (reference) | GLM 5.1 (reference) |
|---|---|---|---|
| `verification_pct` mean ± std | 0.95 ± 0.09 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| `cognitive_max` mean (range) | 74.8 (54–107) | 9.8 (8–12) | 12.2 (8–18) |
| `mccabe_max` mean (range) | 33.6 (27–44) | 7.6 (6–9) | 9.2 (7–14) |
| `cc_longest_function` mean (range) | 120 (0–242) | 25.4 (22–31) | 28.8 (23–39) |
| `smell_total` mean | 23.6 | 0.8 | 4.0 |
| `cycle_count` mean | 1.2 | 1.2 | 2.0 |
| `tests_total` mean (range) | 41 (23–66) | 25.6 (4–39) | 40.2 (35–44) |
| `duration_seconds` mean | 4051 | 664 | 1726 |
| `cost_usd` per run (OpenCode status quo) | $24.69 † | $5.90 | $2.10 |

Observations:

1. **Complexity 6–8× above Opus/GLM**: `cognitive_max` 74.8, `mccabe_max` 33.6, `cc_longest_function` 120. Mistral achieves correctness through heavily nested and long code — the single longest function blows past the outlier range at 242 LoC, twice as long as the next-highest model mean.
2. **Many tests, few cycles**: 41 tests per run (GLM/Kimi level) at only 1.2 cycle calls — Mistral writes tests in large batches instead of classic TDD cycles. The workflow skill calls (red/green/refactor) are largely skipped; effectively a single-shot pattern with test-first preparation.
3. **Highest wallclock**: ~67 min per run, 6× Opus, 2.3× GLM. Combined with the cost ($24.69/run in the current OpenCode setup), this yields the weakest efficiency point of the model set in the vpt ≥ 0.8 pool — with the caveat that the cost component is integration-driven (see below).

Pattern: Mistral Medium 3.5 is a **correctness-solid, code-quality-weak** model on this kata. The correctness tail (12/15 in one run, 14/15 in another) is limited, but code quality stays clearly below the top models. Conceivable for correctness-critical tasks without a code-quality requirement; for CI/CD integration with code-review requirements clearly inferior to Opus or GLM 5.1.

† Cost caveat: The $24.69 value measures Mistral-in-the-OpenCode-harness, not Mistral-as-a-model. OpenCode sets no `prompt_cache_key` for Mistral (Mistral API caching is opt-in), so 93 % of the tokens are billed as regular input instead of the 10 % cache tier. With aggressive caching (analogous to Opus on Anthropic, ~99 % cache hit) the per-run cost would be ~$3.25 — comparable to Sonnet, clearly above GLM 5.1. **The cost finding is therefore an integration finding about OpenCode×Mistral, not a model finding about Mistral.** With the Mistral direct API plus a caching patch, another harness, or a non-cacheable workload (CI/CD without a shared cache) the ranking would look different. The code-quality, cycle and wallclock findings are unaffected by this — those are genuine model properties.
