---
id: RQ-tdd-correctness
question: "Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata?"
factors:
  workflow_x_prompt:
    # TDD axis (fixed line)
    - {workflow: baseline-inline-tdd-v1-cc,                                  prompt: example-mapping}
    - {workflow: exact-subagents-v2-testlist-fix-cc,                       prompt: example-mapping}
    - {workflow: exact-single-context-v2-testlist-fix-cc,                       prompt: example-mapping}
    - {workflow: exact-hybrid-v2-testlist-fix-cc,                prompt: example-mapping}
    - {workflow: exact-green-refactor-v2-testlist-fix-cc, prompt: example-mapping}
    # non-TDD control group: vibe-coding + tests + single end refactoring
    - {workflow: baseline-end-refactor-only-v1-agent-cc,                    prompt: example-mapping}
    - {workflow: baseline-end-refactor-only-v1-native-cc,                   prompt: example-mapping}
controls:
  model:
    any:                            # OR-match: reuse existing direct runs, new ones via Portkey
      - opus-4-7-portkey-no-thinking
      - opus-4-7-no-thinking
  kata_base: claim-office
outcomes:
  - verification_pct
  - verification_passed
  - verification_total
  - tests_passing
  - completed_within_budget
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - tests_passed_immediately
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-tdd-correctness: Workflow Effect on Correctness (claim-office)

Does external correctness (`verification_pct`) differ between TDD workflow variants when the model has to solve a novel kata not contained in the training data?

## Motivation

RQ-tdd-quality examines the workflow effect on *code quality* (game-of-life). Hypothesis H4 there assumes that `verification_pct` lies at ~1.0 independently of the workflow — but this assumption is based on training-known katas in which the model "knows" the solution.

On claim-office (a novel kata, not in the training data) correctness is not a given. Here the workflow structure could have a measurable influence:
- Minimal TDD (inline-tdd-v1) enforces only loose incremental verification.
- subagents-v2 (testlist-scope-fix, isolated subagents) explicitly limits the scope per cycle and works phase-isolated.
- single-context-v2 (testlist-scope-fix, single context) uses the same phase-script content as subagents-v2, but in a shared context.
- hybrid-v2 (hybrid) combines skill-based red/green in the shared context with an isolated refactor subagent.
- green-refactor-v2 (hybrid-green-refactor) isolates the green phase as a subagent in addition to the refactor phase; the test list and red remain skills in the shared context.

All four structured workflows carry the test-list-scope-fix ("Cover every spec example"). The question is whether the context-architecture differences show up in external correctness *before* we compare code quality.

Additionally included is a **non-TDD control group** (end-refactor-only-v1-agent/end-refactor-only-v1-native) in order to answer the critical preliminary question: *is TDD necessary for correctness at all, or does vibe-coding + tests after the fact + a single end refactoring reach the same `verification_pct` level?* This control is orthogonal to H1/H2/H3 (which make the TDD-internal comparison) — see H4 below.

## Non-TDD Control Group (end-refactor-only-v1-agent, end-refactor-only-v1-native)

end-refactor-only-v1-agent and end-refactor-only-v1-native are not TDD workflows but three-phase controls:

- **baseline-end-refactor-only-v1-agent-cc** — Phase 1: implementation without tests. Phase 2: test suite against `prompt.md` (with the "Cover every spec example" obligation, same as the test-list-scope-fix). Phase 3: a single refactor via subagent (`refactor.md` identical in content to hybrid-v2/green-refactor-v2 — Four Rules of Simple Design + APP + naming + mandatory attempt).
- **baseline-end-refactor-only-v1-native-cc** — identical to end-refactor-only-v1-agent in phases 1+2 **and in the content of phase 3** (Four Rules + APP + naming + mandatory attempt), but phase 3 is executed via the slash command `/refactor` (`.claude/commands/refactor.md`) **inline in the main session context** instead of being spawned as a fresh subagent. Structurally symmetric to end-refactor-only-v1-agent (`.claude/agents/refactor.md`): both externalize the refactor spec into a separate file, the only difference being agent spawn vs command invocation. end-refactor-only-v1-agent vs end-refactor-only-v1-native thereby isolates the **subagent mechanism** at otherwise identical refactor content and timing.

TDD discipline metrics (`cycle_count`, `refactorings_applied`, `predictions_correct_rate`, `tests_passed_immediately`) are **null by design** in the v8 arms — they lie outside the comparison. The outcome comparison against the TDD arms runs via `verification_pct`, `tests_passing`, `completed_within_budget` and cost.

## Design

```
Factor:    workflow_x_prompt  — 7 levels (TDD axis: inline-tdd-v1+EM, subagents-v2+EM,
                                          single-context-v2+EM, hybrid-v2+EM, green-refactor-v2+EM
                                          non-TDD control: end-refactor-only-v1-agent+EM, end-refactor-only-v1-native+EM)
Control:   model              — opus-4-7-no-thinking (Portkey OR direct, OR-match, see caveat a)
Control:   kata_base          — claim-office

Cells:      7
Replicates: n = 3
Runs:       to be collected entirely anew (fixed line + v8 control)
```

> **Historical note:** The original frontmatter additionally contained
> exact-subagents-v2.1-shared-context-cc and exact-subagents-v2.1.1-fake-it-green-cc as workflow levels. Both
> were removed on 2026-05-22 after the data clearly showed that the
> shared-context branch brings no correctness improvement over subagents-v2
> (see `research/workflow-dev/workflow-construction.md` and
> F-model-novel.4 in [RQ-model-novel](../RQ-model-novel-model-effect-novel-kata/findings.md)). The
> archived workflow definitions are in
> `experiments/workflows/_archive/`; the 5+2 completed runs are retained
> as historical data points but are no longer matched for
> aggregation.
>
> Also on 2026-05-22, the RQ was switched to the **fixed workflow line**:
> exact-subagents-v1-cc → exact-subagents-v2-testlist-fix-cc,
> exact-single-context-v1-cc → exact-single-context-v2-testlist-fix-cc,
> exact-hybrid-v1-cc → exact-hybrid-v2-testlist-fix-cc. All three structured
> workflows now carry the test-list-scope-fix; subagents-v2 and single-context-v2 are derived
> such that their phase-script content is identical and differs only in the
> invocation mechanism (cf. RQ-context). The old subagents-v1/single-context-v1/hybrid-v1 runs
> are therefore no longer transferable — the cells are collected anew.

## Hypotheses

- **H1 (correctness varies between workflows)**: `verification_pct` differs significantly between the 5 TDD workflow levels. Phase-structured workflows (subagents-v2/single-context-v2/hybrid-v2/green-refactor-v2) reach higher correctness than minimal TDD (inline-tdd-v1), because incremental verification matters more with unknown requirements than with training-known katas.
- **H2 (context architecture at equal scope fix)**: Since subagents-v2 and single-context-v2 carry the same phase-script content including the test-list-scope-fix and differ only in the context architecture (isolated subagents vs. single context), their `verification_pct` comparison isolates the pure context effect on correctness. Expectation: small — the scope fix ("Cover every spec example") dominates over the architecture.
- **H3 (correctness is high across all workflows)**: Null hypothesis — `verification_pct` is similarly high (>0.8) for all workflows. The workflow structure influences *how* the code comes about, not *whether* it is correct. That would be consistent with RQ-tdd-quality H4.
- **H4 (TDD is necessary for correctness on a novel kata)**: The TDD arms (inline-tdd-v1/subagents-v2/single-context-v2/hybrid-v2/green-refactor-v2) reach higher `verification_pct` than the non-TDD control group (end-refactor-only-v1-agent/end-refactor-only-v1-native). The mechanism: incremental test definition per cycle forces continuous re-reading of the spec, whereas vibe-coding in phase 1 relies on the first spec reading impression and in phase 2 tends to write tests against its own implementation (see caveat e). Falsification: end-refactor-only-v1-agent/end-refactor-only-v1-native lie within 1 σ of the TDD arms — then the vibe + end refactor approach is equivalent for external correctness.

**Falsification of H1** (verification_pct overlaps completely between the TDD levels): the workflow structure has no correctness effect within the TDD axis on novel katas — correctness is primarily model-driven.

**Falsification of H4** (end-refactor-only-v1-agent/end-refactor-only-v1-native ≈ TDD arms): the TDD advantage for correctness is not empirically supportable on claim-office — a consequence for the recommendation "TDD is valuable for novel katas" from RQ-prompt-correctness / RQ-model-novel.

## Delimitation from RQ-tdd-quality

| | RQ-tdd-quality | RQ-tdd-correctness |
|---|---|---|
| Primary outcome | Code quality | Correctness |
| Kata | game-of-life (training-known) | claim-office (novel) |
| Model | opus-4-7-no-thinking | opus-4-7 (Portkey OR direct, see caveat a) |
| Workflows | oneshot-v1–hybrid-v2 + end-refactor-only-v1-agent/end-refactor-only-v1-native | fixed line inline-tdd-v1/subagents-v2/single-context-v2/hybrid-v2/green-refactor-v2 + end-refactor-only-v1-agent/end-refactor-only-v1-native |
| Non-TDD | oneshot-v1+iterative-v1 (prompt-pure) + end-refactor-only-v1-agent/end-refactor-only-v1-native (structure-pure) | end-refactor-only-v1-agent/end-refactor-only-v1-native (structure-pure non-TDD control group) |
| Sub-variants | none | fixed line (subagents-v2.1/subagents-v2.1.1 branch discarded 2026-05-22, see historical note above) |

## Caveats

- **(a) Mixed routing**: `controls.model` is an OR list `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. Existing direct runs (39 of them, built up before the switch to Portkey) continue to be used, new refill runs go via Portkey (the first list element). In the aggregation pivots both routes are treated as one cell — assumption: routing has no correctness effect (same model weights, same sampling parameters). If pivots show a strong routing-related spread, the decomposition can be debugged by grouping by `model` (instead of `cell_model`) in `runs.csv`.
- **(b) Portkey routing characteristics**: Portkey can have different retry/timeout behavior than direct. No effect on `verification_pct` is expected, but one on `completed_within_budget`/`duration_seconds` is possible. This is observed in the pivots.
- **(c) Uniform prompt style**: All workflows use `example-mapping`. The prompt style effect on claim-office (RQ-prompt-correctness) is not controlled here, but since all cells use the same style it is not a confounder.
- **(d) v8 on example-mapping is not pure vibe-coding**: The example list in the prompt is in fact an implicit test spec that the model can read in phase 1 and convert into tests in phase 2. This slightly distorts the "vibe-coding vs TDD" axis in favor of v8, but is acceptable for the **refactor-timing/correctness axis** (H4): all arms receive identical spec structuring; the only variable is *when* tests/refactor happen (periodically during the implementation vs once at the end). A "purely vibe" non-TDD arm (e.g. oneshot-v1+prose) would mix the spec style effect with the workflow effect.
- **(e) v8 tests against the implementation instead of the spec**: Phase 2 of end-refactor-only-v1-agent/end-refactor-only-v1-native does contain the explicit obligation "source of behavior is `prompt.md` — not the implementation you just wrote", but the model has its own implementation freshly in context. Even with the spec anchor a bias risk remains: tests could implicitly follow the implementation instead of the spec, particularly in the presence of ambiguities. This weakness is part of what H4 aims to measure — it cannot be repaired without turning v8 into TDD.

## Findings

See [findings.md](findings.md).

## Data Source

All runs in `experiments/runs/` with
`workflow ∈ {baseline-inline-tdd-v1-cc, exact-subagents-v2-testlist-fix-cc, exact-single-context-v2-testlist-fix-cc, exact-hybrid-v2-testlist-fix-cc, exact-green-refactor-v2-testlist-fix-cc, baseline-end-refactor-only-v1-agent-cc, baseline-end-refactor-only-v1-native-cc}`,
`kata = claim-office-example-mapping`,
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (OR-match, see caveat a).
