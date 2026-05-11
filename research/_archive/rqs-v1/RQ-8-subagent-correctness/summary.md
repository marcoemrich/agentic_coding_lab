# RQ-8 — Aggregation

_Ist v4 (Subagent-pro-Phase) weniger korrekt als v5 (Single-Context), und unter welchen Umständen?_

Generated: 2026-05-10T17:50:02Z

Cells declared: 8 · matched runs: 27 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7 | 6 | 5 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7 | 3 | 3 | ⚠️ unter min_replicates (3/5) |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ⚠️ unter min_replicates (3/5) |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7 | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ⚠️ unter min_replicates (3/5) |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7 | 0 | 0 | ❌ keine Runs |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 6 | 6 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7             |   6 |       6 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       5 |       83 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7             |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       6 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7             |   6 |   0.5  |  0    |     1 |  0.47 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   0.72 |  0.27 |     1 |  0.38 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   1    |  1    |     1 |  0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7             |   6 |    7.5 |     0 |    15 |  7.06 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |   10.8 |     4 |    15 |  5.76 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7             |   3 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |    0   |     0 |     0 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |    0   |     0 |     0 |  0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7             |   6 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7             |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |      0 |     0 |     0 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |      0 |     0 |     0 |     0 |

### cli_built (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7             |   6 |       4 |       67 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   6 |       5 |       83 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7             |   3 |       0 |        0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |   3 |       0 |        0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   6 |       0 |        0 |
