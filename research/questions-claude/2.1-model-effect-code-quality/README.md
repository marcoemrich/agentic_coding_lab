---
id: RQ-model-quality
question: "How strongly do the available models (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality on a training-known kata under the strongest workflow?"
factors:
  model:
    - fable-5
    - fable-5-no-thinking
    - opus-5
    - opus-5-no-thinking
    - opus-4-8
    - opus-4-8-no-thinking
    - opus-4-7
    - opus-4-7-no-thinking
    - opus-4-6-portkey
    - opus-4-6-portkey-no-thinking
    - sonnet-4-6
    - sonnet-4-6-no-thinking
controls:
  workflow: v4-exact-subagents
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primary: code quality
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  # secondary: correctness (internal + external)
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - completed_within_budget
  # context
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-model-quality: Model Effect on Code Quality

How strongly do the production-available models differentiate in code quality when workflow and kata are controlled?

## Motivation

Earlier findings (v1-generation RQ-3-model-and-thinking, deleted in `953841cb`, reachable via git history) show a model ranking on code quality under a weaker workflow setup. This RQ measures the effect **in isolation on the currently strongest workflow (v4-exact-subagents)** and for the first time compares Opus 4.6 ↔ Opus 4.7 ↔ Sonnet 4.6 directly, each with and without thinking. Correctness is measured alongside as a sanity check but is not the object of study — on Game of Life it is expected to be ≈ 100 % for these models.

Haiku is deliberately not included: in previous runs Haiku regularly falls below 100 % correctness on Game of Life, which invalidates the code-quality comparison (quality metrics are meaningful only on correct code).

## Models

| Lab variant | Thinking | API route |
|---|---|---|
| opus-5 | Adaptive (default) | Direct API |
| opus-5-no-thinking | Off | Direct API |
| fable-5 | Adaptive (default) | Direct API |
| fable-5-no-thinking | Off | Direct API |
| opus-4-8 | Adaptive (default) | Direct API |
| opus-4-8-no-thinking | Off | Direct API |
| opus-4-7 | Adaptive (default) | Direct API |
| opus-4-7-no-thinking | Off | Direct API |
| opus-4-6-portkey | Extended (default) | Portkey Gateway |
| opus-4-6-portkey-no-thinking | Off | Portkey Gateway |
| sonnet-4-6 | Extended (default) | Direct API |
| sonnet-4-6-no-thinking | Off | Direct API |

**Batch note**: Direct-API and Portkey variants **cannot run in the same batch** (different configuration / routing). `batch-plan-from-rq.py` generates a joint plan; when executing, either split it manually into two separate plan files or run two consecutive `batch.sh` runs. The `-portkey` suffix detection in `batch.sh` sets the matching config dir automatically — but mixed plans do not run.

**Fable 5 note**: `fable-5*` is (like `opus-4-8*`) not yet on Portkey/Vertex and runs only via the native Anthropic API (batch with blanked `ANTHROPIC_*` env vars, fallback to native OAuth). Fable 5 requires Claude Code CLI ≥ 2.1.170 (Docker image pinned accordingly).

**Opus 5 note**: `opus-5*` runs natively (`claude-opus-5`, Anthropic list price $5/$25). The native bypass in `run-batch.sh` (blanks `ANTHROPIC_BASE_URL`/`AUTH_TOKEN`/`CUSTOM_HEADERS`/`DEFAULT_*_MODEL` in the `claude` invocation for all bare `claude-*` cli_models) has been **actually implemented** since 2026-07 — previously the comment only described the behavior, so native runs in fact went through the container-global Requesty route and the native alias risked a 403. Older `fable-5`/`opus-4-8` native runs are therefore to be treated as a routing caveat (possibly really Requesty-routed). New `opus-5` runs are cleanly native.

## Why v4-exact-subagents as the Control Workflow?

According to the findings so far, v4-exact-subagents is the strongest workflow for code quality on Game of Life (isolated phase contexts, clear red/green/refactor separation). A pure model evaluation should isolate the model signal, so the workflow is pinned — not varied as a factor. A later RQ can address model × workflow interaction.

## Why Fix Prompt = example-mapping?

RQ-prompt-known-kata has shown empirically that on training-known katas (Game of Life) the prompt style has **no** robust effect on code quality (Opus and Sonnet reach 100 % correctness regardless of style; the style spread on quality metrics is not consistent across models). We therefore pin example-mapping and save the factor.

## Why Game of Life?

- Training-known → correctness reliably at 100 % at a high model level, i.e. the quality comparison operates on correct code.
- The code-quality signal is demonstrably differentiating on Game of Life (cf. methodology constraints in README).
- Library form (`game-of-life-example-mapping`), no CLI — no CLI overhead shares in the quality metrics.

## Design

```
Factor:    model      — 10 levels (5 models × {thinking, no-thinking})
Control:   workflow   — v4-exact-subagents
Control:   kata_base  — game-of-life (+ prompt = example-mapping)

Cells:      10
Replicates: n = 3
Runs:       30 total
```

## Hypotheses

- **H1** (correctness sanity): `tests_passing` *and* `verification_pct` are at 100 % for all eight models (3/3 per cell). A cell below 100 % invalidates the code-quality comparison for that model or indicates a representation-adherence gap.
- **H2** (model ranking on code quality): On `code_mass`, `smell_total`, `cc_longest_function`, `mccabe_max`, `cognitive_max` a consistent ranking Fable 5 ≤ Opus 4.8 ≤ Opus 4.7 ≤ Opus 4.6 ≤ Sonnet 4.6 emerges (lower = better; Fable 5 expected at the top as the newest model, without a numeric prediction).
- **H3** (thinking effect): Within each model, thinking improves code quality (lower `code_mass`, `cognitive_max`); the effect is stronger on Opus than on Sonnet (cf. F-3.x from the v1-generation RQ-3-model-and-thinking, deleted in `953841cb`).

**Falsification of H2** (no consistent ranking across the quality outcomes): the model effect on code quality is not stable on v4 → other workflows could show different model rankings.

**Falsification of H3** (thinking effect < noise, or reversed): thinking acts differently on v4 than on older workflow setups.

## Caveats

- **(a) Single workflow point**: Only v4-exact-subagents. No workflow generalization — the model ranking could deviate on other workflows.
- **(b) Single kata**: Only Game of Life (library form, example-mapping). Mars-rover as a second code-quality carrier would be a sensible extension but is not included here.
- **(c) Opus 4.6 via Portkey, not Direct API**: The `opus-4-6-portkey*` variants route via Portkey. Findings are not automatically transferable to Direct-API Opus 4.6 (should that ever become available).
- **(d) External correctness via module-import adapter**: `verification_pct` is measured via `experiments/katas/game-of-life-verification/` — the adapter imports the `evolve` function directly from `src/game-of-life.{ts,…}` and calls it `steps` times per scenario. No CLI contract needed, hence no CLI overhead shares in the code-quality metrics. The adapter does, however, expect the representation `Cell[]` with `Cell = [number, number]` (tuple array). Other reasonable representations (`boolean[][]`, `Set<string>`, `{x,y}[]`) are not excluded by the kata but fail against this adapter convention — this is intended as a representation-adherence signal.

## Findings

See [findings.md](findings.md).

## Data Source

All runs in `experiments/runs/` with
`workflow=v4-exact-subagents`,
`kata=game-of-life-example-mapping`,
model ∈ {fable-5, fable-5-no-thinking, opus-4-8, opus-4-8-no-thinking, opus-4-7, opus-4-7-no-thinking, opus-4-6-portkey, opus-4-6-portkey-no-thinking, sonnet-4-6, sonnet-4-6-no-thinking}.
