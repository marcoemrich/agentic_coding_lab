# RQ-emoji-v6.1 — Aggregation

_Do decoration emojis (✅ ❌ 🔴 🟢 🔄 📋 🚨 ⚠️) in the workflow prompts (skills + refactor agent + rules/tdd.md) on the hybrid-v2 base have a measurable effect on code quality or TDD discipline?_

Generated: 2026-10-12T08:37:57Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  147.6 | 15.5  |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |  156.8 | 10.06 |

### smell_total

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    2.6 | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |    2   | 0    |

### longest_function

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |   15   | 8.72 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |   11.4 | 4.34 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    6.2 | 4.49 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |    6.6 | 2.3  |

### mccabe_max

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    5.2 | 1.92 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |    4.6 | 0.89 |

### refactorings_applied

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    4.2 | 2.28 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |    5.4 | 2.88 |

### cycle_count

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    8.4 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |    8.8 | 0.45 |

### predictions_correct_rate

| kata                         | cell_workflow                   | cell_model           |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  82 |  83 |      0 |     98.8 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |  86 |  88 |      0 |     97.7 |

### tests_passed_immediately

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    4.8 | 2.95 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |    2.2 | 3.03 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  597.2 | 142.43 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |  668.8 | 200.58 |

### total_tokens

| kata                         | cell_workflow                   | cell_model           |   n |   null |    mean |          sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|--------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 | 8580042 | 2.23709e+06 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 | 9545780 | 2.20494e+06 |

### tests_passing

| kata                         | cell_workflow                   | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow                   | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      0 |      1 |    0 |
