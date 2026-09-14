---
id: RQ-tcr-variants-sol
question: "How do first-party EXACT Coding TCR, classic TCR, and external TCRDD variants affect correctness, code quality, development behavior, and efficiency for SOL on pi, and how do their native-Git and tool-enforced execution strategies differ?"
factors:
  workflow_x_prompt:
    - {workflow: baseline-inline-tdd-v1.1-local-git-pi, prompt: example-mapping}
    - {workflow: exact-sol-v1.3.2-local-git-control-pi, prompt: example-mapping}
    - {workflow: exact-tcr-v1-pi, prompt: example-mapping}
    - {workflow: external-tcr-kentbeck-2026-09-14-pi, prompt: example-mapping}
    - {workflow: external-tcrdd-bsene-2026-09-14-pi, prompt: example-mapping}
    - {workflow: external-tcrdd-git-gamble-2026-09-14-pi, prompt: example-mapping}
controls:
  model: gpt-5-6-sol-codex
  kata_base: claim-office
outcomes:
  - verification_pct
  - tests_passing
  - completed_within_budget
  - test_blocks
  - test_cases_total
  - test_cases_first_block
  - red_verified
  - red_unverified
  - tcr_refactor_steps
  - tcr_method_commits
  - tcr_red_commits
  - tcr_green_commits
  - tcr_refactor_commits
  - cc_avg_loc_per_function
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - smell_total
  - code_mass
  - duration_seconds
  - total_tokens
min_replicates: 5
status: geplant
---

# RQ-1.7: First-Party EXACT Coding TCR, Classic TCR, and TCRDD Variants for SOL on pi

## Question

How do the first-party EXACT Coding TCR workflow, classic TCR, and two external
implementations of TCRDD affect product outcomes, process behavior, and
efficiency for SOL on pi? How do the first-party native-Git composition,
external native-Git prompt enforcement, and `git-gamble` enforcement differ?

## Design

All cells use `claim-office-example-mapping`, `gpt-5-6-sol-codex`, pi, and the
same isolated local Git setup. Two controls anchor the comparison:
`baseline-inline-tdd-v1.1-local-git-pi` is basic, unstructured TDD, while
`exact-sol-v1.3.2-local-git-control-pi` is a content-identical snapshot of the
current `exact-sol-v1.3-stack-profile-pi` SOL Predictive-TDD default. Their
distinct IDs prevent accidental reuse of historical runs that had no local
repository.

The added first-party cell, `exact-tcr-v1-pi`, is derived from
`exact-coding-exercises/.pi` version `2026-09-13`. It creates a complete inactive
test list up front, then executes every behavior through native-Git
RED–GREEN–REFACTOR commit-or-revert steps. Its lab adaptation changes HITL to
autonomous execution and adds pi's phase, prediction, and done markers.

| Cell | Method | Enforcement |
|---|---|---|
| `baseline-inline-tdd-v1.1-local-git-pi` | basic, unstructured TDD control | one prompt rule |
| `exact-sol-v1.3.2-local-git-control-pi` | SOL Predictive TDD control | pi skill documents |
| `exact-tcr-v1-pi` | first-party EXACT Coding: complete inactive test list plus TCRDD | native Git and pi skill documents |
| `external-tcr-kentbeck-2026-09-14-pi` | classic TCR: tiny change, test, commit on green or revert on red | native Git |
| `external-tcrdd-bsene-2026-09-14-pi` | RED–GREEN–REFACTOR with phase-specific commit/revert | native Git |
| `external-tcrdd-git-gamble-2026-09-14-pi` | RED–GREEN–REFACTOR with phase-specific gamble | `git-gamble` 2.14.6 |

Five replicates per cell target 30 runs in the final data set. Product metrics
are evaluated only within this kata; no cross-kata averaging is permitted. The
single `exact-tcr-v1-pi` game-of-life smoke run validates its marker mechanics
but matches neither the controlled kata nor this RQ's data selector.

## Planned Contrasts

1. **Basic TDD vs. SOL Predictive TDD** measures what SOL's predictive and
   Four-Rules structure adds over an unstructured TDD instruction.
2. **First-party EXACT Coding TCR vs. both TDD controls** estimates the net
   effect of its complete up-front test list and native-Git commit-or-revert
   cycle as a method bundle; it is not a single-factor causal contrast.
3. **First-party EXACT Coding TCR vs. external native-Git TCRDD** compares two
   prompt-enforced TCRDD compositions: the first-party workflow's up-front
   inactive test list and stack profiles against the external workflow's
   behavior-at-a-time protocol.
4. **Classic TCR vs. the TDD workflows** compares unconstrained TCR
   micro-changes against explicitly test-first phase protocols.
5. **External native-Git TCRDD vs. git-gamble TCRDD** is the focused
   enforcement contrast: the intended external method is held constant while
   its enforcement changes.
6. **All TCRDD cells vs. both controls** compare phase-specific commit/revert
   discipline with basic and SOL Predictive TDD. The TCRDD cells are reported
   separately and never pooled.

## Hypotheses

- **H1:** SOL Predictive TDD produces stronger cycle discipline and cleaner
  decomposition than basic TDD, at higher cost.
- **H2:** First-party EXACT Coding TCR preserves the SOL control's complete
  specification coverage while making each phase auditable through native-Git
  commits.
- **H3:** Classic TCR produces smaller accepted increments and more frequent
  commits than either TDD control.
- **H4:** All TCRDD variants preserve incremental verified RED–GREEN behavior
  while making phase outcomes auditable through Git.
- **H5:** The first-party up-front test list improves specification coverage
  relative to external native-Git TCRDD, at additional duration and token cost.
- **H6:** External native and tool-based TCRDD have similar final product
  outcomes when both execute their prescribed method faithfully.
- **H7:** Tool-based TCRDD has higher protocol adherence than external native,
  prompt-enforced TCRDD.
- **H8:** Commit/revert discipline increases duration and token use and may
  reduce completion within budget.
- **H9:** An outcome direction shared by all TCRDD cells is more plausibly
  attributable to TCRDD semantics; a result confined to one implementation
  points toward its workflow composition, enforcement mechanism, or
  tool–model interaction.

Classic TCR is deliberately not evaluated on test-first behavior. Its fidelity
criteria are small changes, immediate full-suite execution, commit on green,
revert on red, and no accumulation of a broken working tree.

## Measurement

`measure-tdd-rigour.py` supplies marker-free test-block and RED-verification
measures. The isolated repository supplies commit history, reflog, final status,
and a reconstructable patch stream. Reverts must be reconstructed from the pi
transcript, `git-gamble` output, and `tcr-failure-log.md`; zero observed reverts
alone is ambiguous.

Fidelity is evaluated per method:

- **Classic TCR:** change/test alternation, accepted step size, green commits,
  red reverts, and no retained broken state.
- **First-party EXACT Coding TCR:** complete inactive test-list coverage,
  one behavior per RED, phase-specific commit or revert, correct handling of
  already-satisfied behavior, Four-Rules review, and clean final Git state.
- **External TCRDD:** one behavior per RED, observed expected failure, minimum
  GREEN, green-only refactoring, correct surprise handling, and separated
  cycles.
- **Basic TDD control:** test-first behavior and incremental rather than batched
  test writing, without imposing SOL's prediction or refactoring markers.
- **SOL control:** predictive checks, behavioral RED, minimal GREEN, and
  per-cycle Four-Rules review according to its own contract.

## Caveats

- The external skills are byte-identical snapshots. Their `AGENTS.md` files add
  only pi loading, autonomy, test-command, repository-boundary, continuation,
  and done-marker instructions. No RED/prediction marker is inserted.
- `exact-tcr-v1-pi` is first-party source adapted for lab execution rather than
  a byte-identical external baseline. Its predictions and P1–P7 output markers
  are measurement additions and may themselves affect behavior.
- Marker-derived SOL-control and first-party-TCR metrics are not directly
  comparable to the marker-free external arms. Cross-cell discipline
  comparisons use `test_blocks`, `test_cases_*`, and
  `red_verified`/`red_unverified`.
- `git-gamble` may amend an expected-RED commit when GREEN succeeds. Final
  history alone can therefore hide RED states; exported reflog and transcript
  evidence are required.
- `bsene/skills` had no declared repository license in this snapshot.
  Redistribution must be resolved before publication outside the lab.
- Correctness gates quality and efficiency interpretation: smaller wrong code
  is not a quality win.
- This RQ describes `gpt-5-6-sol-codex` on pi. It must not be pooled with the
  Claude Code RQ or the Requesty-routed SOL variant.

## Data Source

All runs in `experiments/runs/` matching the six workflows above,
`kata = claim-office-example-mapping`, and `model = gpt-5-6-sol-codex`.

## Sources

- SOL control recommendation: `research/workflow-dev/model-recommendation-matrix.md`
- First-party EXACT Coding TCR source: `exact-coding-exercises/.pi`, version `2026-09-13`
- Lab workflow provenance: `experiments/workflows/exact-coding/sol/exact-tcr-v1-pi/SOURCE.md`
- Kent Beck and git-gamble skills: `xpepper/tcr-skill`, commit `48c16c0`
- Native-Git TCRDD: `bsene/skills`, commit `81a792d`
- git-gamble: version 2.14.6, upstream commit `648266b`
- Marker policy: `experiments/workflows/MARKERS.md`
