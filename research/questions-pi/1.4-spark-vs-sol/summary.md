# RQ-spark-vs-sol — Aggregation

_On the OpenAI subscription route, how does GPT-5.3 Codex Spark compare to GPT-5.6 Sol on the two native Sol workflows — does the smaller, cheaper-tier model hold correctness and code quality, or does it only look competitive because the workflow carries it?_

Generated: 2026-10-12T10:46:40Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| sphinx-score-example-mapping | exact-sol-v1-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1-pi | gpt-5-3-codex-spark | 5 | 5 | ✅ |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |   0.99 | 0.03 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |   0.96 | 0.03 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |   0.78 | 0.06 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |   0.84 | 0.14 |

### tests_passing

| kata                         | cell_workflow              | cell_model          |   n |   k |   null |   rate_% |
|:-----------------------------|:---------------------------|:--------------------|----:|----:|-------:|---------:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |   5 |      0 |      100 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |   5 |      0 |      100 |

### cognitive_max

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |    1.8 | 0.45 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |    1.6 | 1.14 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |    3.4 | 1.67 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |    4.2 | 2.77 |

### cognitive_avg

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |   1.8  | 0.45 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |   1.6  | 1.14 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |   3.3  | 1.64 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |   3.73 | 3.09 |

### mccabe_max

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |    2.8 | 0.45 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |    2.6 | 1.14 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |    4.2 | 1.64 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |    4.4 | 2.3  |

### longest_function

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |   13.2 | 2.39 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |   16.2 | 5.63 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |   22.8 | 2.17 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |   21.2 | 8.04 |

### avg_loc_per_function

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |  13.2  | 2.39 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |  15.9  | 6.25 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |  19.17 | 6.41 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |  19.3  | 9.24 |

### smell_total

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|-----:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |    0   | 0    |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |    0   | 0    |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |    1   | 2.24 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |    0.4 | 0.89 |

### code_mass

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|------:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |  129.2 | 11.67 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |  136   | 10.02 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |  159.6 | 22.74 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |  151.8 | 22.79 |

### predictions_correct_rate

| kata                         | cell_workflow              | cell_model          |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:---------------------------|:--------------------|----:|----:|----:|-------:|---------:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |  68 |  68 |      0 |    100   |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |  76 |  76 |      0 |    100   |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |  66 |  82 |      0 |     80.5 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |  62 |  77 |      0 |     80.5 |

### duration_seconds

| kata                         | cell_workflow              | cell_model          |   n |   null |   mean |     sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|-------:|-------:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 |  440.2 |  14.77 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 |  945.8 | 103.48 |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 |  320.6 |  96.47 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 |  630.2 | 211.62 |

### total_tokens

| kata                         | cell_workflow              | cell_model          |   n |   null |        mean |               sd |
|:-----------------------------|:---------------------------|:--------------------|----:|-------:|------------:|-----------------:|
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-6-sol-codex   |   5 |      0 | 1.57168e+06 | 200749           |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-6-sol-codex   |   5 |      0 | 2.47616e+06 | 752930           |
| sphinx-score-example-mapping | exact-sol-v1-pi            | gpt-5-3-codex-spark |   5 |      0 | 5.11274e+06 |      3.40189e+06 |
| sphinx-score-example-mapping | exact-sol-v1.1-subagent-pi | gpt-5-3-codex-spark |   5 |      0 | 6.21275e+06 |      3.84732e+06 |
