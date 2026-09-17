# RQ-app-vs-four-rules-sol — Aggregation

_On the OpenAI subscription route, does a refactor brief that optimises APP mass (hybrid-v4.2) decompose worse than one governed by the Four Rules of Simple Design alone (basic-sol-tdd) — at constant model, harness, kata and prompt style?_

Generated: 2026-09-17T01:17:50Z

Cells declared: 3 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cc_avg_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |   8.45 |  6.62 | 12.67 |  2.41 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   9.52 |  5.75 | 19.33 |  5.69 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |   7.42 |  5.92 |  8.71 |  1.04 |

### cc_median_loc_per_function

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |    6.1 |     4 |     9 |  1.82 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |    6   |     2 |    12 |  3.67 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |    4.5 |     4 |     6 |  0.87 |

### cc_longest_function

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |   27   |    19 |    47 | 11.34 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   24   |     9 |    44 | 13.17 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |   20.8 |    17 |    23 |  2.39 |

### code_mass

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |  750   |   675 |   870 | 83.39 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |  492.4 |   405 |   561 | 62.7  |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |  562.6 |   499 |   634 | 48.81 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |   11.4 |     4 |    29 | 10.01 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |    8.2 |     4 |    15 |  4.66 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |    4.8 |     3 |     9 |  2.39 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |   3.4  |  2.46 |  5.9  |  1.41 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   3.55 |  2    |  7    |  2.01 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |   2.1  |  1.75 |  2.38 |  0.29 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |    9.8 |     6 |    19 |  5.36 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |    6.2 |     4 |     8 |  2.05 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |    5.6 |     4 |     8 |  1.52 |

### smell_total

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |    4.2 |     0 |    21 |  9.39 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |    9.6 |     0 |    19 |  9.02 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |    0   |     0 |     0 |  0    |

### verification_pct

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                           | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                           | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |    3   |     2 |     4 |  0.71 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   28   |    22 |    34 |  5.34 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |   33.4 |    29 |    37 |  2.97 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |    0.4 |     0 |     1 |  0.55 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   14.2 |    11 |    18 |  3.11 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |   33.2 |    29 |    36 |  2.68 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                           | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |       137 |     138 |     99.3 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |       137 |     138 |     99.3 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |  218.2 |   167 |   252 |  35.35 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 | 1265.6 |  1080 |  1386 | 125.46 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 | 1083.8 |   690 |  1294 | 251.77 |

### total_tokens

| kata                         | cell_workflow                           | cell_model        |   n |             mean |     min |     max |              std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-----------------:|--------:|--------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 | 271849           |  216962 |  389288 |  67725.8         |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |      4.60964e+06 | 3199381 | 5597706 | 894835           |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |      4.86904e+06 | 2245956 | 6118701 |      1.61694e+06 |

### cost_usd

| kata                         | cell_workflow                           | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi               | gpt-5-6-sol-codex |   5 |   0.58 |  0.51 |  0.73 |  0.09 |
| claim-office-example-mapping | exact-hybrid-v4.2-phase-continuation-pi | gpt-5-6-sol-codex |   5 |   4.84 |  3.62 |  5.5  |  0.81 |
| claim-office-example-mapping | exact-sol-v1-pi                         | gpt-5-6-sol-codex |   5 |   3.66 |  1.98 |  4.64 |  1.03 |
