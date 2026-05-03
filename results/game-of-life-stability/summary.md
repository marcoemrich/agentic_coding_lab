# Aggregation: game-of-life-stability

_Game-of-life stability (post-Bereinigung 2026-05-03): nur game-of-life. v3/v4/v5 × 3 Prompt-Stile + v1/v2 nur prose (v1/v2 mit example-mapping/user-story als kontaminiert entfernt: Test-Beispiel-Hints im Prompt verzerren Non-TDD-Workflow-Vergleich). Opus-4.7-no-thinking × 3 Replikate. Generiert von batch-plans/generators/game-of-life-stability.py + post-hoc gefiltert._

Generated: 2026-05-03T20:27:51Z

Plan triples: 33 · matched runs: 33

## Run status overview

| metric | count |
|---|---|
| total runs | 33 |
| exit_code=0 | 33 |
| exit_code≠0 | 0 |
| rate_limited=true | 0 |
| tests_passing=true | 33 |
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
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 48.7 | 46.0 | 51.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 53.7 | 44.0 | 59.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 47.3 | 44.0 | 51.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 737.7 | 533.0 | 889.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 339.7 | 233.0 | 393.0 |

### Core metrics — Total tokens (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 522841.0 | 463516.0 | 553660.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 567400.0 | 508503.0 | 640668.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 538217.7 | 507088.0 | 554328.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 2421409.3 | 2349120.0 | 2458969.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 8248801.3 | 5529623.0 | 10566977.0 |

### Core metrics — Context utilization % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 22.0 | 22.0 | 22.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 22.3 | 22.0 | 23.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 22.0 | 22.0 | 22.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 36.3 | 35.0 | 37.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 54.7 | 44.0 | 62.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 41.0 | 38.0 | 45.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 42.7 | 40.0 | 45.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 44.0 | 37.0 | 53.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 42.0 | 37.0 | 48.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 35.7 | 33.0 | 38.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 163.7 | 157.0 | 175.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 165.0 | 155.0 | 175.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 161.0 | 148.0 | 177.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 169.0 | 153.0 | 197.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 163.7 | 153.0 | 183.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 98.7 | 92.0 | 108.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 105.0 | 99.0 | 115.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 95.7 | 73.0 | 137.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 32.7 | 31.0 | 35.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 47.3 | 39.0 | 56.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 11.7 | 10.0 | 13.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 11.7 | 10.0 | 13.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 11.0 | 11.0 | 11.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 8.3 | 8.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 8.7 | 8.0 | 9.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 1.0 | 1.0 | 1.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 8.3 | 8.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 8.7 | 8.0 | 9.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 5.0 | 3.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 6.7 | 3.0 | 9.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0 | 0 | 0% |
| v2-iterative | opus-4-7-no-thinking | 3 | 0 | 0 | 0% |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0 | 0 | 0% |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 19 | 19 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 34 | 34 | 100% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.7 | 0.0 | 1.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.3 | 0.0 | 1.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 5.7 | 5.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 2.3 | 0.0 | 7.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 1.6 | 0.0 | 2.5 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.9 | 0.0 | 2.8 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 1.8 | 0.0 | 2.7 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 30.1 | 25.3 | 34.3 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 19.6 | 13.9 | 23.6 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.7 | 0.0 | 2.2 |
| v2-iterative | opus-4-7-no-thinking | 3 | 2.0 | 0.0 | 6.1 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 3.3 | 2.5 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 20.9 | 17.2 | 26.8 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 10.5 | 7.9 | 14.8 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 42.0 | 34.0 | 46.2 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 14.0 | 11.4 | 18.0 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 33.7 | 31.0 | 37.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 35.0 | 33.0 | 37.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 35.0 | 30.0 | 42.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 36.0 | 34.0 | 39.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 31.0 | 29.0 | 34.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 3.0 | 3.0 | 3.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 3.0 | 3.0 | 3.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 5.3 | 3.0 | 7.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 3.7 | 2.0 | 5.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 28.3 | 25.0 | 31.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 29.0 | 28.0 | 31.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 28.7 | 22.0 | 33.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 12.3 | 10.0 | 17.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 20.3 | 13.0 | 29.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 11.0 | 10.0 | 12.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 11.3 | 11.0 | 12.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 11.3 | 9.0 | 13.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 6.0 | 5.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 9.3 | 6.0 | 15.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 4.0 | 2.0 | 6.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 5.3 | 5.0 | 6.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 4.3 | 2.0 | 6.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 3.3 | 2.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 3.3 | 2.0 | 5.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 2.3 | 2.0 | 3.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 3.0 | 3.0 | 3.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 2.3 | 2.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 2.3 | 2.0 | 3.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 1.3 | 0.0 | 2.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 1.3 | 1.0 | 2.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 1.0 | 0.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 1.0 | 0.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 1.0 | 0.0 | 3.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |

## Kata: game-of-life-user-story

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 50.7 | 45.0 | 54.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 760.7 | 570.0 | 884.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 372.0 | 311.0 | 422.0 |

### Core metrics — Total tokens (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 569385.0 | 465562.0 | 643517.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 2673573.3 | 2317571.0 | 2867592.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 9209640.3 | 8137368.0 | 9765932.0 |

### Core metrics — Context utilization % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 22.3 | 22.0 | 23.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 38.7 | 35.0 | 41.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 57.7 | 55.0 | 60.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 37.7 | 36.0 | 40.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 35.7 | 31.0 | 39.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 38.3 | 33.0 | 45.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 154.7 | 142.0 | 175.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 149.0 | 119.0 | 166.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 177.7 | 154.0 | 203.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 115.0 | 91.0 | 142.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 40.7 | 29.0 | 59.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 47.3 | 45.0 | 49.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 12.0 | 11.0 | 13.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 8.3 | 8.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 8.0 | 8.0 | 8.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 8.3 | 8.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 7.7 | 7.0 | 8.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 6.3 | 3.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 7.7 | 7.0 | 8.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0 | 0 | 0% |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 18 | 18 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 41 | 41 | 100% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 4.0 | 0.0 | 7.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 2.7 | 0.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 28.0 | 27.7 | 28.2 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 19.5 | 18.6 | 21.2 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 2.6 | 2.3 | 2.9 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 18.0 | 15.6 | 21.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 9.5 | 8.5 | 11.5 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 40.6 | 38.7 | 41.9 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 15.7 | 13.6 | 17.0 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 31.0 | 29.0 | 33.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 29.7 | 28.0 | 33.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 31.0 | 26.0 | 38.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 5.0 | 3.0 | 7.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 6.0 | 4.0 | 8.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 26.3 | 21.0 | 31.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 8.0 | 2.0 | 11.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 13.0 | 10.0 | 17.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 11.7 | 9.0 | 14.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 4.3 | 1.0 | 7.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 4.0 | 3.0 | 5.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 4.0 | 2.0 | 6.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 2.3 | 2.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 3 | 2.3 | 2.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 3 | 2.7 | 2.0 | 3.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v3-basic-tdd | opus-4-7-no-thinking | 3 | 1.0 | 0.0 | 2.0 |
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
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 9 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 9 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 9 | 100% |

## Duration seconds (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 48.7 | 46.0 | 51.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 53.7 | 44.0 | 59.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 49.2 | 44.0 | 54.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 728.2 | 533.0 | 889.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 355.0 | 233.0 | 422.0 |

## Lines of code (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 41.0 | 38.0 | 45.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 42.7 | 40.0 | 45.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 40.7 | 34.0 | 53.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 39.6 | 31.0 | 49.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 36.6 | 31.0 | 45.0 |

## Code mass (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 163.7 | 157.0 | 175.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 165.0 | 155.0 | 175.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 158.2 | 141.0 | 177.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 167.0 | 119.0 | 209.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 164.2 | 146.0 | 203.0 |

## Coverage statements % (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 100.0 | 100.0 | 100.0 |

## Coverage branches % (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 100.0 | 100.0 | 100.0 |

## Test lines (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 98.7 | 92.0 | 108.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 105.0 | 99.0 | 115.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 104.9 | 69.0 | 142.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 38.1 | 29.0 | 59.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 51.2 | 39.0 | 92.0 |

## Tests total (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 11.7 | 10.0 | 13.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 11.7 | 10.0 | 13.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 11.2 | 10.0 | 13.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 8.4 | 8.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 8.2 | 8.0 | 9.0 |

## Todos remaining (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v2-iterative | opus-4-7-no-thinking | 3 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | opus-4-7-no-thinking | 9 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 9 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 9 | 0.0 | 0.0 | 0.0 |

## Tests passing rate (workflow × kata, all models)

| workflow | kata | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 3 | 3 | 100% |
| v2-iterative | game-of-life-prose | 3 | 3 | 100% |
| v3-basic-tdd | game-of-life-example-mapping | 3 | 3 | 100% |
| v3-basic-tdd | game-of-life-prose | 3 | 3 | 100% |
| v3-basic-tdd | game-of-life-user-story | 3 | 3 | 100% |
| v4-exact-subagents | game-of-life-example-mapping | 3 | 3 | 100% |
| v4-exact-subagents | game-of-life-prose | 3 | 3 | 100% |
| v4-exact-subagents | game-of-life-user-story | 3 | 3 | 100% |
| v5-exact-single-context | game-of-life-example-mapping | 3 | 3 | 100% |
| v5-exact-single-context | game-of-life-prose | 3 | 3 | 100% |
| v5-exact-single-context | game-of-life-user-story | 3 | 3 | 100% |

## Duration seconds (workflow × kata, all models)

| workflow | kata | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 3 | 48.7 | 46.0 | 51.0 |
| v2-iterative | game-of-life-prose | 3 | 53.7 | 44.0 | 59.0 |
| v3-basic-tdd | game-of-life-example-mapping | 3 | 49.7 | 47.0 | 52.0 |
| v3-basic-tdd | game-of-life-prose | 3 | 47.3 | 44.0 | 51.0 |
| v3-basic-tdd | game-of-life-user-story | 3 | 50.7 | 45.0 | 54.0 |
| v4-exact-subagents | game-of-life-example-mapping | 3 | 686.3 | 659.0 | 740.0 |
| v4-exact-subagents | game-of-life-prose | 3 | 737.7 | 533.0 | 889.0 |
| v4-exact-subagents | game-of-life-user-story | 3 | 760.7 | 570.0 | 884.0 |
| v5-exact-single-context | game-of-life-example-mapping | 3 | 353.3 | 338.0 | 377.0 |
| v5-exact-single-context | game-of-life-prose | 3 | 339.7 | 233.0 | 393.0 |
| v5-exact-single-context | game-of-life-user-story | 3 | 372.0 | 311.0 | 422.0 |

## Lines of code (workflow × kata, all models)

| workflow | kata | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 3 | 41.0 | 38.0 | 45.0 |
| v2-iterative | game-of-life-prose | 3 | 42.7 | 40.0 | 45.0 |
| v3-basic-tdd | game-of-life-example-mapping | 3 | 40.3 | 34.0 | 53.0 |
| v3-basic-tdd | game-of-life-prose | 3 | 44.0 | 37.0 | 53.0 |
| v3-basic-tdd | game-of-life-user-story | 3 | 37.7 | 36.0 | 40.0 |
| v4-exact-subagents | game-of-life-example-mapping | 3 | 41.0 | 33.0 | 49.0 |
| v4-exact-subagents | game-of-life-prose | 3 | 42.0 | 37.0 | 48.0 |
| v4-exact-subagents | game-of-life-user-story | 3 | 35.7 | 31.0 | 39.0 |
| v5-exact-single-context | game-of-life-example-mapping | 3 | 35.7 | 31.0 | 39.0 |
| v5-exact-single-context | game-of-life-prose | 3 | 35.7 | 33.0 | 38.0 |
| v5-exact-single-context | game-of-life-user-story | 3 | 38.3 | 33.0 | 45.0 |

## Files

- CSV: `../results/game-of-life-stability/runs.csv`
- Source plan: `batch-plans/game-of-life-stability.json`
- Run dirs: `runs/*`
