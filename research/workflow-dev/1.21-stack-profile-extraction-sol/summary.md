# RQ-stack-profile-extraction-sol — Aggregation

_Can all remaining TypeScript/Vitest-specific instructions be moved from the Sol-originated Predictive TDD orchestration and test-list skill into its existing stack profile without changing correctness, TDD discipline, refactoring behaviour, code quality or cost?_

Generated: 2026-10-12T08:37:58Z

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

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                   | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### cycle_count

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 0.45 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |   33.4 | 2.97 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   32.6 | 2.3  |

### refactorings_applied

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 0.45 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |   33.2 | 2.68 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   32.6 | 2.3  |

### predictions_correct_rate

| kata                         | cell_workflow                   | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:--------------------------------|:------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |  48 |  48 |      0 |    100   |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 | 137 | 138 |      0 |     99.3 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |  50 |  50 |      0 |    100   |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 | 173 | 173 |      0 |    100   |

### tests_passed_immediately

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### avg_loc_per_function

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |   7.44 | 1.59 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |   7.42 | 1.04 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   6.63 | 1.41 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   7.69 | 1.42 |

### longest_function

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |   14   | 4.95 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |   20.8 | 2.39 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   13   | 4    |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   17   | 2.83 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.64 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |    4.8 | 2.39 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 1.79 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 0.84 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |    4.4 | 0.55 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 1.52 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.4 | 0.55 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 0.55 |

### smell_total

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |  156.8 | 13.46 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |  562.6 | 48.81 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  155.4 |  9.24 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  566.6 | 51.91 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |  400.2 |  25.76 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 | 1083.8 | 251.77 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |  416.8 |  56.81 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 | 1158.8 | 200.8  |

### total_tokens

| kata                         | cell_workflow                   | cell_model        |   n |   null |             mean |               sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 | 932843           |  78633.2         |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |      4.86904e+06 |      1.61694e+06 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      1.03646e+06 | 213561           |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |      4.92493e+06 |      1.07327e+06 |

### cost_usd

| kata                         | cell_workflow                   | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |   1.03 | 0.09 |
| claim-office-example-mapping | exact-sol-v1-pi                 | gpt-5-6-sol-codex |   5 |      0 |   3.66 | 1.03 |
| game-of-life-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   1.1  | 0.15 |
| claim-office-example-mapping | exact-sol-v1.3-stack-profile-pi | gpt-5-6-sol-codex |   5 |      0 |   3.65 | 0.7  |
