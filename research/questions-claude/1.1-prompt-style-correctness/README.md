---
id: RQ-prompt-correctness
question: "Does example mapping increase correctness compared to prose and user story — and is the effect model-dependent?"
factors:
  prompt: [prose, example-mapping, user-story]
  model:
    - opus-4-7
    - opus-4-7-no-thinking
    - opus-4-6-portkey
    - opus-4-6-portkey-no-thinking
    - sonnet-4-6-portkey
    - sonnet-4-6-portkey-no-thinking
    - haiku-4-5-portkey
    - haiku-4-5-portkey-no-thinking
controls:
  workflow: v5-exact-single-context
  kata_base: claim-office
outcomes:
  - verification_pct
  - verification_passed
  - verification_total
  - duration_seconds
  - total_tokens
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-prompt-correctness: Prompt Style Effect on Correctness

Does example mapping increase correctness compared to prose and user story
— and is the effect model-dependent?

## Motivation: Correctness Before Code Quality

Code quality (smells, complexity, function length) is worthless if
the program does the wrong thing. An elegant, well-structured
algorithm that implements the domain rules incorrectly has no
production value. Therefore the first research question must clarify **under
which conditions the agent produces correct solutions** — before
we examine the quality of those solutions. All subsequent
code-quality RQs can then restrict themselves to configurations that
are known to deliver correct results.

## Prompt Styles

| Style | Description |
|---|---|
| **prose** | Description of the rules in running text, no examples. |
| **example-mapping** | Rule + 1–3 concrete input/output examples per rule. |
| **user-story** | "As X I want Y, so that Z" — stakeholder perspective without examples. |

Configuration: `experiments/katas/claim-office-{prose, example-mapping, user-story}/prompt.md`.

## Models

| Model | Thinking | API route |
|---|---|---|
| opus-4-7 | Adaptive thinking | Anthropic direct |
| opus-4-7-no-thinking | Off | Anthropic direct |
| opus-4-6-portkey | Thinking | Portkey Gateway |
| opus-4-6-portkey-no-thinking | Off | Portkey Gateway |
| sonnet-4-6-portkey | Extended thinking | Portkey Gateway |
| sonnet-4-6-portkey-no-thinking | Off | Portkey Gateway |
| haiku-4-5-portkey | Extended thinking | Portkey Gateway |
| haiku-4-5-portkey-no-thinking | Off | Portkey Gateway |

Opus 4.7 runs via the Anthropic direct API (rate limit). All other
models run via the Portkey Gateway (rate-limit-free) and can be collected in
a single batch.

## Why v5 as the Control Workflow?

This RQ measures the effect of **prompt style** on **correctness**. The
workflow must therefore not introduce noise of its own into the correctness metric.
The three TDD workflow candidates differ considerably on
claim-office (all values: claim-office × example-mapping,
across models, as of 2026-05-11):

| Workflow | mean(verification_pct) | σ | n | Spread |
|---|---:|---:|---:|---|
| **v5** (single-context) | **1.000** | **0.000** | 3 | 1.0–1.0 |
| v3 (basic TDD) | 0.844 | 0.275 | 15 | 0.0–1.0 |
| v4 (subagents) | 0.340 | 0.419 | 20 | 0.0–1.0 |

### v4 Is Ruled Out (σ = 0.42)

The subagent lottery problem (state reconstruction fails at the
phase change) swallows the prompt style effect. Individual runs
land at 0 % although the model masters the task — a
workflow artifact, not a prompt signal. Example: Opus-4.7 × v4 ×
example-mapping shows runs with 0 %, 0.27 %, 0.73 %, 1.00 % — the
workflow dominates the variance.

### v3 Is Suboptimal (σ = 0.28)

v3 has no explicit phase scripts; the model decides on its own
about TDD discipline. On weaker models v3 shows outliers that are
not prompt-related but workflow-related (Haiku × v3 ×
example-mapping: 0.0, 0.4, 0.8). This noise would confound the
prompt effect.

### v5 Delivers the Cleanest Signal (σ = 0)

v5 keeps the entire context in a single conversation — no
phase handoff, no state loss. This makes every observed variance
in `verification_pct` attributable to the prompt style and/or the model,
not to the workflow.

**Limitation**: The v5 data so far comes only from
Opus-4.7-no-thinking (n=3, all 100 %). Whether v5 also remains stable on weaker
models is what this RQ itself will show. If Haiku ×
v5 × example-mapping spreads, that would be a model effect — and exactly
what this RQ wants to measure.

**Data gap for Opus 4.7 closed (as of 2026-06-02)**: opus-4-7
is now available in all three styles × both thinking modes with n=5
(EM −thinking n=9). Effect size demonstrated: EM − prose = +66 pp
(+thinking, 0.29 → 0.95) and +76 pp (−thinking, 0.21 → 0.97), respectively. The
older "1.00 (n=3)" figure was a small-sample artifact — the
robust EM mean lies at 0.95–0.97. The only remaining partial
gap: opus-4-6-portkey × example-mapping at n=4 (one run
discarded due to a Vertex AI routing defect).

## Design

```
Factor 1:  prompt        — 3 levels (prose, example-mapping, user-story)
Factor 2:  model         — 8 levels (4 model tiers × ±thinking)
Control:   workflow      — v5-exact-single-context
Control:   kata_base     — claim-office

Cells:      3 × 8 = 24
Replicates: n = 5
Runs:       120 total
```

### Why claim-office?

#### The Kata as an Enterprise Simulation

claim-office (*Most Honorable Privileged Claims Office for Magical
Risks and Cursed Items*, MHPCO) is a kata developed specifically for this
lab that does **not** appear in the models' training data.
It models an insurance-inspired domain with
bureaucratically specific business logic: risk categories,
discount tiers, first-insurance conditions, cumulative
damage assessment.

The wording is deliberately **realistic in the sense of
enterprise software**: the rules contain the kind of
ambiguities that are typical in real insurance, financial or
administrative domains — terms with several plausible
readings ("first insurance": the customer's first contract or the first
contract for a risk?), implicit calculation orders and
edge cases that the rule text does not explicitly address. These
ambiguities are not constructed as traps but reflect
how domain requirements are formulated in practice:
incomplete, context-dependent, and loaded with knowledge that the
author takes for granted.

#### External Verification Suite

Correctness is **not** measured by the unit tests written by the
agent (these only check whether the agent implements its own
interpretation consistently), but by an **external
verification suite** of 15 scenarios
(`experiments/katas/claim-office-verification/`). The suite covers
three levels: 7 isolated rule checks, 4 combined scenarios
and 4 story-based end-to-end cases. The agent never sees this suite
— it runs on the host after the container run.

`verification_pct` (0.0–1.0) measures the share of passed scenarios
and is therefore an **objective correctness measure**, independent of the
agent's self-assessment.

#### Why Not game-of-life?

game-of-life is **not usable** as an ambiguity revealer for prompt styles.
The spec including examples is in the models' training data
— models already "know" the correct solution, regardless
of whether the prompt supplies examples. The styles do not differentiate
measurably in correctness on game-of-life.

### Why the Full Model Mix?

The core question is whether stronger models can **compensate** for the
example-mapping advantage — that is, whether an Opus with prose reaches the same
correctness as a Haiku with example mapping. This requires
the full model variation. The thinking dimension additionally clarifies
whether reasoning capacity attenuates the prompt style effect.

## Hypotheses

- **H1**: Example mapping increases `verification_pct` compared to
  prose on models with sufficient reasoning capacity.
- **H2**: User story increases `verification_pct` compared to prose only
  marginally — the stakeholder perspective does not resolve domain-internal
  ambiguities.
- **H3**: Stronger models (Opus) reach higher `verification_pct` with prose
  than weaker ones (Haiku), but the gap to
  example mapping remains — model strength does not fully compensate for missing
  examples.
- **H4**: Thinking mode improves `verification_pct` independently of the
  prompt style, but the gain is smaller than the
  example-mapping effect.
- **H5**: Weaker models (Haiku) do not reach full correctness even with
  example mapping — the examples only defuse the ambiguities
  if the model has enough reasoning capacity to generalize
  them to new inputs.

## Batch Strategy

1. **Phase 1** (rate-limit-free): Opus 4.6 + Sonnet + Haiku via
   Portkey — 18 cells × n=3 = 54 runs in one batch.
2. **Phase 2** (time-shifted): Opus 4.7 via Anthropic direct —
   6 cells × n=3 = 18 runs (strict rate limit).

## Findings

See [findings.md](findings.md).

## Data Source

All runs in `experiments/runs/` with
`workflow=v5-exact-single-context`,
`kata=claim-office-{prose|example-mapping|user-story}`,
model ∈ {opus-4-7, opus-4-7-no-thinking, opus-4-6-portkey,
opus-4-6-portkey-no-thinking, sonnet-4-6-portkey,
sonnet-4-6-portkey-no-thinking, haiku-4-5-portkey,
haiku-4-5-portkey-no-thinking}.
