# RQ-spark-vs-sol — Aggregation

_On the OpenAI subscription route, how does GPT-5.3 Codex Spark compare to GPT-5.6 Sol on the two native Sol workflows — does the smaller, cheaper-tier model hold correctness and code quality, or does it only look competitive because the workflow carries it?_

Generated: 2026-09-05T15:21:57Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | basic-sol-tdd-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | basic-sol-tdd-pi | gpt-5-3-codex-spark | 5 | 5 | ✅ |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |   0.78 |  0.69 |  0.81 |  0.06 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |   0.99 |  0.94 |  1    |  0.03 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |   0.84 |  0.69 |  1    |  0.14 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |   0.96 |  0.94 |  1    |  0.03 |

### tests_passing (rate %)

| kata                         | cell_workflow             | cell_model          |   n |   match |   rate_% |
|:-----------------------------|:--------------------------|:--------------------|----:|--------:|---------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |       5 |      100 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |       5 |      100 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |       5 |      100 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow             | cell_model          |   n |   match |   rate_% |
|:-----------------------------|:--------------------------|:--------------------|----:|--------:|---------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |       5 |      100 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |       5 |      100 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |       5 |      100 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |       5 |      100 |

### cognitive_max

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |    3.4 |     2 |     6 |  1.67 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |    1.8 |     1 |     2 |  0.45 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |    4.2 |     1 |     8 |  2.77 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |    1.6 |     0 |     3 |  1.14 |

### cognitive_avg

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |   3.3  |     2 |     6 |  1.64 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |   1.8  |     1 |     2 |  0.45 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |   3.73 |     1 |     8 |  3.09 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |   1.6  |     0 |     3 |  1.14 |

### mccabe_max

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |    4.2 |     3 |     7 |  1.64 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |    2.8 |     2 |     3 |  0.45 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |    4.4 |     2 |     8 |  2.3  |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |    2.6 |     1 |     4 |  1.14 |

### cc_longest_function

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |   22.8 |    21 |    26 |  2.17 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |   13.2 |    11 |    17 |  2.39 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |   21.2 |    10 |    29 |  8.04 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |   16.2 |     7 |    21 |  5.63 |

### cc_avg_loc_per_function

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |  19.17 | 12.33 |    26 |  6.41 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |  13.2  | 11    |    17 |  2.39 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |  19.3  |  8.5  |    29 |  9.24 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |  15.9  |  5.5  |    21 |  6.25 |

### smell_total

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |    1   |     0 |     5 |  2.24 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |    0   |     0 |     0 |  0    |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |    0.4 |     0 |     2 |  0.89 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |    0   |     0 |     0 |  0    |

### code_mass

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |  159.6 |   123 |   182 | 22.74 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |  129.2 |   117 |   143 | 11.67 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |  151.8 |   122 |   184 | 22.79 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |  136   |   124 |   150 | 10.02 |

### cycle_count

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |   10   |     3 |    12 |  3.94 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |   11.8 |    11 |    13 |  0.84 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |   13.4 |    11 |    22 |  4.83 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |   11.2 |    11 |    12 |  0.45 |

### refactorings_applied

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |   10   |     3 |    12 |  3.94 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |   12   |    11 |    13 |  0.71 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |   10.6 |     6 |    20 |  5.59 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |   11.6 |    11 |    12 |  0.55 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow             | cell_model          |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------------------|:--------------------|----:|----------:|--------:|---------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |        66 |      82 |     80.5 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |        68 |      68 |    100   |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |        62 |      77 |     80.5 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |        76 |      76 |    100   |

### duration_seconds

| kata                         | cell_workflow             | cell_model          |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------|:--------------------|----:|-------:|------:|------:|-------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 |  320.6 |   157 |   405 |  96.47 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 |  440.2 |   426 |   465 |  14.77 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 |  630.2 |   457 |   996 | 211.62 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 |  945.8 |   838 |  1058 | 103.48 |

### total_tokens

| kata                         | cell_workflow             | cell_model          |   n |        mean |     min |      max |              std |
|:-----------------------------|:--------------------------|:--------------------|----:|------------:|--------:|---------:|-----------------:|
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-3-codex-spark |   5 | 5.11274e+06 |  876921 |  8531857 |      3.40189e+06 |
| sphinx-score-example-mapping | basic-sol-tdd-pi          | gpt-5-6-sol-codex   |   5 | 1.57168e+06 | 1417611 |  1919005 | 200749           |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-3-codex-spark |   5 | 6.21275e+06 | 2676666 | 11785008 |      3.84732e+06 |
| sphinx-score-example-mapping | basic-sol-tdd-subagent-pi | gpt-5-6-sol-codex   |   5 | 2.47616e+06 | 1268365 |  3125890 | 752930           |
