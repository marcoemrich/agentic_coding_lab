# RQ-exact-coding-typescript — Aggregation

_On TypeScript with Vitest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?_

Generated: 2026-09-23T04:26:16Z

Cells declared: 6 · matched runs: 40 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking | 5 | 4 | ⚠️ only 4/5 without timeout |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   0.99 |  0.93 |     1 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   0.96 |  0.8  |     1 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                         | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |       7 |       70 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |       4 |       80 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                         | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |      10 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   44.6 |    40 |    50 |  3.71 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   11.6 |     8 |    16 |  3.65 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   61.2 |    54 |    73 |  6.7  |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   42   |    39 |    48 |  3.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   55   |    52 |    59 |  3.08 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   37   |    35 |    41 |  2.45 |

### test_lines

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |  404.2 |   351 |   439 |  42.97 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  122.6 |    97 |   164 |  27.31 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |  599.1 |   308 |   937 | 258.57 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |  220.6 |    74 |   292 |  71.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |  415   |   380 |   436 |  21.19 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  266.4 |   197 |   345 |  70.77 |

### lines_of_code

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |  309.4 |   227 |   359 |  49.09 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  197   |   173 |   211 |  14.23 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |  304.4 |   275 |   376 |  37.86 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |  171.5 |   135 |   222 |  32.48 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |  670.4 |   534 |   889 | 160.43 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  265.2 |   234 |   320 |  32.51 |

### code_mass

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |  722   |   655 |   792 |  57.48 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  770.2 |   696 |   878 |  73.72 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |  714.8 |   646 |   896 |  70.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |  633.1 |   546 |   834 |  94.67 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |  968   |   724 |  1152 | 159.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  685.4 |   628 |   776 |  63.25 |

### smell_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |

### smell_complexity

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_duplication

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### smell_magic_numbers

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |

### smell_code_quality

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      0 |     0 |     0 |     0 |

### cognitive_max

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    6   |     3 |     8 |  1.87 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    6.6 |     4 |     9 |  2.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    2.8 |     2 |     4 |  0.63 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |    3.9 |     2 |     5 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    2.6 |     2 |     4 |  0.89 |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   2.53 |  2    |  3.09 |  0.42 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   2.77 |  1.95 |  3.91 |  0.74 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   1.47 |  1.13 |  1.92 |  0.26 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   1.83 |  1.25 |  2.43 |  0.37 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   1.13 |  1.06 |  1.19 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   1.24 |  1.08 |  1.75 |  0.29 |

### mccabe_max

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    5.2 |     4 |     6 |  0.84 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    8.4 |     4 |    12 |  3.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    3.3 |     3 |     4 |  0.48 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |    5   |     3 |     7 |  1.56 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    3.6 |     3 |     4 |  0.55 |

### mccabe_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   1.99 |  1.8  |  2.19 |  0.15 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   2.91 |  2.24 |  3.63 |  0.5  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   1.59 |  1.4  |  1.77 |  0.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   1.8  |  1.47 |  2.25 |  0.29 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   1.33 |  1.22 |  1.42 |  0.08 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   1.37 |  1.26 |  1.52 |  0.09 |

### unit_count

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   15.8 |    14 |    19 |  2.17 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   16.4 |    11 |    22 |  4.83 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   25.3 |    20 |    32 |  4.42 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   13.7 |     8 |    21 |  4.06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   40.2 |    32 |    44 |  4.82 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   32.2 |    28 |    39 |  4.66 |

### unit_size_max

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   23.8 |    18 |    28 |  4.27 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   20.2 |    17 |    25 |  3.27 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   18.9 |     9 |    25 |  5.26 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   18.4 |    15 |    23 |  2.37 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   15.2 |    11 |    19 |  3.35 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   15.8 |    12 |    19 |  3.56 |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   7.62 |  6.93 |  8    |  0.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   7.29 |  5.73 |  9.09 |  1.23 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   5.95 |  4.89 |  7.95 |  0.93 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   6.42 |  4.53 |  8    |  1.24 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   4.6  |  4.23 |  5.06 |  0.33 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   4.21 |  3.62 |  4.66 |  0.4  |

### unit_size_median

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    4.9 |     4 |   5.5 |  0.55 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    6.7 |     5 |  11   |  2.54 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    4.7 |     3 |   7   |  1.27 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |    5.3 |     2 |   8   |  1.96 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    3.2 |     3 |   3.5 |  0.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    3   |     3 |   3   |  0    |

### test_blocks

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    1.8 |     0 |     5 |  2.49 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    3.8 |     3 |     5 |  0.84 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    8.7 |     0 |    57 | 18.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   34.8 |     7 |    49 | 15.5  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   39.4 |    37 |    42 |  1.82 |

### test_cases_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   18.4 |     0 |    51 | 25.44 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   12.4 |     9 |    17 |  3.21 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    7.9 |     0 |    57 | 18.35 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   43.6 |    39 |    49 |  4.22 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   39.2 |    35 |    46 |  4.09 |

### test_cases_first_block

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    1.4 |     0 |     6 |  2.61 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    2.8 |     1 |     6 |  2.49 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    0   |     0 |     0 |  0    |

### red_verified

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    1.2 |     0 |     4 |  1.79 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    2.8 |     2 |     5 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    8.7 |     0 |    57 | 18.1  |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   30.8 |     4 |    49 | 17.16 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   39.2 |    37 |    42 |  1.92 |

### red_unverified

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    1   |     0 |     2 |  0.71 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |    4   |     0 |    21 |  7.97 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |    0.2 |     0 |     1 |  0.45 |

### refactorings_applied

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    0.4 |     0 |     1 |  0.55 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |    1.8 |     1 |     3 |  0.84 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   51.5 |    23 |    68 | 13.81 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   39.2 |    11 |    48 | 10.54 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   47.4 |    28 |    59 | 13.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   37.2 |    35 |    41 |  2.28 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                        | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  10 |      1033 |    1044 |     98.9 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  10 |       809 |     812 |     99.6 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |   5 |       519 |     529 |     98.1 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       370 |     370 |    100   |

### duration_seconds

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |     std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |  264.6 |   200 |   339 |   60.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  278.2 |   217 |   316 |   40.71 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 | 1206.1 |   879 |  1999 |  318.12 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 | 1486   |   637 |  2140 |  476.69 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 | 5499.4 |  3574 |  7201 | 1417.51 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 | 4927   |  4434 |  5934 |  610.52 |

### total_tokens

| kata                         | cell_workflow                         | cell_model         |   n |             mean |      min |      max |             std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-----------------:|---------:|---------:|----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |      2.55338e+06 |  1259607 |  4006256 |     1.0297e+06  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 335810           |   240067 |   406371 | 65135.9         |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |      2.13754e+07 | 11078090 | 34449879 |     7.1087e+06  |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |      6.87568e+06 |   767175 | 11127662 |     4.1366e+06  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |      4.84135e+07 | 28328974 | 60459272 |     1.32536e+07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      1.7516e+07  | 15012350 | 24797598 |     4.15925e+06 |

### cost_usd

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   3.34 |  2.18 |  4.83 |  1.11 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   0.6  |  0.49 |  0.71 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |  16.1  |  9.39 | 22.71 |  4.28 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   4.76 |  0.46 |  7.31 |  2.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |  32.05 | 20.24 | 39.18 |  7.85 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  18.27 | 16.41 | 23.6  |  3.05 |

### mutation_score

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |   0.9  |  0.82 |  0.97 |  0.06 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   0.77 |  0.71 |  0.82 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |   0.92 |  0.8  |  0.99 |  0.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |   0.78 |  0    |  0.94 |  0.28 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   0.89 |  0.75 |  0.99 |  0.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |   0.88 |  0.86 |  0.91 |  0.02 |

### mutants_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |  135   |   121 |   144 | 10.07 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  204   |   177 |   224 | 17.96 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |  134.1 |   124 |   159 | 11.57 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |  130.7 |   110 |   182 | 23.43 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |  156   |   125 |   175 | 20.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |  143   |   129 |   171 | 19.58 |

### mutants_survived

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |  13.8  |     5 |    26 |  8.98 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  47.6  |    31 |    62 | 11.28 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |  10.4  |     1 |    26 |  8.68 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |  27.7  |     8 |   112 | 30.42 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |  18    |     1 |    37 | 15.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |  16.75 |    11 |    24 |  5.44 |

### mutants_no_coverage

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |   5 |    0.8 |     0 |     2 |  1.1  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   12.2 |     0 |    22 |  8.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  10 |    5.8 |     0 |    19 |  6.61 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  10 |    4.9 |     0 |    10 |  3.07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |   5 |   15.2 |     0 |    33 | 13.95 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |    4   |     3 |     6 |  1.41 |
