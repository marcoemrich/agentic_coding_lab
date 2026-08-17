---
id: RQ-native-sol-workflows-sub
question: "On the OpenAI subscription route, does a workflow line written natively for Sol (basic-sol-tdd, Predictive TDD) beat structureless TDD (v3) — the floor that no Opus-derived architecture clears on this model?"
factors:
  workflow_x_prompt:
    - {workflow: v3-basic-tdd-pi,           prompt: example-mapping}  # floor: TDD without architecture
    - {workflow: basic-sol-tdd-pi,          prompt: example-mapping}  # native line, refactor inline
    - {workflow: basic-sol-tdd-subagent-pi, prompt: example-mapping}  # native line, refactor isolated
  kata_base: [claim-office, game-of-life, sphinx-score]
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

## `sphinx-score` as the novelty control — added 2026-08-17

The first pass of this RQ ran two katas and produced an inversion: the native line
clears the v3 floor decisively on claim-office (F-1.16.1) and ties at 3.2× the cost on
game-of-life (F-1.16.2). F-1.16.5 reads that as a size effect — architecture pays where
the spec exceeds what one context handles well.

**That reading is confounded.** The two katas differ on two axes at once, not one:

| | Code Mass (APP) | Novel to the model? |
|---|---:|---|
| game-of-life | 196 | no — canonical, training-known |
| claim-office | 758–997 | yes — lab-authored |
| **sphinx-score** | **183** | **yes — lab-authored 2026-08-11** |

game-of-life is both *small* and *known*; claim-office is both *large* and *novel*. So
"the spec fits in one context" and "the model has seen this task a thousand times" are
indistinguishable in the current data, and F-1.16.5 picks the first without evidence
against the second.

`sphinx-score` breaks the tie. At Code Mass 183 it is a size twin of game-of-life
(196 — RQ-kata-1.3, F-1.2 establishes this pairing), but it was authored in this lab and
carries four pinned ambiguities from the Overlords design. It holds size constant and
varies only novelty:

- Native line **clears the floor on sphinx** → the driver is novelty, not size. F-1.16.5
  needs rewriting: architecture pays where the model has no memorized solution,
  regardless of how large the spec is.
- Native line **ties on sphinx, as on game-of-life** → the driver is size. F-1.16.5 holds
  as written, now with the novelty alternative ruled out.

Note this is *not* the mid-size kata that F-1.16.5's open question asks for. Sphinx does
not sit between game-of-life and claim-office on size; it sits next to game-of-life. It
answers a different and logically prior question — which of the two entangled axes the
inversion runs on. Locating the size boundary still needs a genuine mid-size kata and
stays open.

## Measurement limit — complexity metrics floor on sphinx (binding)

`sphinx-score` is structurally flat, and RQ-kata-1.3 F-1.2 measures it precisely: on
`opus-5-no-thinking × v6.6-lab-split-cc` **`cognitive_max` is exactly 1 in all six runs
(σ = 0)** and `mccabe_max` exactly 2 (σ = 0). The kata contains no branch depth for these
metrics to resolve. Across the three katas the separation factors show which metrics
survive:

| Metric | sphinx (183) | game-of-life (196) | claim-office (758–997) |
|---|---:|---:|---:|
| `cc_longest_function` | 1.9× | 1.9× | 1.8× |
| `cc_avg_loc_per_function` | 2.4× | 1.9× | 2.8× |
| `cognitive_max` | 1.5× | 6.1× | 2.7× |
| `mccabe_max` | 1.2× | 2.3× | 1.9× |

**Outcome (2026-08-17): the floor is worse on Sol than this section anticipated, and the
sphinx cells decide nothing at all.** The plan was to fall back on the length metrics,
which separate 2.4× / 1.9× on `opus-5-no-thinking`. On Sol that fallback is unavailable:
the kata produces a single function in 12 of 15 runs, which makes
`cc_avg_loc_per_function` numerically identical to `cc_longest_function` and turns both
into a file-length measure. No quality metric in the sphinx table carries a trophy. See
F-1.16.7.

The transferability assumption behind the table above is what failed: those factors were
measured on `opus-5-no-thinking`, and the floor turned out to be a property of the
kata-model pair, not of the kata alone. **Pre-check `cc_functions` on a single probe run
before committing cells on a new kata-model pair** — a mean near 1 means no decomposition
metric will resolve anything.

`smell_total` was 0 in all 36 runs of RQ-kata-1.3 and is unlikely to discriminate here
either; it stays in `outcomes` as a regression guard, not as a differentiator.

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

- **H5 (novelty, not size, drives the inversion).** On `sphinx-score` — size twin of
  game-of-life, novel like claim-office — the native line beats `v3-basic-tdd-pi` on
  `cc_avg_loc_per_function` and `cc_longest_function`, i.e. it patterns with claim-office
  rather than with its own size class.
  → F-1.16.5 is wrong as written: architecture pays against unfamiliarity, not against
  spec size. The recommendation splits by novelty, and game-of-life's tie becomes a
  statement about a memorized kata rather than about small specs.
  → **Counter-case:** sphinx ties, as game-of-life did. Then size is the driver, F-1.16.5
  stands, and the novelty alternative is ruled out — a strengthening, not a null result.
  → **Untestable, neither supported nor refuted (F-1.16.7).** The kata collapses to one
  function on Sol, so the length metrics it was to be decided on measure file length
  rather than decomposition. The size-vs-novelty confound in F-1.16.5 stays open.

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
6. **The sphinx cells were filled after the first six.** The claim-office and
   game-of-life cells ran 2026-08-16, the sphinx cells 2026-08-17, same route, model,
   workflows and prompt style. Any drift on the subscription route between those dates
   sits in the sphinx rows. The v3 row is the check: it is the same workflow on all three
   katas, so a v3 profile on sphinx that is anomalous against its own two earlier rows
   points at the route rather than at the kata.
7. **Novelty is argued, not measured.** "sphinx-score is novel to the model" rests on it
   having been authored in this lab on 2026-08-11 and on claim-office behaving like a
   novel task. There is no contamination test. If Sol has seen a structurally similar
   set-collection scoring task, H5's counter-case would be indistinguishable from a
   genuine size effect.

## Open questions

- If H1 holds: does the advantage survive on the Requesty route, or is it entangled
  with the route effect that F-1.3.6 documents? → follow-up cell on `gpt-5-6-sol`.
- Where does the size boundary lie between "architecture pays" and "architecture is
  overhead"? `sphinx-score` does **not** answer this — it is a size twin of
  game-of-life and controls novelty instead. A genuine mid-size kata
  (`claim-office-lite`, Code Mass between 200 and 750) is still needed, and is worth
  running only if H5's counter-case holds and size survives as the driver.
- If H3 holds: does the same isolation effect appear when the v-line's refactor agent
  (APP-based) is swapped into the native line, isolating brief from architecture?
- Does the prose-prediction compliance loss (see above) scale with kata size — i.e. is
  it worse on claim-office than on game-of-life?
