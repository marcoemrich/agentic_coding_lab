---
id: RQ-context
question: "Which form of context structuring — isolated subagent contexts per TDD phase (v4.1), a shared, accumulated single context (v5.1), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (v6.1), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (v7.1) — leads to better code quality?"
factors:
  workflow: [v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix, v7.1-hybrid-green-refactor-testlist-scope-fix]
controls:
  kata_base: claim-office
  model:
    any:                            # OR-match: new runs via Portkey (priority 1), reuse existing direct runs
      - opus-4-7-portkey-no-thinking
      - opus-4-7-no-thinking
  prompt: example-mapping
outcomes:
  # primary: code quality
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  # secondary: correctness (internal + external + test strength)
  - tests_passing
  - verification_pct
  - completed_within_budget
  - mutation_score
  # context efficiency
  - total_tokens
  - duration_seconds
min_replicates: 3
status: aktiv
---

# RQ-context: Context Engineering — Isolated, Shared and Hybrid Contexts

Does it make a difference whether the individual TDD phases (test list, red, green, refactor) run in **isolated subagent contexts**, in **one shared, accumulated single context**, in a **hybrid form with only the refactor isolated** (v6.1), or in a **hybrid form with green and refactor isolated** (v7.1)?

## Motivation

v4.1-testlist-scope-fix and v5.1-testlist-scope-fix share **the same phase-script content** — same rules, same prompts, same order test list → red → green → refactor. v6.1-hybrid-testlist-scope-fix uses **the same test-list-scope-fix** but a third context architecture: red and green run skill-based in the shared conversation context (like v5.1), while the refactor phase is spawned as an isolated subagent (like v4.1 for all phases). v7.1-hybrid-green-refactor-testlist-scope-fix goes one step further and **additionally isolates the green phase** as a subagent — only the test list and red remain skills in the shared context. v6.1 and v7.1 are therefore not character-exact derivations of the `.1` variants — see caveat (c).

| | v4.1-testlist-scope-fix | v5.1-testlist-scope-fix | v6.1-hybrid-testlist-scope-fix | v7.1-hybrid-green-refactor-testlist-scope-fix |
|---|---|---|---|---|
| Test list | dedicated subagent | skill in the single context | skill in the single context | skill in the single context |
| Red        | dedicated subagent | skill in the single context | skill in the single context | skill in the single context |
| Green      | dedicated subagent | skill in the single context | skill in the single context | **dedicated subagent** |
| Refactor   | dedicated subagent | skill in the single context | **dedicated subagent** | **dedicated subagent** |
| Token profile | more (each subagent re-reads the prompt inputs) | less per phase, but cumulative in the one context | mixed form — red/green in the single context plus a separate refactor context | mixed form — test list/red in the single context plus separate green and refactor contexts |

This RQ extracts the context-engineering question from RQ-tdd-quality (where it was only one finding among five, as F-tdd-quality.3) and extends it by two hybrid points: v6.1 isolates only the refactor phase, v7.1 additionally isolates the green phase. This allows an architecture gradient to be tested — from full phase isolation (v4.1) through partial isolation with two subagent phases (v7.1) or one subagent phase (v6.1) to fully shared (v5.1). The `.1` variants were deliberately derived so that their phase-script content matches character for character; v6.1 and v7.1 are independent hybrids with the same test-list discipline but a different phase invocation structure.

## Opposing Hypotheses

**In favor of isolated subagents (v4.1)**:
- Each phase step starts with a focused, undisturbed context.
- No drift from previous phases, no accumulation of past discussion.
- Harder phase discipline, because the green subagent has no "memory" of previous helper functions and no temptation to generalize.

**In favor of the single context (v5.1)**:
- Complete readability of the conversation so far; no re-establishment cost.
- Later phases can refer explicitly to earlier code ("refactor the function we just wrote").
- Less token overhead per phase, because there is no repeated context setup.

**In favor of the hybrid v6.1 (only refactor isolated)**:
- Red/green in the single context benefit from the accumulated test/implementation history (like v5.1).
- The cost-intensive refactor phase is isolated in the subagent — the fresh context forces an explicit structural analysis instead of opportunistic local cleanup.
- Should combine the complexity advantage of v4.1 with the stability and speed profile of v5.1 — *if* the architecture effect from F-tdd-quality.1 really comes from the refactor subagent and not from the full phase isolation.

**In favor of the hybrid v7.1 (green and refactor isolated)**:
- Test list/red in the single context carry the spec anchors and the most recent test discussion in one piece (like v5.1).
- The green subagent sees *only* the red test and the task "make it pass" — without accumulation from test-list brainstorming or previous cycle discussions, hence trimmed more strictly toward the minimal solution (as in v4.1).
- The refactor subagent additionally inherits the context-reset advantage from v6.1.
- Should hit the complexity advantage of v4.1 even more strongly than v6.1, *if* green drift in the single context is an independent driver of Code Mass/complexity and not just the refactor.

The effect of context structuring on code quality is unclear a priori — all four architectures are plausibly better.

## Design

```
Factor:    workflow   — 4 levels (v4.1-testlist-scope-fix, v5.1-testlist-scope-fix,
                                  v6.1-hybrid-testlist-scope-fix,
                                  v7.1-hybrid-green-refactor-testlist-scope-fix)
Control:   model      — opus-4-7-no-thinking (Portkey OR direct, OR-match, see caveat a)
Control:   kata_base  — claim-office
Control:   prompt     — example-mapping

Cells:      4 (4 workflows x 1 kata)
Replicates: n = 3
Runs:       12 total — to be collected entirely anew (v5.1 and v7.1 are new;
            the old v4/v5/v6/v7 runs are not transferable, since they do not have
            the test-list-scope-fix or the script unification)
```

## Hypotheses

- **H1 (code quality)**: Isolated subagent contexts (v4.1) produce lower complexity metrics (`cognitive_max`, `mccabe_max`, `cc_longest_function`, `smell_total`) than the single context (v5.1). v6.1 lies in between, closer to v4.1 — because the cost-intensive refactor phase runs isolated and thereby inherits the main mechanism of v4.1. v7.1 lies even closer to v4.1 than v6.1, because the green-drift mechanism additionally takes effect.
  Plausible mechanic: without accumulated history the green phase cannot "abstract in anticipation" and delivers the minimally necessary implementation; without refactor drift the refactor phase stays focused on pure structural improvement. With v6.1 only the second mechanism acts, with v7.1 both.
- **H2 (correctness)**: All four architectures reach similar `tests_passing` and `verification_pct` on claim-office. Correctness is not the primary bottleneck — the context-architecture effect shows up (if present) in code quality and cost, not in external correctness. Falsification: one architecture systematically hits fewer acceptance scenarios.
- **H3 (token consumption)**: v4.1 consumes *fewer* tokens than v5.1, because isolated subagent contexts do overlap but each subagent grows linearly and briefly — whereas the v5.1 single context accumulates the tokens of all phases. v6.1 pays for the refactor subagent in addition to the accumulated single context and therefore lies above v5.1 in token terms. v7.1 pays for two subagent phases (green + refactor) in addition to the single context and, as expected, lies above v6.1 as well.
- **H4 (stability)**: The spread of the code-quality metrics per cell is systematically lower for v4.1 than for v5.1 (already foreshadowed by RQ-stability F-stability.2). v6.1 and v7.1 should lie between v4.1 and v5.1 in terms of stability, v7.1 closer to v4.1. Falsification of H4: v5.1 spread ≤ v4.1 spread.
  **Reservation (n=3)**: At the current replicate count, the spread estimate per cell is statistically weak — with n=3, H4 can only be examined as a tendency, not robustly confirmed. For a solid stability statement the replicates must be increased later.
- **H5 (wallclock)**: v4.1 is **considerably slower** than v5.1 in wallclock time. Plausible mechanic: each subagent spawn per TDD phase costs a setup latency (model warmup, re-reading the phase definitions from the agent files), which sums up over the TDD cycles per run and 4 phases per cycle; v5.1 pays this overhead only once per run. Expectation: v4.1 wallclock ≥ 2× v5.1 wallclock on claim-office. v6.1 pays the spawn overhead once per cycle (refactor), v7.1 twice per cycle (green + refactor); both should lie between v5.1 and v4.1, v7.1 closer to v4.1.

**Falsification of H1** (v5.1 ≤ v4.1 on complexity, or v6.1/v7.1 far above v4.1): the context separation or the refactor/green isolation brings no code-quality advantage — it may even hurt, because isolated subagents have no knowledge of the test history.

**Falsification of H3** (v4.1 ≥ v5.1 tokens, or v6.1/v7.1 ≤ v5.1): the subagent spawn overheads dominate the tokens saved by avoiding context accumulation; or the isolated subagents are not the dominant token drivers.

**Falsification of H5** (v4.1 ≤ v5.1 wallclock): subagent spawn overhead is negligible compared to the accumulated token-processing cost in the single context.

## Caveats

- **(a) Single model, mixed routing**: Only `opus-4-7-no-thinking`, but `controls.model` is an OR list `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. New fill runs go via Portkey (priority 1), existing direct runs continue to be used; both routes count as one cell. Assumption: routing has no effect on code quality; on `duration_seconds` (H5) it possibly does (Portkey retry/timeout characteristics) — take this into account in the wallclock evaluation, if necessary group by `model` instead of `cell_model`. Weaker models could moreover benefit more from phase isolation (no drift) or less (re-establishment costs dominate).
- **(b) Single kata**: Only claim-office (CLI kata, novel) — chosen because context engineering should be tested on a task the model does not know by heart and for which correctness is not a given. game-of-life (library form) and mars-rover remain open as cross-kata replication.
- **(c) Identical phase-script content only for v4.1 ↔ v5.1**: guaranteed by the workflow definition (see `experiments/workflows/v4.1-testlist-scope-fix/.claude/agents/` vs `experiments/workflows/v5.1-testlist-scope-fix/.claude/commands/`). The `.1` variants were deliberately derived so that the phase-script texts (test list, red, green, refactor including the test-list-scope-fix) match in content; the only difference is the invocation mechanism — subagent spawn (isolated context) for v4.1 vs. skill invocation in the same context for v5.1. v6.1 and v7.1, by contrast, are **not character-exact derivatives**: both share the test-list-scope-fix and use the test list/red as skills in the single context (like v5.1); v6.1 additionally spawns the refactor as a subagent, v7.1 spawns green and refactor as subagents (each as v4.1 does for these phases). Consequence: the v4.1↔v5.1 comparison isolates the pure architecture effect, while the v6.1 and v7.1 comparisons mix architecture differences with (small) script differences in the subagent specifications. With v4.1, v6.1 and v7.1 the subagents receive their context explicitly via a prompt block (`tdd-experiment-mode.md`); with v5.1 this is unnecessary because the context is shared.
- **(d) Entirely new data collection**: This RQ collects all runs anew. The old v4/v5/v6/v7 runs are not transferable, because v5.1 and v7.1 are new workflows and all four variants carry the test-list-scope-fix or the script unification that the old runs did not have.

## Findings

See [findings.md](findings.md).

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix, v7.1-hybrid-green-refactor-testlist-scope-fix}`,
`kata = claim-office-example-mapping`,
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (OR-match, see caveat a).
