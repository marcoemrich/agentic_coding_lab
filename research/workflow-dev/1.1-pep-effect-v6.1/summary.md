# RQ-pep-v6.1 — Aggregation

_Do psychological justifications ('pep talks') in the Red and Green skill prompts on the hybrid-v2 base deliver a measurable code quality or TDD discipline advantage over purely operational instructions?_

Generated: 2026-10-12T10:46:42Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  147.6 | 15.5  |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |      0 |  144.6 | 11.67 |

### smell_total

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    2.6 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |      0 |    2   | 0    |

### longest_function

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |   15   | 8.72 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |      0 |   13.2 | 9.73 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    6.2 | 4.49 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |      0 |    4.6 | 2.79 |

### mccabe_max

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    5.2 | 1.92 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |      0 |    4.8 | 2.05 |

### predictions_correct_rate

| kata                         | cell_workflow                   | cell_model           |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  82 |  83 |      0 |     98.8 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |  79 |  79 |      0 |    100   |

### duration_seconds

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  597.2 | 142.43 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |      0 |  777.2 | 216.69 |

### total_tokens

| kata                         | cell_workflow                   | cell_model           |   n |   null |        mean |          sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 | 8.58004e+06 | 2.23709e+06 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |      0 | 1.10634e+07 | 3.04473e+06 |

### tests_passing

| kata                         | cell_workflow                   | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc     | opus-4-7-no-thinking |   5 |      0 |      1 |    0 |
