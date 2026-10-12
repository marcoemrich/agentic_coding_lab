# RQ-kata-sphinx-vs-claim-office — Aggregation

_Can sphinx-score replace claim-office as the lab's correctness kata — does it separate a strong from a weak model as sharply, at a lower cost per data point?_

Generated: 2026-10-12T08:37:32Z

Cells declared: 4 · matched runs: 12 · min_replicates: 6

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking | 0 | 0 | ❌ no runs |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   1    |   0    |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   0.94 |   0.03 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |

### tests_passing

| kata                         | cell_workflow                | cell_model            |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|----:|-------:|---------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |   6 |      0 |      100 |    nan |  nan |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |   6 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 | nan |      0 |      nan |    nan |  nan |

### duration_seconds

| kata                         | cell_workflow                | cell_model            |   n |   null |    mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|--------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 | 1475    | 227.02 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 |  nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 | 5514.33 | 716.16 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 |  nan    | nan    |

### total_tokens

| kata                         | cell_workflow                | cell_model            |   n |   null |          mean |            sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|--------------:|--------------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   2.51255e+07 |   6.47713e+06 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan           | nan           |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   1.61604e+08 |   2.27384e+07 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan           | nan           |

### cost_usd

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |  20.01 |   4.37 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 | 109.59 |  15.26 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |

### lines_of_code

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   57.5 |  11.18 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |  523   |  86.38 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 |  nan   | nan    |

### longest_function

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   5.83 |   1.94 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |  13.83 |   3.19 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |

### avg_loc_per_function

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   3.54 |   1.11 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   3.19 |   0.23 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |

### cognitive_max

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |    sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |      1 |   0   |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 |    nan | nan   |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |      2 |   1.1 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 |    nan | nan   |

### mccabe_max

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   2    |   0    |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   2.83 |   0.75 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |

### smell_total

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |      0 |    0 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 |    nan |  nan |

### cycle_count

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |  11.67 |   2.16 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |  45.83 |   7.08 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |

### refactorings_applied

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |  11.67 |   2.16 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |  44.5  |   8.02 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |

### predictions_correct_rate

| kata                         | cell_workflow                | cell_model            |   n |   k |   t |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|----:|----:|-------:|---------:|-------:|-----:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 | 139 | 140 |      0 |     99.3 |    nan |  nan |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 | nan | nan |      0 |    nan   |    nan |  nan |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 | 544 | 550 |      0 |     98.9 |    nan |  nan |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 | nan | nan |      0 |    nan   |    nan |  nan |

### tests_passed_immediately

| kata                         | cell_workflow                | cell_model            |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------|:----------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |   2    |   2.19 |
| sphinx-score-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking    |   6 |      0 |  20.33 |  11.17 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | haiku-4-5-no-thinking |   0 |      0 | nan    | nan    |
