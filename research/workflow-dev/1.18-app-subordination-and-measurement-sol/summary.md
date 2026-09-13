# RQ-app-subordination-measurement-sol — Aggregation

_On the OpenAI subscription route, does subordinating APP mass to the Four Rules recover the decomposition that the unsubordinated brief suppresses — and does adding pre/post measurement improve the result further, at what cost in duration as the measurement moves from the model to deterministic tools?_

Generated: 2026-09-13T18:30:02Z

Cells declared: 5 · matched runs: 25 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.2-app-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cc_avg_loc_per_function

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |   7.42 |  5.92 |  8.71 |  1.04 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |   6.72 |  6.44 |  7.3  |  0.34 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |   7.12 |  6    |  8.75 |  1.1  |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |   7.88 |  6.88 |  9.71 |  1.12 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |   7.11 |  5.91 |  8    |  0.81 |

### cc_median_loc_per_function

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |    4.5 |   4   |   6   |  0.87 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |    5.8 |   5   |   7   |  0.84 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |    5.3 |   4.5 |   7   |  0.97 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |    6.4 |   5   |   8   |  1.34 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |    6   |   4   |   7.5 |  1.46 |

### cc_longest_function

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |   20.8 |    17 |    23 |  2.39 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |   15.8 |    12 |    18 |  2.39 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |   18   |    15 |    23 |  3.08 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |   18.2 |    14 |    21 |  2.77 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |   16.2 |    13 |    21 |  3.03 |

### cognitive_max

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |    4.8 |     3 |     9 |  2.39 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |    5.4 |     3 |     9 |  2.88 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |    3.4 |     2 |     5 |  1.14 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |    3.8 |     2 |     6 |  1.48 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |    4.6 |     3 |     7 |  1.82 |

### cognitive_avg

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |   2.1  |  1.75 |  2.38 |  0.29 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |   2.11 |  1.33 |  2.88 |  0.6  |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |   2.02 |  1.62 |  2.62 |  0.39 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |   2.25 |  1.33 |  3.57 |  0.82 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |   2.16 |  1.64 |  2.88 |  0.61 |

### mccabe_max

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |    5.6 |     4 |     8 |  1.52 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |    5.6 |     3 |     8 |  2.07 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |    4.2 |     3 |     5 |  0.84 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |    4.8 |     3 |     7 |  1.64 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |    4.4 |     4 |     5 |  0.55 |

### smell_total

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      0 |     0 |     0 |     0 |

### code_mass

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |  562.6 |   499 |   634 | 48.81 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |  590.6 |   535 |   696 | 66.06 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |  534.8 |   516 |   569 | 21.9  |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |  581.2 |   508 |   646 | 63.59 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |  534.4 |   497 |   570 | 27.46 |

### cc_functions

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |    8.4 |     6 |    12 |  2.3  |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |   11   |     9 |    13 |  1.58 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |   10.2 |     8 |    12 |  1.79 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |    9.2 |     7 |    11 |  1.79 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |    8.6 |     6 |    11 |  1.95 |

### cc_loc

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |  117.6 |    84 |   137 | 20.21 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |  148.8 |   138 |   169 | 11.82 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |  141.2 |   132 |   151 |  8.76 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |  141.2 |   124 |   161 | 15.8  |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |  130.4 |   119 |   143 | 10.69 |

### verification_pct

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |      1 |     1 |     1 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                       | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                       | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:------------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |       5 |      100 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |   33.4 |    29 |    37 |  2.97 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |   30.6 |    21 |    38 |  7.23 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |   31.6 |    30 |    34 |  1.67 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |   32.4 |    23 |    40 |  6.43 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |   34.8 |    30 |    37 |  2.95 |

### refactorings_applied

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |   33.2 |    29 |    36 |  2.68 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |   30.6 |    21 |    38 |  7.23 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |   31.6 |    30 |    34 |  1.67 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |   32.6 |    23 |    40 |  6.47 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |   34.8 |    30 |    37 |  2.95 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                       | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |       137 |     138 |     99.3 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |       134 |     138 |     97.1 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |       142 |     144 |     98.6 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |       156 |     158 |     98.7 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |       204 |     206 |     99   |

### duration_seconds

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 | 1083.8 |   690 |  1294 | 251.77 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 | 1226.2 |  1072 |  1547 | 186.49 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 | 1011.4 |   888 |  1175 | 115.05 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 | 1142.8 |   895 |  1426 | 214    |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 | 1181.4 |  1071 |  1324 | 111.35 |

### total_tokens

| kata                         | cell_workflow                       | cell_model        |   n |        mean |     min |     max |              std |
|:-----------------------------|:------------------------------------|:------------------|----:|------------:|--------:|--------:|-----------------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 | 4.86904e+06 | 2245956 | 6118701 |      1.61694e+06 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 | 4.4933e+06  | 1552694 | 7678648 |      2.17366e+06 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 | 5.75846e+06 | 4797115 | 6929479 | 957365           |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 | 6.63472e+06 | 4277541 | 9191652 |      2.00978e+06 |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 | 8.22138e+06 | 7013210 | 8857374 | 768433           |

### cost_usd

| kata                         | cell_workflow                       | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-sol-v1-pi                     | gpt-5-6-sol-codex |   5 |   3.66 |  1.98 |  4.64 |  1.03 |
| claim-office-example-mapping | exact-sol-v1.2-app-pi               | gpt-5-6-sol-codex |   5 |   3.58 |  1.12 |  5.77 |  1.65 |
| claim-office-example-mapping | exact-sol-v1.2.1-measured-model-pi  | gpt-5-6-sol-codex |   5 |   4.55 |  3.79 |  5.47 |  0.67 |
| claim-office-example-mapping | exact-sol-v1.2.2-measured-eslint-pi | gpt-5-6-sol-codex |   5 |   5.03 |  2.94 |  6.87 |  1.5  |
| claim-office-example-mapping | exact-sol-v1.2.3-measured-tool-pi   | gpt-5-6-sol-codex |   5 |   5.96 |  5.26 |  6.44 |  0.47 |
