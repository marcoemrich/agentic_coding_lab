# RQ-v62-cleanup-validation-v61-with-why — Aggregation

_Do the three v6.5.1 audit cleanups (consistency, refactor.md decoupling, tdd-experiment-mode reframing) — applied to exact-hybrid-v3-with-why-cc — measurably change workflow behaviour on claim-office, or is exact-hybrid-v4-cleaned-cc a behaviourally equivalent hygiene variant of the new default baseline?_

Generated: 2026-10-12T10:46:49Z

Cells declared: 2 · matched runs: 16 · min_replicates: 8

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   0.91 | 0.26 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |      0 |   0.96 | 0.09 |

### tests_passing

| kata                         | cell_workflow               | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |   8 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |   8 |      0 |      100 |

### predictions_correct_rate

| kata                         | cell_workflow               | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:----------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   7 | 530 | 551 |      1 |     96.2 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 | 581 | 598 |      0 |     97.2 |

### code_mass

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |      0 | 769.12 | 197.25 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |      0 | 878.5  |  91.44 |

### smell_total

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   0.38 | 0.52 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |      0 |   0.38 | 0.74 |

### longest_function

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |      0 |  13.25 | 1.58 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |      0 |  12.38 | 1.41 |

### cognitive_max

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   4.38 | 1.06 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |      0 |   5    | 1.77 |

### mccabe_max

| kata                         | cell_workflow               | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   4.25 | 0.46 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |      0 |   4.5  | 0.76 |

### duration_seconds

| kata                         | cell_workflow               | cell_model                   |   n |   null |    mean |     sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|--------:|-------:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |      0 | 2234.25 | 549.95 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |      0 | 2530.38 | 401.16 |

### total_tokens

| kata                         | cell_workflow               | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-hybrid-v3-with-why-cc | opus-4-7-portkey-no-thinking |   8 |      0 | 4.58038e+07 | 1.87383e+07 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc  | opus-4-7-portkey-no-thinking |   8 |      0 | 5.22518e+07 | 5.60009e+06 |
