# RQ-exact-coding-typescript — Aggregation

_On TypeScript with Vitest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?_

Generated: 2026-09-27T09:15:46Z

Cells declared: 6 · matched runs: 60 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 15 | 15 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 10 | 9 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   0.99 |  0.93 |     1 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   0.97 |  0.8  |     1 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                         | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      15 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      15 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                         | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      15 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      15 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |       9 |       90 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  45.3  |    39 |    51 |  4.35 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  11.6  |     8 |    16 |  3.65 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  59.27 |    53 |    73 |  6.26 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  41.2  |    38 |    48 |  3.38 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  54.2  |    50 |    59 |  2.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  37    |    35 |    41 |  2.45 |

### test_lines

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 | 411.1  |   340 |   465 |  46.4  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 122.6  |    97 |   164 |  27.31 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 | 597.13 |   308 |   974 | 249.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 | 217.6  |    74 |   349 |  78.21 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 | 423.6  |   351 |   562 |  64.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 | 266.4  |   197 |   345 |  70.77 |

### lines_of_code

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 | 305    |   227 |   373 |  43.74 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 197    |   173 |   211 |  14.23 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 | 300.47 |   249 |   376 |  37.92 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 | 169    |   113 |   222 |  34.15 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 | 581.3  |   372 |   889 | 153.56 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 | 265.2  |   234 |   320 |  32.51 |

### code_mass

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 | 717.8  |   647 |   860 |  67.84 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 770.2  |   696 |   878 |  73.72 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 | 706.73 |   646 |   896 |  62.07 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 | 616.47 |   519 |   834 |  87.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 | 921.1  |   689 |  1152 | 137.64 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 | 685.4  |   628 |   776 |  63.25 |

### smell_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |    0.1 |     0 |     1 |  0.32 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |

### smell_complexity

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_duplication

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_magic_numbers

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |    0.1 |     0 |     1 |  0.32 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |

### smell_code_quality

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### cognitive_max

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   5.8  |     3 |     8 |  1.75 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   6.6  |     4 |     9 |  2.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   2.73 |     2 |     5 |  0.88 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   4.07 |     2 |     7 |  1.22 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   2.6  |     2 |     5 |  1.07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   2.6  |     2 |     4 |  0.89 |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   2.46 |  1.56 |  3.09 |  0.46 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   2.77 |  1.95 |  3.91 |  0.74 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   1.44 |  1.13 |  1.92 |  0.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   1.86 |  1.25 |  2.43 |  0.35 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   1.22 |  1.06 |  1.67 |  0.18 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   1.24 |  1.08 |  1.75 |  0.29 |

### mccabe_max

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   5.4  |     4 |     7 |  0.97 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   8.4  |     4 |    12 |  3.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   3.27 |     3 |     4 |  0.46 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   4.73 |     3 |     7 |  1.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   3.2  |     3 |     5 |  0.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   3.6  |     3 |     4 |  0.55 |

### mccabe_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   2.06 |  1.8  |  2.39 |  0.2  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   2.91 |  2.24 |  3.63 |  0.5  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   1.58 |  1.38 |  1.92 |  0.15 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   1.74 |  1.36 |  2.25 |  0.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   1.34 |  1.22 |  1.45 |  0.07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   1.37 |  1.26 |  1.52 |  0.09 |

### unit_count

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   14.8 |     9 |    19 |  3.05 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   16.4 |    11 |    22 |  4.83 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   25.2 |    20 |    32 |  4.38 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   14.6 |     8 |    22 |  4.5  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   38.4 |    30 |    44 |  4.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   32.2 |    28 |    39 |  4.66 |

### unit_size_max

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  22.8  |    18 |    30 |  4.34 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  20.2  |    17 |    25 |  3.27 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  18.53 |     9 |    25 |  5.13 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  17.8  |    12 |    23 |  2.93 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  15    |    11 |    19 |  2.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  15.8  |    12 |    19 |  3.56 |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   8.12 |  6.32 | 10.14 |  1.14 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   7.29 |  5.73 |  9.09 |  1.23 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   6    |  4.89 |  8.1  |  1    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   6.14 |  4.53 |  8    |  1.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   4.74 |  4.23 |  5.57 |  0.37 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   4.21 |  3.62 |  4.66 |  0.4  |

### unit_size_median

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   5.55 |     4 |     8 |  1.07 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   6.7  |     5 |    11 |  2.54 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   4.8  |     3 |     7 |  1.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   5    |     2 |     8 |  1.66 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   3.35 |     3 |     5 |  0.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   3    |     3 |     3 |  0    |

### test_blocks

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |    0.9 |     0 |     5 |  1.91 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    3.8 |     3 |     5 |  0.84 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |    5.8 |     0 |    57 | 15.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   35   |     7 |    49 | 14.78 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   39.4 |    37 |    42 |  1.82 |

### test_cases_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   9.2  |     0 |    51 | 19.54 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  12.4  |     9 |    17 |  3.21 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   5.27 |     0 |    57 | 15.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  42.8  |    38 |    49 |  3.95 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  39.2  |    35 |    46 |  4.09 |

### test_cases_first_block

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |    0.7 |     0 |     6 |  1.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    2.8 |     1 |     6 |  2.49 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |

### red_verified

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   0.6  |     0 |     4 |  1.35 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   2.8  |     2 |     5 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   5.8  |     0 |    57 | 15.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  31.13 |     4 |    49 | 16.12 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  39.2  |    37 |    42 |  1.92 |

### red_unverified

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   0.3  |     0 |     3 |  0.95 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   1    |     0 |     2 |  0.71 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   3.87 |     0 |    21 |  7.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   0.2  |     0 |     1 |  0.45 |

### refactorings_applied

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   0.2  |     0 |     1 |  0.42 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   1.8  |     1 |     3 |  0.84 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  47.2  |    15 |    68 | 15.33 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  39.47 |    11 |    48 |  8.6  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  39.6  |    17 |    59 | 13.63 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  37.2  |    35 |    41 |  2.28 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                        | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      1415 |    1430 |     99   |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      1204 |    1209 |     99.6 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |       958 |     984 |     97.4 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       370 |     370 |    100   |

### duration_seconds

| kata                         | cell_workflow                         | cell_model         |   n |    mean |   min |   max |     std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  260    |   200 |   339 |   49.75 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  278.2  |   217 |   316 |   40.71 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 | 1103    |   679 |  1999 |  310.97 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 | 1573.93 |   637 |  2208 |  495.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 | 4624    |  2479 |  7201 | 1422.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 | 4927    |  4434 |  5934 |  610.52 |

### total_tokens

| kata                         | cell_workflow                         | cell_model         |   n |             mean |      min |      max |              std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      2.69153e+06 |  1259607 |  4006256 | 844475           |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 335810           |   240067 |   406371 |  65135.9         |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      1.91578e+07 |  8566267 | 34449879 |      6.96491e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      6.71986e+06 |   767175 | 11127662 |      4.14218e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |      4.08676e+07 | 25148536 | 60459272 |      1.25328e+07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      1.7516e+07  | 15012350 | 24797598 |      4.15925e+06 |

### cost_usd

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   3.14 |  2.15 |  4.83 |  0.86 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   0.6  |  0.49 |  0.71 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  14.68 |  7.74 | 22.71 |  4.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   4.67 |  0.46 |  7.47 |  2.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  27.54 | 18.18 | 39.18 |  7.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  18.27 | 16.41 | 23.6  |  3.05 |

### mutation_score

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   0.9  |  0.8  |  0.99 |  0.06 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   0.77 |  0.71 |  0.82 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   0.91 |  0.8  |  0.99 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   0.81 |  0    |  0.94 |  0.23 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   0.9  |  0.75 |  0.99 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |   0.88 |  0.86 |  0.91 |  0.02 |

### mutants_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 | 135.3  |   119 |   178 | 17.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 204    |   177 |   224 | 17.96 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 | 134.13 |   124 |   159 | 11.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 | 128    |   110 |   182 | 20.17 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 | 154.4  |   125 |   175 | 19.87 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 | 143    |   129 |   171 | 19.58 |

### mutants_survived

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  13.7  |     1 |    36 | 10.73 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  47.6  |    31 |    62 | 11.28 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  12.13 |     1 |    26 |  7.97 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  23.87 |     8 |   112 | 25.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  15.4  |     1 |    37 | 13.92 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |  16.75 |    11 |    24 |  5.44 |

### mutants_no_coverage

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   1    |     0 |     6 |  1.94 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  12.2  |     0 |    22 |  8.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   7.33 |     0 |    19 |  6.73 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   4.6  |     0 |    10 |  2.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  10.7  |     0 |    33 | 12.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |   4    |     3 |     6 |  1.41 |
