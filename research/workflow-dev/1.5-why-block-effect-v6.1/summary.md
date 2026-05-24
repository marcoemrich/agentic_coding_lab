# RQ-why-block-effect-v6.1 — Aggregation

_Tragen Why-Bloecke (kausale Begruendungen neben MUSTs) auf v6.1-Basis einen messbaren TDD-Disziplin- oder Korrektheits-Vorteil ueber rein imperative Anweisungen — bei voll erhaltenem PEP?_

Generated: 2026-05-24T04:48:44Z

Cells declared: 2 · matched runs: 16 · min_replicates: 8

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| claim-office-example-mapping | v6.1-with-why | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |

## Outcome-Pivots (pro Zelle)

### predictions_correct_rate (pooled %)

| kata                         | workflow                       | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |       300 |     311 |     96.5 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   7 |       530 |     551 |     96.2 |

### refactorings_applied

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |   9.88 |     2 |    17 |  5.69 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |  18.5  |     0 |    30 |  8.42 |

### tests_passed_immediately

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |  12    |     1 |    26 |  9.13 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |  15.38 |     0 |    21 |  7.27 |

### cycle_count

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |     25 |     4 |    43 | 14.7  |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |     35 |     0 |    42 | 14.22 |

### verification_pct

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |   0.91 |  0.27 |     1 |  0.26 |

### tests_passing (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |

### code_mass

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 | 840.75 |   697 |   982 |  90.18 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 | 769.12 |   296 |   901 | 197.25 |

### smell_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |   2.88 |     0 |    14 |  4.7  |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     1 |  0.52 |

### cc_longest_function

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |  23.38 |    11 |    60 | 15.54 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |  13.25 |    10 |    15 |  1.58 |

### cognitive_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |   7.62 |     3 |    21 |  6.02 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |   4.38 |     3 |     6 |  1.06 |

### mccabe_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 |   6.75 |     4 |    14 |  3.65 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 |   4.25 |     4 |     5 |  0.46 |

### duration_seconds

| kata                         | workflow                       | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 | 1463.62 |   556 |  2071 | 565.65 |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 | 2234.25 |  1030 |  2973 | 549.95 |

### total_tokens

| kata                         | workflow                       | cell_model                   |   n |        mean |     min |      max |         std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|------------:|--------:|---------:|------------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   8 | 3.26216e+07 | 9306264 | 44845398 | 1.2347e+07  |
| claim-office-example-mapping | v6.1-with-why                  | opus-4-7-portkey-no-thinking |   8 | 3.97803e+07 |  349302 | 51081422 | 1.61149e+07 |
