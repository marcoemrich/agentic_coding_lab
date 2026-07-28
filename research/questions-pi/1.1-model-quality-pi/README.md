---
id: RQ-model-quality-pi
question: "How do the models reachable via the pi harness (Requesty routing) differ in code quality and TDD discipline on game-of-life-example-mapping with the v6.2.1-phase-continuation-pi workflow?"
factors:
  model:
    - opus-4-8            # current Opus (vertex/bedrock claude-opus-4-8@eu)
    - sonnet-5            # current Sonnet (vertex/claude-sonnet-5@eu)
    - gpt-5-6-sol         # GPT SOL (azure/gpt-5.6-sol@swedencentral)
    - gpt-5-6-terra       # GPT TERRA (azure/gpt-5.6-terra@swedencentral)
    - glm-5-1             # GLM 5.1 (nebius/zai-org/glm-5.1)
    - glm-5-2             # GLM 5.2 (tensorx/glm-5.2)
    - kimi-k2-7           # previous Kimi (tensorx/kimi-k2.7-code)
    - kimi-k3             # current Kimi (sference/kimi-k3)
    - minimax-m3          # MiniMax M3 (tensorx/minimax-m3)
    - deepseek-v4-pro     # DeepSeek V4 Pro (tensorx/deepseek-v4-pro)
    - qwen3-235b          # current Qwen (nebius/qwen/qwen3-235b-a22b-instruct-2507)
controls:
  workflow: v6.2.1-phase-continuation-pi
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primary: code quality (game-of-life carries the code-quality signal)
  - code_mass
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - lines_of_code
  - smell_total
  - smell_complexity
  - smell_magic_numbers
  - smell_duplication
  # secondary: correctness
  - verification_pct  # external (game-of-life-verification)
  - tests_passing     # internal (vitest)
  - tests_total
  # tertiary: TDD discipline
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # context
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-model-quality-pi: Model effect on code quality (pi harness)

## Motivation

With pi as the third harness (after Claude Code and OpenCode), models become reachable over another routing path: pi routes via **Requesty** (`provider=requesty`, `api:"openai-completions"`, bearer auth), which bundles GPT-5.x (Azure), kimi/minimax (Bedrock/Inceptron/TensorX), glm/deepseek (TensorX/Nebius), Gemini (Vertex) and Mistral/Nebius models under one OpenAI-compatible interface.

This RQ measures the **model effect on code quality and TDD discipline** in a harness-constant setting (all cells pi, all the same workflow, all the same kata). It is the **direct counterpart** to RQ-model-quality (Claude Code side) and RQ-model-quality-oc (OpenCode side) — but with `v6.2.1-phase-continuation-pi` as the workflow. The workflow difference must be named explicitly when comparing findings across harnesses, NO 1:1 transfer.

`game-of-life-example-mapping` as kata: carries the code-quality signal (`smell_total`, `cognitive_max`, etc. differentiate) and is example-mapping compatible (v6.2.1, like v6.2, permits all three prompt styles). claim-office is investigated in parallel in RQ-model-novel-pi (correctness as primary outcome).

## Harness status: walking skeleton

**As of 2026-07-24**: The lab-variant→pi model mappings for all `factors.model` values of this RQ are wired into `experiments/docker/run-batch.sh` (`harness = pi` branch, `case "$model_name"`), with IDs taken 1:1 from `pi-config/agent/models.json`:

| Lab variant | Requesty route |
|---|---|
| `opus-4-8` | `requesty/vertex/claude-opus-4-8@eu` |
| `sonnet-5` | `requesty/vertex/claude-sonnet-5@eu` |
| `gpt-5-6-sol` | `requesty/azure/gpt-5.6-sol@swedencentral` |
| `gpt-5-6-terra` | `requesty/azure/gpt-5.6-terra@swedencentral` |
| `glm-5-1` | `requesty/nebius/zai-org/glm-5.1` |
| `glm-5-2` | `requesty/tensorx/glm-5.2` |
| `kimi-k2-7` | `requesty/tensorx/kimi-k2.7-code` |
| `kimi-k3` | `requesty/sference/kimi-k3` |
| `minimax-m3` | `requesty/tensorx/minimax-m3` |
| `deepseek-v4-pro` | `requesty/tensorx/deepseek-v4-pro` |
| `qwen3-235b` | `requesty/nebius/qwen/qwen3-235b-a22b-instruct-2507` |

This RQ is initially **open (n=0)**: the mapping is in place, but the first batch is still missing for every model. Procedure identical to the start of `questions-opencode/`. The workflow `v6.2.1-phase-continuation-pi` specifically addresses the continuation drop at the test-list→red transition, which under `v6.2-with-why-cleaned-pi` caused kimi and minimax runs to abort (test list only, no `src/cli.ts`). Smoke evidence on claim-office × v6.2.1 (2026-07-25): kimi-k2-7 and minimax-m3-no-thinking now run autonomously through (`cli_built=true`, green tests, `experiment-done.txt`). Whether every model carries the loop stably to the end is to be checked per cell after the first batch.

## Existing data

- **As of 2026-07-24**: No game-of-life runs for any cell of this RQ. First batch completely open. (Existing pi runs on `v6.2-with-why-cleaned-pi` and `v6.2.1-phase-continuation-pi` are on claim-office, not on game-of-life — see RQ-model-novel-pi.)

## Model selection

The `factors.model` list is set by the user: current Opus + Sonnet (Anthropic anchor, comparable across harnesses to `-oc`/CC), GPT-5.6 **SOL and TERRA** (intra-family variants, analogous to GLM 5.1/5.2), GLM 5.1 **and** 5.2 (direct intra-family version comparison), Kimi **K2.7 and K3** (third intra-family version comparison, added 2026-07-28), plus MiniMax M3, DeepSeek V4 Pro and current Qwen (qwen3-235b). Per model the same rule applies as for `-oc`: inclusion if the autonomous loop runs cleanly through under `v6.2.1-phase-continuation-pi` and `src/cli.ts` is written. Models that do not reliably finish the skill loop (continuation drop, done.txt with red tests, no cli.ts) are removed from the RQ with justification and documented here — analogous to the Gemini 2.5 Pro / Devstral / Codestral history in `questions-opencode/`. The test-list→red continuation drop that affected kimi/minimax under v6.2 is fixed in v6.2.1 (see harness status).

MiniMax and DeepSeek are deliberately included because they had clear, documented contrast profiles in the `-oc` counterpart: MiniMax = "internal tests green, external verification 0/15" (spec misunderstanding), DeepSeek-Pro = skill-compliance champion with duration tail risk. That makes the cross-harness comparison direct.

The backprovider path is implicitly pinned in every lab variant (Opus/Sonnet via Vertex EU, GPT via Azure, GLM-5.1 via Nebius, GLM-5.2 + Kimi-K2.7 + MiniMax + DeepSeek via TensorX, Kimi-K3 via Sference, Qwen via Nebius); a changing backprovider requires a new variant.

### kimi-k3: routing not yet stable (as of 2026-07-28)

`kimi-k3` is included as a factor level, but its **primary route is not yet proven runnable**. Smoke on game-of-life × `v6.6-lab-split-pi`, n=4:

| Route | Runs | Result |
|---|---|---|
| `requesty/sference/kimi-k3` | 2 | both dead — Requesty `502 "There was a problem with the provider stream"` after pi's own retry ladder; `src/` empty |
| `requesty/nebius/kimi-k3` | 2 | 1× `pi-retries-exhausted`, 1× clean (`tests_passing`, 8 tests, `cycle_count=12`, `predictions_total=8`) |

So one of four smoke runs produced usable data. Two consequences:

1. **Two of these smokes carry a stale `exit_reason: ok`.** pi exhausts its internal retry ladder, emits `auto_retry_end {success:false}` and exits 0 — so a run with an empty `src/` looked green. This is **fixed in the harness** (`344daa8c`, 2026-07-28): `run-batch.sh` matches the JSONL event and sets `exit_reason: pi-retries-exhausted`, which `aggregate-by-query.py` excludes from `completed_within_budget`. The fix landed *after* these four runs were scored, and `exit_reason` is written once by `record-run.sh` at batch time — `analyze-run.sh` never recomputes it, so `/reanalyze` does not repair them. Only the two 06:34/06:41 sference rows are affected; runs from `344daa8c` onward are labelled correctly. When reading those two rows, judge by `tests_total > 0` rather than exit code.
2. **`kimi-k3-nebius` is a separate lab variant, not a fallback that may be silently substituted.** Tariffs differ (`research/model-pricing.md`: sference $2.25/$11.25 with cache discount, nebius $3.00/$15.00 without), so `cost_usd` is not comparable across the two. If the fill is done over the nebius route, the cell must be relabelled `kimi-k3-nebius` and the route named in the findings — do **not** merge the two under `any:`, that would smear a ~25 % cost difference and the caching factor.

Inclusion decision is deferred until the fill batch: if sference stays at 502 and nebius does not reliably finish, kimi-k3 is dropped from the RQ with justification (same rule as the Gemini 2.5 Pro / Devstral / Codestral history in `questions-opencode/`).

### Not included / further candidates

- **Gemma**: **Not present** in `pi-config/agent/models.json` (no Gemma configured at Requesty). Only includable once a Gemma model is added to `models.json` and is routable via Requesty.
- **`gpt-5-6-luna`** (Azure) — third GPT-5.6 sibling next to SOL and TERRA; would spread the GPT branch further.
- **`gemini-2-5-pro`** (`vertex/gemini-2.5-pro@europe-west1`) — dropped in the `-oc` run because of the continuation drop; possibly more stable under v6.2.1 (explicit phase-continuation fix).
- **`qwen3-next-80b-a3b-thinking`** (Nebius) — thinking variant next to the included qwen3-235b, should the Qwen branch be spread.

## Hypotheses

- **H1 (Anthropic anchor)**: opus-4-8 and sonnet-5 deliver the lowest values for `cognitive_max` and `smell_total` and confirm that the Anthropic level is preserved over the Requesty routing as well (otherwise the pi harness is a worthless confound). Cross-check against the Opus values in RQ-model-quality-oc.
- **H1b (GLM version jump)**: glm-5-2 measurably improves `smell_total`/`cognitive_max` over glm-5-1 — direct intra-family version comparison within one cell matrix (both via different backproviders: 5.1 Nebius, 5.2 TensorX; note the backprovider confound as a caveat).
- **H1c (Kimi version jump)**: kimi-k3 measurably improves `smell_total`/`cognitive_max` over kimi-k2-7 — third intra-family version comparison next to GLM 5.1/5.2 and GPT SOL/TERRA. Backprovider confound as with GLM: K2.7 via TensorX, K3 via Sference. Testable only if the kimi-k3 routing stabilises (see "kimi-k3: routing not yet stable").
- **H2 (non-Anthropic spread)**: The non-Anthropic models (gpt-5-6-sol, glm-5-1, glm-5-2, kimi-k2-7, kimi-k3) show a measurable spread over `smell_total` and `cognitive_max` — i.e. the pi harness is discriminating enough to make model differences visible.
- **H3 (skill-tool compliance is model-dependent)**: `cycle_count` and `predictions_total` spread across the models — some use the v6.2.1 skill/subagent mechanism with discipline, others drift into inline mode. A low cycle_count is NOT automatically weaker TDD discipline, but also compliance with the pi skill affordance. (Parallel to the `-oc` finding: only some models produce prediction markers.)

## Methodological notes

- All models run via Requesty, but with different backproviders (Azure for GPT-5.x, Bedrock/Vertex for Anthropic/Gemini, TensorX/Nebius/Inceptron for the rest). Backprovider routing effects are implicitly pinned in the lab-variant IDs.
- `n=5` per cell follows memory [[replicates-n-reliability]] (default for a medium field).
- v6.2.1 enforces (like v6.2) test-first TDD with the why-block/skill mechanics. Observable drift in `cycle_count` (only part of the real cycles is captured via the skill/marker path) is a workflow-compliance property, not a parser bug. Distinguish in findings: "model A has higher TDD discipline" ≠ "model A uses the skill marker more often".
- TDD discipline metrics (`cycle_count`, `predictions_*`, `refactorings_applied`) depend on the pi transcript parser capturing the markers. v6.2.1 changes only the phase transition (test-list→red continuation), not the markers themselves — all of P1–P7 are unchanged. Before the first batch, verify that an Opus run yields these metrics != null (smoke-test rule from CLAUDE.md).
