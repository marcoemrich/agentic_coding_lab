# RQ-astra-native-sol — Aggregation

_Does the natively-built Sol workflow line (basic-sol-tdd, Predictive TDD) transfer to GPT-6 Astra — or is its advantage over the Opus-derived EXACT line a property of Sol?_

Generated: 2026-10-12T08:37:51Z

Cells declared: 8 · matched runs: 40 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |   0.93 | 0.15 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |   1    | 0    |

### tests_passing

| kata                         | cell_workflow                           | cell_model                    |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |   5 |      0 |      100 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |  27.93 | 14.91 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |   6.17 |  1.59 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |   7.34 |  4.38 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |  12.83 |  7.61 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |   8.45 |  2.41 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |   7.42 |  1.04 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |   7.75 |  1.2  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |   9.52 |  5.69 |

### median_loc_per_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |   26.8 | 17.12 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |    4.8 |  1.48 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |    6.9 |  4.67 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   11.8 |  7.88 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |    6.1 |  1.82 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |    4.5 |  0.87 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |    5.9 |  1.75 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |    6   |  3.67 |

### longest_function

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |   32.6 |  8.76 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |   13.4 |  2.79 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |   14   |  8.09 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   19.8 | 10.73 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |   27   | 11.34 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |   20.8 |  2.39 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |   18.4 |  3.65 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |   24   | 13.17 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |   13.8 | 13.63 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |    3.2 |  0.45 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |    4   |  0.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    5.2 |  0.84 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |   11.4 | 10.01 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |    4.8 |  2.39 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |    4.8 |  2.39 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |    8.2 |  4.66 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |   6.1  | 2.79 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |   2.36 | 0.28 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |   2.48 | 0.4  |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   2.64 | 0.63 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |   3.4  | 1.41 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |   2.1  | 0.29 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |   2.33 | 0.97 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |   3.55 | 2.01 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |    8.6 | 3.65 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |    4.2 | 0.45 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |    5   | 0.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    6.2 | 1.1  |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |    9.8 | 5.36 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |    5.6 | 1.52 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |    5   | 1.87 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |    6.2 | 2.05 |

### smell_total

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |   16.6 | 2.07 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   15.4 | 4.93 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |    4.2 | 9.39 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |    9.6 | 9.02 |

### code_mass

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |  367.6 |  13.76 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |  426.2 |  18.23 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |  440.4 |  34.33 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |  348.2 |  28.61 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |  750   |  83.39 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |  562.6 |  48.81 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |  618   | 145.16 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |  492.4 |  62.7  |

### functions

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |    1.8 | 1.1  |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |    7.4 | 0.89 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |    5.6 | 1.14 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    2.8 | 1.92 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |   14.2 | 3.56 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |    8.4 | 2.3  |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |   11.6 | 5.18 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |    6.6 | 4.51 |

### production_loc

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |   59.4 |  4.62 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |   73.6 |  4.34 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |   72.2 |  7.82 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   58   | 14.18 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |  164   | 21.34 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |  117.6 | 20.21 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |  161   | 61.76 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |  110.4 | 15.24 |

### cycle_count

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |    6.8 | 1.1  |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |   40.4 | 1.67 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |   39.4 | 3.78 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   42.4 | 2.07 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |    3   | 0.71 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |   33.4 | 2.97 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |   33.2 | 3.11 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |   28   | 5.34 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |    0.8 | 0.45 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |   40.4 | 1.67 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |   39.4 | 3.78 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |   23.6 | 1.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |    0.4 | 0.55 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |   33.2 | 2.68 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |   32.2 | 7.56 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |   14.2 | 3.11 |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |    nan |  nan | 227 | 230 |     98.7 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |    nan |  nan | 234 | 236 |     99.2 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |    nan |  nan | 355 | 356 |     99.7 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |    nan |  nan | 137 | 138 |     99.3 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |    nan |  nan | 175 | 176 |     99.4 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |    nan |  nan | 137 | 138 |     99.3 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                    |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 |  343.8 |  44.81 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 | 1801.6 | 107.31 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 | 4186.2 | 483.13 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 | 2565.4 | 226.01 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 |  218.2 |  35.35 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 | 1083.8 | 251.77 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 | 2397.2 | 637.83 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 | 1265.6 | 125.46 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                    |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:------------------------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-6-astra-codex-no-thinking |   5 |      0 | 528580           |  86921.3         |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-6-astra-codex-no-thinking |   5 |      0 |      7.45926e+06 | 681455           |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-6-astra-codex-no-thinking |   5 |      0 |      1.22297e+07 |      2.00114e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |      7.16264e+06 | 789707           |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex             |   5 |      0 | 271849           |  67725.8         |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex             |   5 |      0 |      4.86904e+06 |      1.61694e+06 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi              | gpt-5-6-sol-codex             |   5 |      0 |      7.12622e+06 |      3.95575e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex             |   5 |      0 |      4.60964e+06 | 894835           |
