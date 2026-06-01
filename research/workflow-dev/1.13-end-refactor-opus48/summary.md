# RQ-end-refactor-opus48 — Aggregation

_Haelt der v6.5-end-refactor-Befund aus RQ-1.12 (Korrektheit intakt, Code-Qualitaet >= v6.2, Token-Kosten ~v6.2) auf Opus 4.8 (no-thinking) — oder taeuscht der zusaetzliche End-Refactor-Pass auf dem neuen Modell die claim-office-Vollstaendigkeit aus (Bundle-Bruch-Muster aus RQ-1.9/RQ-1.10)?_

Generated: 2026-06-01T21:46:08Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.5-end-refactor | opus-4-8-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.5-end-refactor | opus-4-8-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |

### tests_passing (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |

### cognitive_max

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    3.6 |     2 |     5 |  1.14 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    3.6 |     2 |     4 |  0.89 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    5.6 |     4 |     7 |  1.52 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    3.2 |     2 |     5 |  1.3  |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    2.4 |     1 |     4 |  1.34 |

### cognitive_avg

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   1.46 |  1.17 |  1.86 |  0.26 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   1.62 |  1.21 |  2    |  0.29 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   1.4  |  1.08 |  2.25 |  0.49 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   3.87 |  2.33 |  6    |  1.43 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   2.7  |  1.5  |  4.5  |  1.15 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   2.1  |  1    |  3    |  1.02 |

### mccabe_max

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    4   |     4 |     4 |  0    |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    5   |     4 |     7 |  1.41 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    3.6 |     3 |     5 |  0.89 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    3.4 |     2 |     5 |  1.14 |

### mccabe_avg

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   1.47 |  1.36 |  1.62 |  0.12 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   1.48 |  1.35 |  1.8  |  0.19 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   1.47 |  1.3  |  1.75 |  0.17 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   2.11 |  1.4  |  3.6  |  0.88 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   1.7  |  1.18 |  2.4  |  0.56 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   1.76 |  1.2  |  3.25 |  0.84 |

### cc_longest_function

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   24.6 |    12 |    31 |  7.64 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   15.6 |    12 |    19 |  3.05 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   16   |    10 |    21 |  4.74 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   11.8 |     2 |    19 |  6.5  |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    8.6 |     2 |    14 |  4.67 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    9.4 |     8 |    12 |  1.67 |

### cc_avg_loc_per_function

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   4.24 |  3.35 |  4.8  |  0.67 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   4.44 |  3.22 |  6.88 |  1.41 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   3.81 |  3.21 |  4.3  |  0.48 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   4.89 |  2    |  7.8  |  2.06 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   4.75 |  2    |  7.25 |  2.05 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   4.76 |  3.5  |  6    |  0.89 |

### smell_total

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |      1 |     0 |     2 |  0.71 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |      0 |     0 |     0 |  0    |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |      0 |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |      2 |     0 |     3 |  1.22 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |      0 |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |      0 |     0 |     0 |  0    |

### smell_complexity (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       0 |        0 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       0 |        0 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       0 |        0 |

### code_mass

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |  895   |   722 |   964 | 101.84 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |  843   |   769 |   907 |  53.4  |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |  872.6 |   760 |   993 |  91.61 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |  171.8 |   150 |   198 |  19.41 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |  164.2 |   147 |   172 |   9.96 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |  168.4 |   145 |   194 |  18.01 |

### refactorings_applied

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   36   |    16 |    45 | 11.51 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   25.8 |    14 |    45 | 12.44 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   28   |    20 |    40 |  9.3  |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    5.6 |     3 |     9 |  3.13 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    7.6 |     3 |     9 |  2.61 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    7.2 |     2 |     9 |  2.95 |

### cycle_count

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   33.6 |    17 |    45 | 12.03 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   40.8 |    34 |    45 |  4.44 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   37.8 |    36 |    40 |  1.79 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    8.8 |     8 |     9 |  0.45 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    9   |     8 |    10 |  0.71 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    8.4 |     8 |     9 |  0.55 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                    | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   4 |       298 |     299 |     99.7 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       408 |     409 |     99.8 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       376 |     378 |     99.5 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   4 |        69 |      70 |     98.6 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |        90 |      90 |    100   |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |        83 |      85 |     97.6 |

### tests_passed_immediately

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   16.2 |     7 |    26 |  8.04 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   12   |     0 |    22 | 11.02 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   11.2 |     0 |    20 | 10.26 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    3.8 |     0 |     7 |  3.56 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    0.8 |     0 |     4 |  1.79 |

### duration_seconds

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |     std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 | 4159.4 |  1846 |  7201 | 1924.8  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 | 3064.2 |  2130 |  4306 |  836.22 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 | 3220.6 |  2715 |  3642 |  378.15 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |  579.2 |   453 |   757 |  157.85 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |  679.2 |   452 |   779 |  129.78 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |  746.8 |   534 |   828 |  122.59 |

### total_tokens

| kata                         | workflow                    | cell_model           |   n |        mean |      min |       max |         std |
|:-----------------------------|:----------------------------|:---------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 | 8.22848e+07 | 38381692 | 112785023 | 3.26876e+07 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 | 9.169e+07   | 53220050 | 137223961 | 3.14582e+07 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 | 8.89639e+07 | 73892681 | 107756705 | 1.33517e+07 |
| game-of-life-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 | 7.36288e+06 |  4688656 |   8809447 | 1.67922e+06 |
| game-of-life-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 | 9.18649e+06 |  7683342 |  11019050 | 1.21111e+06 |
| game-of-life-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 | 9.0189e+06  |  7379104 |  10580669 | 1.2145e+06  |
