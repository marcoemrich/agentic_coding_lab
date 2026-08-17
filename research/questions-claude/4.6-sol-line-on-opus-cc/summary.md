# RQ-sol-line-on-opus-cc — Aggregation

_Is the native Sol workflow line (basic-sol-tdd, Predictive TDD, Four Rules refactor) better only on Sol/pi, or does it also beat the v-line on Opus with native Claude Code — and does the APP effect that suppresses decomposition on Sol reproduce there?_

Generated: 2026-08-17T10:13:52Z

Cells declared: 6 · matched runs: 31 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v3-basic-tdd | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cc_avg_loc_per_function

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |   6.65 |  5.91 |  7.45 |  0.69 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |   7.86 |  5.9  |  9.57 |  1.6  |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |   8.81 |  6.12 | 10.42 |  1.71 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |   8.9  |  7.44 | 11.54 |  1.65 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |   4.24 |  3.35 |  4.8  |  0.67 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |   4.4  |  3.76 |  4.87 |  0.42 |

### cc_median_loc_per_function

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |   6    |   5   |     7 |  0.71 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |   6.7  |   5   |     8 |  1.4  |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |   7.7  |   5.5 |     9 |  1.48 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |   7.17 |   5   |    10 |  2.32 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |   2    |   2   |     2 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |   2    |   2   |     2 |  0    |

### cc_longest_function

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |  19.4  |    15 |    24 |  3.58 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |  22.4  |    17 |    26 |  4.51 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |  23.4  |    14 |    30 |  6.99 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |  24.33 |    19 |    27 |  2.8  |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |  24.6  |    12 |    31 |  7.64 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |  23.4  |    16 |    32 |  5.81 |

### code_mass

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 | 723.8  |   682 |   769 |  36.38 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 | 631.4  |   582 |   703 |  48.64 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 | 927    |   812 |  1039 | 100.47 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 | 758.17 |   674 |   881 |  95.71 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 | 895    |   722 |   964 | 101.84 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 | 928.8  |   830 |  1025 |  78.78 |

### cognitive_max

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |   4.6  |     3 |     7 |  1.82 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |   3.4  |     3 |     5 |  0.89 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |   7    |     4 |    10 |  2.24 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |   5.33 |     4 |     9 |  1.86 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |   3.6  |     2 |     5 |  1.14 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |   3.6  |     2 |     5 |  1.14 |

### cognitive_avg

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |   1.7  |  1.31 |  2.08 |  0.38 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |   1.91 |  1.58 |  2.25 |  0.27 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |   2.49 |  1.76 |  3.23 |  0.58 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |   2.55 |  2.2  |  3.67 |  0.58 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |   1.46 |  1.17 |  1.86 |  0.26 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |   1.43 |  1.17 |  1.8  |  0.24 |

### mccabe_max

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |   4.4  |     3 |     6 |  1.14 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |   4    |     3 |     5 |  0.71 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |   6    |     5 |     7 |  1    |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |   5.33 |     4 |     7 |  1.03 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |   4    |     3 |     5 |  0.71 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |   3.8  |     3 |     5 |  0.84 |

### smell_total

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |    1   |     0 |     2 |  0.71 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |    0.2 |     0 |     1 |  0.45 |

### verification_pct

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |   0.8  |  0    |     1 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |   0.99 |  0.93 |     1 |  0.03 |

### tests_passing (rate %)

| kata                         | cell_workflow         | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |       6 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow         | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |       6 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |  32.8  |    19 |    50 | 11.19 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |  52.4  |    29 |    92 | 27.04 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |   6    |     4 |     9 |  2    |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |   5.17 |     2 |     8 |  2.32 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |  33.6  |    17 |    45 | 12.03 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |  39.6  |    26 |    46 |  8.02 |

### refactorings_applied

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |   29.6 |    24 |    32 |  3.36 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |   39.8 |    29 |    54 | 10.52 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |    1   |     0 |     2 |  0.71 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |    2   |     1 |     3 |  0.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |   36   |    16 |    45 | 11.51 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |   28   |    22 |    46 | 10.12 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow         | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |       249 |     251 |     99.2 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |       173 |     176 |     98.3 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   4 |       298 |     299 |     99.7 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |       394 |     396 |     99.5 |

### duration_seconds

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |   max |     std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |  958   |   860 |  1038 |   78.24 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 | 1015.8 |   742 |  1606 |  345.44 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |  365.2 |   301 |   460 |   64.15 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |  329.5 |   258 |   453 |   65.09 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 | 4159.4 |  1846 |  7201 | 1924.8  |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 | 3636.6 |  2739 |  5188 |  917.14 |

### total_tokens

| kata                         | cell_workflow         | cell_model           |   n |        mean |      min |       max |              std |
|:-----------------------------|:----------------------|:---------------------|----:|------------:|---------:|----------:|-----------------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 | 2.44804e+07 | 21448540 |  26828143 |      2.53647e+06 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 | 2.60872e+07 | 17445311 |  37322425 |      7.37643e+06 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 | 4.88116e+06 |  4017954 |   5638478 | 679348           |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 | 4.4615e+06  |  3194079 |   5719313 | 834832           |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 | 8.22848e+07 | 38381692 | 112785023 |      3.26876e+07 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 | 1.002e+08   | 71227970 | 118819082 |      1.84425e+07 |

### cost_usd

| kata                         | cell_workflow         | cell_model           |   n |   mean |   min |    max |   std |
|:-----------------------------|:----------------------|:---------------------|----:|-------:|------:|-------:|------:|
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-4-8-no-thinking |   5 |  17.8  | 15.76 |  19.76 |  1.82 |
| claim-office-example-mapping | basic-sol-tdd-cc      | opus-5-no-thinking   |   5 |  17.37 | 12.06 |  24.07 |  4.44 |
| claim-office-example-mapping | v3-basic-tdd          | opus-4-8-no-thinking |   5 |   4.87 |  4.2  |   5.62 |  0.59 |
| claim-office-example-mapping | v3-basic-tdd          | opus-5-no-thinking   |   6 |   3.89 |  2.73 |   4.43 |  0.6  |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking |   5 |  95.6  | 26.44 | 249.03 | 87.64 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-5-no-thinking   |   5 |  59.13 | 42.73 |  69.13 | 10.21 |
