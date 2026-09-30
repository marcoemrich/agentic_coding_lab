# Findings — RQ-tcr-ptdd-parity-claim-sol

## Overview

The TCR and semantic-only cells contain five runs each. The TCR-parity cell
pools ten: this RQ's five runs from 2026-09-15 and five runs of the same
workflow, kata, model and route from the 2026-09-16 batch of
RQ-test-list-dimensions-sol-pi, where `exact-sol-v1.5-tcr-parity-domain-trial-pi`
is the control arm. Correctness and completion are
higher = better; function length, cognitive/McCabe complexity, Production LoC,
Code Mass (APP), duration, tokens, and cost are lower = better. Function and
cycle counts describe structure and execution rather than an intrinsically
desirable direction. Quality and efficiency are correctness-gated, and every
cell is eligible. A trophy requires the winner to separate from every other
cell by more than both cell standard deviations; spread-overlapping rows have
no trophy.

| Outcome | TCR + trial | Semantic-only PTDD port | TCR-parity PTDD port |
|---|---:|---:|---:|
| Correctness (external) | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Completed within budget | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| `cc_avg_loc_per_function` ↓ | 5.67 ± 0.69 | 6.61 ± 1.81 | 5.72 ± 0.52 |
| `cc_median_loc_per_function` ↓ | 4.70 ± 0.67 | 6.00 ± 2.67 | 4.35 ± 0.58 |
| `cc_longest_function` ↓ | 14.2 ± 2.6 | 15.8 ± 2.8 | 16.8 ± 1.7 |
| Functions | 15.4 ± 0.9 | 13.0 ± 2.2 | 15.3 ± 4.0 |
| `cognitive_avg` ↓ | 1.47 ± 0.15 | 1.81 ± 0.48 | 1.87 ± 0.48 |
| `cognitive_max` ↓ | 3.0 ± 0.7 | 3.4 ± 2.1 | 3.7 ± 1.0 |
| `mccabe_avg` ↓ | **1.50 ± 0.11** 🏆 | 2.02 ± 0.36 | 1.85 ± 0.31 |
| `mccabe_max` ↓ | 4.2 ± 1.6 | 4.6 ± 1.5 | 4.3 ± 1.2 |
| Production LoC ↓ | 153.2 ± 10.1 | 151.8 ± 8.9 | 150.2 ± 27.2 |
| Code Mass (APP) ↓ | 568.4 ± 26.1 | 600.8 ± 43.6 | 578.2 ± 35.7 |
| Test LoC ↓ | 218.4 ± 44.7 | 186.8 ± 27.2 | 218.3 ± 47.8 |
| Smell Total ↓ | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Test blocks | 37.6 ± 2.0 | 21.8 ± 8.3 | 34.8 ± 9.3 |
| Verified RED | 37.4 ± 2.2 | 8.6 ± 7.6 | 32.6 ± 11.6 |
| Method commits | 62.0 ± 9.1 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Duration ↓ | 1440 ± 315 s | 1088 ± 198 s | 1263 ± 351 s |
| Total tokens ↓ | 6.65 M ± 2.50 M | 4.77 M ± 1.36 M | 6.58 M ± 2.24 M |
| Cost ↓ | $4.83 ± $1.72 | $3.65 ± $0.86 | $4.78 ± $1.43 |

## F-1.24.1 — Every transfer preserves complete Claim Office correctness

All 20 runs complete within budget, pass their internal suites, build the CLI,
and pass all 15 external verification scenarios. Neither replacing
commit-or-revert with Predictive TDD nor retaining more of the TCR source context
changes observable product behavior.

| Workflow | n | Correctness (external) | Correctness (internal) | Completed within budget |
|---|---:|---:|---:|---:|
| TCR + trial | 5 | 1.00 ± 0.00 | 100% | 100% |
| Semantic-only PTDD port | 5 | 1.00 ± 0.00 | 100% | 100% |
| TCR-parity PTDD port | 10 | 1.00 ± 0.00 | 100% | 100% |

Correctness therefore remains a gate rather than the differentiating outcome.

## F-1.24.2 — Source-context parity reproduces TCR's average decomposition without method commits

The TCR-parity PTDD port closely matches TCR on the central decomposition and
compactness outcomes. Average function length differs by only 0.05 lines,
function count by 0.1, Production LoC by 3.0, and Code Mass (APP) by 9.8.

| Outcome | TCR + trial | Semantic-only PTDD port | TCR-parity PTDD port |
|---|---:|---:|---:|
| `cc_avg_loc_per_function` | 5.67 ± 0.69 | 6.61 ± 1.81 | 5.72 ± 0.52 |
| `cc_median_loc_per_function` | 4.70 ± 0.67 | 6.00 ± 2.67 | 4.35 ± 0.58 |
| Functions | 15.4 ± 0.9 | 13.0 ± 2.2 | 15.3 ± 4.0 |
| Production LoC | 153.2 ± 10.1 | 151.8 ± 8.9 | 150.2 ± 27.2 |
| Code Mass (APP) | 568.4 ± 26.1 | 600.8 ± 43.6 | 578.2 ± 35.7 |

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

## F-1.24.3 — TCR retains a small complexity and consistency advantage

TCR has the lowest average cognitive and McCabe complexity and the lowest
`cc_longest_function`. Against the pooled parity cell, the `mccabe_avg` gap (1.50
against 1.85) exceeds both cell standard deviations (0.11 and 0.31), and TCR's
value also separates from the semantic-only port (2.02 ± 0.36). The Complexity
Peak gap (14.2 against 16.8) exceeds both standard deviations only by a margin
below one line and does not separate from the semantic-only port. The
cognitive differences stay inside the parity cell's spread. The advantage is
therefore resolved on average McCabe complexity alone and remains small in
absolute terms.

| Outcome | TCR + trial | TCR-parity PTDD port |
|---|---:|---:|
| `cc_longest_function` | 14.2 ± 2.6 | 16.8 ± 1.7 |
| `cognitive_avg` | 1.47 ± 0.15 | 1.87 ± 0.48 |
| `cognitive_max` | 3.0 ± 0.7 | 3.7 ± 1.0 |
| `mccabe_avg` | **1.50 ± 0.11** 🏆 | 1.85 ± 0.31 |
| `mccabe_max` | 4.2 ± 1.6 | 4.3 ± 1.2 |

TCR also has a tighter function-count range: 14–16 versus 9–22 for the parity
port. The parity port's average function length is nevertheless stable at
5.21–6.78, because its lower-function implementations also contain less
production code. Source inspection of the five 2026-09-15 parity runs finds domain-named boundaries for premium
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
| Cycles | 36.0 ± 2.4 | 27.2 ± 4.4 | 36.0 ± 1.5 |
| Test blocks | 37.6 ± 2.0 | 21.8 ± 8.3 | 34.8 ± 9.3 |
| Verified RED | 37.4 ± 2.2 | 8.6 ± 7.6 | 32.6 ± 11.6 |
| Unverified RED | 0.2 ± 0.4 | 13.2 ± 0.8 | 2.2 ± 5.4 |
| Prediction accuracy | 99.4% | 96.2% | 98.9% |
| Method commits | 62.0 ± 9.1 | 0.0 ± 0.0 | 0.0 ± 0.0 |

Seven of the ten parity runs have no unverified RED block; the others contain
17, 4 and 1, and the run with 17 creates most of the cell mean and variance.
The run with 4 also reports only 9 test blocks against 35 cycles and 34
counted tests, so it concentrates its cases in few blocks; that single run
creates most of the test-block and verified-RED spread. In the five 2026-09-15
runs, every boundary record type is emitted, although one run omits the outcome
and semantic-change records in part of its cycles, and no run executes
`git reset --hard`. None of the ten parity runs creates a phase-labelled method
commit. The process contrast is therefore valid, with two replicate-level
marker caveats.

The restored cycle granularity weakens the interpretation that TCR's Git history
itself caused the decomposition. The method bundle still differs in persistence,
check timing, and rollback scope, but the non-Git source context determines much
of how finely SOL partitions the specification.

## F-1.24.5 — Parity adopts TCR's token profile but not a resolved duration penalty

The parity port consumes almost the same tokens and list-price cost as TCR. Its
duration mean is lower, but the difference remains inside both cells' wide
replicate spreads.

| Workflow | Duration | Total tokens | Cost |
|---|---:|---:|---:|
| TCR + trial | 1440 ± 315 s | 6.65 M ± 2.50 M | $4.83 ± $1.72 |
| Semantic-only PTDD port | 1088 ± 198 s | 4.77 M ± 1.36 M | $3.65 ± $0.86 |
| TCR-parity PTDD port | 1263 ± 351 s | 6.58 M ± 2.24 M | $4.78 ± $1.43 |

The semantic-only port has lower resource means, but its token and cost
contrasts with TCR remain spread-overlapping because the TCR cell is highly
variable. Source parity therefore appears to carry prose and cycle cost along
with decomposition: removing method commits alone does not recover the leaner
semantic-only port's token profile.
