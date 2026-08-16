# RQ-native-sol-workflows-sub — Aggregation

_On the OpenAI subscription route, does a workflow line written natively for Sol (basic-sol-tdd, Predictive TDD) beat structureless TDD (v3) — the floor that no Opus-derived architecture clears on this model?_

Generated: 2026-08-16T22:50:49Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | basic-sol-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cognitive_max

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |    4.8 |     2 |     8 |  2.39 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   11.4 |     4 |    29 | 10.01 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |    4.6 |     3 |     7 |  1.82 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |    5.2 |     4 |     7 |  1.64 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    4.4 |     3 |     8 |  2.19 |

### cognitive_avg

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   2.15 |  1.89 |  2.43 |  0.19 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   2.33 |  1.22 |  3.75 |  0.97 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   3.4  |  2.46 |  5.9  |  1.41 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   2.83 |  1.67 |  4    |  0.99 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   3.07 |  2.33 |  4    |  0.6  |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   2.67 |  2    |  5    |  1.31 |

### mccabe_max

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |    5.4 |     4 |     6 |  0.89 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |    5   |     3 |     7 |  1.87 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    9.8 |     6 |    19 |  5.36 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     6 |  1.3  |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    4   |     3 |     6 |  1.22 |

### cc_longest_function

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   18   |    15 |    23 |  3    |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   18.4 |    14 |    23 |  3.65 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   27   |    19 |    47 | 11.34 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   13.6 |    11 |    17 |  3.13 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   12.8 |     9 |    16 |  2.86 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   11.2 |    10 |    13 |  1.3  |

### smell_total

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    4.2 |     0 |    21 |  9.39 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |

### cc_avg_loc_per_function

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   6.6  |  5.25 |  8.5  |  1.18 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   7.75 |  6.77 |  9.71 |  1.2  |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   8.45 |  6.62 | 12.67 |  2.41 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   7.27 |  5.6  |  9.33 |  1.4  |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   7.01 |  5    |  8.17 |  1.24 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   6.75 |  5.25 |  9    |  1.4  |

### verification_pct

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   0.93 |  0.67 |     1 |  0.15 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:--------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:--------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |       5 |      100 |

### code_mass

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |  556.8 |   525 |   651 |  53.01 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |  618   |   491 |   867 | 145.16 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |  750   |   675 |   870 |  83.39 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |  162.8 |   154 |   189 |  14.86 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |  167.4 |   142 |   208 |  29.91 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |  176.4 |   150 |   216 |  24.63 |

### cycle_count

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   31.6 |    19 |    39 |  7.54 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   33.2 |    30 |    37 |  3.11 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  0.71 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   10.2 |    10 |    11 |  0.45 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |    9   |     8 |    10 |  1    |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    4.6 |     2 |     9 |  2.7  |

### refactorings_applied

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   31.6 |    19 |    39 |  7.54 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   32.2 |    20 |    40 |  7.56 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    0.4 |     0 |     1 |  0.55 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   10.4 |    10 |    11 |  0.55 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |    9.8 |     8 |    11 |  1.3  |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow             | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |       138 |     140 |     98.6 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |       175 |     176 |     99.4 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |        51 |      52 |     98.1 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |        52 |      52 |    100   |

### duration_seconds

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |  874.2 |   778 |  1013 |  92.43 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 | 2397.2 |  1518 |  3269 | 637.83 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |  218.2 |   167 |   252 |  35.35 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |  359.4 |   320 |   425 |  42    |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |  687.6 |   588 |   724 |  56.89 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |  126.8 |   100 |   157 |  22.69 |

### total_tokens

| kata                         | cell_workflow             | cell_model        |   n |             mean |     min |      max |              std |
|:-----------------------------|:--------------------------|:------------------|----:|-----------------:|--------:|---------:|-----------------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |      4.60854e+06 | 3370918 |  6055547 |      1.10196e+06 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |      7.12622e+06 | 2402341 | 11961210 |      3.95575e+06 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 | 271849           |  216962 |   389288 |  67725.8         |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |      1.03127e+06 |  934855 |  1194859 | 105785           |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |      1.74268e+06 | 1463125 |  1886392 | 170021           |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 | 152520           |   92845 |   255908 |  63491.2         |

### cost_usd

| kata                         | cell_workflow             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   3.98 |  3.08 |  4.9  |  0.74 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   3.59 |  0.27 |  6.83 |  2.85 |
| claim-office-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   0.58 |  0.51 |  0.73 |  0.09 |
| game-of-life-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex |   5 |   1.15 |  1.01 |  1.43 |  0.16 |
| game-of-life-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex |   5 |   1.25 |  1.05 |  1.38 |  0.14 |
| game-of-life-example-mapping | v3-basic-tdd-pi           | gpt-5-6-sol-codex |   5 |   0.36 |  0.28 |  0.46 |  0.07 |
