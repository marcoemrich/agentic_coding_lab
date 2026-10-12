# RQ-model-quality-cursor — Aggregation

_How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping?_

Generated: 2026-10-12T10:46:37Z

Cells declared: 3 · matched runs: 10 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor | 0 | 0 | ❌ no runs |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |  211.2 |  24.59 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |  151.6 |  23.2  |

### cognitive_max

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    7.8 |   4.27 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    9.2 |   1.48 |

### cognitive_avg

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 | nan    | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |   4.97 |   3.69 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |   7.9  |   2.38 |

### mccabe_max

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    6.2 |   2.39 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    7.8 |   1.1  |

### mccabe_avg

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 | nan    | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |   2.4  |   0.85 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |   3.47 |   0.92 |

### longest_function

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |   25.4 |   6.73 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |   21.8 |   1.64 |

### avg_loc_per_function

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 | nan    | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |   7.39 |   2.02 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |  11    |   1.49 |

### median_loc_per_function

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    3.3 |   0.27 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    8.2 |   3.63 |

### lines_of_code

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |   68.2 |  11.73 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |   39.2 |   4.32 |

### smell_total

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    3   |   0.71 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    2.8 |   0.84 |

### smell_complexity

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    0.4 |   0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    0.2 |   0.45 |

### smell_magic_numbers

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    2.6 |   0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    2.4 |   0.55 |

### smell_duplication

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    0   |   0    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    0.2 |   0.45 |

### verification_pct

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |    nan |  nan |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |   sd |   k |   rate_% |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-----:|----:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |    nan |  nan | nan |      nan |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    nan |  nan |   5 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    nan |  nan |   5 |      100 |

### tests_total

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    8.4 |   0.55 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |    7.8 |   0.45 |

### predictions_correct

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    6.4 |   1.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |   14.8 |   2.68 |

### predictions_total

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |    6.4 |   1.67 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |   14.8 |   2.68 |

### duration_seconds

| kata                         | cell_workflow                               | cell_model      |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |  nan   | nan    |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |  330.8 | 115.89 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |  584.8 |  88.14 |

### total_tokens

| kata                         | cell_workflow                               | cell_model      |   n |   null |          mean |     sd |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|--------------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 | nan           |    nan |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   5 |      0 |   1.13088e+06 | 266402 |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   5 |      0 |   1.32566e+06 | 198297 |

### cost_usd

| kata                         | cell_workflow                               | cell_model      |   n |   null | mean   | sd   |
|:-----------------------------|:--------------------------------------------|:----------------|----:|-------:|:-------|:-----|
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | opus-cursor     |   0 |      0 |        |      |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | composer-cursor |   0 |      5 |        |      |
| game-of-life-example-mapping | exact-hybrid-v4.2-phase-continuation-cursor | grok-cursor     |   0 |      5 |        |      |
