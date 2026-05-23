# RQ-pep — Aggregation

_Liefern psychologische Begruendungen ('pep talks') in den Red- und Green-Skill-Prompts einen messbaren Code-Qualitaets- oder TDD-Disziplin-Vorteil ueber rein operationale Anweisungen?_

Generated: 2026-05-22T16:38:11Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |  149.8 |   131 |   185 | 21.46 |

### smell_total

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |    2   |     2 |     2 |  0    |

### cc_longest_function

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |   15.4 |    12 |    22 |  3.97 |

### cognitive_max

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |    6.2 |     3 |    10 |  2.77 |

### mccabe_max

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |    5.2 |     4 |     7 |  1.3  |

### refactorings_applied

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    4   |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |    4.2 |     2 |     8 |  2.28 |

### cycle_count

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |    8   |     7 |     9 |  0.71 |

### predictions_correct_rate (pooled %)

| kata                         | workflow    | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |       169 |     170 |     99.4 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |        74 |      80 |     92.5 |

### tests_passed_immediately

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |    2.2 |     0 |     6 |  3.03 |

### duration_seconds

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |  521.4 |   427 |   711 |  95.48 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |  559   |   339 |   722 | 169.38 |

### total_tokens

| kata                         | workflow    | cell_model           |   n |        mean |     min |     max |         std |
|:-----------------------------|:------------|:---------------------|----:|------------:|--------:|--------:|------------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 | 6.62354e+06 | 4863281 | 8557921 | 1.31893e+06 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 | 6.68795e+06 | 5081358 | 8284469 | 1.25201e+06 |

### tests_passing (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.3-no-pep | opus-4-7-no-thinking |   5 |       5 |      100 |
