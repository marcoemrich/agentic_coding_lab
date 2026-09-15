# Findings — RQ-srp-effect-exact-tcr-sol

## Overview

The primary table shows the controlled 2×2 contrast: SOL Predictive TDD versus
first-party EXACT TCR, each with its standard Four-Rules refactor review or the
same domain-boundary trial. Each cell contains five runs. Katas are reported
separately and never averaged. Correctness and completion are higher = better;
function length, cognitive/McCabe complexity, Production LoC, Code Mass (APP),
duration, tokens, and cost are lower = better. Function count is descriptive,
not intrinsically directional. Quality and efficiency are correctness-gated,
and every cell is eligible. Spread-overlapping structural and efficiency rows
have no trophy.

| Kata | Outcome | Predictive TDD | Predictive + trial | TCR | TCR + trial |
|---|---|---:|---:|---:|---:|
| Claim Office | Correctness (external) | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Claim Office | Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Claim Office | Completed within budget | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Claim Office | `cc_avg_loc_per_function` ↓ | 6.80 ± 0.39 | 6.61 ± 1.81 | 8.00 ± 2.13 | 5.67 ± 0.69 |
| Claim Office | Functions | 10.6 ± 2.1 | 13.0 ± 2.2 | 8.2 ± 0.8 | 15.4 ± 0.9 |
| Claim Office | Complexity Peak ↓ | 16.2 ± 1.3 | 15.8 ± 2.8 | 18.2 ± 6.9 | 14.2 ± 2.6 |
| Claim Office | `cognitive_avg` ↓ | 2.25 ± 0.50 | 1.81 ± 0.48 | 1.72 ± 0.12 | 1.47 ± 0.15 |
| Claim Office | `mccabe_avg` ↓ | 1.91 ± 0.24 | 2.02 ± 0.36 | 1.63 ± 0.15 | 1.50 ± 0.11 |
| Claim Office | Production LoC ↓ | 146.0 ± 25.4 | 151.8 ± 8.9 | 129.0 ± 23.4 | 153.2 ± 10.1 |
| Claim Office | Code Mass (APP) ↓ | 574.2 ± 34.3 | 600.8 ± 43.6 | 553.6 ± 29.1 | 568.4 ± 26.1 |
| Claim Office | Duration ↓ | 1388 ± 303 s | 1088 ± 198 s | 1082 ± 141 s | 1440 ± 315 s |
| Claim Office | Total tokens ↓ | 5.48 M ± 1.26 M | 4.77 M ± 1.36 M | 6.29 M ± 0.65 M | 6.65 M ± 2.50 M |
| Claim Office | Cost ↓ | $4.16 ± $0.85 | $3.65 ± $0.86 | $4.54 ± $0.44 | $4.83 ± $1.72 |
| Game of Life | Correctness (external) | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Game of Life | Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Game of Life | Completed within budget | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Game of Life | `cc_avg_loc_per_function` ↓ | 6.62 ± 0.81 | 5.56 ± 1.24 | 7.05 ± 2.34 | 5.63 ± 1.80 |
| Game of Life | Functions | 4.2 ± 1.3 | 6.4 ± 0.9 | 3.2 ± 0.4 | 5.8 ± 1.6 |
| Game of Life | Complexity Peak ↓ | 14.2 ± 3.8 | 12.0 ± 2.8 | 13.8 ± 4.8 | 10.8 ± 4.3 |
| Game of Life | `cognitive_avg` ↓ | 2.77 ± 0.33 | 2.85 ± 1.17 | 3.26 ± 0.72 | 2.35 ± 1.02 |
| Game of Life | `mccabe_avg` ↓ | 1.84 ± 0.17 | 1.62 ± 0.22 | 2.25 ± 0.53 | 1.81 ± 0.40 |
| Game of Life | Production LoC ↓ | 35.2 ± 8.5 | 42.8 ± 5.2 | 28.4 ± 3.6 | 40.6 ± 1.7 |
| Game of Life | Code Mass (APP) ↓ | 166.4 ± 20.4 | 183.4 ± 13.4 | 159.4 ± 9.3 | 165.8 ± 10.3 |
| Game of Life | Duration ↓ | 428 ± 38 s | 494 ± 51 s | 447 ± 86 s | 498 ± 44 s |
| Game of Life | Total tokens ↓ | 1.07 M ± 0.12 M | 1.30 M ± 0.22 M | 1.18 M ± 0.39 M | 1.29 M ± 0.15 M |
| Game of Life | Cost ↓ | $1.16 ± $0.10 | $1.34 ± $0.21 | $1.23 ± $0.38 | $1.42 ± $0.18 |

The qualitative-SRP and domain-review TCR arms remain in the 70-run aggregation
to preserve the mechanism gradient, but the primary overview focuses on the
method × trial contrast.

APP extension contrast:

| Kata | Outcome | TCR + trial | TCR + trial + APP |
|---|---|---:|---:|
| Claim Office | Correctness (external) | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Claim Office | Correctness (internal) | **100%** 🏆 | **100%** 🏆 |
| Claim Office | Completed within budget | **100%** 🏆 | **100%** 🏆 |
| Claim Office | Code Mass (APP) ↓ | 568.4 ± 26.1 | 571.8 ± 29.9 |
| Claim Office | Production LoC ↓ | 153.2 ± 10.1 | **134.8 ± 17.9** 🏆 |
| Claim Office | Functions | 15.4 ± 0.9 | 14.8 ± 2.6 |
| Claim Office | `cc_avg_loc_per_function` ↓ | 5.67 ± 0.69 | 5.54 ± 0.67 |
| Claim Office | Complexity Peak ↓ | 14.2 ± 2.6 | 13.4 ± 3.5 |
| Claim Office | `cognitive_avg` ↓ | 1.47 ± 0.15 | 1.46 ± 0.45 |
| Claim Office | `mccabe_avg` ↓ | 1.50 ± 0.11 | 1.50 ± 0.18 |
| Claim Office | Duration ↓ | 1440 ± 315 s | 1270 ± 342 s |
| Claim Office | Total tokens ↓ | 6.65 M ± 2.50 M | 6.20 M ± 2.45 M |
| Claim Office | Cost ↓ | $4.83 ± $1.72 | $4.57 ± $1.39 |
| Game of Life | Correctness (external) | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Game of Life | Correctness (internal) | **100%** 🏆 | **100%** 🏆 |
| Game of Life | Completed within budget | **100%** 🏆 | **100%** 🏆 |
| Game of Life | Code Mass (APP) ↓ | 165.8 ± 10.3 | 163.2 ± 19.4 |
| Game of Life | Production LoC ↓ | 40.6 ± 1.7 | 36.0 ± 5.1 |
| Game of Life | Functions | 5.8 ± 1.6 | 5.8 ± 1.5 |
| Game of Life | `cc_avg_loc_per_function` ↓ | 5.63 ± 1.80 | 5.19 ± 0.84 |
| Game of Life | Complexity Peak ↓ | 10.8 ± 4.3 | 10.2 ± 2.9 |
| Game of Life | `cognitive_avg` ↓ | 2.35 ± 1.02 | 2.47 ± 1.28 |
| Game of Life | `mccabe_avg` ↓ | 1.81 ± 0.40 | 1.76 ± 0.40 |
| Game of Life | Duration ↓ | 498 ± 44 s | 468 ± 62 s |
| Game of Life | Total tokens ↓ | 1.29 M ± 0.15 M | 1.14 M ± 0.13 M |
| Game of Life | Cost ↓ | $1.42 ± $0.18 | $1.24 ± $0.17 |

## F-1.23.1 — Both methods preserve complete correctness under the boundary trial

All 70 runs across the seven declared workflows completed within budget, passed
their internal suites, built the CLI, and passed all 15 external verification
scenarios. Neither the development method, the boundary trial, nor the
subordinate APP review changes product correctness.

| Kata | Method | Standard | Domain-boundary trial |
|---|---|---:|---:|
| Claim Office | Predictive TDD | 5/5 correct and complete | 5/5 correct and complete |
| Claim Office | TCR | 5/5 correct and complete | 5/5 correct and complete |
| Game of Life | Predictive TDD | 5/5 correct and complete | 5/5 correct and complete |
| Game of Life | TCR | 5/5 correct and complete | 5/5 correct and complete |

The additional TCR + trial + APP cells are also 5/5 correct and complete on each
kata. The Claim Office trial arms also complete comparable amounts of observable
behavior despite different cycle granularity: Predictive TDD records 27.2 ± 4.4
cycles and TCR 36.0 ± 2.4. The distinction is structural and procedural rather
than functional.

## F-1.23.2 — The boundary trial produces a stronger Claim Office response under TCR

On Claim Office, the same semantic intervention interacts differently with the
two methods. Predictive TDD moves from 10.6 to 13.0 functions, but average and
peak function length remain effectively unchanged within replicate spread. TCR
moves from 8.2 to 15.4 functions, reduces average function length from 8.00 to
5.67, and reduces average cognitive complexity from 1.72 to 1.47.

| Method | Treatment | Functions | `cc_avg_loc_per_function` | Complexity Peak | `cognitive_avg` | `mccabe_avg` |
|---|---|---:|---:|---:|---:|---:|
| Predictive TDD | Standard | 10.6 ± 2.1 | 6.80 ± 0.39 | 16.2 ± 1.3 | 2.25 ± 0.50 | 1.91 ± 0.24 |
| Predictive TDD | Trial | 13.0 ± 2.2 | 6.61 ± 1.81 | 15.8 ± 2.8 | 1.81 ± 0.48 | 2.02 ± 0.36 |
| TCR | Standard | 8.2 ± 0.8 | 8.00 ± 2.13 | 18.2 ± 6.9 | 1.72 ± 0.12 | 1.63 ± 0.15 |
| TCR | Trial | 15.4 ± 0.9 | 5.67 ± 0.69 | 14.2 ± 2.6 | 1.47 ± 0.15 | 1.50 ± 0.11 |

The TCR mechanism gradient supports the same interpretation. Qualitative SRP
produces 6.8 ± 1.6 functions, domain analysis without mandatory action produces
8.8 ± 0.4, and the boundary trial produces 15.4 ± 0.9. Semantic instructions
become consistently structural only when the workflow requires a concrete trial
inside TCR's commit-or-revert phase.

This is an interaction finding, not proof that Git commits alone cause the
result: Predictive TDD and TCR also differ in cycle protocol, test activation,
and phase closure. The controlled evidence shows that copying the semantic
review text into Predictive TDD does not reproduce the full TCR response.

## F-1.23.3 — TCR plus the trial is the most consistently decomposed Claim Office arm

With the trial active in both methods, TCR produces 15.4 ± 0.9 functions versus
13.0 ± 2.2 under Predictive TDD and lowers average McCabe complexity from 2.02 ±
0.36 to 1.50 ± 0.11. Its average function length is also numerically lower, but
the 5.67 versus 6.61 difference remains inside the Predictive-TDD arm's wide
spread.

The implementation evidence matches the metrics. Predictive-TDD runs retain
useful boundaries such as `curseRisk`, `enchantmentRisk`, `loyaltyDiscount`,
`followUpDiscount`, `settledPayout`, and `allocateDamages`, but decomposition is
variable: Claim Office outcomes range from 10 to 16 functions and from 5.12 to
9.60 average LoC per function. TCR's trial arm stays between 14 and 16 functions
and 4.64–6.56 average LoC per function.

Production LoC is almost identical between the trial methods—151.8 ± 8.9 for
Predictive TDD and 153.2 ± 10.1 for TCR—so TCR's stronger function count is not
explained by substantially more production code. Code Mass (APP) also overlaps.
No inspected implementation introduces entities, aggregates, repositories, or
architecture layers unsupported by the kata; DDD remains a naming and ownership
anchor.

## F-1.23.4 — On Game of Life, both methods react similarly and no quality winner resolves

The compact kata does not reproduce the Claim Office method interaction. Both
trial arms increase function count and settle at almost identical average
function length: 5.56 under Predictive TDD and 5.63 under TCR. All complexity
differences remain within replicate spread.

| Method | Treatment | Functions | `cc_avg_loc_per_function` | Complexity Peak | Production LoC |
|---|---|---:|---:|---:|---:|
| Predictive TDD | Standard | 4.2 ± 1.3 | 6.62 ± 0.81 | 14.2 ± 3.8 | 35.2 ± 8.5 |
| Predictive TDD | Trial | 6.4 ± 0.9 | 5.56 ± 1.24 | 12.0 ± 2.8 | 42.8 ± 5.2 |
| TCR | Standard | 3.2 ± 0.4 | 7.05 ± 2.34 | 13.8 ± 4.8 | 28.4 ± 3.6 |
| TCR | Trial | 5.8 ± 1.6 | 5.63 ± 1.80 | 10.8 ± 4.3 | 40.6 ± 1.7 |

The added boundaries therefore reveal intent mainly by introducing more named
elements and Production LoC. Game of Life provides too few independently
changing business policies for commit-or-revert to create the differentiated
payoff seen in Claim Office.

## F-1.23.5 — TCR improves auditability but makes the Claim Office trial slower

The process representations remain intentionally different. Predictive TDD
creates no method commits in any run, including when an isolated local Git
repository is available. TCR retains phase-labelled history and almost every
test block has verified RED evidence.

| Kata | Trial method | Test blocks | Verified RED | Unverified RED | Method commits | Refactor commits |
|---|---|---:|---:|---:|---:|---:|
| Claim Office | Predictive TDD | 21.8 ± 8.3 | 8.6 ± 7.6 | 13.2 ± 0.8 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Claim Office | TCR | 37.6 ± 2.0 | 37.4 ± 2.2 | 0.2 ± 0.4 | 62.0 ± 9.1 | 9.4 ± 4.9 |
| Game of Life | Predictive TDD | 11.0 ± 1.0 | 5.0 ± 1.6 | 6.0 ± 1.4 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Game of Life | TCR | 12.4 ± 0.5 | 11.8 ± 0.8 | 0.6 ± 0.5 | 18.8 ± 1.5 | 3.0 ± 1.0 |

Zero refactor commits in Predictive TDD means “no TCR history representation,”
not “no structural refactoring.” Its transcripts and final source demonstrate
retained boundary changes. Every Predictive-TDD trial run contains all six audit
record types and has zero method commits; three of ten runs omit the outcome or
semantic-change record in some cycles, so per-cycle treatment fidelity is not
complete. No tactical-DDD overreach was found.

| Kata | Trial method | Duration | Total tokens | Cost |
|---|---|---:|---:|---:|
| Claim Office | Predictive TDD | 1088 ± 198 s | 4.77 M ± 1.36 M | $3.65 ± $0.86 |
| Claim Office | TCR | 1440 ± 315 s | 6.65 M ± 2.50 M | $4.83 ± $1.72 |
| Game of Life | Predictive TDD | 494 ± 51 s | 1.30 M ± 0.22 M | $1.34 ± $0.21 |
| Game of Life | TCR | 498 ± 44 s | 1.29 M ± 0.15 M | $1.42 ± $0.18 |

On Claim Office, TCR plus the trial is 32% slower than Predictive TDD plus the
trial. Token and cost means point in the same direction but remain
spread-overlapping. On Game of Life, duration and token use are essentially
identical. The practical trade-off is therefore domain-dependent: TCR provides
a more explicit and consistently decomposed Claim Office result, while
Predictive TDD retains useful boundaries faster and without a phase-labelled
history.

## F-1.23.6 — Subordinate APP does not lower Code Mass

Adding the APP review to TCR's domain-boundary trial leaves the externally
measured Code Mass (APP) effectively unchanged on both katas.

| Kata | TCR + trial | TCR + trial + APP | Difference |
|---|---:|---:|---:|
| Claim Office | 568.4 ± 26.1 | 571.8 ± 29.9 | +3.4 (+0.6%) |
| Game of Life | 165.8 ± 10.3 | 163.2 ± 19.4 | −2.6 (−1.6%) |

Both differences are small relative to replicate spread and point in opposite
directions. The APP treatment therefore provides no evidence of a general mass
reduction. This result concerns the common external `code_mass` pipeline
measure; the workflow deliberately uses APP weights directionally rather than
performing complete in-run arithmetic.

## F-1.23.7 — APP subordination preserves domain decomposition and reduces Claim Office Production LoC

The priority guard succeeds at its safety objective. Claim Office function count,
average function length, Complexity Peak, and average cognitive/McCabe complexity
all remain spread-overlapping with the parent boundary-trial arm. Game of Life
also retains the same 5.8-function mean and spread-overlapping complexity.

| Kata | Outcome | TCR + trial | TCR + trial + APP |
|---|---|---:|---:|
| Claim Office | Production LoC | 153.2 ± 10.1 | 134.8 ± 17.9 |
| Claim Office | Functions | 15.4 ± 0.9 | 14.8 ± 2.6 |
| Claim Office | `cc_avg_loc_per_function` | 5.67 ± 0.69 | 5.54 ± 0.67 |
| Claim Office | Complexity Peak | 14.2 ± 2.6 | 13.4 ± 3.5 |
| Claim Office | `cognitive_avg` | 1.47 ± 0.15 | 1.46 ± 0.45 |
| Claim Office | `mccabe_avg` | 1.50 ± 0.11 | 1.50 ± 0.18 |
| Game of Life | Production LoC | 40.6 ± 1.7 | 36.0 ± 5.1 |
| Game of Life | Functions | 5.8 ± 1.6 | 5.8 ± 1.5 |
| Game of Life | `cc_avg_loc_per_function` | 5.63 ± 1.80 | 5.19 ± 0.84 |

Claim Office Production LoC falls by 12%, narrowly exceeding both cell standard
deviations. The APP cell nevertheless ranges from 108 to 157 lines, and the
108-line implementation contributes strongly to that mean; the result is less
consistent than the parent's 141–166 range. Since Code Mass (APP) does not fall,
this is a compactness effect not captured by APP rather than evidence that the
APP objective itself succeeded.

Source inspection finds retained policy names for premium composition, curse and
enchantment risk, customer discounts, policy creation, insured-item matching,
damage reimbursement, and claim settlement. No run collapses all policies into
a monolithic calculation, moves complexity into an adapter or test, or introduces
unsupported tactical-DDD layers.

## F-1.23.8 — The higher-rule guard makes APP mostly inert without a resolved efficiency cost

The transcripts demonstrate active consideration rather than silent omission,
but most APP decisions identify no permissible simplification after Rules 1–3:
44 of 55 Game of Life candidate records and 149 of 163 Claim Office candidate
records are `APP candidate: none`. Concrete retained changes include removing an
unused intermediate binding, removing an unspecified output-order accommodation,
consolidating duplicated test setup, and unifying duplicated premium/value
records. Some of these affect tests or small local mechanics and therefore do not
move production Code Mass (APP).

| Kata | Outcome | TCR + trial | TCR + trial + APP |
|---|---|---:|---:|
| Claim Office | Refactor commits | 9.4 ± 4.9 | 9.2 ± 3.8 |
| Claim Office | Duration | 1440 ± 315 s | 1270 ± 342 s |
| Claim Office | Total tokens | 6.65 M ± 2.50 M | 6.20 M ± 2.45 M |
| Claim Office | Cost | $4.83 ± $1.72 | $4.57 ± $1.39 |
| Game of Life | Refactor commits | 3.0 ± 1.0 | 2.6 ± 0.9 |
| Game of Life | Duration | 498 ± 44 s | 468 ± 62 s |
| Game of Life | Total tokens | 1.29 M ± 0.15 M | 1.14 M ± 0.13 M |
| Game of Life | Cost | $1.42 ± $0.18 | $1.24 ± $0.17 |

Refactoring activity remains stable. Duration, token, and cost means are lower in
the APP arm, but every difference remains within ordinary replicate variation;
there is no resolved efficiency penalty or benefit. The practical outcome is a
successful safety guard and a null APP mechanism: preserving domain boundaries
prevents the known decomposition failure mode, while leaving too few acceptable
mass-reduction moves to improve the target metric.
