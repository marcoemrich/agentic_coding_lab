# RQ-kata-sphinx-prompt-sensitivity — Aggregation

_Does sphinx-score carry an example-mapping effect — do the pinned examples move correctness relative to the bare prose prompt, and does it do so more sharply than claim-office?_

Generated: 2026-10-12T08:37:33Z

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

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   1    | 0    |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   0.15 | 0.06 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   0.94 | 0.03 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   0.27 | 0    |

### tests_passing

| kata                         | cell_workflow                | cell_model         |   n |   k |   null |   rate_% |
|:-----------------------------|:-----------------------------|:-------------------|----:|----:|-------:|---------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6 |      0 |      100 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   6 |      0 |      100 |

### duration_seconds

| kata                         | cell_workflow                | cell_model         |   n |   null |    mean |     sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|--------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 1475    | 227.02 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 1262.17 | 516.38 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 5514.33 | 716.16 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 3605.17 | 329.99 |

### total_tokens

| kata                         | cell_workflow                | cell_model         |   n |   null |        mean |          sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------------:|------------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 2.51255e+07 | 6.47713e+06 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 2.52834e+07 | 1.48089e+07 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 1.61604e+08 | 2.27384e+07 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 9.48782e+07 | 1.1916e+07  |

### cost_usd

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  20.01 |  4.37 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  19.39 | 10.56 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 109.59 | 15.26 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  66.35 |  8.49 |

### cycle_count

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  11.67 | 2.16 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  15    | 4.47 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  45.83 | 7.08 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  35.67 | 4.08 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  11.67 | 2.16 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   9.83 | 6.18 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  44.5  | 8.02 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  31    | 6.2  |

### lines_of_code

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  57.5  | 11.18 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  43    |  7.64 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 523    | 86.38 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 358.83 | 90.08 |

### code_mass

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 182.83 |  36.22 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 144.17 |  20.67 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 997    |  67.06 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 | 808.33 | 103.39 |

### longest_function

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   5.83 | 1.94 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   6.33 | 1.03 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  13.83 | 3.19 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  11.83 | 2.79 |

### avg_loc_per_function

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   3.54 | 1.11 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   3.28 | 0.85 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   3.19 | 0.23 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   3.09 | 0.23 |

### functions

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   6.5  | 1.64 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   6    | 1.41 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  38    | 5.51 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |  29.33 | 2.94 |

### cognitive_max

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |    1   | 0    |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |    2   | 1.1  |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |    1.5 | 0.55 |

### mccabe_max

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   2    | 0    |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   2    | 0    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   2.83 | 0.75 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |   3    | 0.63 |

### smell_total

| kata                         | cell_workflow                | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |      0 |    0 |
| sphinx-score-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |      0 |    0 |
| claim-office-prose           | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |      0 |    0 |
