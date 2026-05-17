# RQ-18 — Aggregation

_Produziert periodisches Refactoring innerhalb von TDD-Cycles besseren Code als ein einzelnes End-Refactoring nach Vibe-Coding-Implementierung + nachträglich geschriebenen Tests? Und falls ja: liegt das am Zeitpunkt (periodisch vs einmalig) oder am Refactor-Inhalt (spezialisierter Subagent mit APP/Naming vs nativer Inline-Refactor)?_

Generated: 2026-05-17T20:01:16Z

Cells declared: 3 · matched runs: 30 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v8a-delayed-refactor-agent | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |  146.2 |   128 |   153 |  7.47 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |  144.1 |   126 |   159 | 10.4  |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |  151   |   145 |   167 |  6.32 |

### cognitive_max

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |    4.2 |     2 |     7 |  1.87 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |    7.8 |     4 |    17 |  4.89 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |    4.4 |     4 |     7 |  0.97 |

### mccabe_max

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |    3.8 |     3 |     4 |  0.42 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |    6   |     4 |    11 |  2.54 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |    4.1 |     4 |     5 |  0.32 |

### cc_longest_function

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |   15   |     7 |    18 |  3.23 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |   15.3 |    10 |    26 |  4.92 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |   12.6 |    12 |    17 |  1.58 |

### smell_total

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |    2   |     2 |     2 |  0    |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |    2.4 |     2 |     4 |  0.84 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |    2.3 |     2 |     3 |  0.48 |

### lines_of_code

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |   32.1 |    28 |    40 |  3.35 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |   38.7 |    30 |    53 |  6.91 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |   46.3 |    41 |    60 |  5.6  |

### duration_seconds

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |  740.6 |   618 |   820 | 66.38 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |  171.3 |   133 |   214 | 32.79 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |   92.4 |    80 |   110 |  9.86 |

### total_tokens

| kata                         | workflow                    | model                |   n |             mean |     min |      max |      std |
|:-----------------------------|:----------------------------|:---------------------|----:|-----------------:|--------:|---------:|---------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |      8.41827e+06 | 6563050 | 10088222 | 979695   |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 | 994204           |  815251 |  1340367 | 176112   |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 | 860325           |  800719 |  1053595 |  77146.5 |

### tests_passing (rate %)

| kata                         | workflow                    | model                |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                    | model                |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |      10 |      100 |

### tests_total

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |    8.1 |     7 |     9 |  0.74 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |   18.8 |    15 |    24 |  2.82 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |   18.5 |    14 |    22 |  2.76 |

### test_lines

| kata                         | workflow                    | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.4-refactor-cut-only    | opus-4-7-no-thinking |  10 |   49.5 |    42 |    64 |  6.06 |
| game-of-life-example-mapping | v8a-delayed-refactor-agent  | opus-4-7-no-thinking |  10 |  190.1 |   146 |   263 | 34.29 |
| game-of-life-example-mapping | v8b-delayed-refactor-native | opus-4-7-no-thinking |  10 |  164.9 |   123 |   225 | 29.47 |
