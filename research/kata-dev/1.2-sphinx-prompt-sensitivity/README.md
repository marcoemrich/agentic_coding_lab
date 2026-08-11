---
id: RQ-kata-sphinx-prompt-sensitivity
question: "Does sphinx-score carry an example-mapping effect — do the pinned examples move correctness relative to the bare prose prompt, and does it do so more sharply than claim-office?"
factors:
  kata_base:
    - sphinx-score
    - claim-office
  prompt:
    - example-mapping   # carries the examples that pin all four ambiguities
    - prose             # same rule text, no examples
controls:
  model: opus-5-no-thinking
  workflow: v6.6-lab-split-cc
outcomes:
  # primary: the example-mapping lever
  - verification_pct
  - tests_passing
  - completed_within_budget
  # does removing the examples change how much work the run is?
  - duration_seconds
  - total_tokens
  - cost_usd
  - cycle_count
  - refactorings_applied
  # sanity on the produced code
  - lines_of_code
  - cognitive_max
  - mccabe_max
min_replicates: 6
status: aktiv
---

# RQ-kata-1.2: Does sphinx-score carry an example-mapping effect?

`sphinx-score` was built to make example mapping measurable. Its rule text
is deliberately neutral and its four ambiguities are pinned **only** by the
examples in the `example-mapping` prompt. If that construction works, the
`prose` variant — identical rule text, no examples — must score
measurably worse.

This is the kata's other claim to being a good instrument, independent of
[RQ-kata-1.1](../1.1-sphinx-vs-claim-office/README.md): 1.1 asks whether it
separates strong from weak *models*, this one whether it separates prompt
*information*.

## Why this should work

The ambiguity pre-test (2026-08-11, 60 calls, four model configs) measured
how models read the bare card text — no examples. All four pinned readings
lost against the model majority:

| Axis | pinned reading | models agreeing |
|---|---|---|
| formulation ("beyond three") | 5 | 2/20 |
| second Sphinx counts as a type | 6 | 6/20 |
| Sphinx counts itself | 2 | 0/20 |
| "else 1" adds to the base | (same question) | 0/20 |

Without examples the models spread over five distinct answers on one
question. With examples the smoke run scored 16/16. That gap is what this
RQ measures under controlled conditions — the pre-test asked a single
scoring question, not a full TDD run.

## Hypotheses

- **H1:** On `sphinx-score`, `prose` scores clearly below `example-mapping`
  in `verification_pct`. The pre-test predicts a large gap, since the prose
  prompt leaves every pinned reading to chance.
- **H2:** The gap is *larger* on `sphinx-score` than on `claim-office`.
  claim-office's ambiguities are real but its rules are longer and carry
  more redundancy; sphinx-score concentrates four ambiguities in two
  sentences.
- **H3 (null-ish):** Cost and TDD markers are roughly prompt-invariant.
  Removing examples should not change how much work a run is, only whether
  the work lands on the right interpretation. *If prose runs turn out much
  cheaper, that is a warning sign: it would mean the agent stops early
  rather than exploring.*

## Design note: why claim-office is in this RQ

As the second kata it serves as a **reference scale**, not as a
competitor. Without it, an example-mapping gap on sphinx-score has no size
to compare against — H2 is the interesting part, and it needs both.

## Reading the result

| Outcome | Verdict |
|---|---|
| large gap on sphinx, larger than claim-office | kata works as designed — the strongest available example-mapping instrument |
| gap present but smaller than claim-office | kata works, but claim-office stays the better example-mapping probe |
| no gap on sphinx | the pinned examples are not doing the work — either the model resolves the ambiguities from the rule text after all, or the verification does not test what the examples pin |
| prose much cheaper *and* worse | early-stop artefact, not an information effect — re-check before drawing conclusions |

## Caveats

- **The prose prompt has never been run.** Its `## Rules` section is
  byte-identical to the example-mapping one and it contains zero example
  lines (11 in example-mapping), so it is a clean "same rules, no
  examples" control by construction — but no run has yet confirmed that
  an agent can complete the kata from it at all.
- **Two ambiguities are cheap to get right by luck.** With a
  four-alternative spread, a prose run can land on the pinned reading by
  chance, so single runs are noisy — hence `min_replicates: 6`.
- **claim-office at `opus-5-no-thinking` sits at 0.947 in the controlled
  cell**, so its own headroom for a prompt effect is limited. A small
  claim-office gap may reflect the ceiling rather than the kata.
- **The claim-office reference is not pre-filled either.** The pool holds
  *zero* `claim-office-prose × opus-5-no-thinking` runs, so all four cells
  of this RQ fill from scratch (18 runs). H2 — the cross-kata comparison —
  therefore rests entirely on new data, not on pool history.
