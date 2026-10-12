# RQ-native-sol-workflows-sub — Aggregation

_On the OpenAI subscription route, does a workflow line written natively for Sol (basic-sol-tdd, Predictive TDD) beat structureless TDD (inline-tdd-v1) — the floor that no Opus-derived architecture clears on this model?_

Generated: 2026-10-12T08:37:55Z

Cells declared: 9 · matched runs: 45 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cognitive_max

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   11.4 | 10.01 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    4.4 |  2.19 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    2.2 |  0.84 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    4.8 |  2.39 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    4.2 |  1.64 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    1.8 |  0.45 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    4.8 |  2.39 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    5.2 |  1.64 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    1.6 |  1.14 |

### cognitive_avg

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   3.4  | 1.41 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   2.67 | 1.31 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   1.9  | 0.74 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   2.1  | 0.29 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   3.17 | 0.69 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   1.8  | 0.45 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   2.33 | 0.97 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   3.07 | 0.6  |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   1.6  | 1.14 |

### mccabe_max

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 5.36 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    4   | 1.22 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    3.2 | 0.84 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 1.52 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    4.4 | 0.55 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    2.8 | 0.45 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    5   | 1.87 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 0.55 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    2.6 | 1.14 |

### longest_function

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   27   | 11.34 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   11.2 |  1.3  |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   15.4 |  3.05 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   20.8 |  2.39 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   14   |  4.95 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   13.2 |  2.39 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   18.4 |  3.65 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   12.8 |  2.86 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   16.2 |  5.63 |

### smell_total

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 9.39 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    0   | 0    |

### avg_loc_per_function

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   8.45 | 2.41 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   6.75 | 1.4  |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |  14.5  | 3.32 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   7.42 | 1.04 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   7.44 | 1.59 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |  13.2  | 2.39 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   7.75 | 1.2  |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   7.01 | 1.24 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |  15.9  | 6.25 |

### verification_pct

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   0.99 | 0.03 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   0.93 | 0.15 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   1    | 0    |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   0.96 | 0.03 |

### tests_passing

| kata                         | cell_workflow              | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:---------------------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### code_mass

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |  750   |  83.39 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |  176.4 |  24.63 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |  129.6 |  12.46 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |  562.6 |  48.81 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |  156.8 |  13.46 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |  129.2 |  11.67 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |  618   | 145.16 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |  167.4 |  29.91 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |  136   |  10.02 |

### cycle_count

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    3   | 0.71 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 2.7  |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    2.4 | 0.55 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   33.4 | 2.97 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 0.45 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   11.8 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   33.2 | 3.11 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    9   | 1    |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   11.2 | 0.45 |

### refactorings_applied

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    0.4 | 0.55 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    0.2 | 0.45 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |    1.6 | 0.89 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   33.2 | 2.68 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 0.45 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   12   | 0.71 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   32.2 | 7.56 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    9.8 | 1.3  |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   11.6 | 0.55 |

### predictions_correct_rate

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    nan |  nan | 137 | 138 |     99.3 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    nan |  nan |  48 |  48 |    100   |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |    nan |  nan |  68 |  68 |    100   |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    nan |  nan | 175 | 176 |     99.4 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    nan |  nan |  52 |  52 |    100   |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |    nan |  nan |  76 |  76 |    100   |

### duration_seconds

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |  218.2 |  35.35 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |  126.8 |  22.69 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |  144.8 |  19.72 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 | 1083.8 | 251.77 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |  400.2 |  25.76 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |  440.2 |  14.77 |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 | 2397.2 | 637.83 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |  687.6 |  56.89 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |  945.8 | 103.48 |

### total_tokens

| kata                         | cell_workflow              | cell_model        |   n |   null |             mean |               sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 | 271849           |  67725.8         |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 | 152520           |  63491.2         |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 | 275365           | 194729           |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |      4.86904e+06 |      1.61694e+06 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 | 932843           |  78633.2         |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |      1.57168e+06 | 200749           |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |      7.12622e+06 |      3.95575e+06 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |      1.74268e+06 | 170021           |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |      2.47616e+06 | 752930           |

### cost_usd

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   0.58 | 0.09 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   0.36 | 0.07 |
| sphinx-score-example-mapping | baseline-inline-tdd-v1-pi  | gpt-5-6-sol-codex |   5 |      0 |   0.46 | 0.17 |
| claim-office-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   3.66 | 1.03 |
| game-of-life-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   1.03 | 0.09 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex |   5 |      0 |   1.65 | 0.1  |
| claim-office-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   7.4  | 2.74 |
| game-of-life-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   2.31 | 0.22 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex |   5 |      0 |   3.18 | 0.77 |
