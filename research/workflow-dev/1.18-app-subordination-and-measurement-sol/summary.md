# RQ-app-subordination-measurement-sol — Aggregation

_On the OpenAI subscription route, does subordinating APP mass to the Four Rules recover the decomposition that the unsubordinated brief suppresses — and does adding pre/post measurement improve the result further, at what cost in duration as the measurement moves from the model to deterministic tools?_

Generated: 2026-10-12T08:37:56Z

Cells declared: 5 · matched runs: 25 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.2-app-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### avg_loc_per_function

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |   7.42 | 1.04 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |   6.72 | 0.34 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |   7.12 | 1.1  |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |   7.88 | 1.12 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |   7.11 | 0.81 |

### median_loc_per_function

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |    4.5 | 0.87 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |    5.8 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |    5.3 | 0.97 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |    6.4 | 1.34 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |    6   | 1.46 |

### longest_function

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |   20.8 | 2.39 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |   15.8 | 2.39 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |   18   | 3.08 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |   18.2 | 2.77 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |   16.2 | 3.03 |

### cognitive_max

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |    4.8 | 2.39 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |    5.4 | 2.88 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |    3.4 | 1.14 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |    3.8 | 1.48 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |    4.6 | 1.82 |

### cognitive_avg

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |   2.1  | 0.29 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |   2.11 | 0.6  |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |   2.02 | 0.39 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |   2.25 | 0.82 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |   2.16 | 0.61 |

### mccabe_max

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 1.52 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |    5.6 | 2.07 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |    4.2 | 0.84 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |    4.8 | 1.64 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |    4.4 | 0.55 |

### smell_total

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |      0 |    0 |

### code_mass

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |  562.6 | 48.81 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |  590.6 | 66.06 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |  534.8 | 21.9  |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |  581.2 | 63.59 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |  534.4 | 27.46 |

### functions

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |    8.4 | 2.3  |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |   11   | 1.58 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |   10.2 | 1.79 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |    9.2 | 1.79 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |    8.6 | 1.95 |

### production_loc

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |    sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |  117.6 | 20.21 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |  148.8 | 11.82 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |  141.2 |  8.76 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |  141.2 | 15.8  |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |  130.4 | 10.69 |

### verification_pct

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                       | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:------------------------------------|:------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |   5 |      0 |      100 |

### cycle_count

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |   33.4 | 2.97 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |   30.6 | 7.23 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |   31.6 | 1.67 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |   32.4 | 6.43 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |   34.8 | 2.95 |

### refactorings_applied

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |   33.2 | 2.68 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |   30.6 | 7.23 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |   31.6 | 1.67 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |   32.6 | 6.47 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |   34.8 | 2.95 |

### predictions_correct_rate

| kata                         | cell_workflow                       | cell_model        |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:------------------------------------|:------------------|----:|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 | 137 | 138 |      0 |     99.3 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 | 134 | 138 |      0 |     97.1 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 | 142 | 144 |      0 |     98.6 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 | 156 | 158 |      0 |     98.7 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 | 204 | 206 |      0 |     99   |

### duration_seconds

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 | 1083.8 | 251.77 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 | 1226.2 | 186.49 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 | 1011.4 | 115.05 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 | 1142.8 | 214    |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 | 1181.4 | 111.35 |

### total_tokens

| kata                         | cell_workflow                       | cell_model        |   n |   null |        mean |               sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------------:|-----------------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 | 4.86904e+06 |      1.61694e+06 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 | 4.4933e+06  |      2.17366e+06 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 | 5.75846e+06 | 957365           |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 | 6.63472e+06 |      2.00978e+06 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 | 8.22138e+06 | 768433           |

### cost_usd

| kata                         | cell_workflow                       | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |   3.66 | 1.03 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |   3.58 | 1.65 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |   4.55 | 0.67 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |   5.03 | 1.5  |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |   5.96 | 0.47 |
