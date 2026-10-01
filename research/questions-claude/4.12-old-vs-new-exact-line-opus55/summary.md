# RQ-old-vs-new-exact-line-opus55 — Aggregation

_On Opus 5.5, does the retired EXACT Coding Opus line still decompose more strongly than the maintained Predictive-TDD line, and does isolating the Refactor step into a subagent help or hurt within each line?_

Generated: 2026-10-01T00:33:09Z

Cells declared: 4 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-5-no-thinking | 2.1.280 | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cc_avg_loc_per_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   4.54 |  4.08 |  4.8  |  0.28 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   4.42 |  4.06 |  5    |  0.35 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   3.74 |  2.71 |  4.58 |  0.68 |

### cc_median_loc_per_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    3.3 |     3 |   4   |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    3.1 |     3 |   3.5 |  0.22 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |   4   |  0.89 |

### cc_longest_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   13.8 |    11 |    16 |  1.79 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   12.4 |    10 |    16 |  2.3  |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   13   |    10 |    16 |  2.45 |

### unit_count

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   24.6 |    22 |    26 |  1.67 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   29.2 |    22 |    35 |  5.12 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   24.6 |    19 |    35 |  6.19 |

### unit_size_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   13.8 |    11 |    16 |  1.79 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   12.4 |    10 |    16 |  2.3  |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   13   |    10 |    16 |  2.45 |

### unit_size_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   4.54 |  4.08 |  4.8  |  0.28 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   4.42 |  4.06 |  5    |  0.35 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   3.74 |  2.71 |  4.58 |  0.68 |

### unit_size_median

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    3.3 |     3 |   4   |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    3.1 |     3 |   3.5 |  0.22 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |   4   |  0.89 |

### cognitive_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    2   |     2 |     2 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    2.8 |     2 |     6 |  1.79 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    4   |     2 |     8 |  2.83 |

### cognitive_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   1.36 |  1.27 |  1.42 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   1.36 |  1.08 |  2.09 |  0.42 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1.62 |  1.18 |  2.2  |  0.42 |

### mccabe_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    4.2 |     3 |     7 |  1.79 |

### mccabe_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   1.46 |  1.39 |  1.63 |  0.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   1.39 |  1.3  |  1.59 |  0.12 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1.46 |  1.31 |  1.68 |  0.14 |

### smell_total

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    0.4 |     0 |     1 |  0.55 |

### code_mass

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  642.4 |   594 |   728 | 55.19 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  670.6 |   644 |   693 | 21.62 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  713.6 |   655 |   778 | 47.13 |

### lines_of_code

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  237   |   216 |   259 | 16.84 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  279.8 |   222 |   337 | 48.16 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  182   |   148 |   212 | 25.17 |

### test_lines

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  266.4 |   241 |   299 | 22.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  270.6 |   249 |   281 | 12.5  |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  225.8 |   203 |   244 | 19.02 |

### verification_pct

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |

### mutation_score

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   0.94 |  0.89 |  0.99 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.95 |  0.89 |  0.99 |  0.04 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.96 |  0.92 |  0.98 |  0.02 |

### mutants_total

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  126.2 |   121 |   134 |  5.89 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  133.4 |   124 |   140 |  6.31 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  121.4 |   117 |   126 |  3.91 |

### mutants_survived

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |    8.2 |     1 |    15 |  5.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    7.2 |     1 |    16 |  6.14 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    4.4 |     2 |     9 |  2.88 |

### duration_seconds

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |  871   |   728 |   957 |  88.98 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 | 2658   |  2136 |  3000 | 356.92 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  953.8 |   722 |  1192 | 172.81 |

### total_tokens

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |        mean |      min |       max |         std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 | 2.4972e+07  | 21135606 |  27059165 | 2.2972e+06  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 | 5.57483e+07 | 48301663 |  61072254 | 4.64857e+06 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 | 1.02623e+08 | 61988748 | 122114276 | 2.35469e+07 |

### cost_usd

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   9.96 |  8.36 | 10.6  |  0.95 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  28.86 | 26.02 | 32.1  |  2.54 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  27.86 | 17.7  | 33.03 |  5.94 |
