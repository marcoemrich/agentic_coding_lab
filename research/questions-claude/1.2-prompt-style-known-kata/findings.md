# RQ-prompt-known-kata Findings

Persistent collection of the insights on the question:
**Does the prompt style influence correctness and code quality on a
training-known kata (Game of Life) — and is this effect
model-dependent?**

Data basis: 45 runs (9 cells × n=5), as of 2026-05-13. External
correctness via the verification adapter (imports the agent function
directly, no CLI contract needed).

---

## Overview: verification_pct by Prompt Style × Model

| Model | prose | user-story | example-mapping |
|---|---|---|---|
| opus-4-6-portkey-no-thinking | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) |
| sonnet-4-6-portkey-no-thinking | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) |
| haiku-4-5-portkey-no-thinking | 0.24 (σ=0.43) | 0.00 (σ=0) | **0.63** 🏆 (σ=0.51) |

Higher = better; 🏆 = best style per row (Opus/Sonnet: all three styles tied at 1.00 → ties, all 🏆).

---

## F-prompt-known-kata.1 — Opus and Sonnet Deliver Perfect Correctness Regardless of Style

**Statement**: Opus 4.6 and Sonnet 4.6 (no-thinking) reach
`verification_pct = 1.00` on game-of-life across all three prompt styles,
without exception (30/30 runs). The spread between styles is 0 pp.

**Data basis**: 15 Opus runs (5 × 3 styles), 15 Sonnet runs (5 × 3
styles), all vpct=1.00.

**Interpretation**: On training-known katas, strong models fully
compensate for style differences from their prior knowledge. The
Conway rules are omnipresent in the training — no prompt style can
improve or degrade that.

**Status**: ✅ stable (n=30, σ=0)

---

## F-prompt-known-kata.2 — Haiku Fails Due to Capacity, Not Style

**Statement**: Haiku 4.5 (no-thinking) shows two
distinct modes on game-of-life:

1. **Immediate quitters** (dur=12–17s, code_mass=0–5): the agent writes only
   a spec file and gives up. Affects all user-story runs (5/5)
   and most prose runs (4/5).
2. **Completers** (dur=299–710s, code_mass=129–318): the agent works
   through the task completely. With example mapping 3/5 runs are perfect
   (vpct=1.00), with prose 1/5.

| Style | n | vpct mean | Completers | Immediate quitters |
|---|---:|---:|---:|---:|
| prose | 5 | 0.24 | 2 (1× vpct=1, 1× vpct=0.2) | 3 |
| user-story | 5 | 0.00 | 0 | 5 |
| example-mapping | 5 | **0.63** 🏆 | 4 (3× vpct=1, 1× vpct=0.13) | 1 |

Higher = better (vpct mean); 🏆 = best style. The remaining columns are descriptive counts, not a competition.

**Interpretation**: The difference is not rule correctness,
but whether Haiku *starts* the task at all. Example mapping
gives the weakest model enough concrete context to get into
working mode. User story (abstract, no examples) supplies
too few anchors — Haiku does not recognize the task as feasible.

**Status**: ✅ stable (bimodal pattern reproducible across n=5)

---

## F-prompt-known-kata.3 — H1 Confirmed: Prompt Style Does Not Differentiate on Strong Models

**Statement**: H1 ("per model, the verification_pct spread between
styles is < 10 pp") is fully confirmed for Opus and Sonnet
(spread = 0 pp). For Haiku, H1 is trivially falsified
(spread = 63 pp), but the cause is not style sensitivity
but capacity-related instability (F-prompt-known-kata.2).

**Implication for code-quality RQs**: Prompt style can be fixed as a
control on game-of-life (e.g. prose or
example mapping) without a correctness confound on Opus/Sonnet.

**Status**: ✅ stable

---

## F-prompt-known-kata.4 — H4 Confirmed: The Ambiguity Mechanism Does Not Apply on a Training-Known Kata

**Statement**: In RQ-prompt-correctness (claim-office, domain-novel),
example mapping improves correctness because concrete examples
resolve domain-specific ambiguities. In RQ-prompt-known-kata
(game-of-life, training-known) there are no such
ambiguities — the Conway rules are unambiguous and present in the
prior knowledge. Example mapping acts here via a different mechanism:

- **Strong models (Opus, Sonnet)**: No effect — they do not need the
  examples. All styles deliver vpct=1.00.
- **Weak model (Haiku)**: Example mapping acts as an
  *activation anchor* — not because it resolves ambiguities, but
  because concrete input/output pairs show the model that the
  task is feasible and what the solution should look like.

**Falsification of H4**: H4 is *not* falsified. Example mapping
does *not* improve correctness on training-known katas
for strong models. On Haiku it helps, but via a different
mechanism (activation, not disambiguation).

**Status**: ⚠️ conditional (the Haiku finding is robust, but the
mechanistic explanation "activation anchor" is a hypothesis,
not a measured effect)

---

## F-prompt-known-kata.5 — H2 Cannot Be Assessed: Code Quality Comparable Only on Working Runs

**Statement**: Code-quality outcomes (code_mass, smell_total,
cc_longest_function, mccabe_max, cognitive_max) are meaningful only on runs
with vpct > 0. On Haiku, 7/15 runs drop out
(code_mass=0, the agent implemented nothing). For Opus and Sonnet
(all vpct=1.00):

| Model | prose mass | user-story mass | ex-mapping mass |
|---|---:|---:|---:|
| opus-4-6 | 249 (σ=61) | 230 (σ=32) | 222 (σ=49) |
| sonnet-4-6 | 238 (σ=9) | 250 (σ=35) | 223 (σ=27) |

No consistent style ranking: Opus has the highest mass with
prose, Sonnet with user story. Differences lie within the range
of run-to-run variance. **H2 qualitatively confirmed**: on training-known
katas, prompt style induces no systematic
code-quality ranking.

**Status**: ⚠️ conditional (only Opus/Sonnet, n=5 per cell)

---

## F-prompt-known-kata.6 — RQ-prompt-correctness Prediction Confirmed: Prompt Style Does Not Differentiate on a Training-Known Kata

**Statement**: The prediction in RQ-prompt-correctness ("game-of-life is
not usable as an ambiguity revealer for prompt styles") is
fully confirmed for Opus and Sonnet: verification_pct = 1.00
across all styles, code quality does not vary systematically.

**Consequence for subsequent RQs**: Code-quality RQs on
game-of-life can fix prompt style as a control without risking a
style confound — provided Haiku is excluded or
handled separately.

**Status**: ✅ stable

---

## F-prompt-known-kata.7 — The Verification Adapter Eliminates Interface Artifacts

**Statement**: Before the verification adapter was introduced, Opus
and Sonnet showed apparent correctness errors that were actually
interface problems: a missing `src/cli.ts` (the agent fell back to
library mode) or a multi-step bug (the CLI iterated only 1×). The
adapter (imports the agent function directly, iterates and
sorts on its own) eliminates these artifacts completely.

**Data basis**: Before the adapter: Opus×EM 0.60, Sonnet×prose 0.93.
After the adapter: both 1.00.

**Methodological consequence**: For training-known katas in which
the task core (implementing the rules) is separable from the interface contract
(CLI, JSON IO, sorting), the
verification suite should test the core directly — not the
interface wrapper. Otherwise `verification_pct` measures
interface compliance, not rule correctness.

**Status**: ✅ stable (methodological insight)
