# RQ-model-quality — Aggregation

_How strongly do the available models (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality on a training-known kata under the strongest workflow?_

Generated: 2026-10-12T10:46:27Z

Cells declared: 12 · matched runs: 44 · min_replicates: 3

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking | 4 | 4 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6 | 3 | 3 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking | 3 | 3 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 | 163    | 13.08 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 | 163.33 | 17.9  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 | 172.67 | 33.01 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 | 149.33 | 10.6  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 | 145.33 | 11.02 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 | 190.5  | 18.48 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 | 159    |  5.29 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 166.6  | 17.65 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 | 173    | 29.6  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 | 175.67 | 43.56 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 | 178    | 24.27 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 | 166.67 |  2.89 |

### smell_total

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 |   3    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 |   2.33 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 |   1.67 | 1.53 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 |   2.67 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 |   2.67 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 |   3    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |   2.33 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   2.6  | 0.7  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |   4.33 | 1.53 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 |   4.33 | 1.53 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |   5.67 | 2.52 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 |   3.33 | 0.58 |

### longest_function

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 |   8.33 | 2.08 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 |   6.67 | 2.52 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 |   6.33 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 |   5.33 | 1.15 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 |   4.33 | 4.04 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 |  11.5  | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |   7    | 7    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   8.1  | 4.04 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |  19.33 | 6.11 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 |  18.67 | 7.51 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |  21.67 | 9.81 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 |  15    | 7.81 |

### production_loc

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 |  29.33 | 2.52 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 |  29.33 | 8.5  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 |  37.33 | 4.16 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 |  32    | 4.36 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 |  31.33 | 6.66 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 |  40.75 | 5.12 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |  25.67 | 1.15 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |  31.1  | 6.74 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |  28.33 | 7.37 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 |  31.33 | 8.14 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |  32.67 | 4.73 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 |  31.33 | 3.06 |

### mccabe_max

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 |   2    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 |   2.67 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 |   3    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 |   2.67 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 |   4.33 | 1.53 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 |   4.25 | 0.96 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |   3.33 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   4.5  | 2.42 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |   6.67 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 |   7.67 | 3.06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |   6.33 | 2.08 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 |   6    | 3.46 |

### cognitive_max

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 |   1.67 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 |   2    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 |   1.67 | 0.58 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 |   5.33 | 2.08 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 |   4.75 | 2.63 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |   3    | 1    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   4.4  | 4.48 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |  12    | 3    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 |  13    | 5.29 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |  11    | 7.81 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 |   5    | 5.2  |

### tests_passing

| kata                         | cell_workflow         | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |   4 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |  10 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |   3 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 |   0.73 | 0.46 |

### verification_passed

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |     15 | 0    |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 |     11 | 6.93 |

### verification_total

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 |     15 |    0 |

### duration_seconds

| kata                         | cell_workflow         | cell_model                   |   n |   null |    mean |     sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|--------:|-------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 | 1269    | 204.11 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 | 1158    | 169.28 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 | 1526.33 | 285.81 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 | 1467.67 |  65.06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 | 1017    | 221.7  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 | 1045.5  |  73.89 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 |  827.67 | 211.4  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 1162.9  | 984.46 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 |  956.33 | 125.79 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 | 1160.67 | 461.09 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 |  846.33 |  46.09 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 | 1116.67 |  82.65 |

### total_tokens

| kata                         | cell_workflow         | cell_model                   |   n |   null |        mean |               sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------------:|-----------------:|
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5                      |   3 |      0 | 8.95879e+06 |      1.07659e+06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   3 |      0 | 7.81926e+06 | 489998           |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5                       |   3 |      0 | 1.29582e+07 |      2.58382e+06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   3 |      0 | 1.31571e+07 |      1.06383e+06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8                     |   3 |      0 | 8.63911e+06 | 727177           |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   4 |      0 | 9.3722e+06  | 703636           |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7                     |   3 |      0 | 7.63811e+06 |      1.6926e+06  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 7.28733e+06 |      1.0652e+06  |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey             |   3 |      0 | 6.64428e+06 | 564299           |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   3 |      0 | 8.34565e+06 |      3.48854e+06 |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6                   |   3 |      0 | 6.41847e+06 | 239175           |
| game-of-life-example-mapping | exact-subagents-v1-cc | sonnet-4-6-no-thinking       |   3 |      0 | 6.71601e+06 |      1.17305e+06 |
