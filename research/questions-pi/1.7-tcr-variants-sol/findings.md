# Findings — RQ-tcr-variants-sol

## Overview

All six cells achieved perfect external and internal correctness. Direction:
correctness and completion **higher = better**; complexity, Code Mass (APP),
duration, and tokens **lower = better**. Quality and efficiency trophies are
correctness-gated; every cell is eligible. Process and Git-history metrics are
descriptive rather than intrinsically directional, so they receive no trophies.

| Outcome | Basic TDD | SOL Predictive TDD | First-party EXACT TCR | Classic TCR | Native-Git TCRDD | git-gamble TCRDD |
|---|---:|---:|---:|---:|---:|---:|
| Correctness (external) | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Completed within budget | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Test blocks | 3.8 ± 0.8 | 25.2 ± 8.7 | 37.0 ± 1.6 | 7.8 ± 2.5 | 17.2 ± 1.9 | 12.2 ± 3.6 |
| Test cases total | 12.4 ± 3.2 | 29.8 ± 6.4 | 36.4 ± 2.6 | 26.0 ± 7.6 | 29.0 ± 7.7 | 19.8 ± 9.4 |
| Test cases in first block | 2.8 ± 2.5 | 1.0 ± 0.0 | 0.0 ± 0.0 | 1.8 ± 1.1 | 1.0 ± 0.0 | 0.8 ± 0.4 |
| Verified RED | 2.8 ± 1.3 | 9.8 ± 7.3 | 36.8 ± 1.8 | 6.2 ± 3.1 | 17.2 ± 1.9 | 12.2 ± 3.6 |
| Unverified RED | 1.0 ± 0.7 | 15.4 ± 2.3 | 0.2 ± 0.4 | 1.6 ± 3.1 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Explicit TCRDD refactor steps | 0.0 ± 0.0 | 0.0 ± 0.0 | 5.6 ± 4.2 | 0.0 ± 0.0 | 6.6 ± 2.6 | 2.8 ± 0.8 |
| TCR method commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 58.8 ± 7.7 | 10.4 ± 1.9 | 1.0 ± 0.0 | 24.8 ± 6.4 |
| Retained RED commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 17.2 ± 3.0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Retained GREEN commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 35.4 ± 2.0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Retained refactor commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 5.2 ± 3.4 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| `cc_avg_loc_per_function` ↓ | 7.29 ± 1.23 | **6.80 ± 0.39** 🏆 | 8.00 ± 2.13 | 8.00 ± 1.14 | 9.81 ± 2.85 | 8.31 ± 1.35 |
| Complexity Peak (`cc_longest_function`) ↓ | 20.2 ± 3.3 | **16.2 ± 1.3** 🏆 | 18.2 ± 6.9 | 22.0 ± 6.4 | 18.6 ± 2.6 | 17.4 ± 1.7 |
| `cognitive_max` ↓ | 6.6 ± 2.1 | 4.0 ± 1.2 | **3.2 ± 0.8** 🏆 | 6.8 ± 0.8 | 5.4 ± 1.5 | 6.2 ± 1.8 |
| `mccabe_max` ↓ | 8.4 ± 3.6 | 4.8 ± 1.3 | **4.0 ± 0.7** 🏆 | 7.4 ± 1.1 | 5.6 ± 0.9 | 6.2 ± 0.4 |
| Smell Total ↓ | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 |
| Code Mass (APP) ↓ | 770.2 ± 73.7 | 574.2 ± 34.3 | 553.6 ± 29.1 | 819.2 ± 58.8 | **505.0 ± 60.3** 🏆 | 556.6 ± 24.3 |
| Duration ↓ | **278 ± 41 s** 🏆 | 1388 ± 303 s | 1082 ± 141 s | 460 ± 77 s | 708 ± 172 s | 558 ± 84 s |
| Total tokens ↓ | **0.34 M ± 0.07 M** 🏆 | 5.48 M ± 1.26 M | 6.29 M ± 0.65 M | 0.75 M ± 0.13 M | 2.32 M ± 0.41 M | 1.71 M ± 0.75 M |

The retained-commit rows describe final-history shape, not an adherence rank.
Native-Git external TCRDD deliberately squashes its phase commits at completion,
whereas first-party EXACT TCR retains phase-specific commits. RED verification
is a TDD construct and is not a fidelity criterion for Classic TCR.
`test_cases_first_block` does not count the first-party workflow's inactive
up-front test list as an executable test block. `tcr_refactor_steps` counts only
explicit TCRDD protocol executions; it does not claim that the controls
performed no structural cleanup.

## F-1.7.1 — Every method delivers complete correctness

All six workflows completed within budget, passed their internal suites, and
scored 1.00 on Correctness (external) in every replicate.

| Workflow | n | Correctness (external) | Correctness (internal) | Completed within budget |
|---|---:|---:|---:|---:|
| Basic TDD | 5 | 1.00 ± 0.00 | 100% | 100% |
| SOL Predictive TDD | 5 | 1.00 ± 0.00 | 100% | 100% |
| First-party EXACT TCR | 5 | 1.00 ± 0.00 | 100% | 100% |
| Classic TCR | 5 | 1.00 ± 0.00 | 100% | 100% |
| Native-Git TCRDD | 5 | 1.00 ± 0.00 | 100% | 100% |
| git-gamble TCRDD | 5 | 1.00 ± 0.00 | 100% | 100% |

On this model and kata, neither added TDD structure nor commit/revert discipline
changes final behavior. The discriminating outcomes are process, structure, and
efficiency rather than correctness.

## F-1.7.2 — TCRDD makes RED verification and refactoring explicit

All three TCRDD variants closely coupled test blocks to verified RED states and
executed explicit refactor phases. First-party EXACT TCR produced substantially
more verified RED states than either external implementation.

| Workflow | Test blocks | Verified RED | Unverified RED | Explicit TCRDD refactor steps |
|---|---:|---:|---:|---:|
| Basic TDD | 3.8 ± 0.8 | 2.8 ± 1.3 | 1.0 ± 0.7 | 0.0 ± 0.0 |
| SOL Predictive TDD | 25.2 ± 8.7 | 9.8 ± 7.3 | 15.4 ± 2.3 | 0.0 ± 0.0 |
| First-party EXACT TCR | 37.0 ± 1.6 | 36.8 ± 1.8 | 0.2 ± 0.4 | 5.6 ± 4.2 |
| Classic TCR | 7.8 ± 2.5 | 6.2 ± 3.1 | 1.6 ± 3.1 | 0.0 ± 0.0 |
| Native-Git TCRDD | 17.2 ± 1.9 | 17.2 ± 1.9 | 0.0 ± 0.0 | 6.6 ± 2.6 |
| git-gamble TCRDD | 12.2 ± 3.6 | 12.2 ± 3.6 | 0.0 ± 0.0 | 2.8 ± 0.8 |

The near-zero unverified result across all three implementations points to
TCRDD phase semantics rather than specifically to one enforcement tool. The
first-party workflow's complete inactive test list leads to 35–39 verified RED
states per run, over twice the external native-Git mean. Its explicit refactor
count is variable, while both external TCRDD arms enter their prescribed
refactor phase consistently. Zeroes in the other arms mean “no explicit TCRDD
refactor command,” not “no refactoring.” Classic TCR is not expected to begin
changes with RED and is not ranked by that criterion.

## F-1.7.3 — Structured methods improve different aspects of code shape at high cost

SOL Predictive TDD has the strongest function decomposition, while first-party
EXACT TCR has the lowest measured cognitive and McCabe complexity. Native-Git
external TCRDD minimizes Code Mass (APP). Basic TDD and Classic TCR are cheaper
but structurally weaker on most measures.

| Workflow | `cc_avg_loc_per_function` | Complexity Peak (`cc_longest_function`) | `cognitive_max` | `mccabe_max` | Code Mass (APP) |
|---|---:|---:|---:|---:|---:|
| Basic TDD | 7.29 ± 1.23 | 20.2 ± 3.3 | 6.6 ± 2.1 | 8.4 ± 3.6 | 770.2 ± 73.7 |
| SOL Predictive TDD | 6.80 ± 0.39 | 16.2 ± 1.3 | 4.0 ± 1.2 | 4.8 ± 1.3 | 574.2 ± 34.3 |
| First-party EXACT TCR | 8.00 ± 2.13 | 18.2 ± 6.9 | 3.2 ± 0.8 | 4.0 ± 0.7 | 553.6 ± 29.1 |
| Classic TCR | 8.00 ± 1.14 | 22.0 ± 6.4 | 6.8 ± 0.8 | 7.4 ± 1.1 | 819.2 ± 58.8 |
| Native-Git TCRDD | 9.81 ± 2.85 | 18.6 ± 2.6 | 5.4 ± 1.5 | 5.6 ± 0.9 | 505.0 ± 60.3 |
| git-gamble TCRDD | 8.31 ± 1.35 | 17.4 ± 1.7 | 6.2 ± 1.8 | 6.2 ± 0.4 | 556.6 ± 24.3 |

Those structural outcomes require substantially different resources. Basic TDD
needs 278 seconds and 0.34 M tokens per run; Classic TCR needs 460 seconds and
0.75 M tokens; git-gamble TCRDD needs 558 seconds and 1.71 M tokens; Native-Git
external TCRDD needs 708 seconds and 2.32 M tokens; first-party EXACT TCR needs
1082 seconds and 6.29 M tokens; and SOL Predictive TDD needs 1388 seconds and
5.48 M tokens. The first-party workflow is therefore faster than the SOL
control but consumes the most tokens, while both are far more resource-intensive
than Basic TDD.

## F-1.7.4 — Composition and tooling determine the audit trail

The three TCRDD cells all preserve complete product correctness, but represent
their process differently in final Git history.

| Workflow | Explicit TCRDD refactor steps | Retained method commits | Retained RED | Retained GREEN | Retained refactor commits |
|---|---:|---:|---:|---:|---:|
| First-party EXACT TCR | 5.6 ± 4.2 | 58.8 ± 7.7 | 17.2 ± 3.0 | 35.4 ± 2.0 | 5.2 ± 3.4 |
| Native-Git TCRDD | 6.6 ± 2.6 | 1.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| git-gamble TCRDD | 2.8 ± 0.8 | 24.8 ± 6.4 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |

First-party EXACT TCR retains a phase-labelled history with 48–67 method commits.
The one Native-Git external TCRDD commit is prescribed final squashing, not
evidence that its phase loop was skipped: tool events show 3–9 explicit
refactor steps and exported reflogs retain intermediate activity. Conversely,
git-gamble leaves 17–32 method commits visible while executing 2–4 explicit
refactor steps; expected-RED amendments mean its final subjects are not classified
as retained RED/GREEN/refactor commits by the history metric. Auditability must
therefore be assessed against each composition's intended representation rather
than by comparing final commit counts as a universal adherence score.
