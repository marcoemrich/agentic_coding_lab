# Findings — RQ-tcr-ptdd-parity-claim-sol

## Overview

All three Claim Office cells contain five runs. Correctness and completion are
higher = better; function length, cognitive/McCabe complexity, Production LoC,
Code Mass (APP), duration, tokens, and cost are lower = better. Function and
cycle counts describe structure and execution rather than an intrinsically
desirable direction. Quality and efficiency are correctness-gated, and every
cell is eligible. Spread-overlapping rows have no trophy.

| Outcome | TCR + trial | Semantic-only PTDD port | TCR-parity PTDD port |
|---|---:|---:|---:|
| Correctness (external) | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Completed within budget | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| `cc_avg_loc_per_function` ↓ | 5.67 ± 0.69 | 6.61 ± 1.81 | 5.69 ± 0.63 |
| `cc_median_loc_per_function` ↓ | 4.70 ± 0.67 | 6.00 ± 2.67 | 4.20 ± 0.45 |
| Complexity Peak ↓ | 14.2 ± 2.6 | 15.8 ± 2.8 | 16.6 ± 1.3 |
| Functions | 15.4 ± 0.9 | 13.0 ± 2.2 | 15.6 ± 4.3 |
| `cognitive_avg` ↓ | 1.47 ± 0.15 | 1.81 ± 0.48 | 1.83 ± 0.47 |
| `cognitive_max` ↓ | 3.0 ± 0.7 | 3.4 ± 2.1 | 3.6 ± 1.1 |
| `mccabe_avg` ↓ | 1.50 ± 0.11 | 2.02 ± 0.36 | 1.80 ± 0.40 |
| `mccabe_max` ↓ | 4.2 ± 1.6 | 4.6 ± 1.5 | 4.2 ± 0.8 |
| Production LoC ↓ | 153.2 ± 10.1 | 151.8 ± 8.9 | 151.4 ± 15.8 |
| Code Mass (APP) ↓ | 568.4 ± 26.1 | 600.8 ± 43.6 | 564.8 ± 21.0 |
| Test LoC ↓ | 218.4 ± 44.7 | 186.8 ± 27.2 | 206.0 ± 6.6 |
| Smell Total ↓ | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Test blocks | 37.6 ± 2.0 | 21.8 ± 8.3 | 36.6 ± 1.7 |
| Verified RED | 37.4 ± 2.2 | 8.6 ± 7.6 | 33.2 ± 8.6 |
| Method commits | 62.0 ± 9.1 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Duration ↓ | 1440 ± 315 s | 1088 ± 198 s | 1189 ± 93 s |
| Total tokens ↓ | 6.65 M ± 2.50 M | 4.77 M ± 1.36 M | 6.49 M ± 0.88 M |
| Cost ↓ | $4.83 ± $1.72 | $3.65 ± $0.86 | $4.77 ± $0.80 |

## F-1.24.1 — Every transfer preserves complete Claim Office correctness

All 15 runs complete within budget, pass their internal suites, build the CLI,
and pass all 15 external verification scenarios. Neither replacing
commit-or-revert with Predictive TDD nor retaining more of the TCR source context
changes observable product behavior.

| Workflow | n | Correctness (external) | Correctness (internal) | Completed within budget |
|---|---:|---:|---:|---:|
| TCR + trial | 5 | 1.00 ± 0.00 | 100% | 100% |
| Semantic-only PTDD port | 5 | 1.00 ± 0.00 | 100% | 100% |
| TCR-parity PTDD port | 5 | 1.00 ± 0.00 | 100% | 100% |

Correctness therefore remains a gate rather than the differentiating outcome.

## F-1.24.2 — Source-context parity reproduces TCR's average decomposition without method commits

The TCR-parity PTDD port closely matches TCR on the central decomposition and
compactness outcomes. Average function length differs by only 0.02 lines,
function count by 0.2, Production LoC by 1.8, and Code Mass (APP) by 3.6.

| Outcome | TCR + trial | Semantic-only PTDD port | TCR-parity PTDD port |
|---|---:|---:|---:|
| `cc_avg_loc_per_function` | 5.67 ± 0.69 | 6.61 ± 1.81 | 5.69 ± 0.63 |
| `cc_median_loc_per_function` | 4.70 ± 0.67 | 6.00 ± 2.67 | 4.20 ± 0.45 |
| Functions | 15.4 ± 0.9 | 13.0 ± 2.2 | 15.6 ± 4.3 |
| Production LoC | 153.2 ± 10.1 | 151.8 ± 8.9 | 151.4 ± 15.8 |
| Code Mass (APP) | 568.4 ± 26.1 | 600.8 ± 43.6 | 564.8 ± 21.0 |

The parity port produces this shape with zero TCR method commits and no executed
hard-reset phase transition. Commit-or-revert is therefore not necessary for
the average decomposition observed in this experiment. Retaining the complete
inactive-test-list contract, concrete stack guidance, boundary vocabulary,
trial protocol, semantic evidence, marker form, and continuation context is
sufficient to reproduce the TCR point estimates.

The semantic-only port remains directionally coarser and substantially more
variable on average function length and Code Mass (APP), but its wide replicate
spread prevents a separated quality winner. The evidence supports context
transfer as an important mechanism without assigning causality to any single
retained clause.

## F-1.24.3 — TCR retains a small, unresolved complexity and consistency advantage

TCR has the lowest average cognitive and McCabe complexity and the lowest
Complexity Peak. None of those TCR-versus-parity differences exceeds both cell
standard deviations, so the experiment does not establish a residual quality
benefit from commit-or-revert.

| Outcome | TCR + trial | TCR-parity PTDD port |
|---|---:|---:|
| Complexity Peak | 14.2 ± 2.6 | 16.6 ± 1.3 |
| `cognitive_avg` | 1.47 ± 0.15 | 1.83 ± 0.47 |
| `cognitive_max` | 3.0 ± 0.7 | 3.6 ± 1.1 |
| `mccabe_avg` | 1.50 ± 0.11 | 1.80 ± 0.40 |
| `mccabe_max` | 4.2 ± 1.6 | 4.2 ± 0.8 |

TCR also has a tighter function-count range: 14–16 versus 9–20 for the parity
port. The parity port's average function length is nevertheless stable at
5.21–6.78, because its lower-function implementations also contain less
production code. Source inspection finds domain-named boundaries for premium
composition, curse and enchantment risk, loyalty and follow-up adjustments,
policy creation, reimbursement eligibility, damage validation, insured-item
matching, and claim settlement. No candidate introduces unsupported entities,
aggregates, repositories, or architecture layers.

The current evidence therefore supports structural equivalence in the mean, not
identical replicate-level design or proof that the two methods are universally
interchangeable.

## F-1.24.4 — Retained context, not Git persistence, restores TCR-like cycle granularity

The parity port closely reproduces TCR's cycle and test-block counts while
retaining Predictive TDD's uncommitted working-tree representation.

| Process outcome | TCR + trial | Semantic-only PTDD port | TCR-parity PTDD port |
|---|---:|---:|---:|
| Cycles | 36.0 ± 2.4 | 27.2 ± 4.4 | 35.2 ± 1.3 |
| Test blocks | 37.6 ± 2.0 | 21.8 ± 8.3 | 36.6 ± 1.7 |
| Verified RED | 37.4 ± 2.2 | 8.6 ± 7.6 | 33.2 ± 8.6 |
| Unverified RED | 0.2 ± 0.4 | 13.2 ± 0.8 | 3.4 ± 7.6 |
| Prediction accuracy | 99.4% | 96.2% | 98.0% |
| Method commits | 62.0 ± 9.1 | 0.0 ± 0.0 | 0.0 ± 0.0 |

Four parity runs have no unverified RED block; one contains 17 and creates the
entire cell mean and variance. All five runs emit every boundary record type,
although one run omits the outcome and semantic-change records in part of its
cycles. No run executes `git reset --hard` or creates a phase-labelled method
commit. The process contrast is therefore valid, with one replicate-level marker
compliance caveat.

The restored cycle granularity weakens the interpretation that TCR's Git history
itself caused the decomposition. The method bundle still differs in persistence,
check timing, and rollback scope, but the non-Git source context determines much
of how finely SOL partitions the specification.

## F-1.24.5 — Parity adopts TCR's token profile but not a resolved duration penalty

The parity port consumes almost the same tokens and list-price cost as TCR. Its
duration mean is lower, but the difference remains inside TCR's wide replicate
spread.

| Workflow | Duration | Total tokens | Cost |
|---|---:|---:|---:|
| TCR + trial | 1440 ± 315 s | 6.65 M ± 2.50 M | $4.83 ± $1.72 |
| Semantic-only PTDD port | 1088 ± 198 s | 4.77 M ± 1.36 M | $3.65 ± $0.86 |
| TCR-parity PTDD port | 1189 ± 93 s | 6.49 M ± 0.88 M | $4.77 ± $0.80 |

The semantic-only port has lower resource means, but its token and cost
contrasts with TCR remain spread-overlapping because the TCR cell is highly
variable. Source parity therefore appears to carry prose and cycle cost along
with decomposition: removing method commits alone does not recover the leaner
semantic-only port's token profile.
