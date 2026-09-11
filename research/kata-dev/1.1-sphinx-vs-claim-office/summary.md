# RQ-kata-sphinx-vs-claim-office — Aggregation

_Can sphinx-score replace claim-office as the lab's correctness kata — does it separate a strong from a weak model as sharply, at a lower cost per data point?_

Generated: 2026-09-11T07:48:54Z

Cells declared: 4 · matched runs: 12 · min_replicates: 6

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   0.94 |  0.93 |     1 |  0.03 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model         |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:-------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       6 |      100 |

### duration_seconds

| kata                         | cell_workflow                | cell_model         |   n |    mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:-------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 5514.33 |  4856 |  6450 | 716.16 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 1475    |  1258 |  1911 | 227.02 |

### total_tokens

| kata                         | cell_workflow                | cell_model         |   n |       mean |       min |       max |         std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-----------:|----------:|----------:|------------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 1.3611e+08 | 121120560 | 176135411 | 2.03967e+07 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 | 1.9079e+07 |  14796862 |  30728141 | 5.91678e+06 |

### cost_usd

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |    max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  78.98 | 70.7  | 101.67 | 11.54 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  12.86 | 10.17 |  20.1  |  3.68 |

### lines_of_code

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  523   |   411 |   618 | 86.38 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   57.5 |    47 |    74 | 11.18 |

### cc_longest_function

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  13.83 |    10 |    18 |  3.19 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   5.83 |     2 |     7 |  1.94 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   3.19 |  2.91 |  3.48 |  0.23 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   3.54 |  2    |  5.2  |  1.11 |

### cognitive_max

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      2 |     1 |     3 |   1.1 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      1 |     1 |     1 |   0   |

### mccabe_max

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   2.83 |     2 |     4 |  0.75 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     2 |     2 |  0    |

### smell_total

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |      0 |     0 |     0 |     0 |

### cycle_count

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  45.83 |    36 |    57 |  7.08 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  44.5  |    36 |    57 |  8.02 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  11.67 |    10 |    16 |  2.16 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                | cell_model         |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------------------|:-------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       544 |     550 |     98.9 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |       139 |     140 |     99.3 |

### tests_passed_immediately

| kata                         | cell_workflow                | cell_model         |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:-------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |  20.33 |     0 |    33 | 11.17 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking |   6 |   2    |     0 |     4 |  2.19 |
