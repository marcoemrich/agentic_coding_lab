# RQ-model-quality-cursor — Aggregation

_How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping?_

Generated: 2026-07-28T03:48:15Z

Cells declared: 3 · matched runs: 10 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-cursor | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |  211.2 |   181 |   246 | 24.59 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |  151.6 |   130 |   180 | 23.2  |

### cognitive_max

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    7.8 |     2 |    12 |  4.27 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    9.2 |     7 |    11 |  1.48 |

### cognitive_avg

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   4.97 |   1.2 |  11   |  3.69 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   7.9  |   4.5 |  10.5 |  2.38 |

### mccabe_max

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    6.2 |     3 |     9 |  2.39 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    7.8 |     6 |     9 |  1.1  |

### mccabe_avg

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   2.4  |  1.43 |   3.6 |  0.85 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   3.47 |  2.75 |   5   |  0.92 |

### cc_longest_function

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   25.4 |    14 |    31 |  6.73 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   21.8 |    20 |    24 |  1.64 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   7.39 |  4.12 |  9.5  |  2.02 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |  11    |  9    | 12.67 |  1.49 |

### cc_median_loc_per_function

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    3.3 |     3 |   3.5 |  0.27 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    8.2 |     4 |  12   |  3.63 |

### lines_of_code

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |   68.2 |    55 |    86 | 11.73 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   39.2 |    33 |    44 |  4.32 |

### smell_total

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    3   |     2 |     4 |  0.71 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    2.8 |     2 |     4 |  0.84 |

### smell_complexity (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       2 |       40 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       1 |       20 |

### smell_magic_numbers

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    2.6 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    2.4 |     2 |     3 |  0.55 |

### smell_duplication (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       1 |       20 |

### verification_pct (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       5 |      100 |

### tests_passing (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    8.4 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    7.8 |     7 |     8 |  0.45 |

### cycle_count

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    7.4 |     5 |     9 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    8.4 |     6 |    11 |  2.07 |

### refactorings_applied

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    3.6 |     2 |     6 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |    5   |     4 |     6 |  0.71 |

### predictions_correct

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    6.4 |     4 |     8 |  1.67 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   14.8 |    10 |    16 |  2.68 |

### predictions_total

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |    6.4 |     4 |     8 |  1.67 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |   14.8 |    10 |    16 |  2.68 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                    | cell_model      |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:----------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                    | cell_model      |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:----------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 |  330.8 |   244 |   534 | 115.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 |  584.8 |   487 |   683 |  88.14 |

### total_tokens

| kata                         | cell_workflow                    | cell_model      |   n |        mean |     min |     max |    std |
|:-----------------------------|:---------------------------------|:----------------|----:|------------:|--------:|--------:|-------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | composer-cursor |   5 | 1.13088e+06 |  799400 | 1537175 | 266402 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | grok-cursor     |   5 | 1.32566e+06 | 1141791 | 1629875 | 198297 |

### cost_usd

_Alle Werte fehlen oder sind nicht numerisch._
