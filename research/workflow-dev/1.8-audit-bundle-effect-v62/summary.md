# RQ-audit-bundle-v62 — Aggregation

_Reproduziert das Audit-Bundle (Rationale-Ergaenzungen + Red-Phase-Hardening) auf der exact-hybrid-v4-cleaned-cc-Basis die in der archivierten RQ-audit gegen v6.5-lean gemessenen Effekte (Disziplin-Plus, Streuungs-Schrumpf, Token/Wallclock-Aufschlag bei Korrektheits-Erhalt)?_

Generated: 2026-09-11T07:48:53Z

Cells declared: 2 · matched runs: 20 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passed_immediately

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |    0.7 |     0 |     7 |  2.21 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |    0   |     0 |     0 |  0    |

### refactorings_applied

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |    7.9 |     4 |     9 |  1.85 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |    8.7 |     8 |    10 |  0.67 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                     | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |       170 |     170 |    100   |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |       185 |     190 |     97.4 |

### cycle_count

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |    8.5 |     5 |    10 |  1.35 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |    8.7 |     8 |    10 |  0.67 |

### code_mass

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |  153.3 |   129 |   170 | 13.83 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |  149.3 |   134 |   170 | 12.14 |

### smell_total

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |    2.4 |     2 |     3 |  0.52 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |    2.2 |     2 |     4 |  0.63 |

### cc_longest_function

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |   12.2 |     2 |    24 |  6.89 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |   12.7 |     2 |    18 |  4.32 |

### cognitive_max

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |    4.3 |     1 |    10 |  2.79 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |    4.5 |     3 |    11 |  2.59 |

### mccabe_max

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |    4.2 |     2 |     6 |  1.32 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |    4.6 |     3 |     7 |  1.07 |

### tests_passing (rate %)

| kata                         | cell_workflow                     | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                     | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |

### duration_seconds

| kata                         | cell_workflow                     | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |  627   |   442 |   783 | 117.15 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |  630.9 |   542 |   875 | 100.72 |

### total_tokens

| kata                         | cell_workflow                     | cell_model                   |   n |        mean |     min |      max |         std |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|------------:|--------:|---------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 | 8.31736e+06 | 4985045 |  9943890 | 1.61451e+06 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 | 9.65162e+06 | 7630390 | 16032670 | 2.33982e+06 |
