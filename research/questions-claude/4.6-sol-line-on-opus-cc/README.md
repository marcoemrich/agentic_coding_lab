---
id: RQ-sol-line-on-opus-cc
question: "Is the native Sol workflow line (basic-sol-tdd, Predictive TDD, Four Rules refactor) better only on Sol/pi, or does it also beat the v-line on Opus with native Claude Code — and does the APP effect that suppresses decomposition on Sol reproduce there?"
factors:
  workflow_x_prompt:
    - {workflow: v3-basic-tdd,           prompt: example-mapping}  # floor: TDD without architecture
    - {workflow: basic-sol-tdd-cc,       prompt: example-mapping}  # native Sol line, Four Rules, no APP
    - {workflow: v6.2-with-why-cleaned,  prompt: example-mapping}  # internal v-line, APP mass in refactor brief
  model:
    - opus-4-8-no-thinking
    - opus-5-no-thinking
controls:
  kata_base: claim-office
outcomes:
  # primary: decomposition — the axis on which the two lines separate on Sol
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  # mechanism witness: APP mass is what the v6.2 refactor brief optimises.
  # On Sol it runs *against* decomposition (F-1.17.1). Reported without trophy.
  - code_mass
  # code quality
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  # correctness — gate, not differentiator
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline — n/a on the v3 cells (no phase markers)
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-sol-line-on-opus-cc: Does the Native Sol Line Transfer to Opus?

## The question this answers

Two findings from the Sol/pi track make a claim that has never been tested outside
the model it was measured on:

- **F-1.16.1** — on `claim-office`, the native Sol line (`basic-sol-tdd-pi`) clears the
  v3 floor decisively, better *and* more predictable than the baseline.
- **F-1.17.1** — the v-line's APP mass brief achieves the lowest Code Mass and the worst
  decomposition of the field, behind even structureless TDD. `Invocation (Mass: 2)`
  prices extraction, so minimising the named number rewards inlining.

Both were measured on `gpt-5-6-sol-codex` via pi. Neither says whether the effect is a
property of **the workflow line** or of **the model reading it**. The two readings make
opposite predictions for this lab's main platform:

1. *Line property.* The Four Rules brief produces better decomposition than the APP
   brief regardless of model. Then the v-line's refactor brief is a liability on Opus
   too, and the lab's default workflow should change.
2. *Model property.* Sol follows a named metric literally where Opus weighs it against
   the brief's own guard ("Rule 2 trumps APP: Clarity over low mass"). Then F-1.17.1 is
   an instruction-following finding, the v-line is fine on Opus, and the Sol track needs
   its own workflow family.

Reading 2 already has one data point in its favour, from outside this RQ: `v6.2.1` ×
`opus-5-requesty` reaches `cc_avg_loc_per_function` 2.62 on game-of-life — the best value
in that comparison, with the same APP brief that collapses structure on Sol. That is a
different kata and harness, so it is suggestive, not decisive.

## Why native Claude Code, and why claim-office

**Native CC** (`opus-4-8-no-thinking`, `opus-5-no-thinking` — both wired to bare
`claude-opus-*` model ids) is the platform the v-line was developed and validated on. If
the native Sol line beats it *there*, the result is directly actionable for this lab's
default recommendation. Routing runs through the container's native-bypass path; see
"Routing" below.

**claim-office** is the only kata in this lab where the decomposition metrics measure
decomposition rather than function length. F-1.16.7 establishes the contrast: on
`sphinx-score` every cell collapses to a single production function, which makes
`cc_avg_loc_per_function` numerically identical to `cc_longest_function`. On claim-office
the two diverge (6.60 against 4.70 for `basic-sol-tdd-pi`), i.e. there is a real length
distribution and real structure to judge. It is also where both source findings were
measured, so this RQ sits next to a known, non-tied contrast rather than opening a new one.

## The three cells

| Cell | Methodology | Refactor brief | Architecture |
|---|---|---|---|
| `v3-basic-tdd` | "use TDD", no phase structure | — | — |
| `basic-sol-tdd-cc` | Predictive TDD | Four Rules of Simple Design | one command, one context |
| `v6.2-with-why-cleaned` | v-line Red/Green/Refactor | Four Rules **+ APP mass** | per-phase commands + refactor subagent |

The three-cell design carries both questions at once: `basic-sol-tdd-cc` against
`v3-basic-tdd` replicates F-1.16.1 on Opus, and `basic-sol-tdd-cc` against
`v6.2-with-why-cleaned` replicates the F-1.17.1 brief contrast. The shared v3 floor
anchors both against the same baseline, as it does in RQ-1.16 and RQ-1.17.

## The CC port — binding

`basic-sol-tdd-cc` was created for this RQ by porting `basic-sol-tdd-pi`. **A port is a
confound until proven otherwise**, so the transformation rules were fixed in advance:

| pi | CC | Rationale |
|---|---|---|
| `.pi/skills/predictive-tdd/SKILL.md` | `.claude/commands/predictive-tdd.md` | one document, all three phases — **not** split into red/green/refactor |
| `.pi/skills/test-list/SKILL.md` | `.claude/commands/test-list.md` | 1:1 |
| `.pi/AGENTS.md` (architecture + marker contract) | `.claude/rules/predictive-tdd-workflow.md` | auto-loaded project rules, the mechanism the whole v-line uses |
| `LAB-ONLY` fenced block | `.claude/rules/lab-only.md` | v6.6+ convention (MARKERS.md) — export by deleting one file |
| `stacks/typescript-vitest.md` | same path under `.claude/skills/` | harness-neutral, copied unchanged |

**The phases are deliberately NOT split into separate commands.** The source
methodology is a single skill covering the whole cycle; splitting it into `/red`,
`/green`, `/refactor` would import the v-line's architecture and this RQ would no longer
compare the workflow it names.

Consequence for measurement: with no `red` command there are no per-cycle `Skill` calls,
so `derive_cycle_count` falls through to the `## Red` text markers — the same construct
pi counts (P1). `refactorings_applied` also comes from the `## Refactor` text marker, but
that path had to be **fixed** before this RQ could run: the single `/predictive-tdd`
invocation makes `skill_phases` non-empty, which won the phase-source selection with a
stream containing one phase and no refactor, so the metric read 0 while the smoke run had
emitted 11 markers. `analyze_transcript.py` now resolves `refactorings_applied` through
its own chain (phase-derived → `## Refactor` text marker), mirroring
`parse_pi_transcript.py`. Verified against seven existing CC runs across v3, v4, v5.1,
v6.2 and v6.6 — all unchanged. See MARKERS.md, "Single-command workflows on CC".

Prediction lines use `✅ Correct` rather than the bare pi form, because CC's primary
regex `_PREDICTION_OUTCOME_RE` requires a separator before `Correct`. This is a marker
format adaptation, not a methodology change.

**Port verification:** a marker smoke run on `game-of-life-prose` preceded the fill
(`batch-plans/basic-sol-tdd-cc-smoke.json`, 2026-08-17). It is not a data point for any
cell — wrong kata and prompt style. It earned its keep: the workflow emitted all markers
correctly (11 × `## Red`, 11 × `## Green`, 11 × `## Refactor`, 22/22 predictions,
`verification_pct` 1.0) but `refactorings_applied` came out 0 through the parser bug
described above. Had the fill run unverified, 20 runs would have carried a zeroed metric
that reads exactly like a workflow effect — "the Sol line does not refactor on Opus".
After the parser fix the same transcript yields 11.

## Routing — binding

Both models use the **native** Claude Code path (bare `claude-opus-4-8` /
`claude-opus-5`), which requires the container's env-blanking so the globally configured
Requesty routing does not intercept them. All three workflows in a given plan run under
the same container-global CC routing, which is why this RQ mixes no pi or OpenCode cells.

Cost figures are list-price estimates and comparable **within** this RQ only. Against
RQ-1.16 / RQ-1.17 they are not: those ran on the OpenAI subscription route, where
throughput and billing differ (F-1.3.1).

## Measurement limit — v3 cells

Inherited from RQ-1.14, RQ-1.16 and RQ-1.17: **TDD-discipline metrics are not defined on
v3.** It prescribes no phase markers, so `cycle_count`, `refactorings_applied` and
`predictions_correct_rate` are reported as **n/a**, never as 0, and carry no trophy in
those rows. Correctness and code-quality metrics are unaffected — they are measured
externally from the source tree.

`cycle_count` is in any case not comparable across marker-based and inferred paths
(MARKERS.md). It is reported for context, not as a ranking.

## Metric blind spot — decomposition

Inherited and binding: `code_mass`, `cognitive_max` and `mccabe_max` all fail to detect
missing abstraction, because Cognitive Complexity resets its nesting counter at every
function boundary and APP has no notion of nesting at all. A single long function built
from callback chains scores *better* on all three than the same logic split into named
domain functions.

**`cc_avg_loc_per_function` is therefore the binding decomposition metric**, with
`cc_median_loc_per_function` as the robustness check against outliers and
`cc_longest_function` secondary.

`code_mass` is reported **without a trophy** and, as in RQ-1.17, primarily as the
mechanism witness: it is what the v6.2 refactor brief optimises. A v6.2 cell that wins on
Code Mass while losing on decomposition is the F-1.17.1 pattern reproducing.

F-1.17.3 adds a caveat to that reading. The blind spot protects a *many small callbacks*
shape, not a *three functions, longest 44 lines* shape — once decomposition collapses far
enough, the complexity metrics separate too. So the metrics moving together is not by
itself evidence against the mechanism.

## Hypotheses

- **H1 (line property — the Sol line wins on Opus too).** `basic-sol-tdd-cc` beats
  `v6.2-with-why-cleaned` on `cc_avg_loc_per_function` and `cc_median_loc_per_function`
  by more than 1 σ on both models, at equal correctness.
  → F-1.17.1 is a brief-design finding, not a model finding. The APP mass table is a
  liability wherever it is read, and the lab's default refactor brief needs revising.
- **H2 (model property — the effect is Sol-specific).** `v6.2-with-why-cleaned` matches
  or beats `basic-sol-tdd-cc` on the decomposition metrics on both models, while keeping
  the lower Code Mass.
  → Opus weighs the "clarity trumps APP" guard that Sol ignores. F-1.17.1 becomes an
  instruction-following finding, the v-line stays the default on Opus, and workflow
  development for Sol legitimately forks from the native line.
- **H3 (the floor holds on Opus too).** Neither structured cell clears `v3-basic-tdd`
  on decomposition at 100 % correctness.
  → The F-1.16.1 advantage was specific to the Sol/subscription pairing. On Opus the
  cheapest workflow is the honest recommendation, which would be a strong result against
  the whole v-line investment.
- **H4 (model generation splits the answer).** The ranking differs between
  `opus-4-8-no-thinking` and `opus-5-no-thinking`.
  → Instruction-following on metric-bearing briefs is a capability that changes across
  generations; the recommendation then has to be stated per model, and the
  model-recommendation matrix needs a workflow axis.

Reading rule inherited from RQ-1.14: absolute thresholds are not comparable across models
or routes. Only ranking and direction *within this RQ* are evaluated.

## Caveats

1. **The port is the main risk.** `basic-sol-tdd-cc` is new. Marker mechanics are
   verified structurally and by a smoke run, but a content-level port artefact would
   surface as a workflow effect. First thing to check if the cell behaves anomalously.
2. **`v6.2-with-why-cleaned` cells are partly pre-existing.** The `opus-4-8-no-thinking`
   cell has runs from earlier RQs; they are reused per the query-based aggregation rule.
   One of them carries `verification_pct = 0`, which is a known outcome on this kata and
   not a fill artefact.
3. **`v3-basic-tdd` × `opus-4-8-no-thinking` has no runs** (checked 2026-08-17) and must
   be filled. The `opus-5-no-thinking` v3 cell exists.
4. **Two model generations, one workflow generation.** `v6.2-with-why-cleaned` was tuned
   on opus-4-7. Running it on opus-5 is a transfer in itself; a weak v6.2 cell on opus-5
   is not automatically evidence about the brief.
5. **One run was refilled after an auth abort.** In the `v6.2 × opus-5` cell a run
   failed with `401 OAuth access token has been revoked` — the host OAuth token rotated
   at 10:30 while the run was in flight, so the container held a revoked value. The run
   was fachlich complete (tests green, verification 1.0) but could not write
   `experiment-done.txt`, landed as `error-1`, was deleted and refilled the same day on
   the same route. Environment failure, not a workflow outcome; unlike a timeout it
   measures nothing about the workflow and is therefore not counted.
6. **Thinking is off in every cell.** Both models use their `-no-thinking` variants, so
   reasoning is not a factor here. This differs from RQ-1.16/1.17, where reasoning is
   always on and cannot be switched off (F-1.3.5) — a further reason cost and duration do
   not transfer across those RQs.
7. **One prompt style.** example-mapping, consistent with RQ-1.16, RQ-1.17 and RQ-4.4.

## Open questions

- If H1 holds: does removing only the APP section from the v6.2 refactor agent recover
  the decomposition on Opus, as the same change is predicted to do on Sol? → the cheapest
  decisive follow-up, shared with RQ-1.17.
- If H2 holds: what exactly does Sol do differently with a metric-bearing instruction?
  A targeted probe would give one model both briefs on the same kata and compare how
  often the guard clause is honoured.
- Does the answer hold on game-of-life, where F-1.16.2 found the floor unbeaten on Sol?
  → the same three workflows on the small kata, once this RQ resolves.
- Does `basic-sol-tdd-subagent-cc` (refactor isolated) behave as on Sol, where isolation
  bought nothing and cost 2.7× (F-1.16.3)? → a fourth cell, only worth running if the
  inline arm proves competitive here.
