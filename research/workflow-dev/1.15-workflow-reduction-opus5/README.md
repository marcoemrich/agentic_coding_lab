---
id: RQ-workflow-reduction-opus5
question: "How much of the v6.6 architecture can be removed on opus-5 before code quality degrades — and how much of its result comes from the APP subordination patch (v6.7) rather than from the end-refactor phase (v6.8) or the isolated refactor subagent (v5.2)?"
factors:
  workflow_x_prompt:
    # new cells — the reduction chain, one factor per step
    - {workflow: v6.7-app-subordinate-cc,        prompt: example-mapping}  # v6.6 plus APP subordination patch
    - {workflow: v6.8-no-end-refactor-cc,        prompt: example-mapping}  # v6.7 minus end-refactor phase
    - {workflow: v5.2-no-subagent-cc,            prompt: example-mapping}  # v6.8 minus isolated subagent
    # reference cells — already filled at n=5 by RQ-architecture-axis-opus5
    - {workflow: v6.6-lab-split-cc,              prompt: example-mapping}  # upper bound: end-refactor + subagent
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}  # the 86%/60% compromise
    - {workflow: v5.1-testlist-scope-fix,        prompt: example-mapping}  # shared-context predecessor of v5.2
  kata_base: [claim-office, game-of-life]
controls:
  model: opus-5-no-thinking
outcomes:
  # primary: decomposition — the binding quality metric per RQ-architecture-axis-opus5 F-1.6
  - cc_avg_loc_per_function
  - cc_longest_function
  # code quality
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  - code_mass
  # correctness — v5.1 has a documented failure mode (F-1.5), v5.2 inherits its architecture
  - verification_pct
  - tests_passing
  - completed_within_budget
  # TDD discipline
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # the whole point of the reduction — cost
  - duration_seconds
  - total_tokens
min_replicates: 5
status: open
---

# RQ-workflow-reduction-opus5: How Far Can the Workflow Be Cut on Opus 5?

## Motivation

`RQ-architecture-axis-opus5` established that the architecture axis still ranks correctly
on opus-5 (F-1.1) — more architecture yields better decomposition on both katas. But it
also quantified the price, and the price is where the decision actually sits:

| claim-office | `cc_avg_loc_per_function` | share of the v6.6 gain | tokens | share of v6.6 cost |
|---|---:|---:|---:|---:|
| v3 (baseline) | 9.18 | 0 % | 4 M | 3 % |
| v5.1 | 5.89 | 55 % | 83 M | 60 % |
| v6.1 | 4.04 | **86 %** | 82 M | **60 %** |
| v6.6 | 3.21 | 100 % | 137 M | 100 % |

**v6.1 delivers 86 % of the decomposition gain at 60 % of the cost.** The marginal step from
v6.1 to v6.6 — adding the end-refactor phase — buys the last 14 % for a 67 % token increase
and a 111 % wallclock increase.

That raises the question this RQ asks: v6.6 and v6.1 differ in *two* things (the
end-refactor phase and the lab-split refactoring of the rule files), so the 14 % cannot be
attributed cleanly. And below v6.1 sits a second removable component — the isolated refactor
subagent itself.

## The reduction chain

The chain runs from the current default down to the leanest variant, one component per
step. All three new cells carry the APP subordination patch (see below); the two older
reference cells do not, which is why v6.7 is needed to keep the steps separable.

| Workflow | per-cycle refactor | end-refactor | lab-split | APP patch | Status |
|---|---|---|---|---|---|
| `v6.6-lab-split-cc` | subagent | ✓ | ✓ | — | reference (n=5) |
| `v6.7-app-subordinate-cc` | subagent | ✓ | ✓ | ✓ | **new cell** |
| `v6.8-no-end-refactor-cc` | subagent | — | ✓ | ✓ | **new cell** |
| `v5.2-no-subagent-cc` | skill (shared ctx) | — | ✓ | ✓ | **new cell** |
| `v6.1-hybrid-testlist-scope-fix` | subagent | — | — | — | reference (n=5) |
| `v5.1-testlist-scope-fix` | skill (shared ctx) | — | — | — | reference (n=5) |

**The chain is single-factor throughout.** Each consecutive pair differs in exactly one
component, which is why v6.7 is a cell rather than a shortcut:

- **v6.6 → v6.7** isolates the *APP subordination patch*. Same architecture, same phases;
  only the refactor agents' wording about mass changes.
- **v6.7 → v6.8** isolates the *end-refactor phase*. Both carry the patch, both use the
  isolated subagent per cycle.
- **v6.8 → v5.2** isolates the *isolated refactor subagent*. Same rule files, same patch,
  same absence of an end-refactor phase; the only difference is whether refactoring runs in
  a fresh context or the shared one.

The two older reference cells sit outside the chain and are read with their confounds named:

- **v6.8 → v6.1** differs in the lab-split *and* the APP patch.
- **v5.2 → v5.1** differs in the lab-split, the APP patch *and* the command/agent file
  layout.

They are kept because they anchor the new cells against measured data at zero run cost, and
because v5.1 is where the failure mode of H4 was observed.

## The APP subordination patch

`RQ-architecture-axis-opus5` F-1.6 replicated a finding first made on Sol: Code Mass (APP)
ranks the cells **opposite** to decomposition. v6.6 has the best `cc_avg_loc_per_function`
on both katas *and* the highest APP mass (claim-office 1002.8 against v5.1's 569.0).

The v6.6 refactor agents nonetheless instruct "Lower mass = Better code (generally)" and
soften the conflict to "Rule 2 trumps APP". The patch — ported from
`v6.7-app-subordinate-pi` — makes the subordination binding and supplies the arithmetic
reason:

> Extracting logic into a named function almost always *raises* APP mass. The new function
> adds bindings for its parameters and the call site adds an invocation (mass 2), while the
> conditionals and loops are moved rather than removed. A good extraction with a rising mass
> number is the normal case, not a warning sign.

Concretely it forbids what the old wording permitted: reverting an extraction because mass
rose, inlining a well-named function to lower mass, and letting APP keep the end-refactor
iteration loop open. In `end-refactor.md` it also flips the worked example — v6.6's example
showed an Extract-Method being *reverted* for exactly the reason the patch now rules out.

**Consequence for this RQ:** the patch is present in all three new cells and absent from all
three reference cells. `v6.7-app-subordinate-cc` exists precisely to measure it in
isolation — it is v6.6 with nothing changed but the mass wording. Without that cell, every
statement about v6.8 would mix "end-refactor removed" with "APP patch added"; with it, both
are separable.

v6.7 is the expensive cell in this RQ: it inherits v6.6's end-refactor phase, so it runs at
v6.6 prices (~137 M tokens, ~93 min per claim-office run). Ten runs of it are roughly 0.8 Bn
tokens — over half the RQ's budget for one factor. That is the price of a clean chain, and
it is paid deliberately: the patch is the only change in this line that alters what the
refactor agents *optimise for*, and F-1.6 showed the old wording pointed against the
measured outcome.

## Hypotheses

- **H0 (the APP patch does something).** v6.7 beats v6.6 on `cc_avg_loc_per_function` at
  comparable cost — the refactor agents, no longer told to minimise mass, stop trading
  extraction for compactness.
  → The patch is worth carrying in every downstream workflow. If v6.7 ≈ v6.6 instead, the
  patch is inert and the v6.8/v5.2 results can be read as pure architecture effects.
- **H1 (end-refactor is the expensive 14 %).** v6.8 lands near v6.1 on decomposition
  (~4.0–4.5 on claim-office) at ~60 % of v6.6's tokens, confirming that the end-refactor
  phase buys the last increment at disproportionate cost.
  → Recommend v6.8 as the default; keep v6.6/v6.7 for correctness-critical work only.
- **H2 (the APP patch recovers the gap).** v6.8 reaches v6.7-level decomposition at
  v6.1-level cost, because the per-cycle agent already extracts what the end phase would
  have.
  → The end-refactor phase is redundant on opus-5; v6.8 becomes the default outright.
- **H3 (the subagent is what matters).** v5.2 degrades markedly against v6.8 on
  decomposition, showing the isolated context is the load-bearing component and the
  end-refactor phase is not.
  → Reduction stops at v6.8.
- **H4 (v5.2 inherits v5.1's instability).** v5.2 shows the early-termination failure mode
  documented in F-1.5 — v5.1/claim-office ran 0 / 0.93 / 1 / 1 / 1 on `verification_pct`,
  with the failing run stopping after 2 cycles with 6 functions and 60 green self-written
  tests.
  → Shared-context refactoring is not viable for correctness-critical katas regardless of
  its quality numbers. **This is the outcome that would rule v5.2 out even if it wins on
  decomposition.**

## Reference values (opus-5-no-thinking, from RQ-architecture-axis-opus5)

**claim-office-example-mapping:**

| Workflow | n | verification_pct | cc_avg_loc_per_function | cognitive_max | smell_total | tokens | duration |
|---|---:|---:|---:|---:|---:|---:|---:|
| v5.1 | 5 | 0.79 | 5.89 | 2.8 | 0.2 | 83 M | 23 min |
| v6.1 | 5 | 0.99 | 4.04 | 2.4 | 0.0 | 82 M | 44 min |
| v6.6 | 5 | 0.95 | 3.21 | 2.2 | 0.0 | 137 M | 93 min |

**game-of-life-example-mapping:**

| Workflow | n | verification_pct | cc_avg_loc_per_function | cognitive_max | smell_total | tokens | duration |
|---|---:|---:|---:|---:|---:|---:|---:|
| v5.1 | 5 | 1.00 | 4.12 | 1.8 | 0.0 | 12 M | 7 min |
| v6.1 | 5 | 1.00 | 4.54 | 1.8 | 1.2 | 8 M | 10 min |
| v6.6 | 5 | 1.00 | 3.57 | 1.2 | 0.0 | 15 M | 19 min |

Two properties of this baseline shape the design:

- **The katas disagree about v5.1 vs v6.1.** On claim-office v6.1 leads decomposition
  (4.04 vs 5.89); on game-of-life v5.1 leads (4.12 vs 4.54, inside 1 σ). The subagent's
  value is kata-dependent, which is exactly what the v6.8 → v5.2 step re-tests under the
  APP patch.
- **Correctness only differentiates on claim-office.** All game-of-life cells sit at 1.00.
  H4 is therefore testable only on claim-office.

## Caveats (binding)

1. **The chain is clean, the anchors are not.** v6.6 → v6.7 → v6.8 → v5.2 is single-factor
   at every step. The two older reference cells are not part of it: v6.8 → v6.1 mixes the
   lab-split with the APP patch, and v5.2 → v5.1 mixes three changes. Statements against
   v6.1/v5.1 name their confounds.
2. **The reference cells carry no APP patch.** They were produced under
   `RQ-architecture-axis-opus5` with the original "Lower mass = Better code" wording.
   v6.7 is the cell that makes this measurable rather than a caveat.
3. **`cc_avg_loc_per_function` measures decomposition, not its appropriateness.** A function
   sawn into `step1`…`step10` scores well. On game-of-life, where the whole implementation
   is 30–60 LoC, a cell can win this metric by splintering. Read it together with
   `cognitive_max` and Smell Total, and treat a large jump in function count on the small
   kata as a warning rather than a win.
4. **Code Mass (APP) carries no trophy** — F-1.6 of RQ-architecture-axis-opus5 established
   it ranks opposite to decomposition. It stays as context.
5. **All three new workflows are untested.** v6.7 was ported from the pi variant, v6.8 and
   v5.2 derived from it. The four parser markers were verified statically in each, but no
   run has exercised them. A marker failure shows as `cycle_count`/`refactorings_applied`
   at zero, not as an error. Smoke-check the first completed run of each cell before
   trusting the batch — v5.2 especially, since it is the only one whose refactor phase
   moved from `agents/` to `commands/`.
6. **Only one prompt style** (example-mapping), consistent with the whole architecture line.

## Sequencing

This RQ is the direct follow-up to `RQ-architecture-axis-opus5`. It closes the reduction
question for opus-5 in one pass: the winner of the chain becomes the recommended default in
`model-recommendation-matrix.md`, and any cell that fails H4 is ruled out for
correctness-critical work regardless of its quality numbers.

## Open questions

- How much of the v6.6 → v6.8 difference is the APP patch and how much the removed end
  phase? → decided by v6.7, which holds everything but the patch constant.
- Does the APP patch change the per-cycle refactor agent's behaviour enough to make the
  end-refactor phase redundant? → decided by v6.8 vs v6.7 on decomposition.
- Is the isolated context worth its cost on the small kata, where v5.1 already beat v6.1?
- Does v5.2 inherit v5.1's early-termination mode, or does the lab-split's phase-continuation
  wording suppress it?
