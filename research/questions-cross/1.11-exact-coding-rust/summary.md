# RQ-exact-coding-rust — Aggregation

_On Rust with Cargo, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness, TDD discipline and code quality for GPT-6 SOL and Opus 5?_

Generated: 2026-10-12T10:46:33Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 5 | 4 | ⚠️ below min_replicates (4/5) |

## Outcome pivots (per cell)

### verification_pct

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.97 | 0.06 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   0.98 | 0.03 |

### tests_passing

| kata                              | cell_workflow                        | cell_model         |   n |   k |   null |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |   4 |      0 |      100 |

### code_mass

| kata                              | cell_workflow                        | cell_model         |   n |   null |    mean |     sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|--------:|-------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |  517.4  |  34.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  595.2  |  27.75 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |  605.6  |  55.06 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 | 1059.6  | 169.6  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  929.2  |  41.32 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 | 1155.75 |  94.89 |

### smell_total

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |    0.6 | 0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |    0.4 | 0.89 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |    0   | 0    |

### smell_complexity

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |    0.4 | 0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |    0.2 | 0.45 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |    0   | 0    |

### smell_duplication

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |      0 |    0 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |      0 |    0 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |      0 |    0 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |      0 |    0 |

### smell_code_quality

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |    0.2 | 0.45 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |    0.2 | 0.45 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |    0   | 0    |

### cognitive_max

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   11.8 | 1.3  |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |    4.8 | 0.84 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |    5.4 | 1.52 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    4.6 | 2.7  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    3   | 0.71 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |    3.5 | 1.29 |

### cognitive_avg

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   4.33 | 0.7  |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   2.03 | 0.33 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   1.96 | 0.32 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.78 | 0.19 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.63 | 0.17 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   0.45 | 0.12 |

### mccabe_max

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |  12    | 2.35 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  11.8  | 2.77 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |  13.6  | 2.3  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   8.6  | 0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   8    | 1    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   7.25 | 1.26 |

### mccabe_avg

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   8.24 | 1.6  |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   5.72 | 0.77 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   5.78 | 1.19 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   2.96 | 0.44 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   2.56 | 0.35 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   2.09 | 0.18 |

### longest_function

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   28.6 | 3.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   25.8 | 2.39 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   27.4 | 3.05 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   28.2 | 7.46 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   24.6 | 5.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   27.5 | 5.07 |

### avg_loc_per_function

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |  18.04 | 2.75 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  10.52 | 1.74 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |  10.72 | 1.66 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   8.75 | 1.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   7.93 | 0.92 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   6.59 | 0.52 |

### median_loc_per_function

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   18.4 | 5.41 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |    8.9 | 1.95 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   10   | 2.74 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |    7   | 1.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    6.8 | 0.84 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |    6   | 0    |

### functions

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |    5.6 |  0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   11.4 |  2.07 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   11.4 |  2.3  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   33.2 | 10.92 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   36   |  5.79 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   55   |  6.78 |

### mutation_score

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.99 | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.98 | 0.01 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   0.99 | 0.01 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.96 | 0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.98 | 0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   0.97 | 0.01 |

### mutants_total

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   77   |  6.63 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  101.4 |  4.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   86.2 | 26.79 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  101   | 19.53 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  117.2 | 21.74 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  128   | 29.88 |

### mutants_survived

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   2    | 0.71 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   1.2  | 0.84 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   4    | 2.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   3    | 3.94 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   3.25 | 1.89 |

### tests_total

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |  11.4  |  1.95 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  43.2  |  2.39 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |  45.2  |  2.59 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  55.4  | 21.7  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  51.8  |  3.9  |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  50.75 |  5.12 |

### test_lines

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 | 127    |  28.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 | 110    |  36.87 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 | 114.4  |  36.06 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 | 587.2  | 205.95 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 | 644.6  | 159.06 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 | 578.25 | 129.97 |

### lines_of_code

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |  156   |  22.15 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  136.6 |  10.69 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |  156.2 |  17.77 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  577.2 | 138    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  536   |  45.09 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  819.5 |  80.62 |

### coverage_statements_pct

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |  99.2  |  1.1  |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  98    |  1.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |  79.4  | 44.39 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  93.4  |  6.77 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  89.6  |  9.34 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  94.25 |  0.96 |

### tdd_discipline

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.52 | 0.17 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.41 | 0.23 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   0.42 | 0.23 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |      2 |   0.2  | 0.24 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.56 | 0.02 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   0.56 | 0.03 |

### tdd_discipline_test_first

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.7  | 0.14 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.3  | 0.21 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   0.31 | 0.2  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.15 | 0.16 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.44 | 0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   0.45 | 0.04 |

### tdd_discipline_step

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.34 | 0.21 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   1    | 0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |      2 |   0.67 | 0.29 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   1    | 0    |

### tdd_discipline_closure

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.62 | 0.16 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.28 | 0.2  |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   0.28 | 0.21 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.14 | 0.2  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.41 | 0.02 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   0.4  | 0.03 |

### test_first_rate

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.7  | 0.14 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.3  | 0.21 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   0.31 | 0.2  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.15 | 0.16 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.44 | 0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   0.45 | 0.04 |

### red_batch_size

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   3.8  | 1.82 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   1    | 0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |      2 |   1.67 | 0.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   1    | 0    |

### red_batch_max

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   4    | 1.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   1    | 0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |      2 |   1.67 | 0.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   1    | 0    |

### red_batch_unmeasurable

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   1.6  | 0.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.2  | 0.45 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   0.33 | 0.58 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   0.8  | 1.1  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  11.2  | 4.32 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  14    | 4.24 |

### green_batch_size

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   5.4  |  3.8  |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   4.7  |  5.07 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   2.5  |  0.5  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |      2 |  15.5  | 23.82 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  13.4  |  7.26 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   7.12 |  4.4  |

### chain_suite_runs

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |    9.2 |  1.64 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   86.8 | 38.28 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   46   | 35.79 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   23.8 |  8.29 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  110   | 13.66 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  263.5 | 14.48 |

### cycles_total

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   4    |  1.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  41.6  | 11.35 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |  20.33 | 22.23 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  12.6  |  2.88 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  55    |  4.24 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  60.75 | 12.37 |

### cycles_closed

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   2.6  | 1.34 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  11.2  | 8.67 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   2.67 | 0.58 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   2.2  | 3.35 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  22.2  | 0.84 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  23.75 | 2.99 |

### refactor_events

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.4  | 0.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   6    | 3.08 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   9.33 | 5.51 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   6    | 3.67 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  13.2  | 4.09 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  79.25 | 4.99 |

### skip_events

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   1    |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  28.6  | 13.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |  15    | 23.39 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   1.2  |  1.3  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  31.2  |  3.77 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  32.25 |  7.59 |

### refactor_per_cycle

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.15 | 0.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.97 | 1.14 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   3.94 | 3.19 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |      2 |   5.25 | 5.24 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.6  | 0.18 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   3.38 | 0.52 |

### green_attempts

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.4  | 0.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.05 | 0.09 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   0    | 0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |      2 |   0    | 0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   0.01 | 0.02 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   0.09 | 0.09 |

### chain_deviations

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |    1.6 |  0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   29.6 | 13.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |      2 |   17   | 22.52 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   10.8 |  1.64 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |   35.4 |  3.85 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |   42   | 10.86 |

### chain_opens_red

| kata                              | cell_workflow                        | cell_model         |   n |   k |   null |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   4 |   0 |      1 |        0 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   0 |      2 |        0 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   1 |      0 |       20 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   4 |   0 |      1 |        0 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |   0 |      0 |        0 |

### chain_ends_green

| kata                              | cell_workflow                        | cell_model         |   n |   k |   null |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   3 |      2 |      100 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |   4 |      0 |      100 |

### predictions_correct_rate

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |    nan |  nan | 243 | 246 |     98.8 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |    nan |  nan |  37 |  38 |     97.4 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |    nan |  nan | 520 | 525 |     99   |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |    nan |  nan | 399 | 403 |     99   |

### duration_seconds

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |     sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |  281.6 | 150.63 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |  684.4 | 148.83 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 | 1430.4 | 537.83 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |  489.8 | 256.69 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 | 1500   | 584.66 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 | 6065   | 534.85 |

### total_tokens

| kata                              | cell_workflow                        | cell_model         |   n |   null |             mean |               sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-----------------:|-----------------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 | 317841           |  77052.2         |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |      2.83959e+06 |      1.66212e+06 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |      2.07227e+06 | 681615           |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |      3.59325e+06 | 936217           |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |      2.72105e+07 |      5.6255e+06  |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |      9.8622e+07  |      1.2655e+07  |

### cost_usd

| kata                              | cell_workflow                        | cell_model         |   n |   null |   mean |    sd |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |   0.19 |  0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |   0.94 |  0.44 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |   1.04 |  0.33 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |   3.84 |  0.54 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |  20.44 |  3.43 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   4 |      0 |  89.3  | 10.02 |
