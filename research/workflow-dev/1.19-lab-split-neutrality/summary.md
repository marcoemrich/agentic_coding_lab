# RQ-lab-split-neutrality — Aggregation

_Is v6.1.1-lab-split-cc behaviourally equivalent to v6.1-hybrid-testlist-scope-fix, as the exact-coding baseline recommendation assumes, and if not, does removing the duplicated cycle enumeration restore neutrality? The production files are byte-identical; the rule layout differs (lab infrastructure isolated in rules/lab-only.md, subagent contracts in rules/subagent-prompts.md), and lab-only.md states the Red/Green/Refactor cycle a second time as an imperative chain whose third link makes refactor an unconditional consequence of green. v6.1.4 removes that second statement and keeps the phase-continuation guard._

Generated: 2026-09-04T15:31:42Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1.1-lab-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### refactorings_applied

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   17.4 |     9 |    22 |  5.03 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   33   |    21 |    50 | 14.27 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   26.4 |    19 |    47 | 11.61 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    4.4 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    6.2 |     3 |    10 |  3.11 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    5   |     3 |     9 |  2.45 |

### cycle_count

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   42.8 |    38 |    52 |  5.76 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   48   |    44 |    50 |  2.55 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   46.8 |    39 |    51 |  4.76 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   10.4 |     9 |    13 |  1.52 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   10   |     9 |    11 |  0.71 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   10.4 |     9 |    12 |  1.52 |

### duration_seconds

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |     std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 2660.8 |  2130 |  3256 |  411.31 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 | 3841   |  2685 |  5923 | 1522.52 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 | 3521   |  2948 |  4860 |  764.88 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  620.6 |   509 |   722 |   89.77 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |  687   |   562 |   809 |  106.49 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |  639.8 |   533 |   853 |  130.71 |

### total_tokens

| kata                         | cell_workflow                  | cell_model         |   n |        mean |      min |       max |         std |
|:-----------------------------|:-------------------------------|:-------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 8.18549e+07 | 65109038 | 107931232 | 1.69643e+07 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 | 1.26165e+08 | 86741467 | 174612025 | 4.19189e+07 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 | 1.16502e+08 | 85610683 | 155677876 | 2.51277e+07 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 | 7.99486e+06 |  6503338 |  10565106 | 1.66386e+06 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 | 9.79348e+06 |  8088469 |  12077523 | 1.43493e+06 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 | 9.75839e+06 |  8266007 |  11597131 | 1.29723e+06 |

### verification_pct

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   0.99 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   0.96 |  0.93 |     1 |  0.04 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   0.96 |  0.93 |     1 |  0.04 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                  | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                  | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |       5 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   4.04 |  3.44 |  5    |  0.58 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   4.49 |  3.97 |  5.24 |  0.54 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   4.47 |  3.08 |  6.18 |  1.2  |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   4.54 |  2.83 |  5.33 |  1.03 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   3.05 |  1.88 |  5.11 |  1.39 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   3.17 |  1.86 |  5.6  |  1.52 |

### cc_longest_function

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   17   |    11 |    22 |  4.47 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   17.6 |    14 |    25 |  4.39 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   24   |    15 |    43 | 11.29 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   10.8 |     6 |    15 |  3.27 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    5.4 |     2 |    13 |  4.56 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    6.2 |     2 |    11 |  3.42 |

### cognitive_max

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    2.4 |     1 |     3 |  0.89 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    1.8 |     1 |     3 |  0.84 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    2.4 |     1 |     7 |  2.61 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    2.2 |     1 |     4 |  1.1  |

### mccabe_max

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    3.4 |     3 |     4 |  0.55 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    3.4 |     3 |     4 |  0.55 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    2.8 |     2 |     5 |  1.3  |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    3   |     2 |     4 |  0.71 |

### smell_total

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    1.2 |     0 |     3 |  1.64 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    1.8 |     0 |     3 |  1.64 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    0.8 |     0 |     2 |  1.1  |

### code_mass

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  861.6 |   729 |   999 | 103.54 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |  821.2 |   703 |   963 | 110.71 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |  953.8 |   758 |  1110 | 136.49 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |  181.8 |   142 |   211 |  25.68 |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |  179.6 |   149 |   241 |  35.68 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |  156.2 |   122 |   182 |  25.4  |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                  | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       433 |     433 |    100   |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |       478 |     480 |     99.6 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |       463 |     469 |     98.7 |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |       104 |     104 |    100   |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |       101 |     101 |    100   |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |       103 |     104 |     99   |

### tests_passed_immediately

| kata                         | cell_workflow                  | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |   21.6 |    16 |    31 |  5.77 |
| claim-office-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |   20.4 |     0 |    29 | 11.84 |
| claim-office-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |   24.8 |    20 |    29 |  3.7  |
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-5-no-thinking |   5 |    7.2 |     6 |     9 |  1.1  |
| game-of-life-example-mapping | v6.1.1-lab-split-cc            | opus-5-no-thinking |   5 |    6   |     0 |     8 |  3.39 |
| game-of-life-example-mapping | v6.1.4-continuation-guard-cc   | opus-5-no-thinking |   5 |    6.2 |     0 |    10 |  3.9  |
