# RQ-inline-refactor-operationalization-opus-native — Findings

## Overview

Both cells use `claim-office-example-mapping`, native `opus-5-no-thinking`, and the same single-context PTDD workflow. v1.6.1 adds naming-first review, a mandatory concrete inline refactoring trial, and helper extraction as an explicit option. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

| Outcome | v1.6 (n=5) | v1.6.1 operational trial (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 1.00 ± 0.00 | 0.99 ± 0.03 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Mean LoC/function ↓ | 6.07 ± 1.30 | 6.76 ± 0.59 |
| Median LoC/function ↓ | 5.00 ± 1.46 | 6.20 ± 0.84 |
| Longest function ↓ | 17.2 ± 5.97 | 22.2 ± 3.83 |
| Functions | 26.0 ± 4.74 | 21.8 ± 3.63 |
| Complexity Peak ↓ | 17.2 ± 5.97 | 22.2 ± 3.83 |
| Cognitive Complexity peak ↓ | 2.60 ± 0.55 | 3.00 ± 0.00 |
| McCabe peak ↓ | 3.20 ± 0.45 | 3.60 ± 0.55 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 733.6 ± 99.1 | 686.0 ± 27.0 |
| Production LoC | 243.4 ± 34.7 | 242.2 ± 14.2 |
| Duration ↓ | 18.6 ± 2.7 min | 18.8 ± 4.5 min |
| Tokens ↓ | 20.1 ± 3.9 M | 21.4 ± 10.8 M |
| List-price comparison ↓ | $15.56 ± $2.54 | $15.84 ± $6.40 |

No trophy is awarded: the treatment does not produce a resolved improvement beyond run-level spread. Test volume, function count, Code Mass (APP), Production LoC, and process counts have ambiguous direction. The v1.6.1 external miss also prevents reading its lower Code Mass (APP) as a quality win.

## F-4.11.1 — Inline operationalization does not reproduce the Opus default's decomposition

The naming-first mandatory trial moves every typical-size indicator away from the intended direction. Differences overlap the small-sample spread, but there is no positive decomposition signal.

| Decomposition metric (lower is better) | v1.6 | v1.6.1 |
|---|---:|---:|
| Mean LoC/function | 6.07 ± 1.30 | 6.76 ± 0.59 |
| Median LoC/function | 5.00 ± 1.46 | 6.20 ± 0.84 |
| Longest function | 17.2 ± 5.97 | 22.2 ± 3.83 |
| Functions | 26.0 ± 4.74 | 21.8 ± 3.63 |

The treatment produces fewer rather than more functions, and those functions are longer. Transcript inspection confirms that the model did execute both retained and undone trials, so the null result is not explained by wholly ignoring the prompt. Prompt-level operationalization alone is therefore insufficient to approach the finer decomposition of the isolated-refactor Opus workflow.

## F-4.11.2 — Mandatory inline trials are cost-neutral but not quality-improving

The two cells have effectively equal duration, token use, and list-price comparison. Avoiding a new subagent context succeeds at containing cost, but the saved architecture does not deliver a product benefit.

| Efficiency metric (lower is better) | v1.6 | v1.6.1 |
|---|---:|---:|
| Duration | 1114.4 ± 163.5 s | 1128.6 ± 269.7 s |
| Total tokens | 20.1 ± 3.9 M | 21.4 ± 10.8 M |
| List-price comparison | $15.56 ± $2.54 | $15.84 ± $6.40 |

Production LoC is also tied at 243.4 against 242.2, and both cells have zero Smell Total. Complexity indicators lean against v1.6.1: Complexity Peak rises from 17.2 to 22.2, Cognitive Complexity peak from 2.60 to 3.00, and McCabe peak from 3.20 to 3.60. None resolves beyond the observed spread, but none supports promotion.

## F-4.11.3 — The treatment does not preserve the v1.6 correctness floor

All internal suites pass, but one v1.6.1 run misses an external family scenario and scores 0.933; all five v1.6 runs remain externally complete.

| Correctness measure | v1.6 | v1.6.1 |
|---|---:|---:|
| Mean Correctness (external) | 1.00 ± 0.00 | 0.99 ± 0.03 |
| Perfect external runs | 5/5 | 4/5 |
| Internal tests passing | 5/5 | 5/5 |
| Completed within budget | 5/5 | 5/5 |

The difference is one scenario in one run and is not enough to claim that the refactoring prompt causes correctness loss. It is enough to fail the predeclared promotion rule: v1.6.1 neither preserves the perfect observed floor nor improves decomposition. v1.6 remains the preferred Opus PTDD variant.
