# Aggregation: smart-subset

_Reduzierte Matrix basierend auf Erkenntnissen aus 235 alten Runs. Fokus: Prompt-Stil-Effekt (-prose/-example-mapping/-user-story) auf 2 Katas, Replikation des v4+thinking-Befunds, Haiku 4.5 als neuer Modell-Tier. v2-iterative nur als Sanity-Check (alte Auswertung zeigt v2 überall am schlechtesten). Generiert von batch-plans/generators/smart-subset.py._

Generated: 2026-05-03T09:39:42Z

Plan triples: 90 · matched runs: 89

## Run status overview

| metric | count |
|---|---|
| total runs | 89 |
| exit_code=0 | 89 |
| exit_code≠0 | 0 |
| rate_limited=true | 0 |
| tests_passing=true | 83 |
| tests_passing=false | 6 |
| tests_passing missing | 0 |

## Kata: game-of-life-prose

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1 | 100% |
| v3-basic-tdd | sonnet-4-6 | 1 | 1 | 100% |
| v4-exact-subagents | haiku-4-5 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 1 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1 | 100% |
| v5-exact-single-context | sonnet-4-6 | 1 | 1 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 38.0 | 38.0 | 38.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 42.0 | 42.0 | 42.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 269.0 | 269.0 | 269.0 |
| v4-exact-subagents | opus-4-7 | 1 | 888.0 | 888.0 | 888.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 889.0 | 889.0 | 889.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 958.0 | 958.0 | 958.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 26.0 | 26.0 | 26.0 |
| v5-exact-single-context | opus-4-7 | 1 | 309.0 | 309.0 | 309.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 233.0 | 233.0 | 233.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 631.0 | 631.0 | 631.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 59.0 | 59.0 | 59.0 |
| v4-exact-subagents | opus-4-7 | 1 | 32.0 | 32.0 | 32.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 41.0 | 41.0 | 41.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 42.0 | 42.0 | 42.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 25.0 | 25.0 | 25.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 33.0 | 33.0 | 33.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 131.0 | 131.0 | 131.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 139.0 | 139.0 | 139.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 174.0 | 174.0 | 174.0 |
| v4-exact-subagents | opus-4-7 | 1 | 137.0 | 137.0 | 137.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 157.0 | 157.0 | 157.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 143.0 | 143.0 | 143.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 113.0 | 113.0 | 113.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 155.0 | 155.0 | 155.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 110.0 | 110.0 | 110.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 72.0 | 72.0 | 72.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 81.0 | 81.0 | 81.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 108.0 | 108.0 | 108.0 |
| v4-exact-subagents | opus-4-7 | 1 | 39.0 | 39.0 | 39.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 35.0 | 35.0 | 35.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 41.0 | 41.0 | 41.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 11.0 | 11.0 | 11.0 |
| v5-exact-single-context | opus-4-7 | 1 | 46.0 | 46.0 | 46.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 56.0 | 56.0 | 56.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 32.0 | 32.0 | 32.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 10.0 | 10.0 | 10.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 10.0 | 10.0 | 10.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 12.0 | 12.0 | 12.0 |
| v4-exact-subagents | opus-4-7 | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 10.0 | 10.0 | 10.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 10.0 | 10.0 | 10.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v3-basic-tdd | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | haiku-4-5 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | opus-4-7 | 1 | 4 | 4 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 5 | 5 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 6 | 7 | 86% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0 | 0 | 0% |
| v5-exact-single-context | sonnet-4-6 | 1 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 19.4 | 19.4 | 19.4 |
| v4-exact-subagents | opus-4-7 | 1 | 29.1 | 29.1 | 29.1 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 34.3 | 34.3 | 34.3 |
| v4-exact-subagents | sonnet-4-6 | 1 | 37.5 | 37.5 | 37.5 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 18.6 | 18.6 | 18.6 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 13.9 | 13.9 | 13.9 |
| v5-exact-single-context | sonnet-4-6 | 1 | 40.5 | 40.5 | 40.5 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 13.6 | 13.6 | 13.6 |
| v4-exact-subagents | opus-4-7 | 1 | 16.0 | 16.0 | 16.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 18.6 | 18.6 | 18.6 |
| v4-exact-subagents | sonnet-4-6 | 1 | 31.4 | 31.4 | 31.4 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 16.1 | 16.1 | 16.1 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 14.8 | 14.8 | 14.8 |
| v5-exact-single-context | sonnet-4-6 | 1 | 32.3 | 32.3 | 32.3 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 191.7 | 191.7 | 191.7 |
| v4-exact-subagents | opus-4-7 | 1 | 40.9 | 40.9 | 40.9 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 46.2 | 46.2 | 46.2 |
| v4-exact-subagents | sonnet-4-6 | 1 | 63.4 | 63.4 | 63.4 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 25.5 | 25.5 | 25.5 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 18.0 | 18.0 | 18.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 35.8 | 35.8 | 35.8 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 25.0 | 25.0 | 25.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 23.0 | 23.0 | 23.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 51.0 | 51.0 | 51.0 |
| v4-exact-subagents | opus-4-7 | 1 | 25.0 | 25.0 | 25.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 35.0 | 35.0 | 35.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 36.0 | 36.0 | 36.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 24.0 | 24.0 | 24.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 29.0 | 29.0 | 29.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 26.0 | 26.0 | 26.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 24.0 | 24.0 | 24.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 28.0 | 28.0 | 28.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 22.0 | 22.0 | 22.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 10.0 | 10.0 | 10.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 18.0 | 18.0 | 18.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 19.0 | 19.0 | 19.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 29.0 | 29.0 | 29.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 15.0 | 15.0 | 15.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 13.0 | 13.0 | 13.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 28.0 | 28.0 | 28.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 12.0 | 12.0 | 12.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 19.0 | 19.0 | 19.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 15.0 | 15.0 | 15.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

## Kata: mars-rover-prose

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1 | 100% |
| v3-basic-tdd | sonnet-4-6 | 1 | 1 | 100% |
| v4-exact-subagents | haiku-4-5 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 1 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1 | 100% |
| v5-exact-single-context | sonnet-4-6 | 1 | 1 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 49.0 | 49.0 | 49.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 40.0 | 40.0 | 40.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 593.0 | 593.0 | 593.0 |
| v4-exact-subagents | opus-4-7 | 1 | 879.0 | 879.0 | 879.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1109.0 | 1109.0 | 1109.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 952.0 | 952.0 | 952.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 432.0 | 432.0 | 432.0 |
| v5-exact-single-context | opus-4-7 | 1 | 385.0 | 385.0 | 385.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 335.0 | 335.0 | 335.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 928.0 | 928.0 | 928.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 34.0 | 34.0 | 34.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 27.0 | 27.0 | 27.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 63.0 | 63.0 | 63.0 |
| v4-exact-subagents | opus-4-7 | 1 | 52.0 | 52.0 | 52.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 30.0 | 30.0 | 30.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 39.0 | 39.0 | 39.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 49.0 | 49.0 | 49.0 |
| v5-exact-single-context | opus-4-7 | 1 | 32.0 | 32.0 | 32.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 41.0 | 41.0 | 41.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 21.0 | 21.0 | 21.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 106.0 | 106.0 | 106.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 126.0 | 126.0 | 126.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 148.0 | 148.0 | 148.0 |
| v4-exact-subagents | opus-4-7 | 1 | 121.0 | 121.0 | 121.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 110.0 | 110.0 | 110.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 110.0 | 110.0 | 110.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 118.0 | 118.0 | 118.0 |
| v5-exact-single-context | opus-4-7 | 1 | 95.0 | 95.0 | 95.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 92.0 | 92.0 | 92.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 79.0 | 79.0 | 79.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 64.0 | 64.0 | 64.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 127.0 | 127.0 | 127.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 58.0 | 58.0 | 58.0 |
| v4-exact-subagents | opus-4-7 | 1 | 35.0 | 35.0 | 35.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 35.0 | 35.0 | 35.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 29.0 | 29.0 | 29.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 45.0 | 45.0 | 45.0 |
| v5-exact-single-context | opus-4-7 | 1 | 29.0 | 29.0 | 29.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 29.0 | 29.0 | 29.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 29.0 | 29.0 | 29.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 14.0 | 14.0 | 14.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | opus-4-7 | 1 | 10.0 | 10.0 | 10.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 10.0 | 10.0 | 10.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 10.0 | 10.0 | 10.0 |
| v5-exact-single-context | opus-4-7 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | opus-4-7 | 1 | 10.0 | 10.0 | 10.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 10.0 | 10.0 | 10.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 10.0 | 10.0 | 10.0 |
| v5-exact-single-context | opus-4-7 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 10.0 | 10.0 | 10.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v3-basic-tdd | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | haiku-4-5 | 1 | 4 | 4 | 100% |
| v4-exact-subagents | opus-4-7 | 1 | 9 | 9 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 8 | 8 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 9 | 9 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0 | 0 | 0% |
| v5-exact-single-context | sonnet-4-6 | 1 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 20.4 | 20.4 | 20.4 |
| v4-exact-subagents | opus-4-7 | 1 | 26.7 | 26.7 | 26.7 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 27.1 | 27.1 | 27.1 |
| v4-exact-subagents | sonnet-4-6 | 1 | 25.5 | 25.5 | 25.5 |
| v5-exact-single-context | haiku-4-5 | 1 | 19.8 | 19.8 | 19.8 |
| v5-exact-single-context | opus-4-7 | 1 | 17.5 | 17.5 | 17.5 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 14.3 | 14.3 | 14.3 |
| v5-exact-single-context | sonnet-4-6 | 1 | 23.7 | 23.7 | 23.7 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 15.2 | 15.2 | 15.2 |
| v4-exact-subagents | opus-4-7 | 1 | 18.5 | 18.5 | 18.5 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 19.9 | 19.9 | 19.9 |
| v4-exact-subagents | sonnet-4-6 | 1 | 18.6 | 18.6 | 18.6 |
| v5-exact-single-context | haiku-4-5 | 1 | 17.9 | 17.9 | 17.9 |
| v5-exact-single-context | opus-4-7 | 1 | 12.3 | 12.3 | 12.3 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 12.8 | 12.8 | 12.8 |
| v5-exact-single-context | sonnet-4-6 | 1 | 25.5 | 25.5 | 25.5 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 29.1 | 29.1 | 29.1 |
| v4-exact-subagents | opus-4-7 | 1 | 45.0 | 45.0 | 45.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 47.6 | 47.6 | 47.6 |
| v4-exact-subagents | sonnet-4-6 | 1 | 58.1 | 58.1 | 58.1 |
| v5-exact-single-context | haiku-4-5 | 1 | 34.9 | 34.9 | 34.9 |
| v5-exact-single-context | opus-4-7 | 1 | 15.1 | 15.1 | 15.1 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 11.3 | 11.3 | 11.3 |
| v5-exact-single-context | sonnet-4-6 | 1 | 62.8 | 62.8 | 62.8 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 28.0 | 28.0 | 28.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 24.0 | 24.0 | 24.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 55.0 | 55.0 | 55.0 |
| v4-exact-subagents | opus-4-7 | 1 | 43.0 | 43.0 | 43.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 26.0 | 26.0 | 26.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 34.0 | 34.0 | 34.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 43.0 | 43.0 | 43.0 |
| v5-exact-single-context | opus-4-7 | 1 | 27.0 | 27.0 | 27.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 35.0 | 35.0 | 35.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 20.0 | 20.0 | 20.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 95.0 | 95.0 | 95.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 85.0 | 85.0 | 85.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 83.0 | 83.0 | 83.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 1 | 83.0 | 83.0 | 83.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 85.0 | 85.0 | 85.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

## Kata: pixel-art-scaler-example-mapping

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1 | 100% |
| v3-basic-tdd | sonnet-4-6 | 1 | 1 | 100% |
| v4-exact-subagents | haiku-4-5 | 1 | 0 | 0% |
| v4-exact-subagents | opus-4-7 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 1 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1 | 100% |
| v5-exact-single-context | sonnet-4-6 | 1 | 1 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 27.0 | 27.0 | 27.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1290.0 | 1290.0 | 1290.0 |
| v4-exact-subagents | opus-4-7 | 1 | 584.0 | 584.0 | 584.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 673.0 | 673.0 | 673.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 819.0 | 819.0 | 819.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 30.0 | 30.0 | 30.0 |
| v5-exact-single-context | opus-4-7 | 1 | 242.0 | 242.0 | 242.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 189.0 | 189.0 | 189.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 497.0 | 497.0 | 497.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 13.0 | 13.0 | 13.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 32.0 | 32.0 | 32.0 |
| v4-exact-subagents | opus-4-7 | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 14.0 | 14.0 | 14.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 42.0 | 42.0 | 42.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 72.0 | 72.0 | 72.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 122.0 | 122.0 | 122.0 |
| v4-exact-subagents | opus-4-7 | 1 | 44.0 | 44.0 | 44.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 41.0 | 41.0 | 41.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 36.0 | 36.0 | 36.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 28.0 | 28.0 | 28.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 36.0 | 36.0 | 36.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 45.0 | 45.0 | 45.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 34.0 | 34.0 | 34.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 39.0 | 39.0 | 39.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 40.0 | 40.0 | 40.0 |
| v4-exact-subagents | opus-4-7 | 1 | 34.0 | 34.0 | 34.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 34.0 | 34.0 | 34.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 34.0 | 34.0 | 34.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 14.0 | 14.0 | 14.0 |
| v5-exact-single-context | opus-4-7 | 1 | 52.0 | 52.0 | 52.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 49.0 | 49.0 | 49.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 27.0 | 27.0 | 27.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 11.0 | 11.0 | 11.0 |
| v4-exact-subagents | opus-4-7 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 12.0 | 12.0 | 12.0 |
| v4-exact-subagents | opus-4-7 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 11.0 | 11.0 | 11.0 |
| v4-exact-subagents | opus-4-7 | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v3-basic-tdd | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | haiku-4-5 | 1 | 4 | 4 | 100% |
| v4-exact-subagents | opus-4-7 | 1 | 3 | 3 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 6 | 6 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 5 | 5 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0 | 0 | 0% |
| v5-exact-single-context | sonnet-4-6 | 1 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 20.5 | 20.5 | 20.5 |
| v4-exact-subagents | opus-4-7 | 1 | 24.5 | 24.5 | 24.5 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 30.2 | 30.2 | 30.2 |
| v4-exact-subagents | sonnet-4-6 | 1 | 25.9 | 25.9 | 25.9 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 19.4 | 19.4 | 19.4 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 14.0 | 14.0 | 14.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 26.6 | 26.6 | 26.6 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 37.4 | 37.4 | 37.4 |
| v4-exact-subagents | opus-4-7 | 1 | 18.8 | 18.8 | 18.8 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 27.1 | 27.1 | 27.1 |
| v4-exact-subagents | sonnet-4-6 | 1 | 37.8 | 37.8 | 37.8 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 14.7 | 14.7 | 14.7 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 12.4 | 12.4 | 12.4 |
| v5-exact-single-context | sonnet-4-6 | 1 | 29.4 | 29.4 | 29.4 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 41.7 | 41.7 | 41.7 |
| v4-exact-subagents | opus-4-7 | 1 | 31.8 | 31.8 | 31.8 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 35.1 | 35.1 | 35.1 |
| v4-exact-subagents | sonnet-4-6 | 1 | 40.8 | 40.8 | 40.8 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 17.4 | 17.4 | 17.4 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 9.9 | 9.9 | 9.9 |
| v5-exact-single-context | sonnet-4-6 | 1 | 35.8 | 35.8 | 35.8 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 13.0 | 13.0 | 13.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 22.0 | 22.0 | 22.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 12.0 | 12.0 | 12.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 13.0 | 13.0 | 13.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 23.0 | 23.0 | 23.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 13.0 | 13.0 | 13.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

## Kata: pixel-art-scaler-prose

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1 | 100% |
| v2-iterative | sonnet-4-6 | 1 | 1 | 100% |
| v3-basic-tdd | sonnet-4-6 | 1 | 1 | 100% |
| v4-exact-subagents | haiku-4-5 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7 | 2 | 2 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 1 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 3 | 3 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1 | 100% |
| v5-exact-single-context | sonnet-4-6 | 1 | 1 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 35.0 | 35.0 | 35.0 |
| v2-iterative | sonnet-4-6 | 1 | 55.0 | 55.0 | 55.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 41.0 | 41.0 | 41.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 429.0 | 429.0 | 429.0 |
| v4-exact-subagents | opus-4-7 | 2 | 656.5 | 647.0 | 666.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 563.0 | 563.0 | 563.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 927.0 | 927.0 | 927.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 30.0 | 30.0 | 30.0 |
| v5-exact-single-context | opus-4-7 | 3 | 239.3 | 196.0 | 265.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 278.0 | 278.0 | 278.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 389.0 | 389.0 | 389.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 15.0 | 15.0 | 15.0 |
| v4-exact-subagents | opus-4-7 | 2 | 6.5 | 5.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 5.7 | 5.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 33.0 | 33.0 | 33.0 |
| v2-iterative | sonnet-4-6 | 1 | 27.0 | 27.0 | 27.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 31.0 | 31.0 | 31.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 63.0 | 63.0 | 63.0 |
| v4-exact-subagents | opus-4-7 | 2 | 48.0 | 44.0 | 52.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 30.0 | 30.0 | 30.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 38.0 | 38.0 | 38.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 30.0 | 30.0 | 30.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 36.0 | 36.0 | 36.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 39.0 | 39.0 | 39.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 46.0 | 46.0 | 46.0 |
| v2-iterative | sonnet-4-6 | 1 | 47.0 | 47.0 | 47.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 61.0 | 61.0 | 61.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 26.0 | 26.0 | 26.0 |
| v4-exact-subagents | opus-4-7 | 2 | 30.0 | 29.0 | 31.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 37.0 | 37.0 | 37.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 39.0 | 39.0 | 39.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 13.0 | 13.0 | 13.0 |
| v5-exact-single-context | opus-4-7 | 3 | 45.7 | 35.0 | 62.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 39.0 | 39.0 | 39.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 20.0 | 20.0 | 20.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v2-iterative | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7 | 2 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 9.0 | 9.0 | 9.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | opus-4-7 | 2 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 9.0 | 9.0 | 9.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 5.7 | 5.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 2 | 5.5 | 5.0 | 6.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 3.7 | 3.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v2-iterative | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v3-basic-tdd | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | haiku-4-5 | 1 | 3 | 3 | 100% |
| v4-exact-subagents | opus-4-7 | 2 | 10 | 10 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 8 | 8 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 8 | 9 | 89% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 3 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0 | 0 | 0% |
| v5-exact-single-context | sonnet-4-6 | 1 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 2 | 3.5 | 3.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 25.6 | 25.6 | 25.6 |
| v4-exact-subagents | opus-4-7 | 2 | 25.0 | 24.1 | 25.9 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 26.0 | 26.0 | 26.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 29.3 | 29.3 | 29.3 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 17.2 | 16.4 | 18.2 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 17.6 | 17.6 | 17.6 |
| v5-exact-single-context | sonnet-4-6 | 1 | 24.1 | 24.1 | 24.1 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 24.4 | 24.4 | 24.4 |
| v4-exact-subagents | opus-4-7 | 2 | 17.6 | 17.5 | 17.8 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 17.9 | 17.9 | 17.9 |
| v4-exact-subagents | sonnet-4-6 | 1 | 22.7 | 22.7 | 22.7 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 14.5 | 11.9 | 18.6 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 11.4 | 11.4 | 11.4 |
| v5-exact-single-context | sonnet-4-6 | 1 | 20.8 | 20.8 | 20.8 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 22.8 | 22.8 | 22.8 |
| v4-exact-subagents | opus-4-7 | 2 | 34.5 | 30.9 | 38.1 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 34.8 | 34.8 | 34.8 |
| v4-exact-subagents | sonnet-4-6 | 1 | 47.1 | 47.1 | 47.1 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 15.6 | 14.9 | 16.9 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 18.8 | 18.8 | 18.8 |
| v5-exact-single-context | sonnet-4-6 | 1 | 35.1 | 35.1 | 35.1 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 13.0 | 13.0 | 13.0 |
| v4-exact-subagents | opus-4-7 | 2 | 6.0 | 4.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 5.7 | 5.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v2-iterative | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7 | 2 | 1.5 | 1.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7 | 2 | 5.0 | 2.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 5.7 | 5.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 2 | 5.0 | 2.0 | 8.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 5.7 | 5.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 2 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 2 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 2 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v2-iterative | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 2 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v2-iterative | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 2 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

## Kata: pixel-art-scaler-user-story

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1 | 100% |
| v3-basic-tdd | sonnet-4-6 | 1 | 1 | 100% |
| v4-exact-subagents | haiku-4-5 | 1 | 0 | 0% |
| v4-exact-subagents | opus-4-7 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 1 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1 | 100% |
| v5-exact-single-context | sonnet-4-6 | 1 | 1 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 32.0 | 32.0 | 32.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 61.0 | 61.0 | 61.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1100.0 | 1100.0 | 1100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 561.0 | 561.0 | 561.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 661.0 | 661.0 | 661.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 610.0 | 610.0 | 610.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 292.0 | 292.0 | 292.0 |
| v5-exact-single-context | opus-4-7 | 1 | 285.0 | 285.0 | 285.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 208.0 | 208.0 | 208.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 503.0 | 503.0 | 503.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 11.0 | 11.0 | 11.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 11.0 | 11.0 | 11.0 |
| v5-exact-single-context | opus-4-7 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 27.0 | 27.0 | 27.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 50.0 | 50.0 | 50.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 48.0 | 48.0 | 48.0 |
| v4-exact-subagents | opus-4-7 | 1 | 34.0 | 34.0 | 34.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 44.0 | 44.0 | 44.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 39.0 | 39.0 | 39.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 60.0 | 60.0 | 60.0 |
| v5-exact-single-context | opus-4-7 | 1 | 36.0 | 36.0 | 36.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 30.0 | 30.0 | 30.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 45.0 | 45.0 | 45.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 64.0 | 64.0 | 64.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 29.0 | 29.0 | 29.0 |
| v4-exact-subagents | opus-4-7 | 1 | 26.0 | 26.0 | 26.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 51.0 | 51.0 | 51.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 51.0 | 51.0 | 51.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 23.0 | 23.0 | 23.0 |
| v5-exact-single-context | opus-4-7 | 1 | 38.0 | 38.0 | 38.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 45.0 | 45.0 | 45.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 28.0 | 28.0 | 28.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | opus-4-7 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 11.0 | 11.0 | 11.0 |
| v4-exact-subagents | opus-4-7 | 1 | 7.0 | 7.0 | 7.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 8.0 | 8.0 | 8.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 8.0 | 8.0 | 8.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 12.0 | 12.0 | 12.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 5.0 | 5.0 | 5.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v3-basic-tdd | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | haiku-4-5 | 1 | 5 | 5 | 100% |
| v4-exact-subagents | opus-4-7 | 1 | 6 | 6 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 6 | 6 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 6 | 7 | 86% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0 | 0 | 0% |
| v5-exact-single-context | sonnet-4-6 | 1 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 23.1 | 23.1 | 23.1 |
| v4-exact-subagents | opus-4-7 | 1 | 26.0 | 26.0 | 26.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 24.3 | 24.3 | 24.3 |
| v4-exact-subagents | sonnet-4-6 | 1 | 27.7 | 27.7 | 27.7 |
| v5-exact-single-context | haiku-4-5 | 1 | 26.0 | 26.0 | 26.0 |
| v5-exact-single-context | opus-4-7 | 1 | 15.7 | 15.7 | 15.7 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 12.8 | 12.8 | 12.8 |
| v5-exact-single-context | sonnet-4-6 | 1 | 25.4 | 25.4 | 25.4 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 30.8 | 30.8 | 30.8 |
| v4-exact-subagents | opus-4-7 | 1 | 18.3 | 18.3 | 18.3 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 30.2 | 30.2 | 30.2 |
| v4-exact-subagents | sonnet-4-6 | 1 | 16.4 | 16.4 | 16.4 |
| v5-exact-single-context | haiku-4-5 | 1 | 19.7 | 19.7 | 19.7 |
| v5-exact-single-context | opus-4-7 | 1 | 8.2 | 8.2 | 8.2 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 12.6 | 12.6 | 12.6 |
| v5-exact-single-context | sonnet-4-6 | 1 | 23.4 | 23.4 | 23.4 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 26.0 | 26.0 | 26.0 |
| v4-exact-subagents | opus-4-7 | 1 | 37.2 | 37.2 | 37.2 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 31.3 | 31.3 | 31.3 |
| v4-exact-subagents | sonnet-4-6 | 1 | 42.3 | 42.3 | 42.3 |
| v5-exact-single-context | haiku-4-5 | 1 | 33.6 | 33.6 | 33.6 |
| v5-exact-single-context | opus-4-7 | 1 | 19.1 | 19.1 | 19.1 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 14.4 | 14.4 | 14.4 |
| v5-exact-single-context | sonnet-4-6 | 1 | 42.4 | 42.4 | 42.4 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 11.0 | 11.0 | 11.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 5.0 | 5.0 | 5.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 10.0 | 10.0 | 10.0 |
| v5-exact-single-context | opus-4-7 | 1 | 7.0 | 7.0 | 7.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 11.0 | 11.0 | 11.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 11.0 | 11.0 | 11.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 11.0 | 11.0 | 11.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 11.0 | 11.0 | 11.0 |
| v5-exact-single-context | opus-4-7 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

## Kata: string-calculator-example-mapping

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1 | 100% |
| v3-basic-tdd | sonnet-4-6 | 1 | 1 | 100% |
| v4-exact-subagents | haiku-4-5 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 1 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1 | 100% |
| v5-exact-single-context | sonnet-4-6 | 1 | 1 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 21.0 | 21.0 | 21.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 31.0 | 31.0 | 31.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 283.0 | 283.0 | 283.0 |
| v4-exact-subagents | opus-4-7 | 1 | 370.0 | 370.0 | 370.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 397.0 | 397.0 | 397.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 443.0 | 443.0 | 443.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 14.0 | 14.0 | 14.0 |
| v5-exact-single-context | opus-4-7 | 1 | 212.0 | 212.0 | 212.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 172.0 | 172.0 | 172.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 225.0 | 225.0 | 225.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 29.0 | 29.0 | 29.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 29.0 | 29.0 | 29.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 32.0 | 32.0 | 32.0 |
| v4-exact-subagents | opus-4-7 | 1 | 21.0 | 21.0 | 21.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 21.0 | 21.0 | 21.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 21.0 | 21.0 | 21.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 25.0 | 25.0 | 25.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 25.0 | 25.0 | 25.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 25.0 | 25.0 | 25.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 20.0 | 20.0 | 20.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 20.0 | 20.0 | 20.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | opus-4-7 | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | opus-4-7 | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v3-basic-tdd | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | haiku-4-5 | 1 | 1 | 2 | 50% |
| v4-exact-subagents | opus-4-7 | 1 | 3 | 3 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4 | 4 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 6 | 6 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0 | 0 | 0% |
| v5-exact-single-context | sonnet-4-6 | 1 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 14.9 | 14.9 | 14.9 |
| v4-exact-subagents | opus-4-7 | 1 | 19.9 | 19.9 | 19.9 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 24.6 | 24.6 | 24.6 |
| v4-exact-subagents | sonnet-4-6 | 1 | 30.4 | 30.4 | 30.4 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 16.0 | 16.0 | 16.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 13.9 | 13.9 | 13.9 |
| v5-exact-single-context | sonnet-4-6 | 1 | 13.8 | 13.8 | 13.8 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 13.8 | 13.8 | 13.8 |
| v4-exact-subagents | opus-4-7 | 1 | 14.9 | 14.9 | 14.9 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 17.4 | 17.4 | 17.4 |
| v4-exact-subagents | sonnet-4-6 | 1 | 20.5 | 20.5 | 20.5 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 9.0 | 9.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 9.8 | 9.8 | 9.8 |
| v5-exact-single-context | sonnet-4-6 | 1 | 13.8 | 13.8 | 13.8 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 23.8 | 23.8 | 23.8 |
| v4-exact-subagents | opus-4-7 | 1 | 32.9 | 32.9 | 32.9 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 33.4 | 33.4 | 33.4 |
| v4-exact-subagents | sonnet-4-6 | 1 | 42.9 | 42.9 | 42.9 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 22.3 | 22.3 | 22.3 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 16.1 | 16.1 | 16.1 |
| v5-exact-single-context | sonnet-4-6 | 1 | 24.4 | 24.4 | 24.4 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

## Kata: string-calculator-prose

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1 | 100% |
| v2-iterative | sonnet-4-6 | 1 | 1 | 100% |
| v3-basic-tdd | sonnet-4-6 | 1 | 1 | 100% |
| v4-exact-subagents | haiku-4-5 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7 | 3 | 3 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 1 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7 | 3 | 3 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1 | 100% |
| v5-exact-single-context | sonnet-4-6 | 1 | 1 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 32.0 | 32.0 | 32.0 |
| v2-iterative | sonnet-4-6 | 1 | 44.0 | 44.0 | 44.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 36.0 | 36.0 | 36.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 90.0 | 90.0 | 90.0 |
| v4-exact-subagents | opus-4-7 | 3 | 337.7 | 321.0 | 358.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 445.0 | 445.0 | 445.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 455.0 | 455.0 | 455.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 243.0 | 243.0 | 243.0 |
| v5-exact-single-context | opus-4-7 | 3 | 196.0 | 185.0 | 203.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 169.0 | 169.0 | 169.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 292.0 | 292.0 | 292.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 9.0 | 9.0 | 9.0 |
| v4-exact-subagents | opus-4-7 | 3 | 3.7 | 2.0 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 3 | 3.3 | 3.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |
| v2-iterative | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 43.0 | 43.0 | 43.0 |
| v4-exact-subagents | opus-4-7 | 3 | 25.0 | 21.0 | 29.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 21.0 | 21.0 | 21.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 30.0 | 30.0 | 30.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 33.0 | 33.0 | 33.0 |
| v5-exact-single-context | opus-4-7 | 3 | 27.7 | 25.0 | 33.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 33.0 | 33.0 | 33.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 25.0 | 25.0 | 25.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 22.0 | 22.0 | 22.0 |
| v2-iterative | sonnet-4-6 | 1 | 23.0 | 23.0 | 23.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 23.0 | 23.0 | 23.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | opus-4-7 | 3 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | opus-4-7 | 3 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 3 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 3 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v2-iterative | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 3 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 3 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 3 | 3.3 | 3.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 3 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v2-iterative | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v3-basic-tdd | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | haiku-4-5 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | opus-4-7 | 3 | 12 | 12 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4 | 4 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 4 | 4 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 3 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0 | 0 | 0% |
| v5-exact-single-context | sonnet-4-6 | 1 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 3 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 0.7 | 0.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 54.5 | 54.5 | 54.5 |
| v4-exact-subagents | opus-4-7 | 3 | 22.0 | 20.9 | 22.8 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 37.2 | 37.2 | 37.2 |
| v4-exact-subagents | sonnet-4-6 | 1 | 29.6 | 29.6 | 29.6 |
| v5-exact-single-context | haiku-4-5 | 1 | 13.9 | 13.9 | 13.9 |
| v5-exact-single-context | opus-4-7 | 3 | 14.9 | 12.8 | 17.4 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 13.9 | 13.9 | 13.9 |
| v5-exact-single-context | sonnet-4-6 | 1 | 20.6 | 20.6 | 20.6 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 3 | 16.1 | 15.6 | 16.5 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 15.1 | 15.1 | 15.1 |
| v4-exact-subagents | sonnet-4-6 | 1 | 19.2 | 19.2 | 19.2 |
| v5-exact-single-context | haiku-4-5 | 1 | 12.9 | 12.9 | 12.9 |
| v5-exact-single-context | opus-4-7 | 3 | 10.9 | 9.4 | 11.8 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 9.1 | 9.1 | 9.1 |
| v5-exact-single-context | sonnet-4-6 | 1 | 18.2 | 18.2 | 18.2 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 3 | 30.5 | 27.6 | 32.4 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 30.3 | 30.3 | 30.3 |
| v4-exact-subagents | sonnet-4-6 | 1 | 43.5 | 43.5 | 43.5 |
| v5-exact-single-context | haiku-4-5 | 1 | 29.4 | 29.4 | 29.4 |
| v5-exact-single-context | opus-4-7 | 3 | 19.2 | 17.3 | 21.7 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 14.0 | 14.0 | 14.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 32.8 | 32.8 | 32.8 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 9.0 | 9.0 | 9.0 |
| v4-exact-subagents | opus-4-7 | 3 | 3.7 | 2.0 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 3 | 3.3 | 3.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v2-iterative | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 3 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7 | 3 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 9.0 | 9.0 | 9.0 |
| v4-exact-subagents | opus-4-7 | 3 | 3.7 | 2.0 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 3 | 3.3 | 3.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 9.0 | 9.0 | 9.0 |
| v4-exact-subagents | opus-4-7 | 3 | 3.7 | 2.0 | 5.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 3 | 3.3 | 3.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 3.0 | 3.0 | 3.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 3 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v2-iterative | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 3 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v2-iterative | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 3 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 3 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

## Kata: string-calculator-user-story

### Core metrics — Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1 | 100% |
| v3-basic-tdd | sonnet-4-6 | 1 | 1 | 100% |
| v4-exact-subagents | haiku-4-5 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7 | 1 | 1 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 1 | 100% |
| v5-exact-single-context | haiku-4-5 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7 | 1 | 1 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1 | 100% |
| v5-exact-single-context | sonnet-4-6 | 1 | 1 | 100% |

### Core metrics — Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 29.0 | 29.0 | 29.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 35.0 | 35.0 | 35.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 283.0 | 283.0 | 283.0 |
| v4-exact-subagents | opus-4-7 | 1 | 426.0 | 426.0 | 426.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 460.0 | 460.0 | 460.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 330.0 | 330.0 | 330.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 253.0 | 253.0 | 253.0 |
| v5-exact-single-context | opus-4-7 | 1 | 201.0 | 201.0 | 201.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 254.0 | 254.0 | 254.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 302.0 | 302.0 | 302.0 |

### Core metrics — Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### Core metrics — Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 29.0 | 29.0 | 29.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 29.0 | 29.0 | 29.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 30.0 | 30.0 | 30.0 |
| v4-exact-subagents | opus-4-7 | 1 | 25.0 | 25.0 | 25.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 25.0 | 25.0 | 25.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 25.0 | 25.0 | 25.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 46.0 | 46.0 | 46.0 |
| v5-exact-single-context | opus-4-7 | 1 | 25.0 | 25.0 | 25.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 25.0 | 25.0 | 25.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 33.0 | 33.0 | 33.0 |

### Core metrics — Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 20.0 | 20.0 | 20.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 20.0 | 20.0 | 20.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | opus-4-7 | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 17.0 | 17.0 | 17.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | opus-4-7 | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 17.0 | 17.0 | 17.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 17.0 | 17.0 | 17.0 |

### Core metrics — Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Cycle count (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Refactorings applied (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 3.0 | 3.0 | 3.0 |
| v4-exact-subagents | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7 | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 4.0 | 4.0 | 4.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### TDD discipline — Predictions correct / total (workflow × model)

| workflow | model | n | predictions_correct | predictions_total | rate |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v3-basic-tdd | sonnet-4-6 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | haiku-4-5 | 1 | 0 | 0 | 0% |
| v4-exact-subagents | opus-4-7 | 1 | 4 | 4 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1 | 1 | 100% |
| v4-exact-subagents | sonnet-4-6 | 1 | 2 | 4 | 50% |
| v5-exact-single-context | haiku-4-5 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7 | 1 | 0 | 0 | 0% |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0 | 0 | 0% |
| v5-exact-single-context | sonnet-4-6 | 1 | 0 | 0 | 0% |

### TDD discipline — Tests passed immediately (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |

### TDD discipline — Avg red seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 19.8 | 19.8 | 19.8 |
| v4-exact-subagents | opus-4-7 | 1 | 22.5 | 22.5 | 22.5 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 30.7 | 30.7 | 30.7 |
| v4-exact-subagents | sonnet-4-6 | 1 | 21.5 | 21.5 | 21.5 |
| v5-exact-single-context | haiku-4-5 | 1 | 16.3 | 16.3 | 16.3 |
| v5-exact-single-context | opus-4-7 | 1 | 15.7 | 15.7 | 15.7 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 18.9 | 18.9 | 18.9 |
| v5-exact-single-context | sonnet-4-6 | 1 | 22.9 | 22.9 | 22.9 |

### TDD discipline — Avg green seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 15.0 | 15.0 | 15.0 |
| v4-exact-subagents | opus-4-7 | 1 | 16.8 | 16.8 | 16.8 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 17.2 | 17.2 | 17.2 |
| v4-exact-subagents | sonnet-4-6 | 1 | 14.2 | 14.2 | 14.2 |
| v5-exact-single-context | haiku-4-5 | 1 | 13.9 | 13.9 | 13.9 |
| v5-exact-single-context | opus-4-7 | 1 | 10.3 | 10.3 | 10.3 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 12.5 | 12.5 | 12.5 |
| v5-exact-single-context | sonnet-4-6 | 1 | 19.3 | 19.3 | 19.3 |

### TDD discipline — Avg refactor seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 23.9 | 23.9 | 23.9 |
| v4-exact-subagents | opus-4-7 | 1 | 46.7 | 46.7 | 46.7 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 37.8 | 37.8 | 37.8 |
| v4-exact-subagents | sonnet-4-6 | 1 | 35.8 | 35.8 | 35.8 |
| v5-exact-single-context | haiku-4-5 | 1 | 32.3 | 32.3 | 32.3 |
| v5-exact-single-context | opus-4-7 | 1 | 16.9 | 16.9 | 16.9 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 24.8 | 24.8 | 24.8 |
| v5-exact-single-context | sonnet-4-6 | 1 | 32.3 | 32.3 | 32.3 |

### Code quality — cc_loc (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### Code quality — cc_functions (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7 | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 1.0 | 1.0 | 1.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 1.0 | 1.0 | 1.0 |

### Code quality — cc_longest_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### Code quality — cc_avg_loc_per_function (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v4-exact-subagents | opus-4-7 | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 2.0 | 2.0 | 2.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 2.0 | 2.0 | 2.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 6.0 | 6.0 | 6.0 |
| v5-exact-single-context | opus-4-7 | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 3.0 | 3.0 | 3.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 4.0 | 4.0 | 4.0 |

### Code quality — smell_total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_magic_numbers (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Code quality — smell_complexity (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7 | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 0.0 | 0.0 | 0.0 |

### Coverage — statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

### Coverage — branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 1 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 1 | 100.0 | 100.0 | 100.0 |

## Cross-kata averages (sanity check only — do NOT compare across katas with different complexity)

> The tables below mix katas of very different size and structure
> (string-calculator: ~3 LoC, no smell room; game-of-life: ~40 LoC,
> high smell room). Means here can swing wildly when the kata mix
> changes. For workflow×model comparisons, use the per-kata blocks
> above.

## Tests passing rate (workflow × model, all katas)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 8 | 100% |
| v2-iterative | sonnet-4-6 | 2 | 2 | 100% |
| v3-basic-tdd | sonnet-4-6 | 8 | 8 | 100% |
| v4-exact-subagents | haiku-4-5 | 8 | 6 | 75% |
| v4-exact-subagents | opus-4-7 | 11 | 11 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 8 | 100% |
| v4-exact-subagents | sonnet-4-6 | 8 | 8 | 100% |
| v5-exact-single-context | haiku-4-5 | 8 | 4 | 50% |
| v5-exact-single-context | opus-4-7 | 12 | 12 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 8 | 100% |
| v5-exact-single-context | sonnet-4-6 | 8 | 8 | 100% |

## Duration seconds (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 33.2 | 21.0 | 49.0 |
| v2-iterative | sonnet-4-6 | 2 | 49.5 | 44.0 | 55.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 39.1 | 27.0 | 61.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 542.1 | 90.0 | 1290.0 |
| v4-exact-subagents | opus-4-7 | 11 | 548.5 | 321.0 | 888.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 649.6 | 397.0 | 1109.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 686.8 | 330.0 | 958.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 165.0 | 14.0 | 432.0 |
| v5-exact-single-context | opus-4-7 | 12 | 245.0 | 185.0 | 385.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 229.8 | 169.0 | 335.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 470.9 | 225.0 | 928.0 |

## Lines of code (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 11.9 | 4.0 | 34.0 |
| v2-iterative | sonnet-4-6 | 2 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 12.6 | 4.0 | 30.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 24.2 | 4.0 | 63.0 |
| v4-exact-subagents | opus-4-7 | 11 | 11.1 | 2.0 | 52.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 13.0 | 2.0 | 41.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 14.1 | 2.0 | 42.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 8.8 | 0.0 | 49.0 |
| v5-exact-single-context | opus-4-7 | 12 | 8.7 | 3.0 | 32.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 12.6 | 3.0 | 41.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 9.6 | 3.0 | 30.0 |

## Code mass (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 53.4 | 27.0 | 131.0 |
| v2-iterative | sonnet-4-6 | 2 | 28.5 | 27.0 | 30.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 63.2 | 29.0 | 139.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 82.5 | 30.0 | 174.0 |
| v4-exact-subagents | opus-4-7 | 11 | 50.3 | 21.0 | 137.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 56.1 | 21.0 | 157.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 55.2 | 21.0 | 143.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 32.1 | 0.0 | 118.0 |
| v5-exact-single-context | opus-4-7 | 12 | 41.2 | 25.0 | 113.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 54.0 | 25.0 | 155.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 48.2 | 25.0 | 110.0 |

## Coverage statements % (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v2-iterative | sonnet-4-6 | 2 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 75.0 | 0.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 11 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 50.0 | 0.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 12 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 99.4 | 95.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |

## Coverage branches % (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v2-iterative | sonnet-4-6 | 2 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 75.0 | 0.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 11 | 98.6 | 85.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 97.9 | 83.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 50.0 | 0.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 12 | 98.6 | 83.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 98.1 | 85.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |

## Test lines (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 40.4 | 20.0 | 72.0 |
| v2-iterative | sonnet-4-6 | 2 | 35.0 | 23.0 | 47.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 54.4 | 20.0 | 127.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 39.0 | 17.0 | 108.0 |
| v4-exact-subagents | opus-4-7 | 11 | 25.4 | 17.0 | 39.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 30.4 | 17.0 | 51.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 30.6 | 17.0 | 51.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 18.6 | 9.0 | 45.0 |
| v5-exact-single-context | opus-4-7 | 12 | 32.2 | 17.0 | 62.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 33.6 | 17.0 | 56.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 23.4 | 17.0 | 32.0 |

## Tests total (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 6.9 | 4.0 | 14.0 |
| v2-iterative | sonnet-4-6 | 2 | 5.0 | 4.0 | 6.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 7.6 | 4.0 | 17.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 7.2 | 4.0 | 12.0 |
| v4-exact-subagents | opus-4-7 | 11 | 6.2 | 4.0 | 10.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 6.8 | 4.0 | 10.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 6.8 | 4.0 | 10.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 3.0 | 0.0 | 10.0 |
| v5-exact-single-context | opus-4-7 | 12 | 5.8 | 4.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 6.1 | 4.0 | 9.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 5.5 | 4.0 | 8.0 |

## Todos remaining (workflow × model, all katas)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 2 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 1.4 | 0.0 | 10.0 |
| v4-exact-subagents | opus-4-7 | 11 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 3.4 | 0.0 | 9.0 |
| v5-exact-single-context | opus-4-7 | 12 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 0.0 | 0.0 | 0.0 |

## Tests passing rate (workflow × kata, all models)

| workflow | kata | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 1 | 1 | 100% |
| v1-oneshot | mars-rover-prose | 1 | 1 | 100% |
| v1-oneshot | pixel-art-scaler-example-mapping | 1 | 1 | 100% |
| v1-oneshot | pixel-art-scaler-prose | 1 | 1 | 100% |
| v1-oneshot | pixel-art-scaler-user-story | 1 | 1 | 100% |
| v1-oneshot | string-calculator-example-mapping | 1 | 1 | 100% |
| v1-oneshot | string-calculator-prose | 1 | 1 | 100% |
| v1-oneshot | string-calculator-user-story | 1 | 1 | 100% |
| v2-iterative | pixel-art-scaler-prose | 1 | 1 | 100% |
| v2-iterative | string-calculator-prose | 1 | 1 | 100% |
| v3-basic-tdd | game-of-life-prose | 1 | 1 | 100% |
| v3-basic-tdd | mars-rover-prose | 1 | 1 | 100% |
| v3-basic-tdd | pixel-art-scaler-example-mapping | 1 | 1 | 100% |
| v3-basic-tdd | pixel-art-scaler-prose | 1 | 1 | 100% |
| v3-basic-tdd | pixel-art-scaler-user-story | 1 | 1 | 100% |
| v3-basic-tdd | string-calculator-example-mapping | 1 | 1 | 100% |
| v3-basic-tdd | string-calculator-prose | 1 | 1 | 100% |
| v3-basic-tdd | string-calculator-user-story | 1 | 1 | 100% |
| v4-exact-subagents | game-of-life-prose | 4 | 4 | 100% |
| v4-exact-subagents | mars-rover-prose | 4 | 4 | 100% |
| v4-exact-subagents | pixel-art-scaler-example-mapping | 4 | 3 | 75% |
| v4-exact-subagents | pixel-art-scaler-prose | 5 | 5 | 100% |
| v4-exact-subagents | pixel-art-scaler-user-story | 4 | 3 | 75% |
| v4-exact-subagents | string-calculator-example-mapping | 4 | 4 | 100% |
| v4-exact-subagents | string-calculator-prose | 6 | 6 | 100% |
| v4-exact-subagents | string-calculator-user-story | 4 | 4 | 100% |
| v5-exact-single-context | game-of-life-prose | 4 | 3 | 75% |
| v5-exact-single-context | mars-rover-prose | 4 | 4 | 100% |
| v5-exact-single-context | pixel-art-scaler-example-mapping | 4 | 3 | 75% |
| v5-exact-single-context | pixel-art-scaler-prose | 6 | 5 | 83% |
| v5-exact-single-context | pixel-art-scaler-user-story | 4 | 4 | 100% |
| v5-exact-single-context | string-calculator-example-mapping | 4 | 3 | 75% |
| v5-exact-single-context | string-calculator-prose | 6 | 6 | 100% |
| v5-exact-single-context | string-calculator-user-story | 4 | 4 | 100% |

## Duration seconds (workflow × kata, all models)

| workflow | kata | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 1 | 38.0 | 38.0 | 38.0 |
| v1-oneshot | mars-rover-prose | 1 | 49.0 | 49.0 | 49.0 |
| v1-oneshot | pixel-art-scaler-example-mapping | 1 | 30.0 | 30.0 | 30.0 |
| v1-oneshot | pixel-art-scaler-prose | 1 | 35.0 | 35.0 | 35.0 |
| v1-oneshot | pixel-art-scaler-user-story | 1 | 32.0 | 32.0 | 32.0 |
| v1-oneshot | string-calculator-example-mapping | 1 | 21.0 | 21.0 | 21.0 |
| v1-oneshot | string-calculator-prose | 1 | 32.0 | 32.0 | 32.0 |
| v1-oneshot | string-calculator-user-story | 1 | 29.0 | 29.0 | 29.0 |
| v2-iterative | pixel-art-scaler-prose | 1 | 55.0 | 55.0 | 55.0 |
| v2-iterative | string-calculator-prose | 1 | 44.0 | 44.0 | 44.0 |
| v3-basic-tdd | game-of-life-prose | 1 | 42.0 | 42.0 | 42.0 |
| v3-basic-tdd | mars-rover-prose | 1 | 40.0 | 40.0 | 40.0 |
| v3-basic-tdd | pixel-art-scaler-example-mapping | 1 | 27.0 | 27.0 | 27.0 |
| v3-basic-tdd | pixel-art-scaler-prose | 1 | 41.0 | 41.0 | 41.0 |
| v3-basic-tdd | pixel-art-scaler-user-story | 1 | 61.0 | 61.0 | 61.0 |
| v3-basic-tdd | string-calculator-example-mapping | 1 | 31.0 | 31.0 | 31.0 |
| v3-basic-tdd | string-calculator-prose | 1 | 36.0 | 36.0 | 36.0 |
| v3-basic-tdd | string-calculator-user-story | 1 | 35.0 | 35.0 | 35.0 |
| v4-exact-subagents | game-of-life-prose | 4 | 751.0 | 269.0 | 958.0 |
| v4-exact-subagents | mars-rover-prose | 4 | 883.2 | 593.0 | 1109.0 |
| v4-exact-subagents | pixel-art-scaler-example-mapping | 4 | 841.5 | 584.0 | 1290.0 |
| v4-exact-subagents | pixel-art-scaler-prose | 5 | 646.4 | 429.0 | 927.0 |
| v4-exact-subagents | pixel-art-scaler-user-story | 4 | 733.0 | 561.0 | 1100.0 |
| v4-exact-subagents | string-calculator-example-mapping | 4 | 373.2 | 283.0 | 443.0 |
| v4-exact-subagents | string-calculator-prose | 6 | 333.8 | 90.0 | 455.0 |
| v4-exact-subagents | string-calculator-user-story | 4 | 374.8 | 283.0 | 460.0 |
| v5-exact-single-context | game-of-life-prose | 4 | 299.8 | 26.0 | 631.0 |
| v5-exact-single-context | mars-rover-prose | 4 | 520.0 | 335.0 | 928.0 |
| v5-exact-single-context | pixel-art-scaler-example-mapping | 4 | 239.5 | 30.0 | 497.0 |
| v5-exact-single-context | pixel-art-scaler-prose | 6 | 235.8 | 30.0 | 389.0 |
| v5-exact-single-context | pixel-art-scaler-user-story | 4 | 322.0 | 208.0 | 503.0 |
| v5-exact-single-context | string-calculator-example-mapping | 4 | 155.8 | 14.0 | 225.0 |
| v5-exact-single-context | string-calculator-prose | 6 | 215.3 | 169.0 | 292.0 |
| v5-exact-single-context | string-calculator-user-story | 4 | 252.5 | 201.0 | 302.0 |

## Lines of code (workflow × kata, all models)

| workflow | kata | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 1 | 30.0 | 30.0 | 30.0 |
| v1-oneshot | mars-rover-prose | 1 | 34.0 | 34.0 | 34.0 |
| v1-oneshot | pixel-art-scaler-example-mapping | 1 | 8.0 | 8.0 | 8.0 |
| v1-oneshot | pixel-art-scaler-prose | 1 | 7.0 | 7.0 | 7.0 |
| v1-oneshot | pixel-art-scaler-user-story | 1 | 4.0 | 4.0 | 4.0 |
| v1-oneshot | string-calculator-example-mapping | 1 | 4.0 | 4.0 | 4.0 |
| v1-oneshot | string-calculator-prose | 1 | 4.0 | 4.0 | 4.0 |
| v1-oneshot | string-calculator-user-story | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | pixel-art-scaler-prose | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | string-calculator-prose | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | game-of-life-prose | 1 | 30.0 | 30.0 | 30.0 |
| v3-basic-tdd | mars-rover-prose | 1 | 27.0 | 27.0 | 27.0 |
| v3-basic-tdd | pixel-art-scaler-example-mapping | 1 | 13.0 | 13.0 | 13.0 |
| v3-basic-tdd | pixel-art-scaler-prose | 1 | 6.0 | 6.0 | 6.0 |
| v3-basic-tdd | pixel-art-scaler-user-story | 1 | 11.0 | 11.0 | 11.0 |
| v3-basic-tdd | string-calculator-example-mapping | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | string-calculator-prose | 1 | 6.0 | 6.0 | 6.0 |
| v3-basic-tdd | string-calculator-user-story | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | game-of-life-prose | 4 | 43.5 | 32.0 | 59.0 |
| v4-exact-subagents | mars-rover-prose | 4 | 46.0 | 30.0 | 63.0 |
| v4-exact-subagents | pixel-art-scaler-example-mapping | 4 | 14.5 | 5.0 | 32.0 |
| v4-exact-subagents | pixel-art-scaler-prose | 5 | 8.0 | 4.0 | 15.0 |
| v4-exact-subagents | pixel-art-scaler-user-story | 4 | 6.2 | 4.0 | 8.0 |
| v4-exact-subagents | string-calculator-example-mapping | 4 | 3.2 | 3.0 | 4.0 |
| v4-exact-subagents | string-calculator-prose | 6 | 4.5 | 2.0 | 9.0 |
| v4-exact-subagents | string-calculator-user-story | 4 | 3.0 | 2.0 | 6.0 |
| v5-exact-single-context | game-of-life-prose | 4 | 22.0 | 0.0 | 33.0 |
| v5-exact-single-context | mars-rover-prose | 4 | 35.8 | 21.0 | 49.0 |
| v5-exact-single-context | pixel-art-scaler-example-mapping | 4 | 4.2 | 0.0 | 6.0 |
| v5-exact-single-context | pixel-art-scaler-prose | 6 | 4.8 | 0.0 | 7.0 |
| v5-exact-single-context | pixel-art-scaler-user-story | 4 | 7.2 | 4.0 | 11.0 |
| v5-exact-single-context | string-calculator-example-mapping | 4 | 2.2 | 0.0 | 3.0 |
| v5-exact-single-context | string-calculator-prose | 6 | 3.5 | 3.0 | 4.0 |
| v5-exact-single-context | string-calculator-user-story | 4 | 4.0 | 3.0 | 6.0 |

## Files

- CSV: `../results/smart-subset/runs.csv`
- Source plan: `batch-plans/smart-subset.json`
- Run dirs: `runs/*`
