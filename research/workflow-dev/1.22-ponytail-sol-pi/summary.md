# RQ-ponytail-sol-pi — Aggregation

_When Ponytail full is forcibly loaded into the Sol-originated EXACT Coding workflow on pi, does it improve code quality without reducing correctness, test strength, TDD discipline or completion reliability, and at what cost?_

Generated: 2026-09-14T09:50:30Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                   | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |

### mutation_score

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   0.88 |  0.82 |  0.97 |  0.05 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   0.87 |  0.82 |  0.92 |  0.05 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   0.91 |  0.74 |  0.95 |  0.09 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   0.95 |  0.89 |  1    |  0.04 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                   | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |

### code_mass

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  566.6 |   498 |   642 | 51.91 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |  532   |   481 |   575 | 37.85 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  155.4 |   146 |   169 |  9.24 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |  139.8 |   125 |   152 | 12.03 |

### cc_loc

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  131.6 |   108 |   155 | 19.06 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   96.8 |    89 |   116 | 11.69 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   34   |    30 |    39 |  3.32 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   23.4 |    21 |    25 |  1.67 |

### cc_functions

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    8.4 |     6 |    11 |  1.95 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    5.6 |     4 |     8 |  1.52 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4   |     3 |     5 |  0.71 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    2.2 |     1 |     3 |  0.84 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   7.69 |  6.33 |  9.86 |  1.42 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   8.7  |  7.12 | 12    |  1.92 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   6.63 |  4.5  |  8.33 |  1.41 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   9.53 |  6.67 | 17    |  4.27 |

### cc_median_loc_per_function

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    5.7 |     5 |   8   |  1.3  |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    8.5 |     6 |  14.5 |  3.43 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.6 |     3 |   7   |  1.52 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    7.6 |     2 |  17   |  6.19 |

### cc_longest_function

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   17   |    12 |    19 |  2.83 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   17   |    13 |    19 |  2.45 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   13   |     8 |    19 |  4    |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   16.4 |    14 |    18 |  1.52 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     5 |  0.84 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    5.8 |     4 |     8 |  2.05 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.2 |     2 |     6 |  1.79 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    4   |     4 |     4 |  0    |

### cognitive_avg

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   2.16 |  1.67 |  2.5  |  0.36 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   2.69 |  2    |  3.5  |  0.62 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   2.77 |  2    |  3.33 |  0.52 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   2.87 |  2.33 |  3    |  0.3  |

### cognitive_high_count

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.6 |     4 |     5 |  0.55 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    6.2 |     4 |     8 |  1.64 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.4 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    4   |     4 |     4 |  0    |

### mccabe_avg

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   1.95 |  1.68 |  2.47 |  0.31 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   1.95 |  1.43 |  2.33 |  0.33 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   2.06 |  1.75 |  2.5  |  0.3  |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   2    |  2    |  2    |  0    |

### mccabe_high_count

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### smell_total

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### smell_complexity

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### smell_duplication

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### smell_magic_numbers

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### smell_code_quality

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### test_lines

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  192.4 |   162 |   249 | 34.31 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |  199.8 |   156 |   218 | 25.83 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   53.4 |    47 |    69 |  8.99 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   45.2 |    42 |    50 |  2.95 |

### cycle_count

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   32.6 |    29 |    35 |  2.3  |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   31.4 |    25 |    37 |  4.39 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    9.8 |     9 |    11 |  0.84 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    9.6 |     9 |    11 |  0.89 |

### refactorings_applied

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   32.6 |    29 |    35 |  2.3  |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   31.4 |    25 |    37 |  4.39 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    9.8 |     9 |    11 |  0.84 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |    9.6 |     9 |    11 |  0.89 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                   | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       173 |     173 |    100   |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |       140 |     142 |     98.6 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |        50 |      50 |    100   |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |        42 |      42 |    100   |

### tests_passed_immediately

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 | 1158.8 |   939 |  1423 | 200.8  |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 | 1048.8 |   941 |  1173 |  91.76 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  416.8 |   322 |   462 |  56.81 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |  502.8 |   375 |   693 | 119.21 |

### total_tokens

| kata                         | cell_workflow                   | cell_model        |   n |        mean |     min |     max |              std |
|:-----------------------------|:--------------------------------|:------------------|----:|------------:|--------:|--------:|-----------------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 | 4.92493e+06 | 3284793 | 6212995 |      1.07327e+06 |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 | 5.41491e+06 | 4349435 | 7253235 |      1.10447e+06 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 | 1.03646e+06 |  776819 | 1297981 | 213561           |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 | 1.07202e+06 |  921327 | 1218273 | 111657           |

### cost_usd

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   3.65 |  2.82 |  4.7  |  0.7  |
| claim-office-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   4.02 |  3.47 |  5.31 |  0.77 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   1.1  |  0.93 |  1.22 |  0.15 |
| game-of-life-example-mapping | exact-sol-v1.3.1-ponytail-pi    | gpt-5-6-sol-codex |   5 |   1.14 |  1    |  1.35 |  0.13 |
