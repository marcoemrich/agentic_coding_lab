# RQ-2 — Aggregation

_Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität und Korrektheit?_

Generated: 2026-05-03T23:54:58Z

Cells declared: 3 · matched runs: 13 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | status |
|---|---|---|---:|---|
| game-of-life-prose | v4-exact-subagents | opus-4-7-no-thinking | 4 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-user-story | v4-exact-subagents | opus-4-7-no-thinking | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model                |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v4-exact-subagents | opus-4-7-no-thinking |   4 |       4 |      100 |
| game-of-life-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |       3 |      100 |

### code_mass

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   6 |    169 |   140 |   209 | 23.98 |
| game-of-life-prose           | v4-exact-subagents | opus-4-7-no-thinking |   4 |    168 |   153 |   197 | 19.97 |
| game-of-life-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |    149 |   119 |   166 | 26.06 |

### smell_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-prose           | v4-exact-subagents | opus-4-7-no-thinking |   4 |   3    |     2 |     6 |  2    |
| game-of-life-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |   2.33 |     2 |     3 |  0.58 |

### cc_longest_function

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   6 |  15.17 |     8 |    23 |  6.21 |
| game-of-life-prose           | v4-exact-subagents | opus-4-7-no-thinking |   4 |  11.25 |     8 |    17 |  3.95 |
| game-of-life-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |   8    |     2 |    11 |  5.2  |

### predictions_correct

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   6 |   5.67 |     5 |     7 |  0.82 |
| game-of-life-prose           | v4-exact-subagents | opus-4-7-no-thinking |   4 |   6    |     5 |     8 |  1.41 |
| game-of-life-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 |   6    |     4 |     9 |  2.65 |

### duration_seconds

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   6 | 779.17 |   659 |  1059 | 152.03 |
| game-of-life-prose           | v4-exact-subagents | opus-4-7-no-thinking |   4 | 802    |   533 |   995 | 197.74 |
| game-of-life-user-story      | v4-exact-subagents | opus-4-7-no-thinking |   3 | 760.67 |   570 |   884 | 167.48 |
