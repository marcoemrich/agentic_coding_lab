# RQ-test-list-dimensions-multikata-sol-pi — Aggregation

_Across Game of Life and Sphinx Score on GPT-5.6 SOL/pi, does the v1.6 independent-dimensions test-list cross-check justify its overhead relative to the v1.5 SOL default?_

Generated: 2026-10-12T08:37:52Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   0.99 | 0.03 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   0.99 | 0.03 |

### tests_passing

| kata                         | cell_workflow                             | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   10.6 | 0.55 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   11.8 | 0.45 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   10.8 | 0.84 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   12   | 1    |

### test_lines

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   55   | 6.67 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  117.4 | 8.02 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   58.2 | 8.53 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |  118.8 | 9.78 |

### avg_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   5.55 | 1.07 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   4.71 | 0.5  |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   5.91 | 1.35 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   5.34 | 0.73 |

### median_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 0.84 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 1.14 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    4.7 | 0.97 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    5.2 | 0.84 |

### longest_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   10.8 | 1.92 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    7.2 | 1.64 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   11.8 | 3.9  |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    8.2 | 1.3  |

### functions

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    6.4 | 0.89 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4.8 | 0.45 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    5.8 | 1.3  |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 0.55 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    5   | 2    |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    1   | 0    |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.64 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    1   | 0    |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   2.7  | 0.87 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   2.25 | 0.7  |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |

### mccabe_max

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4.4 | 1.14 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    2   | 0    |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    4.8 | 0.45 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |    2   | 0    |

### smell_total

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  166.4 | 22.74 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  143.8 | 18.62 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |  167.6 | 18.7  |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |  150   | 11.25 |

### production_loc

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   43.6 | 4.1  |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   41   | 5.34 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   42.6 | 4.16 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   47.6 | 7.27 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   10.6 | 0.55 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   12.2 | 0.84 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   10.8 | 0.84 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   12   | 1    |

### predictions_correct_rate

| kata                         | cell_workflow                             | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 | 108 | 108 |      0 |    100   |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 | 118 | 118 |      0 |    100   |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 | 113 | 113 |      0 |    100   |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 | 117 | 120 |      0 |     97.5 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  509   | 57.31 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  712.8 | 78.29 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |  536.6 | 48.34 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |  640.6 | 61.74 |

### total_tokens

| kata                         | cell_workflow                             | cell_model        |   n |   null |        mean |     sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------------:|-------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 | 1.03397e+06 | 450177 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 | 2.25319e+06 | 178114 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 | 1.39053e+06 | 252321 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 | 1.9196e+06  | 279236 |

### cost_usd

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1.07 | 0.49 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   2.12 | 0.15 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   1.36 | 0.23 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |   1.86 | 0.3  |
