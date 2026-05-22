# RQ-9 — Aggregation

_Liefern die 'Four Rules of Simple Design' im Refactor-Subagent einen messbaren Code-Qualitaets-Vorteil ueber APP + Naming-Eval allein?_

Generated: 2026-05-15T22:26:09Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |  148.6 |   135 |   163 | 12.22 |

### smell_total

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |

### cc_longest_function

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |   14.2 |     7 |    25 |  6.69 |

### cognitive_max

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |    4.6 |     3 |    10 |  3.05 |

### mccabe_max

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |    4.4 |     3 |     6 |  1.34 |

### refactorings_applied

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |      4 |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |      4 |     3 |     8 |  2.24 |

### cycle_count

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |    7.8 |     7 |     8 |  0.45 |

### predictions_correct_rate (pooled %)

| kata                         | workflow      | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |       169 |     170 |     99.4 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |        77 |      77 |    100   |

### tests_passed_immediately

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |    3.4 |     0 |     6 |  3.13 |

### duration_seconds

| kata                         | workflow      | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |  521.4 |   427 |   711 |  95.48 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |  517.2 |   382 |   770 | 157.3  |

### total_tokens

| kata                         | workflow      | model                |   n |        mean |     min |     max |         std |
|:-----------------------------|:--------------|:---------------------|----:|------------:|--------:|--------:|------------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 | 6.62354e+06 | 4863281 | 8557921 | 1.31893e+06 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 | 6.0604e+06  | 4799769 | 7716031 | 1.11456e+06 |

### tests_passing (rate %)

| kata                         | workflow      | model                |   n |   match |   rate_% |
|:-----------------------------|:--------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct (rate %)

| kata                         | workflow      | model                |   n |   match |   rate_% |
|:-----------------------------|:--------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow      | model                |   n |   match |   rate_% |
|:-----------------------------|:--------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.2-no-rules | opus-4-7-no-thinking |   5 |       5 |      100 |
