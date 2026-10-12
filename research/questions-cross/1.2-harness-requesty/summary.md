# RQ-harness-requesty — Aggregation

_How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant?_

Generated: 2026-10-12T08:37:43Z

Cells declared: 6 · matched runs: 30 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### tests_passing

| kata                         | cell_workflow              | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:---------------------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   39.8 | 3.7  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    8.8 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   36.4 | 2.88 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |    8.4 | 0.55 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   39.4 | 4.28 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |    8.6 | 0.89 |

### verification_pct

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   0.93 | 0.12 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   0.88 | 0.17 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   0.99 | 0.03 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   1    | 0    |

### verification_passed

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   14   | 1.73 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   13.2 | 2.49 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   14.8 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   15   | 0    |

### code_mass

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |  862.8 | 76.28 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |  158.6 | 13.58 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |  920.6 | 60    |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |  154.2 | 12.48 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |  782   | 85.84 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |  150.8 |  5.07 |

### cognitive_max

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    3   | 1    |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    5   | 1.87 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |    4.6 | 1.34 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   12.6 | 5.37 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |    3.6 | 1.34 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   11   | 4    |

### mccabe_max

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    3.8 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    4.6 | 0.89 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |    4.4 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |    8.8 | 2.49 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |    3.8 | 1.3  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |    8   | 1.87 |

### longest_function

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   15   | 5.87 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   11.6 | 1.52 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   18.4 | 6.99 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   21.8 | 3.96 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   22   | 4.12 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   17.8 | 8.41 |

### lines_of_code

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |  256.2 | 33.28 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   44.6 |  8.2  |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |  315.6 | 52.9  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   36.8 |  8.01 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |  271.6 | 16.76 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   35.2 |  2.17 |

### smell_total

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    2.2 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |    0.2 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |    3.2 | 1.1  |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |    0.4 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |    3.4 | 1.34 |

### cycle_count

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   39.8 | 3.7  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    8.8 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   36.4 | 2.88 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |    8.4 | 0.55 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   40.2 | 4.76 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |    9.8 | 3.03 |

### predictions_correct_rate

| kata                         | cell_workflow              | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:---------------------------|:------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 | 364 | 366 |      0 |     99.5 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |  88 |  88 |      0 |    100   |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 | 359 | 362 |      0 |     99.2 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |  76 |  84 |      0 |     90.5 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 | 348 | 350 |      0 |     99.4 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |  40 |  41 |      0 |     97.6 |

### refactorings_applied

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   28   | 12.47 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    8.8 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   23.2 |  9.47 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |    3.2 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   19.4 |  5.18 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |    2.8 |  0.45 |

### duration_seconds

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 | 3148.8 | 644.59 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |  718.6 |  32.53 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 | 2393.2 | 594.51 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |  349.8 |  28.24 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 | 1883.8 | 392.48 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |  326   |  32.76 |

### total_tokens

| kata                         | cell_workflow              | cell_model        |   n |   null |        mean |               sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|------------:|-----------------:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 | 5.46502e+07 |      8.82622e+06 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 | 5.21111e+06 | 589288           |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 | 3.4057e+07  |      7.87302e+06 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 | 1.95775e+06 | 346811           |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 | 1.3833e+07  |      3.09284e+06 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 | 1.0667e+06  | 111680           |

### cost_usd

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |  41.09 | 7.1  |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   5.53 | 0.51 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |  22.3  | 4.64 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-oc | opus-4-8-requesty |   5 |      0 |   1.99 | 0.3  |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |  14.43 | 2.98 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | opus-4-8-requesty |   5 |      0 |   1.78 | 0.16 |
