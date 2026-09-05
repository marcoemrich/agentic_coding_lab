# RQ-cost-sol-pi-vs-opus-cc — Aggregation

_How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas?_

Generated: 2026-09-05T15:22:00Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-8-requesty | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-requesty | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### cost_usd

| kata                         | cell_workflow            | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |  32.89 | 25.56 | 37.46 |  4.52 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |   2.54 |  1.87 |  3.55 |  0.65 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |   3.45 |  3.07 |  3.77 |  0.34 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |   1.09 |  0.71 |  1.47 |  0.29 |

### total_tokens

| kata                         | cell_workflow            | cell_model        |   n |             mean |      min |      max |              std |
|:-----------------------------|:-------------------------|:------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |      4.98975e+07 | 37985796 | 57642271 |      7.38067e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |      2.08521e+06 |  1145350 |  3325566 | 801525           |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |      4.09249e+06 |  3434019 |  4609405 | 519750           |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 | 661453           |   374855 |   902304 | 237856           |

### duration_seconds

| kata                         | cell_workflow            | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 | 3148.8 |  2443 |  3939 | 644.59 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |  503.4 |   368 |   724 | 144.93 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |  718.6 |   661 |   739 |  32.53 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |  240.4 |   169 |   325 |  56.57 |

### verification_pct

| kata                         | cell_workflow            | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |   0.93 |  0.73 |     1 |  0.12 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow            | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:-------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |       5 |      100 |

### cognitive_max

| kata                         | cell_workflow            | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |    3   |     2 |     4 |  1    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |    9.2 |     4 |    16 |  4.32 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |    5   |     3 |     7 |  1.87 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |   13.4 |     4 |    17 |  5.68 |

### mccabe_max

| kata                         | cell_workflow            | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |    3.8 |     3 |     4 |  0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |    6.8 |     5 |     9 |  2.05 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |    4.6 |     4 |     6 |  0.89 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |    9.4 |     5 |    12 |  2.88 |

### smell_total

| kata                         | cell_workflow            | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |   15.4 |    14 |    18 |  1.67 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |    2.2 |     2 |     3 |  0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | gpt-5-6-sol       |   5 |    3.6 |     2 |     4 |  0.89 |
