---
id: RQ-tcr-variants-opus5
question: "How do classic TCR and TCRDD variants affect correctness, code quality, development behavior, and efficiency in autonomous coding agents, and—within TCRDD—does tool-enforced execution with git-gamble differ from native-Git prompt enforcement?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v2.4-lab-split-cc, prompt: example-mapping}
    - {workflow: external-tcr-kentbeck-2026-09-14-cc, prompt: example-mapping}
    - {workflow: external-tcrdd-bsene-2026-09-14-cc, prompt: example-mapping}
    - {workflow: external-tcrdd-git-gamble-2026-09-14-cc, prompt: example-mapping}
controls:
  model: opus-5-requesty-no-thinking
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
  - cost_usd
min_replicates: 4
status: geplant
---

# RQ-4.8: Classic TCR and TCRDD Variants (opus-5)

## Question

How do classic TCR and two implementations of TCRDD affect product outcomes,
process behavior, and efficiency? Within TCRDD, does enforcement by
`git-gamble` differ from the same phase semantics executed with native Git?

## Design

All cells use `claim-office-example-mapping`, `opus-5-requesty-no-thinking`,
Claude Code via Requesty (`vertex/claude-opus-5@eu`), and an isolated local Git
repository initialized by the harness. The repository
is present in every arm so Git availability itself is not a treatment.

| Cell | Method | Enforcement |
|---|---|---|
| `exact-hybrid-v2.4-lab-split-cc` | current EXACT Coding Predictive-TDD control | Claude Code skills and subagents |
| `external-tcr-kentbeck-2026-09-14-cc` | classic TCR: tiny change, test, commit on green or revert on red | native Git |
| `external-tcrdd-bsene-2026-09-14-cc` | RED–GREEN–REFACTOR with phase-specific commit/revert | native Git |
| `external-tcrdd-git-gamble-2026-09-14-cc` | RED–GREEN–REFACTOR with phase-specific gamble | `git-gamble` 2.14.6 |

The final data set contains four valid replicates for EXACT Coding and
`git-gamble` TCRDD and five for Classic TCR and native-Git TCRDD. The EXACT
Coding control is the current correctness-oriented baseline for Opus 5. Product
metrics are evaluated only within this kata; no cross-kata averaging is
permitted.

## Planned Contrasts

1. **Classic TCR vs. EXACT Coding** is a method comparison, not a single-factor
   causal contrast: predictive test-first structure, subagent architecture,
   commit/revert discipline, and history semantics differ together.
2. **Classic TCR vs. native TCRDD** compares the two TCR schools: unconstrained
   micro-changes with an always-green main history against a TDD-directed phase
   protocol that accepts expected RED.
3. **Native TCRDD vs. git-gamble TCRDD** is the main mechanistic contrast. It
   holds the intended phase semantics constant and changes their enforcement.
4. **Each TCRDD arm vs. EXACT Coding** compares phase-specific commit/revert
   gates with the current predictive, subagent-based TDD workflow. The TCRDD
   cells remain separate and are never pooled.

## Hypotheses

- **H1:** Classic TCR produces smaller accepted increments and more frequent
  commits than the EXACT Coding control.
- **H2:** Both TCRDD variants produce incremental, verified RED–GREEN cycles
  without EXACT Coding's predictive subagent architecture.
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
- **EXACT Coding control:** predictive checks, behavioral RED, minimal GREEN,
  and per-cycle Four-Rules review according to its own contract.

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
- The EXACT Coding control and classic TCR are different methods, not matched
  implementations of one method. Only the two TCRDD cells support a focused
  tooling interpretation.
- Correctness gates interpretation of apparent quality or efficiency wins: a
  smaller incorrect implementation is not cleaner or more efficient delivery.
- This RQ uses the Requesty route rather than the native Anthropic subscription
  route. Results remain a separate model-route cell and must not be pooled with
  existing `opus-5-no-thinking` runs.
- The valid replicate counts are unequal (4/5/5/4). Two infrastructure-invalid
  runs were excluded: one EXACT Coding run hit a harness env-command failure in
  a subagent continuation, and one `git-gamble` run substituted an ad-hoc tool
  implementation and stopped after two tests.

## Data Source

All runs in `experiments/runs/` matching the four workflows above,
`kata = claim-office-example-mapping`, and
`model = opus-5-requesty-no-thinking`.

## Sources

- Kent Beck TCR adaptation: `xpepper/tcr-skill`, commit `48c16c0`
- git-gamble TCRDD skill: `xpepper/tcr-skill`, commit `48c16c0`
- Native-Git TCRDD skill: `bsene/skills`, commit `81a792d`
- git-gamble: version 2.14.6, upstream commit `648266b`
- Marker policy: `experiments/workflows/MARKERS.md`
