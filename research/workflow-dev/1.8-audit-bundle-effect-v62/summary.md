# RQ-audit-bundle-v62 — Aggregation

_Does the audit bundle (rationale additions + red-phase hardening) reproduce, on the exact-hybrid-v4-cleaned-cc base, the effects measured in the archived RQ-audit against v6.5-lean (discipline gain, variance shrink, token/wallclock surcharge while preserving correctness)?_

Generated: 2026-10-12T08:38:01Z

Cells declared: 2 · matched runs: 20 · min_replicates: 10

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### tests_passed_immediately

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |    0.7 | 2.21 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |    0   | 0    |

### refactorings_applied

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |    7.9 | 1.85 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |    8.7 | 0.67 |

### predictions_correct_rate

| kata                         | cell_workflow                     | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 | 170 | 170 |      0 |    100   |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 | 185 | 190 |      0 |     97.4 |

### cycle_count

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |    8.5 | 1.35 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |    8.7 | 0.67 |

### code_mass

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |  153.3 | 13.83 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |  149.3 | 12.14 |

### smell_total

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |    2.4 | 0.52 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |    2.2 | 0.63 |

### longest_function

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |   12.2 | 6.89 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |   12.7 | 4.32 |

### cognitive_max

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |    4.3 | 2.79 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |    4.5 | 2.59 |

### mccabe_max

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |    4.2 | 1.32 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |    4.6 | 1.07 |

### tests_passing

| kata                         | cell_workflow                     | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |

### duration_seconds

| kata                         | cell_workflow                     | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 |  627   | 117.15 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 |  630.9 | 100.72 |

### total_tokens

| kata                         | cell_workflow                     | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| game-of-life-example-mapping | exact-hybrid-v4-cleaned-cc        | opus-4-7-portkey-no-thinking |  10 |      0 | 1.04769e+07 | 2.07624e+06 |
| game-of-life-example-mapping | exact-hybrid-v4.3-audit-bundle-cc | opus-4-7-portkey-no-thinking |  10 |      0 | 1.18112e+07 | 2.59966e+06 |
