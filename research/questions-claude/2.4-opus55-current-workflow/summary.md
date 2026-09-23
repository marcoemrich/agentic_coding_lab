# RQ-opus55-current-workflow — Aggregation

_Does the maintained EXACT Coding Predictive TDD workflow still change code quality on Opus 5.5 the way it does on Opus 5, and does Opus 5.5 still need it at all compared with a minimal inline-TDD instruction?_

Generated: 2026-09-23T07:43:38Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.99 |  0.93 |     1 |  0.03 |

### tests_passing (rate %)

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |       5 |      100 |

### lines_of_code

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  236.2 |   222 |   253 | 11.26 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  300.6 |   268 |   373 | 42.97 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  237   |   216 |   259 | 16.84 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  292.6 |   249 |   354 | 41.14 |

### code_mass

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  782.4 |   723 |   900 | 69.26 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  713.6 |   647 |   860 | 83.71 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  642.4 |   594 |   728 | 55.19 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  690.6 |   652 |   746 | 43.96 |

### smell_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### smell_complexity

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### smell_duplication

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### smell_magic_numbers

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### smell_code_quality

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### cognitive_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    8.2 |     7 |     9 |  0.84 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    5.6 |     3 |     8 |  1.82 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    2   |     2 |     2 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    2.6 |     2 |     5 |  1.34 |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   2.49 |  1.9  |  2.8  |  0.37 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   2.4  |  1.56 |  2.9  |  0.54 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1.36 |  1.27 |  1.42 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   1.37 |  1.15 |  1.92 |  0.32 |

### mccabe_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    7.8 |     6 |    10 |  2.05 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    5.6 |     4 |     7 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    3.2 |     3 |     4 |  0.45 |

### mccabe_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   2.45 |  2.11 |  2.73 |  0.25 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   2.13 |  1.8  |  2.39 |  0.24 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   1.46 |  1.39 |  1.63 |  0.1  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   1.56 |  1.38 |  1.92 |  0.21 |

### unit_count

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   14.6 |     9 |    23 |  5.22 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   13.8 |     9 |    19 |  3.7  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   24.6 |    22 |    26 |  1.67 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   25   |    20 |    30 |  4.8  |

### unit_size_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   26.4 |    21 |    29 |  3.44 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   21.8 |    19 |    30 |  4.66 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   13.8 |    11 |    16 |  1.79 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   17.8 |    13 |    25 |  5.36 |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   8.22 |  6.48 | 11.22 |  1.86 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   8.63 |  6.32 | 10.14 |  1.44 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   4.54 |  4.08 |  4.8  |  0.28 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   6.1  |  5.03 |  8.1  |  1.23 |

### unit_size_median

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    5.5 |     5 |     6 |  0.5  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    6.2 |     5 |     8 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    3.3 |     3 |     4 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    5   |     4 |     6 |  1    |

### tests_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   33   |    26 |    36 |  4.24 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   46   |    39 |    51 |  5.24 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   45.6 |    41 |    49 |  2.97 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   55.4 |    53 |    60 |  2.88 |

### test_lines

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  262.2 |   232 |   294 |  21.94 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  418   |   340 |   465 |  53.65 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  266.4 |   241 |   299 |  22.24 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  593.2 |   330 |   974 | 257.99 |

### test_blocks

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    0.6 |     0 |     1 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |    0   |     0 |     0 |  0    |

### test_cases_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### test_cases_first_block

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |     0 |     0 |     0 |

### mutation_score

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.74 |  0.67 |  0.8  |  0.05 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   0.91 |  0.8  |  0.99 |  0.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.94 |  0.89 |  0.99 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0.88 |  0.85 |  0.95 |  0.04 |

### mutants_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  196.4 |   159 |   214 | 22.77 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  135.6 |   119 |   178 | 24.28 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  126.2 |   121 |   134 |  5.89 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  134.2 |   124 |   150 | 12.7  |

### mutants_survived

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   49.8 |    42 |    55 |  5.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   13.6 |     1 |    36 | 13.35 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    8.2 |     1 |    15 |  5.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   15.6 |     6 |    19 |  5.5  |

### mutants_no_coverage

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   17   |     7 |    48 | 17.42 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |    1.2 |     0 |     6 |  2.68 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |    2.8 |     0 |     7 |  2.68 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   10.4 |     2 |    17 |  6.5  |

### duration_seconds

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  123.6 |   115 |   137 |   8.11 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |  255.4 |   206 |   319 |  43.06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |  871   |   728 |   957 |  88.98 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  896.8 |   679 |  1125 | 176.15 |

### total_tokens

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |        mean |      min |      max |             std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|------------:|---------:|---------:|----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 | 1.26785e+06 |   940088 |  1487781 | 243701          |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 | 2.82968e+06 |  1880616 |  3623061 | 704680          |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 | 2.4972e+07  | 21135606 | 27059165 |      2.2972e+06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 | 1.47227e+07 |  8566267 | 19738246 |      4.382e+06  |

### cost_usd

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1.13 |  0.99 |  1.28 |  0.12 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   2.94 |  2.15 |  3.43 |  0.56 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   9.96 |  8.36 | 10.6  |  0.95 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |  11.83 |  7.74 | 15.5  |  3.08 |
