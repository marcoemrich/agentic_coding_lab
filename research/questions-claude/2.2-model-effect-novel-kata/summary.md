# RQ-model-novel — Aggregation

_Wie unterscheiden sich Fable 5, Opus 4.8, Opus 4.7 und Opus 4.6 (jeweils no-thinking) in Korrektheit und Code-Qualität auf einer novel Kata mit Mehrdeutigkeiten, die stärker differenziert als die trainingsbekannte game-of-life?_

Generated: 2026-06-11T03:06:10Z

Cells declared: 4 · matched runs: 25 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |   0.83 |  0.73 |  0.93 |  0.1  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   0.93 |  0.8  |  1    |  0.08 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   0.67 |  0.2  |  1    |  0.36 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |   0.92 |  0.8  |  1    |  0.09 |

### verification_passed

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |   12.4 |    11 |    14 |  1.52 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   14   |    12 |    15 |  1.22 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   10   |     3 |    15 |  5.33 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |   13.8 |    12 |    15 |  1.3  |

### code_mass

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |  743.4 |   647 |   812 |  71.59 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |  724.8 |   592 |   819 |  93.45 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |  625.9 |   167 |   932 | 289.39 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |  820.2 |   725 |   931 |  88.31 |

### cognitive_max

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |    4   |     2 |     6 |  1.41 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   22.2 |     4 |    46 | 21.35 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   10.5 |     4 |    30 |  9.44 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |    7.4 |     3 |    18 |  6.11 |

### mccabe_max

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |    4.2 |     3 |     6 |  1.1  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   10.6 |     4 |    19 |  7.4  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |    7.9 |     4 |    14 |  4.15 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |    7   |     4 |    17 |  5.66 |

### cc_longest_function

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |   14.8 |    11 |    22 |  4.44 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   50.8 |    17 |   111 | 39.83 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   25   |    11 |    76 | 19.7  |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |   28.4 |    16 |    39 | 11.08 |

### lines_of_code

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |  257.6 |   237 |   276 | 16.85 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |  233.6 |   200 |   313 | 45.35 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |  194.3 |    48 |   327 | 87.33 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |  303.2 |   253 |   349 | 37.45 |

### smell_total

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |    5.6 |     0 |    11 |  5.32 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |    1.8 |     0 |    10 |  3.29 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |    1.2 |     0 |     3 |  1.3  |

### tests_passing (rate %)

| kata                         | workflow           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |      10 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |       5 |      100 |

### tests_total

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |   40   |    34 |    45 |  4.53 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |   29.4 |    21 |    40 |  7.16 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |   41.4 |    35 |    49 |  4.14 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |   40.6 |    36 |    45 |  3.65 |

### completed_within_budget (rate %)

| kata                         | workflow           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 |       4 |       80 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 |      10 |      100 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow           | cell_model                   |   n |   mean |   min |   max |     std |
|:-----------------------------|:-------------------|:-----------------------------|----:|-------:|------:|------:|--------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 | 7826.4 |  5748 | 12394 | 2613.15 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 | 4415.8 |  3385 |  5401 |  787.02 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 | 3692.7 |  1640 |  4822 |  942.11 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 | 5264.4 |  4227 |  6053 |  665.64 |

### total_tokens

| kata                         | workflow           | cell_model                   |   n |        mean |      min |      max |         std |
|:-----------------------------|:-------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v4-exact-subagents | fable-5-no-thinking          |   5 | 1.34537e+07 |  3162490 | 18013050 | 6.05869e+06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking |   5 | 1.50647e+07 | 13213114 | 18251612 | 1.97916e+06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking         |  10 | 1.3655e+07  |  9411553 | 16548065 | 2.09204e+06 |
| claim-office-example-mapping | v4-exact-subagents | opus-4-8-no-thinking         |   5 | 3.09901e+07 | 24182091 | 37202242 | 5.45598e+06 |
