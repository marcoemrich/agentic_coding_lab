# RQ-6 — Aggregation

_Verbessern user-story oder example-mapping die Korrektheit gegenüber prose — und hängt der Effekt vom Workflow ab?_

Generated: 2026-05-10T13:01:34Z

Cells declared: 9 · matched runs: 10 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | v3-basic-tdd | opus-4-7-no-thinking | 1 | 1 | ⚠️ unter min_replicates (1/3) |
| claim-office-prose | v4-exact-subagents | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-user-story | v3-basic-tdd | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v4-exact-subagents | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |       1 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   1    |  1    |   1   |   0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   0.78 |  0.33 |   1   |   0.38 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |   1   |   0    |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |   0.2  |  0.2  |   0.2 | nan    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |   0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  11.67 |     5 |    15 |   5.77 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  15    |    15 |    15 |   0    |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |   3    |     3 |     3 | nan    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |     15 |    15 |    15 |   nan |

### code_mass

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 | 1000.33 |   933 |  1058 |  63.06 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  796    |   617 |   902 | 155.89 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  835    |   759 |   883 |  66.57 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |  867    |   867 |   867 | nan    |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  19.33 |    17 |    21 |   2.08 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   1    |     0 |     2 |   1    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   5.33 |     1 |    11 |   5.13 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |   3    |     3 |     3 | nan    |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  53.67 |    34 |    72 |  19.04 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  14.33 |    12 |    16 |   2.08 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  29    |    24 |    39 |   8.66 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |  32    |    32 |    32 | nan    |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  12.67 |     8 |    16 |   4.16 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   7.33 |     4 |    13 |   4.93 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   8.67 |     6 |    11 |   2.52 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |   7    |     7 |     7 | nan    |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  17.33 |    12 |    22 |   5.03 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |   7.67 |     5 |    10 |   2.52 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  10.67 |     8 |    12 |   2.31 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |   9    |     9 |     9 | nan    |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |   3.33 |     3 |     4 |   0.58 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |  45.33 |    43 |    49 |   3.21 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   4    |     2 |     5 |   1.73 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |   3    |     3 |     3 | nan    |

### predictions_correct

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |      0 |     0 |     0 |   0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |     58 |    49 |    65 |   8.19 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |      6 |     4 |     8 |   2    |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |      0 |     0 |     0 | nan    |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   3 |  301.33 |   257 |   356 |  50.3  |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 | 4247    |  3402 |  4780 | 740.09 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |  684.33 |   607 |   822 | 119.53 |
| claim-office-prose           | v3-basic-tdd            | opus-4-7-no-thinking |   1 |  313    |   313 |   313 | nan    |
