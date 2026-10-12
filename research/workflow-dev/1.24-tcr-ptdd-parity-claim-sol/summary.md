# RQ-tcr-ptdd-parity-claim-sol — Aggregation

_On Claim Office with SOL/pi, does a TCR-source-parity transfer of the domain-boundary workflow to Predictive TDD reproduce TCR's decomposition when all non-method-specific test-list, domain-review, stack, and lab contracts are retained, or does the commit-or-revert phase mechanism still separate the methods?_

Generated: 2026-10-12T08:37:59Z

Cells declared: 3 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                             | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |  10 |      0 |      100 |

### avg_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   5.67 | 0.69 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   6.61 | 1.81 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   5.72 | 0.52 |

### median_loc_per_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   4.7  | 0.67 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   6    | 2.67 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   4.35 | 0.58 |

### longest_function

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   14.2 | 2.59 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   15.8 | 2.77 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   16.8 | 1.69 |

### functions

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   15.4 | 0.89 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   13   | 2.24 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   15.3 | 4.03 |

### cognitive_max

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    3   | 0.71 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    3.4 | 2.07 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |    3.7 | 0.95 |

### cognitive_avg

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.47 | 0.15 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.81 | 0.48 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   1.87 | 0.48 |

### mccabe_max

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.64 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 1.52 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |    4.3 | 1.16 |

### mccabe_avg

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.5  | 0.11 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   2.02 | 0.36 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   1.85 | 0.31 |

### smell_total

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |      0 |    0 |

### smell_code_quality

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |  568.4 | 26.09 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |  600.8 | 43.56 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |  578.2 | 35.65 |

### production_loc

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |  153.2 | 10.13 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |  151.8 |  8.93 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |  150.2 | 27.18 |

### test_lines

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |  218.4 | 44.72 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |  186.8 | 27.22 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |  218.3 | 47.84 |

### test_blocks

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   37.6 | 1.95 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   21.8 | 8.32 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   34.8 | 9.25 |

### red_verified

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   37.4 |  2.19 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    8.6 |  7.64 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   32.6 | 11.64 |

### red_unverified

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    0.2 | 0.45 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   13.2 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |    2.2 | 5.35 |

### tcr_refactor_steps

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   10.6 | 4.16 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |    0   | 0    |

### tcr_method_commits

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |     62 | 9.06 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 | 0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |      0 | 0    |

### tcr_red_commits

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   15.6 | 3.97 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |    0   | 0    |

### tcr_green_commits

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |     36 | 2.35 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 | 0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |      0 | 0    |

### tcr_refactor_commits

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    9.4 | 4.93 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |    0   | 0    |

### cycle_count

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   36   | 2.35 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   27.2 | 4.44 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   36   | 1.49 |

### refactorings_applied

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   37.4 | 2.07 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   27.2 | 4.44 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   36.2 | 1.32 |

### predictions_correct_rate

| kata                         | cell_workflow                             | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:------------------------------------------|:------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 | 360 | 362 |      0 |     99.4 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 | 125 | 130 |      0 |     96.2 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 | 713 | 721 |      0 |     98.9 |

### duration_seconds

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 | 1439.8 | 314.57 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 | 1087.8 | 198.3  |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 | 1263.4 | 351.01 |

### total_tokens

| kata                         | cell_workflow                             | cell_model        |   n |   null |        mean |          sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 | 6.64817e+06 | 2.5006e+06  |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 | 4.76884e+06 | 1.36416e+06 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 | 6.58223e+06 | 2.24387e+06 |

### cost_usd

| kata                         | cell_workflow                             | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   4.83 | 1.72 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi   | gpt-5-6-sol-codex |   5 |      0 |   3.65 | 0.86 |
| claim-office-example-mapping | exact-sol-v1.5-tcr-parity-domain-trial-pi | gpt-5-6-sol-codex |  10 |      0 |   4.78 | 1.43 |
