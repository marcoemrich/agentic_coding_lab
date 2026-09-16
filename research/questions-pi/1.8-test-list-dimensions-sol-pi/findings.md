# RQ-test-list-dimensions-sol-pi — Findings

## Overview

Both cells use `claim-office-example-mapping` with `gpt-5-6-sol-codex` through pi. v1.6 adds only the independent-dimensions test-list cross-check. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

| Outcome | v1.5 SOL default (n=5) | v1.6 dimensions cross-check (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 35.0 ± 1.0 | 43.8 ± 3.7 |
| Test LoC | 206.0 ± 6.6 | 224.6 ± 86.8 |
| Mean LoC/function ↓ | 5.69 ± 0.63 | 6.10 ± 1.06 |
| Median LoC/function ↓ | 4.20 ± 0.45 | 4.50 ± 1.66 |
| Complexity Peak ↓ | 16.6 ± 1.34 | 17.6 ± 1.52 |
| Cognitive Complexity peak ↓ | 3.60 ± 1.14 | 3.80 ± 1.30 |
| McCabe peak ↓ | 4.20 ± 0.84 | 5.20 ± 1.64 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 564.8 ± 21.0 | 687.0 ± 107.3 |
| Production LoC | 151.4 ± 15.8 | 157.8 ± 30.1 |
| Prediction accuracy ↑ | 98.0% | 100% |
| Duration ↓ | 19.8 ± 1.5 min | 26.7 ± 8.1 min |
| Tokens ↓ | 6.49 ± 0.88 M | 8.51 ± 3.81 M |
| List-price comparison ↓ | $4.77 ± $0.80 | $5.75 ± $2.21 |

No trophy is awarded. Correctness is exactly tied, while quality and efficiency differences overlap the v1.6 run-level spread. Test volume, code size, Code Mass (APP), function count, and process counts have ambiguous direction.

## F-1.8.1 — The dimensions cross-check adds tests without improving SOL correctness

Both workflows pass every external scenario in every Claim Office run. v1.6 nevertheless produces approximately one quarter more executable tests.

| Correctness and test measure | v1.5 | v1.6 |
|---|---:|---:|
| Mean Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Perfect external runs | 5/5 | 5/5 |
| Internal tests passing | 5/5 | 5/5 |
| Executable tests | 35.0 ± 1.0 | 43.8 ± 3.7 |
| Test LoC | 206.0 ± 6.6 | 224.6 ± 86.8 |

The independent-dimensions review is visible in test selection, but the source SOL workflow already covers the external specification completely. More tests are mechanism evidence rather than an outcome win: no omitted behavior is recovered in this sample.

## F-1.8.2 — The added review has an unresolved but unfavorable efficiency direction

Every mean efficiency measure favors v1.5, although v1.6 variance is too broad to establish a stable penalty from n=5 alone.

| Efficiency metric (lower is better) | v1.5 | v1.6 | v1.6 mean change |
|---|---:|---:|---:|
| Duration | 1188.8 ± 92.9 s | 1604.2 ± 486.3 s | +35% |
| Total tokens | 6.49 ± 0.88 M | 8.51 ± 3.81 M | +31% |
| List-price comparison | $4.77 ± $0.80 | $5.75 ± $2.21 | +21% |

The broad v1.6 range includes one unusually short run, so the treatment is not simply a deterministic prompt-length surcharge. The relevant decision result is narrower: v1.6 supplies no correctness gain that would compensate for the unfavorable means. v1.5 therefore remains the better-supported SOL/pi default on Claim Office.

## F-1.8.3 — Product quality remains broadly tied

The v1.6 product is slightly larger and its peak metrics are slightly higher, but differences remain within observed spread and both cells are smell-free.

| Product metric | v1.5 | v1.6 |
|---|---:|---:|
| Mean LoC/function | 5.69 ± 0.63 | 6.10 ± 1.06 |
| Median LoC/function | 4.20 ± 0.45 | 4.50 ± 1.66 |
| Complexity Peak | 16.6 ± 1.34 | 17.6 ± 1.52 |
| Cognitive Complexity peak | 3.60 ± 1.14 | 3.80 ± 1.30 |
| McCabe peak | 4.20 ± 0.84 | 5.20 ± 1.64 |
| Smell Total | 0 | 0 |
| Production LoC | 151.4 ± 15.8 | 157.8 ± 30.1 |
| Code Mass (APP) | 564.8 ± 21.0 | 687.0 ± 107.3 |

No quality measure provides a reason to accept the additional execution cost. The result is model-specific: it does not contradict the native-Opus finding, where v1.6 removed an external completeness failure and reduced cost.
