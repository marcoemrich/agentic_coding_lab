# RQ-tcr-variants-opus5 — Aggregation

_How do classic TCR and TCRDD variants affect correctness, code quality, development behavior, and efficiency in autonomous coding agents, and—within TCRDD—does tool-enforced execution with git-gamble differ from native-Git prompt enforcement?_

Generated: 2026-09-14T19:49:54Z

Cells declared: 4 · matched runs: 18 · min_replicates: 4

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc | opus-5-requesty-no-thinking | 4 | 4 | ✅ |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc | opus-5-requesty-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc | opus-5-requesty-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking | 4 | 4 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |   0.97 |  0.93 |     1 |  0.04 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                           | cell_model                  |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |       4 |      100 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |       4 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                           | cell_model                  |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |       4 |      100 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |       4 |      100 |

### test_blocks

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |  50    |    48 |    51 |  1.41 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   8.2  |     4 |    13 |  3.7  |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |  28    |    15 |    37 |  8    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |  26.25 |    24 |    28 |  1.71 |

### test_cases_total

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |  50.5  |    49 |    52 |  1.29 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |  35.8  |    17 |    57 | 16.71 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |  44.2  |    31 |    57 |  9.76 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |  29.75 |    26 |    38 |  5.68 |

### test_cases_first_block

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |    2.8 |     2 |     3 |  0.45 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |    1   |     1 |     1 |  0    |

### red_verified

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |  50    |    48 |    51 |  1.41 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   8    |     4 |    12 |  3.39 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |  28    |    15 |    37 |  8    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |  25.75 |    24 |    28 |  1.71 |

### red_unverified

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |    0.5 |     0 |     1 |  0.58 |

### tcr_refactor_steps

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |    4.2 |     2 |     6 |  1.64 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |    0.5 |     0 |     2 |  1    |

### tcr_method_commits

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   11   |     9 |    14 |  2.35 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |   38.2 |     1 |    67 | 34.08 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |   35   |    19 |    43 | 11.11 |

### tcr_red_commits

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |   15.6 |     0 |    28 | 14.29 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |

### tcr_green_commits

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |   15.6 |     0 |    28 | 14.29 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |

### tcr_refactor_commits

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |    2.8 |     0 |     6 |  2.77 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |    0   |     0 |     0 |  0    |

### cc_avg_loc_per_function

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |   3.67 |  3.27 |  3.94 |  0.3  |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   8.66 |  5.8  | 12.09 |  2.33 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |   8.6  |  8    |  9.73 |  0.7  |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |  10.96 |  8.92 | 14.5  |  2.46 |

### cc_longest_function

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |  19    |    14 |    23 |  3.74 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |  21.4  |    17 |    25 |  3.05 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |  20.6  |    19 |    26 |  3.05 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |  26.25 |    24 |    28 |  2.06 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |    3.5 |     2 |     6 |  1.91 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |    8.4 |     8 |    10 |  0.89 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |    6   |     5 |     8 |  1.41 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |    7   |     5 |     8 |  1.41 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |   3.75 |     3 |     5 |  0.96 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   6.2  |     6 |     7 |  0.45 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |   5.6  |     5 |     6 |  0.55 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |   5.75 |     5 |     6 |  0.5  |

### smell_total

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |   0.5  |     0 |     1 |  0.58 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |   0.25 |     0 |     1 |  0.5  |

### code_mass

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 | 881.5  |   780 |   979 | 102.5  |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 | 702.4  |   644 |   769 |  53.55 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 | 643    |   604 |   688 |  30.22 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 | 610.75 |   555 |   666 |  54.01 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                  |   n |    mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 | 3652.5  |  3287 |  4066 | 377.38 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |  280.2  |   244 |   363 |  50.15 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |  833.6  |   676 |   924 | 111.03 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |  684.75 |   600 |   788 |  81.39 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                  |   n |        mean |      min |      max |         std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 | 5.0024e+07  | 48502422 | 51185739 | 1.11626e+06 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 | 3.87286e+06 |  2897067 |  5540998 | 1.04179e+06 |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 | 1.97785e+07 | 15199937 | 23806188 | 3.27413e+06 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 | 1.48859e+07 | 12466054 | 18103900 | 2.36278e+06 |

### cost_usd

| kata                         | cell_workflow                           | cell_model                  |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc          | opus-5-requesty-no-thinking |   4 |  37.71 | 35.17 | 40.82 |  2.64 |
| claim-office-example-mapping | external-tcr-kentbeck-2026-09-14-cc     | opus-5-requesty-no-thinking |   5 |   3.38 |  2.57 |  4.39 |  0.7  |
| claim-office-example-mapping | external-tcrdd-bsene-2026-09-14-cc      | opus-5-requesty-no-thinking |   5 |  13.68 | 10.45 | 15.93 |  2.28 |
| claim-office-example-mapping | external-tcrdd-git-gamble-2026-09-14-cc | opus-5-requesty-no-thinking |   4 |  10.52 |  9.16 | 12.67 |  1.52 |
