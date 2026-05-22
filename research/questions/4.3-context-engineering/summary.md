# RQ-6 — Aggregation

_Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro TDD-Phase (v4) oder ein geteilter, akkumulierter Single-Context (v5) — fuehrt zu besserer Code-Qualitaet, bei sonst identischem Phasen-Skript?_

Generated: 2026-05-16T14:55:00Z

Cells declared: 4 · matched runs: 40 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  625.9 |   167 |   932 | 289.39 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  761.6 |   238 |   939 | 208.57 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  166.6 |   146 |   201 |  17.65 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  152.6 |   136 |   173 |  13.85 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    1.8 |     0 |    10 |  3.29 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     0 |    20 |  7.71 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    2.6 |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    4.1 |     2 |     7 |  1.79 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   25   |    11 |    76 | 19.7  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   31.4 |    18 |    66 | 15.22 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    8.1 |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   17.4 |     2 |    32 |  9.25 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  167.6 |    39 |   275 | 75.13 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  173.3 |    62 |   246 | 51.34 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   31.1 |    25 |    47 |  6.74 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   29.8 |    24 |    36 |  3.74 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    7.9 |     4 |    14 |  4.15 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   10.2 |     4 |    29 |  7    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.5 |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     6 |    12 |  2.08 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   10.5 |     4 |    30 |  9.44 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.2 |     5 |    49 | 12.65 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.4 |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.5 |     9 |    24 |  4.84 |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.67 |   0.2 |     1 |  0.36 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   0.87 |   0   |     1 |  0.32 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   1    |   1   |     1 |  0    |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |

### mutation_score

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.93 |  0.83 |  0.98 |  0.04 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   0.88 |  0.84 |  0.96 |  0.04 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.91 |  0.74 |  0.96 |  0.08 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   0.94 |  0.84 |  0.96 |  0.04 |

### total_tokens

| kata                         | workflow                | model                |   n |        mean |     min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|--------:|---------:|-----------------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1.3655e+07  | 9411553 | 16548065 |      2.09204e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 | 1.41439e+07 | 7282501 | 23265439 |      5.31583e+06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 2.56189e+06 | 2023377 |  3201698 | 382603           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 | 8.14255e+06 |       0 | 12207170 |      3.79036e+06 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 3692.7  |  1640 |  4822 | 942.11 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  655.1  |   357 |   822 | 139.14 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  379.56 |   220 |   508 | 100.79 |
