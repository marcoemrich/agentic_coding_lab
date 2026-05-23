# RQ-pep-emoji-claim-office — Aggregation

_Haelt der Interaktions-Befund aus RQ-pep-emoji-v6.1 (Pep+Emoji-Reduktion: Anti-Additivitaet bei refactorings_applied, Saettigung bei tests_passed_immediately, Korrektheit invariant) auch auf einer komplexeren Kata mit echten Mehrdeutigkeiten?_

Generated: 2026-05-23T22:19:27Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1-no-pep | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1-no-emoji | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.1-no-pep-no-emoji | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |   0.8  |  0    |     1 |  0.45 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |   0.97 |  0.87 |     1 |  0.06 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |   0.95 |  0.73 |     1 |  0.12 |

### tests_passing (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### code_mass

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |  878.6 |   759 |   982 |  80.23 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |  654   |     0 |   861 | 367.15 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |  842.8 |   762 |   905 |  53.9  |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |  866.8 |   791 |   955 |  63.77 |

### smell_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |    1.6 |     0 |     4 |  1.67 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    1.6 |     0 |     4 |  2.19 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    3.4 |     0 |    12 |  5.08 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    0.6 |     0 |     3 |  1.34 |

### cc_longest_function

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   18.4 |    11 |    25 |  5.98 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |   12.8 |     0 |    22 |  8.04 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |   17.4 |    11 |    25 |  6.66 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |   13.2 |    11 |    15 |  1.79 |

### cognitive_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |    5   |     3 |     8 |  2    |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    4   |     0 |     7 |  2.74 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    7   |     4 |    13 |  3.67 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    4.6 |     3 |     6 |  1.34 |

### mccabe_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |    5.2 |     4 |     7 |  1.64 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    4.2 |     0 |     7 |  2.68 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    6.4 |     4 |    11 |  2.88 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    4.6 |     4 |     6 |  0.89 |

### refactorings_applied

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   11.6 |     4 |    17 |  5.22 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    8.8 |     0 |    17 |  7.46 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    6.6 |     3 |    13 |  4.62 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    9.8 |     4 |    17 |  4.87 |

### cycle_count

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   27   |     5 |    43 | 14.82 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |   22.6 |     0 |    42 | 19.57 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |   15.4 |     4 |    43 | 16.82 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |   29.6 |     6 |    39 | 13.74 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                       | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |       204 |     213 |     95.8 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   4 |       208 |     212 |     98.1 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |       126 |     126 |    100   |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |       239 |     242 |     98.8 |

### tests_passed_immediately

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   13.4 |     1 |    26 |  9.32 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    8.4 |     0 |    22 |  8.91 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    8.2 |     0 |    32 | 13.72 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |   13.8 |     0 |    19 |  7.95 |

### duration_seconds

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 | 1551.4 |   556 |  2071 | 595.62 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 | 1319.2 |    55 |  2000 | 858.22 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 | 1103.4 |   524 |  1731 | 562.03 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 | 1546.4 |   959 |  2104 | 421.86 |

### total_tokens

| kata                         | workflow                       | cell_model                   |   n |        mean |      min |      max |         std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 | 3.32412e+07 |  9306264 | 44845398 | 1.39487e+07 |
| claim-office-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 | 3.04843e+07 |   419163 | 46176730 | 1.96656e+07 |
| claim-office-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 | 2.4929e+07  |  7993261 | 42340055 | 1.37152e+07 |
| claim-office-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 | 3.54811e+07 | 23673479 | 42994428 | 7.43108e+06 |
