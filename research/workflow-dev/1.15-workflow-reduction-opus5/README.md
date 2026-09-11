---
id: RQ-workflow-reduction-opus5
question: "How much of the hybrid-v6 architecture can be removed on opus-5 before code quality degrades — and how much of its result comes from the APP subordination patch (hybrid-v7) rather than from the end-refactor phase (hybrid-v8) or the isolated refactor subagent (single-context-v3)?"
factors:
  workflow_x_prompt:
    # new cells — the reduction chain, one factor per step
    - {workflow: exact-hybrid-v7-app-subordinate-cc,        prompt: example-mapping}  # hybrid-v6 plus APP subordination patch
    - {workflow: exact-hybrid-v8-no-end-refactor-cc,        prompt: example-mapping}  # hybrid-v7 minus end-refactor phase
    - {workflow: exact-single-context-v3-no-subagent-cc,            prompt: example-mapping}  # hybrid-v8 minus isolated subagent
    # reference cells — already filled: hybrid-v6 on both katas, hybrid-v2/single-context-v2 on game-of-life only
    - {workflow: exact-hybrid-v6-lab-split-cc,              prompt: example-mapping}  # upper bound: end-refactor + subagent
    - {workflow: exact-hybrid-v2-testlist-fix-cc, prompt: example-mapping}  # the 86%/60% compromise
    - {workflow: exact-single-context-v2-testlist-fix-cc,        prompt: example-mapping}  # shared-context predecessor of single-context-v3
  kata_base: [sphinx-score, game-of-life]
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
  # correctness — single-context-v2 has a documented failure mode (F-1.5), single-context-v3 inherits its architecture
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

| claim-office (RQ 4.5) | `cc_avg_loc_per_function` | share of the hybrid-v6 gain | tokens | share of hybrid-v6 cost |
|---|---:|---:|---:|---:|
| inline-tdd-v1 (baseline) | 9.18 | 0 % | 4 M | 3 % |
| single-context-v2 | 5.89 | 55 % | 83 M | 60 % |
| hybrid-v2 | 4.04 | **86 %** | 82 M | **60 %** |
| hybrid-v6 | 3.21 | 100 % | 137 M | 100 % |

**hybrid-v2 delivers 86 % of the decomposition gain at 60 % of the cost.** The marginal step from
hybrid-v2 to hybrid-v6 — adding the end-refactor phase — buys the last 14 % for a 67 % token increase
and a 111 % wallclock increase.

That raises the question this RQ asks: hybrid-v6 and hybrid-v2 differ in *two* things (the
end-refactor phase and the lab-split refactoring of the rule files), so the 14 % cannot be
attributed cleanly. And below hybrid-v2 sits a second removable component — the isolated refactor
subagent itself.

## Why sphinx-score replaces claim-office

The measurement above comes from claim-office, but this RQ runs on **sphinx-score**
instead. The reason is cost: hybrid-v6 needs 137 M tokens and 93 minutes per claim-office run
against **19 M and 25 minutes** on sphinx — a factor of 7. The full chain on claim-office
would cost roughly 1.8–2.5 Bn tokens; on sphinx it is ~0.5 Bn, for *more* cells.

Sphinx is a viable substitute rather than a downgrade: it is the newer novel kata with a
CLI contract and an external verification suite, and hybrid-v6 already reaches
`cc_avg_loc_per_function` 3.54 there against 3.21 on claim-office, at `verification_pct`
1.00 against 0.95. The architecture differentiates on it in the same direction and to a
similar degree.

Two consequences, both accepted:

- **The inline-tdd-v1 → hybrid-v6 span is narrower on sphinx** (8.38 → 3.54, factor 2.4) than on
  claim-office (9.18 → 3.21, factor 2.9). Differences between adjacent chain steps are
  correspondingly smaller and may fall inside σ where they would not have on claim-office.
- **Cross-RQ comparisons to RQ 4.5 change the kata.** Statements pairing a cell here with
  a claim-office cell there confound workflow and kata. The chain itself is unaffected —
  all its cells run on the same two katas.

## The reduction chain

The chain runs from the current default down to the leanest variant, one component per
step. All three new cells carry the APP subordination patch (see below); the two older
reference cells do not, which is why hybrid-v7 is needed to keep the steps separable.

| Workflow | per-cycle refactor | end-refactor | lab-split | APP patch | Status |
|---|---|---|---|---|---|
| `exact-hybrid-v6-lab-split-cc` | subagent | ✓ | ✓ | — | reference (n=5) |
| `exact-hybrid-v7-app-subordinate-cc` | subagent | ✓ | ✓ | ✓ | **new cell** |
| `exact-hybrid-v8-no-end-refactor-cc` | subagent | — | ✓ | ✓ | **new cell** |
| `exact-single-context-v3-no-subagent-cc` | skill (shared ctx) | — | ✓ | ✓ | **new cell** |
| `exact-hybrid-v2-testlist-fix-cc` | subagent | — | — | — | reference (n=5) |
| `exact-single-context-v2-testlist-fix-cc` | skill (shared ctx) | — | — | — | reference (n=5) |

**The chain is single-factor throughout.** Each consecutive pair differs in exactly one
component, which is why hybrid-v7 is a cell rather than a shortcut:

- **hybrid-v6 → hybrid-v7** isolates the *APP subordination patch*. Same architecture, same phases;
  only the refactor agents' wording about mass changes.
- **hybrid-v7 → hybrid-v8** isolates the *end-refactor phase*. Both carry the patch, both use the
  isolated subagent per cycle.
- **hybrid-v8 → single-context-v3** isolates the *isolated refactor subagent*. Same rule files, same patch,
  same absence of an end-refactor phase; the only difference is whether refactoring runs in
  a fresh context or the shared one.

The two older reference cells sit outside the chain and are read with their confounds named:

- **hybrid-v8 → hybrid-v2** differs in the lab-split *and* the APP patch.
- **single-context-v3 → single-context-v2** differs in the lab-split, the APP patch *and* the command/agent file
  layout.

They are kept because they anchor the new cells against measured data at zero run cost, and
because single-context-v2 is where the failure mode of H4 was observed.

## The APP subordination patch

`RQ-architecture-axis-opus5` F-1.6 replicated a finding first made on Sol: Code Mass (APP)
ranks the cells **opposite** to decomposition. hybrid-v6 has the best `cc_avg_loc_per_function`
on both katas *and* the highest APP mass (claim-office 1002.8 against single-context-v2's 569.0).

The hybrid-v6 refactor agents nonetheless instruct "Lower mass = Better code (generally)" and
soften the conflict to "Rule 2 trumps APP". The patch — ported from
`exact-hybrid-v7-app-subordinate-pi` — makes the subordination binding and supplies the arithmetic
reason:

> Extracting logic into a named function almost always *raises* APP mass. The new function
> adds bindings for its parameters and the call site adds an invocation (mass 2), while the
> conditionals and loops are moved rather than removed. A good extraction with a rising mass
> number is the normal case, not a warning sign.

Concretely it forbids what the old wording permitted: reverting an extraction because mass
rose, inlining a well-named function to lower mass, and letting APP keep the end-refactor
iteration loop open. In `end-refactor.md` it also flips the worked example — hybrid-v6's example
showed an Extract-Method being *reverted* for exactly the reason the patch now rules out.

**Consequence for this RQ:** the patch is present in all three new cells and absent from all
three reference cells. `exact-hybrid-v7-app-subordinate-cc` exists precisely to measure it in
isolation — it is hybrid-v6 with nothing changed but the mass wording. Without that cell, every
statement about hybrid-v8 would mix "end-refactor removed" with "APP patch added"; with it, both
are separable.

hybrid-v7 is the expensive cell in this RQ: it inherits hybrid-v6's end-refactor phase, so it runs at
hybrid-v6 prices (~19 M tokens, ~25 min per sphinx run; ~15 M and ~19 min on game-of-life). Ten
runs of it are roughly 0.17 Bn tokens — about a third of the RQ's budget for one factor.
On claim-office the same cell would have cost 0.8 Bn, which is the main reason the kata
was switched.

## Hypotheses

- **H0 (the APP patch does something).** hybrid-v7 beats hybrid-v6 on `cc_avg_loc_per_function` at
  comparable cost — the refactor agents, no longer told to minimise mass, stop trading
  extraction for compactness.
  → The patch is worth carrying in every downstream workflow. If hybrid-v7 ≈ hybrid-v6 instead, the
  patch is inert and the hybrid-v8/single-context-v3 results can be read as pure architecture effects.
- **H1 (end-refactor is the expensive increment).** hybrid-v8 lands near hybrid-v2 on decomposition
  at markedly fewer tokens than hybrid-v7, confirming that the end-refactor phase buys its
  increment at disproportionate cost.
  → Recommend hybrid-v8 as the default; keep hybrid-v6/hybrid-v7 for correctness-critical work only.
- **H2 (the APP patch recovers the gap).** hybrid-v8 reaches v6.7-level decomposition at
  v6.1-level cost, because the per-cycle agent already extracts what the end phase would
  have.
  → The end-refactor phase is redundant on opus-5; hybrid-v8 becomes the default outright.
- **H3 (the subagent is what matters).** single-context-v3 degrades markedly against hybrid-v8 on
  decomposition, showing the isolated context is the load-bearing component and the
  end-refactor phase is not.
  → Reduction stops at hybrid-v8.
- **H4 (single-context-v3 inherits single-context-v2's instability).** single-context-v3 shows the early-termination failure mode
  documented in F-1.5 — on claim-office single-context-v2 ran 0 / 0.93 / 1 / 1 / 1 on
  `verification_pct`, with the failing run stopping after 2 cycles with 6 functions and 60
  green self-written tests. Whether sphinx exposes the same mode is itself open: it is a
  novel kata with a CLI contract, but smaller than claim-office.
  → Shared-context refactoring is not viable for correctness-critical katas regardless of
  its quality numbers. **This is the outcome that would rule single-context-v3 out even if it wins on
  decomposition.**

## Reference values (opus-5-no-thinking, from RQ-architecture-axis-opus5)

**sphinx-score-example-mapping** — only the two ends of the chain exist; single-context-v2 and hybrid-v2 are
filled by this RQ:

| Workflow | n | verification_pct | cc_avg_loc_per_function | cognitive_max | smell_total | tokens | duration |
|---|---:|---:|---:|---:|---:|---:|---:|
| inline-tdd-v1 (context, not a cell) | 6 | 0.97 | 8.38 | 1.5 | 0.0 | 3 M | 4 min |
| single-context-v2 | — | — | — | — | — | — | — |
| hybrid-v2 | — | — | — | — | — | — | — |
| hybrid-v6 | 6 | 1.00 | 3.54 | 1.0 | 0.0 | 19 M | 25 min |

**game-of-life-example-mapping** — complete:

| Workflow | n | verification_pct | cc_avg_loc_per_function | cognitive_max | smell_total | tokens | duration |
|---|---:|---:|---:|---:|---:|---:|---:|
| inline-tdd-v1 (context, not a cell) | 6 | 1.00 | 6.48 | 7.17 | 0.0 | 2 M | 3 min |
| single-context-v2 | 5 | 1.00 | 4.12 | 1.8 | 0.0 | 12 M | 7 min |
| hybrid-v2 | 5 | 1.00 | 4.54 | 1.8 | 1.2 | 8 M | 10 min |
| hybrid-v6 | 5 | 1.00 | 3.57 | 1.2 | 0.0 | 15 M | 19 min |

Three properties of this baseline shape the design:

- **The v5.1-vs-v6.1 question is open on sphinx.** On claim-office hybrid-v2 led decomposition
  (4.04 vs 5.89); on game-of-life single-context-v2 leads (4.12 vs 4.54, inside 1 σ). Both cells are
  filled on sphinx by this RQ, so the hybrid-v8 → single-context-v3 step gets an anchor on both katas.
- **Correctness may not differentiate at all.** Every game-of-life cell sits at 1.00, and
  sphinx/hybrid-v6 does too. If sphinx also saturates, `verification_pct` contributes nothing
  and H4 becomes untestable in this RQ — the failure mode it targets was observed on
  claim-office, which is no longer a cell.
- **Sphinx and game-of-life sit close together on hybrid-v6** (3.54 vs 3.57) but far apart on
  inline-tdd-v1 (8.38 vs 6.48). The architecture has more room on sphinx, which is where the chain
  should show its steps most clearly.

## Caveats (binding)

1. **The chain is clean, the anchors are not.** hybrid-v6 → hybrid-v7 → hybrid-v8 → single-context-v3 is single-factor
   at every step. The two older reference cells are not part of it: hybrid-v8 → hybrid-v2 mixes the
   lab-split with the APP patch, and single-context-v3 → single-context-v2 mixes three changes. Statements against
   hybrid-v2/single-context-v2 name their confounds.
2. **The reference cells carry no APP patch.** They were produced under
   `RQ-architecture-axis-opus5` with the original "Lower mass = Better code" wording.
   hybrid-v7 is the cell that makes this measurable rather than a caveat.
3. **`cc_avg_loc_per_function` measures decomposition, not its appropriateness.** A function
   sawn into `step1`…`step10` scores well. On game-of-life, where the whole implementation
   is 30–60 LoC, a cell can win this metric by splintering. Read it together with
   `cognitive_max` and Smell Total, and treat a large jump in function count on the small
   kata as a warning rather than a win.
4. **Code Mass (APP) carries no trophy** — F-1.6 of RQ-architecture-axis-opus5 established
   it ranks opposite to decomposition. It stays as context.
5. **All three new workflows are untested.** hybrid-v7 was ported from the pi variant, hybrid-v8 and
   single-context-v3 derived from it. The four parser markers were verified statically in each, but no
   run has exercised them. A marker failure shows as `cycle_count`/`refactorings_applied`
   at zero, not as an error. Smoke-check the first completed run of each cell before
   trusting the batch — single-context-v3 especially, since it is the only one whose refactor phase
   moved from `agents/` to `commands/`.
6. **Only one prompt style** (example-mapping), consistent with the whole architecture line.
   Worth noting for sphinx specifically: `RQ-sphinx-prompt-sensitivity` measured
   hybrid-v6/sphinx-prose at `verification_pct` 0.15 against 1.00 for example-mapping. The kata
   is highly prompt-sensitive, so this RQ's results describe the example-mapping variant
   only and must not be generalised to the kata.
7. **H4 may be untestable here.** The early-termination mode it targets was observed on
   claim-office, which this RQ drops. If sphinx saturates at `verification_pct` 1.00 like
   game-of-life, no cell can fail H4 and the question moves to a follow-up RQ on
   claim-office — at that kata's cost.

## Sequencing

This RQ is the direct follow-up to `RQ-architecture-axis-opus5`. It closes the reduction
question for opus-5 in one pass: the winner of the chain becomes the recommended default in
`model-recommendation-matrix.md`, and any cell that fails H4 is ruled out for
correctness-critical work regardless of its quality numbers.

## Open questions

- How much of the hybrid-v6 → hybrid-v8 difference is the APP patch and how much the removed end
  phase? → decided by hybrid-v7, which holds everything but the patch constant.
- Does the APP patch change the per-cycle refactor agent's behaviour enough to make the
  end-refactor phase redundant? → decided by hybrid-v8 vs hybrid-v7 on decomposition.
- Is the isolated context worth its cost on the small kata, where single-context-v2 already beat hybrid-v2?
- Does single-context-v3 inherit single-context-v2's early-termination mode, or does the lab-split's phase-continuation
  wording suppress it?
