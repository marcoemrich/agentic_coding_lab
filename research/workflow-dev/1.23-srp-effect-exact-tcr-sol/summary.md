# RQ-srp-effect-exact-tcr-sol — Aggregation

_How does the same domain-boundary refactoring trial interact with SOL Predictive TDD versus EXACT TCR, and can a subordinate APP review lower Code Mass in the strongest TCR trial arm without erasing its decomposition, correctness, discipline, or efficiency?_

Generated: 2026-10-12T10:46:47Z

Cells declared: 14 · matched runs: 71 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1-pi | gpt-5-6-sol-codex | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-tcr-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                           | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   6.62 | 0.81 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   6.8  | 0.39 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   5.56 | 1.24 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   6.61 | 1.81 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |   7.54 | 2.42 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   8    | 2.13 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   7.11 | 1.29 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   8.58 | 0.7  |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   6.78 | 1.26 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   7.03 | 0.68 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   5.63 | 1.8  |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   5.67 | 0.69 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   5.19 | 0.84 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   5.54 | 0.67 |

### median_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   4.2  | 1.64 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   5.6  | 1.29 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   4.2  | 1.48 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   6    | 2.67 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |   6.67 | 4.41 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   6.5  | 1.66 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   6.3  | 1.92 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   7.7  | 0.67 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   5.1  | 2.07 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   6    | 1.73 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   4.6  | 1.39 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   4.7  | 0.67 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   3.7  | 1.2  |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   4.5  | 0.71 |

### longest_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   14.2 | 3.83 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   16.2 | 1.3  |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   12   | 2.83 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   15.8 | 2.77 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |   14.5 | 4.59 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   18.2 | 6.91 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   12.4 | 3.13 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   17.2 | 2.59 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   13.6 | 2.51 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   17.2 | 2.17 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   10.8 | 4.32 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   14.2 | 2.59 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   10.2 | 2.86 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   13.4 | 3.51 |

### functions

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.3  |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   10.6 | 2.07 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    6.4 | 0.89 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   13   | 2.24 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |    3   | 0.63 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    8.2 | 0.84 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 0.84 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    6.8 | 1.64 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 1.52 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |    8.8 | 0.45 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    5.8 | 1.64 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   15.4 | 0.89 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |    5.8 | 1.48 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   14.8 | 2.59 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    3.8 | 0.45 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    4   | 1.22 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 1.95 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    3.4 | 2.07 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |    5.5 | 1.64 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    3.2 | 0.84 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    5.2 | 1.3  |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    3   | 1    |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.64 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |    3   | 0.71 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4   | 1.87 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    3   | 0.71 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |    3.8 | 2.17 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |    2.6 | 1.14 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   2.77 | 0.33 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   2.25 | 0.5  |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   2.85 | 1.17 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1.81 | 0.48 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |   3.22 | 0.66 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   1.72 | 0.12 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   3    | 0.82 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   1.82 | 0.45 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   2.53 | 0.71 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   1.93 | 0.43 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   2.35 | 1.02 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1.47 | 0.15 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   2.47 | 1.28 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.46 | 0.45 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 0.55 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    4.8 | 1.3  |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 1.52 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |    5   | 1.1  |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    4   | 0.71 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 0.55 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    4.8 | 1.48 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |    4   | 0    |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |    4   | 0.71 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4.4 | 0.55 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.64 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |    4   | 1    |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |    3.4 | 0.89 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.84 | 0.17 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.91 | 0.24 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1.62 | 0.22 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   2.02 | 0.36 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |   2.29 | 0.49 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   1.63 | 0.15 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   2.12 | 0.35 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   1.91 | 0.27 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   1.73 | 0.2  |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   1.91 | 0.39 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1.81 | 0.4  |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1.5  | 0.11 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.76 | 0.4  |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.5  | 0.18 |

### smell_total

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### smell_code_quality

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |  166.4 | 20.38 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |  574.2 | 34.31 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  183.4 | 13.39 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  600.8 | 43.56 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |  155.5 | 12.69 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |  553.6 | 29.13 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  162.2 | 16.15 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  546.8 | 25.33 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |  182.4 | 42.65 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |  553.2 | 16.33 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  165.8 | 10.26 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  568.4 | 26.09 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |  163.2 | 19.36 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |  571.8 | 29.88 |

### production_loc

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |  35.2  |  8.53 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 | 146    | 25.35 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  42.8  |  5.17 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 | 151.8  |  8.93 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |  27.83 |  3.49 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 | 129    | 23.4  |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  37    |  4.3  |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 | 106.8  | 13.18 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |  38.6  |  6.43 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 | 118.4  | 13.01 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  40.6  |  1.67 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 | 153.2  | 10.13 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |  36    |  5.1  |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 | 134.8  | 17.88 |

### test_lines

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |  55.6  | 10.21 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 | 196    | 34.98 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  54.8  |  6.98 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 | 186.8  | 27.22 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |  53.33 |  8.26 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 | 214.6  | 31.22 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  48.2  |  6.38 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 | 191    | 30.72 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |  50.2  |  5.76 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 | 223.8  | 12.68 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  51.8  |  4.15 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 | 218.4  | 44.72 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |  43.4  |  4.04 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 | 234.8  | 44.64 |

### tcr_method_commits

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |  19.17 | 3.66 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |  58.8  | 7.73 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  17.6  | 1.67 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  54    | 2.92 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |  18.4  | 1.67 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |  57.6  | 2.79 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  18.8  | 1.48 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  62    | 9.06 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |  17.4  | 1.14 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |  59.6  | 7.37 |

### tcr_red_commits

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |   5.17 | 1.72 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |  17.2  | 2.95 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   4.4  | 0.55 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  15.2  | 2.39 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   4.8  | 1.79 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |  17.4  | 2.3  |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   4.8  | 0.84 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  15.6  | 3.97 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   4.2  | 0.84 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |  16.2  | 2.39 |

### tcr_green_commits

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |   10.5 | 0.84 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   35.4 | 1.95 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 0.84 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   36   | 1.58 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   10.6 | 0.55 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   35.4 | 1.34 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   10   | 0.71 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   36   | 2.35 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |    9.6 | 0.89 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   33.2 | 3.11 |

### tcr_refactor_commits

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |    2.5 | 2.81 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    5.2 | 3.42 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    2.4 | 0.89 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |    1.8 | 1.1  |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |    2   | 0.71 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |    3.8 | 1.79 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    3   | 1    |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |    9.4 | 4.93 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |    2.6 | 0.89 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |    9.2 | 3.77 |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |  52 |  52 |      0 |    100   |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 | 153 | 156 |      0 |     98.1 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |  54 |  54 |      0 |    100   |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 | 125 | 130 |      0 |     96.2 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 | 128 | 130 |      0 |     98.5 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 | 356 | 356 |      0 |    100   |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |  98 |  98 |      0 |    100   |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 | 357 | 360 |      0 |     99.2 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 | 106 | 106 |      0 |    100   |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 | 350 | 354 |      0 |     98.9 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 | 101 | 102 |      0 |     99   |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 | 360 | 362 |      0 |     99.4 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |  96 |  96 |      0 |    100   |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 | 327 | 332 |      0 |     98.5 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model        |   n |   null |    mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|--------:|-------:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |  428.4  |  37.79 |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 | 1388.4  | 303.23 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  493.8  |  51.49 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 | 1087.8  | 198.3  |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |  423.83 |  96.41 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 | 1082    | 141.17 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  410.8  |  31.09 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |  973.4  | 121.91 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |  416.8  |  53.91 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 | 1064.6  |  59.38 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |  497.6  |  44.24 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 | 1439.8  | 314.57 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |  468.2  |  61.9  |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 | 1270.4  | 341.54 |

### total_tokens

| kata                         | cell_workflow                           | cell_model        |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      1.07104e+06 | 118935           |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |      5.48161e+06 |      1.25818e+06 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      1.29537e+06 | 217904           |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      4.76884e+06 |      1.36416e+06 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |      1.1229e+06  | 374011           |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      6.29228e+06 | 653247           |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 | 893641           | 153445           |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |      4.65988e+06 |      1.33946e+06 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |      1.0814e+06  | 284245           |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |      5.95626e+06 | 883631           |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      1.2859e+06  | 152935           |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |      6.64817e+06 |      2.5006e+06  |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |      1.13964e+06 | 132482           |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |      6.20499e+06 |      2.45353e+06 |

### cost_usd

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.16 | 0.1  |
| claim-office-example-mapping | exact-sol-v1.3.2-local-git-control-pi   | gpt-5-6-sol-codex |   5 |      0 |   4.16 | 0.85 |
| game-of-life-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1.34 | 0.21 |
| claim-office-example-mapping | exact-sol-v1.4-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   3.65 | 0.86 |
| game-of-life-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   6 |      0 |   1.18 | 0.36 |
| claim-office-example-mapping | exact-tcr-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   4.54 | 0.44 |
| game-of-life-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   0.99 | 0.14 |
| claim-office-example-mapping | exact-tcr-v1.1-srp-pi                   | gpt-5-6-sol-codex |   5 |      0 |   3.7  | 0.76 |
| game-of-life-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   1.14 | 0.25 |
| claim-office-example-mapping | exact-tcr-v1.2-domain-responsibility-pi | gpt-5-6-sol-codex |   5 |      0 |   4.54 | 0.47 |
| game-of-life-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   1.42 | 0.18 |
| claim-office-example-mapping | exact-tcr-v1.3-domain-boundary-trial-pi | gpt-5-6-sol-codex |   5 |      0 |   4.83 | 1.72 |
| game-of-life-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   1.24 | 0.17 |
| claim-office-example-mapping | exact-tcr-v1.4-domain-boundary-app-pi   | gpt-5-6-sol-codex |   5 |      0 |   4.57 | 1.39 |
