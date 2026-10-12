# RQ-audit-bundle-claim-office — Aggregation

_Does the RQ-1.8 result (the audit bundle stabilizes discipline and is code-quality-neutral on the hybrid-v4 base × game-of-life) generalize to the novel claim-office kata, or does the pattern flip there as it already did for reductions in RQ-1.4?_

Generated: 2026-10-12T08:38:02Z

Cells declared: 2 · matched runs: 16 · min_replicates: 8

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   0.35 | 0.41 |

### tests_passing

| kata                         | cell_workflow                     | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |   8 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |   8 |      0 |      100 |

### tests_passed_immediately

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |  15.12 | 5.84 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   0.62 | 1.41 |

### refactorings_applied

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |  24.88 | 6.9  |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |  12    | 9.97 |

### predictions_correct_rate

| kata                         | cell_workflow                     | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 | 581 | 598 |      0 |     97.2 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 | 203 | 214 |      0 |     94.9 |

### cycle_count

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |  37.38 | 1.6  |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |  11.25 | 6.09 |

### code_mass

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |  878.5 |  91.44 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |  441.5 | 335.59 |

### smell_total

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |   0.38 | 0.74 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   0.5  | 0.76 |

### longest_function

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |  12.38 | 1.41 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |  13.12 | 7.06 |

### cognitive_max

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |   5    | 1.77 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   3.38 | 2.07 |

### mccabe_max

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 |   4.5  | 0.76 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 |   3.75 | 1.67 |

### duration_seconds

| kata                         | cell_workflow                     | cell_model                   |   n |   null |    mean |     sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|--------:|-------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 | 2530.38 | 401.16 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 | 1058.5  | 942.99 |

### total_tokens

| kata                         | cell_workflow                     | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |   8 |      0 | 5.22518e+07 | 5.60009e+06 |
| claim-office-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |   8 |      0 | 2.04328e+07 | 1.8928e+07  |
