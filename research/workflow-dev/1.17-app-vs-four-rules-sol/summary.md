# RQ-app-vs-four-rules-sol — Aggregation

_On the OpenAI subscription route, does a refactor brief that optimises APP mass (v6.2.1) decompose worse than one governed by the Four Rules of Simple Design alone (basic-sol-tdd) — at constant model, harness, kata and prompt style?_

Generated: 2026-08-17T03:44:47Z

Cells declared: 3 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | basic-sol-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cc_avg_loc_per_function

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |   6.6  |  5.25 |  8.5  |  1.18 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |   8.45 |  6.62 | 12.67 |  2.41 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   9.52 |  5.75 | 19.33 |  5.69 |

### cc_median_loc_per_function

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |    4.7 |   3.5 |     5 |  0.67 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |    6.1 |   4   |     9 |  1.82 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |    6   |   2   |    12 |  3.67 |

### cc_longest_function

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |     18 |    15 |    23 |  3    |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |     27 |    19 |    47 | 11.34 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |     24 |     9 |    44 | 13.17 |

### code_mass

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |  556.8 |   525 |   651 | 53.01 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |  750   |   675 |   870 | 83.39 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |  492.4 |   405 |   561 | 62.7  |

### cognitive_max

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |    4   |     3 |     5 |  0.71 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |   11.4 |     4 |    29 | 10.01 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |    8.2 |     4 |    15 |  4.66 |

### cognitive_avg

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |   2.15 |  1.89 |  2.43 |  0.19 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |   3.4  |  2.46 |  5.9  |  1.41 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   3.55 |  2    |  7    |  2.01 |

### mccabe_max

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |    5.4 |     4 |     6 |  0.89 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |    9.8 |     6 |    19 |  5.36 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |    6.2 |     4 |     8 |  2.05 |

### smell_total

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |    4.2 |     0 |    21 |  9.39 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |    9.6 |     0 |    19 |  9.02 |

### verification_pct (rate %)

| kata                         | cell_workflow                | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |

### tests_passing (rate %)

| kata                         | cell_workflow                | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |   31.6 |    19 |    39 |  7.54 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  0.71 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   28   |    22 |    34 |  5.34 |

### refactorings_applied

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |   31.6 |    19 |    39 |  7.54 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |    0.4 |     0 |     1 |  0.55 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   14.2 |    11 |    18 |  3.11 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |       138 |     140 |     98.6 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |       137 |     138 |     99.3 |

### duration_seconds

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |  874.2 |   778 |  1013 |  92.43 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |  218.2 |   167 |   252 |  35.35 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 | 1265.6 |  1080 |  1386 | 125.46 |

### total_tokens

| kata                         | cell_workflow                | cell_model        |   n |             mean |     min |     max |              std |
|:-----------------------------|:-----------------------------|:------------------|----:|-----------------:|--------:|--------:|-----------------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |      4.60854e+06 | 3370918 | 6055547 |      1.10196e+06 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 | 271849           |  216962 |  389288 |  67725.8         |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      4.60964e+06 | 3199381 | 5597706 | 894835           |

### cost_usd

| kata                         | cell_workflow                | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | basic-sol-tdd-pi             | gpt-5-6-sol-codex |   5 |   3.98 |  3.08 |  4.9  |  0.74 |
| claim-office-example-mapping | v3-basic-tdd-pi              | gpt-5-6-sol-codex |   5 |   0.58 |  0.51 |  0.73 |  0.09 |
| claim-office-example-mapping | v6.2.1-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   3.07 |  1.92 |  3.66 |  0.68 |
