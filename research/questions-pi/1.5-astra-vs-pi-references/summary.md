# RQ-astra-pi — Aggregation

_On the OpenAI subscription route, how does GPT-6 Astra compare to the strongest references reachable on the pi harness — Sol on the same route, Sol on Requesty in both reasoning states, and Opus 5 on Requesty — at constant harness, workflow, kata and prompt style?_

Generated: 2026-09-05T14:51:06Z

Cells declared: 5 · matched runs: 25 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cognitive_max

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    4.4 |     3 |     7 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    9   |     4 |    17 |  5.57 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |   10.6 |     4 |    17 |  6.11 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    7   |     6 |    11 |  2.24 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |    2.4 |     2 |     4 |  0.89 |

### cognitive_avg

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   2.47 |  2    |  3.5  |  0.62 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   4.87 |  2.33 |  9    |  2.96 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |   5.62 |  2.33 |  9    |  3.25 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   2.96 |  2.75 |  3.33 |  0.29 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |   2.2  |  2    |  3    |  0.45 |

### mccabe_max

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    6.8 |     4 |    11 |  2.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |    8   |     4 |    12 |  3.81 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    4.6 |     4 |     7 |  1.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |    3.4 |     3 |     5 |  0.89 |

### mccabe_avg

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   2.38 |  2    |  2.6  |  0.24 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   2.82 |  2    |  4.67 |  1.08 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |   3.29 |  2.2  |  4    |  0.69 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   3.15 |  2.6  |  3.4  |  0.31 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |   1.31 |  1.18 |  1.75 |  0.24 |

### cc_longest_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   20.8 |    11 |    26 |  6.22 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   18.8 |    13 |    23 |  3.7  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |   21.6 |    16 |    24 |  3.36 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   19.4 |    17 |    25 |  3.21 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |    5.8 |     2 |    11 |  3.63 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |  11.53 |  5.67 |  14.5 |  3.67 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |  14.14 |  6.2  |  23   |  7.05 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |  15.3  | 11.5  |  23   |  4.6  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |  18    | 11    |  25   |  5    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |   2.62 |  2    |   3.5 |  0.62 |

### cc_median_loc_per_function

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   11.1 |   3.5 |  14.5 |  4.56 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   13.7 |   4   |  23   |  7.71 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |   15.3 |  11.5 |  23   |  4.6  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   18   |  11   |  25   |  5    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |    2   |   2   |   2   |  0    |

### smell_total

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    2.4 |     0 |     4 |  1.67 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |    2.8 |     2 |     4 |  1.1  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    2.4 |     2 |     4 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |    2   |     2 |     2 |  0    |

### smell_complexity

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    0.8 |     0 |     2 |  1.1  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |    0.8 |     0 |     2 |  1.1  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |    0   |     0 |     0 |  0    |

### smell_magic_numbers

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    1.6 |     0 |     2 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |    2   |     2 |     2 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |    2   |     2 |     2 |  0    |

### smell_duplication

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |      0 |     0 |     0 |     0 |

### lines_of_code

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |   41.6 |    36 |    51 |  5.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |   30.6 |    24 |    46 |  8.93 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |   27.2 |    24 |    31 |  2.77 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   22.4 |    19 |    27 |  3.44 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |   39.8 |    33 |    45 |  4.38 |

### code_mass

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |  153.2 |   146 |   162 |  6.72 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |  138.8 |   118 |   165 | 16.8  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |  126.4 |    95 |   147 | 21.49 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   99.4 |    87 |   123 | 15.13 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |  151.8 |   139 |   167 | 10.83 |

### verification_pct

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model                    |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    9.8 |     8 |    11 |  1.3  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    8.4 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |    8.4 |     7 |    10 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   14   |    13 |    15 |  0.71 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |   10.2 |    10 |    11 |  0.45 |

### cycle_count

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    9.8 |     8 |    11 |  1.3  |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    8.4 |     8 |     9 |  0.55 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |    8.4 |     7 |    10 |  1.52 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |   14   |    13 |    15 |  0.71 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |   10.2 |    10 |    11 |  0.45 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |    7   |     5 |     9 |  1.58 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |    5   |     3 |     6 |  1.22 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |    4.4 |     3 |     5 |  0.89 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |    4   |     4 |     4 |  0    |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |    3.8 |     3 |     4 |  0.45 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                | cell_model                    |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |        65 |      66 |     98.5 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |        50 |      50 |    100   |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |        43 |      44 |     97.7 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |       118 |     122 |     96.7 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |        32 |      32 |    100   |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model                    |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                | cell_model                    |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |  615.6 |   459 |   732 | 106.46 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 |  252.8 |   170 |   299 |  52.16 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 |  286   |   209 |   342 |  55.93 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 |  496.2 |   476 |   513 |  17.15 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |  436.2 |   346 |   541 |  78.66 |

### total_tokens

| kata                         | cell_workflow                | cell_model                    |   n |             mean |     min |     max |      std |
|:-----------------------------|:-----------------------------|:------------------------------|----:|-----------------:|--------:|--------:|---------:|
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex-no-thinking |   5 |      1.25998e+06 |  845905 | 1581393 | 278297   |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-no-thinking       |   5 | 855358           |  574492 |  995817 | 165796   |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-reasoning         |   5 | 823081           |  712625 |  968650 | 103790   |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | gpt-6-astra-codex-no-thinking |   5 | 970722           |  889517 | 1064367 |  71421.9 |
| game-of-life-example-mapping | v6.2.1-phase-continuation-pi | opus-5-requesty               |   5 |      2.21753e+06 | 1516437 | 2600069 | 414527   |
