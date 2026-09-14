---
id: RQ-tcr-variants-sol
question: "How do classic TCR and TCRDD variants affect correctness, code quality, development behavior, and efficiency for SOL on pi, and—within TCRDD—does tool-enforced execution with git-gamble differ from native-Git prompt enforcement?"
factors:
  workflow_x_prompt:
    - {workflow: baseline-inline-tdd-v1.1-local-git-pi, prompt: example-mapping}
    - {workflow: exact-sol-v1.3.2-local-git-control-pi, prompt: example-mapping}
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

# RQ-1.7: Classic TCR and TCRDD Variants for SOL on pi

## Question

How do classic TCR and two implementations of TCRDD affect product outcomes,
process behavior, and efficiency for SOL on pi? Within TCRDD, does enforcement
by `git-gamble` differ from the same phase semantics executed with native Git?

## Design

All cells use `claim-office-example-mapping`, `gpt-5-6-sol-codex`, pi, and the
same isolated local Git setup. Two controls anchor the comparison:
`baseline-inline-tdd-v1.1-local-git-pi` is basic, unstructured TDD, while
`exact-sol-v1.3.2-local-git-control-pi` is a content-identical snapshot of the
current `exact-sol-v1.3-stack-profile-pi` SOL Predictive-TDD default. Their
distinct IDs prevent accidental reuse of historical runs that had no local
repository.

| Cell | Method | Enforcement |
|---|---|---|
| `baseline-inline-tdd-v1.1-local-git-pi` | basic, unstructured TDD control | one prompt rule |
| `exact-sol-v1.3.2-local-git-control-pi` | SOL Predictive TDD control | pi skill documents |
| `external-tcr-kentbeck-2026-09-14-pi` | classic TCR: tiny change, test, commit on green or revert on red | native Git |
| `external-tcrdd-bsene-2026-09-14-pi` | RED–GREEN–REFACTOR with phase-specific commit/revert | native Git |
| `external-tcrdd-git-gamble-2026-09-14-pi` | RED–GREEN–REFACTOR with phase-specific gamble | `git-gamble` 2.14.6 |

Five replicates per cell produce 25 runs in the final data set. Product metrics
are evaluated only within this kata; no cross-kata averaging is permitted.

## Planned Contrasts

1. **Basic TDD vs. SOL Predictive TDD** measures what SOL's predictive and
   Four-Rules structure adds over an unstructured TDD instruction.
2. **Classic TCR vs. both TDD controls** is a method comparison, not a
   single-factor causal contrast.
3. **Classic TCR vs. native TCRDD** compares unconstrained TCR micro-changes
   against a TDD-directed phase protocol.
4. **Native TCRDD vs. git-gamble TCRDD** is the main mechanistic contrast: the
   intended method is held constant while enforcement changes.
5. **Each TCRDD arm vs. both TDD controls** estimates the net effect of adding
   phase-specific commit/revert gates to the model's recommended TDD workflow.
   The TCRDD cells are reported separately and never pooled.

## Hypotheses

- **H1:** SOL Predictive TDD produces stronger cycle discipline and cleaner
  decomposition than basic TDD, at higher cost.
- **H2:** Classic TCR produces smaller accepted increments and more frequent
  commits than either TDD control.
- **H3:** Both TCRDD variants preserve SOL's incremental verified RED–GREEN
  behavior while making phase outcomes auditable through Git.
- **H4:** Native and tool-based TCRDD have similar final product outcomes when
  both execute their prescribed method faithfully.
- **H5:** Tool-based TCRDD has higher protocol adherence than native,
  prompt-enforced TCRDD.
- **H6:** Commit/revert discipline increases duration and token use and may
  reduce completion within budget.
- **H7:** An outcome direction shared by both TCRDD variants is more plausibly
  attributable to TCRDD semantics than to `git-gamble`; a result confined to
  the tool arm points toward tooling or tool–model interaction.

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
- **TCRDD:** one behavior per RED, observed expected failure, minimum GREEN,
  green-only refactoring, correct surprise handling, and separated cycles.
- **Basic TDD control:** test-first behavior and incremental rather than batched
  test writing, without imposing SOL's prediction or refactoring markers.
- **SOL control:** predictive checks, behavioral RED, minimal GREEN, and
  per-cycle Four-Rules review according to its own contract.

## Caveats

- The external skills are byte-identical snapshots. Their `AGENTS.md` files add
  only pi loading, autonomy, test-command, repository-boundary, continuation,
  and done-marker instructions. No RED/prediction marker is inserted.
- Marker-derived SOL-control metrics are not directly comparable to the
  marker-free external arms. Cross-cell discipline comparisons use
  `test_blocks`, `test_cases_*`, and `red_verified`/`red_unverified`.
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

All runs in `experiments/runs/` matching the five workflows above,
`kata = claim-office-example-mapping`, and `model = gpt-5-6-sol-codex`.

## Sources

- SOL control recommendation: `research/workflow-dev/model-recommendation-matrix.md`
- Kent Beck and git-gamble skills: `xpepper/tcr-skill`, commit `48c16c0`
- Native-Git TCRDD: `bsene/skills`, commit `81a792d`
- git-gamble: version 2.14.6, upstream commit `648266b`
- Marker policy: `experiments/workflows/MARKERS.md`
