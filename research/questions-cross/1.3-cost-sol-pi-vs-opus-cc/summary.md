# RQ-cost-sol-pi-vs-opus-cc — Aggregation

_How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas?_

Generated: 2026-10-12T08:37:43Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### cost_usd

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |   1.09 | 0.29 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |   2.54 | 0.65 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   5.53 | 0.51 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |  41.09 | 7.1  |

### total_tokens

| kata                         | cell_workflow              | cell_model        |   n |   null |             mean |               sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 | 661453           | 237856           |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |      2.08521e+06 | 801525           |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |      5.21111e+06 | 589288           |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |      5.46502e+07 |      8.82622e+06 |

### duration_seconds

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |     sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |  240.4 |  56.57 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |  503.4 | 144.93 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |  718.6 |  32.53 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 | 3148.8 | 644.59 |

### verification_pct

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |   0.93 | 0.12 |

### tests_passing

| kata                         | cell_workflow              | cell_model        |   n |   k |   null |   rate_% |
|:-----------------------------|:---------------------------|:------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |   5 |      0 |      100 |

### cognitive_max

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |   13.4 | 5.68 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |    9.2 | 4.32 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    5   | 1.87 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    3   | 1    |

### mccabe_max

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |    9.4 | 2.88 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |    6.8 | 2.05 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    4.6 | 0.89 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    3.8 | 0.45 |

### smell_total

| kata                         | cell_workflow              | cell_model        |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |    3.6 | 0.89 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-pi | gpt-5-6-sol       |   5 |      0 |   15.4 | 1.67 |
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    2.2 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-8-requesty |   5 |      0 |    0   | 0    |
