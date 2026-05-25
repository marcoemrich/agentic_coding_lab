# RQ-v62-cleanup-validation-v61-with-why — Aggregation

_Veraendern die drei v6.5.1-Audit-Cleanups (Konsistenz, refactor.md-Entkopplung, tdd-experiment-mode-Reframing) — angewendet auf v6.1-with-why — messbar das Workflow-Verhalten auf claim-office, oder ist v6.2-with-why-cleaned eine verhalts-aequivalente Hygiene-Variante der neuen Default-Baseline?_

Generated: 2026-05-25T06:13:56Z

Cells declared: 2 · matched runs: 16 · min_replicates: 8

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.1-with-why | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |   0.91 |  0.27 |     1 |  0.26 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   0.96 |  0.73 |     1 |  0.09 |

### tests_passing (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |

### predictions_correct_rate (pooled %)

| kata                         | workflow              | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   7 |       530 |     551 |     96.2 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       582 |     599 |     97.2 |

### refactorings_applied

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |  18.5  |     0 |    30 |  8.42 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  24.88 |    18 |    37 |  6.9  |

### tests_passed_immediately

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |  15.38 |     0 |    21 |  7.27 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  15.12 |     1 |    19 |  5.84 |

### cycle_count

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |  35    |     0 |    42 | 14.22 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  37.38 |    35 |    40 |  1.6  |

### code_mass

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 | 769.12 |   296 |   901 | 197.25 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 | 878.5  |   783 |  1066 |  91.44 |

### smell_total

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     1 |  0.52 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     2 |  0.74 |

### cc_longest_function

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |  13.25 |    10 |    15 |  1.58 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  12.38 |    10 |    15 |  1.41 |

### cognitive_max

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |   4.38 |     3 |     6 |  1.06 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   5    |     3 |     8 |  1.77 |

### mccabe_max

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 |   4.25 |     4 |     5 |  0.46 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   4.5  |     3 |     5 |  0.76 |

### duration_seconds

| kata                         | workflow              | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 | 2234.25 |  1030 |  2973 | 549.95 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 | 2530.38 |  2194 |  3285 | 401.16 |

### total_tokens

| kata                         | workflow              | cell_model                   |   n |        mean |      min |      max |         std |
|:-----------------------------|:----------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v6.1-with-why         | opus-4-7-portkey-no-thinking |   8 | 3.97803e+07 |   349302 | 51081422 | 1.61149e+07 |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 | 4.44426e+07 | 39301139 | 49093278 | 3.40183e+06 |
