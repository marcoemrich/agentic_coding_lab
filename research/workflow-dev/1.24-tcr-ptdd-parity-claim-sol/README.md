---
id: RQ-tcr-ptdd-parity-claim-sol
question: "On Claim Office with SOL/pi, does a TCR-source-parity transfer of the domain-boundary workflow to Predictive TDD reproduce TCR's decomposition when all non-method-specific test-list, domain-review, stack, and lab contracts are retained, or does the commit-or-revert phase mechanism still separate the methods?"
factors:
  workflow:
    - exact-tcr-v1.3-domain-boundary-trial-pi
    - exact-sol-v1.4-domain-boundary-trial-pi
    - exact-sol-v1.5-tcr-parity-domain-trial-pi
controls:
  model: gpt-5-6-sol-codex
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # Correctness and completion gates
  - verification_pct
  - tests_passing
  - completed_within_budget
  # Primary decomposition outcomes
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  - cc_functions
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - smell_total
  - smell_code_quality
  # Compactness witnesses
  - code_mass
  - cc_loc
  - test_lines
  # Method execution and audit trail
  - test_blocks
  - red_verified
  - red_unverified
  - tcr_refactor_steps
  - tcr_method_commits
  - tcr_red_commits
  - tcr_green_commits
  - tcr_refactor_commits
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # Efficiency
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: answered
---

# TCR-to-Predictive-TDD Parity Transfer on Claim Office

## Motivation

`RQ-srp-effect-exact-tcr-sol` found that the same semantic domain-boundary trial
produced more consistent Claim Office decomposition under first-party EXACT TCR
than under the first Predictive-TDD port. The result did not isolate
commit-or-revert: the port was derived from the native SOL line and retained its
own test-list wording, stack profile, composed workflow, marker presentation,
and phase-closure context.

This RQ constructs a stricter transfer from
`exact-tcr-v1.3-domain-boundary-trial-pi`. The candidate retains every
non-method-specific contract from that source and replaces only behavior that
constitutes the development method:

- RED/GREEN/REFACTOR commits and hard resets become Predictive TDD
  prediction/check and narrow undo;
- successful work remains in the working tree instead of receiving a method
  commit;
- the same complete inactive test list, Four Rules order, domain responsibility
  review, change counterfactual, concrete boundary moves, mandatory strongest-
  candidate trial, semantic evidence, stack guidance, autonomous continuation,
  shared context, and parser markers remain;
- APP is absent from all three workflows.

Claim Office is the only kata because the earlier method difference appeared on
its multi-policy domain and did not resolve on Game of Life.

## Arms and controlled contrast

| Arm | Derivation | Retained domain/test/stack context | Phase persistence |
|---|---|---|---|
| TCR source | `exact-tcr-v1.3-domain-boundary-trial-pi` | source contract | native-Git commit-or-revert |
| Semantic-only PTDD port | `exact-sol-v1.4-domain-boundary-trial-pi` | native SOL context plus transferred semantic trial | prediction/check/undo |
| TCR-parity PTDD port | `exact-sol-v1.5-tcr-parity-domain-trial-pi` | TCR source contract except method-specific clauses | prediction/check/narrow-undo |

The primary contrast is TCR source versus TCR-parity PTDD. The semantic-only
port is a diagnostic arm: it shows whether retaining the rest of the TCR source
context closes the structural gap observed in the previous RQ.

## Classification rule for the transfer

A clause is **method-specific** only when it determines how a phase persists or
recovers: staging, phase commits, hard reset, commit labels, and clean-tree
transitions. Those clauses are translated to prediction, deterministic checking,
working-tree retention, and narrow undo.

The complete test-list obligation, one observable behavior at a time, Four Rules
order, domain-language responsibility analysis, mandatory boundary trial,
semantic records, stack-specific implementation guidance, lab markers,
autonomous continuation, and completion gate are treated as
**method-independent** and retained. This classification is documented in the
candidate's `SOURCE.md` and is the controlled intervention, not an assumption
that arbitrary TCR and Predictive-TDD workflows are otherwise identical.

## Hypotheses

- **H1 — phase-mechanism effect:** the parity PTDD port remains less decomposed
  than TCR on function count, function length, or average complexity. TCR's
  transactional phase closure contributes beyond semantic and contextual parity.
- **H2 — context-transfer effect:** the parity PTDD port approaches TCR and
  improves over the semantic-only port. The earlier gap came partly from
  retaining native SOL context rather than transferring the TCR source contract.
- **H3 — semantic mechanism dominance:** both PTDD ports remain
  spread-overlapping with each other and TCR. Replicate variation, not the phase
  mechanism, explains the earlier ranking.
- **H4 — correctness neutrality:** all arms retain complete internal and external
  correctness and finish within budget.
- **H5 — audit-trail separation:** TCR retains method commits and near-complete
  verified RED history; both PTDD arms create no method commits. This is expected
  representation, not by itself a quality ranking.
- **H6 — efficiency trade-off:** parity context or TCR phase persistence changes
  duration, tokens, or list-price cost even when final quality overlaps.

## Interpretation rules

Correctness and completion gate every quality claim. Report Code Mass (APP) only
as an externally measured compactness witness; no arm contains APP guidance.
Function count is a decomposition witness, not an intrinsically directional
quality metric. Process commit counts describe each method's intended
representation and receive no quality trophy.

A difference between TCR and the parity port supports a **workflow phase-
mechanism** interpretation, not a claim that Git alone is causal: predictions,
check timing, rollback scope, and phase-labelled persistence form one method
bundle. Katas are not averaged because this RQ contains Claim Office only.

## Existing evidence and fill requirement

The TCR source and semantic-only PTDD port each already have five matching Claim
Office runs from `RQ-srp-effect-exact-tcr-sol`. No parity-port run exists.
Query-based aggregation therefore requires exactly five fresh
`exact-sol-v1.5-tcr-parity-domain-trial-pi` runs. One planned run serves as the
workflow smoke test and counts toward the cell if healthy; the remaining fill
runs use five shards as requested.

## Treatment-fidelity checks

Before aggregation, inspect every candidate transcript, final source, and Git
summary:

1. all required workflow, test-list, and TypeScript/Vitest profile documents are
   read before implementation;
2. the complete inactive test list is created before the first behavior;
3. every cycle emits `## Red`, prediction evidence, `## Green`, and
   `## Refactor` markers;
4. domain responsibility, independent change axes, the strongest boundary
   candidate, outcome, semantic change, and Fewest Elements evidence appear;
5. credible boundary candidates are actually changed and checked, not merely
   discussed;
6. failed or semantically unhelpful trials are narrowly undone without
   `git reset --hard`;
7. no `[TEST LIST]`, `[RED]`, `[GREEN]`, or `[REFACTOR]` method commits are
   created by the candidate;
8. the final source preserves domain boundaries without tactical-DDD overreach;
9. all internal gates, the external verifier, CLI build, done marker, and clean
   completion succeed.

A fidelity failure is reported and retained as a result; it is never silently
excluded or refilled.

## Execution sequence

1. Verify the source-to-port diff is limited to the documented method
   substitution, path renaming, provenance, and required wording adaptations.
2. Run one Claim Office smoke replicate and check the merged marker block in
   `metrics.json` plus zero method commits.
3. Generate the query fill plan and execute the remaining runs with five shards.
4. Spot-check treatment fidelity and source structure before aggregation.
5. Compute costs, aggregate all three arms, propose findings, and set the RQ to
   `answered` only after approval.
