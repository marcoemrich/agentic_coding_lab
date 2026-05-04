# RQ-4 — Aggregation

_Profitieren schwächere Modelle stärker von strikteren Workflows als starke?_

Generated: 2026-05-03T23:54:58Z

Cells declared: 12 · matched runs: 25 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | status |
|---|---|---|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-prose | v1-oneshot | sonnet-4-6 | 1 | ⚠️ unter min_replicates (1/3) |
| game-of-life-prose | v1-oneshot | haiku-4-5 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | sonnet-4-6 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v3-basic-tdd | haiku-4-5 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | sonnet-4-6 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v4-exact-subagents | haiku-4-5 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | sonnet-4-6 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v5-exact-single-context | haiku-4-5 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |       6 |      100 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6           |   1 |       1 |      100 |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 | 156.83 |   139 |   185 |  20.11 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 | 169    |   140 |   209 |  23.98 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 | 157    |   146 |   184 |  13.56 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 | 164.17 |   157 |   175 |   7    |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6           |   1 | 131    |   131 |   131 | nan    |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |   4.33 |     2 |     5 |   1.21 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |   2.5  |     2 |     3 |   0.55 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |   3.17 |     2 |     5 |   1.47 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |   3.67 |     2 |     6 |   1.51 |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6           |   1 |   4    |     4 |     4 | nan    |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   6 |  29.83 |    24 |    44 |   8.28 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |  15.17 |     8 |    23 |   6.21 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |  16.83 |     2 |    25 |   7.99 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |   6 |  26.83 |    21 |    31 |   3.6  |
| game-of-life-prose           | v1-oneshot              | sonnet-4-6           |   1 |  24    |    24 |    24 | nan    |
