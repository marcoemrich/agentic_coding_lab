---
id: RQ-architecture-axis-sol-pi
question: "Does the TDD architecture axis (v4.1 isolated subagents / v5.1 single context / v6.1 hybrid) rank the same way on gpt-5-6-sol as it does on opus-4-7 — or does Sol land on the other side of the documented v4/v6 model swap?"
factors:
  workflow_x_prompt:
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
  # TDD discipline — does Sol keep the mechanics alive in each architecture?
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
