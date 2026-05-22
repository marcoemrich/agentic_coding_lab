# RQ-audit — Aggregation

_Trägt das claude_orchestration-Audit-Bundle (Mechanism-Alignment, Rationale-Ergänzungen, Short-Circuit-Hardening) messbar zur Code-Qualität oder TDD-Disziplin gegenüber v6.5-lean bei?_

Generated: 2026-05-22T16:38:13Z

Cells declared: 2 · matched runs: 20 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.5-lean | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |  143.9 |   133 |   154 |  6.06 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |  146.7 |   133 |   162 | 11.53 |

### smell_total

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    2   |     2 |     2 |  0    |

### cc_longest_function

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |   12.7 |     6 |    24 |  5.79 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |   13.1 |     2 |    21 |  6.3  |

### cognitive_max

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |    5.1 |     2 |    12 |  3.84 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    5.6 |     2 |    10 |  3.17 |

### mccabe_max

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |    4.5 |     3 |     8 |  2.01 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    4.9 |     3 |     7 |  1.45 |

### refactorings_applied

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |    6.9 |     3 |    10 |  2.33 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    7.8 |     7 |     8 |  0.42 |

### cycle_count

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |    8.2 |     8 |    10 |  0.63 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    7.8 |     7 |     8 |  0.42 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                     | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |       166 |     166 |    100   |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |       175 |     177 |     98.9 |

### tests_passed_immediately

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |    1.4 |     0 |     5 |  2.27 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    0   |     0 |     0 |  0    |

### duration_seconds

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |  623.6 |   440 |   902 | 136.94 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |  726.1 |   605 |   903 |  86.95 |

### total_tokens

| kata                         | workflow                     | cell_model           |   n |        mean |     min |      max |              std |
|:-----------------------------|:-----------------------------|:---------------------|----:|------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 | 7.40528e+06 | 5251393 | 10942484 |      1.57655e+06 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 | 8.52687e+06 | 7616336 |  9276348 | 601678           |

### tests_passing (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |
