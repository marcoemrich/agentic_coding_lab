# RQ-tcr-variants-sol — Aggregation

_How do first-party EXACT Coding TCR, classic TCR, and external TCRDD variants affect correctness, code quality, development behavior, and efficiency for SOL on pi, and how do their native-Git and tool-enforced execution strategies differ?_

Generated: 2026-10-12T08:37:51Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                           | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### test_blocks

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    3.8 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   25.2 | 8.67 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   37   | 1.58 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    7.8 | 2.49 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |   17.2 | 1.92 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |   12.2 | 3.56 |

### test_cases_total

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |   12.4 | 3.21 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   29.8 | 6.38 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   36.4 | 2.61 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |   26   | 7.65 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |   29   | 7.68 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |   19.8 | 9.39 |

### test_cases_first_block

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    2.8 | 2.49 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    1.8 | 1.1  |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |    0.8 | 0.45 |

### red_verified

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    2.8 | 1.3  |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 7.33 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   36.8 | 1.79 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    6.2 | 3.11 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |   17.2 | 1.92 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |   12.2 | 3.56 |

### red_unverified

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    1   | 0.71 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   15.4 | 2.3  |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    0.2 | 0.45 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    1.6 | 3.05 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |

### tcr_refactor_steps

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 4.16 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    6.6 | 2.61 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |    2.8 | 0.84 |

### tcr_method_commits

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   58.8 | 7.73 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |   10.4 | 1.95 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |   24.8 | 6.38 |

### tcr_red_commits

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   17.2 | 2.95 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |

### tcr_green_commits

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   35.4 | 1.95 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |

### tcr_refactor_commits

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    5.2 | 3.42 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |   7.29 | 1.23 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   6.8  | 0.39 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   8    | 2.13 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |   8    | 1.14 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |   9.81 | 2.85 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |   8.31 | 1.35 |

### longest_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |   20.2 | 3.27 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   16.2 | 1.3  |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   18.2 | 6.91 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |   22   | 6.44 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |   18.6 | 2.61 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |   17.4 | 1.67 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    6.6 | 2.07 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    4   | 1.22 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    3.2 | 0.84 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    6.8 | 0.84 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    5.4 | 1.52 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |    6.2 | 1.79 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |    8.4 | 3.58 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    4.8 | 1.3  |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    4   | 0.71 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |    7.4 | 1.14 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 0.89 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |    6.2 | 0.45 |

### smell_total

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |  770.2 | 73.72 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |  574.2 | 34.31 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |  553.6 | 29.13 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |  819.2 | 58.79 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |  505   | 60.32 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |  556.6 | 24.34 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 |  278.2 |  40.71 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 | 1388.4 | 303.23 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 | 1082   | 141.17 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 |  459.8 |  76.82 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |  707.6 | 172.23 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |  558   |  83.89 |

### total_tokens

| kata                         | cell_workflow                           | cell_model        |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1.1-local-git-pi   | gpt-5-6-sol-codex |   5 |      0 | 335810           |  65135.9         |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      5.48161e+06 |      1.25818e+06 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      6.29228e+06 | 653247           |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-pi     | gpt-5-6-sol-codex |   5 |      0 | 750982           | 128860           |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-pi      | gpt-5-6-sol-codex |   5 |      0 |      2.32028e+06 | 414861           |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-pi | gpt-5-6-sol-codex |   5 |      0 |      1.71331e+06 | 752009           |
