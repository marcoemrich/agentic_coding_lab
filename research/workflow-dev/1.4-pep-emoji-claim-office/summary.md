# RQ-pep-emoji-claim-office — Aggregation

_Does the interaction finding from RQ-pep-emoji-v6.1 (pep+emoji reduction: anti-additivity for refactorings_applied, saturation for tests_passed_immediately, correctness invariant) also hold on a more complex kata with genuine ambiguities?_

Generated: 2026-09-17T01:17:17Z

Cells declared: 4 · matched runs: 22 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 7 | 7 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |   0.97 |  0.87 |     1 |  0.06 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |   0.8  |  0    |     1 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |   0.95 |  0.73 |     1 |  0.12 |

### tests_passing (rate %)

| kata                         | cell_workflow                        | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                        | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### code_mass

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 | 861.29 |   759 |   982 |  74.51 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 | 842.8  |   762 |   905 |  53.9  |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 | 654    |     0 |   861 | 367.15 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 | 866.8  |   791 |   955 |  63.77 |

### smell_total

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |   1.29 |     0 |     4 |  1.5  |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |   3.4  |     0 |    12 |  5.08 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |   1.6  |     0 |     4 |  2.19 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |   0.6  |     0 |     3 |  1.34 |

### cc_longest_function

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |  18.14 |    11 |    25 |  5.11 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |  17.4  |    11 |    25 |  6.66 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |  12.8  |     0 |    22 |  8.04 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |  13.2  |    11 |    15 |  1.79 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |   5.71 |     3 |    11 |  2.87 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |   7    |     4 |    13 |  3.67 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |   4    |     0 |     7 |  2.74 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |   4.6  |     3 |     6 |  1.34 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |   5.71 |     4 |    10 |  2.36 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |   6.4  |     4 |    11 |  2.88 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |   4.2  |     0 |     7 |  2.68 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |   4.6  |     4 |     6 |  0.89 |

### refactorings_applied

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |   11   |     4 |    17 |  5.1  |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |    6.6 |     3 |    13 |  4.62 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |    8.8 |     0 |    17 |  7.46 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |    9.8 |     4 |    17 |  4.87 |

### cycle_count

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |   28   |     5 |    43 | 12.96 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |   15.4 |     4 |    43 | 16.82 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |   22.6 |     0 |    42 | 19.57 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |   29.6 |     6 |    39 | 13.74 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                        | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |       292 |     303 |     96.4 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |       126 |     126 |    100   |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   4 |       208 |     212 |     98.1 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |       239 |     242 |     98.8 |

### tests_passed_immediately

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |  13.57 |     1 |    26 |  8.62 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |   8.2  |     0 |    32 | 13.72 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |   8.4  |     0 |    22 |  8.91 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |  13.8  |     0 |    19 |  7.95 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 | 1569   |   556 |  2071 | 519.28 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 | 1103.4 |   524 |  1731 | 562.03 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 | 1319.2 |    55 |  2000 | 858.22 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 | 1546.4 |   959 |  2104 | 421.86 |

### total_tokens

| kata                         | cell_workflow                        | cell_model                   |   n |        mean |      min |      max |         std |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 | 3.45442e+07 |  9306264 | 44845398 | 1.19731e+07 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 | 2.4929e+07  |  7993261 | 42340055 | 1.37152e+07 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 | 3.04843e+07 |   419163 | 46176730 | 1.96656e+07 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 | 3.54811e+07 | 23673479 | 42994428 | 7.43108e+06 |
