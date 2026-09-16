# RQ-test-list-dimensions-opus-native — Findings

## Overview

Both cells use `claim-office-example-mapping`, native `opus-5-no-thinking`, and the same single-context PTDD workflow. The only treatment is the v1.6 independent-dimensions cross-check before the test list is declared complete. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

| Outcome | v1.5 test list (n=5) | v1.6 dimensions cross-check (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 0.95 ± 0.12 | **1.00 ± 0.00** 🏆 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 53.4 ± 3.5 | 59.2 ± 5.1 |
| Test LoC | 475.2 ± 151.5 | 661.2 ± 274.4 |
| Mean LoC/function ↓ | 5.38 ± 0.48 | 6.07 ± 1.30 |
| Median LoC/function ↓ | 4.30 ± 0.97 | 5.00 ± 1.46 |
| Complexity Peak ↓ | 17.8 ± 6.14 | 17.2 ± 5.97 |
| Cognitive Complexity peak ↓ | 2.80 ± 0.45 | 2.60 ± 0.55 |
| Cognitive Complexity average ↓ | 1.55 ± 0.19 | 1.43 ± 0.22 |
| McCabe peak ↓ | 3.00 ± 0.00 | 3.20 ± 0.45 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 672.0 ± 26.4 | 733.6 ± 99.1 |
| Production LoC | 244.2 ± 6.3 | 243.4 ± 34.7 |
| Refactor phases | 43.6 ± 15.2 | 56.2 ± 9.1 |
| Prediction accuracy ↑ | 96.1% | **99.5%** 🏆 |
| Duration ↓ | 27.4 ± 11.5 min | **18.6 ± 2.7 min** 🏆 |
| Tokens ↓ | 43.0 ± 33.4 M | **20.1 ± 3.9 M** 🏆 |
| List-price comparison ↓ | $31.88 ± $21.90 | **$15.56 ± $2.54** 🏆 |

Correctness trophies reflect the resolved lower tail: every v1.6 run passes every external scenario, whereas v1.5 contains one internally green run at 0.733. No trophy is awarded for test volume, process counts, Code Mass (APP), or code size because their direction is ambiguous. Static-quality differences remain within the observed spread and therefore receive no trophy. The reported `cycle_count` is omitted because the single-command parser path produced values incompatible with the refactor markers in several v1.6 runs; it is not a valid treatment measure here.

## F-4.10.1 — The dimensions cross-check removes the observed completeness failure

All five v1.6 runs achieve complete Correctness (external), while all internal suites remain green in both cells. The treatment removes the v1.5 lower tail without introducing timeout or completion failures.

| Correctness measure | v1.5 | v1.6 |
|---|---:|---:|
| Mean Correctness (external) | 0.95 ± 0.12 | 1.00 ± 0.00 |
| Minimum Correctness (external) | 0.733 | 1.00 |
| Perfect external runs | 4/5 | 5/5 |
| Internal tests passing | 5/5 | 5/5 |
| Completed within budget | 5/5 | 5/5 |

The v1.5 failure omitted Staff and Potion from the insurance-value catalogue while testing their premiums. No v1.6 implementation reproduces that omission, and every CLI passes all external scenarios. This supports v1.6 as the safer current Opus PTDD variant on Claim Office.

The mechanism is not perfectly compliant in every transcript. One v1.6 run explicitly notes that Staff and Potion insurance values lack direct discriminating tests because no listed cap example exercises them, despite the new command treating independently specified catalogue entries as candidates for separate coverage. Its implementation nevertheless includes both values and passes externally. The outcome therefore validates the revised workflow bundle, but does not establish that explicit matrix tests are the sole causal mechanism.

## F-4.10.2 — Completeness hardening improves rather than consumes efficiency in this sample

The added coverage review does not impose an observable efficiency penalty. v1.6 is faster, uses less than half the mean tokens, halves the list-price comparison, and sharply reduces run-to-run variance.

| Efficiency metric (lower is better) | v1.5 | v1.6 | v1.6 change |
|---|---:|---:|---:|
| Duration | 1642.6 ± 692.4 s | 1114.4 ± 163.5 s | −32% |
| Total tokens | 43.0 ± 33.4 M | 20.1 ± 3.9 M | −53% |
| List-price comparison | $31.88 ± $21.90 | $15.56 ± $2.54 | −51% |

The efficiency shift is larger in stability than in the mean alone. v1.6 stays between 15.2 M and 24.2 M tokens and between $12.25 and $18.27; v1.5 ranges from 10.9 M to 96.2 M and from $9.46 to $65.09. A prompt addition cannot mechanically guarantee lower consumption, so the reduction should be read as observed behavior under n=5 rather than as an intrinsic cost law. It is nevertheless enough to reject the hypothesis that the cross-check necessarily spends away PTDD's price/performance advantage.

## F-4.10.3 — Product shape remains within the prior workflow's spread

The dimensions cross-check changes test planning but produces no resolved static-quality regression. Typical functions are somewhat longer in v1.6, while the Complexity Peak and Cognitive Complexity are flat to slightly lower; all differences overlap the run-level spread.

| Product metric | v1.5 | v1.6 |
|---|---:|---:|
| Mean LoC/function | 5.38 ± 0.48 | 6.07 ± 1.30 |
| Median LoC/function | 4.30 ± 0.97 | 5.00 ± 1.46 |
| Complexity Peak | 17.8 ± 6.14 | 17.2 ± 5.97 |
| Cognitive Complexity peak | 2.80 ± 0.45 | 2.60 ± 0.55 |
| Cognitive Complexity average | 1.55 ± 0.19 | 1.43 ± 0.22 |
| McCabe peak | 3.00 ± 0.00 | 3.20 ± 0.45 |
| Smell Total | 0 | 0 |
| Production LoC | 244.2 ± 6.3 | 243.4 ± 34.7 |
| Code Mass (APP) | 672.0 ± 26.4 | 733.6 ± 99.1 |

The larger v1.6 Code Mass (APP) has broad overlap with its own variance and is not a quality verdict. Production LoC is effectively unchanged, and both cells remain smell-free with low complexity peaks. The treatment therefore acts primarily on completeness and execution behavior rather than imposing a new implementation architecture.

## F-4.10.4 — The cross-check expands test expression without creating a mechanical cross product

v1.6 produces moderately more executable tests and substantially more Test LoC, but test volume varies widely and is not itself the success criterion.

| Test metric | v1.5 | v1.6 | v1.6 change |
|---|---:|---:|---:|
| Executable tests | 53.4 ± 3.5 | 59.2 ± 5.1 | +11% |
| Test LoC | 475.2 ± 151.5 | 661.2 ± 274.4 | +39% |

The increase is consistent with a more explicit coverage review, while the absence of explosive growth is consistent with the instruction to use representative cases where dimensions cannot fail independently. The direct Staff/Potion coverage caveat shows that test count alone cannot demonstrate treatment fidelity. The binding outcome remains the perfect external result across all five v1.6 runs, not the amount of test code produced.
