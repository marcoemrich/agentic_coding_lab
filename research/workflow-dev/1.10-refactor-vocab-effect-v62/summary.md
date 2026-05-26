# RQ-refactor-vocab-v62 — Aggregation

_Verbessert ein additiver Vokabular-Block im refactor-Agent (Cyclomatic + Cognitive Complexity, Single Responsibility, Smell→Move-Tabelle) die Code-Qualitaet auf v6.2-with-why-cleaned-Basis, ohne Korrektheit oder Kosten signifikant zu beeintraechtigen?_

Generated: 2026-05-26T15:00:18Z

Cells declared: 4 · matched runs: 28 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cognitive_max

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |    5   |     3 |     8 |  1.77 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |    2.4 |     1 |     3 |  0.89 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |    4.3 |     1 |    10 |  2.79 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |    4.2 |     2 |     7 |  2.17 |

### cognitive_avg

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   1.91 |  1.25 |  3.69 |  0.75 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   1.52 |  1    |  2    |  0.42 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |   2.9  |  1    |  6    |  1.67 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   2.9  |  2    |  4    |  0.82 |

### mccabe_max

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |    4.5 |     3 |     5 |  0.76 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |    2.8 |     2 |     3 |  0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |    4.2 |     2 |     6 |  1.32 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |    3.8 |     3 |     4 |  0.45 |

### mccabe_avg

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   1.53 |  1.33 |  2    |  0.2  |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   1.49 |  1.36 |  1.67 |  0.13 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |   2.01 |  1.1  |  2.83 |  0.58 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   1.67 |  1.18 |  2.17 |  0.42 |

### cc_longest_function

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  12.38 |    10 |    15 |  1.41 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |  10.2  |     7 |    13 |  2.59 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |  12.2  |     2 |    24 |  6.89 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |  10    |     4 |    15 |  5.61 |

### cc_avg_loc_per_function

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   4.22 |  3.8  |  4.75 |  0.3  |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   4.35 |  3.26 |  5.83 |  1.04 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |   5.2  |  1.75 |  7.5  |  1.98 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   4.42 |  2.14 |  6.6  |  2.15 |

### smell_total

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     2 |  0.74 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |   2.4  |     2 |     3 |  0.52 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   2.2  |     2 |     3 |  0.45 |

### smell_complexity (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       0 |        0 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |       0 |        0 |

### code_mass

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  878.5 |   783 |  1066 |  91.44 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |  372   |   209 |   745 | 232.12 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |  153.3 |   129 |   170 |  13.83 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |  171.6 |   144 |   207 |  26.02 |

### refactorings_applied

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  24.88 |    18 |    37 |  6.9  |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |  12    |     7 |    21 |  6.2  |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |   7.9  |     4 |     9 |  1.85 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   9.2  |     8 |    10 |  0.84 |

### cycle_count

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  37.38 |    35 |    40 |  1.6  |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |  16    |     7 |    35 | 12.31 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |   8.5  |     5 |    10 |  1.35 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   9.2  |     8 |    10 |  0.84 |

### predictions_correct_rate (pooled %)

| kata                         | workflow              | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       582 |     599 |     97.2 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |       153 |     156 |     98.1 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |       170 |     170 |    100   |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |        90 |      92 |     97.8 |

### tests_passing (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### verification_pct

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   0.96 |  0.73 |  1    |  0.09 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   0.23 |  0    |  0.93 |  0.4  |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |   1    |  1    |  1    |  0    |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |  1    |  0    |

### completed_within_budget (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow              | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 | 2530.38 |  2194 |  3285 | 401.16 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 | 1141.6  |   629 |  2328 | 754.24 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 |  627    |   442 |   783 | 117.15 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 |  715.8  |   603 |   779 |  70.48 |

### total_tokens

| kata                         | workflow              | cell_model                   |   n |        mean |      min |      max |         std |
|:-----------------------------|:----------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 | 4.44426e+07 | 39301139 | 49093278 | 3.40183e+06 |
| claim-office-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 | 1.91547e+07 |  7852607 | 43037442 | 1.54978e+07 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |  10 | 8.31736e+06 |  4985045 |  9943890 | 1.61451e+06 |
| game-of-life-example-mapping | v6.2.1-refactor-vocab | opus-4-7-portkey-no-thinking |   5 | 9.60132e+06 |  7392007 | 10716143 | 1.37232e+06 |
