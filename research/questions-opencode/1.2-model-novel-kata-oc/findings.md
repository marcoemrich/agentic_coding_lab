# RQ-model-novel-oc — Findings

**Setup**: claim-office-example-mapping × exact-single-context-v2-testlist-fix-oc × n=5 per cell (40 runs total, 8 models). As of 2026-10-19.

**DeepSeek cells**: `deepseek-v4-flash-requesty` and `deepseek-v4-pro-requesty`, both on Requesty → tensorx, all five runs per cell from 2026-10-19. On this route `deepseek-v4-pro` emits no reasoning tokens in any run; `deepseek-v4-flash` reasons (1.6–28 k reasoning tokens per run, except the run that stopped after 14 s). The cells describe the model on this route, not DeepSeek V4 in general.

## Overview

Correctness (external) (`verification_pct`, higher = better) as primary outcome; code-quality metrics secondary (lower = better except where noted).

| Metric | Direction | opus-4-7-portkey | glm-5-1 | deepseek-v4-pro-requesty | mistral-medium-3-5 | kimi-k2-6 | gemini-3-5-flash | deepseek-v4-flash-requesty | minimax-m2-7 |
|---|---|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | higher | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | 0.95 | 0.84 | 0.80 | 0.55 | 0.04 |
| `verification_pct` (std) | lower | **0.00** 🏆 | **0.00** 🏆 | **0.00** 🏆 | 0.09 | 0.26 | 0.45 | 0.51 | 0.09 |
| `smell_total` (mean) | lower | **0.8** 🏆 | 4.0 | 8.2 | 23.8 | 20 | 18 | 0 | 10.2 |
| `cognitive_max` (mean) | lower | **9.8** 🏆 | 12.2 | 18.0 | 77.6 | 21.8 | 40.2 | 5.2 | 11.4 |
| `mccabe_max` (mean) | lower | **7.6** 🏆 | 9.2 | 9.4 | 34.6 | 17.6 | 23.4 | 4.4 | 7.6 |
| `longest_function` (mean) | lower | **25.4** 🏆 | 28.8 | 34.6 | 122.8 | 54.4 | 98.4 | 15.6 | 30.0 |
| `code_mass` (mean) | lower (at comparable correctness) | 759.6 | 816 | **695.4** 🏆 | **721.8** 🏆 | 741 | 526 | 407.2 | 364.4 |
| `total_tokens` (mean) | lower (at comparable correctness) | 8.06 M | 10.97 M | **3.59 M** 🏆 | 15.84 M | 6.67 M | 7.05 M | 6.10 M | 8.52 M |
| `cost_usd` (mean, $/run) | lower (at comparable correctness) | $5.90 | **$2.10** 🏆 | **$1.75** 🏆 ‡ | $23.03 † | $2.78 | $2.23 | $0.49 ‡ | $2.40 |
| `predictions_total` (mean) | — | 2.4 | 4.0 | 1.6 | 1.6 | 0.4 | 0.4 | 16.0 | 2.6 |
| `duration_seconds` (mean) | lower | 664 | 1726 | **242** 🏆 | 5747 | 1811 | 395 | 767 | 1428 |

`predictions_total` is ambivalent without a clear direction — no trophy. For `code_mass`, `total_tokens` and `cost_usd` less is better, but only meaningful at comparable correctness: MiniMax's low values are a stub artifact (verification 0.04), Gemini Flash's values are pulled by the 3-LoC abort run (see F-1.2), DeepSeek V4 Flash's low complexity and Code Mass (APP) are pulled by two runs that stopped after 14 s and 242 s with nearly nothing written (F-1.8), and Kimi (0.84), Gemini Flash (0.80) and DeepSeek V4 Flash (0.55) lie below the gating threshold — hence no trophy in each of those cases. Cost efficiency at actually usable correctness: see F-1.6.

‡ DeepSeek costs are priced at the Requesty/tensorx list rates, the other models at the rates in the table below. For DeepSeek V4 Pro 88 % of the cost is cache reads (3.51 M × $0.44 = $1.54 of $1.75).

† Mistral cost is dominated by missing OpenCode prompt caching (no `prompt_cache_key`); with caching active the value would be ~$3.00/run instead of $23.03. Details in the cost section and F-1.7.

**Trophy rule on correctness gating**: Trophies for quality/efficiency metrics (`smell_*`, `cognitive_*`, `mccabe_*`, clean-code metrics (`production_loc`, `functions`, `longest_function`, `avg_loc_per_function`, `median_loc_per_function`), `duration_seconds`, `total_tokens`, `cost_usd`, `code_mass`) are awarded only to cells with mean `verification_pct ≥ 0.90`. Rationale: low complexity / short duration / low cost with a non-correct implementation does not measure what the metric claims to measure, but stub or abort artifacts. The threshold admits Opus 4.7 (1.00), GLM 5.1 (1.00), DeepSeek V4 Pro (1.00) and Mistral Medium 3.5 (0.95). Trophy allocation within this pool: Opus wins smells and complexity; DeepSeek V4 Pro wins `total_tokens` and wallclock outright. Two rows carry shared trophies because the gap lies inside the spread: Code Mass (APP) (DeepSeek V4 Pro 695.4 ± 101.5, Mistral 721.8 ± 133.3) and cost (DeepSeek V4 Pro $1.75 ± $0.66 per run, GLM 5.1 $2.10). The Mistral Code Mass (APP) value is not a coverage artifact: its 12/15 run carries the cell's largest Code Mass (APP) (923), so the low mean does not come from dropped scenarios. Mistral's complexity values remain the worst of the whole field — see F-1.7.

**Cost calculation**: per run from `transcript-metrics.json.total_tokens` × pricing per 1M tokens. Sources 2026-05-26: Anthropic pricing page (Opus), OpenRouter API `/api/oneshot-v1/models` (GLM/Kimi/MiniMax), Vertex Standard (Gemini Flash), Mistral Docs model card (Mistral Medium 3.5); 2026-10-19: Requesty model list (DeepSeek on tensorx).

| Model | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| minimax-m2-7 (OpenRouter) | $0.279 | $1.20 | $0.279 (no cache rate listed by OpenRouter → input rate as a conservative upper bound) |
| mistral-medium-3-5 (Mistral Direct) | $1.50 | $7.50 | $0.15 (10% of the input rate, per the Mistral docs [Prompt caching](https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching)) |
| deepseek-v4-flash-requesty (Requesty tensorx) | $0.25 | $0.30 | $0.06 |
| deepseek-v4-pro-requesty (Requesty tensorx) | $1.75 | $3.50 | $0.44 |

Requesty rates also in `research/model-pricing.md`. Portkey markup not included (Portkey lists no model-specific surcharge, gateway plan costs are separate tier flat rates).

**Cost breakdown per mean run** (tokens as mean over n=5, cost columns = tokens × rate):

| Model | input (mean) → cost | output (mean) → cost | cache_read (mean) → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 143 k × $5.00 = $0.71 | 50.2 k × $25.00 = $1.25 | 7.86 M × $0.50 = $3.93 | **$5.90** |
| glm-5-1 | 143 k × $0.98 = $0.14 | 7.7 k × $3.08 = $0.02 | 10.77 M × $0.18 = $1.94 | **$2.10** |
| kimi-k2-6 | 649 k × $0.73 = $0.47 | 26.8 k × $3.49 = $0.09 | 5.97 M × $0.37 = $2.21 | **$2.78** |
| gemini-3-5-flash | 635 k × $1.50 = $0.95 | 35.7 k × $9.00 = $0.32 | 6.35 M × $0.15 = $0.95 | **$2.23** |
| minimax-m2-7 | 234 k × $0.279 = $0.07 | 38.4 k × $1.20 = $0.05 | 8.21 M × $0.279 = $2.29 | **$2.40** |
| mistral-medium-3-5 | 15.00 M × $1.50 = $22.49 | 56.2 k × $7.50 = $0.42 | 0.79 M × $0.15 = $0.12 | **$23.03** |
| deepseek-v4-flash-requesty | 633 k × $0.25 = $0.16 | 34.9 k × $0.30 = $0.01 | 5.42 M × $0.06 = $0.33 | **$0.49** |
| deepseek-v4-pro-requesty | 51.9 k × $1.75 = $0.09 | 32.0 k × $3.50 = $0.11 | 3.51 M × $0.44 = $1.54 | **$1.75** |

Note: the `total_tokens` field in the overview table is misleading about cost — e.g. Opus' "8 M tokens" are ~97 % `cache_read`, which under Anthropic pricing costs only 10 % of the input price (cache hit ↔ 0.1×). Real input per Opus run is ~140 k tokens; the cache tokens come from repeatedly loaded system prompts/tool definitions, which in the skill workflow are traversed multiple times over several skill calls per run. For the OpenRouter models the cache ratio is similar, but the cache rate varies per provider (GLM $0.18, Kimi $0.37, MiniMax no cache rate listed → input rate as a conservative upper bound). The same holds for DeepSeek V4 Pro on tensorx: the fewest tokens in the field (3.59 M), but a cache rate of $0.44 per 1M, so cache reads make up 88 % of its cost.

**The Mistral cost outlier is an OpenCode integration artifact, not Mistral pricing**: Mistral Medium 3.5 falls massively out of the range at $23.03/run (3.9× Opus, 11× GLM). The cause is not the model pricing rate ($1.50/$7.50 is comparable to Gemini Flash), but the **caching behavior of the OpenCode-Mistral integration**. Token distribution for Mistral: 95 % `input`, 5 % `cache_read`. For Opus: 1.4 % `input`, 98 % `cache_read`. Mistral does indeed have a prompt cache rate of 10 % of the input rate ($0.15/M), but caching is explicitly **opt-in via `prompt_cache_key`** in the Mistral API ([Mistral Docs / Prompt caching](https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching)). OpenCode, or rather the `@ai-sdk/openai-compatible` provider NPM it uses, does not set this key — hence only the ~5 % of tokens that Mistral recognizes automatically via KV-cache prefix match end up in the cache.

Hypothetical scenarios with `prompt_cache_key` active (same token volume, but 99 % cache hit as with Opus on Anthropic):

| Scenario | Cache hit rate | Mistral cost/run | Comparison |
|---|---|---|---|
| As-measured (OpenCode status quo) | ~5 % | $23.03 | 3.9× Opus |
| With moderate caching | ~70 % | $9.18 | 1.6× Opus, 4.4× GLM |
| With aggressive caching (Anthropic level) | ~99 % | $3.00 | ~half of Opus, ~40 % above GLM |

In a model comparison that holds the OpenCode harness constant, the status-quo value ($23.03) is the relevant figure — because that is what a production OpenCode pipeline actually costs today. But: **the cost result is therefore not a robust model finding about Mistral**, it hangs on the integration detail. With the Mistral direct API plus a `prompt_cache_key` patch, or with another harness with native caching support, Mistral would land in the GLM/Sonnet cost range.

For non-cacheable workloads (CI/CD pipelines that reset containers without a cache, multi-tenant without a shared cache) the status-quo value would by contrast be the realistic one — there Opus' 12× cost advantage from the cache_read trick also disappears.

n_cost basis: all cost values are computed on n=5 per cell from `transcript-metrics.json` token buckets × the rates above.

---

## F-1.1 — Opus 4.7, GLM 5.1 and DeepSeek V4 Pro reach full correctness; trade-off code quality ↔ cost and speed

Three models achieve perfect correctness (external) across all 5 replicates (15/15 in every run, `verification_pct = 1.00 ± 0.00`): Opus 4.7, GLM 5.1 and DeepSeek V4 Pro. On the secondary axes the choice is a clear trade-off:

| Metric | opus-4-7-portkey | glm-5-1 | deepseek-v4-pro-requesty | Best |
|---|---|---|---|---|
| `smell_total` mean ± std | 0.8 ± 0.45 | 4.0 ± 6.16 | 8.2 ± 11.5 | Opus |
| `cognitive_max` mean ± std | 9.8 ± 1.79 | 12.2 ± 4.15 | 18.0 ± 21.26 | Opus |
| `mccabe_max` mean | 7.6 | 9.2 | 9.4 | Opus |
| `longest_function` mean | 25.4 | 28.8 | 34.6 | Opus |
| Code Mass (APP) mean ± std | 759.6 ± 33.8 | 816 ± 68.6 | 695.4 ± 101.5 | DeepSeek Pro smallest, Opus tightest |
| `duration_seconds` mean | 664 | 1726 | 242 | DeepSeek Pro 2.7× faster than Opus |
| `total_tokens` mean | 8.06 M | 10.97 M | 3.59 M | DeepSeek Pro |
| **`cost_usd` / run** | **$5.90** | **$2.10** | **$1.75** | **DeepSeek Pro and GLM, within σ** |

GLM 5.1 shows two bimodal code-quality runs (smell 14 and 6) among three clean ones (smell 0). DeepSeek V4 Pro has the same shape more strongly: three clean runs (`smell_total` 0, `cognitive_max` 8–10) and two that are not (`smell_total` 17, and one run with `smell_total` 24, `cognitive_max` 56, `longest_function` 84). That one run carries the cell's complexity means. Correctness remains unaffected by it in both models.

Pattern: For a pure **correctness guarantee** DeepSeek V4 Pro and GLM 5.1 are the cheaper choices at the same determinism; DeepSeek Pro is also by far the fastest (~4 min per run against ~29 min for GLM) and runs without any reasoning on this route. If code quality (readability, complexity) is a hard goal, the Opus premium pays off — Opus is the only one of the three without a code-quality outlier run. Mistral Medium 3.5 comes close on correctness (vpt=0.95, σ=0.09) but is classified by an opposing profile (high complexity, highest cost), see F-1.7.

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
| deepseek-v4-flash-requesty | 16.0 | 16.0 (100%) | 0.55 |
| glm-5-1 | 4.0 | 4.0 (100%) | 1.00 |
| minimax-m2-7 | 2.6 | 2.2 (85%) | 0.04 |
| opus-4-7-portkey | 2.4 | 2.4 (100%) | 1.00 |
| deepseek-v4-pro-requesty | 1.6 | 1.6 (100%) | 1.00 |
| mistral-medium-3-5 | 1.6 | 1.6 (100%) | 0.95 |
| kimi-k2-6 | 0.4 | 0.4 (100%) | 0.84 |
| gemini-3-5-flash | 0.4 | 0.4 (100%) | 0.80 |

The highest prediction frequency in the field belongs to the second-weakest cell: DeepSeek V4 Flash at 16.0/run with 0.55 correctness — and that mean is one run with 61 predictions (11/15), the other four have 0–8. GLM 4.0/run reaches perfect correctness, MiniMax 2.6/run near-zero. Kimi and Gemini Flash largely ignore the format (0.4/run), DeepSeek V4 Pro and Mistral use it sparingly (1.6/run), and all four still sit at or near the top. Marker compliance measures the adoption of the workflow affordance, not the TDD substance. Confirms H4 from the RQ README.

---

## F-1.5 — Code Mass spread within a model: Flash and MiniMax bimodal/wide

`code_mass` and `cycle_count` show very different spreads per model:

| Model | code_mass range | code_mass std | cycle_count range |
|---|---|---|---|
| opus-4-7-portkey | 717–797 | 34 | 1–2 |
| glm-5-1 | 705–877 | 69 | 1–3 |
| kimi-k2-6 | 674–800 | 58 | 1–3 |
| mistral-medium-3-5 | 589–923 | 133 | 0–2 |
| gemini-3-5-flash | 3–680 | 293 | 1–4 |
| minimax-m2-7 | 18–700 | 290 | 1–18 |
| deepseek-v4-pro-requesty | 589–855 | 101 | — |
| deepseek-v4-flash-requesty | 0–684 | 352 | — |

`cycle_count` is a legacy metric the DeepSeek runs (2026-10-19) no longer carry, hence —. DeepSeek V4 Flash has the widest Code Mass (APP) spread of the field: three runs at 651–684, two at 0 and 45 (the early stops in F-1.8).

Opus, GLM and Kimi consistently write ~700–880 LoC with moderate spread (std 34–69); Mistral sits in between at std 133 and, despite high test counts (23–66 tests per run, see F-1.7), writes only 1.2 cycles on average — Mistral produces large test batches in one sweep instead of classic red-green-refactor steps. Flash and MiniMax trigger the "it was done" heuristic variably — Flash can abort at 3 LoC (see F-1.2 bimodality), MiniMax varies between a minimal stub and a full implementation. `cycle_count = 18` in one MiniMax run (outlier) points to loop behavior without completion — the run did complete within budget (`completed_within_budget = true`), but the number of red skill calls is 9× higher than the median.

Conclusion: the workflow self-abort heuristic is model-dependent; it does not reliably protect against "model stops too early" (Flash bimodality), "model loops until the budget cap" (MiniMax outlier) or "model skips cycles and writes everything at once" (Mistral profile).

---

## F-1.6 — Cost efficiency per perfect run: DeepSeek V4 Pro and GLM 5.1 deterministic AND cheap

In the simple "cost per run" view (overview table) DeepSeek V4 Flash ($0.49) and then DeepSeek V4 Pro ($1.75), GLM ($2.10), Gemini Flash ($2.23) and MiniMax ($2.40) look cheapest, Mistral ($23.03) falls clearly out of the range. More meaningful is the question: what does a **guaranteed perfect** run cost (verification 1.00, i.e. 15/15), including the retries that would be needed for the failures?

| Model | n_perfect / n | $/run (mean) | $/perfect run (cond.) | expected $/perfect result (with retry) |
|---|---|---|---|---|
| deepseek-v4-pro-requesty | 5/5 | 1.75 | 1.75 | **$1.75** 🏆 (deterministic) |
| glm-5-1 | 5/5 | 2.10 | 2.10 | **$2.10** 🏆 (deterministic) |
| opus-4-7-portkey | 5/5 | 5.90 | 5.90 | $5.90 (deterministic) |
| mistral-medium-3-5 | 3/5 | 23.03 | 22.97 | $38.39 † |
| deepseek-v4-flash-requesty | 2/5 | 0.49 | 0.37 | ($1.23) |
| gemini-3-5-flash | 4/5 | 2.23 | 2.69 | $2.78 |
| kimi-k2-6 | 3/5 | 2.78 | 2.72 | $4.63 |
| minimax-m2-7 | 0/5 | 2.40 | — | ∞ (no perfect run in n=5) |

"Expected" = total cost of the 5 runs / number of perfect runs — operationally: if a perfect result is the goal and non-perfect runs are discarded, then this is the cost-per-acceptance figure. Trophies follow the correctness gate (cell mean `verification_pct ≥ 0.90`); the four cells below it are listed after the gated pool.

DeepSeek V4 Pro and GLM 5.1 share the lead: both deterministically perfect (5/5), $1.75 and $2.10 per run, a gap inside DeepSeek's per-run spread ($1.05–2.83, σ $0.66). Both are ~3× cheaper than Opus' $5.90 at the same reliability. Kimi and Gemini Flash have a reliability tail: Kimi degrades (3/5 perfect) and rises in expectation to $4.63; Gemini Flash has one total fail (4/5 → $2.78 expected). MiniMax drops out entirely.

DeepSeek V4 Flash would compute to $1.23 per perfect result, the lowest figure in the table, but carries no trophy: at 2/5 perfect runs and 0.55 mean correctness it is below the gate, and the figure rests on two runs that stopped after 14 s and 242 s and therefore cost almost nothing ($0.01 and $0.09). A retry strategy around Flash would be paying for runs that end before they start, not for runs that fail at the spec.

Mistral writes perfect correctness in 3/5 runs, but under the current OpenCode caching behavior the expected cost per perfect result is $38.39. † This figure is integration-specific: with `prompt_cache_key` active (see cost section) the per-run cost would be ~$3.00, the expected-perfect cost ~$5.00 — which puts Mistral just below the Opus level cost-wise, with clearly weaker code quality (F-1.7). Status quo, without a caching patch, Mistral is the most expensive choice among the vpt ≥ 0.8 models in this study.

Operationally: for a pure correctness guarantee DeepSeek V4 Pro or GLM 5.1; Opus remains relevant for high code-quality demands (F-1.1). The DeepSeek figures are priced at the tensorx list rate, where 88 % of the Pro cost is cache reads at $0.44 per 1M — a provider with a cheaper cache tier would move Pro clearly below GLM.

† Mistral cost in the OpenCode harness is dominated by missing prompt caching, not by Mistral pricing — see the cost section above.

---

## F-1.8 — DeepSeek V4 Flash: early stops dominate over spec comprehension; Pro is deterministic

The two DeepSeek V4 variants split on this route. Pro is perfect in all five runs; Flash fails three times, and two of the three failures are not attempts at the spec at all.

| Model | verification distribution (n=5, by start time) | mean | std |
|---|---|---|---|
| deepseek-v4-pro-requesty | 15, 15, 15, 15, 15 | 1.00 | 0.00 |
| deepseek-v4-flash-requesty | 15, 0, 11, 0, 15 | 0.55 | 0.51 |

The two Flash zero runs are **early stops**, not spec misunderstandings (as in F-1.3 with MiniMax) and not provider errors. In both the model announced its next step in prose and then ended its turn (`finish = stop` on the last message, no error in the transcript, no `experiment-done.txt`):
- After 14 s, while announcing the test list: nothing written, Code Mass (APP) 0, `tests_passing = false`.
- After 242 s, while announcing the next red phase: 2 tests, Code Mass (APP) 45, no `src/cli.ts` (`cli_built = false`).

The third miss is a full run of a different kind: 1549 s, `experiment-done.txt` written, 11/15, and 61 predictions — far above the 0–8 of every other Flash run (see F-1.4).

On the runs that complete, Flash's code is the cleanest of the field, and Pro's is close to the GLM level apart from one run:

| Metric | deepseek-v4-flash-requesty (n=2, only vpt=1.0) | deepseek-v4-pro-requesty (n=5, all vpt=1.0) |
|---|---|---|
| `smell_total` mean | 0 | 8.2 |
| `cognitive_max` mean | 8.5 | 18.0 |
| `mccabe_max` mean | 7.0 | 9.4 |
| `longest_function` mean | 23.5 | 34.6 |
| Code Mass (APP) mean | 667.5 | 695.4 |
| `tests_total` mean | 44.0 | 33.0 |
| `predictions_total` mean | 7.5 | 1.6 |
| `duration_seconds` mean | 1015 | 242 |
| `cost_usd` mean | $0.37 | $1.75 |

Pro's means carry one run with `cognitive_max` 56 and `longest_function` 84; its other four runs sit at `cognitive_max` 8–10 and `longest_function` 18–28.

Methodological conclusion: Flash's mean correctness of 0.55 mixes three things — two runs that stop on their own before doing the work, one run that completes with a partial spec, and two perfect runs. **The mean is misleading here**: it says neither "the model fails systematically at the kata" (like MiniMax) nor "the model is unreliable at the spec". The dominant failure mode is the turn ending after a prose announcement, the same continuation drop observed with other open models on the pi harness. The workflow's instruction to continue until `experiment-done.txt` does not hold Flash in the loop; Pro, on the same workflow and route, never stopped early.

DeepSeek V4 Pro is classified in the top cluster unconditionally (F-1.1); DeepSeek V4 Flash below the gating threshold, with a code-quality profile that would place it at the top **conditional on the run not stopping early**.

---

## F-1.7 — Mistral Medium 3.5: high correctness against high complexity and highest cost

Mistral Medium 3.5 reaches `verification_pct = 0.95 ± 0.09` over n=5 replicates (distribution 15, 15, 14, 15, 12) — the second-highest correctness after Opus/GLM and with the second-smallest spread in the entire model set. On the secondary axes, however, an opposing profile to the other top models emerges:

| Metric | Mistral | Opus (reference) | GLM 5.1 (reference) |
|---|---|---|---|
| `verification_pct` mean ± std | 0.95 ± 0.09 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| `cognitive_max` mean (range) | 77.6 (54–107) | 9.8 (8–12) | 12.2 (8–18) |
| `mccabe_max` mean (range) | 34.6 (27–44) | 7.6 (6–9) | 9.2 (7–14) |
| `longest_function` mean (range) | 122.8 (0–256) | 25.4 (22–31) | 28.8 (23–39) |
| `smell_total` mean | 23.8 | 0.8 | 4.0 |
| `cycle_count` mean | 1.2 | 1.2 | 2.0 |
| `tests_total` mean (range) | 42.8 (23–66) | 25.6 (4–39) | 40.2 (35–44) |
| `duration_seconds` mean | 5747 | 664 | 1726 |
| `cost_usd` per run (OpenCode status quo) | $23.03 † | $5.90 | $2.10 |

Observations:

1. **Complexity 6–8× above Opus/GLM**: `cognitive_max` 77.6, `mccabe_max` 34.6, `longest_function` 122.8. Mistral achieves correctness through heavily nested and long code — the single longest function blows past the outlier range at 256 LoC, more than twice the next-highest model mean (98.4, Gemini Flash). Two runs report `longest_function` 0, so the cell mean understates the per-run peak.
2. **Many tests, few cycles**: 42.8 tests per run (GLM/Kimi level) at only 1.2 cycle calls — Mistral writes tests in large batches instead of classic TDD cycles. The workflow skill calls (red/green/refactor) are largely skipped; effectively a single-shot pattern with test-first preparation.
3. **Highest wallclock**: ~96 min per run, 8.7× Opus, 3.3× GLM (σ 4005 s, one run took 12529 s). Combined with the cost ($23.03/run in the current OpenCode setup), this yields the weakest efficiency point of the model set in the vpt ≥ 0.8 pool — with the caveat that the cost component is integration-driven (see below).

Pattern: Mistral Medium 3.5 is a **correctness-solid, code-quality-weak** model on this kata. The correctness tail (12/15 in one run, 14/15 in another) is limited, but code quality stays clearly below the top models. Conceivable for correctness-critical tasks without a code-quality requirement; for CI/CD integration with code-review requirements clearly inferior to Opus or GLM 5.1.

† Cost caveat: The $23.03 value measures Mistral-in-the-OpenCode-harness, not Mistral-as-a-model. OpenCode sets no `prompt_cache_key` for Mistral (Mistral API caching is opt-in), so 95 % of the tokens are billed as regular input instead of the 10 % cache tier. With aggressive caching (analogous to Opus on Anthropic, ~99 % cache hit) the per-run cost would be ~$3.00 — about half of Opus, ~40 % above GLM 5.1. **The cost finding is therefore an integration finding about OpenCode×Mistral, not a model finding about Mistral.** With the Mistral direct API plus a caching patch, another harness, or a non-cacheable workload (CI/CD without a shared cache) the ranking would look different. The code-quality, cycle and wallclock findings are unaffected by this — those are genuine model properties.
