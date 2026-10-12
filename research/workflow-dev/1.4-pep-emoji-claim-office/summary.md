# RQ-pep-emoji-claim-office — Aggregation

_Does the interaction finding from RQ-pep-emoji-v6.1 (pep+emoji reduction: anti-additivity for refactorings_applied, saturation for tests_passed_immediately, correctness invariant) also hold on a more complex kata with genuine ambiguities?_

Generated: 2026-10-12T10:46:48Z

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

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |   0.97 | 0.06 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |   0.8  | 0.45 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0.95 | 0.12 |

### tests_passing

| kata                         | cell_workflow                        | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |   7 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |

### code_mass

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |      0 | 861.29 |  74.51 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 | 842.8  |  53.9  |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 | 654    | 367.15 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 866.8  |  63.77 |

### smell_total

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |      0 |   1.29 | 1.5  |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |   3.4  | 5.08 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |   1.6  | 2.19 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0.6  | 1.34 |

### longest_function

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |      0 |  18.14 | 5.11 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |  17.4  | 6.66 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |  12.8  | 8.04 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  13.2  | 1.79 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |      0 |   5.71 | 2.87 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |   7    | 3.67 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |   4    | 2.74 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   4.6  | 1.34 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |      0 |   5.71 | 2.36 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |   6.4  | 2.88 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |   4.2  | 2.68 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   4.6  | 0.89 |

### predictions_correct_rate

| kata                         | cell_workflow                        | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 | 292 | 303 |      0 |     96.4 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 | 126 | 126 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   4 | 208 | 212 |      1 |     98.1 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 | 239 | 242 |      0 |     98.8 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |      0 | 1569   | 519.28 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 | 1103.4 | 562.03 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 | 1319.2 | 858.22 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 1546.4 | 421.86 |

### total_tokens

| kata                         | cell_workflow                        | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   7 |      0 | 3.78763e+07 | 1.34521e+07 |
| claim-office-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 | 2.72635e+07 | 1.53025e+07 |
| claim-office-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 | 3.33318e+07 | 2.19333e+07 |
| claim-office-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 3.89401e+07 | 8.83319e+06 |
