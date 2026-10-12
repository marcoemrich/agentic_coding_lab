# RQ-model-novel — Aggregation

_How do Fable 5, Opus 4.8, Opus 4.7 and Opus 4.6 (each no-thinking) differ in correctness and code quality on a novel kata with ambiguities that differentiates more strongly than the training-known game-of-life?_

Generated: 2026-10-12T10:46:27Z

Cells declared: 5 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking | 5 | 4 | ⚠️ below min_replicates (4/5) |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking | 5 | 4 | ⚠️ below min_replicates (4/5) |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking | 5 | 4 | ⚠️ below min_replicates (4/5) |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 |   0.85 | 0.1  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 |   0.92 | 0.08 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |   0.92 | 0.09 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   0.67 | 0.36 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 |   0.92 | 0.08 |

### verification_passed

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 |  12.75 | 1.5  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 |  13.75 | 1.26 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |  13.8  | 1.3  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |  10    | 5.33 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 |  13.75 | 1.26 |

### code_mass

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 | 767.5  |  54.42 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 | 866.75 |  70.68 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 | 820.2  |  88.31 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 625.9  | 289.39 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 | 701.25 |  89.15 |

### cognitive_max

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 |    3.5 |  1    |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 |    3   |  0.82 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |    7.4 |  6.11 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   10.5 |  9.44 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 |   25.5 | 23.13 |

### mccabe_max

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 |   3.75 | 0.5  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 |   4    | 1.41 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |   7    | 5.66 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   7.9  | 4.15 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 |  11.25 | 8.38 |

### longest_function

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 |   13   |  2.16 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 |   14.5 |  5.07 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |   28.4 | 11.08 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   25   | 19.7  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 |   55   | 44.69 |

### lines_of_code

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 | 261.25 | 17.02 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 | 347    | 42.72 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 | 303.2  | 37.45 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 194.3  | 87.33 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 | 235.5  | 52.13 |

### smell_total

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 |   0.25 | 0.5  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 |   0.25 | 0.5  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |   1.2  | 1.3  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   1.8  | 3.29 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 |   4.5  | 5.45 |

### tests_passing

| kata                         | cell_workflow         | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |   4 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |   4 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |   4 |      0 |      100 |

### tests_total

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 |  40.5  | 5.07 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 |  50.5  | 5.74 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |  40.6  | 3.65 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |  41.4  | 4.14 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 |  26.75 | 4.65 |

### duration_seconds

| kata                         | cell_workflow         | cell_model                   |   n |   null |    mean |      sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|--------:|--------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 | 7982.75 | 2990.28 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 | 5613.5  |  921.39 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 | 5264.4  |  665.64 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 3692.7  |  942.11 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 | 4169.5  |  649.18 |

### total_tokens

| kata                         | cell_workflow         | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   4 |      0 | 4.25408e+07 | 2.16839e+07 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   4 |      0 | 6.27942e+07 | 1.4532e+07  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 | 6.19949e+07 | 8.80044e+06 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 3.61137e+07 | 7.90853e+06 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   4 |      0 | 3.20958e+07 | 4.91131e+06 |
