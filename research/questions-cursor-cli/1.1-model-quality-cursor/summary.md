# RQ-model-quality-cursor — Aggregation

_How do the models reachable via the cursor-cli harness (Opus, Composer, Grok) differ in code quality and TDD discipline on game-of-life-example-mapping?_

Generated: 2026-07-26T09:20:43Z

Cells declared: 3 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |  182.2 |   158 |   208 | 18.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |  149.2 |   134 |   183 | 19.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |  141.8 |   133 |   149 |  6.1  |

### cognitive_max

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    8.2 |     3 |    13 |  4.21 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   10.6 |     7 |    15 |  2.88 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |   16.6 |    15 |    17 |  0.89 |

### cognitive_avg

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   5.93 |   2.5 |    12 |  3.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   7.2  |   4.5 |    11 |  2.59 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |  15.3  |   8.5 |    17 |  3.8  |

### mccabe_max

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    7.6 |     5 |    11 |  2.61 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    8.8 |     6 |    10 |  1.64 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |   10.6 |     9 |    11 |  0.89 |

### mccabe_avg

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   2.63 |   2   |   3.5 |  0.61 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   3.38 |   2.4 |   4   |  0.59 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |   4.33 |   3.5 |   6   |  1.02 |

### cc_longest_function

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   23.6 |    16 |    30 |  5.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   21.8 |    19 |    24 |  1.92 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |   23.2 |    22 |    24 |  0.84 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   8.53 |  6.5  | 11.67 |  2.01 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   9.92 |  7.25 | 12    |  1.74 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |  12.6  |  8.33 | 24    |  6.65 |

### cc_median_loc_per_function

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    4.3 |   3.5 |   5.5 |  0.76 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    6.4 |   3.5 |  12   |  3.38 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |    8.6 |   2   |  24   |  9.84 |

### lines_of_code

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   59.2 |    50 |    65 |  5.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   42.8 |    36 |    51 |  5.97 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |   27.8 |    26 |    30 |  1.48 |

### smell_total

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    3.4 |     3 |     4 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    3.6 |     2 |     5 |  1.14 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |    4   |     4 |     4 |  0    |

### smell_complexity

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    0.4 |     0 |     1 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    0.6 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |    2   |     2 |     2 |  0    |

### smell_magic_numbers

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    3   |     3 |     3 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    2.8 |     2 |     3 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |    2   |     2 |     2 |  0    |

### smell_duplication (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       1 |       20 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |       0 |        0 |

### verification_pct (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |       5 |      100 |

### tests_passing (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    9.2 |     9 |    10 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    8.4 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |    8.4 |     8 |     9 |  0.55 |

### cycle_count

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    7.6 |     5 |    10 |  2.41 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    9.6 |     8 |    11 |  1.14 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |    8.4 |     8 |     9 |  0.55 |

### refactorings_applied

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    4   |     3 |     7 |  1.73 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    5.2 |     4 |     7 |  1.1  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |    3   |     3 |     3 |  0    |

### predictions_correct

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    6.8 |     4 |    13 |  4.09 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    9.8 |     6 |    16 |  4.15 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |   18.4 |    16 |    24 |  3.29 |

### predictions_total

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    7   |     4 |    14 |  4.47 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    9.8 |     6 |    16 |  4.15 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |   18.4 |    16 |    24 |  3.29 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |  120.8 |   111 |   133 |  8.96 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |  169.4 |   140 |   184 | 18.13 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |  198   |   169 |   221 | 21.44 |

### total_tokens

| kata                         | cell_workflow                    | cell_model      |   n |             mean |     min |     max |    std |
|:-----------------------------|:---------------------------------|:----------------|----:|-----------------:|--------:|--------:|-------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 | 767959           |  596859 |  932199 | 130466 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |      1.16773e+06 |  745387 | 1564164 | 313913 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor     |   5 |      1.74373e+06 | 1534727 | 1907404 | 138537 |

### cost_usd

_Alle Werte fehlen oder sind nicht numerisch._
