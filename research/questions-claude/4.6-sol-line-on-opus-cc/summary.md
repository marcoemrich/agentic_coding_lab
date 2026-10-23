# RQ-sol-line-on-opus-cc — Aggregation

_Is the native Sol workflow line (basic-sol-tdd, Predictive TDD, Four Rules refactor) better only on Sol/pi, or does it also beat the opus line on Opus with native Claude Code — and does the APP effect that suppresses decomposition on Sol reproduce there?_

Generated: 2026-10-19T05:09:13Z

Cells declared: 6 · matched runs: 31 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-sol-v1-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### avg_loc_per_function

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |   8.81 | 1.71 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |   8.9  | 1.65 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |   6.65 | 0.69 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |   7.86 | 1.6  |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |   4.19 | 0.73 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |   4.4  | 0.42 |

### median_loc_per_function

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |   7.7  | 1.48 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |   7.17 | 2.32 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |   6    | 0.71 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |   6.7  | 1.4  |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |   2    | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |   2    | 0    |

### longest_function

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |  23.4  | 6.99 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |  24.33 | 2.8  |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |  19.4  | 3.58 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |  22.4  | 4.51 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |  21.2  | 8.87 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |  23.4  | 5.81 |

### code_mass

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 | 927    | 100.47 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 | 758.17 |  95.71 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 | 723.8  |  36.38 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 | 631.4  |  48.64 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 | 882.2  |  97.6  |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 | 928.8  |  78.78 |

### cognitive_max

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |   7    | 2.24 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |   5.33 | 1.86 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |   4.6  | 1.82 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |   3.4  | 0.89 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |   3.4  | 0.89 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |   3.6  | 1.14 |

### cognitive_avg

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |   2.49 | 0.58 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |   2.55 | 0.58 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |   1.7  | 0.38 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |   1.91 | 0.27 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |   1.49 | 0.27 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |   1.43 | 0.24 |

### mccabe_max

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |   6    | 1    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |   5.33 | 1.03 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |   4.4  | 1.14 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |   4    | 0.71 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |   3.8  | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |   3.8  | 0.84 |

### smell_total

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |    1   | 0.71 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |    0.2 | 0.45 |

### verification_pct

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |   0.8  | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |   0.99 | 0.03 |

### tests_passing

| kata                         | cell_workflow              | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:---------------------------|:---------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |   5 |      0 |      100 |

### predictions_correct_rate

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   0 |      6 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |    nan |  nan | 249 | 251 |     99.2 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |    nan |  nan | 173 | 176 |     98.3 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |    nan |  nan | 375 | 376 |     99.7 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |    nan |  nan | 394 | 396 |     99.5 |

### duration_seconds

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |      sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |  365.2 |   64.15 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |  329.5 |   65.09 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |  958   |   78.24 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 | 1015.8 |  345.44 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 | 3195.8 | 1010.08 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 | 3636.6 |  917.14 |

### total_tokens

| kata                         | cell_workflow              | cell_model           |   n |   null |        mean |               sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 | 4.88116e+06 | 679348           |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 | 4.4615e+06  | 834832           |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 | 2.44804e+07 |      2.53647e+06 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 | 2.60872e+07 |      7.37643e+06 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 | 9.55554e+07 |      3.46819e+07 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 | 1.14529e+08 |      2.19666e+07 |

### cost_usd

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-8-no-thinking |   5 |      0 |   4.87 |  0.59 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc  | opus-5-no-thinking   |   6 |      0 |   3.89 |  0.6  |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-4-8-no-thinking |   5 |      0 |  17.8  |  1.82 |
| claim-office-example-mapping | exact-sol-v1-cc            | opus-5-no-thinking   |   5 |      0 |  17.37 |  4.44 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-no-thinking |   5 |      0 |  71.05 | 24.86 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-5-no-thinking   |   5 |      0 |  76.31 | 15.11 |
