---
id: RQ-kata-sphinx-workflow-sensitivity
question: "Does sphinx-score resolve a workflow difference in code quality — does the decomposition gap between a minimal and an elaborate TDD workflow show up as clearly as it does on claim-office?"
factors:
  kata_base:
    - sphinx-score
    - claim-office
    - game-of-life
  workflow:
    - v6.6-lab-split-cc   # elaborate: refactor subagent, test-list phase, audit bundle
    - v3-basic-tdd        # minimal: plain red-green-refactor, no subagents
controls:
  prompt: example-mapping
  model: opus-5-no-thinking
outcomes:
  # primary: decomposition — this is where the workflows actually differ
  - cc_longest_function
  - cc_avg_loc_per_function
  - cognitive_max
  - mccabe_max
  - cc_functions
  - smell_total
  - code_mass
  - lines_of_code
  # the mechanism the elaborate workflow adds
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # correctness — saturated on this model, kept as a guard rail
  - verification_pct
  - tests_passing
  - completed_within_budget
  # what the elaborate workflow costs
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 6
status: aktiv
---

# RQ-kata-1.3: Does sphinx-score resolve a workflow difference?

[RQ-kata-1.1](../1.1-sphinx-vs-claim-office/README.md) asks whether
`sphinx-score` separates a strong from a weak *model*;
[RQ-kata-1.2](../1.2-sphinx-prompt-sensitivity/README.md) whether it
separates prompt *information*. This one asks the third question: does it
separate *workflows* — and it has to be measured on code quality, not on
correctness.

## Why correctness is the wrong axis here

A first cut of RQ-1.1 used this same workflow pair as a strong/weak probe
and read it as "no separation", because `verification_pct` came out
*inverted*: `v3-basic-tdd` scored 1.00 in all five runs while
`v6.6-lab-split-cc` scored 0.947.

That reading was wrong. On `claim-office × opus-5-no-thinking` the two
workflows separate sharply — just on the decomposition metrics, which the
elaborate workflow is actually built to move:

| Metric | v3-basic-tdd | v6.6-lab-split-cc | ratio |
|---|---:|---:|---|
| `cc_longest_function` | 25.0 | **14.0** | 1.8× |
| `cc_avg_loc_per_function` | 8.4 | **3.2** | 2.6× |
| `cognitive_max` | 5.0 | **3.0** | 1.7× |
| `mccabe_max` | 5.0 | **3.0** | 1.7× |
| `refactorings_applied` | 2.0 | **42.0** | 21× |
| `verification_pct` | **1.000** | 0.933 | inverted |
| `lines_of_code` | **292** | 542 | 1.9× more |

(medians, n=5 per cell)

So the pair *is* a usable yardstick — for decomposition. `claim-office` at
this model is correctness-saturated, so correctness cannot show the
difference; the elaborate workflow buys smaller functions and lower
complexity at the price of nearly twice the code and 21× the refactorings.

## The question for sphinx-score

The smoke run produced 48 LoC, `cc_longest_function` 7, `cognitive_max` 1,
`mccabe_max` 2 — already near the floor of what these metrics can express.
If `v3-basic-tdd` lands in the same place, the kata has **no headroom** for
workflow effects: there is nothing left to decompose in a 48-line solution.

This is the central risk for `sphinx-score` as a general-purpose kata, and
it is a different risk from the one RQ-1.1 tests. A kata can discriminate
models on correctness and still be useless for workflow research.

## Hypotheses

- **H1 (decomposition gap):** On `sphinx-score`, `v3-basic-tdd` produces
  measurably longer functions and higher complexity than
  `v6.6-lab-split-cc`, in the same direction as on claim-office.
  *Refuted if both cells sit at `cc_longest_function` ≈ 7 and
  `cognitive_max` ≈ 1.*
- **H2 (relative resolution):** The gap is *smaller* on `sphinx-score`
  than on claim-office, simply because the solution is an order of
  magnitude smaller. The open question is whether it stays large enough to
  measure.
- **H3 (refactoring mechanism):** `refactorings_applied` separates the
  workflows on sphinx-score too — the elaborate workflow's 21× advantage
  on claim-office is a workflow property, not a kata property, so it
  should carry over even if the code-quality gap shrinks.

## Reading the result

| Outcome | Verdict |
|---|---|
| clear decomposition gap on sphinx | kata is workflow-sensitive — usable for workflow RQs, not just correctness ones |
| gap present but much smaller than claim-office | usable as a cheap pre-screen; confirm effects on claim-office before publishing |
| no gap — both cells at the metric floor | **sphinx-score is a correctness/prompt kata only.** Workflow RQs keep claim-office or game-of-life |
| gap inverted (v3 decomposes better) | worth its own investigation — would contradict the claim-office pattern |

## Caveats

- **48 LoC is very little room.** `cognitive_max` 1 and
  `cc_longest_function` 7 leave almost no space below them. A null result
  here is more likely to mean "the kata is too small" than "the workflow
  does not matter", and the RQ cannot distinguish those two on its own.
- **The claim-office cells are pre-filled (n=5 each), the sphinx cells are
  not.** Unlike RQ-1.1 this RQ inherits real data on one side; the
  claim-office numbers above are pool data, not fresh measurements.
- **Correctness is inverted on claim-office in this pair.** That is a
  finding in its own right (the elaborate workflow costs 0.067
  verification and 21× the wallclock) but it belongs to a workflow RQ, not
  to a kata-evaluation RQ. Noted here so the aggregation is not read as a
  workflow recommendation.
- **`smell_total` is 0 in every cell measured so far** and may simply not
  discriminate at this scale.
