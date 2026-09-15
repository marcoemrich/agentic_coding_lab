# RQ-srp-effect-exact-tcr-sol — Aggregation

_How does the same domain-boundary refactoring trial interact with SOL Predictive TDD versus EXACT TCR, and can a subordinate APP review lower Code Mass in the strongest TCR trial arm without erasing its decomposition, correctness, discipline, or efficiency?_

Generated: 2026-09-15T16:15:32Z

Cells declared: 14 · matched runs: 70 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                           | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                           | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   6.8  |  6.3  |  7.22 |  0.39 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   6.61 |  5.12 |  9.6  |  1.81 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   8    |  5.89 | 10.33 |  2.13 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   8.58 |  7.5  |  9.2  |  0.7  |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   7.03 |  5.89 |  7.5  |  0.68 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   5.67 |  4.64 |  6.56 |  0.69 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   5.54 |  4.94 |  6.67 |  0.67 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   6.62 |  6    |  8    |  0.81 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   5.56 |  4.5  |  7.6  |  1.24 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   7.05 |  4    |  9.67 |  2.34 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   7.11 |  5    |  8    |  1.29 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   6.78 |  5    |  8    |  1.26 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   5.63 |  4.14 |  8.25 |  1.8  |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   5.19 |  3.75 |  5.8  |  0.84 |

### cc_median_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    5.6 |   4   |   7   |  1.29 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    6   |   3.5 |  10.5 |  2.67 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    6.5 |   4   |   8.5 |  1.66 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    7.7 |   6.5 |   8   |  0.67 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    6   |   3   |   7   |  1.73 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4.7 |   3.5 |   5   |  0.67 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    4.5 |   3.5 |   5   |  0.71 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    4.2 |   2   |   6   |  1.64 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4.2 |   2   |   6   |  1.48 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    6   |   2   |  11   |  4.58 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    6.3 |   4   |   9   |  1.92 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    5.1 |   3   |   8.5 |  2.07 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4.6 |   3   |   6.5 |  1.39 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    3.7 |   2   |   5   |  1.2  |

### cc_longest_function

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   16.2 |    15 |    18 |  1.3  |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   15.8 |    13 |    20 |  2.77 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   18.2 |    12 |    30 |  6.91 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   17.2 |    14 |    21 |  2.59 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   17.2 |    15 |    20 |  2.17 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   14.2 |    11 |    18 |  2.59 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   13.4 |     9 |    18 |  3.51 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   14.2 |    10 |    19 |  3.83 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   12   |     9 |    15 |  2.83 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   13.8 |     7 |    19 |  4.76 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   12.4 |     9 |    17 |  3.13 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   13.6 |    12 |    18 |  2.51 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   10.8 |     6 |    17 |  4.32 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   10.2 |     6 |    14 |  2.86 |

### cc_functions

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   10.6 |     9 |    14 |  2.07 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   13   |    10 |    16 |  2.24 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    8.2 |     7 |     9 |  0.84 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    6.8 |     5 |     8 |  1.64 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    8.8 |     8 |     9 |  0.45 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   15.4 |    14 |    16 |  0.89 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   14.8 |    12 |    17 |  2.59 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     6 |  1.3  |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    6.4 |     5 |     7 |  0.89 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    3.2 |     3 |     4 |  0.45 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     5 |  0.84 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    4.6 |     3 |     7 |  1.52 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    5.8 |     4 |     7 |  1.64 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    5.8 |     4 |     8 |  1.48 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    4   |     2 |     5 |  1.22 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    3.4 |     2 |     7 |  2.07 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    3.2 |     2 |     4 |  0.84 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  1    |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  0.71 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  0.71 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    2.6 |     1 |     4 |  1.14 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    3.8 |     3 |     4 |  0.45 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    5.6 |     3 |     7 |  1.95 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    5.8 |     4 |     7 |  1.64 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    5.2 |     4 |     7 |  1.3  |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     6 |  1.64 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4   |     2 |     7 |  1.87 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    3.8 |     1 |     7 |  2.17 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   2.25 |  1.62 |  2.83 |  0.5  |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   1.81 |  1.31 |  2.42 |  0.48 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   1.72 |  1.57 |  1.86 |  0.12 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   1.82 |  1.4  |  2.43 |  0.45 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   1.93 |  1.43 |  2.62 |  0.43 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   1.47 |  1.33 |  1.67 |  0.15 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   1.46 |  1    |  2.12 |  0.45 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   2.77 |  2.33 |  3    |  0.33 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   2.85 |  1.5  |  4.5  |  1.17 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   3.26 |  2.33 |  4.33 |  0.72 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   3    |  2    |  4    |  0.82 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   2.53 |  1.5  |  3.5  |  0.71 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   2.35 |  1.25 |  4    |  1.02 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   2.47 |  1    |  4.33 |  1.28 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    4.8 |     3 |     6 |  1.3  |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4.6 |     3 |     7 |  1.52 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    4.8 |     3 |     7 |  1.48 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     7 |  1.64 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    3.4 |     2 |     4 |  0.89 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     5 |  0.84 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    5   |     4 |     7 |  1.22 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    4   |     4 |     4 |  0    |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4.4 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    4   |     3 |     5 |  1    |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   1.91 |  1.67 |  2.25 |  0.24 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   2.02 |  1.71 |  2.59 |  0.36 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   1.63 |  1.41 |  1.76 |  0.15 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   1.91 |  1.52 |  2.17 |  0.27 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   1.91 |  1.42 |  2.29 |  0.39 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   1.5  |  1.42 |  1.68 |  0.11 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   1.5  |  1.33 |  1.73 |  0.18 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   1.84 |  1.6  |  2    |  0.17 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   1.62 |  1.42 |  2    |  0.22 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   2.25 |  1.67 |  2.8  |  0.53 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   2.12 |  1.78 |  2.67 |  0.35 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   1.73 |  1.5  |  2    |  0.2  |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   1.81 |  1.55 |  2.5  |  0.4  |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   1.76 |  1.31 |  2.29 |  0.4  |

### smell_total

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### smell_code_quality

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |  574.2 |   549 |   627 | 34.31 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  600.8 |   535 |   650 | 43.56 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |  553.6 |   533 |   604 | 29.13 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |  546.8 |   511 |   578 | 25.33 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |  553.2 |   528 |   570 | 16.33 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  568.4 |   541 |   605 | 26.09 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |  571.8 |   529 |   604 | 29.88 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |  166.4 |   148 |   196 | 20.38 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  183.4 |   168 |   205 | 13.39 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |  159.4 |   145 |   171 |  9.34 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |  162.2 |   135 |   176 | 16.15 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |  182.4 |   157 |   257 | 42.65 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  165.8 |   156 |   182 | 10.26 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |  163.2 |   142 |   187 | 19.36 |

### cc_loc

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |  146   |   124 |   177 | 25.35 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  151.8 |   145 |   163 |  8.93 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |  129   |   105 |   166 | 23.4  |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |  106.8 |    93 |   124 | 13.18 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |  118.4 |   100 |   132 | 13.01 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  153.2 |   141 |   166 | 10.13 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |  134.8 |   108 |   157 | 17.88 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   35.2 |    25 |    44 |  8.53 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   42.8 |    37 |    49 |  5.17 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   28.4 |    23 |    32 |  3.58 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   37   |    30 |    41 |  4.3  |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   38.6 |    30 |    47 |  6.43 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   40.6 |    39 |    43 |  1.67 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   36   |    30 |    41 |  5.1  |

### test_lines

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |  196   |   148 |   234 | 34.98 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  186.8 |   146 |   212 | 27.22 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |  214.6 |   183 |   267 | 31.22 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |  191   |   166 |   236 | 30.72 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |  223.8 |   207 |   237 | 12.68 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  218.4 |   146 |   262 | 44.72 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |  234.8 |   184 |   299 | 44.64 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   55.6 |    41 |    68 | 10.21 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   54.8 |    49 |    66 |  6.98 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   52.2 |    40 |    61 |  8.7  |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   48.2 |    40 |    57 |  6.38 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   50.2 |    44 |    58 |  5.76 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   51.8 |    45 |    55 |  4.15 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   43.4 |    37 |    48 |  4.04 |

### test_blocks

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   25.2 |    13 |    37 |  8.67 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   21.8 |    12 |    31 |  8.32 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   37   |    35 |    39 |  1.58 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   35   |    23 |    39 |  6.82 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   36.8 |    35 |    39 |  1.48 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   37.6 |    36 |    41 |  1.95 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   32.2 |    20 |    40 |  7.53 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   10.6 |     9 |    13 |  1.67 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   11   |    10 |    12 |  1    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   13   |    12 |    14 |  1    |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   11.8 |    10 |    13 |  1.3  |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   12.2 |    12 |    13 |  0.45 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   12.4 |    12 |    13 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   11.4 |    11 |    12 |  0.55 |

### red_verified

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    9.8 |     1 |    20 |  7.33 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    8.6 |     0 |    17 |  7.64 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   36.8 |    35 |    39 |  1.79 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   35   |    23 |    39 |  6.82 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   36.8 |    35 |    39 |  1.48 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   37.4 |    35 |    41 |  2.19 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   32   |    20 |    40 |  7.45 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    5.4 |     3 |     9 |  2.51 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    5   |     3 |     7 |  1.58 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   12.8 |    12 |    14 |  0.84 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   11.8 |    10 |    13 |  1.3  |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   12.2 |    12 |    13 |  0.45 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   11.8 |    11 |    13 |  0.84 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   11.2 |    11 |    12 |  0.45 |

### red_unverified

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   15.4 |    12 |    18 |  2.3  |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   13.2 |    12 |    14 |  0.84 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    5.2 |     4 |     7 |  1.3  |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    6   |     5 |     8 |  1.41 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0.6 |     0 |     1 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    0.2 |     0 |     1 |  0.45 |

### tcr_refactor_steps

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    5.6 |     1 |    12 |  4.16 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    1.8 |     1 |     3 |  1.1  |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    4   |     1 |     6 |  2    |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   10.6 |     4 |    14 |  4.16 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    9.8 |     3 |    13 |  4.09 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    2.8 |     1 |     8 |  3.03 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    2.6 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    2   |     1 |     3 |  0.71 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4   |     2 |     5 |  1.41 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    2.8 |     2 |     4 |  0.84 |

### tcr_method_commits

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   58.8 |    48 |    67 |  7.73 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   54   |    51 |    58 |  2.92 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   57.6 |    53 |    60 |  2.79 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   62   |    48 |    73 |  9.06 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   59.6 |    50 |    70 |  7.37 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   19.6 |    16 |    26 |  3.91 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   17.6 |    16 |    20 |  1.67 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   18.4 |    17 |    21 |  1.67 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   18.8 |    17 |    21 |  1.48 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   17.4 |    16 |    19 |  1.14 |

### tcr_red_commits

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   17.2 |    13 |    21 |  2.95 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   15.2 |    11 |    17 |  2.39 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   17.4 |    15 |    20 |  2.3  |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   15.6 |    10 |    21 |  3.97 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   16.2 |    14 |    20 |  2.39 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    5.4 |     3 |     7 |  1.82 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    4.4 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    4.8 |     4 |     8 |  1.79 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    4.8 |     4 |     6 |  0.84 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     5 |  0.84 |

### tcr_green_commits

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   35.4 |    33 |    38 |  1.95 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   36   |    34 |    38 |  1.58 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   35.4 |    34 |    37 |  1.34 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   36   |    34 |    40 |  2.35 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   33.2 |    30 |    38 |  3.11 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   10.4 |     9 |    11 |  0.89 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    9.8 |     9 |    11 |  0.84 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   10.6 |    10 |    11 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   10   |     9 |    11 |  0.71 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    9.6 |     8 |    10 |  0.89 |

### tcr_refactor_commits

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    5.2 |     1 |    10 |  3.42 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    1.8 |     1 |     3 |  1.1  |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    3.8 |     1 |     5 |  1.79 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    9.4 |     2 |    14 |  4.93 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    9.2 |     3 |    13 |  3.77 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |    2.8 |     1 |     8 |  3.03 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    2.4 |     1 |     3 |  0.89 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |    2   |     1 |     3 |  0.71 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  1    |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    2.6 |     2 |     4 |  0.89 |

### cycle_count

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   30.8 |    24 |    37 |  5.07 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   27.2 |    21 |    32 |  4.44 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   35.6 |    34 |    38 |  1.67 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   36   |    34 |    38 |  1.58 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   35.4 |    34 |    37 |  1.34 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   36   |    34 |    40 |  2.35 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   33.2 |    30 |    38 |  3.11 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   10.2 |     8 |    13 |  1.92 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   10.6 |    10 |    11 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   10.8 |    10 |    11 |  0.45 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |    9.8 |     9 |    11 |  0.84 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   10.6 |    10 |    11 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   10   |     9 |    11 |  0.71 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |    9.6 |     8 |    10 |  0.89 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   30.8 |    24 |    37 |  5.07 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   27.2 |    21 |    32 |  4.44 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   36.8 |    35 |    38 |  1.64 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   37.2 |    35 |    39 |  1.64 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   37   |    35 |    40 |  2.12 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   37.4 |    35 |    40 |  2.07 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   33.4 |    30 |    38 |  3.13 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   10.2 |     8 |    13 |  1.92 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   10.6 |    10 |    11 |  0.55 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   12.8 |    11 |    16 |  2.05 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   10.6 |     9 |    12 |  1.14 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   13   |    12 |    14 |  0.71 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   12.4 |    10 |    15 |  1.95 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   10.2 |     9 |    12 |  1.1  |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                           | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |       153 |     156 |     98.1 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       125 |     130 |     96.2 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |       356 |     356 |    100   |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |       357 |     360 |     99.2 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |       350 |     354 |     98.9 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       360 |     362 |     99.4 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |       327 |     332 |     98.5 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |        52 |      52 |    100   |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |        54 |      54 |    100   |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |       106 |     108 |     98.1 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |        98 |      98 |    100   |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |       106 |     106 |    100   |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |       101 |     102 |     99   |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |        96 |      96 |    100   |

### duration_seconds

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 | 1388.4 |  1007 |  1742 | 303.23 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 | 1087.8 |   860 |  1380 | 198.3  |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 | 1082   |   956 |  1309 | 141.17 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |  973.4 |   819 |  1157 | 121.91 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 | 1064.6 |   964 |  1110 |  59.38 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 | 1439.8 |  1041 |  1884 | 314.57 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 | 1270.4 |   807 |  1740 | 341.54 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |  428.4 |   382 |   484 |  37.79 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  493.8 |   422 |   549 |  51.49 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |  447.4 |   336 |   552 |  86.33 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |  410.8 |   372 |   446 |  31.09 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |  416.8 |   351 |   496 |  53.91 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  497.6 |   426 |   539 |  44.24 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |  468.2 |   401 |   548 |  61.9  |

### total_tokens

| kata                         | cell_workflow                           | cell_model        |   n |             mean |     min |     max |              std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-----------------:|--------:|--------:|-----------------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      5.48161e+06 | 4140296 | 6995978 |      1.25818e+06 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      4.76884e+06 | 2734920 | 5769614 |      1.36416e+06 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      6.29228e+06 | 5377695 | 7031633 | 653247           |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      4.65988e+06 | 3310285 | 6557192 |      1.33946e+06 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      5.95626e+06 | 4780106 | 6955020 | 883631           |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      6.64817e+06 | 4236451 | 9830011 |      2.5006e+06  |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      6.20499e+06 | 3129072 | 9522755 |      2.45353e+06 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      1.07104e+06 |  919868 | 1228032 | 118935           |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      1.29537e+06 | 1020658 | 1572440 | 217904           |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      1.17804e+06 |  757258 | 1813462 | 389931           |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 | 893641           |  691282 | 1083590 | 153445           |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      1.0814e+06  |  935438 | 1588582 | 284245           |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      1.2859e+06  | 1141071 | 1513241 | 152935           |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      1.13964e+06 |  996889 | 1291279 | 132482           |

### cost_usd

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   4.16 |  3.37 |  5.27 |  0.85 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   3.65 |  2.28 |  4.32 |  0.86 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   4.54 |  3.86 |  4.99 |  0.44 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   3.7  |  3    |  4.9  |  0.76 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   4.54 |  3.93 |  4.99 |  0.47 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   4.83 |  3.03 |  6.95 |  1.72 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   4.57 |  2.87 |  6.38 |  1.39 |
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   1.16 |  1.05 |  1.31 |  0.1  |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   1.34 |  1.13 |  1.62 |  0.21 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   1.23 |  0.77 |  1.82 |  0.38 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   0.99 |  0.79 |  1.16 |  0.14 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   1.14 |  0.96 |  1.57 |  0.25 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   1.42 |  1.24 |  1.7  |  0.18 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   1.24 |  1.11 |  1.42 |  0.17 |
