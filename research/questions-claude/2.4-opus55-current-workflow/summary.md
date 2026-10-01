# RQ-opus55-current-workflow — Aggregation

_Does the maintained EXACT Coding Predictive TDD workflow still change code quality on Opus 5.5 the way it does on Opus 5, and does Opus 5.5 still need it at all compared with a minimal inline-TDD instruction?_

Generated: 2026-10-01T16:04:19Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 2.1.280 | 5 | 3 | ⚠️ only 3/5 without timeout |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   0.96 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   0.79 |   0   |     1 |  0.44 |

### tests_passing (rate %)

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |       3 |       60 |

### lines_of_code

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  224.2 |   205 |   233 |  11.95 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  278.4 |   240 |   315 |  28.42 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  222.2 |   184 |   251 |  24.14 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  316   |   276 |   354 |  35.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  310.2 |   231 |   370 |  60.52 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |  447   |   227 |   593 | 141.25 |

### code_mass

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  707   |   661 |   750 |  36.8  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  720.2 |   679 |   754 |  32.33 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  632.4 |   599 |   692 |  35.98 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  708.4 |   651 |   838 |  80.2  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  655.2 |   593 |   741 |  56.74 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |  779.8 |   480 |   959 | 181.69 |

### smell_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |    0   |     0 |     0 |  0    |

### smell_complexity

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### smell_duplication

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### smell_magic_numbers

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |    0   |     0 |     0 |  0    |

### smell_code_quality

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### cognitive_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    7.6 |     4 |     9 |  2.07 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    6.2 |     3 |     8 |  2.17 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |     3 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    3.6 |     2 |     5 |  1.34 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |    2   |     2 |     2 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |    2.8 |     2 |     4 |  0.84 |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   2.61 |  2.08 |  2.92 |  0.34 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   2.39 |  1.85 |  2.82 |  0.36 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1.43 |  1.21 |  1.75 |  0.21 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   1.51 |  1.18 |  1.86 |  0.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   1.23 |  1.06 |  1.36 |  0.12 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   1.37 |  1.29 |  1.45 |  0.06 |

### mccabe_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    8.4 |     7 |    10 |  1.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    5.4 |     4 |     7 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    3.4 |     3 |     4 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    3.4 |     3 |     4 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |    3   |     3 |     3 |  0    |

### mccabe_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   2.4  |  2.19 |  2.52 |  0.13 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   2.05 |  1.81 |  2.26 |  0.22 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1.44 |  1.37 |  1.5  |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   1.54 |  1.43 |  1.66 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   1.39 |  1.28 |  1.48 |  0.08 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   1.44 |  1.26 |  1.73 |  0.18 |

### unit_count

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   12.4 |    11 |    14 |  1.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   16.6 |    15 |    17 |  0.89 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   22.8 |    20 |    26 |  2.77 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   27   |    23 |    32 |  3.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   34.4 |    22 |    49 |  9.86 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   30.6 |    15 |    43 | 10.24 |

### unit_size_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   26.2 |    24 |    28 |  2.05 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   24.8 |    18 |    30 |  4.44 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   13   |    11 |    15 |  1.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   16   |    12 |    22 |  4    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   14.2 |    11 |    16 |  2.17 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   12.6 |    10 |    15 |  1.95 |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   7.48 |  7.09 |  8.18 |  0.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   7.99 |  6.59 |  9.18 |  1.03 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   4.81 |  4.08 |  5.6  |  0.62 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   5.57 |  5.42 |  5.74 |  0.15 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   4.46 |  3.98 |  5.09 |  0.4  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   4.73 |  3.98 |  5.13 |  0.46 |

### unit_size_median

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    5.1 |   4.5 |   6   |  0.82 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    6   |   5   |   7   |  1    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    3.8 |   3   |   5   |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    4.5 |   3   |   5.5 |  1    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |    3.3 |   3   |   4.5 |  0.67 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |    3.4 |   3   |   4   |  0.55 |

### tests_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   32   |    30 |    35 |  2.35 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   50.6 |    41 |    65 |  9.53 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   47.8 |    45 |    49 |  1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   57.8 |    52 |    69 |  7.46 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   46.4 |    44 |    50 |  2.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   49.6 |    28 |    58 | 12.34 |

### test_lines

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  254.4 |   224 |   290 |  25.46 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  445.6 |   348 |   539 |  76.53 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  276.8 |   224 |   326 |  37.63 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  693.6 |   454 |   903 | 175.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  259.2 |   221 |   292 |  29.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |  407.2 |   229 |   542 | 127.28 |

### mutation_score

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.76 |  0.65 |  0.86 |  0.1  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0.96 |  0.93 |  0.98 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.94 |  0.88 |  0.99 |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.97 |  0.96 |  0.97 |  0.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   0.95 |  0.91 |  0.98 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   0.93 |  0.84 |  0.99 |  0.07 |

### mutants_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  163   |   145 |   207 | 25.18 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  131.6 |   123 |   143 |  7.89 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  124   |   118 |   130 |  4.9  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  137.4 |   125 |   151 |  9.71 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  135.2 |   119 |   149 | 10.94 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |  138   |    73 |   162 | 36.98 |

### mutants_survived

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   38.8 |    22 |    51 | 14.97 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    5.8 |     3 |    10 |  3.42 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    7.8 |     1 |    15 |  6.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    4.4 |     4 |     6 |  0.89 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |    6.4 |     3 |    13 |  3.91 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |   11   |     1 |    24 | 10.37 |

### mutants_no_coverage

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   20   |     5 |    44 | 18.53 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    1.2 |     0 |     4 |  1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    2.8 |     0 |     7 |  3.83 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    1.2 |     0 |     2 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |    2   |     0 |     6 |  2.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |    4.8 |     0 |    18 |  7.82 |

### tdd_discipline

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   2 |   0.42 |  0.34 |  0.51 |  0.12 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0.55 |  0.44 |  0.59 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.63 |  0.61 |  0.64 |  0.01 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.5  |  0.44 |  0.55 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   0.62 |  0.58 |  0.65 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   0.59 |  0.52 |  0.75 |  0.11 |

### tdd_discipline_test_first

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.92 |  0.6  |  1    |  0.18 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0.85 |  0.73 |  0.92 |  0.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.51 |  0.49 |  0.53 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.37 |  0.31 |  0.42 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   0.5  |  0.46 |  0.53 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   0.48 |  0.38 |  0.68 |  0.13 |

### tdd_discipline_step

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   2 |   0.13 |  0.12 |  0.13 |  0.01 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0.24 |  0.17 |  0.29 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   1    |  1    |  1    |  0    |

### tdd_discipline_closure

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.9  |  0.5  |  1    |  0.22 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0.84 |  0.73 |  0.92 |  0.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.49 |  0.46 |  0.5  |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.35 |  0.27 |  0.39 |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   0.48 |  0.43 |  0.52 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   0.44 |  0.36 |  0.62 |  0.12 |

### test_first_rate

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.92 |  0.6  |  1    |  0.18 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0.85 |  0.73 |  0.92 |  0.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.51 |  0.49 |  0.53 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.37 |  0.31 |  0.42 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   0.5  |  0.46 |  0.53 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   0.48 |  0.38 |  0.68 |  0.13 |

### red_batch_size

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   2 |   7.75 |   7.5 |     8 |  0.35 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   4.4  |   3.5 |     6 |  0.96 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   1    |   1   |     1 |  0    |

### red_batch_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   2 |     10 |     8 |    12 |  2.83 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      8 |     5 |    11 |  2.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      1 |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      1 |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      1 |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |      2 |     1 |     5 |  2    |

### red_batch_unmeasurable

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    2.6 |     2 |     3 |  0.55 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    4.4 |     3 |     7 |  1.67 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |    1.5 |     1 |     3 |  1    |

### green_batch_size

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  12.5  |   8.5 |  15   |  2.69 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   4.4  |   4   |   5.5 |  0.65 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |   1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   1    |   1   |   1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |   1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   1.12 |   1   |   1.5 |  0.25 |

### chain_suite_runs

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   7.6  |     6 |    10 |  1.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  23.8  |    20 |    28 |  3.35 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  95.4  |    89 |   101 |  5.41 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  99.6  |    92 |   114 |  9.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 | 161.8  |   149 |   182 | 13.18 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 | 206.25 |   117 |   303 | 77.71 |

### cycles_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    3.4 |     3 |     4 |  0.55 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   11.4 |     9 |    13 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   49.6 |    46 |    52 |  2.19 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   58.8 |    52 |    70 |  7.53 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   52   |    48 |    56 |  3.16 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   50.5 |    26 |    67 | 17.37 |

### cycles_closed

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   3    |     2 |     4 |  0.71 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   9.6  |     8 |    11 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  24.2  |    22 |    26 |  1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  20.2  |    17 |    24 |  2.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  25    |    23 |    27 |  1.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |  20.75 |    16 |    24 |  3.59 |

### refactor_events

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.8  |     0 |     1 |  0.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   1.6  |     0 |     3 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  16.6  |    14 |    20 |  2.41 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  10.6  |     9 |    14 |  1.95 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  30.6  |    22 |    46 |  9.69 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |  59.25 |    41 |    73 | 15.84 |

### skip_events

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.2  |     0 |     1 |  0.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   1.4  |     0 |     3 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  23.8  |    22 |    25 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  38    |    31 |    47 |  7.07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  25.8  |    22 |    30 |  2.95 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |  28.75 |     9 |    40 | 13.6  |

### refactor_per_cycle

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.28 |  0    |  0.5  |  0.18 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0.17 |  0    |  0.27 |  0.11 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.69 |  0.56 |  0.8  |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.54 |  0.42 |  0.82 |  0.16 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   1.23 |  0.88 |  1.92 |  0.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   2.86 |  2.22 |  3.65 |  0.62 |

### green_attempts

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0    |     0 |  0    |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0    |     0 |  0    |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.03 |     0 |  0.08 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.03 |     0 |  0.1  |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   0.06 |     0 |  0.12 |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |   0.07 |     0 |  0.12 |  0.05 |

### chain_deviations

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.4  |     0 |     2 |  0.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   1.8  |     1 |     3 |  0.84 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  24.6  |    23 |    26 |  1.34 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  38.8  |    33 |    47 |  6.65 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  27    |    25 |    31 |  2.35 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   4 |  29.75 |    10 |    43 | 14.01 |

### chain_opens_red (rate %)

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |       0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |       0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |       0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |       0 |        0 |

### chain_ends_green (rate %)

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |       4 |       80 |

### duration_seconds

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |     std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  129.8 |   119 |   153 |   14.06 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  332.2 |   276 |   433 |   62.56 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  922.2 |   838 |  1053 |   80.42 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 | 1291   |  1162 |  1502 |  127.96 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 | 2664.2 |  2176 |  3157 |  433.21 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 | 5468   |  2678 |  7201 | 1917.26 |

### total_tokens

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |        mean |      min |       max |              std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|------------:|---------:|----------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 | 1.44947e+06 |  1058949 |   1747704 | 309842           |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 | 3.54318e+06 |  2950543 |   5070369 | 868550           |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 | 2.44e+07    | 22675592 |  26353742 |      1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 | 2.25601e+07 | 19498582 |  28208559 |      3.33356e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 | 5.52526e+07 | 48118690 |  67209488 |      7.64498e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 | 6.30984e+07 | 32737586 | 106055978 |      2.98411e+07 |

### cost_usd

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1.31 |  1.07 |  1.53 |  0.17 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   3.6  |  3.11 |  4.62 |  0.59 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   9.79 |  9.32 | 10.52 |  0.49 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  16.93 | 14.68 | 20.67 |  2.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |  28.34 | 24.26 | 33.15 |  3.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   5 |  60.69 | 34.9  | 95.24 | 24.34 |
