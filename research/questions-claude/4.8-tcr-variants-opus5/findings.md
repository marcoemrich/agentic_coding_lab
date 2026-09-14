# Findings — RQ-tcr-variants-opus5

## Overview

All cells are correctness-complete enough for quality and efficiency comparison (`verification_pct ≥ 0.90`). Direction: correctness **higher = better**; complexity, Code Mass (APP), duration, tokens, and cost **lower = better**. Ties within the observed spread share trophies. Process and Git-history metrics are descriptive rather than intrinsically directional, so they receive no trophies.

| Outcome | EXACT Coding | Classic TCR | Native-Git TCRDD | git-gamble TCRDD |
|---|---:|---:|---:|---:|
| Correctness (external) | 0.967 ± 0.039 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Completed within budget | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Test blocks | 50.0 ± 1.4 | 8.2 ± 3.7 | 28.0 ± 8.0 | 26.3 ± 1.7 |
| Test cases total | 50.5 ± 1.3 | 35.8 ± 16.7 | 44.2 ± 9.8 | 29.8 ± 5.7 |
| Test cases in first block | 1.0 ± 0.0 | 2.8 ± 0.4 | 1.0 ± 0.0 | 1.0 ± 0.0 |
| Verified RED | 50.0 ± 1.4 | 8.0 ± 3.4 | 28.0 ± 8.0 | 25.8 ± 1.7 |
| Unverified RED | 0.0 ± 0.0 | 0.2 ± 0.4 | 0.0 ± 0.0 | 0.5 ± 0.6 |
| Explicit TCRDD refactor steps | 0.0 ± 0.0 | 0.0 ± 0.0 | 4.2 ± 1.6 | 0.5 ± 1.0 |
| TCR method commits | 0.0 ± 0.0 | 11.0 ± 2.3 | 38.2 ± 34.1 | 35.0 ± 11.1 |
| Retained RED commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 15.6 ± 14.3 | 0.0 ± 0.0 |
| Retained GREEN commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 15.6 ± 14.3 | 0.0 ± 0.0 |
| Retained refactor commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 2.8 ± 2.8 | 0.0 ± 0.0 |
| `cc_avg_loc_per_function` ↓ | **3.67 ± 0.30** 🏆 | 8.66 ± 2.33 | 8.60 ± 0.70 | 10.96 ± 2.46 |
| `cc_longest_function` ↓ | **19.0 ± 3.7** 🏆 | **21.4 ± 3.0** 🏆 | **20.6 ± 3.0** 🏆 | 26.3 ± 2.1 |
| `cognitive_max` ↓ | **3.5 ± 1.9** 🏆 | 8.4 ± 0.9 | 6.0 ± 1.4 | 7.0 ± 1.4 |
| `mccabe_max` ↓ | **3.75 ± 0.96** 🏆 | 6.20 ± 0.45 | 5.60 ± 0.55 | 5.75 ± 0.50 |
| Smell Total ↓ | 0.50 ± 0.58 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.25 ± 0.50 |
| Code Mass (APP) ↓ | 881.5 ± 102.5 | 702.4 ± 53.6 | 643.0 ± 30.2 | **610.8 ± 54.0** 🏆 |
| Duration ↓ | 3653 ± 377 s | **280 ± 50 s** 🏆 | 834 ± 111 s | 685 ± 81 s |
| Total tokens ↓ | 50.0 M ± 1.1 M | **3.9 M ± 1.0 M** 🏆 | 19.8 M ± 3.3 M | 14.9 M ± 2.4 M |
| Cost per run ↓ | $37.71 ± $2.64 | **$3.38 ± $0.70** 🏆 | $13.68 ± $2.28 | $10.52 ± $1.52 |

Valid replicate counts are 4/5/5/4. One infrastructure-invalid EXACT Coding run and one method-invalid git-gamble run are excluded as documented in the RQ README.

## F-4.8.1 — All three TCR variants deliver perfect external correctness

Classic TCR, native-Git TCRDD, and git-gamble TCRDD each reached `verification_pct = 1.00` in every valid run. EXACT Coding remained near-perfect at 0.967 and passed its internal suite in all four valid runs.

| Workflow | n | Correctness (external) | Correctness (internal) |
|---|---:|---:|---:|
| EXACT Coding | 4 | 0.967 ± 0.039 | 100% |
| Classic TCR | 5 | 1.000 ± 0.000 | 100% |
| Native-Git TCRDD | 5 | 1.000 ± 0.000 | 100% |
| git-gamble TCRDD | 4 | 1.000 ± 0.000 | 100% |

The result does not support a correctness penalty from commit/revert discipline on this kata. The small EXACT Coding gap is one missed external scenario across four otherwise complete runs, not an internal-test failure.

## F-4.8.2 — EXACT Coding buys decomposition and lower peak complexity

EXACT Coding produced substantially smaller functions and lower cognitive and McCabe peaks than every TCR arm. The TCR variants were mutually much closer than any was to EXACT Coding on decomposition.

| Workflow | `cc_avg_loc_per_function` | `cc_longest_function` | `cognitive_max` | `mccabe_max` |
|---|---:|---:|---:|---:|
| EXACT Coding | 3.67 ± 0.30 | 19.0 ± 3.7 | 3.5 ± 1.9 | 3.75 ± 0.96 |
| Classic TCR | 8.66 ± 2.33 | 21.4 ± 3.0 | 8.4 ± 0.9 | 6.20 ± 0.45 |
| Native-Git TCRDD | 8.60 ± 0.70 | 20.6 ± 3.0 | 6.0 ± 1.4 | 5.60 ± 0.55 |
| git-gamble TCRDD | 10.96 ± 2.46 | 26.3 ± 2.1 | 7.0 ± 1.4 | 5.75 ± 0.50 |

The clearest separation is average function size: EXACT Coding's 3.67 is less than half the 8.60–10.96 range of the TCR methods. This supports the interpretation that the predictive subagent architecture primarily purchases decomposition rather than correctness.

## F-4.8.3 — Classic TCR is the efficiency winner

Classic TCR completed in 280 seconds with 3.9 M tokens and an estimated list-price cost of $3.38 per run. Native-Git TCRDD and git-gamble TCRDD were intermediate, while EXACT Coding required 3653 seconds, 50.0 M tokens, and $37.71 per run.

| Workflow | Duration | Total tokens | Cost per run |
|---|---:|---:|---:|
| EXACT Coding | 3653 ± 377 s | 50.0 M ± 1.1 M | $37.71 ± $2.64 |
| Classic TCR | 280 ± 50 s | 3.9 M ± 1.0 M | $3.38 ± $0.70 |
| Native-Git TCRDD | 834 ± 111 s | 19.8 M ± 3.3 M | $13.68 ± $2.28 |
| git-gamble TCRDD | 685 ± 81 s | 14.9 M ± 2.4 M | $10.52 ± $1.52 |

Classic TCR is roughly thirteen times faster and uses roughly one-thirteenth of EXACT Coding's tokens while retaining perfect external correctness. The cost figures are Requesty list-price estimates, not invoice amounts. The 18 valid RQ runs total $278.24 by that estimate.

## F-4.8.4 — Native-Git and git-gamble TCRDD differ more in audit representation than product outcome

Both TCRDD implementations reached perfect correctness and generated a similar number of verified RED blocks, but their recorded protocol artifacts differ. Native Git retained explicit RED/GREEN phase commits and more explicit refactor steps; git-gamble's amend-based semantics retained no separate RED commits.

| Workflow | Verified RED | Unverified RED | TCR method commits | Explicit TCRDD refactor steps | Retained RED commits |
|---|---:|---:|---:|---:|---:|
| Native-Git TCRDD | 28.0 ± 8.0 | 0.0 ± 0.0 | 38.2 ± 34.1 | 4.2 ± 1.6 | 15.6 ± 14.3 |
| git-gamble TCRDD | 25.8 ± 1.7 | 0.5 ± 0.6 | 35.0 ± 11.1 | 0.5 ± 1.0 | 0.0 ± 0.0 |

The zero retained RED commits for git-gamble is expected from its history-rewriting semantics and is not evidence that RED was skipped: marker-free analysis observed 25.8 verified RED blocks. Native Git makes phase history more directly visible, whereas git-gamble compresses it into the resulting commit history. The lower explicit refactor-step count for git-gamble nevertheless indicates a behavioral difference beyond history shape and does not support the hypothesis that tool enforcement automatically improves protocol adherence.
