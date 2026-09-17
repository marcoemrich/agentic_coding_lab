---
id: RQ-v62-cleanup-validation-gol
question: "Does the cleanup equivalence result from RQ-1.6 (claim-office) also generalize to the training-known game-of-life kata, or does exact-hybrid-v4-cleaned-cc show a different effect there than on claim-office?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v3-with-why-cc,             prompt: example-mapping}  # baseline (with why blocks from RQ-1.5)
    - {workflow: exact-hybrid-v4-cleaned-cc,     prompt: example-mapping}  # + cleanup 2/3/6 from the v6.5.1 audit
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: game-of-life
outcomes:
  # primary: code quality (on GoL correctness is saturated)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # correctness (to confirm that GoL does not break)
  - tests_passing
  - completed_within_budget
  # TDD discipline
  - predictions_correct_rate
  - refactorings_applied
  - tests_passed_immediately
  - cycle_count
  # cost
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.7: exact-hybrid-v4-cleaned-cc vs exact-hybrid-v3-with-why-cc (game-of-life)

Does the RQ-1.6 finding (cleanups behaviourally equivalent to exact-hybrid-v3-with-why-cc on claim-office) also generalize to the training-known `game-of-life-example-mapping` kata, or do different effects show up there?

## Motivation

RQ-1.6 established on `claim-office-example-mapping × opus-4-7-portkey-no-thinking`: exact-hybrid-v4-cleaned-cc is behaviourally equivalent to exact-hybrid-v3-with-why-cc — no correctness regression, slight discipline drift (more refactorings, tighter spread), moderate cost (+13 % wallclock).

The [hybrid-v2 reduction line](../1.1-pep-effect-v6.1/findings.md) has repeatedly shown, however, that workflow effects are **kata-specific**:
- The pep/emoji reduction was correctness-invariant on GoL, but broke on claim-office.
- The discipline pattern (which workflow refactors more) partly inverts between GoL and claim-office.

This RQ tests whether the cleanup equivalence from RQ-1.6 is model-equivalent or whether GoL yields a different picture.

**Expectation:** on GoL `verification_pct` / `tests_passing` is typically saturated (both workflows near 100 %), so the correctness axis shows no difference. The interesting part is the discipline and code quality comparison.

## Workflow definition

Identical to RQ-1.6 — exact-hybrid-v4-cleaned-cc is exact-hybrid-v3-with-why-cc + the three hygiene cleanups from the archived v6.5.1 blueprint audit (consistency renames, refactor.md decoupling, tdd-experiment-mode reframing). Diff:

```
diff -r experiments/workflows/exact-coding/opus/exact-hybrid-v3-with-why-cc experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc
```

## Hypotheses

- **H0** (expectation) — exact-hybrid-v4-cleaned-cc is also behaviourally equivalent to exact-hybrid-v3-with-why-cc on GoL for correctness, with a possibly weak discipline/code quality drift in the same direction as on claim-office (more refactorings, slight improvement in Complexity Peak).
- **H1** (kata-specific cleanup effect) — on GoL hybrid-v4 shows *no* refactorings gain (claim-office: +34 %). The refactor.md decoupling effect observed in RQ-1.6 depends on the multi-iteration complexity of claim-office.
- **H2** (cost equivalence) — on GoL hybrid-v4 is no more expensive than exact-hybrid-v3-with-why-cc, because the shorter kata produces fewer iterations and the refactor.md coupling effect does not build up.

## Data state

n=5 per cell, newly collected 2026-05-25:
- `exact-hybrid-v3-with-why-cc` (n=5)
- `exact-hybrid-v4-cleaned-cc` (n=5)

Both run single-shard sequentially (in parallel as 2 containers, since short GoL sessions show no appreciable Portkey cut risk — see memory `portkey-shards-external-cut-risk`).

Replicate count: n=5 instead of n=8 as in RQ-1.6, because GoL is considerably shorter (~10 min/run vs ~37 min/run) and therefore yields less information per replicate; n=5 is enough for a cross-kata validation sanity check. If the data support a strong statement (e.g. an unambiguous discipline drift), this can be extended to n=8.
