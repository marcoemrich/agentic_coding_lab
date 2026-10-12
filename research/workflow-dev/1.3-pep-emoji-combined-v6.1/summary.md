# RQ-pep-emoji-v6.1 — Aggregation

_Are the effects of the pep and emoji reductions on the hybrid-v2 base additive (two independent channels) or jointly carried (a single 'prompt scaffolding' mechanism)?_

Generated: 2026-10-12T08:37:59Z

Cells declared: 4 · matched runs: 25 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |  153.7 | 18.79 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |  144.6 | 11.67 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |  156.8 | 10.06 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  153.2 | 11.08 |

### smell_total

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |    2.4 | 0.52 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |    2   | 0    |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |    2   | 0    |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    2.2 | 0.45 |

### longest_function

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |   14.2 | 6.25 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |   13.2 | 9.73 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |   11.4 | 4.34 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   16.2 | 3.27 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |    6.5 | 3.24 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |    4.6 | 2.79 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |    6.6 | 2.3  |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    7.8 | 1.3  |

### mccabe_max

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |    5.2 | 1.69 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |    4.8 | 2.05 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |    4.6 | 0.89 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    5   | 1.41 |

### refactorings_applied

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |    4.1 | 1.97 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |    7   | 3.24 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |    5.4 | 2.88 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    3.8 | 0.84 |

### cycle_count

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |    8.7 | 0.67 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |    8.8 | 0.84 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |    8.8 | 0.45 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    9.2 | 0.45 |

### predictions_correct_rate

| kata                         | cell_workflow                        | cell_model                   |   n |   k |   t |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 | 172 | 173 |      0 |     99.4 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |  79 |  79 |      0 |    100   |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |  86 |  88 |      0 |     97.7 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |  71 |  72 |      0 |     98.6 |

### tests_passed_immediately

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |    4.7 | 2.75 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |    1.2 | 2.68 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |    2.2 | 3.03 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |    1.2 | 2.68 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |  507.9 | 147.13 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |  777.2 | 216.69 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |  668.8 | 200.58 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  432   |  43.77 |

### total_tokens

| kata                         | cell_workflow                        | cell_model                   |   n |   null |        mean |               sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|------------:|-----------------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 | 8.14625e+06 |      1.85681e+06 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 | 1.10634e+07 |      3.04473e+06 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 | 9.54578e+06 |      2.20494e+06 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 8.55371e+06 | 496493           |

### tests_passing

| kata                         | cell_workflow                        | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow                        | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |  10 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v2.1-no-pep-cc          | opus-4-7-portkey-no-thinking |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v2.2-no-emoji-cc        | opus-4-7-portkey-no-thinking |   5 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v2.3-no-pep-no-emoji-cc | opus-4-7-portkey-no-thinking |   5 |      0 |      1 |    0 |
