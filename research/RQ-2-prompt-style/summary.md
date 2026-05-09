# RQ-2 — Aggregation

_Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität und Korrektheit?_

Generated: 2026-05-09T08:17:46Z

Cells declared: 3 · matched runs: 9 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-user-story | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model                |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   0.98 |  0.93 |  1    |  0.04 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 |   0.29 |  0.2  |  0.4  |  0.1  |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |   0.31 |  0.13 |  0.47 |  0.17 |

### verification_passed

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  14.67 |    14 |    15 |  0.58 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 |   4.33 |     3 |     6 |  1.53 |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |   4.67 |     2 |     7 |  2.52 |

### verification_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 | 159.33 |    81 |   286 | 110.72 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 | 192.33 |    73 |   263 | 103.93 |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 | 102.67 |    70 |   158 |  48.18 |

### smell_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   8    |     2 |    17 |  7.94 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 |   2.67 |     1 |     4 |  1.53 |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |   5    |     1 |    11 |  5.29 |

### cc_longest_function

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  13.67 |    12 |    17 |  2.89 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 |  24.67 |     8 |    36 | 14.74 |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |   9    |     7 |    13 |  3.46 |

### predictions_correct

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  21.33 |    15 |    25 |  5.51 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 |  15    |    11 |    17 |  3.46 |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |  23    |    17 |    31 |  7.21 |

### duration_seconds

| kata                         | workflow           | model                |   n |    mean |   min |   max |     std |
|:-----------------------------|:-------------------|:---------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 | 2914.33 |  1720 |  3526 | 1034.42 |
| claim-office-prose           | v4-exact-subagents | opus-4-7-no-thinking |   3 | 2138.67 |  1879 |  2380 |  251    |
| claim-office-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 | 2928.67 |  2642 |  3284 |  326.46 |
