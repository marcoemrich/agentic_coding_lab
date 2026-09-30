# RQ-kata-sphinx-prompt-sensitivity — Aggregation

_Does sphinx-score carry an example-mapping effect — do the pinned examples move correctness relative to the bare prose prompt, and does it do so more sharply than claim-office?_

Generated: 2026-09-30T21:56:58Z

Cells declared: 4 · matched runs: 24 · min_replicates: 6

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-prose | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-prose | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   0.94 |  0.93 |  1    |  0.03 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   0.27 |  0.27 |  0.27 |  0    |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   1    |  1    |  1    |  0    |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   0.15 |  0.06 |  0.25 |  0.06 |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |

### duration_seconds

| kata                         | cell_workflow                | cell_model         |   n |    mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:-------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 5514.33 |  4856 |  6450 | 716.16 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 3605.17 |  3301 |  4242 | 329.99 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 1475    |  1258 |  1911 | 227.02 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 1262.17 |   784 |  2214 | 516.38 |

### total_tokens

| kata                         | cell_workflow                | cell_model         |   n |        mean |       min |       max |         std |
|:-----------------------------|:-----------------------------|:-------------------|----:|------------:|----------:|----------:|------------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 1.61604e+08 | 145213699 | 206411858 | 2.27384e+07 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 9.48782e+07 |  84690693 | 117006034 | 1.1916e+07  |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 2.51255e+07 |  20215854 |  37623630 | 6.47713e+06 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 2.52834e+07 |  13655286 |  53343237 | 1.48089e+07 |

### cost_usd

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |    max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 109.59 | 99.37 | 139.87 | 15.26 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  66.35 | 59.17 |  82.29 |  8.49 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  20.01 | 16.98 |  28.4  |  4.37 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  19.39 | 10.9  |  39.11 | 10.56 |

### cycle_count

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  45.83 |    36 |    57 |  7.08 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  35.67 |    31 |    41 |  4.08 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  15    |     7 |    20 |  4.47 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  44.5  |    36 |    57 |  8.02 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  31    |    22 |    40 |  6.2  |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   9.83 |     5 |    20 |  6.18 |

### lines_of_code

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 523    |   411 |   618 | 86.38 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 358.83 |   236 |   466 | 90.08 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  57.5  |    47 |    74 | 11.18 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  43    |    36 |    57 |  7.64 |

### code_mass

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 997    |   896 |  1083 |  67.06 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 808.33 |   696 |   954 | 103.39 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 182.83 |   154 |   251 |  36.22 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 144.17 |   110 |   164 |  20.67 |

### cc_longest_function

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  13.83 |    10 |    18 |  3.19 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  11.83 |     8 |    15 |  2.79 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   5.83 |     2 |     7 |  1.94 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6.33 |     5 |     8 |  1.03 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   3.19 |  2.91 |  3.48 |  0.23 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   3.09 |  2.82 |  3.41 |  0.23 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   3.54 |  2    |  5.2  |  1.11 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   3.28 |  2.5  |  4.75 |  0.85 |

### cc_functions

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  38    |    33 |    47 |  5.51 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  29.33 |    27 |    34 |  2.94 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6.5  |     5 |     9 |  1.64 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6    |     4 |     8 |  1.41 |

### cognitive_max

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |    2   |     1 |     3 |  1.1  |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |    1.5 |     1 |     2 |  0.55 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |    1   |     1 |     1 |  0    |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |    1   |     1 |     1 |  0    |

### mccabe_max

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   2.83 |     2 |     4 |  0.75 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   3    |     2 |     4 |  0.63 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     2 |     2 |  0    |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     2 |     2 |  0    |

### smell_total

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
