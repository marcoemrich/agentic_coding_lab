# RQ-test-list-dimensions-multikata-sol-pi — Findings

## Overview

All cells use `gpt-5-6-sol-codex` through pi and the example-mapping prompt. Tables are split by kata so trophies never compare task sizes. Higher is better for Correctness (external); lower is better for decomposition and efficiency metrics.

### Game of Life

| Outcome | v1.5 SOL default (n=5) | v1.6 dimensions cross-check (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 10.6 ± 0.55 | 10.8 ± 0.84 |
| Test LoC | 55.0 ± 6.7 | 58.2 ± 8.5 |
| Mean LoC/function ↓ | 5.55 ± 1.07 | 5.91 ± 1.35 |
| Median LoC/function ↓ | 4.20 ± 0.84 | 4.70 ± 0.97 |
| Complexity Peak ↓ | 10.8 ± 1.92 | 11.8 ± 3.90 |
| Cognitive Complexity peak ↓ | 5.00 ± 2.00 | 4.20 ± 1.64 |
| Smell Total ↓ | 0 | 0 |
| Duration ↓ | 8.5 ± 1.0 min | 8.9 ± 0.8 min |
| Tokens ↓ | 1.03 ± 0.45 M | 1.39 ± 0.25 M |
| List-price comparison ↓ | $1.07 ± $0.49 | $1.36 ± $0.23 |

No Game of Life trophy is awarded because all differences remain within the observed spread and Correctness (external) is exactly tied.

### Sphinx Score

| Outcome | v1.5 SOL default (n=5) | v1.6 dimensions cross-check (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 0.99 ± 0.03 | 0.99 ± 0.03 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 11.8 ± 0.45 | 12.0 ± 1.00 |
| Test LoC | 117.4 ± 8.0 | 118.8 ± 9.8 |
| Mean LoC/function ↓ | 4.71 ± 0.50 | 5.34 ± 0.73 |
| Median LoC/function ↓ | 4.60 ± 1.14 | 5.20 ± 0.84 |
| Complexity Peak ↓ | 7.20 ± 1.64 | 8.20 ± 1.30 |
| Cognitive Complexity peak ↓ | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Smell Total ↓ | 0 | 0 |
| Duration ↓ | 11.9 ± 1.3 min | 10.7 ± 1.0 min |
| Tokens ↓ | 2.25 ± 0.18 M | **1.92 ± 0.28 M** 🏆 |
| List-price comparison ↓ | $2.12 ± $0.15 | $1.86 ± $0.30 |

The Sphinx token trophy marks the only contrast exceeding the standard deviation of both cells. Duration and list-price means point in the same direction but still overlap the observed spread. Test volume, code size, Code Mass (APP), function count, and process counts receive no trophy because their direction is ambiguous.

## F-1.9.1 — The dimensions cross-check produces no multikata correctness advantage on SOL/pi

The workflows tie exactly within each kata. Both complete all Game of Life scenarios; each Sphinx cell contains four perfect runs and one run at 0.9375.

| Kata | v1.5 Correctness (external) | v1.6 Correctness (external) | Perfect runs |
|---|---:|---:|---:|
| Game of Life | 1.00 ± 0.00 | 1.00 ± 0.00 | 5/5 vs. 5/5 |
| Sphinx Score | 0.99 ± 0.03 | 0.99 ± 0.03 | 4/5 vs. 4/5 |

All 20 internal suites pass and all runs complete within budget. The independent-dimensions review therefore fails to reproduce the native-Opus completeness benefit on either additional SOL/pi kata. Combined with the perfect tie on Claim Office, v1.6 has no observed SOL correctness advantage across three katas and 15 runs per workflow.

## F-1.9.2 — v1.6 overhead is kata-dependent rather than systematic

Game of Life means favor v1.5, while Sphinx Score means favor v1.6. Only the Sphinx token contrast resolves beyond both cells' standard deviations.

| Kata | Workflow | Duration | Tokens | List-price comparison |
|---|---|---:|---:|---:|
| Game of Life | v1.5 | 509.0 ± 57.3 s | 1.03 ± 0.45 M | $1.07 ± $0.49 |
| Game of Life | v1.6 | 536.6 ± 48.3 s | 1.39 ± 0.25 M | $1.36 ± $0.23 |
| Sphinx Score | v1.5 | 712.8 ± 78.3 s | 2.25 ± 0.18 M | $2.12 ± $0.15 |
| Sphinx Score | v1.6 | 640.6 ± 61.7 s | 1.92 ± 0.28 M | $1.86 ± $0.30 |

This reverses the broad Claim Office direction, where v1.6 means were higher for all three efficiency measures. The additional review is not a fixed execution surcharge: its effect depends on how the model traverses a specification. Since no SOL correctness benefit accompanies either direction, the multikata evidence does not justify replacing v1.5 as the SOL/pi default.

## F-1.9.3 — Test volume and static product shape remain effectively tied

The cross-check does not create a mechanical test cross product on either small kata. Game of Life gains 0.2 tests on average and Sphinx Score gains 0.2; Test LoC changes by 3.2 and 1.4 respectively.

| Kata | Workflow | Tests | Test LoC | Mean LoC/function | Complexity Peak | Smell Total |
|---|---|---:|---:|---:|---:|---:|
| Game of Life | v1.5 | 10.6 ± 0.55 | 55.0 ± 6.7 | 5.55 ± 1.07 | 10.8 ± 1.92 | 0 |
| Game of Life | v1.6 | 10.8 ± 0.84 | 58.2 ± 8.5 | 5.91 ± 1.35 | 11.8 ± 3.90 | 0 |
| Sphinx Score | v1.5 | 11.8 ± 0.45 | 117.4 ± 8.0 | 4.71 ± 0.50 | 7.20 ± 1.64 | 0 |
| Sphinx Score | v1.6 | 12.0 ± 1.00 | 118.8 ± 9.8 | 5.34 ± 0.73 | 8.20 ± 1.30 | 0 |

Typical function size and Complexity Peak lean modestly toward v1.5 on both katas, but all differences overlap the observed spread. Both workflows remain smell-free. v1.6 therefore neither distorts the small solutions substantially nor earns promotion through better product quality.

## F-1.9.4 — One maintained workflow is not supported by the cross-platform evidence

Across SOL/pi, v1.5 preserves the same observed correctness as v1.6 on Claim Office, Game of Life, and Sphinx Score. Efficiency varies by kata, while no product-quality contrast consistently favors v1.6. On native Opus, by contrast, v1.6 removes a v1.5 external-completeness failure and halves the observed list-price comparison.

The evidence supports model-specific defaults: v1.5 for GPT-5.6 SOL/pi and v1.6 for native Opus/Claude Code. Selecting v1.6 universally would be a maintenance-policy trade rather than an empirically superior SOL configuration.
