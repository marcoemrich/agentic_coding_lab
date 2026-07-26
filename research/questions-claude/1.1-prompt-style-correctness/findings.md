# RQ-prompt-correctness Findings

Persistent collection of the insights on the question:
**Does example mapping increase correctness compared to prose and
user story — and is the effect model-dependent?**

Findings originate from `summary.md` of this RQ via
`experiments/aggregate-by-query.py`.

Data basis: 128 runs (22 of 24 cells at n≥5; only opus-4-6 ×
example-mapping at n=4). As of 2026-06-02.

## Overview: Correctness (external) by Model × Prompt Style × Thinking

| Model | Mode | prose | example-mapping | user-story |
|---|---|---|---|---|
| opus-4-7 | +thinking | 0.29 | **0.95** 🏆 | 0.21 |
| opus-4-7 | −thinking | 0.21 | **0.97** 🏆 | 0.13 |
| opus-4-6 | +thinking | 0.24 | **0.72** 🏆 | 0.22 |
| opus-4-6 | −thinking | 0.23 | **0.87** 🏆 | 0.18 |
| sonnet-4-6 | +thinking | 0.21 | **0.35** 🏆 | — |
| sonnet-4-6 | −thinking | 0.23 | **0.71** 🏆 | 0.17 |
| haiku-4-5 | +thinking | 0.00 | 0.00 | 0.01 |
| haiku-4-5 | −thinking | 0.00 | 0.00 | 0.00 |

Values: mean(`verification_pct`), n=5 each (opus-4-6 EM n=4; opus-4-7
−thinking EM n=9). Higher = better; 🏆 = best style per row
(Haiku rows: no effect, all values ~0 → no winner).
Routing: opus-4-7 Direct API, the rest Portkey (`controls.model`).

---

## F-prompt-correctness.1 — Weak Models Fail Regardless of Prompt Style

Haiku 4.5 reaches 0 % correctness (external) across all three prompt styles
and both thinking modes (n=30, 6 cells of 5 runs each, `verification_pct`
= 0.00, σ=0.00 in every cell).

| Prompt style | +thinking | −thinking |
|---|---|---|
| prose | 0.00 | 0.00 |
| example-mapping | 0.00 | 0.00 |
| user-story | 0.01 | 0.00 |

**Data basis**: 30 runs, all Haiku-4.5-portkey × v5 × claim-office.

**Rationale**: The kata requires the agent to interpret several
domain rules correctly and implement them in a runnable CLI.
Haiku does produce compilable code with
`cli_built=true`, but the domain logic is in no case close
enough to the external verification suite. Example mapping —
which makes the decisive difference on stronger models
(→ F-prompt-correctness.2) — has no measurable effect for Haiku: the
reasoning capacity is not sufficient to generalize the examples to new
inputs.

**Relation to H5**: Confirmed. Weaker models do not reach correctness even with
example mapping.

---

## F-prompt-correctness.2 — Example Mapping Raises Correctness Massively

On Opus 4.7, Opus 4.6 and Sonnet 4.6, example mapping increases
correctness (external) compared to prose by 14–76 percentage points. On Opus
the effect is strong in both thinking modes; on Sonnet only without
thinking.

| Model | Mode | prose | example-mapping | user-story | Δ (EM − prose) |
|---|---|---|---|---|---|
| opus-4-7 | +thinking | 0.29 | **0.95** 🏆 | 0.21 | **+66 pp** |
| opus-4-7 | −thinking | 0.21 | **0.97** 🏆 | 0.13 | **+76 pp** |
| opus-4-6 | +thinking | 0.24 | **0.72** 🏆 | 0.22 | **+48 pp** |
| opus-4-6 | −thinking | 0.23 | **0.87** 🏆 | 0.18 | **+64 pp** |
| sonnet-4-6 | +thinking | 0.21 | **0.35** 🏆 | — | +14 pp |
| sonnet-4-6 | −thinking | 0.23 | **0.71** 🏆 | 0.17 | **+48 pp** |

Higher = better; 🏆 = best style per row (columns prose/EM/user-story).
Δ is an effect size, not a competition → no 🏆.

**Data basis**: 128 runs in total; this table: Opus 4.7 (n=5/mode,
EM −thinking n=9), Opus 4.6 (n=5/mode, EM +thinking n=4), Sonnet 4.6
(n=5/mode). Haiku excluded — there the prompt style is irrelevant
(→ F-prompt-correctness.1).

**Rationale**: Example mapping supplies concrete input/output pairs
that resolve the ambiguities of the kata rules. Models with
sufficient reasoning capacity (Opus, Sonnet) can generalize the patterns
to new inputs.

**Relation to H1**: Confirmed. EM increases correctness on Opus 4.7 by
+66–76 pp, on Opus 4.6 by +48–64 pp and on Sonnet −thinking by
+48 pp. Sonnet +thinking shows +14 pp — weaker, but the same
direction.

---

## F-prompt-correctness.3 — Thinking Hurts with Example Mapping (Sonnet > Opus)

Thinking mode reduces correctness (external) with example mapping,
but the effect is model-dependent:

| Model | +thinking | −thinking | Δ |
|---|---|---|---|
| sonnet-4-6 | 0.35 (σ=0.41) | **0.71** 🏆 (σ=0.18) | **−36 pp** |
| opus-4-6 | 0.72 (σ=0.38) | **0.87** 🏆 (σ=0.30) | −15 pp |
| opus-4-7 | **0.95** 🏆 (σ=0.12) | **0.97** 🏆 (σ=0.09) | −2 pp |

Higher = better; 🏆 = better mode per row (+thinking vs. −thinking). Δ = effect size, no 🏆.

With prose and user story the thinking effect is negligible
(±5 pp, no consistent direction).

**Data basis**: 33 runs (Opus 4.7 + Opus 4.6 + Sonnet 4.6 × ±thinking
× example-mapping; n=5 each, except opus-4-6 +thinking n=4 and opus-4-7
−thinking n=9).

**Mechanism (transcript analysis)**: In a Sonnet +thinking run
with `verification_pct`=0, the thinking block contains the
passage: *"I'm realizing the first insurance surcharge might apply
to every item in a quote regardless of whether it's the customer's
first contract overall. Let me check the example again."* — The
model questions the reading implied by the example and
constructs an alternative interpretation ("first insurance" =
the customer's first contract), which it then implements as an `isFirstQuote`
parameter. The −thinking variant of the same model instead applies the
surcharge unconditionally — consistent with the examples.

The effect scales inversely with model strength: Sonnet strong
(−36 pp), Opus 4.6 medium (−15 pp), Opus 4.7 negligible
(−2 pp). Stronger models have enough reasoning capacity to adopt the
example semantics correctly even with thinking — Sonnet
questions them more often and constructs alternative readings.

**Relation to H4**: Partially refuted. Thinking does not improve
`verification_pct` — on Sonnet × EM it hurts considerably
(−36 pp), on Opus 4.6 × EM noticeably (−15 pp), on Opus 4.7 × EM
practically not at all (−2 pp).

---

## F-prompt-correctness.4 — User Story ≈ Prose, No Measurable Effect on Correctness

User story reaches similar correctness (external) to prose across all models and
thinking modes. Maximum difference: 8 pp, without
consistent direction.

| Model | Mode | prose | user-story | Δ |
|---|---|---|---|---|
| opus-4-7 | +thinking | 0.29 | 0.21 | −8 pp |
| opus-4-7 | −thinking | 0.21 | 0.13 | −8 pp |
| opus-4-6 | +thinking | 0.24 | 0.22 | −2 pp |
| opus-4-6 | −thinking | 0.23 | 0.18 | −5 pp |
| sonnet-4-6 | −thinking | 0.23 | 0.17 | −6 pp |
| haiku-4-5 | ±thinking | 0.00 | 0.00–0.01 | 0 pp |

**Data basis**: prose and user-story cells across all models ×
±thinking, n=5 each (opus-4-6/opus-4-7 user story partly n=7–8).

**Rationale**: The stakeholder perspective ("As X I want Y")
supplies no additional information about the domain rules.
Ambiguities such as "first insurance" remain equally unresolved in both
formats — only concrete input/output examples
(example mapping) disambiguate them.

**Relation to H2**: Confirmed. User story improves correctness
compared to prose only marginally (≤6 pp).

---

## F-prompt-correctness.5 — Spread with Example Mapping Is Model-Dependent

Example-mapping runs spread more than prose/user story, but
the spread depends strongly on the model:

| Cell | mean | σ | min | max |
|---|---|---|---|---|
| opus-4-7 +thinking × EM | 0.95 | 0.12 | 0.73 | 1.00 |
| opus-4-7 −thinking × EM | 0.97 | 0.09 | 0.73 | 1.00 |
| opus-4-6 +thinking × EM | 0.72 | 0.38 | 0.20 | 1.00 |
| opus-4-6 −thinking × EM | 0.87 | 0.30 | 0.33 | 1.00 |
| sonnet +thinking × EM | 0.35 | 0.41 | 0.00 | 1.00 |
| sonnet −thinking × EM | 0.71 | 0.18 | 0.40 | 0.87 |
| opus ±thinking × prose | 0.21–0.29 | 0.04–0.19 | 0.07 | 0.60 |

**Data basis**: all EM cells of Opus 4.7, Opus 4.6, Sonnet 4.6 ×
±thinking (n=5/cell, opus-4-6 +thinking n=4, opus-4-7 −thinking n=9).

**Rationale**: The spread decreases as model strength rises. Sonnet
+thinking shows quasi-binary behavior (0 % or high, σ=0.41),
Opus 4.6 spreads moderately (σ=0.30–0.38), Opus 4.7 hits the correct
interpretation most consistently (σ=0.09–0.12). The high spread on
Sonnet +thinking is a thinking effect (→ F-prompt-correctness.3),
not a general EM problem — Sonnet −thinking and Opus spread
considerably less.

---
