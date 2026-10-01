# RQ-old-vs-new-exact-line-opus55 — Aggregation

_On Opus 5.5, does the retired EXACT Coding Opus line still decompose more strongly than the maintained Predictive-TDD line, and does isolating the Refactor step into a subagent help or hurt within each line?_

Generated: 2026-10-01T12:01:51Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cc_avg_loc_per_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   2.92 |  2.14 |  3.26 |  0.46 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   4.81 |  4.08 |  5.6  |  0.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   4.46 |  3.98 |  5.09 |  0.4  |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   3.74 |  2.71 |  4.58 |  0.68 |

### cc_median_loc_per_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    2   |     2 |   2   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    3.8 |     3 |   5   |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    3.3 |     3 |   4.5 |  0.67 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |   4   |  0.89 |

### cc_longest_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   11   |     4 |    16 |  4.36 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   13   |    11 |    15 |  1.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   14.2 |    11 |    16 |  2.17 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   13   |    10 |    16 |  2.45 |

### unit_count

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   26.8 |    23 |    31 |  3.19 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   22.8 |    20 |    26 |  2.77 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   34.4 |    22 |    49 |  9.86 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   24.6 |    19 |    35 |  6.19 |

### unit_size_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   11   |     4 |    16 |  4.36 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   13   |    11 |    15 |  1.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   14.2 |    11 |    16 |  2.17 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   13   |    10 |    16 |  2.45 |

### unit_size_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   2.92 |  2.14 |  3.26 |  0.46 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   4.81 |  4.08 |  5.6  |  0.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   4.46 |  3.98 |  5.09 |  0.4  |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   3.74 |  2.71 |  4.58 |  0.68 |

### unit_size_median

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    2   |     2 |   2   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    3.8 |     3 |   5   |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    3.3 |     3 |   4.5 |  0.67 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |   4   |  0.89 |

### cognitive_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |     4 |  0.89 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |     3 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    2   |     2 |     2 |  0    |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    4   |     2 |     8 |  2.83 |

### cognitive_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   1.25 |  1.11 |  1.54 |  0.17 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   1.43 |  1.21 |  1.75 |  0.21 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   1.23 |  1.06 |  1.36 |  0.12 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1.62 |  1.18 |  2.2  |  0.42 |

### mccabe_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    3.4 |     3 |     4 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    4.2 |     3 |     7 |  1.79 |

### mccabe_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   1.37 |  1.29 |  1.45 |  0.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   1.44 |  1.37 |  1.5  |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   1.39 |  1.28 |  1.48 |  0.08 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1.46 |  1.31 |  1.68 |  0.14 |

### smell_total

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    0.8 |     0 |     1 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    0.4 |     0 |     1 |  0.55 |

### code_mass

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |  742.2 |   674 |   843 | 61.94 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  632.4 |   599 |   692 | 35.98 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  655.2 |   593 |   741 | 56.74 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  713.6 |   655 |   778 | 47.13 |

### lines_of_code

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |  222.8 |   187 |   280 | 43.78 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  222.2 |   184 |   251 | 24.14 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  310.2 |   231 |   370 | 60.52 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  182   |   148 |   212 | 25.17 |

### test_lines

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |  313.4 |   294 |   345 | 26.62 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  276.8 |   224 |   326 | 37.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  259.2 |   221 |   292 | 29.27 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  225.8 |   203 |   244 | 19.02 |

### verification_pct

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   0.96 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.96 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |

### mutation_score

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   0.98 |  0.95 |  0.99 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   0.94 |  0.88 |  0.99 |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.95 |  0.91 |  0.98 |  0.03 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.96 |  0.92 |  0.98 |  0.02 |

### mutants_total

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |  121   |   117 |   126 |  3.67 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  124   |   118 |   130 |  4.9  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  135.2 |   119 |   149 | 10.94 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  121.4 |   117 |   126 |  3.91 |

### mutants_survived

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    2.2 |     1 |     6 |  2.17 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    7.8 |     1 |    15 |  6.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    6.4 |     3 |    13 |  3.91 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    4.4 |     2 |     9 |  2.88 |

### duration_seconds

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 | 1116.8 |   950 |  1292 | 138.46 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  922.2 |   838 |  1053 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 | 2664.2 |  2176 |  3157 | 433.21 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  953.8 |   722 |  1192 | 172.81 |

### total_tokens

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |        mean |      min |       max |         std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 | 5.09643e+07 | 42741828 |  54911185 | 5.23465e+06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 | 2.44e+07    | 22675592 |  26353742 | 1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 | 5.52526e+07 | 48118690 |  67209488 | 7.64498e+06 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 | 1.02623e+08 | 61988748 | 122114276 | 2.35469e+07 |

### cost_usd

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |  18.35 | 14.74 | 19.98 |  2.18 |
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   9.79 |  9.32 | 10.52 |  0.49 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  28.34 | 24.26 | 33.15 |  3.3  |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  27.86 | 17.7  | 33.03 |  5.94 |
