# RQ-pep-v6.1 — Aggregation

_Liefern psychologische Begruendungen ('pep talks') in den Red- und Green-Skill-Prompts auf v6.1-Basis einen messbaren Code-Qualitaets- oder TDD-Disziplin-Vorteil ueber rein operationale Anweisungen?_

Generated: 2026-05-23T16:20:21Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.1-no-pep | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |  147.6 |   133 |   174 | 15.5  |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |  144.6 |   130 |   161 | 11.67 |

### smell_total

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |    2.6 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |    2   |     2 |     2 |  0    |

### cc_longest_function

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |   15   |     2 |    25 |  8.72 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |   13.2 |     2 |    25 |  9.73 |

### cognitive_max

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |    6.2 |     2 |    12 |  4.49 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |    4.6 |     2 |     8 |  2.79 |

### mccabe_max

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |    5.2 |     3 |     8 |  1.92 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |    4.8 |     3 |     7 |  2.05 |

### refactorings_applied

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |    4.2 |     2 |     7 |  2.28 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |    7   |     3 |    10 |  3.24 |

### cycle_count

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |    8.4 |     7 |     9 |  0.89 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |    8.8 |     8 |    10 |  0.84 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                       | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |        82 |      83 |     98.8 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |        79 |      79 |    100   |

### tests_passed_immediately

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |    4.8 |     0 |     7 |  2.95 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |    1.2 |     0 |     6 |  2.68 |

### duration_seconds

| kata                         | workflow                       | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |  597.2 |   426 |   727 | 142.43 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |  777.2 |   474 |   987 | 216.69 |

### total_tokens

| kata                         | workflow                       | cell_model           |   n |        mean |     min |      max |         std |
|:-----------------------------|:-------------------------------|:---------------------|----:|------------:|--------:|---------:|------------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 | 7.16873e+06 | 5264335 |  9796559 | 1.67377e+06 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 | 8.65681e+06 | 5934545 | 10393293 | 1.81888e+06 |

### tests_passing (rate %)

| kata                         | workflow                       | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct (rate %)

| kata                         | workflow                       | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                       | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-no-thinking |   5 |       5 |      100 |
