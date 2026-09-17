# RQ-stack-profile-extraction-sol — Aggregation

_Can all remaining TypeScript/Vitest-specific instructions be moved from the Sol-originated Predictive TDD orchestration and test-list skill into its existing stack profile without changing correctness, TDD discipline, refactoring behaviour, code quality or cost?_

Generated: 2026-09-17T01:17:52Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                   | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                   | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   33.4 |    29 |    37 |  2.97 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   32.6 |    29 |    35 |  2.3  |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |    9.8 |     9 |    10 |  0.45 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    9.8 |     9 |    11 |  0.84 |

### refactorings_applied

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   33.2 |    29 |    36 |  2.68 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   32.6 |    29 |    35 |  2.3  |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |    9.8 |     9 |    10 |  0.45 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    9.8 |     9 |    11 |  0.84 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                   | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |       137 |     138 |     99.3 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |       173 |     173 |    100   |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |        48 |      48 |    100   |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |        50 |      50 |    100   |

### tests_passed_immediately

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   7.42 |  5.92 |  8.71 |  1.04 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   7.69 |  6.33 |  9.86 |  1.42 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   7.44 |  5.75 | 10    |  1.59 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   6.63 |  4.5  |  8.33 |  1.41 |

### cc_longest_function

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   20.8 |    17 |    23 |  2.39 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   17   |    12 |    19 |  2.83 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   14   |    10 |    22 |  4.95 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   13   |     8 |    19 |  4    |

### cognitive_max

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |    4.8 |     3 |     9 |  2.39 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     5 |  0.84 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     7 |  1.64 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.2 |     2 |     6 |  1.79 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |    5.6 |     4 |     8 |  1.52 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.6 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |    4.4 |     4 |     5 |  0.55 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |    4.4 |     4 |     5 |  0.55 |

### smell_total

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |  562.6 |   499 |   634 | 48.81 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  566.6 |   498 |   642 | 51.91 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |  156.8 |   142 |   178 | 13.46 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  155.4 |   146 |   169 |  9.24 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 | 1083.8 |   690 |  1294 | 251.77 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 | 1158.8 |   939 |  1423 | 200.8  |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |  400.2 |   368 |   425 |  25.76 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  416.8 |   322 |   462 |  56.81 |

### total_tokens

| kata                         | cell_workflow                   | cell_model        |   n |             mean |     min |     max |              std |
|:-----------------------------|:--------------------------------|:------------------|----:|-----------------:|--------:|--------:|-----------------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      4.86904e+06 | 2245956 | 6118701 |      1.61694e+06 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      4.92493e+06 | 3284793 | 6212995 |      1.07327e+06 |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 | 932843           |  840853 | 1046644 |  78633.2         |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      1.03646e+06 |  776819 | 1297981 | 213561           |

### cost_usd

| kata                         | cell_workflow                   | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   3.66 |  1.98 |  4.64 |  1.03 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   3.65 |  2.82 |  4.7  |  0.7  |
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   1.03 |  0.94 |  1.16 |  0.09 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   1.1  |  0.93 |  1.22 |  0.15 |
