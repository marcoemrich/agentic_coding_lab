# RQ-old-vs-new-exact-line-opus55 — Aggregation

_On Opus 5.5, does the retired EXACT Coding Opus line still decompose more strongly than the maintained Predictive-TDD line, and does isolating the Refactor step into a subagent help or hurt within each line?_

Generated: 2026-10-12T08:37:37Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### avg_loc_per_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   4.81 | 0.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   4.46 | 0.4  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   2.92 | 0.46 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   3.74 | 0.68 |

### median_loc_per_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.8 | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.3 | 0.67 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2   | 0    |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 0.89 |

### longest_function

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   13   | 1.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   14.2 | 2.17 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   11   | 4.36 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   13   | 2.45 |

### unit_count

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   22.8 | 2.77 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   34.4 | 9.86 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   26.8 | 3.19 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   24.6 | 6.19 |

### unit_size_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   13   | 1.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   14.2 | 2.17 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   11   | 4.36 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   13   | 2.45 |

### unit_size_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   4.81 | 0.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   4.46 | 0.4  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   2.92 | 0.46 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   3.74 | 0.68 |

### unit_size_median

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.8 | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.3 | 0.67 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2   | 0    |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 0.89 |

### cognitive_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 0.89 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4   | 2.83 |

### cognitive_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.43 | 0.21 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.23 | 0.12 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.25 | 0.17 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.62 | 0.42 |

### mccabe_max

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.2 | 0.45 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4.2 | 1.79 |

### mccabe_avg

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.44 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.39 | 0.08 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.37 | 0.07 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.46 | 0.14 |

### smell_total

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.8 | 0.45 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.4 | 0.55 |

### code_mass

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  632.4 | 35.98 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  655.2 | 56.74 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  742.2 | 61.94 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  713.6 | 47.13 |

### lines_of_code

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  222.2 | 24.14 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  310.2 | 60.52 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  222.8 | 43.78 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  182   | 25.17 |

### test_lines

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  276.8 | 37.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  259.2 | 29.27 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  313.4 | 26.62 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  225.8 | 19.02 |

### verification_pct

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |

### tests_passing

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   k |   null |   rate_% |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |

### mutation_score

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.94 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.95 | 0.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.98 | 0.02 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.96 | 0.02 |

### mutants_total

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  124   |  4.9  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  135.2 | 10.94 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  121   |  3.67 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  121.4 |  3.91 |

### mutants_survived

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    7.8 | 6.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    6.4 | 3.91 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.2 | 2.17 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4.4 | 2.88 |

### duration_seconds

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |     sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  922.2 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 2664.2 | 433.21 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 1116.8 | 138.46 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  953.8 | 172.81 |

### total_tokens

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |        mean |          sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 2.44e+07    | 1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 5.52526e+07 | 7.64498e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 5.09643e+07 | 5.23465e+06 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 1.02623e+08 | 2.35469e+07 |

### cost_usd

| kata                         | cell_workflow                          | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   9.79 | 0.49 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  28.34 | 3.3  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  18.35 | 2.18 |
| claim-office-example-mapping | exact-single-context-v3-no-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  27.86 | 5.94 |
