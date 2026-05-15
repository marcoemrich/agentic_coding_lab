# RQ-6 — Aggregation

_Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro TDD-Phase (v4) oder ein geteilter, akkumulierter Single-Context (v5) — fuehrt zu besserer Code-Qualitaet, bei sonst identischem Phasen-Skript?_

Generated: 2026-05-15T03:45:59Z

Cells declared: 2 · matched runs: 20 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  166.6 |   146 |   201 | 17.65 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  152.6 |   136 |   173 | 13.85 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    2.6 |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    4.1 |     2 |     7 |  1.79 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    8.1 |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   17.4 |     2 |    32 |  9.25 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   31.1 |    25 |    47 |  6.74 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   29.8 |    24 |    36 |  3.74 |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.5 |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     6 |    12 |  2.08 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.4 |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.5 |     9 |    24 |  4.84 |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |

### total_tokens

| kata                         | workflow                | model                |   n |        mean |     min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 2.56189e+06 | 2023377 |  3201698 | 382603           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 | 8.14255e+06 |       0 | 12207170 |      3.79036e+06 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  379.56 |   220 |   508 | 100.79 |
