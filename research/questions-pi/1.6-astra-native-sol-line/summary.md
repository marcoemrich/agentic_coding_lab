# RQ-astra-native-sol — Aggregation

_Does the natively-built Sol workflow line (basic-sol-tdd, Predictive TDD) transfer to GPT-6 Astra — or is its advantage over the Opus-derived EXACT line a property of Sol?_

Generated: 2026-09-05T14:51:05Z

Cells declared: 8 · matched runs: 40 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |   0.93 |  0.67 |     1 |  0.15 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model                    |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model                    |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |   6.6  |  5.25 |  8.5  |  1.18 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |   6.17 |  5.25 |  9    |  1.59 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |   7.75 |  6.77 |  9.71 |  1.2  |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |   7.34 |  4    | 15    |  4.38 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |   8.45 |  6.62 | 12.67 |  2.41 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |  27.93 | 10    | 42    | 14.91 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |   9.52 |  5.75 | 19.33 |  5.69 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |  12.83 |  2    | 21.5  |  7.61 |

### cc_median_loc_per_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |    4.7 |   3.5 |   5   |  0.67 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |    4.8 |   3   |   7   |  1.48 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |    5.9 |   5   |   9   |  1.75 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |    6.9 |   3   |  15   |  4.67 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |    6.1 |   4   |   9   |  1.82 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |   26.8 |   2   |  42   | 17.12 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |    6   |   2   |  12   |  3.67 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   11.8 |   2   |  21.5 |  7.88 |

### cc_longest_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |   18   |    15 |    23 |  3    |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |   13.4 |    11 |    18 |  2.79 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |   18.4 |    14 |    23 |  3.65 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |   14   |     7 |    28 |  8.09 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |   27   |    19 |    47 | 11.34 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |   32.6 |    21 |    42 |  8.76 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |   24   |     9 |    44 | 13.17 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   19.8 |     2 |    29 | 10.73 |

### cognitive_max

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |    4.8 |     2 |     8 |  2.39 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |   11.4 |     4 |    29 | 10.01 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |   13.8 |     5 |    38 | 13.63 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |    8.2 |     4 |    15 |  4.66 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    5.2 |     4 |     6 |  0.84 |

### cognitive_avg

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |   2.15 |  1.89 |  2.43 |  0.19 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |   2.36 |  2.17 |  2.8  |  0.28 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |   2.33 |  1.22 |  3.75 |  0.97 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |   2.48 |  1.86 |  2.83 |  0.4  |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |   3.4  |  2.46 |  5.9  |  1.41 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |   6.1  |  4.25 | 11    |  2.79 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |   3.55 |  2    |  7    |  2.01 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   2.64 |  1.71 |  3.2  |  0.63 |

### mccabe_max

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |    5.4 |     4 |     6 |  0.89 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |    4.2 |     4 |     5 |  0.45 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |    5   |     3 |     7 |  1.87 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |    5   |     4 |     6 |  0.71 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |    9.8 |     6 |    19 |  5.36 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |    8.6 |     6 |    15 |  3.65 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |    6.2 |     4 |     8 |  2.05 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    6.2 |     5 |     7 |  1.1  |

### smell_total

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |    4.2 |     0 |    21 |  9.39 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |   16.6 |    15 |    20 |  2.07 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |    9.6 |     0 |    19 |  9.02 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   15.4 |     9 |    21 |  4.93 |

### code_mass

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |  556.8 |   525 |   651 |  53.01 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |  426.2 |   400 |   444 |  18.23 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |  618   |   491 |   867 | 145.16 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |  440.4 |   403 |   491 |  34.33 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |  750   |   675 |   870 |  83.39 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |  367.6 |   358 |   389 |  13.76 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |  492.4 |   405 |   561 |  62.7  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |  348.2 |   314 |   387 |  28.61 |

### cc_functions

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |    9.8 |     8 |    12 |  1.64 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |    7.4 |     6 |     8 |  0.89 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |   11.6 |     7 |    20 |  5.18 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |    5.6 |     4 |     7 |  1.14 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |   14.2 |     9 |    18 |  3.56 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |    1.8 |     1 |     3 |  1.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |    6.6 |     3 |    12 |  4.51 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    2.8 |     1 |     6 |  1.92 |

### cc_loc

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |  129.4 |   111 |   146 | 13.24 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |   73.6 |    69 |    78 |  4.34 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |  161   |   112 |   268 | 61.76 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |   72.2 |    63 |    84 |  7.82 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |  164   |   141 |   190 | 21.34 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |   59.4 |    53 |    63 |  4.62 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |  110.4 |    90 |   128 | 15.24 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   58   |    43 |    79 | 14.18 |

### cycle_count

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |   31.6 |    19 |    39 |  7.54 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |   40.4 |    39 |    43 |  1.67 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |   33.2 |    30 |    37 |  3.11 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |   39.4 |    35 |    44 |  3.78 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |    3   |     2 |     4 |  0.71 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |    6.8 |     5 |     8 |  1.1  |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |   28   |    22 |    34 |  5.34 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   42.4 |    40 |    45 |  2.07 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |   31.6 |    19 |    39 |  7.54 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |   40.4 |    39 |    43 |  1.67 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |   32.2 |    20 |    40 |  7.56 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |   39.4 |    35 |    44 |  3.78 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |    0.4 |     0 |     1 |  0.55 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |    0.8 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |   14.2 |    11 |    18 |  3.11 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   23.6 |    22 |    26 |  1.52 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                | cell_model                    |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |       138 |     140 |     98.6 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |       227 |     230 |     98.7 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |       175 |     176 |     99.4 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |       234 |     236 |     99.2 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |       137 |     138 |     99.3 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |       355 |     356 |     99.7 |

### duration_seconds

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |  874.2 |   778 |  1013 |  92.43 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 | 1801.6 |  1619 |  1876 | 107.31 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 | 2397.2 |  1518 |  3269 | 637.83 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 | 4186.2 |  3512 |  4759 | 483.13 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 |  218.2 |   167 |   252 |  35.35 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 |  343.8 |   276 |   392 |  44.81 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 | 1265.6 |  1080 |  1386 | 125.46 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 | 2565.4 |  2289 |  2793 | 226.01 |

### total_tokens

| kata                         | cell_workflow                | cell_model                    |   n |             mean |     min |      max |              std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-----------------:|--------:|---------:|-----------------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex             |   5 |      4.60854e+06 | 3370918 |  6055547 |      1.10196e+06 |
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-6-astra-codex-no-thinking |   5 |      7.45926e+06 | 6742072 |  8224138 | 681455           |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-5-6-sol-codex             |   5 |      7.12622e+06 | 2402341 | 11961210 |      3.95575e+06 |
| claim-office-example-mapping | basic-sol-tdd-subagent-pi    | gpt-6-astra-codex-no-thinking |   5 |      1.22297e+07 | 9815548 | 13832398 |      2.00114e+06 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex             |   5 | 271849           |  216962 |   389288 |  67725.8         |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-6-astra-codex-no-thinking |   5 | 528580           |  384612 |   587999 |  86921.3         |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      4.60964e+06 | 3199381 |  5597706 | 894835           |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      7.16264e+06 | 6164562 |  8316040 | 789707           |
