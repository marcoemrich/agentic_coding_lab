# RQ-current-ptdd-vs-exact-opus-native — Findings

## Overview

Both cells use `claim-office-example-mapping` with native `opus-5-no-thinking`. Lower is better for decomposition and efficiency metrics; higher is better for Correctness (external). Code Mass (APP) is shown as context without a trophy because lower mass can reflect either parsimony or omitted structure.

| Outcome | `exact-sol-v1.5-tcr-parity-domain-trial-cc` (n=5) | `exact-hybrid-v2-testlist-fix-cc` (n=18) |
|---|---:|---:|
| Correctness (external) ↑ | **0.95 ± 0.12** 🏆 | **0.96 ± 0.03** 🏆 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Mean LoC/function ↓ | 5.38 ± 0.48 | **3.81 ± 0.64** 🏆 |
| Median LoC/function ↓ | 4.30 ± 0.97 | **2.00 ± 0.00** 🏆 |
| Complexity Peak ↓ | 17.8 ± 6.14 | 16.22 ± 5.78 |
| Cognitive Complexity peak ↓ | 2.80 ± 0.45 | 2.78 ± 1.35 |
| Cognitive Complexity average ↓ | 1.55 ± 0.19 | 1.30 ± 0.29 |
| McCabe peak ↓ | 3.00 ± 0.00 | 3.39 ± 0.78 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 672.0 ± 26.42 | 859.5 ± 99.25 |
| Production LoC | 244.2 ± 6.3 | 264.5 ± 37.6 |
| Test LoC | 475.2 ± 151.5 | 765.4 ± 111.9 |
| TDD cycles | 59.6 ± 25.2 | 45.9 ± 4.9 |
| Refactor phases | 43.6 ± 15.2 | 21.3 ± 7.6 |
| Prediction accuracy ↑ | 96.1% | **99.6%** 🏆 |
| Duration ↓ | **27.4 ± 11.5 min** 🏆 | 44.2 ± 7.7 min |
| Tokens ↓ | **43.0 ± 33.4 M** 🏆 | 83.7 ± 16.5 M |
| List-price comparison ↓ | **$31.88 ± $21.90** 🏆 | $49.13 ± $9.15 |

Correctness is statistically indistinguishable at the cell-mean level, so both cells receive the trophy. The PTDD cell remains eligible for quality and efficiency comparison because its mean Correctness (external) is above the 0.90 gate, but its single 0.733 run is treated explicitly in the findings below. No trophy is awarded where the difference is within the observed spread, every cell ties, the metric is ambivalent, or the workflows measure process activity through different execution mechanisms. Production LoC, Test LoC, Code Mass (APP), cycle count, and refactor-phase count are therefore contextual rather than winner metrics.

## F-4.9.1 — The Opus default decomposes more strongly than the transferred PTDD workflow

The default EXACT Coding workflow produces substantially smaller functions than the current SOL PTDD workflow on native Opus 5. The separation is clear in both the mean and median function-size measures, while the Complexity Peak remains within the broad run-level spread.

| Metric (lower is better) | PTDD | Opus default | Difference |
|---|---:|---:|---:|
| Mean LoC/function | 5.38 ± 0.48 | 3.81 ± 0.64 | PTDD +41% |
| Median LoC/function | 4.30 ± 0.97 | 2.00 ± 0.00 | PTDD +115% |
| Complexity Peak | 17.8 ± 6.14 | 16.22 ± 5.78 | PTDD +10% |

The mean-function gap of 1.57 LoC exceeds the standard deviation of either cell, and the median gap is larger still. The near-tie in Complexity Peak means the distinction is distributional: the default consistently creates more small functions rather than merely suppressing the single largest function. The mandatory domain-boundary trial in PTDD therefore does not reproduce the default workflow's finer-grained decomposition when transferred to Opus.

## F-4.9.2 — PTDD trades decomposition for lower runtime and token use

PTDD completes the same kata with approximately half the tokens and substantially less wallclock time than the Opus default. Its list-price comparison is lower on average, but much less predictable.

| Efficiency metric (lower is better) | PTDD | Opus default | PTDD change |
|---|---:|---:|---:|
| Duration | 1642.6 ± 692.4 s | 2650.1 ± 464.9 s | −38% |
| Total tokens | 43.0 ± 33.4 M | 83.7 ± 16.5 M | −49% |
| List-price comparison | $31.88 ± $21.90 | $49.13 ± $9.15 | −35% |

The one-context PTDD workflow avoids the default's repeated isolated-refactor context cost. The gain is not stable per run: PTDD ranges from 10.9 M to 96.2 M tokens and from $9.46 to $65.09, whereas the default has a narrower relative spread. PTDD is therefore cheaper in expectation in this sample, not a deterministic low-cost path.

## F-4.9.3 — Equal mean correctness hides a PTDD completeness failure

The two workflows have nearly identical mean Correctness (external), and every run passes its internal test suite. Their lower tails differ: PTDD has one run at 0.733, while all 18 default runs remain at or above 0.933.

| Correctness measure | PTDD | Opus default |
|---|---:|---:|
| Mean Correctness (external) | 0.95 ± 0.12 | 0.96 ± 0.03 |
| Minimum Correctness (external) | 0.733 | 0.933 |
| Perfect external runs | 4/5 | 7/18 |
| Internal tests passing | 5/5 | 18/18 |
| Completed within budget | 5/5 | 18/18 |

The PTDD outlier is not an infrastructure failure: it completed within budget, built the CLI, and finished with 59 passing internal tests. It omitted externally verified behavior despite an apparently complete local suite. Consequently, the mean supports no correctness winner, but the default has the stronger observed floor and lower correctness variance.

## F-4.9.4 — Complexity peaks tie despite different code mass and test volume

The decomposition difference does not become a broad static-complexity advantage. Both workflows produce zero detected smells, nearly identical Cognitive Complexity peaks, and overlapping McCabe peaks. PTDD emits less production and test code and lower Code Mass (APP), but these quantities do not establish better design on their own.

| Metric | PTDD | Opus default |
|---|---:|---:|
| Cognitive Complexity peak | 2.80 ± 0.45 | 2.78 ± 1.35 |
| Cognitive Complexity average | 1.55 ± 0.19 | 1.30 ± 0.29 |
| McCabe peak | 3.00 ± 0.00 | 3.39 ± 0.78 |
| Smell Total | 0 | 0 |
| Production LoC | 244.2 ± 6.3 | 264.5 ± 37.6 |
| Test LoC | 475.2 ± 151.5 | 765.4 ± 111.9 |
| Code Mass (APP) | 672.0 ± 26.4 | 859.5 ± 99.3 |

PTDD's lower Code Mass (APP), Production LoC, and Test LoC coexist with larger typical functions and one externally incomplete run. The safest interpretation is a smaller implementation and test surface, not an unqualified quality improvement. The default spends additional code and context on finer decomposition and broader test expression without reducing the already-low complexity peaks.
