# RQ-external-tdd-workflows-opus5 — Aggregation

_Can the inner TDD loop of EXACT Coding be substituted by an externally authored TDD workflow, and what does the substitution cost or buy? Example mapping stays the entry point; only the implement/test/refactor loop is exchanged. Measured on claim-office-example-mapping against the current exact-coding baseline v6.1.1-lab-split-cc — on correctness, code quality, TDD discipline and cost._

Generated: 2026-09-04T08:37:04Z

Cells declared: 3 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v10-pocock-tdd | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   0.96 |  0.93 |     1 |  0.04 |

### tests_passing (rate %)

| kata                         | cell_workflow       | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:--------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow       | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:--------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |       5 |      100 |

### refactorings_applied

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |    4.2 |     1 |    10 |  3.42 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   33   |    21 |    50 | 14.27 |

### tests_passed_immediately

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |    2   |     1 |     4 |  1.22 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   20.4 |     0 |    29 | 11.84 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow       | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |       478 |     480 |     99.6 |

### cycle_count

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |   35.2 |    33 |    39 |  2.28 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |   13.4 |    11 |    16 |  2.51 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   48   |    44 |    50 |  2.55 |

### test_blocks

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |   19   |    16 |    23 |  2.74 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |   13.4 |    11 |    16 |  2.51 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   48.4 |    45 |    50 |  2.07 |

### test_cases_total

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |   36.8 |    30 |    44 |  5.26 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |   45   |    26 |    55 | 11.51 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   49   |    46 |    51 |  2    |

### test_cases_first_block

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |      1 |     1 |     1 |     0 |

### red_verified

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |   18.8 |    16 |    22 |  2.39 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |   12.4 |     7 |    16 |  3.58 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   48.4 |    45 |    50 |  2.07 |

### red_unverified

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |    1   |     0 |     4 |  1.73 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |

### cc_avg_loc_per_function

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |  10.41 |  8.92 | 12.2  |  1.45 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |   7.9  |  7    |  9.23 |  1.15 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   4.49 |  3.97 |  5.24 |  0.54 |

### cc_longest_function

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |   26.6 |    20 |    30 |  4.22 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |   23.4 |    18 |    26 |  3.13 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |   17.6 |    14 |    25 |  4.39 |

### cognitive_max

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |    6.6 |     4 |    10 |  2.41 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |    6.2 |     3 |     8 |  2.17 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |

### mccabe_max

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |    5.4 |     4 |     7 |  1.14 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |    5.2 |     4 |     6 |  1.1  |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |    3.4 |     3 |     4 |  0.55 |

### smell_total

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |

### code_mass

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |  599.8 |   534 |   692 |  59.52 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |  666.4 |   637 |   697 |  25.53 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 |  821.2 |   703 |   963 | 110.71 |

### duration_seconds

| kata                         | cell_workflow       | cell_model         |   n |   mean |   min |   max |     std |
|:-----------------------------|:--------------------|:-------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 |  582.4 |   527 |   681 |   66.41 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 |  548.4 |   483 |   631 |   56.73 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 | 3841   |  2685 |  5923 | 1522.52 |

### total_tokens

| kata                         | cell_workflow       | cell_model         |   n |        mean |      min |       max |         std |
|:-----------------------------|:--------------------|:-------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | v10-pocock-tdd      | opus-5-no-thinking |   5 | 1.18415e+07 | 10765075 |  13356675 | 1.28787e+06 |
| claim-office-example-mapping | v11-superpowers-tdd | opus-5-no-thinking |   5 | 1.21539e+07 | 10955398 |  13993515 | 1.28586e+06 |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking |   5 | 1.26165e+08 | 86741467 | 174612025 | 4.19189e+07 |
