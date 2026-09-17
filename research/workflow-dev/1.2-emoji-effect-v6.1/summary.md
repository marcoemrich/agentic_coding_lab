# RQ-emoji-v6.1 — Aggregation

_Do decoration emojis (✅ ❌ 🔴 🟢 🔄 📋 🚨 ⚠️) in the workflow prompts (skills + refactor agent + rules/tdd.md) on the hybrid-v2 base have a measurable effect on code quality or TDD discipline?_

Generated: 2026-09-17T01:17:51Z

Cells declared: 2 · matched runs: 10 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  147.6 |   133 |   174 | 15.5  |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |  156.8 |   146 |   172 | 10.06 |

### smell_total

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |    2.6 |     2 |     3 |  0.55 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |    2   |     2 |     2 |  0    |

### cc_longest_function

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   15   |     2 |    25 |  8.72 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |   11.4 |     4 |    15 |  4.34 |

### cognitive_max

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |    6.2 |     2 |    12 |  4.49 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |    6.6 |     4 |    10 |  2.3  |

### mccabe_max

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |    5.2 |     3 |     8 |  1.92 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |    4.6 |     4 |     6 |  0.89 |

### refactorings_applied

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |    4.2 |     2 |     7 |  2.28 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |    5.4 |     3 |     9 |  2.88 |

### cycle_count

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |    8.4 |     7 |     9 |  0.89 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |    8.8 |     8 |     9 |  0.45 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                   | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |        82 |      83 |     98.8 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |        86 |      88 |     97.7 |

### tests_passed_immediately

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |    4.8 |     0 |     7 |  2.95 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |    2.2 |     0 |     6 |  3.03 |

### duration_seconds

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  597.2 |   426 |   727 | 142.43 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |  668.8 |   493 |   896 | 200.58 |

### total_tokens

| kata                         | cell_workflow                   | cell_model           |   n |        mean |     min |     max |         std |
|:-----------------------------|:--------------------------------|:---------------------|----:|------------:|--------:|--------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 | 7.16873e+06 | 5264335 | 9796559 | 1.67377e+06 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 | 7.77662e+06 | 6124991 | 9536497 | 1.30671e+06 |

### tests_passing (rate %)

| kata                         | cell_workflow                   | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct

| kata                         | cell_workflow                   | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      1 |     1 |     1 |     0 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |      1 |     1 |     1 |     0 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                   | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc   | opus-4-7-no-thinking |   5 |       5 |      100 |
