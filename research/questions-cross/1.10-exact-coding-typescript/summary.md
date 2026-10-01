# RQ-exact-coding-typescript — Aggregation

_On TypeScript with Vitest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?_

Generated: 2026-10-01T14:39:50Z

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

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   1    |  0.93 |     1 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   0.87 |  0    |     1 |  0.31 |
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
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |       7 |       70 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  47.6  |    40 |    65 |  7.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  11.6  |     8 |    16 |  3.65 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  60.07 |    52 |    73 |  6.89 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  41.2  |    38 |    48 |  3.38 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  52.3  |    28 |    59 |  8.94 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  37    |    35 |    41 |  2.45 |

### test_lines

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  424.9 |   348 |   539 |  62.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  122.6 |    97 |   164 |  27.31 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  630.6 |   308 |   937 | 232.13 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  217.6 |    74 |   349 |  78.21 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  411.1 |   229 |   542 |  86.12 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  266.4 |   197 |   345 |  70.77 |

### lines_of_code

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 | 293.9  |   227 |   359 |  41.2  |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 197    |   173 |   211 |  14.23 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 | 308.27 |   275 |   376 |  36.23 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 | 169    |   113 |   222 |  34.15 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 | 558.7  |   227 |   889 | 184.85 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 | 265.2  |   234 |   320 |  32.51 |

### code_mass

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 | 721.1  |   655 |   792 |  43.97 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 770.2  |   696 |   878 |  73.72 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 | 712.67 |   646 |   896 |  70.77 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 | 616.47 |   519 |   834 |  87.1  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 | 873.9  |   480 |  1152 | 189.3  |
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
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   6.1  |     3 |     8 |  1.91 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   6.6  |     4 |     9 |  2.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   3.07 |     2 |     5 |  0.96 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   4.07 |     2 |     7 |  1.22 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   2.5  |     2 |     4 |  0.71 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   2.6  |     2 |     4 |  0.89 |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   2.46 |  1.85 |  3.09 |  0.37 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   2.77 |  1.95 |  3.91 |  0.74 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   1.48 |  1.13 |  1.92 |  0.24 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   1.86 |  1.25 |  2.43 |  0.35 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   1.25 |  1.06 |  1.45 |  0.14 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   1.24 |  1.08 |  1.75 |  0.29 |

### mccabe_max

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   5.3  |     4 |     7 |  1.16 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   8.4  |     4 |    12 |  3.58 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   3.33 |     3 |     4 |  0.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   4.73 |     3 |     7 |  1.44 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   3    |     3 |     3 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   3.6  |     3 |     4 |  0.55 |

### mccabe_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   2.02 |  1.8  |  2.26 |  0.18 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   2.91 |  2.24 |  3.63 |  0.5  |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   1.57 |  1.4  |  1.77 |  0.11 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   1.74 |  1.36 |  2.25 |  0.27 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   1.38 |  1.22 |  1.73 |  0.14 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   1.37 |  1.26 |  1.52 |  0.09 |

### unit_count

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  16.2  |    14 |    19 |  1.62 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  16.4  |    11 |    22 |  4.83 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  25.87 |    20 |    32 |  4.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  14.6  |     8 |    22 |  4.5  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  35.4  |    15 |    44 |  9.08 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  32.2  |    28 |    39 |  4.66 |

### unit_size_max

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  24.3  |    18 |    30 |  4.14 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  20.2  |    17 |    25 |  3.27 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  17.93 |     9 |    25 |  4.93 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  17.8  |    12 |    23 |  2.93 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  13.9  |    10 |    19 |  2.92 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  15.8  |    12 |    19 |  3.56 |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   7.8  |  6.59 |  9.18 |  0.78 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   7.29 |  5.73 |  9.09 |  1.23 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   5.82 |  4.89 |  7.95 |  0.78 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   6.14 |  4.53 |  8    |  1.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   4.67 |  3.98 |  5.13 |  0.38 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   4.21 |  3.62 |  4.66 |  0.4  |

### unit_size_median

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   5.45 |     4 |     7 |  0.96 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   6.7  |     5 |    11 |  2.54 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   4.63 |     3 |     7 |  1.16 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   5    |     2 |     8 |  1.66 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   3.3  |     3 |     4 |  0.42 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |   3    |     3 |     3 |  0    |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                        | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-no-thinking |  15 |      1601 |    1618 |     98.9 |
| claim-office-example-mapping | exact-ptdd-v1-pi                     | gpt-5-6-sol-codex  |  15 |      1204 |    1209 |     99.6 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-no-thinking |  10 |       945 |     962 |     98.2 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi | gpt-5-6-sol-codex  |   5 |       370 |     370 |    100   |

### duration_seconds

| kata                         | cell_workflow                         | cell_model         |   n |    mean |   min |   max |     std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  298.4  |   200 |   433 |   68.09 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  278.2  |   217 |   316 |   40.71 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 | 1234.4  |   879 |  1999 |  267.31 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 | 1573.93 |   637 |  2208 |  495.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 | 5483.7  |  2678 |  7201 | 1589.67 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 | 4927    |  4434 |  5934 |  610.52 |

### total_tokens

| kata                         | cell_workflow                         | cell_model         |   n |             mean |      min |       max |             std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-----------------:|---------:|----------:|----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |      3.04828e+06 |  1259607 |   5070369 |     1.03858e+06 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 | 335810           |   240067 |    406371 | 65135.9         |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |      2.17703e+07 | 11078090 |  34449879 |     5.99959e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |      6.71986e+06 |   767175 |  11127662 |     4.14218e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |      7.14207e+07 | 32737586 | 106055978 |     2.61465e+07 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |      1.7516e+07  | 15012350 |  24797598 |     4.15925e+06 |

### cost_usd

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   3.47 |  2.18 |  4.83 |  0.85 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   0.6  |  0.49 |  0.71 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  16.38 |  9.39 | 22.71 |  3.65 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   4.67 |  0.46 |  7.47 |  2.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  66.35 | 34.9  | 96.74 | 21.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   5 |  18.27 | 16.41 | 23.6  |  3.05 |

### mutation_score

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   0.93 |  0.82 |  0.98 |  0.05 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |   0.77 |  0.71 |  0.82 |  0.04 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   0.94 |  0.8  |  0.99 |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   0.81 |  0    |  0.94 |  0.23 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |   0.91 |  0.75 |  0.99 |  0.08 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |   0.88 |  0.86 |  0.91 |  0.02 |

### mutants_total

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |  133.3 |   121 |   144 |  8.72 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  204   |   177 |   224 | 17.96 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |  135.2 |   124 |   159 | 10.75 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  128   |   110 |   182 | 20.17 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  147   |    73 |   175 | 29.77 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |  143   |   129 |   171 | 19.58 |

### mutants_survived

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   9.8  |     3 |    26 |  7.67 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  47.6  |    31 |    62 | 11.28 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   8.4  |     1 |    26 |  7.57 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |  23.87 |     8 |   112 | 25.13 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  14.5  |     1 |    37 | 12.86 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |  16.75 |    11 |    24 |  5.44 |

### mutants_no_coverage

| kata                         | cell_workflow                         | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-cc | opus-5-no-thinking |  10 |   1    |     0 |     4 |  1.33 |
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex  |   5 |  12.2  |     0 |    22 |  8.07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-no-thinking |  15 |   4.27 |     0 |    19 |  5.79 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-5-6-sol-codex  |  15 |   4.6  |     0 |    10 |  2.59 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc  | opus-5-no-thinking |  10 |  10    |     0 |    33 | 11.99 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-pi  | gpt-5-6-sol-codex  |   4 |   4    |     3 |     6 |  1.41 |
