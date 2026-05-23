# RQ-targeted — Aggregation

_Sind die Quality/Cost-Gewinne aus v6.5.2 ohne σ-Verlust erreichbar, wenn nur die mid-file DO/DON'T-Blöcke gestrichen werden und die `Remember`-End-Sektion in refactor.md erhalten bleibt?_

Generated: 2026-05-22T16:38:13Z

Cells declared: 3 · matched runs: 30 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.5.2-bullets-cut | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.5.3-targeted-cuts | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |  146.7 |   133 |   162 | 11.53 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |  146.7 |   128 |   176 | 13.39 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |  150.7 |   130 |   177 | 13.93 |

### smell_total

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    2   |     2 |     2 |  0    |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |    2.1 |     2 |     3 |  0.32 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    2   |     2 |     2 |  0    |

### cc_longest_function

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |   13.1 |     2 |    21 |  6.3  |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |   13.1 |     6 |    17 |  4.09 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |   12   |     6 |    17 |  3.4  |

### cognitive_max

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    5.6 |     2 |    10 |  3.17 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |    4   |     2 |     7 |  2.16 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    3.5 |     2 |     7 |  1.43 |

### mccabe_max

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    4.9 |     3 |     7 |  1.45 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |    4.1 |     3 |     5 |  0.74 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    4.3 |     3 |     5 |  0.67 |

### refactorings_applied

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    7.8 |     7 |     8 |  0.42 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |    7.6 |     5 |     9 |  1.26 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    8.3 |     7 |     9 |  0.67 |

### cycle_count

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |    7.8 |     7 |     8 |  0.42 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |    7.7 |     6 |     9 |  1.06 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |    8.3 |     7 |     9 |  0.67 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                     | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |       175 |     177 |     98.9 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |       153 |     154 |     99.4 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |       159 |     166 |     95.8 |

### tests_passed_immediately (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |       0 |        0 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |       1 |       10 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |       0 |        0 |

### duration_seconds

| kata                         | workflow                     | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |  726.1 |   605 |   903 |  86.95 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |  694.8 |   535 |   835 | 111.02 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |  752.1 |   595 |  1066 | 146.46 |

### total_tokens

| kata                         | workflow                     | cell_model           |   n |        mean |     min |      max |              std |
|:-----------------------------|:-----------------------------|:---------------------|----:|------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 | 8.52687e+06 | 7616336 |  9276348 | 601678           |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 | 7.21322e+06 | 4937100 |  9371654 |      1.34972e+06 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 | 8.55884e+06 | 6250382 | 10576013 |      1.4763e+06  |

### tests_passing (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                     | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |  10 |      10 |      100 |
