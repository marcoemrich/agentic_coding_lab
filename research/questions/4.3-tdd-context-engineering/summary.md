# RQ-context — Aggregation

_Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro TDD-Phase (v4) oder ein geteilter, akkumulierter Single-Context (v5) — fuehrt zu besserer Code-Qualitaet, bei sonst identischem Phasen-Skript?_

Generated: 2026-05-22T16:38:09Z

Cells declared: 4 · matched runs: 38 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 9 | 9 | ⚠️ unter min_replicates (9/10) |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 9 | 9 | ⚠️ unter min_replicates (9/10) |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 625.9  |   167 |   932 | 289.39 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 | 819.78 |   628 |   939 | 104.23 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 166.6  |   146 |   201 |  17.65 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 | 154.44 |   137 |   173 |  13.32 |

### smell_total

| kata                         | workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   1.8  |     0 |    10 |  3.29 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |   9.56 |     0 |    20 |  7.88 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   2.6  |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |   4.33 |     2 |     7 |  1.73 |

### cc_longest_function

| kata                         | workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  25    |    11 |    76 | 19.7  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  32.78 |    18 |    66 | 15.47 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   8.1  |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  17.11 |     2 |    32 |  9.77 |

### cc_loc

| kata                         | workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 167.6  |    39 |   275 | 75.13 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 | 185.67 |   133 |   246 | 35.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  31.1  |    25 |    47 |  6.74 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  30    |    24 |    36 |  3.91 |

### mccabe_max

| kata                         | workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   7.9  |     4 |    14 |  4.15 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  10.56 |     4 |    29 |  7.33 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   4.5  |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |   9    |     6 |    12 |  2.18 |

### cognitive_max

| kata                         | workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  10.5  |     4 |    30 |  9.44 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  14.89 |     5 |    49 | 13.21 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   4.4  |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  15.11 |    10 |    24 |  4.7  |

### tests_passing (rate %)

| kata                         | workflow                | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |       9 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |       9 |      100 |

### verification_pct

| kata                         | workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.67 |  0.2  |     1 |  0.36 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |   0.97 |  0.73 |     1 |  0.09 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |   1    |  1    |     1 |  0    |

### completed_within_budget (rate %)

| kata                         | workflow                | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |       9 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |       9 |      100 |

### mutation_score

| kata                         | workflow                | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.93 |  0.83 |  0.98 |  0.04 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |   0.87 |  0.84 |  0.9  |  0.02 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.91 |  0.74 |  0.96 |  0.08 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |   0.94 |  0.84 |  0.96 |  0.04 |

### total_tokens

| kata                         | workflow                | cell_model           |   n |        mean |     min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|--------:|---------:|-----------------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1.3655e+07  | 9411553 | 16548065 |      2.09204e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 | 1.46868e+07 | 7282501 | 23265439 |      5.33619e+06 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 2.56189e+06 | 2023377 |  3201698 | 382603           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 | 9.04728e+06 | 4594513 | 12207170 |      2.63708e+06 |

### duration_seconds

| kata                         | workflow                | cell_model           |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 3692.7  |  1640 |  4822 | 942.11 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  688.22 |   526 |   822 |  97.14 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  379.56 |   220 |   508 | 100.79 |
