# RQ-11 — Aggregation

_Haben Emojis in den Workflow-Prompts (Skills + Refactor-Agent + rules/tdd.md) einen messbaren Effekt auf Code-Qualitaet oder TDD-Disziplin?_

Generated: 2026-05-16T08:58:31Z

Cells declared: 2 · matched runs: 20 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |  158.3 |   145 |   178 | 12.5  |

### smell_total

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |    2.5 |     2 |     4 |  0.71 |

### cc_longest_function

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |   12.8 |     4 |    22 |  6.2  |

### cognitive_max

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |    5.3 |     1 |    15 |  4.03 |

### mccabe_max

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |    4.3 |     2 |     9 |  1.95 |

### refactorings_applied

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    4   |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |    3.3 |     2 |     4 |  0.67 |

### cycle_count

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  1.06 |

### predictions_correct_rate (pooled %)

| kata                         | workflow      | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |       169 |     170 |     99.4 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |       164 |     168 |     97.6 |

### tests_passed_immediately

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |    4   |     0 |     7 |  2.91 |

### duration_seconds

| kata                         | workflow      | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |  521.4 |   427 |   711 | 95.48 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |  485.8 |   357 |   605 | 82.21 |

### total_tokens

| kata                         | workflow      | model                |   n |        mean |     min |     max |              std |
|:-----------------------------|:--------------|:---------------------|----:|------------:|--------:|--------:|-----------------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 | 6.62354e+06 | 4863281 | 8557921 |      1.31893e+06 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 | 6.27083e+06 | 4689099 | 7634242 | 910467           |

### tests_passing (rate %)

| kata                         | workflow      | model                |   n |   match |   rate_% |
|:-----------------------------|:--------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow      | model                |   n |   match |   rate_% |
|:-----------------------------|:--------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow      | model                |   n |   match |   rate_% |
|:-----------------------------|:--------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid     | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking |  10 |      10 |      100 |
