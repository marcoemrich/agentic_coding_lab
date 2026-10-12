# RQ-test-list-dimensions-replication — Aggregation

_Does the apparent platform interaction between PTDD v1.5 and v1.6 replicate at n=10 per cell on Claim Office, or was it driven by small-sample variance?_

Generated: 2026-10-12T08:37:44Z

Cells declared: 4 · matched runs: 40 · min_replicates: 10

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc | opus-5-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   0.96 | 0.08 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   0.99 | 0.02 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   1    | 0    |

### tests_passing

| kata                         | cell_workflow                             | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |  10 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   52   | 3.16 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   61.2 | 6.7  |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   35.8 | 1.55 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   42   | 3.59 |

### test_lines

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  457   | 131.76 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  599.1 | 258.57 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |  218.3 |  47.84 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |  220.6 |  71.3  |

### avg_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   5.53 | 0.65 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   5.95 | 0.93 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   5.72 | 0.52 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   6.42 | 1.24 |

### median_loc_per_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   4.55 | 1.12 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   4.7  | 1.27 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   4.35 | 0.58 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   5.3  | 1.96 |

### longest_function

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   17.7 | 6.25 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   18.9 | 5.26 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   16.8 | 1.69 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   18.4 | 2.37 |

### functions

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   25.4 | 3.03 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   25.3 | 4.42 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   15.3 | 4.03 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   13.7 | 4.06 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |    2.8 | 0.63 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |    2.8 | 0.63 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |    3.7 | 0.95 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |    3.9 | 1.1  |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   1.52 | 0.21 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   1.47 | 0.26 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   1.87 | 0.48 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   1.83 | 0.37 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |    3.3 | 0.95 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |    3.3 | 0.48 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |    4.3 | 1.16 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |    5   | 1.56 |

### smell_total

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  661.7 | 26.47 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  714.8 | 70.12 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |  578.2 | 35.65 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |  633.1 | 94.67 |

### production_loc

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  236.2 | 22.51 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  245.7 | 32.92 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |  150.2 | 27.18 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |  152.4 | 28.12 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   45   | 11.21 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   51.5 | 13.81 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   36.2 |  1.32 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   39.2 | 10.54 |

### predictions_correct_rate

| kata                         | cell_workflow                             | cell_model         |   n |    k |    t |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-----:|-----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |  777 |  800 |      0 |     97.1 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 | 1033 | 1044 |      0 |     98.9 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |  713 |  721 |      0 |     98.9 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |  809 |  812 |      0 |     99.6 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 | 1434.6 | 518.37 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 | 1206.1 | 318.12 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 | 1263.4 | 351.01 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 | 1486   | 476.69 |

### total_tokens

| kata                         | cell_workflow                             | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 | 3.03866e+07 | 2.59743e+07 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 | 2.13754e+07 | 7.1087e+06  |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 | 6.58223e+06 | 2.24387e+06 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 | 6.87568e+06 | 4.1366e+06  |

### cost_usd

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  23.12 | 17.33 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  16.1  |  4.28 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   4.78 |  1.43 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   4.76 |  2.55 |

### mutation_score

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |   0.96 | 0.03 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   0.92 | 0.06 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   0.89 | 0.05 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   0.78 | 0.28 |

### mutants_total

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |  125.7 | 10.14 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |  134.1 | 11.57 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |  117.4 | 15.61 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |  130.7 | 23.43 |

### mutants_survived

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |    4.5 |  3.6  |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |   10.4 |  8.68 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |   13.3 |  5.74 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |   27.7 | 30.42 |

### mutants_no_coverage

| kata                         | cell_workflow                             | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-cc | opus-5-no-thinking |  10 |      0 |    1.9 | 3.14 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-cc    | opus-5-no-thinking |  10 |      0 |    5.8 | 6.61 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex  |  10 |      0 |    3.8 | 1.55 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex  |  10 |      0 |    4.9 | 3.07 |
