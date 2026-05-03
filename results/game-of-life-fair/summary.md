# Aggregation: game-of-life-fair

_Fairer Workflow-Vergleich auf game-of-life. v1+v2 mit prose (kein Test-Beispiel-Hint), v3+v4+v5 mit example-mapping (Beispiele als Test-Spec — TDD-Idealbedingung). Modell opus-4-7-no-thinking (deutlichster Workflow-Effekt aus game-of-life-stability). n=3 pro Zelle. Generiert von batch-plans/generators/game-of-life-fair.py._

Generated: 2026-05-03T21:44:11Z

Plan triples: 15 · matched runs: 15

## Run status overview

| metric | count |
|---|---|
| total runs | 15 |
| exit_code=0 | 15 |
| exit_code≠0 | 0 |
| rate_limited=true | 0 |
| tests_passing=true | 15 |
| tests_passing=false | 0 |
| tests_passing missing | 0 |

## Kata: game-of-life-example-mapping

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 49.7 | 47.0 | 52.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 686.3 | 659.0 | 740.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 353.3 | 338.0 | 377.0 |

### Core metrics — Total tokens (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 596361.3 | 565603.0 | 654442.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 2487662.3 | 2353934.0 | 2722502.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 9178612.7 | 7803774.0 | 10773096.0 |

### Core metrics — Context utilization % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 23.0 | 23.0 | 23.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 36.7 | 36.0 | 37.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 56.7 | 51.0 | 60.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 40.3 | 34.0 | 53.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 41.0 | 33.0 | 49.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 35.7 | 31.0 | 39.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 159.0 | 141.0 | 176.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 183.0 | 158.0 | 209.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 151.3 | 146.0 | 155.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 104.0 | 69.0 | 136.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 41.0 | 41.0 | 41.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 59.0 | 42.0 | 92.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 10.7 | 10.0 | 11.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 8.7 | 8.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 8.0 | 8.0 | 8.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 8.7 | 8.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 8.0 | 8.0 | 8.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 6.7 | 4.0 | 8.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0 | 0 | 0% |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 15 | 16 | 94% |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 47 | 48 | 98% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 5.7 | 5.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 1.3 | 0.0 | 4.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 3.3 | 2.9 | 4.1 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 28.9 | 25.3 | 35.7 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 20.3 | 19.1 | 21.5 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 2.7 | 2.3 | 2.9 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 20.1 | 18.5 | 22.1 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 11.1 | 7.3 | 15.9 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 42.9 | 41.9 | 43.8 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 15.4 | 12.4 | 19.1 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 31.3 | 28.0 | 38.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 32.0 | 25.0 | 39.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 30.0 | 26.0 | 33.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 6.7 | 4.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 3.3 | 3.0 | 4.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 31.0 | 24.0 | 44.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 12.7 | 8.0 | 21.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 13.7 | 2.0 | 21.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 13.0 | 10.0 | 16.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 4.3 | 2.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 5.0 | 2.0 | 7.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 4.0 | 2.0 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 2.3 | 2.0 | 3.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 2.3 | 2.0 | 3.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 1.3 | 0.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |

## Kata: game-of-life-prose

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 3 | 100% |
| v2-iterative | opus-4-7-no-thinking | 3 | 3 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 48.7 | 46.0 | 51.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 53.7 | 44.0 | 59.0 |

### Core metrics — Total tokens (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 522841.0 | 463516.0 | 553660.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 567400.0 | 508503.0 | 640668.0 |

### Core metrics — Context utilization % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 22.0 | 22.0 | 22.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 22.3 | 22.0 | 23.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 41.0 | 38.0 | 45.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 42.7 | 40.0 | 45.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 163.7 | 157.0 | 175.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 165.0 | 155.0 | 175.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 98.7 | 92.0 | 108.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 105.0 | 99.0 | 115.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 11.7 | 10.0 | 13.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 11.7 | 10.0 | 13.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 1.0 | 1.0 | 1.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 1.0 | 1.0 | 1.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0 | 0 | 0% |
| v2-iterative | opus-4-7-no-thinking | 3 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.7 | 0.0 | 1.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.3 | 0.0 | 1.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 1.6 | 0.0 | 2.5 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.9 | 0.0 | 2.8 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.7 | 0.0 | 2.2 |
| v2-iterative | opus-4-7-no-thinking | 3 | 2.0 | 0.0 | 6.1 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 33.7 | 31.0 | 37.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 35.0 | 33.0 | 37.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 3.0 | 3.0 | 3.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 3.0 | 3.0 | 3.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 28.3 | 25.0 | 31.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 29.0 | 28.0 | 31.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 11.0 | 10.0 | 12.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 11.3 | 11.0 | 12.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 4.0 | 2.0 | 6.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 5.3 | 5.0 | 6.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 2.3 | 2.0 | 3.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 3.0 | 3.0 | 3.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 1.3 | 0.0 | 2.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 1.3 | 1.0 | 2.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |

## Cross-kata averages (sanity check only — do NOT compare across katas with different complexity)

> The tables below mix katas of very different size and structure
> (string-calculator: ~3 LoC, no smell room; game-of-life: ~40 LoC,
> high smell room). Means here can swing wildly when the kata mix
> changes. For workflow×model comparisons, use the per-kata blocks
> above.

## Tests passing rate (workflow × model, all katas)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 3 | 100% |
| v2-iterative | opus-4-7-no-thinking | 3 | 3 | 100% |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | 100% |

## Duration seconds (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 48.7 | 46.0 | 51.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 53.7 | 44.0 | 59.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 49.7 | 47.0 | 52.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 686.3 | 659.0 | 740.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 353.3 | 338.0 | 377.0 |

## Lines of code (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 41.0 | 38.0 | 45.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 42.7 | 40.0 | 45.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 40.3 | 34.0 | 53.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 41.0 | 33.0 | 49.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 35.7 | 31.0 | 39.0 |

## Code mass (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 163.7 | 157.0 | 175.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 165.0 | 155.0 | 175.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 159.0 | 141.0 | 176.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 183.0 | 158.0 | 209.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 151.3 | 146.0 | 155.0 |

## Coverage statements % (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |

## Coverage branches % (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |

## Test lines (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 98.7 | 92.0 | 108.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 105.0 | 99.0 | 115.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 104.0 | 69.0 | 136.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 41.0 | 41.0 | 41.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 59.0 | 42.0 | 92.0 |

## Tests total (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 11.7 | 10.0 | 13.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 11.7 | 10.0 | 13.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 10.7 | 10.0 | 11.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 8.7 | 8.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 8.0 | 8.0 | 8.0 |

## Todos remaining (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |

## Tests passing rate (workflow × kata, all models)

| workflow | kata | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 3 | 3 | 100% |
| v2-iterative | game-of-life-prose | 3 | 3 | 100% |
| v3-basic-tdd | game-of-life-example-mapping | 3 | 3 | 100% |
| v4-exact-subagents | game-of-life-example-mapping | 3 | 3 | 100% |
| v5-exact-single-context | game-of-life-example-mapping | 3 | 3 | 100% |

## Duration seconds (workflow × kata, all models)

| workflow | kata | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 3 | 48.7 | 46.0 | 51.0 |
| v2-iterative | game-of-life-prose | 3 | 53.7 | 44.0 | 59.0 |
| v3-basic-tdd | game-of-life-example-mapping | 3 | 49.7 | 47.0 | 52.0 |
| v4-exact-subagents | game-of-life-example-mapping | 3 | 686.3 | 659.0 | 740.0 |
| v5-exact-single-context | game-of-life-example-mapping | 3 | 353.3 | 338.0 | 377.0 |

## Lines of code (workflow × kata, all models)

| workflow | kata | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 3 | 41.0 | 38.0 | 45.0 |
| v2-iterative | game-of-life-prose | 3 | 42.7 | 40.0 | 45.0 |
| v3-basic-tdd | game-of-life-example-mapping | 3 | 40.3 | 34.0 | 53.0 |
| v4-exact-subagents | game-of-life-example-mapping | 3 | 41.0 | 33.0 | 49.0 |
| v5-exact-single-context | game-of-life-example-mapping | 3 | 35.7 | 31.0 | 39.0 |

## Files

- CSV: `../results/game-of-life-fair/runs.csv`
- Source plan: `batch-plans/game-of-life-fair.json`
- Run dirs: `runs/*`
