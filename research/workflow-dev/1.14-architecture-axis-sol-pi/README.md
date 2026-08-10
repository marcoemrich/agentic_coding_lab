---
id: RQ-architecture-axis-sol-pi
question: "Does the TDD architecture axis (v4.1 isolated subagents / v5.1 single context / v6.1 hybrid) rank the same way on gpt-5-6-sol as it does on opus-4-7 — or does Sol land on the other side of the documented v4/v6 model swap?"
factors:
  workflow_x_prompt:
    - {workflow: v3-basic-tdd-pi,                prompt: example-mapping}  # baseline: TDD without architecture
    - {workflow: v4.1-testlist-scope-fix-pi,     prompt: example-mapping}  # all phases as isolated subagents
    - {workflow: v5.1-testlist-scope-fix-pi,     prompt: example-mapping}  # everything in one shared context
    - {workflow: v6.1-hybrid-testlist-scope-fix-pi, prompt: example-mapping}  # hybrid: red/green shared, refactor isolated
  kata_base: [claim-office, game-of-life]
controls:
  model: gpt-5-6-sol
outcomes:
  # primary: correctness — carries the v4<->v6 swap (only visible on claim-office)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # code quality — measured on BOTH katas: the architecture axis inverts between them
  # (v4.1 rank 1 on game-of-life, rank 8 on claim-office; F-tdd-quality.9)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - smell_total
  - code_mass
  # decomposition — added 2026-08-10 because none of the metrics above detect
  # missing abstraction: cognitive_max resets its nesting counter at every
  # callback boundary, and code_mass has no notion of nesting at all.
  # See "Metric blind spot" below.
  - cc_avg_loc_per_function
  # TDD discipline — does Sol keep the mechanics alive in each architecture?
  # NOT measurable on the two baseline cells (v1/v3 prescribe no phase markers) —
  # see "Baseline cells" below. Read those rows as n/a, not as zero.
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost/throughput context (Sol's selling point is speed)
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: closed
---

# RQ-architecture-axis-sol-pi: Does the Architecture Axis Rank the Same on Sol?

## Motivation

Workflow development in this lab is about to move to **gpt-5-6-sol on pi** as its primary
development combination. The measured case for that move is throughput: on the same
workflow and prompt style Sol@pi runs **3.0× faster on game-of-life (240 s vs 719 s) and
6.3× faster on claim-office (503 s vs 3149 s)** than opus-4-8 on Claude Code, at ~13× lower
cost and without a correctness penalty (`RQ-cost-sol-pi-vs-opus-cc`, F-1.1/F-1.2).

The problem is that the entire current workflow line was developed and validated on Opus.
`model-recommendation-matrix.md` states the constraint plainly:

> Workflow-Optimierungen, die auf opus-4-7 gemessen wurden, gelten **nur für opus-4-7**,
> bis sie cross-model repliziert sind.

Developing further on Sol without checking this means building on an unverified foundation.
This RQ verifies the foundation itself — the **architecture axis** — before any of the
reduction steps built on top of it are retested.

## Why the architecture axis first

`RQ-workflow-model` (F-workflow-model.1) documents a **model-dependent swap** on this exact
axis, measured on claim-office (`verification_pct`, *exact* generation):

| Workflow | opus-4-7 (n) | opus-4-6 (n) |
|---|---:|---:|
| v4-exact-subagents | 0.67 (10) | **0.93** (5) |
| v5-exact-single-context | 0.97 (9) | 0.87 (5) |
| v6-hybrid | **1.00** (5) | 0.68 (15) |

The winner changes with the model. v6 is the opus-4-7 optimum and unstable on opus-4-6;
v4 is exactly the other way round. The mechanism (F-workflow-model.2): v6 delegates
orchestration to the model via skill invocation in a shared context — opus-4-7 handles it,
opus-4-6 loses the claim half of the spec in ~40 % of runs.

**This makes the architecture axis a gate, not just one more comparison.** The whole
v6.1→v6.5 reduction chain is a refinement *of v6*. If Sol does not prefer v6, the reduction
chain is moot for Sol, and retesting it (planned as the follow-up RQ-B) would measure
refinements of an architecture that does not suit the model.

## Baseline cell (v3)

The three architecture cells only compare structured TDD workflows against each
other. That answers "which architecture ranks best" but not "does any of this beat
plain TDD without an architecture" — a question the Sol data makes pressing, because
v5.1 reaches perfect correctness at ~1/5 the wallclock of v6.1. Without a floor, a
finding like "v6.1 leads on `cognitive_max`" has no scale.

| Cell | What it prescribes | Isolates |
|---|---|---|
| `v3-basic-tdd-pi` | "use TDD", no phase structure, no agents, no skills | the cost and benefit of *architecture* on top of TDD |

The gap v3 → {v4.1, v5.1, v6.1} is the actual return on the whole workflow line.
It has not been measured on Sol.

### Why there is no no-TDD baseline

A `v1-oneshot-pi` cell was run (n=5 per kata) and **discarded**. Its purpose was to
isolate the return on TDD itself, and it cannot: every kata prompt — prose,
user-story and example-mapping alike — lists `src/<kata>.spec.ts - Tests` among its
deliverables. The v1 workflow says "Do NOT use TDD", which correctly means "not
test-first", not "no tests". The runs duly produced test suites: 9.6 tests / 65 test
LoC on game-of-life, *more* than v6.1's 9.0 / 44.

The cell therefore measured "tests written after the fact" rather than "no TDD", and
the v1 → v3 gap would have been the return on test-*ordering*, not on testing. The
10 runs were deleted rather than archived — they answer no question this RQ asks.

Measuring the no-TDD case properly needs a kata-prompt variant that does not request
a spec file — which makes the prompt an uncontrolled factor against the other cells.
That is a separate RQ, not a cell in this one.

**`v3-basic-tdd-pi` was created for this RQ** as a direct translation of the CC
original (`v3-basic-tdd/.claude/rules/experiment-mode.md`), following the
`v1-oneshot-pi` conventions: explicit `prompt.md` reference and the `src/cli.ts`
hint that claim-office needs. It carries **no continuation overlay** — v3 has no
phase boundaries with skill switches, which is where Sol stalls. Should it stall
anyway, that is itself a finding and is visible in `completed_within_budget`; it is
not silently repaired.

### Measurement limit — binding

**TDD-discipline metrics are not defined on the baseline cells.** Both v1 and v3
prescribe no phase markers, so P1–P6 never fire. Verified against the 22 existing
CC v3 runs: `cycle_count` 1 (parser fallback), `refactorings_applied` 0,
`predictions_total` 0 — in *every* run, across five models. v3 says "do TDD" but
never says "write `## Red`".

Consequences:

- `cycle_count`, `refactorings_applied` and `predictions_correct_rate` are reported
  as **n/a** for v1 and v3, never as 0, and they carry no trophy in those rows. A 0
  here means "not instrumented", not "did not refactor".
- Whether v3 actually did TDD is therefore **unobservable from the transcript**.
  Where it matters, `test_loc` and `mutation_score` are the external proxies — they
  measure the test suite that was produced, regardless of how it came about.
- Correctness and code-quality metrics are **unaffected** — measured externally
  from the source tree, not from markers.

Deliberately not fixed by adding markers to v3: that would make it a different
workflow (a mini-v4) and destroy comparability with the 22 CC runs that define
what "v3" means in this lab.

## Metric blind spot — decomposition (binding)

`code_mass`, `cognitive_max` and `mccabe_max` all fail to detect missing abstraction.
Established by construction, not inferred:

| Metric | nested `for`/`if` | same logic as `reduce` callbacks |
|---|---:|---:|
| Cognitive Complexity | 10 | **1** |
| McCabe | 5 | **2** |
| `code_mass` (APP) | 43 | **43** |

Two independent causes:

1. **Cognitive Complexity resets its nesting counter at every function boundary**, and an
   arrow function is a function boundary. `for` inside `for` counts as nesting; `reduce`
   inside `reduce` does not — although the reader holds two levels either way. On top of
   that, `cognitive_max` is a maximum *per function*: logic spread across three callbacks
   reports the maximum of one callback.
2. **APP has no notion of nesting at all.** It counts how many constructs occur, never how
   they are arranged. This is not a bug — Micah Martin's premise is explicitly "more compact
   is better", which is a sensible question and a different one from "is this well
   decomposed".

Consequence: a single 30-line function built from callback chains scores *better* on all
three than the same logic split into named domain functions. Observed in this RQ —
Sol/v6.1/claim-office averages 4.6 functions per run, and the one run inspected by hand
scores `cognitive_max` 4 against 6 for a 28-function opus-4-7 implementation of the same
kata, while carrying 14 smells against 1.

**`cc_avg_loc_per_function` is therefore the binding decomposition metric for this RQ**, with
`cc_longest_function` as a secondary. Both are immune to the callback trick: a 30-line
function stays 30 lines regardless of its internal shape.

Two limits, stated so they are not rediscovered later:

- Neither measures naming. A function sawn into `step1`…`step10` would score well.
- Both are gameable the moment a workflow prompt names them (README §"Compliance metrics").
  No workflow in this RQ names them, so cross-workflow comparison is valid here.
- Function *count* is deliberately **not** an outcome. More functions is not better — only
  the same work better decomposed is better, and `cc_avg_loc_per_function` captures that while a
  raw count would reward splintering.

## Two open gaps this RQ closes

1. **The `.1` generation has never run cross-model.** v4.1/v5.1/v6.1 exist exclusively on
   opus-4-7. The swap finding above comes from the older *exact* generation. This RQ is the
   first cross-model replication of the current generation at all — valuable independently
   of Sol.
2. **The swap is only established on claim-office.** Whether it also appears on a
   training-known kata was never measured (see "Missing data" in RQ-workflow-model context).

## Reference values (opus-4-7, `.1` generation)

Comparison baseline for this RQ. Sources: `RQ-context` (`questions-claude/4.3-tdd-context-engineering/`)
and `RQ-tdd-quality` (`questions-claude/4.1-tdd-effect-code-quality/`).

**claim-office-example-mapping:**

| Workflow | n | verification_pct | cognitive_max | smell_total | code_mass |
|---|---:|---:|---:|---:|---:|
| v4.1 | 5 | 0.96 | 26.8 ± 24.1 (max 68) | 13.2 | 621.6 |
| v5.1 | 6 | **1.00** | 14.8 ± 4.2 | 6.8 | 692.7 |
| v6.1 | 3 | **1.00** | **4.3 ± 1.5** | **1.3** | 920.7 |

**game-of-life-example-mapping:**

| Workflow | n | verification_pct | cognitive_max | smell_total | code_mass |
|---|---:|---:|---:|---:|---:|
| v4.1 | 5 | 1.00 | **6.4** | **2.4** | 156.6 |
| v5.1 | 5 | 1.00 | 17.6 | 4.8 | **154.0** |
| v6.1 | 10 | 1.00 | 6.5 | **2.4** | 153.7 |

Two properties of this baseline drive the design:

- On game-of-life `verification_pct` is **1.00 for all three** — the correctness axis does
  not differentiate there. The swap is visible only on claim-office.
- The **code-quality ranking inverts between the katas**: v4.1 is rank 1 on game-of-life
  (`cognitive_max` 6.4) and collapses on claim-office (26.8, σ 24, max 68) — F-tdd-quality.9.
  v6.1 is the only variant in the top 2 on both. That inversion is precisely the current
  justification for the v6 default, so `cognitive_max` is measured on **both** katas.

## Hypotheses

- **H1 (v6 holds).** Sol behaves like opus-4-7: v6.1 leads or ties on claim-office
  `verification_pct`, and lands top-2 on `cognitive_max` on both katas.
  → The reduction chain is a valid foundation for Sol; RQ-B (reduction retest) proceeds.
- **H2 (Sol lands on the opus-4-6 side).** v6.1 degrades on claim-office (bimodal
  `verification_pct`, spec halves dropped), while v4.1 stays stable.
  → The reduction chain does not transfer; workflow development for Sol must restart from
  the v4 branch. RQ-B is cancelled in its planned form.
- **H3 (third pattern).** Sol prefers v5.1, or the ranking is flat within 1 σ.
  → No architecture recommendation transfers; the axis must be re-derived for Sol.
- **H4 (baseline floor).** The structured cells beat `v3-basic-tdd-pi` on
  `cognitive_max` and `smell_total`, and v3 beats `v1-oneshot-pi`.
  → The workflow line earns its cost on Sol.
  **Counter-case worth naming up front:** if v3 lands within 1 σ of the structured
  cells on quality while running at v5.1 speed or better, the whole architecture
  axis is a wash on Sol, and the honest recommendation is v3 — regardless of how
  v4.1/v5.1/v6.1 rank among themselves. This is the one outcome that would make
  RQ-B pointless even though H1 held.

Reading rule for the correctness/quality split: since Sol carries systematically higher
complexity than Opus (`cognitive_max` ~3× on comparable cells, `RQ-cost-sol-pi-vs-opus-cc`
F-1.3), **absolute thresholds are not comparable across models.** Only the *ranking* and the
*direction* of differences within Sol are evaluated.

## Caveats (binding)

1. **The continuation overlay is not identical across cells.** All three pi ports need the
   anti-stall content from `v6.2.1-phase-continuation-pi`, otherwise Sol ends its turn at
   phase boundaries and the run measures harness stalls instead of workflow effects. But that
   overlay was written for the v6 skill architecture ("after the test list → read
   `red/SKILL.md`"). v4.1 has no skills — every phase is a subagent — so the overlay must be
   **rewritten in substance** there, not copied. The three cells therefore differ slightly in
   an axis that is not the object of study. Whether a residual stall difference remains is
   checked via `cycle_count` and `completed_within_budget`; a cell with systematic stalls is
   not interpreted as a workflow effect.
2. **Port equivalence is an assumption, not a measurement.** The `.pi` ports are structural
   translations of the `.claude` originals. Only `v6.2-with-why-cleaned-pi` has an
   established track record; the v4.1/v5.1/v6.1 ports are new. Any port bug shows up as a
   workflow effect. Mitigation: verify the four markers from `MARKERS.md` per port before the
   batch, plus a smoke run per cell.
3. **The reference generation is thinly populated.** The opus-4-7 `.1` cells run at n=3–10
   (v6.1/claim-office at n=3). Rank statements against that baseline carry corresponding
   uncertainty.
4. **Only one prompt style.** example-mapping, consistent with all previous architecture
   comparisons. prose/user-story were never run against this axis.
5. **The baselines run one prompt style their CC counterparts never saw.** All 22 CC
   v3 runs and all 15 CC v1 runs used prose or user-story — example-mapping was
   introduced with the v3+ generation and never applied to these two. Holding the
   prompt style constant across all five cells is right for *this* RQ, but it means
   the v1/v3 rows are not directly comparable to the existing CC v1/v3 data. Any
   cross-model statement about the baselines confounds model and prompt style.
6. **The two baselines are unequal in continuation risk.** v4.1/v5.1/v6.1 carry the
   anti-stall overlay, v1/v3 do not (they have no phase boundaries to stall at).
   If a baseline nonetheless shows systematic `completed_within_budget = false`,
   that row measures a harness stall and is not read as a workflow effect.

## Sequencing

This RQ is the **gate for RQ-B** (retest of the reduction chain v6.2 / v6.3 /
v6.2.1-refactor-vocab / v6.5 on Sol). RQ-B is only planned out once H1 is confirmed.

## Open questions

- If H1 holds: does the reduction chain also transfer, or does the Bundle/kata asymmetry
  (v6.3 and v6.2.1-refactor-vocab collapse on claim-office, not on game-of-life) behave
  differently on Sol? → RQ-B.
- Does the kata inversion of v4.1 (rank 1 GoL / rank 8 claim-office) replicate on Sol, or is
  it an Opus-specific artefact?
- Is the swap also visible on a training-known kata — i.e. does game-of-life differentiate on
  Sol where it stayed flat on Opus?
