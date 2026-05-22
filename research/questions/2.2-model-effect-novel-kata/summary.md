# RQ-3b — Aggregation

_Wie unterscheiden sich Opus 4.7 und Opus 4.6 (jeweils no-thinking) in Korrektheit und Code-Qualität auf einer novel Kata mit Mehrdeutigkeiten, die stärker differenziert als die trainingsbekannte game-of-life?_

Generated: 2026-05-19T19:00:48Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   0.93 |   0.8 |     1 |  0.08 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   0.67 |   0.2 |     1 |  0.36 |

### verification_passed

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |     14 |    12 |    15 |  1.22 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |     10 |     3 |    15 |  5.33 |

### code_mass

| kata                         | workflow           | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |  724.8 |   592 |   819 |  93.45 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |  625.9 |   167 |   932 | 289.39 |

### cognitive_max

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   22.2 |     4 |    46 | 21.35 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   10.5 |     4 |    30 |  9.44 |

### mccabe_max

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   10.6 |     4 |    19 |  7.4  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |    7.9 |     4 |    14 |  4.15 |

### cc_longest_function

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   50.8 |    17 |   111 | 39.83 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   25   |    11 |    76 | 19.7  |

### lines_of_code

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |  233.6 |   200 |   313 | 45.35 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |  194.3 |    48 |   327 | 87.33 |

### smell_total

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |    5.6 |     0 |    11 |  5.32 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |    1.8 |     0 |    10 |  3.29 |

### tests_passing (rate %)

| kata                         | workflow           | model                        |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |      10 |      100 |

### tests_total

| kata                         | workflow           | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   29.4 |    21 |    40 |  7.16 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   41.4 |    35 |    49 |  4.14 |

### completed_within_budget (rate %)

| kata                         | workflow           | model                        |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |      10 |      100 |

### duration_seconds

| kata                         | workflow           | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 | 4415.8 |  3385 |  5401 | 787.02 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 | 3692.7 |  1640 |  4822 | 942.11 |

### total_tokens

| kata                         | workflow           | model                        |   n |        mean |      min |      max |         std |
|:-----------------------------|:-------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 | 1.50647e+07 | 13213114 | 18251612 | 1.97916e+06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 | 1.3655e+07  |  9411553 | 16548065 | 2.09204e+06 |
