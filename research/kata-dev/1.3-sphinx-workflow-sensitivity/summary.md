# RQ-kata-sphinx-workflow-sensitivity — Aggregation

_Does sphinx-score resolve a workflow difference in code quality — does the decomposition gap between a minimal and an elaborate TDD workflow show up as clearly as it does on claim-office?_

Generated: 2026-08-11T07:41:19Z

Cells declared: 4 · matched runs: 11 · min_replicates: 6

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 1 | 1 | ⚠️ unter min_replicates (1/6) |
| sphinx-score-example-mapping | v3-basic-tdd | opus-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking | 5 | 5 | ⚠️ unter min_replicates (5/6) |
| claim-office-example-mapping | v3-basic-tdd | opus-5-no-thinking | 5 | 5 | ⚠️ unter min_replicates (5/6) |

## Outcome-Pivots (pro Zelle)

### cc_longest_function

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |   24.2 |    19 |    27 |   3.11 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |   14.6 |    11 |    18 |   2.88 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |    7   |     7 |     7 | nan    |

### cc_avg_loc_per_function

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |   9.18 |  7.44 | 11.54 |   1.68 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |   3.21 |  2.91 |  3.48 |   0.24 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |   5.2  |  5.2  |  5.2  | nan    |

### cognitive_max

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |    5.4 |     4 |     9 |   2.07 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |    2.2 |     1 |     3 |   1.1  |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |    1   |     1 |     1 | nan    |

### mccabe_max

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |    5.4 |     4 |     7 |   1.14 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |    3   |     2 |     4 |   0.71 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |    2   |     2 |     2 | nan    |

### cc_functions

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |   14.6 |    11 |    20 |   3.51 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |   38.4 |    33 |    47 |   6.07 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |    5   |     5 |     5 | nan    |

### smell_total (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |       0 |        0 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |       0 |        0 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |       0 |        0 |

### code_mass

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |  759.2 |   674 |   881 | 106.97 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 | 1002.8 |   896 |  1083 |  73.27 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |  167   |   167 |   167 | nan    |

### lines_of_code

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |  309.2 |   267 |   365 |  42.19 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |  540   |   411 |   618 |  84.61 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |   48   |    48 |    48 | nan    |

### refactorings_applied

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |    1.8 |     1 |     3 |   0.84 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |   43.4 |    36 |    57 |   8.44 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |   11   |    11 |    11 | nan    |

### cycle_count

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |    4.8 |     2 |     8 |   2.39 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |   45   |    36 |    57 |   7.58 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |   11   |    11 |    11 | nan    |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow     | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |       444 |     450 |     98.7 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |        22 |      22 |    100   |

### tests_passed_immediately

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |      1 |     0 |     3 |   1.22 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |     19 |     0 |    33 |  11.94 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |      0 |     0 |     0 | nan    |

### verification_pct

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |   1    |  1    |     1 |   0    |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |   0.95 |  0.93 |     1 |   0.03 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |   1    |  1    |     1 | nan    |

### tests_passing (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |       1 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow     | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 |       5 |      100 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |       1 |      100 |

### duration_seconds

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 |  304.8 |   258 |   323 |  26.85 |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 | 5551   |  4856 |  6450 | 794.37 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 | 1486   |  1486 |  1486 | nan    |

### total_tokens

| kata                         | cell_workflow     | cell_model         |   n |        mean |       min |       max |              std |
|:-----------------------------|:------------------|:-------------------|----:|------------:|----------:|----------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd      | opus-5-no-thinking |   5 | 4.20994e+06 |   3194079 |   4710667 | 629724           |
| claim-office-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   5 | 1.37357e+08 | 121120560 | 176135411 |      2.25471e+07 |
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 | 1.9341e+07  |  19340986 |  19340986 |    nan           |

### cost_usd

| kata                         | cell_workflow     | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------|:-------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | v6.6-lab-split-cc | opus-5-no-thinking |   1 |   13.2 |  13.2 |  13.2 |   nan |
