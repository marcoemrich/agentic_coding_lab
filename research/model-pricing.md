# Token Prices Coding Models (as of 2026-05-29)

Sources: Anthropic API (claude.com/pricing), OpenRouter API (`/api/oneshot-v1/models`).
All prices in USD per 1M tokens.

## Requesty prices pi-harness models (as of 2026-07-25)

For the current pi/Requesty models (RQ-model-novel-pi, RQ-model-quality-pi, RQ-harness-requesty). Requesty charges the upstream provider price (no markup according to the vendor; an older state mentioned 5 %). Prices = **live Requesty catalogue** (`curl https://router.eu.requesty.ai/oneshot-v1/models`), per route from the `pi_model` map in `experiments/docker/run-batch.sh`. All prices USD per 1M tokens.

| lab-variant | Requesty route | Input | Output | Cache Read | Cache? |
|---|---|---:|---:|---:|:--:|
| opus-4-8 | `vertex/claude-opus-4-8@eu` | $5.50 | $27.50 | $0.55 | yes |
| opus-5-requesty | `vertex/claude-opus-5@eu` | $5.50 | $27.50 | $0.55 | yes |
| sonnet-5 | `vertex/claude-sonnet-5@eu` | $2.20 | $11.00 | $0.22 | yes |
| gpt-5-6-sol | `azure/gpt-5.6-sol@swedencentral` | $5.00 | $30.00 | $0.50 | yes |
| gpt-5-6-terra | `azure/gpt-5.6-terra@swedencentral` | $2.50 | $15.00 | $0.25 | yes |
| glm-5-1 | `nebius/zai-org/glm-5.1` | $1.40 | $4.40 | $1.40 | **no** |
| glm-5-2 | `tensorx/glm-5.2` | $1.50 | $4.50 | $0.38 | yes |
| kimi-k2-7 | `tensorx/kimi-k2.7-code` | $1.25 | $4.50 | $0.31 | yes |
| kimi-k3 | `sference/kimi-k3` | $2.25 | $11.25 | $0.225 | yes |
| kimi-k3-nebius | `nebius/kimi-k3` | $3.00 | $15.00 | $3.00 | **no** |
| minimax-m3 | `tensorx/minimax-m3` | $0.40 | $2.00 | $0.10 | yes |
| deepseek-v4-pro | `tensorx/deepseek-v4-pro` | $1.75 | $3.50 | $0.44 | yes |
| qwen3-235b | `nebius/qwen/qwen3-235b-a22b-instruct-2507` | $0.20 | $0.60 | $0.20 | **no** |

Notes:
- These values deliberately deviate from the **native** Anthropic list prices: on the vertex routes Requesty is ~10 % higher (opus-4-8 $5.50/$27.50 instead of $5.00/$25.00 native). In the current run pool ALL `opus-4-8` runs go over pi/Requesty, which is why the shared lab-variant in `compute-cost.py` carries the Requesty tariff.
- **`sonnet-5` is the Requesty route, not the model.** The native Direct-API route of the same model is called `sonnet-5-native` ($2.00/$10.00/$0.20, table "Overview") and is a cell of its own. The naming direction here is the reverse of `opus-5` / `opus-5-requesty`: the bare name was already taken by the pi route when the native one was added. Runs of the two routes are not interchangeable in cost comparisons.
- **`supports_caching=false`** (glm-5-1, qwen3-235b, kimi-k3-nebius): Requesty bills cache_read at the full input price → in `compute-cost.py`, `cache_read = input` is set (no discount).
- **kimi-k3** has two lab-variants for two routes: `kimi-k3` (sference, primary route) and `kimi-k3-nebius` (fallback, `run-batch.sh:749`). The tariffs differ markedly (sference ~25 % cheaper and with cache discount) — runs of the two routes are not interchangeable in cost comparisons.
- Cache write is not reported separately on the OpenAI/GLM/Kimi/MiniMax/DeepSeek routes → carried as 0 in `compute-cost.py`.
- Requesty rotates models/providers quickly — on deviations, diff the live catalogue against `compute-cost.py` `PRICES` and `experiments/docker/pi-config/agent/models.json`.

## OpenAI subscription route (openai-codex, as of 2026-09-05)

The three models that pi reaches over `openai-codex` (`chatgpt.com/backend-api`, OAuth).
**Nothing is billed per token on this route** — the values
are pure comparison prices: what the same work would have cost over the API,
on the same basis as the Requesty cells they are compared against.

| lab-variant | pi route | Input | Output | Cache Read | Cache Write |
|---|---|---:|---:|---:|---:|
| gpt-5-6-sol-codex | `openai-codex/gpt-5.6-sol` | $5.00 | $30.00 | $0.50 | $6.25 |
| gpt-6-astra-codex | `openai-codex/gpt-6-astra` | $10.00 | $50.00 | $1.00 | $12.50 |
| gpt-5-3-codex-spark | `openai-codex/gpt-5.3-codex-spark` | $1.75 | $14.00 | $0.175 | $0 |

Sources (each independently cross-checked, 2026-09-05): Astra —
[OpenAI API-Docs](https://developers.openai.com/api/docs/models/gpt-6-astra),
[OpenRouter](https://openrouter.ai/openai/gpt-6-astra),
[pi.dev](https://pi.dev/models/openai/gpt-6-astra); Spark —
[pi.dev](https://pi.dev/models/openai/gpt-5-3-codex-spark),
[OpenRouter](https://openrouter.ai/openai/gpt-5.3-codex).

Notes:
- **Cache write is irrelevant on this route**, even though it is reported: across
  all 119 codex runs in the pool, `cache_write` = 0 tokens. `compute-cost.py`
  therefore carries it as 0, as on the other OpenAI routes.
- **The long-context tariff jump is deliberately NOT modelled.** Sol and Astra
  bill requests above 272k input at 2× input/cache and 1.5× output
  (Astra: $20/$75/$2). `compute-cost.py` calculates flat. The values are thus
  a **lower bound** for runs with large single requests — consistent across all
  cells, which is what counts for the comparison, but not a billed amount.
- **pi's own inline costs are not the source** and must not become it.
  They are not reproducible from our token counts: a least-squares fit
  over 83 codex runs yields a *negative* input price at 33.6 % mean
  error — presumably because the tariff jumps apply per request and behave
  nonlinearly in the sum. `compute-cost.py` PRICES is the sole source
  for all pi runs, both routes (`cli_model == "pi-only"`).
- Astra's context window is **disputed**: OpenRouter states 1,050,000,
  [pi.dev](https://pi.dev/models/openai/gpt-6-astra) states 272,000.
  `models.json` follows pi.dev; the 272k from the price sources is the
  tariff boundary, not necessarily the limit. Under-declaration is the safe
  direction.
- Spark is carried in `models.json` with contextWindow 272000 / maxTokens 128000,
  pi.dev states 128,000 / 32,000. That is an **over**-declaration and
  thus the unsafe direction — unverified, noted here only.

Older sources (for traceability): [Requesty GLM-5.2](https://www.requesty.ai/models/zai/glm-5.2), [aipricing.guru GPT-5.6](https://www.aipricing.guru/openai-pricing/).

## Overview

| Model | Input | Output | Cache Read |
|---|---:|---:|---:|
| Claude Opus 5 | $5.00 | $25.00 | $0.50 |
| Claude Opus 4.8 | $5.00 | $25.00 | $0.50 |
| Claude Opus 4.7 | $5.00 | $25.00 | $0.50 |
| Claude Sonnet 5 | $2.00 | $10.00 | $0.20 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 |
| Moonshot Kimi K2.6 | $0.73 | $3.49 | $0.37 |
| Z-AI GLM 5.1 | $0.98 | $3.08 | $0.18 |
| MiniMax M2.7 | $0.28 | $1.20 | – |
| DeepSeek V4 Pro | $0.44 | $0.87 | – |
| Qwen3-Coder-Plus | $0.65 | $3.25 | – |
| OpenAI GPT-5.5 | $5.00 | $30.00 | – |
| OpenAI GPT-5.3-Codex | $1.75 | $14.00 | – |

## Notes

- **GPT-5.5-codex does not exist** on OpenRouter. Available: `gpt-5.5` ($5/$30), `gpt-5.5-pro` ($30/$180). The newest Codex build is `gpt-5.3-codex` (March 2026).
- **DeepSeek V4 Pro** is the current flagship. The V4 family no longer has a separate Coder variant — Pro is coding-capable.
- **Qwen3-Coder-Plus** is the paid flagship variant. Alternatives: `qwen3-coder-next` (preview, $0.11/$0.80), `qwen3-coder` (480B base, $0.22/$1.80).
- **Kimi K2.6** price fluctuates between providers ($0.73–$0.77 input / $3.49–$4.00 output); the main price is given above.
- **Opus 4.7/4.8** support prompt caching (cache hit = 10% of the base input price). Opus 4.8 has token tariffs identical to 4.7. Kimi and GLM also offer cache reads via OpenRouter.
- **Fast mode** (Research Preview): Opus 4.7 = $30/$150, Opus 4.8 = $10/$50 (4.8 is markedly cheaper in fast mode).

## Relative order of magnitude

Per 1M tokens in equal parts input/output:

1. DeepSeek V4 Pro — **$0.66**
2. MiniMax M2.7 — **$0.74**
3. Qwen3-Coder-Plus — **$1.95**
4. GLM 5.1 — **$2.03**
5. Kimi K2.6 — **$2.11**
6. GPT-5.3-Codex — **$7.88**
7. Sonnet 4.6 — **$9.00**
8. Opus 4.7 — **$15.00**
9. GPT-5.5 — **$17.50**

## Opus 4.7 vs DeepSeek V4 Pro

- ~11× more expensive on input, ~29× on output.
- Coding workloads are output-heavy → realistically more like a 20–25× factor.
- With prompt caching active on Opus (cache hit $0.50/M), the input share drops markedly.

## Further DeepSeek variants (for comparison)

| Model | Input | Output |
|---|---:|---:|
| deepseek-v4-flash | $0.10 | $0.20 |
| deepseek-v4-flash:free | $0 | $0 |
| deepseek-v3.2 | $0.252 | $0.378 |
| deepseek-v3.2-speciale | $0.287 | $0.431 |
| deepseek-v3.1-terminus | $0.27 | $0.95 |
| deepseek-r1-0528 | $0.50 | $2.15 |

## Further OpenAI Codex variants

| Model | Input | Output |
|---|---:|---:|
| gpt-5-codex | $1.25 | $10.00 |
| gpt-5.1-codex | $1.25 | $10.00 |
| gpt-5.1-codex-max | $1.25 | $10.00 |
| gpt-5.1-codex-mini | $0.25 | $2.00 |
| gpt-5.2-codex | $1.75 | $14.00 |
| gpt-5.3-codex | $1.75 | $14.00 |
