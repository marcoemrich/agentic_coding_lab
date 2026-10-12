# RQ-test-list-dimensions-sol-pi — Aggregation

_On GPT-5.6 SOL via pi, does the independent-dimensions test-list cross-check improve the current SOL PTDD default's external completeness without sacrificing its efficiency or product quality?_

Generated: 2026-10-12T10:46:42Z

Cells declared: 2 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                             | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |  10 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   35.8 | 1.55 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |   42   | 3.59 |

### test_lines

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |  218.3 | 47.84 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |  220.6 | 71.3  |

### avg_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   5.72 | 0.52 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |   6.42 | 1.24 |

### median_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   4.35 | 0.58 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |   5.3  | 1.96 |

### longest_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   16.8 | 1.69 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |   18.4 | 2.37 |

### functions

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   15.3 | 4.03 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |   13.7 | 4.06 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |    3.7 | 0.95 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |    3.9 | 1.1  |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   1.87 | 0.48 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |   1.83 | 0.37 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |    4.3 | 1.16 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |    5   | 1.56 |

### smell_total

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |  578.2 | 35.65 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |  633.1 | 94.67 |

### production_loc

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |  150.2 | 27.18 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |  152.4 | 28.12 |

### predictions_correct_rate

| kata                         | cell_workflow                             | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 | 713 | 721 |      0 |     98.9 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 | 809 | 812 |      0 |     99.6 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 | 1263.4 | 351.01 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 | 1486   | 476.69 |

### total_tokens

| kata                         | cell_workflow                             | cell_model        |   n |   null |        mean |          sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 | 6.58223e+06 | 2.24387e+06 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 | 6.87568e+06 | 4.1366e+06  |

### cost_usd

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   4.78 | 1.43 |
| claim-office-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |  10 |      0 |   4.76 | 2.55 |
