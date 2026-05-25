# RQ-v62-cleanup-validation-gol — Aggregation

_Generalisiert das Cleanup-Aequivalenz-Ergebnis aus RQ-1.6 (claim-office) auch auf die trainings-bekannte game-of-life-Kata, oder zeigt v6.2-with-why-cleaned dort einen anderen Effekt als auf claim-office?_

Generated: 2026-05-25T07:50:59Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.1-with-why | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |  151   |   139 |   166 | 11.25 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |  148.8 |   141 |   161 |  9.86 |

### smell_total

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |    2.8 |     2 |     4 |  0.84 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |    2.6 |     2 |     3 |  0.55 |

### cc_longest_function

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |    9.4 |     2 |    22 |  8.29 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |    9.4 |     2 |    18 |  6.8  |

### cognitive_max

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |    4.8 |     1 |    15 |  5.81 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |    2.8 |     1 |     4 |  1.1  |

### mccabe_max

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |    4.6 |     2 |    10 |  3.13 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |    3.6 |     2 |     5 |  1.14 |

### tests_passing (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### predictions_correct_rate (pooled %)

| kata                         | workflow              | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |        83 |      84 |     98.8 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |        90 |      90 |    100   |

### refactorings_applied

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |    6.4 |     2 |     9 |  3.21 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |    7.8 |     4 |     9 |  2.17 |

### tests_passed_immediately

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |    2.2 |     0 |     6 |  3.03 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |    1.4 |     0 |     7 |  3.13 |

### cycle_count

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |    8.4 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |    9   |     8 |    10 |  0.71 |

### duration_seconds

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 |  568.6 |   321 |   713 | 171.02 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 |  643.6 |   452 |   783 | 139.59 |

### total_tokens

| kata                         | workflow              | cell_model                   |   n |        mean |     min |     max |         std |
|:-----------------------------|:----------------------|:-----------------------------|----:|------------:|--------:|--------:|------------:|
| game-of-life-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   5 | 7.56447e+06 | 4907326 | 9546565 | 1.88171e+06 |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   5 | 8.66639e+06 | 6928039 | 9943890 | 1.57433e+06 |
