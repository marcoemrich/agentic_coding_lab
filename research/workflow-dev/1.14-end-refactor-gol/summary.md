# RQ-end-refactor-gol — Aggregation

_Haelt der v6.5-end-refactor-Befund (Korrektheit intakt, Code-Qualitaet >= v6.2) auch auf der trainingsbekannten game-of-life-Kata — die Voraussetzung fuer eine globale Baseline-Promotion von v6.5 ueber v6.2?_

Generated: 2026-05-30T14:26:34Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.5-end-refactor | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cognitive_max

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |    3.4 |     2 |     4 |  0.89 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |    3   |     2 |     7 |  2.24 |

### cognitive_avg

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |    2.7 |   2   |     3 |  0.45 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |    2.2 |   1.5 |     4 |  1.04 |

### mccabe_max

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |    4   |     3 |     5 |  0.71 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |

### mccabe_avg

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |   1.71 |  1.44 |  1.86 |  0.17 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |   1.63 |  1.2  |  2.75 |  0.64 |

### cc_longest_function

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |   10   |     5 |    15 |  3.61 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |    9.8 |     6 |    13 |  2.59 |

### cc_avg_loc_per_function

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |   3.87 |  2.43 |  5    |  1    |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |   4.08 |  2.57 |  6.25 |  1.38 |

### smell_total

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |    1.6 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |    0   |     0 |     0 |  0    |

### smell_complexity (rate %)

| kata                         | workflow              | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |       0 |        0 |

### code_mass

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |  154.8 |   141 |   178 | 14.75 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |  168   |   153 |   174 |  8.6  |

### tests_passing (rate %)

| kata                         | workflow              | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct (rate %)

| kata                         | workflow              | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow              | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |    8.8 |     8 |    10 |  0.84 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |    9.6 |     9 |    11 |  0.89 |

### refactorings_applied

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |    8.8 |     8 |    10 |  0.84 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |    9.6 |     9 |    11 |  0.89 |

### predictions_correct_rate (pooled %)

| kata                         | workflow              | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |        88 |      88 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |        96 |      96 |      100 |

### tests_passed_immediately (rate %)

| kata                         | workflow              | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 |       0 |        0 |

### duration_seconds

| kata                         | workflow              | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 |  897.8 |   807 |  1073 | 102.77 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 | 1331.6 |  1134 |  1544 | 148.81 |

### total_tokens

| kata                         | workflow              | cell_model           |   n |        mean |      min |      max |              std |
|:-----------------------------|:----------------------|:---------------------|----:|------------:|---------:|---------:|-----------------:|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking |   5 | 1.00804e+07 |  8552316 | 11740349 |      1.25907e+06 |
| game-of-life-example-mapping | v6.5-end-refactor     | opus-4-7-no-thinking |   5 | 1.23498e+07 | 11179992 | 13171918 | 963726           |
