# RQ-refactor-cut — Aggregation

_Ist der Pred-Rate-Drop in v6.5.3 (95.8 %) durch den red/SKILL.md-DO/DON'T-Cut verursacht? Liefert v6.5.4 (nur refactor.md DO/DON'T gestrichen) einen sauberen Pareto-Optimum mit v6.5.3-Quality + v6.5.1-Pred-Hygiene + Floor?_

Generated: 2026-05-22T16:38:14Z

Cells declared: 3 · matched runs: 30 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.5.3-targeted-cuts | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |  146.7 |   133 |   162 | 11.53 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |  150.7 |   130 |   177 | 13.93 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |  146.2 |   128 |   153 |  7.47 |

### smell_total

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      2 |     2 |     2 |     0 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |      2 |     2 |     2 |     0 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |      2 |     2 |     2 |     0 |

### cc_longest_function

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |   13.1 |     2 |    21 |  6.3  |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |   12   |     6 |    17 |  3.4  |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |   15   |     7 |    18 |  3.23 |

### cognitive_max

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    5.6 |     2 |    10 |  3.17 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    3.5 |     2 |     7 |  1.43 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |    4.2 |     2 |     7 |  1.87 |

### mccabe_max

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    4.9 |     3 |     7 |  1.45 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    4.3 |     3 |     5 |  0.67 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |    3.8 |     3 |     4 |  0.42 |

### refactorings_applied

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    7.8 |     7 |     8 |  0.42 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    8.3 |     7 |     9 |  0.67 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |    8.1 |     7 |     9 |  0.74 |

### cycle_count

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    7.8 |     7 |     8 |  0.42 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    8.3 |     7 |     9 |  0.67 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |    8.1 |     7 |     9 |  0.74 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                     | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |       175 |     177 |     98.9 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |       159 |     166 |     95.8 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |       162 |     162 |    100   |

### tests_passed_immediately (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |       0 |        0 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |       0 |        0 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |       0 |        0 |

### duration_seconds

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |  726.1 |   605 |   903 |  86.95 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |  752.1 |   595 |  1066 | 146.46 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |  740.6 |   618 |   820 |  66.38 |

### total_tokens

| kata                         | workflow                     | cell_model           |   n |        mean |     min |      max |             std |
|:-----------------------------|:-----------------------------|:---------------------|----:|------------:|--------:|---------:|----------------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 | 8.52687e+06 | 7616336 |  9276348 | 601678          |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 | 8.55884e+06 | 6250382 | 10576013 |      1.4763e+06 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 | 8.41827e+06 | 6563050 | 10088222 | 979695          |

### tests_passing (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |      10 |      100 |
