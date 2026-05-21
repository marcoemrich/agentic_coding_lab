# RQ-20 — Aggregation

_Verbessert die v4.1-testlist-scope-fix-Variante die verification_pct auf claim-office-example-mapping gegenüber v4-exact-subagents — und gilt der Effekt konsistent über Opus 4.7 (Direct API) und Opus 4.6 (Portkey)?_

Generated: 2026-05-21T17:48:33Z

Cells declared: 4 · matched runs: 24 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking | 4 | 4 | ⚠️ unter min_replicates (4/5) |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |   0.93 |   0.8 |     1 |  0.08 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |   0.67 |   0.2 |     1 |  0.36 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking |   5 |   0.93 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking         |   4 |   0.95 |   0.8 |     1 |  0.1  |

### verification_passed

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |  14    |    12 |    15 |  1.22 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |  10    |     3 |    15 |  5.33 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking |   5 |  14    |    12 |    15 |  1.41 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking         |   4 |  14.25 |    12 |    15 |  1.5  |

### tests_passing (rate %)

| kata                         | workflow                | model                        |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |      10 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking         |   4 |       4 |      100 |

### cycle_count

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |  29.4  |    21 |    40 |  7.16 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |  37.8  |    16 |    49 |  9.51 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking |   5 |  43.6  |    40 |    51 |  4.39 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking         |   4 |  46.25 |    34 |    55 |  8.96 |

### refactorings_applied

| kata                         | workflow                | model                        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |  18    |    15 |    20 |  2.12 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |  16.4  |     3 |    27 |  7.4  |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking |   5 |  11    |     5 |    19 |  7.31 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking         |   4 |   7.75 |     2 |    19 |  7.8  |

### duration_seconds

| kata                         | workflow                | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 | 4415.8 |  3385 |  5401 | 787.02 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 | 3692.7 |  1640 |  4822 | 942.11 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking |   5 | 4687.2 |  4095 |  5201 | 468.8  |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking         |   4 | 3491   |  2585 |  4333 | 818.55 |

### total_tokens

| kata                         | workflow                | model                        |   n |        mean |      min |      max |         std |
|:-----------------------------|:------------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 | 1.50647e+07 | 13213114 | 18251612 | 1.97916e+06 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 | 1.3655e+07  |  9411553 | 16548065 | 2.09204e+06 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking |   5 | 1.69018e+07 | 16077222 | 19716582 | 1.57669e+06 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking         |   4 | 1.38542e+07 | 11422803 | 18869365 | 3.39641e+06 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                        |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |      10 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking         |   4 |       4 |      100 |
