# RQ-end-refactor-v62 — Aggregation

_Verbessert ein metric-driven Refactor-Pass die Code-Qualitaet gegenueber dem Per-Cycle-Baseline-Workflow (v6.2-with-why-cleaned) — und greift der Hebel als rein per-cycle (v6.4-metric-driven-refactor) oder als zusaetzlicher Whole-src-End-Pass (v6.5-end-refactor) — ohne Korrektheit oder TDD-Disziplin zu beschaedigen, und haelt der Befund ueber zwei Kata-Typen (mehrteilige CLI-Codebasis claim-office vs einteilige Library game-of-life)?_

Generated: 2026-05-30T19:15:26Z

Cells declared: 6 · matched runs: 43 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 15 | 15 | ✅ |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.5-end-refactor | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.5-end-refactor | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cognitive_max

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |    5   |     3 |     8 |  1.77 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |    2.4 |     1 |     4 |  1.34 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |    4   |     1 |    10 |  2.33 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |    2.2 |     1 |     3 |  0.84 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |    3   |     2 |     7 |  2.24 |

### cognitive_avg

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   1.91 |  1.25 |  3.69 |  0.75 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   1.27 |  1    |  1.62 |  0.27 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   1.39 |  1.1  |  1.75 |  0.31 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   2.83 |  1    |  6    |  1.37 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   1.83 |  1    |  2.67 |  0.62 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   2.2  |  1.5  |  4    |  1.04 |

### mccabe_max

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   4.5  |     3 |     5 |  0.76 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   3    |     2 |     4 |  1    |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   3.4  |     3 |     4 |  0.55 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   4.13 |     2 |     6 |  1.13 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   3.4  |     2 |     5 |  1.14 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   3.2  |     3 |     4 |  0.45 |

### mccabe_avg

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   1.53 |  1.33 |  2    |  0.2  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   1.4  |  1.23 |  1.57 |  0.13 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   1.44 |  1.31 |  1.54 |  0.09 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   1.91 |  1.1  |  2.83 |  0.5  |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   1.67 |  1.08 |  3    |  0.8  |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   1.63 |  1.2  |  2.75 |  0.64 |

### cc_longest_function

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  12.38 |    10 |    15 |  1.41 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  13    |    10 |    17 |  3.08 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  11    |    10 |    12 |  0.71 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |  11.47 |     2 |    24 |  5.95 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   8.4  |     5 |    12 |  3.36 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   9.8  |     6 |    13 |  2.59 |

### cc_avg_loc_per_function

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   4.22 |  3.8  |  4.75 |  0.3  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   4.37 |  3.84 |  5.16 |  0.52 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   3.66 |  3.24 |  4.09 |  0.4  |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   4.75 |  1.75 |  7.5  |  1.8  |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   4.66 |  3    |  6.5  |  1.6  |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   4.08 |  2.57 |  6.25 |  1.38 |

### smell_total

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     2 |  0.74 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   2.13 |     0 |     3 |  0.74 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |

### smell_complexity (rate %)

| kata                         | workflow                    | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |       0 |        0 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       0 |        0 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |       0 |        0 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       0 |        0 |

### code_mass

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  878.5 |   783 |  1066 | 91.44 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  804.6 |   730 |   876 | 64.33 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  780.4 |   697 |   862 | 59.94 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |  153.8 |   129 |   178 | 13.63 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  168.4 |   162 |   181 |  7.44 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  168   |   153 |   174 |  8.6  |

### refactorings_applied

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  24.88 |    18 |    37 |  6.9  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  30.4  |    22 |    42 |  8.79 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  23.6  |    15 |    35 |  8.47 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   8.2  |     4 |    10 |  1.61 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   9.4  |     8 |    10 |  0.89 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   9.6  |     9 |    11 |  0.89 |

### cycle_count

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  37.38 |    35 |    40 |  1.6  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  40.2  |    38 |    43 |  2.17 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  35.8  |    29 |    42 |  5.26 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   8.6  |     5 |    10 |  1.18 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   9.4  |     8 |    10 |  0.89 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   9.6  |     9 |    11 |  0.89 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                    | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |       582 |     599 |     97.2 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       360 |     402 |     89.6 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       321 |     340 |     94.4 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |       258 |     258 |    100   |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |        93 |      94 |     98.9 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |        96 |      96 |    100   |

### tests_passed_immediately

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  15.12 |     1 |    19 |  5.84 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   7    |     0 |    18 |  9.59 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  14.6  |     1 |    23 |  8.38 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   0.47 |     0 |     7 |  1.81 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |

### tests_passing (rate %)

| kata                         | workflow                    | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |      15 |      100 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### verification_pct

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   0.96 |  0.73 |     1 |  0.09 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   0.99 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   0.99 |  0.93 |     1 |  0.03 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |

### completed_within_budget (rate %)

| kata                         | workflow                    | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |      15 |      100 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow                    | cell_model                   |   n |    mean |   min |   max |     std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 | 2530.38 |  2194 |  3285 |  401.16 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 | 5284.2  |  3361 |  9197 | 2336.56 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 | 3013.6  |  2255 |  3682 |  685.38 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 |  717.27 |   442 |  1073 |  171.17 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 | 1063.8  |   902 |  1267 |  153.55 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 | 1331.6  |  1134 |  1544 |  148.81 |

### total_tokens

| kata                         | workflow                    | cell_model                   |   n |        mean |      min |       max |              std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|------------:|---------:|----------:|-----------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 | 4.44426e+07 | 39301139 |  49093278 |      3.40183e+06 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 | 1.02322e+08 | 80885778 | 127606173 |      1.7173e+07  |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 | 4.23773e+07 | 34287125 |  47098024 |      5.57341e+06 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |  15 | 8.90504e+06 |  4985045 |  11740349 |      1.69372e+06 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 | 1.09748e+07 |  9227612 |  12375589 |      1.54626e+06 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 | 1.23498e+07 | 11179992 |  13171918 | 963726           |
