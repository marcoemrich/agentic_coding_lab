# RQ-fable-vs-opus5 — Aggregation

_How do Fable 5, Fable 5.1, Opus 5 and Sonnet 5 (each no-thinking, on the Claude Max subscription) differ in correctness and code quality on the novel claim-office kata under the current exact-coding baseline workflow?_

Generated: 2026-10-12T10:46:27Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 2.1.267 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking | 2.1.267 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking | 2.1.267 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |   0.95 | 0.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |   0.87 | 0.12 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |   0.93 | 0.08 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |   0.85 | 0.21 |

### verification_passed

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |   14.2 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |   13   | 1.87 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |   14   | 1.22 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |   12.8 | 3.19 |

### verification_total

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |     15 |    0 |

### avg_loc_per_function

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |   3.45 | 0.64 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |   4.79 | 0.75 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |   3.63 | 0.43 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |   6.5  | 1.39 |

### longest_function

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |   13.6 |  6.62 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |   17.6 |  3.21 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |   14.4 |  2.61 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |   26.2 | 11.86 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |    2.8 | 0.84 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |    3.2 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |    2.6 | 0.89 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |    4.2 | 0.45 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |    3   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |    3.8 | 0.84 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |    3.2 | 0.84 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |    4.4 | 0.55 |

### smell_total

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |    0.6 | 0.89 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |    0.2 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |    0.2 | 0.45 |

### code_mass

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |  848.4 | 79.93 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 |  659   | 12.92 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |  805.2 | 61.41 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |  817.2 | 73.36 |

### tests_passing

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |   5 |      0 |      100 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |      sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|--------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 | 2552.4 |  530.7  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 | 4950.4 | 3004.58 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 | 4042   |  211.65 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 | 2276.6 |  562.97 |

### total_tokens

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |        mean |          sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 | 8.44787e+07 | 1.37173e+07 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 | 7.49477e+07 | 5.07121e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 | 6.68828e+07 | 6.42148e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 | 1.10552e+08 | 3.07101e+07 |

### cost_usd

| kata                         | cell_workflow                   | cell_model                  | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:----------------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking          | 2.1.267        |   5 |      0 |  58.86 | 10.1  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-no-thinking         | 2.1.267        |   5 |      0 | 109.96 |  7.05 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | fable-5-1-no-thinking       | 2.1.267        |   5 |      0 |  43.72 |  4.65 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | sonnet-5-native-no-thinking | 2.1.267        |   5 |      0 |  28.28 |  6.96 |
