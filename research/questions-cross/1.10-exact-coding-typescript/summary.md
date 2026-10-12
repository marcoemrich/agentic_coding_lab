# RQ-exact-coding-typescript — Aggregation

_On TypeScript with Vitest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?_

Generated: 2026-10-12T10:46:33Z

Cells declared: 6 · matched runs: 60 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 10 | 7 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   1    | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |   0.99 | 0.03 |

### tests_passing

| kata                         | cell_workflow                         | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  15 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  15 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |   7 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |  11.6  | 3.65 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |  41.2  | 3.38 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |  37    | 2.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |  47.6  | 7.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |  60.07 | 6.89 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |  54.43 | 2.99 |

### test_lines

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 | 122.6  |  27.31 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 | 217.6  |  78.21 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 | 266.4  |  70.77 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 | 424.9  |  62.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 | 630.6  | 232.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 | 441.43 |  65.79 |

### lines_of_code

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 | 197    |  14.23 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 | 169    |  34.15 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 | 265.2  |  32.51 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 | 293.9  |  41.2  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 | 308.27 |  36.23 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 | 578.57 | 105.43 |

### code_mass

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 | 770.2  |  73.72 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 | 616.47 |  87.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 | 685.4  |  63.25 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 | 721.1  |  43.97 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 | 712.67 |  70.77 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 | 903.57 | 112.11 |

### smell_total

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |    0.1 | 0.32 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |    0   | 0    |

### smell_complexity

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |      0 |    0 |

### smell_duplication

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |      0 |    0 |

### smell_magic_numbers

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |    0.1 | 0.32 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |    0   | 0    |

### smell_code_quality

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |      0 |    0 |

### cognitive_max

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   6.6  | 2.07 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   4.07 | 1.22 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |   2.6  | 0.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   6.1  | 1.91 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   3.07 | 0.96 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |   2.57 | 0.79 |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   2.77 | 0.74 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   1.86 | 0.35 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |   1.24 | 0.29 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   2.46 | 0.37 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   1.48 | 0.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |   1.23 | 0.15 |

### mccabe_max

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   8.4  | 3.58 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   4.73 | 1.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |   3.6  | 0.55 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   5.3  | 1.16 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   3.33 | 0.49 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |   3    | 0    |

### mccabe_avg

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   2.91 | 0.5  |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   1.74 | 0.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |   1.37 | 0.09 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   2.02 | 0.18 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   1.57 | 0.11 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |   1.33 | 0.07 |

### unit_count

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |  16.4  | 4.83 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |  14.6  | 4.5  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |  32.2  | 4.66 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |  16.2  | 1.62 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |  25.87 | 4.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |  37.71 | 5.71 |

### unit_size_max

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |  20.2  | 3.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |  17.8  | 2.93 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |  15.8  | 3.56 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |  24.3  | 4.14 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |  17.93 | 4.93 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |  13.57 | 2.37 |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   7.29 | 1.23 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   6.14 | 1.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |   4.21 | 0.4  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   7.8  | 0.78 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   5.82 | 0.78 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |   4.65 | 0.39 |

### unit_size_median

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   6.7  | 2.54 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   5    | 1.66 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |   3    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   5.45 | 0.96 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   4.63 | 1.16 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |   3.29 | 0.39 |

### predictions_correct_rate

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |    k |    t |   rate_% |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|-----:|-----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   0 |      5 |    nan |  nan |  nan |  nan |    nan   |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |    nan |  nan | 1204 | 1209 |     99.6 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |    nan |  nan |  370 |  370 |    100   |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   0 |     10 |    nan |  nan |  nan |  nan |    nan   |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |    nan |  nan | 1601 | 1618 |     98.9 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |    nan |  nan |  661 |  674 |     98.1 |

### duration_seconds

| kata                         | cell_workflow                         | cell_model         |   n |   null |    mean |      sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|--------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |  278.2  |   40.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 | 1573.93 |  495.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 | 4927    |  610.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |  298.4  |   68.09 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 | 1234.4  |  267.31 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 | 4747.71 | 1297.71 |

### total_tokens

| kata                         | cell_workflow                         | cell_model         |   n |   null |             mean |              sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-----------------:|----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 | 335810           | 65135.9         |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |      6.71986e+06 |     4.14218e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |      1.7516e+07  |     4.15925e+06 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |      3.04828e+06 |     1.03858e+06 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |      2.17703e+07 |     5.99959e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |      6.65498e+07 |     2.01813e+07 |

### cost_usd

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   0.6  |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   4.67 |  2.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |  18.27 |  3.05 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   3.47 |  0.85 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |  16.38 |  3.65 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |  61.51 | 16.4  |

### mutation_score

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |   0.77 | 0.04 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   0.81 | 0.23 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |      1 |   0.88 | 0.02 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   0.93 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   0.94 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |   0.88 | 0.08 |

### mutants_total

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |  204   | 17.96 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |  128   | 20.17 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |      1 |  143   | 19.58 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |  133.3 |  8.72 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |  135.2 | 10.75 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |  155   | 17.28 |

### mutants_survived

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |  47.6  | 11.28 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |  23.87 | 25.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |      1 |  16.75 |  5.44 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   9.8  |  7.67 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   8.4  |  7.57 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |  19.57 | 12.14 |

### mutants_no_coverage

| kata                         | cell_workflow                         | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |  12.2  |  8.07 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |   4.6  |  2.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |      1 |   4    |  1.41 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |   1    |  1.33 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |   4.27 |  5.79 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   7 |      0 |  14    | 12.37 |
