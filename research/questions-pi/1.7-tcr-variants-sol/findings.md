# Findings — RQ-tcr-variants-sol

## Overview

All cells achieved perfect external and internal correctness. Directions: higher
is better for Correctness and verified RED; lower is better for code-quality,
Code Mass (APP), duration, and token outcomes. Quality and efficiency trophies
are correctness-gated; all five cells are eligible. Explicit refactor steps and
retained commits are descriptive process measures, so they receive no trophy.

| Outcome | Basic TDD | SOL Predictive TDD | Classic TCR | Native-Git TCRDD | git-gamble TCRDD |
|---|---:|---:|---:|---:|---:|
| Correctness (external) | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Verified RED | 2.8 | 9.8 | 6.2 | **17.2** 🏆 | 12.2 |
| Unverified RED | 1.0 | 15.4 | 1.6 | **0.0** 🏆 | **0.0** 🏆 |
| Explicit TCRDD refactor steps | 0.0 | 0.0 | 0.0 | 6.6 | 2.8 |
| `cc_avg_loc_per_function` | 7.29 | **6.80** 🏆 | 8.00 | 9.81 | 8.31 |
| `cc_longest_function` | 20.2 | **16.2** 🏆 | 22.0 | 18.6 | 17.4 |
| Complexity Peak (cognitive) | 6.6 | **4.0** 🏆 | 6.8 | 5.4 | 6.2 |
| Complexity Peak (McCabe) | 8.4 | **4.8** 🏆 | 7.4 | 5.6 | 6.2 |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 |
| Code Mass (APP) | 770.2 | 574.2 | 819.2 | **505.0** 🏆 | 556.6 |
| Duration | **278 s** 🏆 | 1388 s | 460 s | 708 s | 558 s |
| Total tokens | **0.34 M** 🏆 | 5.48 M | 0.75 M | 2.32 M | 1.71 M |
| Retained method commits | 0.0 | 0.0 | 10.4 | 1.0 | 24.8 |

The retained-commit row describes final-history shape, not adherence rank:
Native-Git TCRDD deliberately squashes its phase commits at completion. RED
verification is a TDD construct and is not a fidelity criterion for Classic
TCR. `tcr_refactor_steps` counts only explicit TCRDD protocol executions; it
does not claim that the control workflows performed no structural cleanup.

## F-1.7.1 — Every method delivers complete correctness

All five workflows completed within budget, passed their internal suites, and
scored 1.00 on Correctness (external) in every replicate.

| Workflow | n | Correctness (external) | Correctness (internal) | Completed within budget |
|---|---:|---:|---:|---:|
| Basic TDD | 5 | 1.00 ± 0.00 | 100% | 100% |
| SOL Predictive TDD | 5 | 1.00 ± 0.00 | 100% | 100% |
| Classic TCR | 5 | 1.00 ± 0.00 | 100% | 100% |
| Native-Git TCRDD | 5 | 1.00 ± 0.00 | 100% | 100% |
| git-gamble TCRDD | 5 | 1.00 ± 0.00 | 100% | 100% |

On this model and kata, neither added TDD structure nor commit/revert discipline
changes final behavior. The discriminating outcomes are process, structure, and
efficiency rather than correctness.

## F-1.7.2 — TCRDD makes RED verification and refactoring explicit

Both TCRDD variants recorded no unverified RED blocks and executed explicit
refactor phases. Native-Git TCRDD performed more of both operations than the
git-gamble arm.

| Workflow | Test blocks | Verified RED | Unverified RED | Explicit TCRDD refactor steps |
|---|---:|---:|---:|---:|
| Basic TDD | 3.8 ± 0.8 | 2.8 ± 1.3 | 1.0 ± 0.7 | 0.0 ± 0.0 |
| SOL Predictive TDD | 25.2 ± 8.7 | 9.8 ± 7.3 | 15.4 ± 2.3 | 0.0 ± 0.0 |
| Classic TCR | 7.8 ± 2.5 | 6.2 ± 3.1 | 1.6 ± 3.1 | 0.0 ± 0.0 |
| Native-Git TCRDD | 17.2 ± 1.9 | 17.2 ± 1.9 | 0.0 ± 0.0 | 6.6 ± 2.6 |
| git-gamble TCRDD | 12.2 ± 3.6 | 12.2 ± 3.6 | 0.0 ± 0.0 | 2.8 ± 0.8 |

The matched zero-unverified result across both implementations points to TCRDD
phase semantics rather than specifically to `git-gamble`. The new
`tcr_refactor_steps` metric confirms that both TCRDD arms actually entered their
prescribed refactor phase; Native-Git did so in every run between three and nine
times, and git-gamble between two and four times. Zeroes in the other arms mean
“no explicit TCRDD refactor command,” not “no refactoring.” Classic TCR is not
expected to begin changes with RED and is not ranked by that criterion.

## F-1.7.3 — SOL Predictive TDD buys decomposition at much higher cost

SOL Predictive TDD has the strongest function decomposition and lowest measured
complexity. Basic TDD and Classic TCR are structurally weaker; both TCRDD
variants generally fall between the basic controls and SOL. Native-Git TCRDD
minimizes Code Mass (APP), but not function-level decomposition.

| Workflow | `cc_avg_loc_per_function` | `cc_longest_function` | Complexity Peak (cognitive) | Complexity Peak (McCabe) | Code Mass (APP) |
|---|---:|---:|---:|---:|---:|
| Basic TDD | 7.29 ± 1.23 | 20.2 ± 3.3 | 6.6 ± 2.1 | 8.4 ± 3.6 | 770.2 ± 73.7 |
| SOL Predictive TDD | 6.80 ± 0.39 | 16.2 ± 1.3 | 4.0 ± 1.2 | 4.8 ± 1.3 | 574.2 ± 34.3 |
| Classic TCR | 8.00 ± 1.14 | 22.0 ± 6.4 | 6.8 ± 0.8 | 7.4 ± 1.1 | 819.2 ± 58.8 |
| Native-Git TCRDD | 9.81 ± 2.85 | 18.6 ± 2.6 | 5.4 ± 1.5 | 5.6 ± 0.9 | 505.0 ± 60.3 |
| git-gamble TCRDD | 8.31 ± 1.35 | 17.4 ± 1.7 | 6.2 ± 1.8 | 6.2 ± 0.4 | 556.6 ± 24.3 |

That structural advantage costs 1388 seconds and 5.48 M tokens per SOL-control
run. Basic TDD needs 278 seconds and 0.34 M tokens; Classic TCR needs 460 seconds
and 0.75 M tokens; Native-Git TCRDD needs 708 seconds and 2.32 M tokens; and
git-gamble TCRDD needs 558 seconds and 1.71 M tokens. SOL's additional process
therefore improves decomposition over Basic TDD, but at roughly five times the
duration and sixteen times the tokens.

## F-1.7.4 — Tooling changes audit representation more than product outcomes

The two TCRDD cells are close on correctness, broad structural outcomes, and
completion, but differ in explicit refactor cadence and retained history.

| Workflow | Explicit TCRDD refactor steps | Retained method commits | Duration | Total tokens |
|---|---:|---:|---:|---:|
| Native-Git TCRDD | 6.6 ± 2.6 | 1.0 ± 0.0 | 708 ± 172 s | 2.32 M ± 0.41 M |
| git-gamble TCRDD | 2.8 ± 0.8 | 24.8 ± 6.4 | 558 ± 84 s | 1.71 M ± 0.75 M |

The one native-Git commit is prescribed final squashing, not evidence that its
phase loop was skipped: tool events show 3–9 explicit refactor steps and its
exported reflogs retain the intermediate activity. Conversely, git-gamble leaves
many method commits visible while executing 2–4 explicit refactor steps.
Because git-gamble can amend expected-RED states, final history alone remains an
incomplete adherence measure. The observed tooling effect is chiefly how the
process is represented and how often the agent enters refactoring; no
correctness penalty specific to git-gamble emerges.
