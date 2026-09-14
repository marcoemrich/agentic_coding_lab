---
id: RQ-tcr-variants-opus5
question: "How do classic TCR and TCRDD variants affect correctness, code quality, development behavior, and efficiency in autonomous coding agents, and—within TCRDD—does tool-enforced execution with git-gamble differ from native-Git prompt enforcement?"
factors:
  workflow_x_prompt:
    - {workflow: baseline-inline-tdd-v1.1-local-git-cc, prompt: example-mapping}
    - {workflow: external-tcr-kentbeck-2026-09-14-cc, prompt: example-mapping}
    - {workflow: external-tcrdd-bsene-2026-09-14-cc, prompt: example-mapping}
    - {workflow: external-tcrdd-git-gamble-2026-09-14-cc, prompt: example-mapping}
controls:
  model: opus-5-no-thinking
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

# RQ-4.8: Classic TCR and TCRDD Variants (opus-5)

## Question

How do classic TCR and two implementations of TCRDD affect product outcomes,
process behavior, and efficiency? Within TCRDD, does enforcement by
`git-gamble` differ from the same phase semantics executed with native Git?

## Design

All cells use `claim-office-example-mapping`, `opus-5-no-thinking`, Claude Code,
and an isolated local Git repository initialized by the harness. The repository
is present in every arm so Git availability itself is not a treatment.

| Cell | Method | Enforcement |
|---|---|---|
| `baseline-inline-tdd-v1.1-local-git-cc` | unstructured TDD control | prompt |
| `external-tcr-kentbeck-2026-09-14-cc` | classic TCR: tiny change, test, commit on green or revert on red | native Git |
| `external-tcrdd-bsene-2026-09-14-cc` | RED–GREEN–REFACTOR with phase-specific commit/revert | native Git |
| `external-tcrdd-git-gamble-2026-09-14-cc` | RED–GREEN–REFACTOR with phase-specific gamble | `git-gamble` 2.14.6 |

Five replicates per cell produce 20 new runs. The control has a distinct,
content-identical workflow ID so historical pre-Git runs cannot be reused.
Product metrics are evaluated only within this kata; no cross-kata averaging
is permitted.

## Planned Contrasts

1. **Classic TCR vs. TDD control** is a method comparison, not a single-factor
   causal contrast: test-first, commit/revert discipline, and history semantics
   differ together.
2. **Classic TCR vs. native TCRDD** compares the two TCR schools: unconstrained
   micro-changes with an always-green main history against a TDD-directed phase
   protocol that accepts expected RED.
3. **Native TCRDD vs. git-gamble TCRDD** is the main mechanistic contrast. It
   holds the intended phase semantics constant and changes their enforcement.
4. **Each TCRDD arm vs. TDD control** estimates the net effect of adding
   phase-specific commit/revert gates to a TDD loop. The TCRDD cells remain
   separate and are never pooled.

## Hypotheses

- **H1:** Classic TCR produces smaller accepted increments and more frequent
  commits than the TDD control.
- **H2:** Both TCRDD variants produce more incremental, verified RED–GREEN
  cycles than the TDD control.
- **H3:** Native and tool-based TCRDD have similar final product outcomes when
  both execute their prescribed method faithfully.
- **H4:** Tool-based TCRDD has higher protocol adherence than native,
  prompt-enforced TCRDD.
- **H5:** Commit/revert discipline increases duration and token use and may
  reduce completion within budget.
- **H6:** An outcome direction shared by both TCRDD variants is more plausibly
  attributable to TCRDD semantics than to `git-gamble`; a result confined to
  the tool arm points instead to tooling or tool–agent interaction.

Classic TCR is deliberately **not** evaluated on test-first behavior. It does
not promise test-first; its fidelity criteria are small changes, immediate
full-suite execution, commit on green, revert on red, and no accumulation of a
broken working tree.

## Method-Fidelity Measures

Fidelity is method-specific rather than one universal score:

- **Classic TCR:** change/test alternation, accepted step size, green commits,
  red reverts, and absence of retained broken states.
- **TCRDD:** one behavior per RED, observed expected failure, minimum GREEN,
  green-only refactoring, correct handling of surprise outcomes, and separated
  cycles rather than a big bang.
- **TDD control:** tests preceding their production changes, observed RED, and
  incremental rather than batched test writing.

`measure-tdd-rigour.py` supplies marker-free test-block and RED-verification
measures. Git history supplies commit measures. Reverts must be reconstructed
from transcripts and `tcr-failure-log.md`; a zero revert count alone is
ambiguous because it may mean either successful prediction or non-adherence.

## Isolated-Git Harness

After dependency installation, every run receives a local repository, local
identity, and an `Initial kata state` commit. Harness artifacts, dependencies,
logs, transcripts, metrics, and the done marker are ignored so a skill's
`git add -A` cannot commit or revert them. The harness verifies that
`git rev-parse --show-toplevel` equals the run directory.

After model execution and before any harness-authored CLI nudge, the harness
exports the commit list, status, reconstructable patch stream, and structured
summary. It then removes `.git`, preventing the completed run from becoming a
nested repository in the lab repository. A transient API retry resets the local
repository to its initial commit first.

## Caveats

- The external skills are unmodified snapshots; only autonomy, invocation,
  test-command, repository-boundary, and done-marker rules are added. Per
  `experiments/workflows/MARKERS.md`, no RED marker block is inserted.
- `bsene/skills` declared no repository license at the vendored snapshot. Its
  provenance notice records this explicitly; redistribution must be resolved
  before publication outside the lab.
- `git-gamble` may amend an expected-RED commit when GREEN succeeds. Therefore
  final-history RED-commit counts are not by themselves comparable to the
  native TCRDD arm; transcript events and exported reflog data are required for
  phase-fidelity analysis.
- The TDD control and classic TCR are different methods, not matched
  implementations of one method. Only the two TCRDD cells support a focused
  tooling interpretation.
- Correctness gates interpretation of apparent quality or efficiency wins: a
  smaller incorrect implementation is not cleaner or more efficient delivery.

## Data Source

All runs in `experiments/runs/` matching the four workflows above,
`kata = claim-office-example-mapping`, and `model = opus-5-no-thinking`.

## Sources

- Kent Beck TCR adaptation: `xpepper/tcr-skill`, commit `48c16c0`
- git-gamble TCRDD skill: `xpepper/tcr-skill`, commit `48c16c0`
- Native-Git TCRDD skill: `bsene/skills`, commit `81a792d`
- git-gamble: version 2.14.6, upstream commit `648266b`
- Marker policy: `experiments/workflows/MARKERS.md`
