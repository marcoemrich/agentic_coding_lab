---
id: RQ-context
question: "Which form of context structuring — isolated subagent contexts per TDD phase (subagents-v2), a shared, accumulated single context (single-context-v2), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (hybrid-v2), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (green-refactor-v2) — leads to better code quality?"
factors:
  workflow: [exact-subagents-v2-testlist-fix-cc, exact-single-context-v2-testlist-fix-cc, exact-hybrid-v2-testlist-fix-cc, exact-green-refactor-v2-testlist-fix-cc]
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

Does it make a difference whether the individual TDD phases (test list, red, green, refactor) run in **isolated subagent contexts**, in **one shared, accumulated single context**, in a **hybrid form with only the refactor isolated** (hybrid-v2), or in a **hybrid form with green and refactor isolated** (green-refactor-v2)?

## Motivation

exact-subagents-v2-testlist-fix-cc and exact-single-context-v2-testlist-fix-cc share **the same phase-script content** — same rules, same prompts, same order test list → red → green → refactor. exact-hybrid-v2-testlist-fix-cc uses **the same test-list-scope-fix** but a third context architecture: red and green run skill-based in the shared conversation context (like single-context-v2), while the refactor phase is spawned as an isolated subagent (like subagents-v2 for all phases). exact-green-refactor-v2-testlist-fix-cc goes one step further and **additionally isolates the green phase** as a subagent — only the test list and red remain skills in the shared context. hybrid-v2 and green-refactor-v2 are therefore not character-exact derivations of the `.1` variants — see caveat (c).

| | exact-subagents-v2-testlist-fix-cc | exact-single-context-v2-testlist-fix-cc | exact-hybrid-v2-testlist-fix-cc | exact-green-refactor-v2-testlist-fix-cc |
|---|---|---|---|---|
| Test list | dedicated subagent | skill in the single context | skill in the single context | skill in the single context |
| Red        | dedicated subagent | skill in the single context | skill in the single context | skill in the single context |
| Green      | dedicated subagent | skill in the single context | skill in the single context | **dedicated subagent** |
| Refactor   | dedicated subagent | skill in the single context | **dedicated subagent** | **dedicated subagent** |
| Token profile | more (each subagent re-reads the prompt inputs) | less per phase, but cumulative in the one context | mixed form — red/green in the single context plus a separate refactor context | mixed form — test list/red in the single context plus separate green and refactor contexts |

This RQ extracts the context-engineering question from RQ-tdd-quality (where it was only one finding among five, as F-tdd-quality.3) and extends it by two hybrid points: hybrid-v2 isolates only the refactor phase, green-refactor-v2 additionally isolates the green phase. This allows an architecture gradient to be tested — from full phase isolation (subagents-v2) through partial isolation with two subagent phases (green-refactor-v2) or one subagent phase (hybrid-v2) to fully shared (single-context-v2). The `.1` variants were deliberately derived so that their phase-script content matches character for character; hybrid-v2 and green-refactor-v2 are independent hybrids with the same test-list discipline but a different phase invocation structure.

## Opposing Hypotheses

**In favor of isolated subagents (subagents-v2)**:
- Each phase step starts with a focused, undisturbed context.
- No drift from previous phases, no accumulation of past discussion.
- Harder phase discipline, because the green subagent has no "memory" of previous helper functions and no temptation to generalize.

**In favor of the single context (single-context-v2)**:
- Complete readability of the conversation so far; no re-establishment cost.
- Later phases can refer explicitly to earlier code ("refactor the function we just wrote").
- Less token overhead per phase, because there is no repeated context setup.

**In favor of the hybrid hybrid-v2 (only refactor isolated)**:
- Red/green in the single context benefit from the accumulated test/implementation history (like single-context-v2).
- The cost-intensive refactor phase is isolated in the subagent — the fresh context forces an explicit structural analysis instead of opportunistic local cleanup.
- Should combine the complexity advantage of subagents-v2 with the stability and speed profile of single-context-v2 — *if* the architecture effect from F-tdd-quality.1 really comes from the refactor subagent and not from the full phase isolation.

**In favor of the hybrid green-refactor-v2 (green and refactor isolated)**:
- Test list/red in the single context carry the spec anchors and the most recent test discussion in one piece (like single-context-v2).
- The green subagent sees *only* the red test and the task "make it pass" — without accumulation from test-list brainstorming or previous cycle discussions, hence trimmed more strictly toward the minimal solution (as in subagents-v2).
- The refactor subagent additionally inherits the context-reset advantage from hybrid-v2.
- Should hit the complexity advantage of subagents-v2 even more strongly than hybrid-v2, *if* green drift in the single context is an independent driver of Code Mass/complexity and not just the refactor.

The effect of context structuring on code quality is unclear a priori — all four architectures are plausibly better.

## Design

```
Factor:    workflow   — 4 levels (exact-subagents-v2-testlist-fix-cc, exact-single-context-v2-testlist-fix-cc,
                                  exact-hybrid-v2-testlist-fix-cc,
                                  exact-green-refactor-v2-testlist-fix-cc)
Control:   model      — opus-4-7-no-thinking (Portkey OR direct, OR-match, see caveat a)
Control:   kata_base  — claim-office
Control:   prompt     — example-mapping

Cells:      4 (4 workflows x 1 kata)
Replicates: n = 3
Runs:       12 total — to be collected entirely anew (single-context-v2 and green-refactor-v2 are new;
            the old subagents-v1/single-context-v1/hybrid-v1/green-refactor-v1 runs are not transferable, since they do not have
            the test-list-scope-fix or the script unification)
```

## Hypotheses

- **H1 (code quality)**: Isolated subagent contexts (subagents-v2) produce lower complexity metrics (`cognitive_max`, `mccabe_max`, `cc_longest_function`, `smell_total`) than the single context (single-context-v2). hybrid-v2 lies in between, closer to subagents-v2 — because the cost-intensive refactor phase runs isolated and thereby inherits the main mechanism of subagents-v2. green-refactor-v2 lies even closer to subagents-v2 than hybrid-v2, because the green-drift mechanism additionally takes effect.
  Plausible mechanic: without accumulated history the green phase cannot "abstract in anticipation" and delivers the minimally necessary implementation; without refactor drift the refactor phase stays focused on pure structural improvement. With hybrid-v2 only the second mechanism acts, with green-refactor-v2 both.
- **H2 (correctness)**: All four architectures reach similar `tests_passing` and `verification_pct` on claim-office. Correctness is not the primary bottleneck — the context-architecture effect shows up (if present) in code quality and cost, not in external correctness. Falsification: one architecture systematically hits fewer acceptance scenarios.
- **H3 (token consumption)**: subagents-v2 consumes *fewer* tokens than single-context-v2, because isolated subagent contexts do overlap but each subagent grows linearly and briefly — whereas the single-context-v2 single context accumulates the tokens of all phases. hybrid-v2 pays for the refactor subagent in addition to the accumulated single context and therefore lies above single-context-v2 in token terms. green-refactor-v2 pays for two subagent phases (green + refactor) in addition to the single context and, as expected, lies above hybrid-v2 as well.
- **H4 (stability)**: The spread of the code-quality metrics per cell is systematically lower for subagents-v2 than for single-context-v2 (already foreshadowed by RQ-stability F-stability.2). hybrid-v2 and green-refactor-v2 should lie between subagents-v2 and single-context-v2 in terms of stability, green-refactor-v2 closer to subagents-v2. Falsification of H4: single-context-v2 spread ≤ subagents-v2 spread.
  **Reservation (n=3)**: At the current replicate count, the spread estimate per cell is statistically weak — with n=3, H4 can only be examined as a tendency, not robustly confirmed. For a solid stability statement the replicates must be increased later.
- **H5 (wallclock)**: subagents-v2 is **considerably slower** than single-context-v2 in wallclock time. Plausible mechanic: each subagent spawn per TDD phase costs a setup latency (model warmup, re-reading the phase definitions from the agent files), which sums up over the TDD cycles per run and 4 phases per cycle; single-context-v2 pays this overhead only once per run. Expectation: subagents-v2 wallclock ≥ 2× single-context-v2 wallclock on claim-office. hybrid-v2 pays the spawn overhead once per cycle (refactor), green-refactor-v2 twice per cycle (green + refactor); both should lie between single-context-v2 and subagents-v2, green-refactor-v2 closer to subagents-v2.

**Falsification of H1** (single-context-v2 ≤ subagents-v2 on complexity, or hybrid-v2/green-refactor-v2 far above subagents-v2): the context separation or the refactor/green isolation brings no code-quality advantage — it may even hurt, because isolated subagents have no knowledge of the test history.

**Falsification of H3** (subagents-v2 ≥ single-context-v2 tokens, or hybrid-v2/green-refactor-v2 ≤ single-context-v2): the subagent spawn overheads dominate the tokens saved by avoiding context accumulation; or the isolated subagents are not the dominant token drivers.

**Falsification of H5** (subagents-v2 ≤ single-context-v2 wallclock): subagent spawn overhead is negligible compared to the accumulated token-processing cost in the single context.

## Caveats

- **(a) Single model, mixed routing**: Only `opus-4-7-no-thinking`, but `controls.model` is an OR list `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. New fill runs go via Portkey (priority 1), existing direct runs continue to be used; both routes count as one cell. Assumption: routing has no effect on code quality; on `duration_seconds` (H5) it possibly does (Portkey retry/timeout characteristics) — take this into account in the wallclock evaluation, if necessary group by `model` instead of `cell_model`. Weaker models could moreover benefit more from phase isolation (no drift) or less (re-establishment costs dominate).
- **(b) Single kata**: Only claim-office (CLI kata, novel) — chosen because context engineering should be tested on a task the model does not know by heart and for which correctness is not a given. game-of-life (library form) and mars-rover remain open as cross-kata replication.
- **(c) Identical phase-script content only for subagents-v2 ↔ single-context-v2**: guaranteed by the workflow definition (see `experiments/workflows/exact-coding/opus/exact-subagents-v2-testlist-fix-cc/.claude/agents/` vs `experiments/workflows/exact-coding/opus/exact-single-context-v2-testlist-fix-cc/.claude/commands/`). The `.1` variants were deliberately derived so that the phase-script texts (test list, red, green, refactor including the test-list-scope-fix) match in content; the only difference is the invocation mechanism — subagent spawn (isolated context) for subagents-v2 vs. skill invocation in the same context for single-context-v2. hybrid-v2 and green-refactor-v2, by contrast, are **not character-exact derivatives**: both share the test-list-scope-fix and use the test list/red as skills in the single context (like single-context-v2); hybrid-v2 additionally spawns the refactor as a subagent, green-refactor-v2 spawns green and refactor as subagents (each as subagents-v2 does for these phases). Consequence: the subagents-v2↔single-context-v2 comparison isolates the pure architecture effect, while the hybrid-v2 and green-refactor-v2 comparisons mix architecture differences with (small) script differences in the subagent specifications. With subagents-v2, hybrid-v2 and green-refactor-v2 the subagents receive their context explicitly via a prompt block (`tdd-experiment-mode.md`); with single-context-v2 this is unnecessary because the context is shared.
- **(d) Entirely new data collection**: This RQ collects all runs anew. The old subagents-v1/single-context-v1/hybrid-v1/green-refactor-v1 runs are not transferable, because single-context-v2 and green-refactor-v2 are new workflows and all four variants carry the test-list-scope-fix or the script unification that the old runs did not have.

## Findings

See [findings.md](findings.md).

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {exact-subagents-v2-testlist-fix-cc, exact-single-context-v2-testlist-fix-cc, exact-hybrid-v2-testlist-fix-cc, exact-green-refactor-v2-testlist-fix-cc}`,
`kata = claim-office-example-mapping`,
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (OR-match, see caveat a).
