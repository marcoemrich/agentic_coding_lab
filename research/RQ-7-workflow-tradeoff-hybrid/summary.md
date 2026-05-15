# RQ-7 — Aggregation

_Liefert ein Hybrid-Workflow (v6: red/green im Single-Context, refactor im isolierten Subagent) ein besseres Tradeoff aus Code-Qualitaet, Wallclock-Dauer und Tokenverbrauch als die Reinformen v4 (alles Subagents) und v5 (alles Single-Context)?_

Generated: 2026-05-15T14:17:54Z

Cells declared: 6 · matched runs: 50 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6-hybrid | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  625.9 |   167 |   932 | 289.39 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  761.6 |   238 |   939 | 208.57 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  883.2 |   839 |   923 |  36.53 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  166.6 |   146 |   201 |  17.65 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  152.6 |   136 |   173 |  13.85 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  162.2 |   147 |   187 |  16.27 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    1.8 |     0 |    10 |  3.29 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     0 |    20 |  7.71 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    2.6 |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    4.1 |     2 |     7 |  1.79 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   25   |    11 |    76 | 19.7  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   31.4 |    18 |    66 | 15.22 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   21   |    12 |    29 |  7.18 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    8.1 |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   17.4 |     2 |    32 |  9.25 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   11   |     4 |    15 |  4.18 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   10.5 |     4 |    30 |  9.44 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.2 |     5 |    49 | 12.65 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    6.6 |     3 |    14 |  4.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.4 |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.5 |     9 |    24 |  4.84 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    4.6 |     1 |     7 |  2.51 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    7.9 |     4 |    14 |  4.15 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   10.2 |     4 |    29 |  7    |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    6.2 |     4 |    12 |  3.35 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.5 |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     6 |    12 |  2.08 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    3.8 |     2 |     5 |  1.1  |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 3692.7  |  1640 |  4822 | 942.11 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  655.1  |   357 |   822 | 139.14 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 | 2116    |  1058 |  2883 | 716.26 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  379.56 |   220 |   508 | 100.79 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  498    |   427 |   606 |  73.25 |

### total_tokens

| kata                         | workflow                | model                |   n |        mean |      min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1.3655e+07  |  9411553 | 16548065 |      2.09204e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 | 1.41439e+07 |  7282501 | 23265439 |      5.31583e+06 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 | 3.3248e+07  | 21492140 | 39096785 |      7.41969e+06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 2.56189e+06 |  2023377 |  3201698 | 382603           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 | 8.14255e+06 |        0 | 12207170 |      3.79036e+06 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 | 6.4323e+06  |  5002606 |  8557921 |      1.47108e+06 |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.67 |   0.2 |     1 |  0.36 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   0.87 |   0   |     1 |  0.32 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   1    |   1   |     1 |  0    |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   37.8 |    16 |    49 |  9.51 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    3.4 |     1 |     5 |  1.43 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   25.8 |     8 |    33 | 10.8  |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    7.8 |     6 |     9 |  0.92 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    6.7 |     0 |     8 |  2.67 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    8.4 |     7 |    10 |  1.14 |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   16.4 |     3 |    27 |  7.4  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    2   |     1 |     3 |  0.82 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   10.4 |     4 |    13 |  3.78 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    5.9 |     3 |     8 |  2.02 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    6   |     0 |     8 |  3.09 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    3.6 |     3 |     5 |  0.89 |

### tests_passed_immediately

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   17.8 |     6 |    27 |  6.97 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    0.9 |     0 |     3 |  1.1  |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   10   |     2 |    14 |  4.74 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    3.3 |     0 |     6 |  2.87 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    0.9 |     0 |     5 |  1.66 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    3.6 |     0 |     7 |  3.36 |
