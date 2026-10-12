# RQ-tcr-variants-opus5 — Aggregation

_How do classic TCR and TCRDD variants affect correctness, code quality, development behavior, and efficiency in autonomous coding agents, and—within TCRDD—does tool-enforced execution with git-gamble differ from native-Git prompt enforcement?_

Generated: 2026-10-12T10:46:32Z

Cells declared: 4 · matched runs: 18 · min_replicates: 4

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc | opus-5-requesty-no-thinking | 4 | 4 | ✅ |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc | opus-5-requesty-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc | opus-5-requesty-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking | 4 | 4 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |   0.97 | 0.04 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |   1    | 0    |

### tests_passing

| kata                         | cell_workflow                           | cell_model                  |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |   4 |      0 |      100 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |   4 |      0 |      100 |

### tcr_method_commits

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |    0   |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |   11   |  2.35 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |   38.2 | 34.08 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |   35   | 11.11 |

### tcr_red_commits

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |    0   |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |   15.6 | 14.29 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |    0   |  0    |

### tcr_green_commits

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |    0   |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |    0   |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |   15.6 | 14.29 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |    0   |  0    |

### tcr_refactor_commits

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |    2.8 | 2.77 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |    0   | 0    |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |   3.67 | 0.3  |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |   8.66 | 2.33 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |   8.6  | 0.7  |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |  10.96 | 2.46 |

### longest_function

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |  19    | 3.74 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |  21.4  | 3.05 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |  20.6  | 3.05 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |  26.25 | 2.06 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |    3.5 | 1.91 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |    8.4 | 0.89 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |    6   | 1.41 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |    7   | 1.41 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |   3.75 | 0.96 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |   6.2  | 0.45 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |   5.6  | 0.55 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |   5.75 | 0.5  |

### smell_total

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |   0.5  | 0.58 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |   0.25 | 0.5  |

### code_mass

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 | 881.5  | 102.5  |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 | 702.4  |  53.55 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 | 643    |  30.22 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 | 610.75 |  54.01 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                  |   n |   null |    mean |     sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|--------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 | 3652.5  | 377.38 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |  280.2  |  50.15 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |  833.6  | 111.03 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |  684.75 |  81.39 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                  |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 | 6.31835e+07 | 2.70213e+06 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 | 3.87286e+06 | 1.04179e+06 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 | 1.97785e+07 | 3.27413e+06 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 | 1.48859e+07 | 2.36278e+06 |

### cost_usd

| kata                         | cell_workflow                           | cell_model                  |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |      0 |  58.07 | 4.25 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |      0 |   3.38 | 0.7  |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |      0 |  13.68 | 2.28 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |      0 |  10.52 | 1.52 |
