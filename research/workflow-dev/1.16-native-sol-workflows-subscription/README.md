---
id: RQ-native-sol-workflows-sub
question: "On the OpenAI subscription route, does a workflow line written natively for Sol (basic-sol-tdd, Predictive TDD) beat structureless TDD (v3) — the floor that no Opus-derived architecture clears on this model?"
factors:
  workflow_x_prompt:
    - {workflow: v3-basic-tdd-pi,           prompt: example-mapping}  # floor: TDD without architecture
    - {workflow: basic-sol-tdd-pi,          prompt: example-mapping}  # native line, refactor inline
    - {workflow: basic-sol-tdd-subagent-pi, prompt: example-mapping}  # native line, refactor isolated
  kata_base: [claim-office, game-of-life]
controls:
  model: gpt-5-6-sol-codex
outcomes:
  # primary: does the native line clear the v3 floor on code quality?
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - cc_longest_function
  - smell_total
  - cc_avg_loc_per_function
  # correctness — gate, not differentiator: v3 already reaches 100 % on both katas
  # on the Requesty route (RQ-architecture-axis-sol-pi). A native cell that drops
  # below that disqualifies itself regardless of its quality numbers.
  - verification_pct
  - tests_passing
  - completed_within_budget
  # code mass — reported without trophy, see "Metric blind spot" in RQ-1.14:
  # APP has no notion of nesting and rewards one long function
  - code_mass
  # TDD discipline — n/a on the v3 cell (no phase markers). On the native cells,
  # compare predictions_correct_rate ONLY, never predictions_total; see below.
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost — the native line must earn its overhead against a floor that is cheap
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: answered
---

# RQ-native-sol-workflows-sub: Does a Native Sol Workflow Clear the v3 Floor?

## The question this answers

`RQ-architecture-axis-sol-pi` (workflow-dev/1.14) measured the full architecture axis
on Sol and found that **no** architecture in this lab's v-line beats structureless TDD.
On game-of-life v3 wins nearly every quality metric; on claim-office it matches every
structured cell at 100 % correctness while running 5× faster and 8× cheaper than v6.1
(F-1.6). The RQ had named that outcome in advance as its H4 counter-case: then the
honest recommendation is v3.

That result leaves one confound untested. **Every cell in RQ-1.14 descends from the
same Opus-developed source.** v3 through v6.6 share a lineage, a vocabulary (APP mass,
the four-marker contract, the Compilation/Runtime prediction form) and a set of design
decisions all validated on opus-4-7. "The v-line loses to its own baseline on Sol"
supports two readings:

1. Architecture does not pay on this model.
2. *This* architecture, tuned elsewhere, does not transfer.

This RQ tests reading 2 with a workflow line written independently of the v-chain.

## The native line

Source is the `sol_tdd` project (`predictive-tdd` and `test-list` skills), ported to
pi as two workflows that differ **only** in where refactoring runs:

| Cell | Methodology | Refactor |
|---|---|---|
| `v3-basic-tdd-pi` | "use TDD", no phase structure | — (floor) |
| `basic-sol-tdd-pi` | Predictive TDD | inline, main context |
| `basic-sol-tdd-subagent-pi` | identical | isolated subagent |

What the native line changes relative to the v-line, deliberately:

- **No APP mass, no metric-driven end-refactor.** Refactoring is governed by the Four
  Rules of Simple Design alone. The v-line protects APP as a load-bearing element
  precisely because the before/after comparison forces *measurable* refactorings; this
  line tests whether that scaffolding earns its place on Sol or is part of what F-1.6
  counts as machinery showing up in the artefact.
- **Predictions are prose, not a form.** The two verbatim prediction lines exist only
  as the mechanical summary P5/P6 need.
- **Red is behavioral.** A valid Red fails because the active behavior is missing;
  compilation scaffold is a means, not a phase.

The pair is also internally controlled. In the v-line the refactor-isolation contrast
is confounded — v5.1 → v6.1 changes refactor isolation *and* skill structure at once.
Here it is isolated, which speaks to an open point at the end of F-1.6: on Sol the
v6.1 refactor subagent does not perform the extraction it exists for (inspected runs
leave a triply-nested loop that the v3 baseline names), while the same subagent does
extract on opus-4-7. Whether that survives a different refactor brief is measurable here.

## Why this is a separate RQ and not two cells in RQ-1.14

RQ-1.14 controls on `gpt-5-6-sol` — the **Requesty** route. These workflows are meant
to run on the **OpenAI subscription** route (`gpt-5-6-sol-codex`), and that is not a
free substitution: `RQ-route-effect-pi` (F-1.3.6) establishes a real route effect on
exactly the metrics this RQ measures, at constant model, harness, workflow, kata and
prompt style:

| | Requesty (off) | Requesty (reasoning ON) | subscription |
|---|---:|---:|---:|
| Complexity Peak | 8.0 | 9.0 | **4.0** |
| Smell Total | 2.0 | 2.0 | **0.0** |
| Production LoC | 28 | 28 | 41 |

F-1.3.6 shows this is a route effect, not a reasoning effect — switching reasoning on
for Requesty does not reproduce the profile. Putting `-codex` cells next to RQ-1.14's
Requesty cells would therefore confound the native-vs-v-line comparison with the route,
in the same direction the native line is expected to move. So the floor is re-measured
here on the subscription route rather than borrowed.

**Consequence: `v3-basic-tdd-pi` × `gpt-5-6-sol-codex` has no existing runs** (checked
2026-08-16) and must be filled as part of this RQ. The RQ-1.14 v3 numbers are not
transferable.

## Constants of the subscription route — binding

- **Reasoning is always on and cannot be switched off** (F-1.3.5). The Responses API
  decides server-side; `--thinking off` sets pi's level, not whether it reasons, and a
  verified `reasoning: false` profile still produced 2882 thinking blocks. Reasoning is
  therefore a constant of this RQ, not a factor, and it is on in every cell including v3.
- **Throughput is lower than on Requesty** (F-1.3.1: Requesty delivers 1.63× the
  throughput). Cost and duration comparisons inside this RQ are valid; against RQ-1.14
  numbers they are not.
- The `codex` in the lab id names the pi provider `openai-codex` through which the
  subscription is reached — **not** the Codex CLI, which is a separate harness unused
  in this lab.

## Lab adaptations to the source line — binding

The `sol_tdd` skills were written for interactive use and carry a human-in-the-loop
autonomy agreement. Two changes were required to make them measurable, both documented
inside the workflows in a `LAB-ONLY` block so they are visible and reversible on export:

1. **HITL removed.** The harness runs unattended. Where the source says "pause and ask
   the human", the workflow now says: adopt the most defensible reading of the spec,
   state it explicitly, continue. This is a real deviation from the source methodology,
   not a neutral port.
2. **Markers P1–P7 added.** The source prescribes no phase markers at all.

These cells therefore measure the source methodology *as adapted*. A difference against
v3 could in principle come from the adaptation rather than the methodology. The
adaptation is confined to autonomy and output format — but it is not zero, and it is
the first thing to check should a cell behave anomalously.

## `predictions_total` is not comparable on this line — binding

The source methodology forbids manufacturing a failure when an earlier generalization
already covers the next test ("do not manufacture a failure"). Such cycles count in
`cycle_count` but carry no predictions, so `predictions_total ≈ 2 × cycle_count` does
not hold.

**Compare on `predictions_correct_rate`, never on `predictions_total`** — the absolute
count measures how often a test started green, not prediction discipline. See
MARKERS.md, "Convention for marker 3".

A second, unrelated effect was seen in the marker smoke run and is *not* covered by
that exception: in the inline arm 3 of 10 red phases carried a prose-only prediction
with no `Red Phase Complete:` block. That is a genuine compliance loss, and it is
structural — the source defines predictions as prose and the two lines are retrofitted,
unlike the v-line where the form *is* the prediction. If it persists at n=5, the lever
is the verbatim instruction in red position, not more prose. Watch it via
`predictions_correct_rate` against the RQ-1.14 v-line values (95.8–100 % on Requesty).

## Measurement limit — v3 cell

Inherited unchanged from RQ-1.14: **TDD-discipline metrics are not defined on v3.** It
prescribes no phase markers, so `cycle_count`, `refactorings_applied` and
`predictions_correct_rate` are reported as **n/a**, never as 0, and carry no trophy in
those rows. Correctness and code-quality metrics are unaffected — they are measured
externally from the source tree.

Note that `cycle_count` is in any case not comparable across marker-based and
inferred paths (MARKERS.md: v3 yields 1–8 where v6.6 yields 7–57 on opus-5 — different
constructs, not different discipline). It is reported for context, not as a ranking.

## Metric blind spot — decomposition

Inherited from RQ-1.14 and binding here too: `code_mass`, `cognitive_max` and
`mccabe_max` all fail to detect missing abstraction, because Cognitive Complexity
resets its nesting counter at every function boundary and APP has no notion of nesting
at all. A single long function built from callback chains scores *better* on all three
than the same logic split into named domain functions.

**`cc_avg_loc_per_function` is therefore the binding decomposition metric**, with
`cc_longest_function` secondary. Both are immune to the callback trick. Neither
measures naming. No workflow in this RQ names either metric, so cross-workflow
comparison is valid here.

`code_mass` is reported without a trophy for the same reason.

## Hypotheses

- **H1 (native line clears the floor).** Both `basic-sol-tdd-*` cells beat
  `v3-basic-tdd-pi` on `cc_avg_loc_per_function` and `cognitive_max` on at least
  game-of-life, at 100 % `verification_pct`.
  → Reading 2 holds: architecture *can* pay on Sol, and F-1.6 measured a transfer
  failure of the Opus-derived line rather than a property of the model. Workflow
  development for Sol restarts from this line.
- **H2 (floor holds again).** The native cells land within 1 σ of v3 on quality while
  costing more.
  → Reading 1 holds: the F-1.6 result is about the model, not the lineage. v3 stays
  the honest recommendation on Sol and further workflow investment there is hard to
  justify.
- **H3 (refactor isolation is the differentiator).** The two native cells separate
  from each other by more than they separate from v3.
  → The interesting axis on Sol is refactor isolation, independent of methodology;
  reconciles with the F-1.6 observation that the v6.1 subagent underperforms on Sol.
- **H4 (correctness regression).** A native cell drops below 100 % `verification_pct`
  on claim-office.
  → Disqualifying regardless of quality numbers — v3 already achieves 100 % there on
  the Requesty route, and the claim-office spec is where Opus-derived workflows have
  historically broken (RQ-1.9, RQ-1.10).

Reading rule inherited from RQ-1.14: absolute thresholds are not comparable across
models or routes. Only ranking and direction *within this RQ* are evaluated.

## Caveats

1. **Port equivalence is an assumption.** The two `basic-sol-tdd-*` workflows are new.
   Markers P1–P7 were verified structurally and in a smoke run (see below), but any
   port bug would surface as a workflow effect.
2. **The smoke run is not a data point.** Two runs exist on `game-of-life-prose` ×
   `gpt-5-6-sol-codex` (`batch-plans/basic-sol-tdd-smoke.json`). Wrong prompt style for
   this RQ — they verify marker mechanics only and must not be pooled into any cell.
3. **One prompt style.** example-mapping, consistent with RQ-1.14 and every previous
   architecture comparison. The v3 cell inherits RQ-1.14's caveat that its CC
   counterparts never ran example-mapping, so cross-model statements about the v3 row
   confound model and prompt style.
4. **No continuation overlay on any cell.** v3 has no phase boundaries to stall at; the
   native line carries its own phase-continuation section inside the `LAB-ONLY` block.
   Systematic `completed_within_budget = false` in any cell is read as a harness stall,
   not a workflow effect.
5. **Cost figures are route-internal.** The subscription route bills per subscription,
   not per token; `cost_usd` is a list-price estimate. Compare within this RQ only.

## Open questions

- If H1 holds: does the advantage survive on the Requesty route, or is it entangled
  with the route effect that F-1.3.6 documents? → follow-up cell on `gpt-5-6-sol`.
- If H3 holds: does the same isolation effect appear when the v-line's refactor agent
  (APP-based) is swapped into the native line, isolating brief from architecture?
- Does the prose-prediction compliance loss (see above) scale with kata size — i.e. is
  it worse on claim-office than on game-of-life?
