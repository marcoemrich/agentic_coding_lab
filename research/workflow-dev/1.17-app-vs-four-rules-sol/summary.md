# RQ-app-vs-four-rules-sol — Aggregation

_On the OpenAI subscription route, does a refactor brief that optimises APP mass (hybrid-v4.2) decompose worse than one governed by the Four Rules of Simple Design alone (basic-sol-tdd) — at constant model, harness, kata and prompt style?_

Generated: 2026-10-12T08:37:56Z

Cells declared: 3 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |   8.45 | 2.41 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   7.42 | 1.04 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |   9.52 | 5.69 |

### median_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |    6.1 | 1.82 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    4.5 | 0.87 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |    6   | 3.67 |

### longest_function

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |   27   | 11.34 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   20.8 |  2.39 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |   24   | 13.17 |

### code_mass

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |  750   | 83.39 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |  562.6 | 48.81 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |  492.4 | 62.7  |

### cognitive_max

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |   11.4 | 10.01 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    4.8 |  2.39 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |    8.2 |  4.66 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |   3.4  | 1.41 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   2.1  | 0.29 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |   3.55 | 2.01 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 5.36 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 1.52 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |    6.2 | 2.05 |

### smell_total

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 9.39 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |    9.6 | 9.02 |

### verification_pct

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                           | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### cycle_count

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |    3   | 0.71 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   33.4 | 2.97 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |   28   | 5.34 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |    0.4 | 0.55 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   33.2 | 2.68 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |   14.2 | 3.11 |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |    nan |  nan | 137 | 138 |     99.3 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |    nan |  nan | 137 | 138 |     99.3 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |  218.2 |  35.35 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 | 1083.8 | 251.77 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 | 1265.6 | 125.46 |

### total_tokens

| kata                         | cell_workflow                           | cell_model        |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 | 271849           |  67725.8         |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |      4.86904e+06 |      1.61694e+06 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |      4.60964e+06 | 894835           |

### cost_usd

| kata                         | cell_workflow                           | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      0 |   0.58 | 0.09 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      0 |   3.66 | 1.03 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      0 |   4.84 | 0.81 |
