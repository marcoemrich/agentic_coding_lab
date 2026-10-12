# RQ-opus55-current-workflow — Aggregation

_Does the maintained EXACT Coding Predictive TDD workflow still change code quality on Opus 5.5 the way it does on Opus 5, and does Opus 5.5 still need it at all compared with a minimal inline-TDD instruction?_

Generated: 2026-10-12T16:44:03Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 2.1.280 | 5 | 3 | ⚠️ below min_replicates (3/5) |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   0.98 | 0.04 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.96 | 0.09 |

### tests_passing

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |   3 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |

### lines_of_code

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  278.4 | 28.42 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  316   | 35.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  529   | 72.67 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  224.2 | 11.95 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  222.2 | 24.14 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  310.2 | 60.52 |

### code_mass

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  720.2 | 32.33 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  708.4 | 80.2  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  879   | 79.5  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  707   | 36.8  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  632.4 | 35.98 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  655.2 | 56.74 |

### smell_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |    0   | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.4 | 0.89 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0   | 0    |

### cognitive_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    6.2 | 2.17 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    3.6 | 1.34 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |    3   | 1    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    7.6 | 2.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2   | 0    |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   2.39 | 0.36 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1.51 | 0.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   1.37 | 0.08 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   2.61 | 0.34 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.43 | 0.21 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.23 | 0.12 |

### mccabe_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    5.4 | 1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    3.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |    3   | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    8.4 | 1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3   | 0    |

### mccabe_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   2.05 | 0.22 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1.54 | 0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   1.33 | 0.06 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   2.4  | 0.13 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.44 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.39 | 0.08 |

### unit_count

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  16.6  | 0.89 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  27    | 3.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  35.67 | 7.02 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  12.4  | 1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  22.8  | 2.77 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  34.4  | 9.86 |

### unit_size_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  24.8  | 4.44 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  16    | 4    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  12.67 | 1.15 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  26.2  | 2.05 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  13    | 1.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  14.2  | 2.17 |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   7.99 | 1.03 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   5.57 | 0.15 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   4.6  | 0.57 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   7.48 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   4.81 | 0.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   4.46 | 0.4  |

### unit_size_median

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   6    | 1    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   4.5  | 1    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   3.33 | 0.58 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   5.1  | 0.82 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   3.8  | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   3.3  | 0.67 |

### tests_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  50.6  | 9.53 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  57.8  | 7.46 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  54.33 | 3.21 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  32    | 2.35 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  47.8  | 1.64 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  46.4  | 2.3  |

### test_lines

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 | 445.6  |  76.53 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 | 693.6  | 175.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 | 476.67 |  93.95 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 254.4  |  25.46 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 276.8  |  37.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 259.2  |  29.27 |

### mutation_score

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.96 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.97 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   0.89 | 0.06 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.76 | 0.1  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.94 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.95 | 0.03 |

### mutants_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  131.6 |  7.89 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  137.4 |  9.71 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  156   |  8.72 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  163   | 25.18 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  124   |  4.9  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  135.2 | 10.94 |

### mutants_survived

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    5.8 |  3.42 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    4.4 |  0.89 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   17   |  8.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   38.8 | 14.97 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    7.8 |  6.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    6.4 |  3.91 |

### mutants_no_coverage

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    1.2 |  1.64 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    1.2 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |    8   |  9.17 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   20   | 18.53 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.8 |  3.83 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2   |  2.45 |

### tdd_discipline

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.55 | 0.06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.5  | 0.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   0.62 | 0.11 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   2 |      3 |   0.42 | 0.12 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.63 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.62 | 0.03 |

### tdd_discipline_test_first

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.85 | 0.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.37 | 0.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   0.51 | 0.14 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.92 | 0.18 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.51 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.5  | 0.03 |

### tdd_discipline_step

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.23 | 0.04 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   2 |      3 |   0.13 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |

### tdd_discipline_closure

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.84 | 0.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.35 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   0.47 | 0.13 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.9  | 0.22 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.49 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.48 | 0.04 |

### test_first_rate

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.85 | 0.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.37 | 0.04 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   0.51 | 0.14 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.92 | 0.18 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.51 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.5  | 0.03 |

### red_batch_size

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   4.4  | 0.96 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   2 |      3 |   7.75 | 0.35 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |

### red_batch_max

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   8    | 2.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   2.33 | 2.31 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   2 |      3 |  10    | 2.83 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |

### red_batch_unmeasurable

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   4.4  | 1.67 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   1.67 | 1.15 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   2.6  | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |

### green_batch_size

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   4.4  | 0.65 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   1.17 | 0.29 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  12.5  | 2.69 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |

### chain_suite_runs

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   23.8 |  3.35 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   99.6 |  9.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  174   | 53.08 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    7.6 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   95.4 |  5.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  161.8 | 13.18 |

### cycles_total

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   11.4 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   58.8 |  7.53 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   45   | 16.46 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.4 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   49.6 |  2.19 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   52   |  3.16 |

### cycles_closed

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   9.6  | 1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  20.2  | 2.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  19.67 | 3.51 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   3    | 0.71 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  24.2  | 1.64 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  25    | 1.58 |

### refactor_events

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    1.6 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   10.6 |  1.95 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   55   | 16.37 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.8 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   16.6 |  2.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   30.6 |  9.69 |

### skip_events

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |    1.4 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   38   |  7.07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   25   | 13.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.2 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   23.8 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   25.8 |  2.95 |

### refactor_per_cycle

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.17 | 0.11 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.54 | 0.16 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   2.81 | 0.75 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.28 | 0.18 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.69 | 0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.23 | 0.41 |

### green_attempts

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   0.03 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |   0.05 | 0.04 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.03 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.06 | 0.05 |

### chain_deviations

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   1.8  |  0.84 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  38.8  |  6.65 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  25.33 | 13.32 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.4  |  0.89 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  24.6  |  1.34 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  27    |  2.35 |

### chain_opens_red

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |   0 |      0 |        0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   0 |      0 |        0 |

### chain_ends_green

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |   3 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |

### duration_seconds

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |    mean |      sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|--------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  332.2  |   62.56 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 | 1291    |  127.96 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 | 4312.67 | 1531.77 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  129.8  |   14.06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  922.2  |   80.42 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 2664.2  |  433.21 |

### total_tokens

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |        mean |               sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 | 3.54318e+06 | 868550           |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 | 2.25601e+07 |      3.33356e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 | 5.75045e+07 |      2.16515e+07 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 1.44947e+06 | 309842           |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 2.44e+07    |      1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 5.52526e+07 |      7.64498e+06 |

### cost_usd

| kata                         | cell_workflow                         | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking   | 2.1.280        |   5 |      0 |   3.6  |  0.59 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking   | 2.1.280        |   5 |      0 |  16.93 |  2.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking   | 2.1.280        |   3 |      0 |  55.74 | 18.9  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.31 |  0.17 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   9.79 |  0.49 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  28.34 |  3.3  |
