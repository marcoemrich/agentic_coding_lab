# RQ-end-refactor-v62 — Aggregation

_Verbessert ein zusaetzlicher metric-driven End-Refactor-Pass (v6.5-end-refactor) nach Abschluss aller TDD-Cycles die Code-Qualitaet auf claim-office gegenueber dem Per-Cycle-Baseline-Workflow (v6.2-with-why-cleaned) und gegenueber dem rein per-cycle metric-driven Refactor (v6.4-metric-driven-refactor) — ohne Korrektheit oder TDD-Disziplin zu beschaedigen?_

Generated: 2026-05-28T07:04:07Z

Cells declared: 3 · matched runs: 18 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.5-end-refactor | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cognitive_max

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |    5   |     3 |     8 |  1.77 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |    2.4 |     1 |     4 |  1.34 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |

### cognitive_avg

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   1.91 |  1.25 |  3.69 |  0.75 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   1.27 |  1    |  1.62 |  0.27 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   1.39 |  1.1  |  1.75 |  0.31 |

### mccabe_max

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |    4.5 |     3 |     5 |  0.76 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |    3   |     2 |     4 |  1    |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |    3.4 |     3 |     4 |  0.55 |

### mccabe_avg

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   1.53 |  1.33 |  2    |  0.2  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   1.4  |  1.23 |  1.57 |  0.13 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   1.44 |  1.31 |  1.54 |  0.09 |

### cc_longest_function

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  12.38 |    10 |    15 |  1.41 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  13    |    10 |    17 |  3.08 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  11    |    10 |    12 |  0.71 |

### cc_avg_loc_per_function

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   4.22 |  3.8  |  4.75 |  0.3  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   4.37 |  3.84 |  5.16 |  0.52 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   3.66 |  3.24 |  4.09 |  0.4  |

### smell_total

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     2 |  0.74 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |

### smell_complexity (rate %)

| kata                         | workflow                    | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |       0 |        0 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       0 |        0 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       0 |        0 |

### code_mass

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  878.5 |   783 |  1066 | 91.44 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  804.6 |   730 |   876 | 64.33 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  780.4 |   697 |   862 | 59.94 |

### refactorings_applied

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  24.88 |    18 |    37 |  6.9  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  30.4  |    22 |    42 |  8.79 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  23.6  |    15 |    35 |  8.47 |

### cycle_count

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  37.38 |    35 |    40 |  1.6  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |  40.2  |    38 |    43 |  2.17 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  35.8  |    29 |    42 |  5.26 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                    | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |       582 |     599 |     97.2 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       360 |     402 |     89.6 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       321 |     340 |     94.4 |

### tests_passed_immediately

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |  15.12 |     1 |    19 |  5.84 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   7    |     0 |    18 |  9.59 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |  14.6  |     1 |    23 |  8.38 |

### tests_passing (rate %)

| kata                         | workflow                    | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### verification_pct

| kata                         | workflow                    | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |   0.96 |  0.73 |     1 |  0.09 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |   0.99 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |   0.99 |  0.93 |     1 |  0.03 |

### completed_within_budget (rate %)

| kata                         | workflow                    | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow                    | cell_model                   |   n |    mean |   min |   max |     std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 | 2530.38 |  2194 |  3285 |  401.16 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 | 5284.2  |  3361 |  9197 | 2336.56 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 | 3013.6  |  2255 |  3682 |  685.38 |

### total_tokens

| kata                         | workflow                    | cell_model                   |   n |        mean |      min |       max |         std |
|:-----------------------------|:----------------------------|:-----------------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-portkey-no-thinking |   8 | 4.44426e+07 | 39301139 |  49093278 | 3.40183e+06 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-portkey-no-thinking |   5 | 1.02322e+08 | 80885778 | 127606173 | 1.7173e+07  |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-7-portkey-no-thinking |   5 | 4.23773e+07 | 34287125 |  47098024 | 5.57341e+06 |
