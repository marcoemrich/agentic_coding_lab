# RQ-model-novel — Aggregation

_How do Fable 5, Opus 4.8, Opus 4.7 and Opus 4.6 (each no-thinking) differ in correctness and code quality on a novel kata with ambiguities that differentiates more strongly than the training-known game-of-life?_

Generated: 2026-10-20T05:02:44Z

Cells declared: 5 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |   0.84 | 0.09 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |   0.92 | 0.07 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |   0.92 | 0.09 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   0.67 | 0.36 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |   0.93 | 0.08 |

### verification_passed

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |   12.6 | 1.34 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |   13.8 | 1.1  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |   13.8 | 1.3  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   10   | 5.33 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |   14   | 1.22 |

### code_mass

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |  770.4 |  47.57 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |  875.4 |  64.19 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |  820.2 |  88.31 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |  625.9 | 289.39 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |  706.4 |  78.06 |

### cognitive_max

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |    3.6 |  0.89 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |    2.6 |  1.14 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |    7.4 |  6.11 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   10.5 |  9.44 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |   25   | 20.06 |

### mccabe_max

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |    3.8 | 0.45 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |    3.6 | 1.52 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |    7   | 5.66 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |    7.9 | 4.15 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |   13.4 | 8.71 |

### longest_function

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |   13   |  1.87 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |   13.4 |  5.03 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |   28.4 | 11.08 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   25   | 19.7  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |   58.2 | 39.36 |

### lines_of_code

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |  265.8 | 17.91 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |  335.2 | 45.44 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |  303.2 | 37.45 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |  194.3 | 87.33 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |  235.6 | 45.15 |

### smell_total

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |    0.2 | 0.45 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |    0.2 | 0.45 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |    1.2 | 1.3  |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |    1.8 | 3.29 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |    7   | 7.31 |

### tests_passing

| kata                         | cell_workflow         | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 |   41.2 | 4.66 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 |   51.6 | 5.55 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 |   40.6 | 3.65 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 |   41.4 | 4.14 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |   29   | 6.44 |

### duration_seconds

| kata                         | cell_workflow         | cell_model                   |   n |   null |   mean |      sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|-------:|--------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 | 7267   | 3044.31 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 | 5248.6 | 1141.26 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 | 5264.4 |  665.64 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 3692.7 |  942.11 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 | 3411.4 | 1785.96 |

### total_tokens

| kata                         | cell_workflow         | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-subagents-v1-cc | fable-5-no-thinking          |   5 |      0 | 4.52767e+07 | 1.97502e+07 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-5-no-thinking           |   5 |      0 | 6.14048e+07 | 1.29629e+07 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-8-no-thinking         |   5 |      0 | 6.19949e+07 | 8.80044e+06 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking         |  10 |      0 | 3.61137e+07 | 7.90853e+06 |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 | 2.68751e+07 | 1.24246e+07 |
