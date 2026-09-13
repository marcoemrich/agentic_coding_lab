# RQ-stack-profile-extraction-opus — Aggregation

_Can all remaining TypeScript/Vitest-specific instructions be moved from the Opus/Hybrid workflow core, phase commands and refactor agent into its existing stack profile without changing correctness, TDD discipline, refactoring behaviour, code quality or cost?_

Generated: 2026-09-13T16:56:28Z

Cells declared: 4 · matched runs: 34 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 18 | 18 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |   0.96 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   0.77 |  0    |     1 |  0.43 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                      | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      18 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |       4 |       80 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                      | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      18 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |  45.89 |    38 |    52 |  4.93 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |  40.4  |     1 |    55 | 22.3  |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |  10.33 |     9 |    13 |  1.37 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   8.8  |     5 |    13 |  3.63 |

### refactorings_applied

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |  21.28 |     9 |    46 |  7.55 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |  16    |     0 |    23 |  9.22 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |   4.33 |     4 |     5 |  0.52 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   6.4  |     2 |    12 |  5.13 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                      | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |      1608 |    1614 |     99.6 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   4 |       401 |     402 |     99.8 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |       124 |     124 |    100   |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |        84 |      84 |    100   |

### tests_passed_immediately

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |  24.28 |    16 |    32 |  5.18 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |  23.6  |     0 |    34 | 13.46 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |   7.33 |     6 |     9 |  1.03 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   4.6  |     1 |     8 |  3.21 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |   3.81 |  2.64 |  5    |  0.64 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   4.45 |  0    |  6.42 |  2.61 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |   4.23 |  2.71 |  5.33 |  1.19 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   4.13 |  1.83 |  6.8  |  2.06 |

### cc_longest_function

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |  16.22 |     8 |    29 |  5.78 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |  19.6  |     0 |    34 | 13.13 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |  10.17 |     6 |    15 |  3.31 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   7.4  |     2 |    11 |  4.1  |

### cognitive_max

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |   2.78 |     1 |     7 |  1.35 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   3.2  |     0 |     8 |  2.95 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |   1.83 |     1 |     3 |  0.75 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   3    |     2 |     4 |  1    |

### mccabe_max

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |   3.39 |     3 |     6 |  0.78 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   3.6  |     0 |     7 |  2.51 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |   3.17 |     3 |     4 |  0.41 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |   3.6  |     3 |     4 |  0.55 |

### smell_total

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |    0.6 |     0 |     1 |  0.55 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |    1   |     0 |     3 |  1.55 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |    1.2 |     0 |     3 |  1.64 |

### code_mass

| kata                         | cell_workflow                      | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 |  859.5 |   725 |  1114 |  99.25 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |  706   |     0 |  1005 | 409.46 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |  179   |   142 |   211 |  23.97 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 |  178   |   143 |   197 |  21.63 |

### duration_seconds

| kata                         | cell_workflow                      | cell_model         |   n |    mean |   min |   max |     std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 | 2650.06 |  1946 |  3685 |  464.89 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 | 4514.2  |    77 |  6573 | 2636.16 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 |  580.17 |   378 |   722 |  127.5  |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 | 1055.8  |   411 |  1785 |  618.76 |

### total_tokens

| kata                         | cell_workflow                      | cell_model         |   n |        mean |      min |       max |         std |
|:-----------------------------|:-----------------------------------|:-------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |  18 | 8.36653e+07 | 51719658 | 123086078 | 1.64834e+07 |
| claim-office-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 | 1.92469e+08 |   593821 | 392604505 | 1.42452e+08 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc    | opus-5-no-thinking |   6 | 7.39704e+06 |  4407948 |  10565106 | 2.08784e+06 |
| game-of-life-example-mapping | exact-hybrid-v2.9-stack-profile-cc | opus-5-no-thinking |   5 | 1.48251e+07 |  4977526 |  33636029 | 1.1763e+07  |
