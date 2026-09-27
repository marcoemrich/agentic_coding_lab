# RQ-test-list-dimensions-sol-pi — Findings

## Overview

Both cells use `claim-office-example-mapping` with `gpt-5-6-sol-codex` through pi 0.81.1. v1.6 adds only the independent-dimensions test-list cross-check. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

**Data basis.** Each cell pools every matching run in the pool, n=10 per cell. The v1.5 cell combines this RQ's 2026-09-15 batch with five runs from 2026-09-16 16:24, which also count toward RQ-test-list-dimensions-replication and RQ-tcr-ptdd-parity-claim-sol. The v1.6 cell combines this RQ's 2026-09-16 11:59 batch with five runs from 2026-09-16 16:33–16:54, which also count toward RQ-test-list-dimensions-replication. All runs share the same model, route and harness version.

| Outcome | v1.5 SOL default (n=10) | v1.6 dimensions cross-check (n=10) |
|---|---:|---:|
| Correctness (external) ↑ | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 35.8 ± 1.55 | 42.0 ± 3.59 |
| Test LoC | 218.3 ± 47.8 | 220.6 ± 71.3 |
| Mean LoC/function ↓ | 5.72 ± 0.52 | 6.42 ± 1.24 |
| Median LoC/function ↓ | 4.35 ± 0.58 | 5.30 ± 1.96 |
| Complexity Peak ↓ | 16.8 ± 1.69 | 18.4 ± 2.37 |
| Cognitive Complexity peak ↓ | 3.70 ± 0.95 | 3.90 ± 1.10 |
| McCabe peak ↓ | 4.30 ± 1.16 | 5.00 ± 1.56 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 578.2 ± 35.7 | 633.1 ± 94.7 |
| Production LoC | 150.2 ± 27.2 | 152.4 ± 28.1 |
| Prediction accuracy ↑ | 98.9% (713/721) | 99.6% (809/812) |
| Duration ↓ | 21.1 ± 5.9 min | 24.8 ± 7.9 min |
| Tokens ↓ | 6.58 ± 2.24 M | 6.88 ± 4.14 M |
| List-price comparison ↓ | $4.78 ± $1.43 | $4.76 ± $2.55 |

No trophy is awarded. Correctness is exactly tied, and every quality and efficiency difference stays within the larger cell's standard deviation. Test volume, code size, Code Mass (APP), function count, and process counts have ambiguous direction.

## F-1.8.1 — The dimensions cross-check adds tests without improving SOL correctness

Both workflows pass every external scenario in every Claim Office run. v1.6 nevertheless produces about one sixth more executable tests.

| Correctness and test measure | v1.5 | v1.6 |
|---|---:|---:|
| Mean Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Perfect external runs | 10/10 | 10/10 |
| Internal tests passing | 10/10 | 10/10 |
| Executable tests | 35.8 ± 1.55 | 42.0 ± 3.59 |
| Test LoC | 218.3 ± 47.8 | 220.6 ± 71.3 |

The test-count ranges do not overlap (34–38 against 39–48), so the independent-dimensions review is reliably visible in test selection. Test LoC does not follow it. The source SOL workflow already covers the external specification completely; more tests are mechanism evidence rather than an outcome win, and no omitted behavior is recovered in this sample.

## F-1.8.2 — The added review has no established efficiency cost

The efficiency means sit close together, and the v1.6 spread is too broad to establish a penalty.

| Efficiency metric (lower is better) | v1.5 | v1.6 | v1.6 mean change |
|---|---:|---:|---:|
| Duration | 1263.4 ± 351.0 s | 1486.0 ± 476.7 s | +18% |
| Total tokens | 6.58 ± 2.24 M | 6.88 ± 4.14 M | +4% |
| List-price comparison | $4.78 ± $1.43 | $4.76 ± $2.55 | 0% |

Only duration keeps a visible direction against v1.6. The token and cost means are distorted by one v1.6 run (2026-09-16 16:51) that records 0.77 M tokens and $0.46 over 1571 seconds and 39 cycles, far below every other run of similar length. Without it, v1.6 reaches 7.55 M tokens and $5.24 (n=9), 15% and 10% above v1.5 — a small unfavorable direction, still inside the spread. Both cells also contain short, cheap runs (v1.5: 495 s at 1.09 M tokens; v1.6: 637 s at 1.18 M tokens), so run length varies more than the workflow difference.

The decision result does not depend on the efficiency reading: v1.6 supplies no correctness gain, so there is nothing to trade against even a small cost. v1.5 remains the better-supported SOL/pi default on Claim Office.

## F-1.8.3 — Product quality remains broadly tied

The v1.6 product has slightly longer functions and slightly higher peak metrics, but every difference stays within the observed spread and both cells are smell-free.

| Product metric | v1.5 | v1.6 |
|---|---:|---:|
| Mean LoC/function | 5.72 ± 0.52 | 6.42 ± 1.24 |
| Median LoC/function | 4.35 ± 0.58 | 5.30 ± 1.96 |
| Complexity Peak | 16.8 ± 1.69 | 18.4 ± 2.37 |
| Cognitive Complexity peak | 3.70 ± 0.95 | 3.90 ± 1.10 |
| McCabe peak | 4.30 ± 1.16 | 5.00 ± 1.56 |
| Smell Total | 0 | 0 |
| Production LoC | 150.2 ± 27.2 | 152.4 ± 28.1 |
| Code Mass (APP) | 578.2 ± 35.7 | 633.1 ± 94.7 |

No quality measure provides a reason to prefer v1.6. The result is model-specific: it does not contradict the native-Opus finding (RQ-test-list-dimensions-opus-native), where v1.6 removed the catalogue-omission failure and raised the share of perfect external runs.
