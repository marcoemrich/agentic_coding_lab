# RQ-end-refactor-opus48 — Aggregation

_Haelt der v6.5-end-refactor-Befund aus RQ-1.12 (Korrektheit intakt, Code-Qualitaet >= v6.2, Token-Kosten ~v6.2) auf Opus 4.8 (no-thinking) — oder taeuscht der zusaetzliche End-Refactor-Pass auf dem neuen Modell die claim-office-Vollstaendigkeit aus (Bundle-Bruch-Muster aus RQ-1.9/RQ-1.10)?_

Generated: 2026-05-30T08:24:53Z

Cells declared: 3 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.5-end-refactor | opus-4-8-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |

### tests_passing (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       5 |      100 |

### cognitive_max

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    3.6 |     2 |     5 |  1.14 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    3.6 |     2 |     4 |  0.89 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |

### cognitive_avg

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   1.46 |  1.17 |  1.86 |  0.26 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   1.62 |  1.21 |  2    |  0.29 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   1.4  |  1.08 |  2.25 |  0.49 |

### mccabe_max

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |    4   |     4 |     4 |  0    |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |    3.2 |     3 |     4 |  0.45 |

### mccabe_avg

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   1.47 |  1.36 |  1.62 |  0.12 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   1.48 |  1.35 |  1.8  |  0.19 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   1.47 |  1.3  |  1.75 |  0.17 |

### cc_longest_function

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   24.6 |    12 |    31 |  7.64 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   15.6 |    12 |    19 |  3.05 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   16   |    10 |    21 |  4.74 |

### cc_avg_loc_per_function

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   4.24 |  3.35 |  4.8  |  0.67 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   4.44 |  3.22 |  6.88 |  1.41 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   3.81 |  3.21 |  4.3  |  0.48 |

### smell_total

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |      1 |     0 |     2 |  0.71 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |      0 |     0 |     0 |  0    |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |      0 |     0 |     0 |  0    |

### smell_complexity (rate %)

| kata                         | workflow                    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |       0 |        0 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       0 |        0 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       0 |        0 |

### code_mass

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |  895   |   722 |   964 | 101.84 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |  843   |   769 |   907 |  53.4  |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |  872.6 |   760 |   993 |  91.61 |

### refactorings_applied

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   36   |    16 |    45 | 11.51 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   25.8 |    14 |    45 | 12.44 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   28   |    20 |    40 |  9.3  |

### cycle_count

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   33.6 |    17 |    45 | 12.03 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   40.8 |    34 |    45 |  4.44 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   37.8 |    36 |    40 |  1.79 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                    | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   4 |       298 |     299 |     99.7 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |       408 |     409 |     99.8 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |       376 |     378 |     99.5 |

### tests_passed_immediately

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 |   16.2 |     7 |    26 |  8.04 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 |   12   |     0 |    22 | 11.02 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 |   11.2 |     0 |    20 | 10.26 |

### duration_seconds

| kata                         | workflow                    | cell_model           |   n |   mean |   min |   max |     std |
|:-----------------------------|:----------------------------|:---------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 | 4159.4 |  1846 |  7201 | 1924.8  |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 | 3064.2 |  2130 |  4306 |  836.22 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 | 3220.6 |  2715 |  3642 |  378.15 |

### total_tokens

| kata                         | workflow                    | cell_model           |   n |        mean |      min |       max |         std |
|:-----------------------------|:----------------------------|:---------------------|----:|------------:|---------:|----------:|------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned       | opus-4-8-no-thinking |   5 | 8.22848e+07 | 38381692 | 112785023 | 3.26876e+07 |
| claim-office-example-mapping | v6.4-metric-driven-refactor | opus-4-8-no-thinking |   5 | 9.169e+07   | 53220050 | 137223961 | 3.14582e+07 |
| claim-office-example-mapping | v6.5-end-refactor           | opus-4-8-no-thinking |   5 | 8.89639e+07 | 73892681 | 107756705 | 1.33517e+07 |
