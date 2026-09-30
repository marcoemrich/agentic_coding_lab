# RQ-inline-refactor-operationalization-opus-native — Findings

## Overview

Both cells use `claim-office-example-mapping`, native `opus-5-no-thinking`, and the same single-context PTDD workflow. v1.6.1 adds naming-first review, a mandatory concrete inline refactoring trial, and helper extraction as an explicit option. The v1.6 cell pools two batches from 2026-09-16 (07:18–08:30 and 16:42–16:48, both Claude Code 2.1.267) that it shares with sister RQs on the same workflow × model × kata; the v1.6.1 cell is this RQ's own batch. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

| Outcome | v1.6 (n=10) | v1.6.1 operational trial (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 0.99 ± 0.02 | 0.99 ± 0.03 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Mean LoC/function ↓ | 5.95 ± 0.93 | 6.76 ± 0.59 |
| Median LoC/function ↓ | 4.70 ± 1.27 | 6.20 ± 0.84 |
| Longest function ↓ | 18.9 ± 5.26 | 22.2 ± 3.83 |
| Functions | 25.3 ± 4.42 | 21.8 ± 3.63 |
| `cc_longest_function` ↓ | 18.9 ± 5.26 | 22.2 ± 3.83 |
| `cognitive_max` ↓ | 2.80 ± 0.63 | 3.00 ± 0.00 |
| `mccabe_max` ↓ | 3.30 ± 0.48 | 3.60 ± 0.55 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 714.8 ± 70.1 | 686.0 ± 27.0 |
| Production LoC | 245.7 ± 32.9 | 242.2 ± 14.2 |
| Duration ↓ | 20.1 ± 5.3 min | 18.8 ± 4.5 min |
| Tokens ↓ | 21.4 ± 7.1 M | 21.4 ± 10.8 M |
| List-price comparison ↓ | $16.10 ± $4.28 | $15.84 ± $6.40 |

No trophy is awarded: the treatment does not produce a resolved improvement beyond run-level spread. Test volume, function count, Code Mass (APP), Production LoC, and process counts have ambiguous direction. Correctness is tied (one external miss per cell), so the lower Code Mass (APP) of v1.6.1 comes with longer functions and cannot be read as a quality win.

## F-4.11.1 — Inline operationalization does not reproduce the Opus default's decomposition

The naming-first mandatory trial moves every typical-size indicator away from the intended direction. Differences overlap the small-sample spread, but there is no positive decomposition signal.

| Decomposition metric (lower is better) | v1.6 | v1.6.1 |
|---|---:|---:|
| Mean LoC/function | 5.95 ± 0.93 | 6.76 ± 0.59 |
| Median LoC/function | 4.70 ± 1.27 | 6.20 ± 0.84 |
| Longest function | 18.9 ± 5.26 | 22.2 ± 3.83 |
| Functions | 25.3 ± 4.42 | 21.8 ± 3.63 |

The treatment produces fewer rather than more functions, and those functions are longer. Transcript inspection confirms that the model did execute both retained and undone trials, so the null result is not explained by wholly ignoring the prompt. Prompt-level operationalization alone is therefore insufficient to approach the finer decomposition of the isolated-refactor Opus workflow.

## F-4.11.2 — Mandatory inline trials are cost-neutral but not quality-improving

The two cells have effectively equal duration, token use, and list-price comparison. Avoiding a new subagent context succeeds at containing cost, but the saved architecture does not deliver a product benefit.

| Efficiency metric (lower is better) | v1.6 | v1.6.1 |
|---|---:|---:|
| Duration | 1206.1 ± 318.1 s | 1128.6 ± 269.7 s |
| Total tokens | 21.4 ± 7.1 M | 21.4 ± 10.8 M |
| List-price comparison | $16.10 ± $4.28 | $15.84 ± $6.40 |

Production LoC is also tied at 245.7 against 242.2, and both cells have zero Smell Total. Complexity indicators lean against v1.6.1: `cc_longest_function` rises from 18.9 to 22.2, `cognitive_max` from 2.80 to 3.00, and `mccabe_max` from 3.30 to 3.60. None resolves beyond the observed spread, but none supports promotion.

## F-4.11.3 — Correctness is tied; the promotion fails on decomposition alone

Both cells show the same correctness pattern: every internal suite passes, every run completes within budget, and each cell contains exactly one run that misses one external scenario at 0.933.

| Correctness measure | v1.6 | v1.6.1 |
|---|---:|---:|
| Mean Correctness (external) | 0.99 ± 0.02 | 0.99 ± 0.03 |
| Perfect external runs | 9/10 | 4/5 |
| Internal tests passing | 10/10 | 5/5 |
| Completed within budget | 10/10 | 5/5 |

The treatment neither costs nor buys correctness. The occasional single-scenario miss is a property of the PTDD v1.6 line on this kata, not of the refactoring prompt. The predeclared promotion rule still fails, because v1.6.1 does not improve decomposition (F-4.11.1). v1.6 remains the preferred Opus PTDD variant.
