# RQ-route-effect-pi — Aggregation

_How does routing one and the same model (GPT-5.6 Sol) through Requesty versus the OpenAI subscription affect code quality, TDD discipline, throughput and correctness, at constant harness, workflow, kata and prompt style?_

Generated: 2026-08-16T06:18:05Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### duration_seconds

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |  615.6 |   459 |   732 | 106.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |  252.8 |   170 |   299 |  52.16 |

### total_tokens

| kata                         | cell_workflow                | cell_model                    |   n |             mean |    min |     max |    std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-----------------:|-------:|--------:|-------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      1.25998e+06 | 845905 | 1581393 | 278297 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 | 855358           | 574492 |  995817 | 165796 |

### code_mass

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |  153.2 |   146 |   162 |  6.72 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |  138.8 |   118 |   165 | 16.8  |

### cognitive_max

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    4.4 |     3 |     7 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    9   |     4 |    17 |  5.57 |

### cognitive_avg

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   2.47 |  2    |   3.5 |  0.62 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   4.87 |  2.33 |   9   |  2.96 |

### mccabe_max

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    6.8 |     4 |    11 |  2.77 |

### mccabe_avg

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   2.38 |     2 |  2.6  |  0.24 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   2.82 |     2 |  4.67 |  1.08 |

### cc_longest_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   20.8 |    11 |    26 |  6.22 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   18.8 |    13 |    23 |  3.7  |

### cc_avg_loc_per_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |  11.53 |  5.67 |  14.5 |  3.67 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |  14.14 |  6.2  |  23   |  7.05 |

### cc_median_loc_per_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   11.1 |   3.5 |  14.5 |  4.56 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   13.7 |   4   |  23   |  7.71 |

### lines_of_code

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   41.6 |    36 |    51 |  5.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   30.6 |    24 |    46 |  8.93 |

### smell_total

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    2.4 |     0 |     4 |  1.67 |

### smell_complexity

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    0   |     0 |     0 |   0   |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    0.8 |     0 |     2 |   1.1 |

### smell_magic_numbers

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    1.6 |     0 |     2 |  0.89 |

### smell_duplication (rate %)

| kata                         | cell_workflow                | cell_model                    |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |       0 |        0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |       0 |        0 |

### verification_pct (rate %)

| kata                         | cell_workflow                | cell_model                    |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |       5 |      100 |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model                    |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    9.8 |     8 |    11 |  1.3  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    8.4 |     8 |     9 |  0.55 |

### cycle_count

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    9.8 |     8 |    11 |  1.3  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    8.4 |     8 |     9 |  0.55 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      7 |     5 |     9 |  1.58 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      5 |     3 |     6 |  1.22 |

### predictions_correct

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |     13 |     9 |    16 |  2.65 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |     10 |     6 |    12 |  2.45 |

### predictions_total

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   13.2 |    10 |    16 |  2.28 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   10   |     6 |    12 |  2.45 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model                    |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |       5 |      100 |

### cost_usd

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   1.08 |  0.82 |  1.24 |  0.17 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   0.96 |  0.67 |  1.13 |  0.18 |
