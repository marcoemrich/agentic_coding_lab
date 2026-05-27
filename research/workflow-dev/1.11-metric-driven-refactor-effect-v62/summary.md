# RQ-metric-driven-refactor-v62 — Aggregation

_Verbessert ein Refactor-Agent, der deterministische Metriken (ESLint smells, SonarJS cognitive complexity, McCabe cyclomatic complexity) selbst pre/post misst und APP-Mass parallel ausweist, die Code-Qualitaet auf claim-office gegenueber dem Baseline-v6.2-with-why-cleaned-Workflow — ohne Korrektheit oder TDD-Disziplin zu beschaedigen?_

Generated: 2026-05-27T19:43:24Z

Cells declared: 2 · matched runs: 13 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-no-thinking | 8 | 8 | ✅ |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cognitive_max

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |    5   |     3 |     8 |  1.77 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |    2.4 |     1 |     4 |  1.34 |

### cognitive_avg

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |   1.91 |  1.25 |  3.69 |  0.75 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |   1.27 |  1    |  1.62 |  0.27 |

### mccabe_max

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |    4.5 |     3 |     5 |  0.76 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |    3   |     2 |     4 |  1    |

### mccabe_avg

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |   1.53 |  1.33 |  2    |  0.2  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |   1.4  |  1.23 |  1.57 |  0.13 |

### cc_longest_function

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |  12.38 |    10 |    15 |  1.41 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |  13    |    10 |    17 |  3.08 |

### cc_avg_loc_per_function

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |   4.22 |  3.8  |  4.75 |  0.3  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |   4.37 |  3.84 |  5.16 |  0.52 |

### smell_total

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |   0.38 |     0 |     2 |  0.74 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |   0    |     0 |     0 |  0    |

### smell_complexity (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |       0 |        0 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |       0 |        0 |

### code_mass

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |  878.5 |   783 |  1066 | 91.44 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |  804.6 |   730 |   876 | 64.33 |

### refactorings_applied

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |  24.88 |    18 |    37 |  6.9  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |  30.4  |    22 |    42 |  8.79 |

### cycle_count

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |  37.38 |    35 |    40 |  1.6  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |  40.2  |    38 |    43 |  2.17 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                    | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |       582 |     599 |     97.2 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |       360 |     402 |     89.6 |

### tests_passed_immediately

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |  15.12 |     1 |    19 |  5.84 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |   7    |     0 |    18 |  9.59 |

### tests_passing (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |   0.96 |  0.73 |     1 |  0.09 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |   0.99 |  0.93 |     1 |  0.03 |

### completed_within_budget (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow                    | cell_model           |   n |    mean |   min |   max |     std |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 | 2530.38 |  2194 |  3285 |  401.16 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 | 5284.2  |  3361 |  9197 | 2336.56 |

### total_tokens

| kata                         | workflow                    | cell_model           |   n |        mean |      min |       max |         std |
|:-----------------------------|:----------------------------|:---------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-7-no-thinking |   8 | 4.44426e+07 | 39301139 |  49093278 | 3.40183e+06 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-7-no-thinking |   5 | 1.02322e+08 | 80885778 | 127606173 | 1.7173e+07  |
