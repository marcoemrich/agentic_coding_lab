---
id: RQ-architecture-axis-opus5
question: "Does the TDD architecture axis (inline-tdd-v1 structureless / single-context-v2 single context / hybrid-v2 hybrid / hybrid-v6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer?"
factors:
  workflow_x_prompt:
    - {workflow: baseline-inline-tdd-v1-cc,                    prompt: example-mapping}  # baseline: TDD without architecture
    - {workflow: exact-single-context-v2-testlist-fix-cc,         prompt: example-mapping}  # everything in one shared context
    - {workflow: exact-hybrid-v2-testlist-fix-cc,  prompt: example-mapping}  # hybrid: red/green shared, refactor isolated
    - {workflow: exact-hybrid-v6-lab-split-cc,               prompt: example-mapping}  # current generation: hybrid-v2 + end-refactor phase
  kata_base: [claim-office, game-of-life]
  model:
    - opus-5-no-thinking
    # OR-match: the existing opus-4-7 reference runs are split across routes —
    # inline-tdd-v1 direct, single-context-v2/hybrid-v2 via Portkey (shut down 2026-07). Both count as the
    # same cell; new fill runs go direct. See caveat 1.
    - {any: [opus-4-7-no-thinking, opus-4-7-portkey-no-thinking]}
controls:
  # (empty — model is a factor here, see "Why model is a factor" below)
outcomes:
  # primary: decomposition — the metric that inverted the ranking in
  # RQ-architecture-axis-sol-pi (F-1.9). Listed first because it is the reason
  # this RQ exists at all: cognitive_max alone read hybrid-v2 as the cleanest cell
  # while it produced the least-decomposed code.
  - cc_avg_loc_per_function
  - cc_longest_function
  # code quality — the metrics the original axis was ranked on
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - smell_total
  - code_mass
  # correctness (internal + external)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline — NOT measurable on the inline-tdd-v1 cells (no phase markers);
  # see "Measurement limit" below. Read those rows as n/a, not as zero.
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost/throughput context
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: open
---

# RQ-architecture-axis-opus5: Does the Architecture Axis Survive the Model Generation Change?

## Motivation

The current workflow line — hybrid-v2 and everything built on it up to hybrid-v6 — was developed
and validated on `opus-4-7`. `model-recommendation-matrix.md` states the constraint:

> Workflow-Optimierungen, die auf opus-4-7 gemessen wurden, gelten **nur für opus-4-7**,
> bis sie cross-model repliziert sind.

Opus 5 is a model generation change, not a routing or sampling change. Two prior findings
make it likely that the ranking moves with it:

1. **The axis has already swapped once between model generations.** `RQ-workflow-model`
   (F-workflow-model.1) documents hybrid-v1 as the opus-4-7 optimum and unstable on opus-4-6,
   with subagents-v1 exactly the other way round. Generation change is the known trigger.
2. **On a different model the whole architecture turned into a net negative.**
   `RQ-architecture-axis-sol-pi` (F-1.6, F-1.10) found structureless inline-tdd-v1 beating every
   architecture on game-of-life, and explained the mechanism: the axis does not measure
   "how good is this workflow" but "how much of the TDD cycle does the model supply by
   itself". A model that iterates unprompted needs less scaffolding.

Finding 2 is what makes this urgent rather than routine. If Opus 5 iterates more on its
own than Opus 4.7 did — a plausible direction for a newer generation — then the
scaffolding that earned 3.4× on opus-4-7 may cost rather than buy on opus-5, and the
lab's default workflow recommendation would be wrong for the model the lab now runs.

## Why model is a factor, not a control

`exact-hybrid-v6-lab-split-cc` has no opus-4-7 history on Claude Code (1 run total, on opus-4-8).
Running it only on opus-5 would give the current workflow generation no cross-generation
axis, while inline-tdd-v1/single-context-v2/hybrid-v2 have one. The RQ would then answer "how do the workflows rank on
opus-5" for one cell and "how did the ranking change" for the others — two questions in one
table.

Making `model` a factor and filling **all four workflows on both generations** keeps the
design symmetric: every cell has a same-workflow counterpart on the other model, so the
generation effect is readable per workflow rather than only in aggregate.

Existing opus-4-7 runs are reused (see "Existing data" below); only hybrid-v6 needs its
opus-4-7 half filled from scratch.

## Why subagents-v2 is not a cell

subagents-v2 (isolated subagents for every phase) is excluded deliberately. It ranks last or
near-last wherever it has been measured recently: `verification_pct` 0.40 on Sol/claim-office
with the highest cost in the field (F-1.2), and rank 3 of 3 on claim-office complexity for
opus-4-7 (F-tdd-quality.9, `cognitive_max` 26.8 with σ 24.1). Its one strong showing —
game-of-life — is on the kata where every workflow reaches 100 % correctness and the
baseline inline-tdd-v1 beats it anyway. Spending 10 runs to re-establish that it loses would not change
any recommendation.

Consequence for reading: this RQ cannot speak to the subagents-v1/hybrid-v1 swap of F-workflow-model.1. It
measures the axis that is still a live decision — structureless vs. shared-context vs.
hybrid vs. current generation.

## Why the decomposition metric is primary

`RQ-architecture-axis-sol-pi` F-1.9 established, by construction on a minimal pair, that the
three metrics the axis was historically ranked on cannot detect missing abstraction:

| Metric | nested `for`/`if` | same logic as `reduce` callbacks |
|---|---:|---:|
| Cognitive Complexity | 10 | **1** |
| McCabe | 5 | **2** |
| Code Mass (APP) | 43 | **43** |

Two independent causes. Cognitive Complexity resets its nesting counter at every function
boundary, and an arrow function is one — so `for` inside `for` counts as nesting while
`reduce` inside `reduce` does not, although the reader holds two levels either way; on top
of that `cognitive_max` is a maximum *per function*, so logic spread across three callbacks
reports the maximum of one. APP fails differently: it has no notion of nesting at all, only
of how many constructs occur. That is not a bug — Micah Martin's premise is explicitly
"more compact is better", a sensible and different question from "is this well decomposed".

The practical consequence was visible in the Sol data: `cognitive_max` read hybrid-v2 as the
cleanest cell on claim-office (5.8) while `cc_avg_loc_per_function` read it as among the
worst (10.72), averaging 1.6 functions per implementation on game-of-life.

**`cc_avg_loc_per_function` is therefore the binding decomposition metric for this RQ**,
with `cc_longest_function` as secondary. Both are immune to the callback trick: a 30-line
function stays 30 lines regardless of its internal shape.

Three limits, stated so they are not rediscovered later:

- Neither measures naming. A function sawn into `step1`…`step10` would score well.
- Both are gameable the moment a workflow prompt names them (README §"Compliance metrics").
  None of the four workflows in this RQ names them, so cross-workflow comparison is valid here.
- Function *count* is deliberately **not** an outcome. More functions is not better — only
  the same work better decomposed is, which is what `cc_avg_loc_per_function` captures while
  a raw count would reward splintering.

**Code Mass (APP) carries no trophy in this RQ**, for the reason above. It stays in the
outcomes as context.

## Reference values (opus-4-7-no-thinking, existing runs)

The opus-4-7 half of three cells already exists. Computed from `experiments/runs/`,
example-mapping prompt, `*-no-thinking` variants only:

**claim-office-example-mapping:**

| Workflow | n | verification_pct | cognitive_max | cc_avg_loc_per_function | cc_longest_function | smell_total | code_mass |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline-inline-tdd-v1-cc | 5 | 1.00 | 19.8 | 13.07 | 51.6 | 16.8 | 992.4 |
| single-context-v2 | 6 | 1.00 | 14.83 | 10.03 | 32.67 | 6.83 | 692.7 |
| hybrid-v2 | 7 | 1.00 | **5.71** | **5.75** | **18.14** | **1.29** | 861.3 |
| exact-hybrid-v6-lab-split-cc | 0 | — | — | — | — | — | — |

**game-of-life-example-mapping:**

| Workflow | n | verification_pct | cognitive_max | cc_avg_loc_per_function | cc_longest_function | smell_total | code_mass |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline-inline-tdd-v1-cc | 10 | 1.00 | 21.8 | 16.52 | 32.5 | 6.0 | 165.6 |
| single-context-v2 | 5 | 1.00 | 17.6 | 9.58 | 20.8 | 4.8 | 154.0 |
| hybrid-v2 | 10 | 1.00 | **6.5** | **6.56** | **14.2** | **2.4** | 153.7 |
| exact-hybrid-v6-lab-split-cc | 0 | — | — | — | — | — | — |

Two properties of this baseline drive the design:

- **On opus-4-7 all four quality metrics agree.** hybrid-v2 wins `cognitive_max`,
  `cc_avg_loc_per_function`, `cc_longest_function` *and* `smell_total` on both katas, mostly
  by a wide margin (against inline-tdd-v1: 2.3–3.4× on complexity, 2.3–2.5× on decomposition, 2.5–13×
  on smells). This is the opposite of the Sol picture, where the metric groups came apart —
  `cognitive_max` favouring hybrid-v2 while decomposition and smells favoured inline-tdd-v1. On opus-4-7 the
  architecture paid by every available reading, which makes any inversion on opus-5 a strong
  signal rather than a metric artefact.
- **Correctness does not differentiate here.** All three workflows reach 1.00 on both katas.
  Unlike the Sol RQ — where subagents-v2 collapsed to 0.40 — correctness carries no signal on this
  reduced cell set, so the RQ rests on the quality and decomposition metrics.

## Hypotheses

- **H1 (ranking holds).** hybrid-v2/hybrid-v6 lead on `cc_avg_loc_per_function` and `cognitive_max`
  on both katas, as on opus-4-7. → The workflow line transfers to Opus 5; the current
  recommendation stands.
- **H2 (Sol pattern).** Opus 5 iterates enough on its own that inline-tdd-v1 closes the gap or wins,
  as it did on Sol (F-1.6/F-1.10). → The architecture's value was specific to opus-4-7's
  lack of self-directed cycling, and the default recommendation needs revising for Opus 5.
- **H3 (metric split).** The ranking holds on `cognitive_max` but inverts on
  `cc_avg_loc_per_function`, as it did on Sol. → The historical opus-4-7 ranking was partly
  an artefact of the blind spot in F-1.9, and every RQ that ranked cells on `cognitive_max`
  or Code Mass alone needs re-reading.
- **H4 (hybrid-v6 earns its addition).** hybrid-v6 beats hybrid-v2 on decomposition — the end-refactor
  phase is what should produce extraction. → The reduction chain's latest step transfers.
  **Counter-case worth naming:** if hybrid-v6 lands at or below hybrid-v2 on `cc_avg_loc_per_function`
  on both models, the end-refactor phase adds cost without adding structure, and that is a
  finding about the workflow rather than about the model.

Reading rule: the primary comparison is **within model, across workflow** (does the ranking
hold) and **within workflow, across model** (does the generation change the level). Absolute
cross-model thresholds are not compared — F-1.5 of the Sol RQ showed that complexity levels
are cell-specific rather than a model property.

## Measurement limit — binding

**TDD-discipline metrics are not defined on the inline-tdd-v1 cells.** inline-tdd-v1 prescribes no phase markers,
so P1–P6 never fire. Verified against the 22 existing CC inline-tdd-v1 runs: `cycle_count` 1 (parser
fallback), `refactorings_applied` 0, `predictions_total` 0 — in *every* run, across five
models. inline-tdd-v1 says "do TDD" but never says "write `## Red`".

Consequences:

- `cycle_count`, `refactorings_applied` and `predictions_correct_rate` are reported as
  **n/a** for inline-tdd-v1, never as 0, and carry no trophy in those rows. A 0 here means "not
  instrumented", not "did not refactor".
- Whether inline-tdd-v1 did TDD is not *automatically* measurable but **is** observable by hand from
  the transcript tool-call order. F-1.10 of the Sol RQ did exactly this and found the two
  models reading the same inline-tdd-v1 prompt differently — Opus writing its whole suite in one go
  (test-first, but not a cycle), Sol iterating. **Repeating that reconstruction for opus-5
  is part of this RQ**, because H2 stands or falls on it.
- Correctness and code-quality metrics are **unaffected** — measured externally from the
  source tree, not from markers.

Deliberately not fixed by adding markers to inline-tdd-v1: that would make it a different workflow (a
mini-v4) and destroy comparability with the 22 CC runs that define what "inline-tdd-v1" means here.

## Existing data

| Cell | opus-4-7 (existing) | opus-5 (existing) | To fill |
|---|---:|---:|---:|
| inline-tdd-v1 / claim-office | 5 (direct) | 0 | 5 × opus-5 |
| inline-tdd-v1 / game-of-life | 10 (direct) | 0 | 5 × opus-5 |
| single-context-v2 / claim-office | 6 (Portkey) | 0 | 5 × opus-5 |
| single-context-v2 / game-of-life | 5 (Portkey) | 0 | 5 × opus-5 |
| hybrid-v2 / claim-office | 7 (Portkey) | 0 | 5 × opus-5 |
| hybrid-v2 / game-of-life | 10 (5 direct, 5 Portkey) | 0 | 5 × opus-5 |
| hybrid-v6 / claim-office | 0 | 0 | 5 × opus-5 + 5 × opus-4-7 |
| hybrid-v6 / game-of-life | 0 | 0 | 5 × opus-5 + 5 × opus-4-7 |

Fill total: **50 runs** (40 on opus-5, 10 on opus-4-7 for the missing hybrid-v6 reference).
Confirmed against `batch-plan-from-rq.py`: 16 cells, 6 already at `min_replicates`.

## Caveats (binding)

1. **Mixed routing in the opus-4-7 reference.** The existing single-context-v2 and hybrid-v2 runs went via
   Portkey; the inline-tdd-v1 runs went direct. Portkey was shut down in 2026-07, so the hybrid-v6 fill runs
   on opus-4-7 will go direct — the same workflow-model cell as its comparators but a
   different route. Assumption (inherited from RQ-tdd-quality caveat b): routing does not
   affect code quality — same weights, same sampling parameters. It may affect
   `duration_seconds` and `completed_within_budget`. If pivots show routing-related spread on
   the quality metrics, this assumption fails and the affected rows are not interpretable.
2. **Only one prompt style.** example-mapping, consistent with every previous architecture
   comparison. prose/user-story were never run against this axis.
3. **hybrid-v6 is compared to a reference it never had.** Its opus-4-7 cells are filled *for* this
   RQ rather than inherited, so unlike inline-tdd-v1/single-context-v2/hybrid-v2 it carries no independent track record on
   that model. A v6.6-specific port or prompt problem would be invisible as such and would
   read as a workflow effect on both models alike.
4. **Correctness is expected to be flat.** All reference cells sit at 1.00. If opus-5 also
   saturates, `verification_pct` contributes nothing and the RQ rests entirely on the quality
   metrics — which have no significance test in this lab, only means and σ over n=5.
5. **This RQ does not measure what TDD itself buys**, only what *architecture on top of TDD*
   buys. There is no no-TDD cell — see RQ-architecture-axis-sol-pi, "Why there is no no-TDD
   baseline", for why a v1-style cell cannot answer that question with the current kata
   prompts.

## Relation to RQ-architecture-axis-sol-pi

Same axis, different model and harness. That RQ ran gpt-5-6-sol on pi and found the
architecture to be a net negative against plain TDD (F-1.6) with the metric groups
disagreeing (F-1.9). This RQ asks whether that was a property of Sol or of the newer model
generation in general — the cleanest available test, since it holds harness (Claude Code) and
kata constant and varies only the model within one vendor line.

If H2 confirms here, the two RQs together support the F-1.10 reading — architecture helps the
model that does not iterate on its own — as a general mechanism rather than a Sol
observation. If H1 confirms, the Sol result stays a model-specific finding and the workflow
line remains valid on its home model line.

## Open questions

- Does the Sol pattern of "model supplies the cycle by itself" appear on opus-5 —
  measurable only by transcript reconstruction on the inline-tdd-v1 cells (see "Measurement limit").
- If H3 holds (ranking inverts only on decomposition): which earlier findings in this repo
  rest on `cognitive_max` or Code Mass alone and need re-reading?
- Does hybrid-v6's end-refactor phase produce extraction on opus-5, given that the equivalent
  refactor subagent did not perform it on Sol (F-1.6) but did on opus-4-7 (F-1.10)?
