# RQ-test-list-dimensions-multikata-sol-pi — Aggregation

_Across Game of Life and Sphinx Score on GPT-5.6 SOL/pi, does the v1.6 independent-dimensions test-list cross-check justify its overhead relative to the v1.5 SOL default?_

Generated: 2026-09-16T15:11:06Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   0.99 |  0.94 |     1 |  0.03 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   0.99 |  0.94 |     1 |  0.03 |

### tests_passing (rate %)

| kata                         | cell_workflow                             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                             | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   10.6 |    10 |    11 |  0.55 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   10.8 |    10 |    12 |  0.84 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   11.8 |    11 |    12 |  0.45 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   12   |    11 |    13 |  1    |

### test_lines

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   55   |    47 |    64 |  6.67 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   58.2 |    47 |    71 |  8.53 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |  117.4 |   110 |   131 |  8.02 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |  118.8 |   108 |   133 |  9.78 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   5.55 |  3.75 |   6.5 |  1.07 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   5.91 |  4.33 |   7.4 |  1.35 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   4.71 |  4    |   5.4 |  0.5  |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   5.34 |  4.8  |   6.5 |  0.73 |

### cc_median_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    4.2 |   3   |     5 |  0.84 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    4.7 |   3.5 |     6 |  0.97 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    4.6 |   3   |     6 |  1.14 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    5.2 |   4   |     6 |  0.84 |

### cc_longest_function

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   10.8 |     8 |    13 |  1.92 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   11.8 |     8 |    16 |  3.9  |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    7.2 |     6 |     9 |  1.64 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    8.2 |     7 |    10 |  1.3  |

### cc_functions

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    6.4 |     6 |     8 |  0.89 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    5.8 |     4 |     7 |  1.3  |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    4.8 |     4 |     5 |  0.45 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    4.6 |     4 |     5 |  0.55 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    5   |     3 |     8 |  2    |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     7 |  1.64 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    1   |     1 |     1 |  0    |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    1   |     1 |     1 |  0    |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   2.7  |  1.67 |     4 |  0.87 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   2.25 |  1.6  |     3 |  0.7  |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   1    |  1    |     1 |  0    |

### mccabe_max

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    4.4 |     3 |     6 |  1.14 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    4.8 |     4 |     5 |  0.45 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |    2   |     2 |     2 |  0    |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |    2   |     2 |     2 |  0    |

### smell_total

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |  166.4 |   144 |   201 | 22.74 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |  167.6 |   147 |   194 | 18.7  |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |  143.8 |   117 |   159 | 18.62 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |  150   |   139 |   166 | 11.25 |

### cc_loc

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   43.6 |    40 |    50 |  4.1  |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   42.6 |    36 |    47 |  4.16 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   41   |    37 |    50 |  5.34 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   47.6 |    38 |    58 |  7.27 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   10.6 |    10 |    11 |  0.55 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   10.8 |    10 |    12 |  0.84 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   12.2 |    11 |    13 |  0.84 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   12   |    11 |    13 |  1    |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                             | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       108 |     108 |    100   |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       113 |     113 |    100   |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |       118 |     118 |    100   |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |       117 |     120 |     97.5 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |  509   |   464 |   602 | 57.31 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |  536.6 |   455 |   578 | 48.34 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |  712.8 |   625 |   834 | 78.29 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |  640.6 |   550 |   699 | 61.74 |

### total_tokens

| kata                         | cell_workflow                             | cell_model        |   n |        mean |     min |     max |    std |
|:-----------------------------|:------------------------------------------|:------------------|----:|------------:|--------:|--------:|-------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 | 1.03397e+06 |  267624 | 1440021 | 450177 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 | 1.39053e+06 | 1190511 | 1785459 | 252321 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 | 2.25319e+06 | 2038598 | 2438884 | 178114 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 | 1.9196e+06  | 1594756 | 2284317 | 279236 |

### cost_usd

| kata                         | cell_workflow                             | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   1.07 |  0.23 |  1.5  |  0.49 |
| game-of-life-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   1.36 |  1.18 |  1.68 |  0.23 |
| sphinx-score-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |   5 |   2.12 |  1.98 |  2.37 |  0.15 |
| sphinx-score-example-mapping | exact-sol-v1.6-test-list-dimensions-pi    | gpt-5-6-sol-codex |   5 |   1.86 |  1.52 |  2.31 |  0.3  |
