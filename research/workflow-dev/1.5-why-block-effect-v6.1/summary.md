# RQ-why-block-effect-v6.1 — Aggregation

_Tragen Why-Bloecke (kausale Begruendungen neben MUSTs) auf hybrid-v2-Basis einen messbaren TDD-Disziplin- oder Korrektheits-Vorteil ueber rein imperative Anweisungen — bei voll erhaltenem PEP?_

Generated: 2026-09-11T07:48:51Z

Cells declared: 2 · matched runs: 15 · min_replicates: 8

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 7 | 7 | ⚠️ unter min_replicates (7/8) |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |

## Outcome-Pivots (pro Zelle)

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                   | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |       292 |     303 |     96.4 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   7 |       530 |     551 |     96.2 |

### refactorings_applied

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |   11   |     4 |    17 |  5.1  |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |   18.5 |     0 |    30 |  8.42 |

### tests_passed_immediately

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |  13.57 |     1 |    26 |  8.62 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |  15.38 |     0 |    21 |  7.27 |

### cycle_count

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |     28 |     5 |    43 | 12.96 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |     35 |     0 |    42 | 14.22 |

### verification_pct

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |   0.91 |  0.27 |     1 |  0.26 |

### tests_passing (rate %)

| kata                         | cell_workflow                   | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                   | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |

### code_mass

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 | 861.29 |   759 |   982 |  74.51 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 | 769.12 |   296 |   901 | 197.25 |

### smell_total

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |   1.29 |     0 |     4 |  1.5  |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     1 |  0.52 |

### cc_longest_function

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |  18.14 |    11 |    25 |  5.11 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |  13.25 |    10 |    15 |  1.58 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |   5.71 |     3 |    11 |  2.87 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |   4.38 |     3 |     6 |  1.06 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |   5.71 |     4 |    10 |  2.36 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |   4.25 |     4 |     5 |  0.46 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 | 1569    |   556 |  2071 | 519.28 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 | 2234.25 |  1030 |  2973 | 549.95 |

### total_tokens

| kata                         | cell_workflow                   | cell_model                   |   n |        mean |     min |      max |         std |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|------------:|--------:|---------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 | 3.45442e+07 | 9306264 | 44845398 | 1.19731e+07 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 | 3.97803e+07 |  349302 | 51081422 | 1.61149e+07 |
