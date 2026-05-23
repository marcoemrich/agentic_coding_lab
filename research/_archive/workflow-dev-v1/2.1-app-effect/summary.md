# RQ-app — Aggregation

_Liefert die APP-Heuristik (Code-Mass-Berechnung) im Refactor-Subagent einen messbaren Code-Qualitaets-Vorteil ueber Four Rules + Naming-Eval allein?_

Generated: 2026-05-22T16:38:10Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |  166   |   162 |   175 |  5.15 |

### smell_total

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |    3.2 |     2 |     5 |  1.3  |

### cc_longest_function

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |   15.2 |    10 |    32 |  9.44 |

### cognitive_max

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |    8.4 |     4 |    15 |  4.93 |

### mccabe_max

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |    6   |     4 |    10 |  2.55 |

### refactorings_applied

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    4   |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |    4.2 |     3 |     8 |  2.17 |

### cycle_count

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |    8.2 |     8 |     9 |  0.45 |

### predictions_correct_rate (pooled %)

| kata                         | workflow    | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |       169 |     170 |     99.4 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |        82 |      82 |    100   |

### tests_passed_immediately

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |    4.6 |     1 |     6 |  2.07 |

### duration_seconds

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |  521.4 |   427 |   711 |  95.48 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |  480.8 |   388 |   713 | 137.02 |

### total_tokens

| kata                         | workflow    | cell_model           |   n |        mean |     min |     max |              std |
|:-----------------------------|:------------|:---------------------|----:|------------:|--------:|--------:|-----------------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 | 6.62354e+06 | 4863281 | 8557921 |      1.31893e+06 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 | 6.08369e+06 | 4986300 | 7535782 | 954619           |

### tests_passing (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.1-no-app | opus-4-7-no-thinking |   5 |       5 |      100 |
