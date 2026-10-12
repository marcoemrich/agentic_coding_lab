# RQ-why-block-effect-v6.1 — Aggregation

_Do why blocks (causal justifications alongside MUSTs) on the hybrid-v2 base carry a measurable TDD discipline or correctness advantage over purely imperative instructions — with PEP fully retained?_

Generated: 2026-10-12T08:38:00Z

Cells declared: 2 · matched runs: 15 · min_replicates: 8

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 7 | 7 | ⚠️ below min_replicates (7/8) |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |

## Outcome pivots (per cell)

### predictions_correct_rate

| kata                         | cell_workflow                   | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 | 292 | 303 |      0 |     96.4 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   7 | 530 | 551 |      1 |     96.2 |

### refactorings_applied

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 |   11   | 5.1  |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 |   18.5 | 8.42 |

### tests_passed_immediately

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 |  13.57 | 8.62 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 |  15.38 | 7.27 |

### cycle_count

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 |     28 | 12.96 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 |     35 | 14.22 |

### verification_pct

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 |   0.91 | 0.26 |

### tests_passing

| kata                         | cell_workflow                   | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |   7 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |   8 |      0 |      100 |

### code_mass

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 | 861.29 |  74.51 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 | 769.12 | 197.25 |

### smell_total

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 |   1.29 | 1.5  |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 |   0.38 | 0.52 |

### longest_function

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 |  18.14 | 5.11 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 |  13.25 | 1.58 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 |   5.71 | 2.87 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 |   4.38 | 1.06 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 |   5.71 | 2.36 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 |   4.25 | 0.46 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model                   |   n |   null |    mean |     sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|--------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 | 1569    | 519.28 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 | 2234.25 | 549.95 |

### total_tokens

| kata                         | cell_workflow                   | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:--------------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   7 |      0 | 3.78763e+07 | 1.34521e+07 |
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc     | opus-4-7-portkey-no-thinking |   8 |      0 | 4.58038e+07 | 1.87383e+07 |
