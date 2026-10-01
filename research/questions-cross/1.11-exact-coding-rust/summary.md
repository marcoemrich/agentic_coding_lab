# RQ-exact-coding-rust — Aggregation

_On Rust with Cargo, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness, TDD discipline and code quality for GPT-6 SOL and Opus 5?_

Generated: 2026-10-01T19:36:01Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 5 | 4 | ⚠️ only 4/5 without timeout |

## Outcome pivots (per cell)

### verification_pct

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.97 |  0.87 |     1 |  0.06 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   1    |  1    |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   1    |  1    |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.79 |  0    |     1 |  0.44 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                              | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                              | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       4 |       80 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |       5 |      100 |

### code_mass

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 | 1059.6 |   776 |  1224 | 169.6  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |  517.4 |   491 |   576 |  34.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  929.2 |   887 |   978 |  41.32 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |  595.2 |   563 |   629 |  27.75 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  975.6 |   255 |  1245 | 411.13 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |  605.6 |   543 |   682 |  55.06 |

### smell_total

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    0.6 |     0 |     2 |  0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |    0.4 |     0 |     2 |  0.89 |

### smell_complexity

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    0.4 |     0 |     2 |  0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |    0.2 |     0 |     1 |  0.45 |

### smell_duplication

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |      0 |     0 |     0 |     0 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      0 |     0 |     0 |     0 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      0 |     0 |     0 |     0 |

### smell_code_quality

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |    0.2 |     0 |     1 |  0.45 |

### cognitive_max

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    4.6 |     2 |     8 |  2.7  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   11.8 |    10 |    13 |  1.3  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    3   |     2 |     4 |  0.71 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |    4.8 |     4 |     6 |  0.84 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    3.2 |     2 |     5 |  1.3  |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |    5.4 |     3 |     7 |  1.52 |

### cognitive_avg

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.78 |  0.47 |  0.95 |  0.19 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   4.33 |  3.43 |  5    |  0.7  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.63 |  0.43 |  0.82 |  0.17 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   2.03 |  1.62 |  2.45 |  0.33 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.48 |  0.31 |  0.62 |  0.13 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   1.96 |  1.6  |  2.33 |  0.32 |

### mccabe_max

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    8.6 |     8 |    10 |  0.89 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   12   |    10 |    15 |  2.35 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    8   |     7 |     9 |  1    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   11.8 |     8 |    15 |  2.77 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    7   |     6 |     9 |  1.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   13.6 |    10 |    16 |  2.3  |

### mccabe_avg

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   2.96 |  2.31 |  3.53 |  0.44 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   8.24 |  6.29 | 10.4  |  1.6  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   2.56 |  1.96 |  2.88 |  0.35 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   5.72 |  4.79 |  6.5  |  0.77 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   2.04 |  1.85 |  2.35 |  0.19 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   5.78 |  4.27 |  7.11 |  1.19 |

### cc_longest_function

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   28.2 |    16 |    33 |  7.46 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   28.6 |    25 |    33 |  3.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   24.6 |    19 |    30 |  5.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   25.8 |    23 |    29 |  2.39 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   23.8 |     9 |    34 |  9.36 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   27.4 |    22 |    29 |  3.05 |

### cc_avg_loc_per_function

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   8.75 |  7.31 | 10.21 |  1.22 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |  18.04 | 13.71 | 20.4  |  2.75 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   7.93 |  6.5  |  8.81 |  0.92 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |  10.52 |  8.69 | 12.5  |  1.74 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   6.35 |  5.38 |  7.04 |  0.7  |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |  10.72 |  8.6  | 12.44 |  1.66 |

### cc_median_loc_per_function

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    7   |     6 |   9   |  1.22 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   18.4 |    10 |  24   |  5.41 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    6.8 |     6 |   8   |  0.84 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |    8.9 |     7 |  11.5 |  1.95 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    6   |     6 |   6   |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   10   |     6 |  13   |  2.74 |

### cc_functions

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   33.2 |    19 |    49 | 10.92 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    5.6 |     5 |     7 |  0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   36   |    32 |    46 |  5.79 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   11.4 |     9 |    14 |  2.07 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   46.6 |    13 |    65 | 19.68 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   11.4 |     9 |    15 |  2.3  |

### mutation_score

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.96 |  0.92 |  0.99 |  0.03 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.99 |  0.99 |  0.99 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.98 |  0.93 |  0.99 |  0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.98 |  0.97 |  0.99 |  0.01 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.98 |  0.96 |  1    |  0.02 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   0.99 |  0.98 |  1    |  0.01 |

### mutants_total

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  101   |    77 |   124 | 19.53 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   77   |    68 |    83 |  6.63 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  117.2 |    89 |   148 | 21.74 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |  101.4 |    95 |   106 |  4.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  113.2 |    54 |   156 | 42.01 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   86.2 |    41 |   110 | 26.79 |

### mutants_survived

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    4   |     1 |     7 |  2.55 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    1   |     1 |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |    3   |     1 |    10 |  3.94 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |    2   |     1 |     3 |  0.71 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    2.6 |     0 |     6 |  2.19 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |    1.2 |     0 |     2 |  0.84 |

### tests_total

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   55.4 |    28 |    82 | 21.7  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   11.4 |     9 |    14 |  1.95 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   51.8 |    47 |    57 |  3.9  |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   43.2 |    41 |    47 |  2.39 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   44   |    17 |    58 | 15.73 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   45.2 |    42 |    48 |  2.59 |

### test_lines

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  587.2 |   332 |   827 | 205.95 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |  127   |    90 |   158 |  28.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  644.6 |   431 |   840 | 159.06 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |  110   |    71 |   158 |  36.87 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  532.4 |   349 |   767 | 152.25 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |  114.4 |    75 |   164 |  36.06 |

### lines_of_code

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  577.2 |   362 |   740 | 138    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |  156   |   117 |   172 |  22.15 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  536   |   481 |   604 |  45.09 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |  136.6 |   125 |   151 |  10.69 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  691.2 |   178 |   917 | 295.26 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |  156.2 |   128 |   175 |  17.77 |

### coverage_statements_pct

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   93.4 |    83 |    98 |  6.77 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   99.2 |    98 |   100 |  1.1  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   89.6 |    74 |    99 |  9.34 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   98   |    96 |    99 |  1.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   95   |    93 |    98 |  1.87 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   79.4 |     0 |   100 | 44.39 |

### tdd_discipline

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |   0.2  |  0    |  0.46 |  0.24 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.52 |  0.37 |  0.76 |  0.17 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.56 |  0.54 |  0.6  |  0.02 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.41 |  0.13 |  0.62 |  0.23 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.56 |  0.52 |  0.59 |  0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   0.42 |  0.16 |  0.57 |  0.23 |

### tdd_discipline_test_first

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.15 |  0    |  0.41 |  0.16 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.7  |  0.5  |  0.83 |  0.14 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.44 |  0.4  |  0.48 |  0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.3  |  0.05 |  0.5  |  0.21 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.45 |  0.39 |  0.49 |  0.04 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   0.31 |  0.08 |  0.43 |  0.2  |

### tdd_discipline_step

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |   0.67 |  0.5  |  1    |  0.29 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.34 |  0.17 |  0.67 |  0.21 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1    |  1    |  1    |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   1    |  1    |  1    |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   1    |  1    |  1    |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   1    |  1    |  1    |  0    |

### tdd_discipline_closure

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.14 |  0    |  0.47 |  0.2  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.62 |  0.5  |  0.8  |  0.16 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.4  |  0.39 |  0.45 |  0.02 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.28 |  0.05 |  0.49 |  0.2  |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.39 |  0.34 |  0.43 |  0.04 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   0.28 |  0.04 |  0.43 |  0.21 |

### test_first_rate

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.15 |  0    |  0.41 |  0.16 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.7  |  0.5  |  0.83 |  0.14 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.44 |  0.4  |  0.48 |  0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.3  |  0.05 |  0.5  |  0.21 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.45 |  0.39 |  0.49 |  0.04 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   0.31 |  0.08 |  0.43 |  0.2  |

### red_batch_size

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |   1.67 |   1   |     2 |  0.58 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   3.8  |   1.5 |     6 |  1.82 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1    |   1   |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   1    |   1   |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   1    |   1   |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   1    |   1   |     1 |  0    |

### red_batch_max

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |   1.67 |     1 |     2 |  0.58 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   4    |     2 |     6 |  1.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   1    |     1 |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   1    |     1 |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   1    |     1 |     1 |  0    |

### red_batch_unmeasurable

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   0.8  |     0 |     2 |  1.1  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   1.6  |     1 |     2 |  0.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  11.2  |     6 |    16 |  4.32 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.2  |     0 |     1 |  0.45 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  13.2  |     9 |    18 |  4.09 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   0.33 |     0 |     1 |  0.58 |

### green_batch_size

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |   15.5 |   1.5 |  43   | 23.82 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    5.4 |   2   |  11   |  3.8  |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   13.4 |   1   |  20   |  7.26 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |    4.7 |   1   |  13   |  5.07 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |    5.9 |   1   |  11.5 |  4.7  |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |    2.5 |   2   |   3   |  0.5  |

### chain_suite_runs

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   23.8 |    16 |    35 |  8.29 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    9.2 |     7 |    11 |  1.64 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  110   |    98 |   128 | 13.66 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   86.8 |    40 |   134 | 38.28 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  230.6 |    99 |   277 | 74.63 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   46   |    21 |    87 | 35.79 |

### cycles_total

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  12.6  |    10 |    17 |  2.88 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   4    |     2 |     5 |  1.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  55    |    49 |    59 |  4.24 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |  41.6  |    22 |    51 | 11.35 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  54.4  |    29 |    78 | 17.78 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |  20.33 |     7 |    46 | 22.23 |

### cycles_closed

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   2.2  |     0 |     8 |  3.35 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   2.6  |     1 |     4 |  1.34 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  22.2  |    21 |    23 |  0.84 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |  11.2  |     2 |    23 |  8.67 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  21    |    10 |    28 |  6.67 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   2.67 |     2 |     3 |  0.58 |

### refactor_events

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   6    |     2 |    11 |  3.67 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.4  |     0 |     1 |  0.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  13.2  |     9 |    18 |  4.09 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   6    |     3 |    10 |  3.08 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  67.6  |    21 |    86 | 26.41 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   9.33 |     4 |    15 |  5.51 |

### skip_events

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |    1.2 |     0 |     3 |  1.3  |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    1   |     1 |     1 |  0    |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   31.2 |    25 |    35 |  3.77 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   28.6 |    11 |    45 | 13.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   29   |    16 |    43 |  9.8  |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   15   |     1 |    42 | 23.39 |

### refactor_per_cycle

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |   5.25 |  0.75 | 11    |  5.24 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.15 |  0    |  0.5  |  0.22 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.6  |  0.39 |  0.78 |  0.18 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.97 |  0.33 |  3    |  1.14 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   3.13 |  2.1  |  3.76 |  0.73 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   3.94 |  1.33 |  7.5  |  3.19 |

### green_attempts

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   3 |   0    |     0 |  0    |  0    |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.4  |     0 |  1    |  0.55 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   0.01 |     0 |  0.04 |  0.02 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.05 |     0 |  0.2  |  0.09 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   0.07 |     0 |  0.19 |  0.09 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   0    |     0 |  0    |  0    |

### chain_deviations

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   10.8 |     9 |    13 |  1.64 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |    1.6 |     1 |     3 |  0.89 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |   35.4 |    29 |    39 |  3.85 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   29.6 |    12 |    46 | 13.58 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |   37.8 |    21 |    56 | 13.29 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   3 |   17   |     4 |    43 | 22.52 |

### chain_opens_red (rate %)

| kata                              | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       1 |       20 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       0 |        0 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |       0 |        0 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       0 |        0 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |       0 |        0 |

### chain_ends_green (rate %)

| kata                              | cell_workflow                        | cell_model         |   n |   match |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |       3 |       60 |

### predictions_correct_rate (pooled %)

| kata                              | cell_workflow                        | cell_model         |   n |   correct |   total |   rate_% |
|:----------------------------------|:-------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |       520 |     525 |     99   |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |       243 |     246 |     98.8 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       436 |     440 |     99.1 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |        37 |      38 |     97.4 |

### duration_seconds

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |   max |    std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |  489.8 |   310 |   936 | 256.69 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |  281.6 |   188 |   549 | 150.63 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 | 1500   |  1156 |  2541 | 584.66 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |  684.4 |   546 |   903 | 148.83 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 | 6292   |  5550 |  7200 | 687.16 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 | 1430.4 |   652 |  1902 | 537.83 |

### total_tokens

| kata                              | cell_workflow                        | cell_model         |   n |             mean |      min |       max |              std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-----------------:|---------:|----------:|-----------------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |      3.59325e+06 |  2664947 |   4942895 | 936217           |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 | 317841           |   240850 |    425358 |  77052.2         |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |      2.72105e+07 | 22883684 |  36231455 |      5.6255e+06  |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |      2.83959e+06 |  1145819 |   5269457 |      1.66212e+06 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |      8.34491e+07 | 22757849 | 114823800 |      3.56537e+07 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |      2.07227e+06 |  1398893 |   3006324 | 681615           |

### cost_usd

| kata                              | cell_workflow                        | cell_model         |   n |   mean |   min |    max |   std |
|:----------------------------------|:-------------------------------------|:-------------------|----:|-------:|------:|-------:|------:|
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-cc            | opus-5-no-thinking |   5 |   3.84 |  3.26 |   4.64 |  0.54 |
| claim-office-rust-example-mapping | baseline-inline-tdd-v1-pi            | gpt-6-sol-codex    |   5 |   0.19 |  0.17 |   0.24 |  0.03 |
| claim-office-rust-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |   5 |  20.44 | 17.36 |  25.77 |  3.43 |
| claim-office-rust-example-mapping | exact-ptdd-v1-pi                     | gpt-6-sol-codex    |   5 |   0.94 |  0.46 |   1.56 |  0.44 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |  76.59 | 25.73 | 102.59 | 29.72 |
| claim-office-rust-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-6-sol-codex    |   5 |   1.04 |  0.73 |   1.47 |  0.33 |
