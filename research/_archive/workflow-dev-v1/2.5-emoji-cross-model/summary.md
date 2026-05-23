# RQ-emoji-cross-model — Aggregation

_Replizieren die RQ-emoji-Befunde (Emojis ohne Code-Qualitaets-Effekt, Tokens -5%) auch auf sonnet-4-6 und opus-4-6, oder ist der Effekt opus-4-7-spezifisch?_

Generated: 2026-05-22T16:38:12Z

Cells declared: 6 · matched runs: 40 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6-hybrid | sonnet-4-6-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6-hybrid | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |   32.6 |     0 |   163 | 72.9  |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |   33.2 |     0 |   128 | 55.49 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |   40.2 |     0 |   201 | 89.89 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |  158.3 |   145 |   178 | 12.5  |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |   59.4 |     8 |   153 | 54.84 |

### smell_total

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |    0.8 |     0 |     4 |  1.79 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |    0.8 |     0 |     2 |  1.1  |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |    2.5 |     2 |     4 |  0.71 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |    2.4 |     0 |     6 |  2.19 |

### cc_longest_function

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |    2.6 |     0 |    13 |  5.81 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |    5   |     0 |    20 |  8.66 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |    5.2 |     0 |    26 | 11.63 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |   12.8 |     4 |    22 |  6.2  |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |    7.2 |     3 |    16 |  5.36 |

### cognitive_max

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |    2.4 |     0 |    12 |  5.37 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |    2.2 |     0 |     9 |  3.9  |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |    1.8 |     0 |     9 |  4.02 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |    5.3 |     1 |    15 |  4.03 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |    4.2 |     0 |    15 |  6.1  |

### mccabe_max

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |    1.4 |     0 |     7 |  3.13 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |    2.4 |     0 |     8 |  3.58 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |    1.2 |     0 |     6 |  2.68 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |    4.3 |     2 |     9 |  1.95 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |    4   |     1 |     7 |  2.12 |

### refactorings_applied

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |    4   |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |    1.6 |     0 |     5 |  2.3  |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |    3.3 |     2 |     4 |  0.67 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |    4.4 |     3 |     6 |  1.34 |

### cycle_count

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |    1.8 |     0 |     8 |  3.49 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |    1.6 |     0 |     5 |  2.3  |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |    2.6 |     1 |     9 |  3.58 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |    8.3 |     7 |    10 |  1.06 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |    5.6 |     3 |     9 |  2.19 |

### predictions_correct_rate (pooled %)

| kata                         | workflow      | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------|:-----------------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |       169 |     170 |     99.4 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   2 |        13 |      16 |     81.2 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   1 |        18 |      18 |    100   |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |       164 |     168 |     97.6 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |        49 |      54 |     90.7 |

### tests_passed_immediately

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |    1.2 |     0 |     6 |  2.68 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |    0.8 |     0 |     3 |  1.3  |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |    1.2 |     0 |     6 |  2.68 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |    4   |     0 |     7 |  2.91 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |    3.2 |     0 |     6 |  2.17 |

### duration_seconds

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |  158.6 |    40 |   616 | 255.72 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |  521.4 |   427 |   711 |  95.48 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |  187.2 |    23 |   497 | 225.57 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |  187.6 |    48 |   738 | 307.69 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |  485.8 |   357 |   605 |  82.21 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |  443.4 |   257 |   542 | 114.95 |

### total_tokens

| kata                         | workflow      | cell_model                   |   n |        mean |     min |     max |              std |
|:-----------------------------|:--------------|:-----------------------------|----:|------------:|--------:|--------:|-----------------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 | 1.6829e+06  |  499928 | 6369052 |      2.61968e+06 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 | 6.62354e+06 | 4863281 | 8557921 |      1.31893e+06 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 | 1.3806e+06  |  226844 | 3332035 |      1.5339e+06  |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 | 2.196e+06   |  570264 | 8632745 |      3.59829e+06 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 | 6.27083e+06 | 4689099 | 7634242 | 910467           |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 | 3.31564e+06 | 1941724 | 4873942 |      1.09759e+06 |

### tests_passing (rate %)

| kata                         | workflow      | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:--------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |       1 |       20 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |       2 |       40 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |       1 |       20 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |       5 |      100 |

### verification_pct

| kata                         | workflow      | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |   0.2  |   0   |     1 |  0.45 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |   0.28 |   0   |     1 |  0.44 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |   0.2  |   0   |     1 |  0.45 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |   1    |   1   |     1 |  0    |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |   0.48 |   0.2 |     1 |  0.3  |

### completed_within_budget (rate %)

| kata                         | workflow      | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:--------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking         |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid     | sonnet-4-6-no-thinking       |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking         |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.4-no-emoji | sonnet-4-6-no-thinking       |   5 |       5 |      100 |
