---
id: RQ-kata-sphinx-vs-claim-office
question: "Can sphinx-score replace claim-office as the lab's correctness kata — does it separate a strong from a weak model as sharply, at a lower cost per data point?"
factors:
  kata_base:
    - sphinx-score
    - claim-office
  model:
    - opus-5-no-thinking     # strong probe: 0.920 on claim-office (n=25)
    - haiku-4-5-no-thinking  # weak probe:   0.371 on claim-office (n=7)
controls:
  prompt: example-mapping
  workflow: v6.6-lab-split-cc
outcomes:
  # primary: does the kata separate a strong from a weak model?
  - verification_pct
  - tests_passing
  - completed_within_budget
  # the reason for replacing: cost per data point
  - duration_seconds
  - total_tokens
  - cost_usd
  # is the kata substantial enough to show refactoring effects?
  - lines_of_code
  - cc_longest_function
  - cc_avg_loc_per_function
  - cognitive_max
  - mccabe_max
  - smell_total
  # TDD markers must stay healthy on the new kata
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - tests_passed_immediately
min_replicates: 6
status: aktiv
---

# RQ-kata-1.1: Can sphinx-score replace claim-office?

`claim-office` is the lab's correctness kata: it carries `verification_pct`
as an external acceptance metric and is the reference whenever a workflow
effect needs to be checked on a novel, ambiguity-rich task. It is also the
most expensive kata in the pool. This RQ asks whether the new
`sphinx-score` kata can take that role.

**This RQ measures the instrument, not the models.** The factor is the
kata; the model varies only as a *probe* — a strong and a weak model whose
known distance the kata must be able to resolve.

## Why the question arises

`sphinx-score` was built on 2026-08-11 from the Overlords Sphinx card
(design: [`../../kata-design/overlords-mehrdeutigkeiten.md`](../../kata-design/overlords-mehrdeutigkeiten.md)).
It is novel, carries four pinned ambiguities, and exposes the same CLI +
JSON contract as `claim-office`, so `verification_pct` is available.

Baseline numbers from the run pool (`opus-5-no-thinking`,
example-mapping, all workflows):

| Kata | n | duration (med) | tokens (med) | verification_pct (mean) | cycles | LoC |
|---|---|---|---|---|---|---|
| claim-office | 25 | 45.0 min | 65.1 M | 0.920 | 42 | 343 |
| game-of-life | 23 | 9.4 min | 8.1 M | 1.000 | 10 | 49 |
| **sphinx-score** | **1** | **24.8 min** | **19.3 M** | **1.000** | **11** | **48** |

Restricted to the exact cell this RQ compares against
(`opus-5-no-thinking × v6.6-lab-split-cc`):

| Kata | n | tokens (med) | duration (med) | verification_pct |
|---|---|---|---|---|
| claim-office | 5 | 127.5 M | 85.5 min | 0.947 |
| sphinx-score | 1 | **19.3 M** | **24.8 min** | 1.000 |

In the controlled cell `sphinx-score` uses roughly a seventh of the tokens
and a third of the wallclock. Note the caveat below on `cost_usd`: the
claim-office runs in this cell predate the cost pipeline and carry no
dollar figure, so the cost comparison rests on tokens and wallclock, not
on measured spend.

## What "can replace" has to mean

A kata is a measuring instrument. Three properties decide it, and all
three are measured here:

**1. Discrimination.** The kata must separate stronger from weaker
agents. `claim-office` does: across 514 runs its `verification_pct`
averages 0.763 with real spread (316 runs at 1.0, 80 at 0.0), and it
orders models cleanly — 0.920 for `opus-5-no-thinking` down to 0.371 for
`haiku-4-5-no-thinking`. It is *not* saturated. This is its central
value.

**2. Headroom under a strong model.** On `opus-5-no-thinking` claim-office
already reaches 0.920, so even it is starting to saturate. A replacement
must show spread on *this* model, not just on weaker ones.

**3. Cost.** Every RQ that uses claim-office pays its per-cell price. At
`opus-5-no-thinking × v6.6-lab-split-cc` — the strong cell of this RQ —
that is ~128 M tokens and ~86 min per data point. A replacement has to
undercut it without losing property 1.

## Hypotheses

- **H1 (discrimination):** `sphinx-score` separates the two probe models
  in `verification_pct` — `haiku-4-5-no-thinking` lands measurably below
  `opus-5-no-thinking`, as it does on claim-office (0.371 vs 0.920).
  *Refuted if both cells sit at 1.0.*
- **H2 (cost):** `sphinx-score` is cheaper per data point than
  `claim-office`. In the controlled cell the smoke run points that way on
  both axes (19.3 M vs 127.5 M tokens, 24.8 vs 85.5 min), but it is a
  single run against five. The fill tests whether the gap holds and
  whether it survives on the weak model, where claim-office is already
  fast (19.8 min median at haiku).
- **H3 (substance):** The TDD markers stay healthy (`cycle_count` ≥ 3,
  `refactorings_applied` ≥ 1, `predictions_total` ≈ 2 × `cycle_count`) and
  the kata produces enough code for refactoring effects to be visible.
  *At risk:* the smoke run finished at 48 LoC with `cognitive_max` 1 —
  possibly too small for quality metrics to move at all.

## Probe models

`opus-5-no-thinking` (strong) against `haiku-4-5-no-thinking` (weak),
workflow held at `v6.6-lab-split-cc`.

Models are the right probe *for this question*, workflows are not. A first
cut of this RQ used `v6.6-lab-split-cc` vs `v3-basic-tdd` as the
strong/weak pair. On the correctness axis that pairing is inverted: on
claim-office `v3-basic-tdd` scores **1.00 in all five runs** (5 min, 4 M
tokens) while `v6.6-lab-split-cc` scores 0.947 (86 min, 128 M tokens).

The two workflows *do* separate — but on decomposition
(`cc_longest_function` 25 vs 14, `cognitive_max` 5 vs 3,
`refactorings_applied` 2 vs 42), not on correctness. Since this RQ asks
whether the kata can carry the **correctness** role, a probe that does not
move correctness is useless here. That workflow gap is the subject of
[RQ-kata-1.3](../1.3-sphinx-workflow-sensitivity/README.md).

Models do span one. On claim-office the ordering is well populated and
monotone across 40+ model variants, from 1.000 (glm-5-1, opus-4-7-portkey)
down to 0.000 (qwen3-235b, haiku-4-5-portkey). The chosen pair sits inside
that range with real spread on both ends — `haiku-4-5-no-thinking` at
0.371 (n=7) is weak but not floored (max 0.80), which a floored probe like
qwen3 would not give us.

**Caveat on that 0.371.** Those seven runs come from `v4-exact-subagents`
(4) and `v3-basic-tdd` (3) — *not* from `v6.6-lab-split-cc`, the workflow
this RQ controls on. The number establishes that haiku is weak on this
kata, but the strong/weak distance under the controlled workflow is
itself part of what the fill measures. All four cells of this RQ are
empty at that workflow, so both katas start from the same footing.

## Reading the result

| Outcome | Verdict |
|---|---|
| sphinx separates the models **and** stays ≈ 3× faster in wallclock | **replace** — same discrimination, a third of the turnaround |
| sphinx separates the models, wallclock advantage gone | keep claim-office as reference; sphinx is a second novel kata |
| sphinx saturates at 1.0 in both cells | **no replacement** — sphinx measures nothing on strong models |
| sphinx separates them but TDD markers collapse | no replacement — the kata is too small to carry a workflow |

Note that "replace" here means *for correctness RQs on strong models*.
Even a negative verdict leaves `sphinx-score` useful: it is novel, cheap
in tokens and wallclock, and carries four documented ambiguities, which
makes it a candidate for prompt-style RQs (1.2) and possibly workflow RQs
(1.3) regardless.

## Caveats

- **n=1 prior.** Everything about `sphinx-score` rests on a single smoke
  run. The 24.8 min / 19.3 M / $13.20 figures may not hold, and H2 rests
  entirely on that single point.
- **`cost_usd` is not comparable across the cells.** The claim-office runs
  in the controlled cell predate the cost pipeline and carry no dollar
  figure; the sphinx smoke run was costed retroactively ($13.20). Token
  counts and wallclock are the sound cost axes here. Running
  `experiments/compute-cost.py` over the claim-office cell would close
  this gap.
- **One inherited run.** Only the smoke run pre-populates a cell
  (sphinx × opus-5); the other three cells fill from scratch. That keeps
  the comparison balanced, but it also means 17 of 18 runs are new — the
  RQ is a fill, not an aggregation over existing data.
- **Ambiguity pre-test says the kata is hard.** All four pinned readings
  run against the model majority (2/20, 6/20, 0/20 in the 2026-08-11
  probe). That predicts spread on weaker models — but the smoke run under
  the strong model hit 16/16, so the ceiling may be close.
- **Correctness only.** This RQ does not ask whether `sphinx-score` can
  replace `game-of-life` as the *quality* kata. Its 48 LoC suggest it
  cannot, but that is a separate question.
- **The pre-test was run on the card text, not on the kata prompt.** The
  prompt carries the example-mapping examples, which the smoke run showed
  to be a sufficient lever for a strong model. Weaker models may use them
  less effectively — that is precisely what H1 tests.
- **The workflow is a control here, not a factor.** Whether the kata also
  separates *workflows* is a separate question — measured on code quality,
  not correctness — and is covered by
  [RQ-kata-1.3](../1.3-sphinx-workflow-sensitivity/README.md). Prompt-style
  discrimination is covered by
  [RQ-kata-1.2](../1.2-sphinx-prompt-sensitivity/README.md).
