# RQ-test-list-dimensions-opus-native — Findings

## Overview

Both cells use `claim-office-example-mapping`, native `opus-5-no-thinking`, and the same single-context PTDD workflow. The only treatment is the v1.6 independent-dimensions cross-check before the test list is declared complete. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

Each cell pools two batches of five runs on Claude Code 2.1.267: this RQ's own batch (v1.5 on 2026-09-15, v1.6 on the morning of 2026-09-16) and the replication batch of RQ-test-list-dimensions-replication, which runs the same workflow × model × kata cells (both arms on the afternoon of 2026-09-16).

| Outcome | v1.5 test list (n=10) | v1.6 dimensions cross-check (n=10) |
|---|---:|---:|
| Correctness (external) ↑ | 0.96 ± 0.08 | **0.99 ± 0.02** 🏆 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 52.0 ± 3.2 | 61.2 ± 6.7 |
| Test LoC | 457.0 ± 131.8 | 599.1 ± 258.6 |
| Mean LoC/function ↓ | 5.53 ± 0.65 | 5.95 ± 0.93 |
| Median LoC/function ↓ | 4.55 ± 1.12 | 4.70 ± 1.27 |
| `cc_longest_function` ↓ | 17.7 ± 6.25 | 18.9 ± 5.26 |
| `cognitive_max` ↓ | 2.80 ± 0.63 | 2.80 ± 0.63 |
| `cognitive_avg` ↓ | 1.52 ± 0.21 | 1.47 ± 0.26 |
| `mccabe_max` ↓ | 3.30 ± 0.95 | 3.30 ± 0.48 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 661.7 ± 26.5 | 714.8 ± 70.1 |
| Production LoC | 236.2 ± 22.5 | 245.7 ± 32.9 |
| Refactor phases | 45.0 ± 11.2 | 51.5 ± 13.8 |
| Prediction accuracy ↑ | 97.1% (777/800) | **98.9%** (1033/1044) 🏆 |
| Duration ↓ | 23.9 ± 8.6 min | 20.1 ± 5.3 min |
| Tokens ↓ | 30.4 ± 26.0 M | 21.4 ± 7.1 M |
| List-price comparison ↓ | $23.12 ± $17.33 | $16.10 ± $4.28 |

The correctness trophy reflects the shallower lower tail: v1.6 has one run at 0.933 and nine perfect runs, whereas v1.5 has three imperfect runs down to 0.733. The efficiency means favour v1.6, but every difference lies within the v1.5 standard deviation and is carried by the first v1.5 batch's outliers, so no efficiency trophy is awarded. No trophy is awarded for test volume, process counts, Code Mass (APP), or code size because their direction is ambiguous. Static-quality differences remain within the observed spread and therefore receive no trophy. The reported `cycle_count` is omitted because the single-command parser path produced values incompatible with the refactor markers in several runs; it is not a valid treatment measure here.

## F-4.10.1 — The dimensions cross-check removes the catalogue-omission failure but not every completeness miss

All internal suites remain green in both cells and every run completes within budget. v1.6 reaches full Correctness (external) in nine of ten runs; v1.5 in seven of ten.

| Correctness measure | v1.5 | v1.6 |
|---|---:|---:|
| Mean Correctness (external) | 0.96 ± 0.08 | 0.99 ± 0.02 |
| Minimum Correctness (external) | 0.733 | 0.933 |
| Perfect external runs | 7/10 | 9/10 |
| Internal tests passing | 10/10 | 10/10 |
| Completed within budget | 10/10 | 10/10 |

The imperfect runs fall into two failure modes. The 0.733 v1.5 run omitted Staff and Potion from the insurance-value catalogue while testing their premiums, and its CLI exits with an error on three scenarios. No v1.6 implementation reproduces that omission. The other three misses — two v1.5 runs and one v1.6 run, all from the pooled afternoon batch — each fail only scenario `14-family-steinheim` with a wrong output rather than a crash. The cross-check therefore removes the catalogue omission but does not address the Steinheim reading, which appears in both arms at a similar rate.

The mechanism is not perfectly compliant in every transcript. One v1.6 run explicitly notes that Staff and Potion insurance values lack direct discriminating tests because no listed cap example exercises them, despite the new command treating independently specified catalogue entries as candidates for separate coverage. Its implementation nevertheless includes both values and passes externally. The outcome supports v1.6 as the safer current Opus PTDD variant on Claim Office, but it does not establish that explicit matrix tests are the sole causal mechanism, and it does not make v1.6 complete in every run.

## F-4.10.2 — Completeness hardening costs no efficiency and narrows the run-to-run spread

The added coverage review does not impose an observable efficiency penalty. v1.6 is faster on average, uses fewer tokens and costs less, but the mean differences lie within the v1.5 standard deviation.

| Efficiency metric (lower is better) | v1.5 | v1.6 | v1.6 change |
|---|---:|---:|---:|
| Duration | 1434.6 ± 518.4 s | 1206.1 ± 318.1 s | −16% |
| Total tokens | 30.4 ± 26.0 M | 21.4 ± 7.1 M | −30% |
| List-price comparison | $23.12 ± $17.33 | $16.10 ± $4.28 | −30% |

The shift is larger in stability than in the mean. v1.6 stays between 11.1 M and 34.4 M tokens and between $9.39 and $22.71; v1.5 ranges from 10.9 M to 96.2 M and from $9.46 to $65.09. The v1.5 tail comes from its first batch: its pooled second batch lies between 13.3 M and 21.5 M tokens and $10.95 and $16.80, inside the v1.6 range. A prompt addition cannot mechanically guarantee lower consumption, so the reduction should be read as observed behaviour rather than an intrinsic cost law. It is nevertheless enough to reject the hypothesis that the cross-check necessarily spends away PTDD's price/performance advantage.

## F-4.10.3 — Product shape remains within the prior workflow's spread

The dimensions cross-check changes test planning but produces no resolved static-quality regression. Typical functions are slightly longer in v1.6 and the `cc_longest_function` is slightly higher, while Cognitive Complexity and `mccabe_max`s are tied; all differences overlap the run-level spread.

| Product metric | v1.5 | v1.6 |
|---|---:|---:|
| Mean LoC/function | 5.53 ± 0.65 | 5.95 ± 0.93 |
| Median LoC/function | 4.55 ± 1.12 | 4.70 ± 1.27 |
| `cc_longest_function` | 17.7 ± 6.25 | 18.9 ± 5.26 |
| `cognitive_max` | 2.80 ± 0.63 | 2.80 ± 0.63 |
| `cognitive_avg` | 1.52 ± 0.21 | 1.47 ± 0.26 |
| `mccabe_max` | 3.30 ± 0.95 | 3.30 ± 0.48 |
| Smell Total | 0 | 0 |
| Production LoC | 236.2 ± 22.5 | 245.7 ± 32.9 |
| Code Mass (APP) | 661.7 ± 26.5 | 714.8 ± 70.1 |

The larger v1.6 Code Mass (APP) has broad overlap with its own variance and is not a quality verdict. Production LoC differs by less than one standard deviation, and both cells remain smell-free with low complexity peaks. The treatment therefore acts primarily on completeness and execution behaviour rather than imposing a new implementation architecture.

## F-4.10.4 — The cross-check expands test expression without creating a mechanical cross product

v1.6 produces more executable tests and substantially more Test LoC, but test volume varies widely and is not itself the success criterion.

| Test metric | v1.5 | v1.6 | v1.6 change |
|---|---:|---:|---:|
| Executable tests | 52.0 ± 3.2 | 61.2 ± 6.7 | +18% |
| Test LoC | 457.0 ± 131.8 | 599.1 ± 258.6 | +31% |

The increase is consistent with a more explicit coverage review, while the absence of explosive growth is consistent with the instruction to use representative cases where dimensions cannot fail independently. The direct Staff/Potion coverage caveat shows that test count alone cannot demonstrate treatment fidelity. The binding outcome remains external correctness — nine of ten v1.6 runs perfect and none below 0.933 — not the amount of test code produced.
