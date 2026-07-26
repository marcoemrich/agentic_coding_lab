---
id: RQ-prompt-known-kata
question: "Does the prompt style (prose/user-story/example-mapping) influence correctness and code quality on a training-known kata (Game of Life) — and is this effect model-dependent?"
factors:
  prompt: [prose, user-story, example-mapping]
  model:
    - opus-4-6-portkey-no-thinking
    - sonnet-4-6-portkey-no-thinking
    - haiku-4-5-portkey-no-thinking
controls:
  workflow: v5-exact-single-context
  kata_base: game-of-life-cli
outcomes:
  - verification_pct
  - verification_passed
  - verification_total
  - tests_passing
  - completed_within_budget
  - cli_built
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-prompt-known-kata: Prompt Style Effect on a Training-Known Kata

Does the prompt style influence correctness *and* code quality on a training-known kata (Game of Life) — and is the effect model-dependent?

## Motivation

RQ-prompt-correctness measures the prompt style effect on a domain-novel kata (claim-office) and predicts in its section "Why not game-of-life?" that styles *do not differentiate measurably* in correctness on training-known katas, because the model's prior knowledge overrides the style differences. RQ-prompt-known-kata tests this prediction empirically and extends it by the code-quality dimension.

The result has consequences for all later code-quality RQs on Game of Life:

- **Confirmed** (no style effect) → later code-quality RQs can fix one style and save the factor.
- **Refuted** (style effect visible) → style must be carried as a factor in all code-quality RQs, otherwise confound.

## Prompt Styles

| Style | Description |
|---|---|
| **prose** | Description of the rules in running text, no examples. |
| **user-story** | "As X I want Y, so that Z" — stakeholder perspective plus acceptance criteria without numeric examples. |
| **example-mapping** | Rule + 1–2 concrete schema examples that demonstrate the I/O format. |

Configuration: `experiments/katas/game-of-life-cli-{prose,user-story,example-mapping}/prompt.md`. All three are content-equivalent (same rules, same I/O contract, same constraints), differing only in the form of presentation.

## Models

| Model | Thinking | API route |
|---|---|---|
| opus-4-6-portkey-no-thinking | Off | Portkey Gateway |
| sonnet-4-6-portkey-no-thinking | Off | Portkey Gateway |
| haiku-4-5-portkey-no-thinking | Off | Portkey Gateway |

All models run via Portkey (rate-limit-free). Thinking is off throughout so as not to mix the prompt style effect with the thinking effect (see caveat below).

## Why v5 as the Control Workflow?

Consistent with RQ-prompt-correctness: v5-exact-single-context delivers the cleanest signal (no phase handoff, no state loss), so that observed variance is attributable to style and/or model, not to the workflow. For details see RQ-prompt-correctness.

## Why game-of-life-cli?

### Training-Known Kata with Measurable External Correctness

Conway's Game of Life is ubiquitous in training material — that is the point. The hypothesis "styles do not differentiate on training-known katas" can only be tested if the kata is actually present in the prior knowledge.

The existing GOL katas (`game-of-life-{prose,user-story,example-mapping}`) are library-only (one function, vitest tests). They deliver only the *internal* correctness view (`tests_passing`) — the agent writes its own tests. An *external* correctness view (verification against a fixed acceptance suite) requires a CLI interface, which we add for RQ-prompt-known-kata as a new kata family: `game-of-life-cli-{prose,user-story,example-mapping}`.

### External Verification Suite

`experiments/katas/game-of-life-cli-verification/` contains 15 scenarios (stills, oscillators of period 2, glider, half phases, negative coordinates, empty grid, `steps:0` identity). The agent never sees this suite. `analyze-run.sh` pipes each scenario into the `src/cli.ts` built by the agent and compares it canonically via `jq -S` with the expected output. `verification_pct` (0.0–1.0) is the share of passed scenarios.

## Design

```
Factor 1:  prompt        — 3 levels (prose, user-story, example-mapping)
Factor 2:  model         — 3 levels (opus-4-6 / sonnet-4-6 / haiku-4-5, all Portkey, all no-thinking)
Control:   workflow      — v5-exact-single-context
Control:   kata_base     — game-of-life-cli

Cells:      3 × 3 = 9
Replicates: n = 3
Runs:       27 total
```

## Hypotheses

- **H1** (correctness): Per model, the spread of `verification_pct` between the three styles is less than 10 percentage points — the kata is known from the training material, style differences are compensated by prior knowledge.
- **H2** (code quality): There is no consistent style ranking on `code_mass`, `smell_total`, `cc_longest_function`, `mccabe_max`, `cognitive_max` that is stable across models — style-induced quality variation is noise on a known kata.
- **H3** (model ranking): `code_mass` and complexity outcomes continue to follow the model ranking Opus < Sonnet < Haiku (cf. F-3.1 in `_archive/rqs-v1/RQ-3-model-and-thinking/findings.md`), independently of the prompt style.

- **H4** (ambiguity hypothesis): On training-known katas the example-mapping advantage does not take effect, because there are no domain-specific ambiguities that would need to be resolved by examples. Instead, concrete examples can activate the trained pattern (library form) so strongly that the actual task contract (CLI) is displaced — example mapping becomes *counterproductive*. This phenomenon does not occur on domain-novel katas (claim-office), because there no competing prior knowledge exists.

**Falsification of H1** (≥1 model shows ≥10 pp spread): style effect present even on a training-known kata → code-quality RQs must carry style as a factor, not control it.

**Falsification of H2** (at least one code-quality outcome shows a style ranking that is consistent across models): style influences quality even if not correctness → an even stronger implication for code-quality RQs.

**Falsification of H4** (example mapping improves correctness even on a training-known kata): the prior-knowledge displacement model does not apply → examples help universally, not only in the presence of ambiguity.

## Caveats

- **(a) Thinking off**: Findings apply only to the no-thinking mode. With thinking, correctness or quality results could shift — on Opus in particular, RQ-model-quality-v1 shows a clear thinking effect on code quality (cognitive_max −42 %). A separate RQ would be needed for the thinking dimension.
- **(b) Opus 4.6 via Portkey, not 4.7**: The `*-portkey` variants route Opus 4.6. Findings about `opus-4-6-portkey-no-thinking` are *not* automatically transferable to Opus 4.7 or Direct-API Opus 4.6.
- **(c) CLI overhead bias**: The `game-of-life-cli-*` kata pins JSON IO + dispatcher in `src/cli.ts`. Code-quality metrics (`code_mass`, `smell_total`, `cc_*`, `mccabe_*`, `cognitive_*`) contain a CLI overhead share that the existing library variant `game-of-life-*` does not have. Cross-kata comparisons between `game-of-life-cli-*` and `game-of-life-*` on code quality are therefore not directly valid. Within RQ-prompt-known-kata (variation only over prompt × model) the bias is constant across all cells and does not disturb the style comparison.
- **(d) Single workflow point**: v5-exact-single-context as the sole workflow. No workflow generalization — other workflows could produce different style effects.

## Findings

See [findings.md](findings.md).

## Data Source

All runs in `experiments/runs/` with
`workflow=v5-exact-single-context`,
`kata=game-of-life-cli-{prose|user-story|example-mapping}`,
model ∈ {opus-4-6-portkey-no-thinking, sonnet-4-6-portkey-no-thinking, haiku-4-5-portkey-no-thinking}.
