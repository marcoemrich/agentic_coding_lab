# RQ-stack-profile-extraction-opus — Aggregation

_Can all remaining TypeScript/Vitest-specific instructions be moved from the Opus/Hybrid workflow core, phase commands and refactor agent into its existing stack profile without changing correctness, TDD discipline, refactoring behaviour, code quality or cost?_

Generated: 2026-10-12T08:37:57Z

Cells declared: 4 · matched runs: 34 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 18 | 18 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |   0.96 | 0.03 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   0.77 | 0.43 |

### tests_passing

| kata                         | cell_workflow                      | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:-----------------------------------|:-------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |  18 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   4 |      0 |       80 |

### cycle_count

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |  10.33 |  1.37 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |  45.89 |  4.93 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   8.8  |  3.63 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |  40.4  | 22.3  |

### refactorings_applied

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |   4.33 | 0.52 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |  21.28 | 7.55 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   6.4  | 5.13 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |  16    | 9.22 |

### predictions_correct_rate

| kata                         | cell_workflow                      | cell_model         |   n |    k |    t |   null |   rate_% |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-----:|-----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |  124 |  124 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 | 1608 | 1614 |      0 |     99.6 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   84 |   84 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   4 |  401 |  402 |      1 |     99.8 |

### tests_passed_immediately

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |   7.33 |  1.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |  24.28 |  5.18 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   4.6  |  3.21 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |  23.6  | 13.46 |

### avg_loc_per_function

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |   4.23 | 1.19 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |   3.81 | 0.64 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   4.13 | 2.06 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   4.45 | 2.61 |

### longest_function

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |  10.17 |  3.31 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |  16.22 |  5.78 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   7.4  |  4.1  |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |  19.6  | 13.13 |

### cognitive_max

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |   1.83 | 0.75 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |   2.78 | 1.35 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   3    | 1    |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   3.2  | 2.95 |

### mccabe_max

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |   3.17 | 0.41 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |   3.39 | 0.78 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   3.6  | 0.55 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |   3.6  | 2.51 |

### smell_total

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |    1   | 1.55 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |    1.2 | 1.64 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |    0.6 | 0.55 |

### code_mass

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |  179   |  23.97 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 |  859.5 |  99.25 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |  178   |  21.63 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 |  706   | 409.46 |

### duration_seconds

| kata                         | cell_workflow                      | cell_model         |   n |   null |    mean |      sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|--------:|--------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 |  580.17 |  127.5  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 | 2650.06 |  464.89 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 | 1055.8  |  618.76 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 | 4514.2  | 2636.16 |

### total_tokens

| kata                         | cell_workflow                      | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |      0 | 9.23738e+06 | 2.2932e+06  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      0 | 9.42234e+07 | 1.76387e+07 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 | 1.68798e+07 | 1.28054e+07 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |      0 | 2.02222e+08 | 1.48629e+08 |
