# RQ-19 — Aggregation

_An welcher Stelle in der Optimierungskette v6 → v6.5 → v6.5.1 → v6.5.2 → v6.5.3 → v6.5.4 (→ v6.6) ist die verification_pct-Regression auf claim-office-example-mapping entstanden? Ist der Befund modell-unabhängig?_

Generated: 2026-05-19T19:00:48Z

Cells declared: 20 · matched runs: 71 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6-hybrid | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6-hybrid | opus-4-6-portkey-no-thinking | 15 | 15 | ✅ |
| claim-office-example-mapping | v6.1-no-app | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.1-no-app | opus-4-6-portkey-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v6.2-no-rules | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.2-no-rules | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.3-no-pep | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.3-no-pep | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.4-no-emoji | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.4-no-emoji | opus-4-6-portkey-no-thinking | 12 | 12 | ✅ |
| claim-office-example-mapping | v6.5-lean | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.5-lean | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-6-portkey-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v6.5.2-bullets-cut | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.5.2-bullets-cut | opus-4-6-portkey-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v6.5.3-targeted-cuts | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.5.3-targeted-cuts | opus-4-6-portkey-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v6.5.4-refactor-cut-only | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v6.5.4-refactor-cut-only | opus-4-6-portkey-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                     | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 |   0.68 |  0.27 |  1    |   0.33 |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 |   1    |  1    |  1    |   0    |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 |   1    |  1    |  1    |   0    |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 |   0.44 |  0    |  1    |   0.52 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 |   1    |  1    |  1    |   0    |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 |   0.4  |  0    |  1    |   0.55 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 |   1    |  1    |  1    |   0    |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 |   0.64 |  0    |  1    |   0.39 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 |   0.93 |  0.8  |  1    |   0.12 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 |   0.07 |  0    |  0.33 |   0.15 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 |   0.38 |  0    |  1    |   0.54 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 |   0.36 |  0    |  1    |   0.56 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 |   0.51 |  0.13 |  0.73 |   0.33 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   1 |   0.73 |  0.73 |  0.73 | nan    |

### verification_passed

| kata                         | workflow                     | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 |  10.13 |     4 |    15 |   4.9  |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 |  15    |    15 |    15 |   0    |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 |  15    |    15 |    15 |   0    |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 |   6.6  |     0 |    15 |   7.77 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 |  15    |    15 |    15 |   0    |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 |   6    |     0 |    15 |   8.22 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 |  15    |    15 |    15 |   0    |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 |   9.67 |     0 |    15 |   5.79 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 |  14    |    12 |    15 |   1.73 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 |   1    |     0 |     5 |   2.24 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 |   5.67 |     0 |    15 |   8.14 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 |   5.33 |     0 |    15 |   8.39 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 |   7.67 |     2 |    11 |   4.93 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   1 |  11    |    11 |    11 | nan    |

### tests_passing (rate %)

| kata                         | workflow                     | model                        |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 |      13 |       87 |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 |       2 |       40 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 |       2 |       40 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 |      10 |       83 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 |       1 |       20 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   3 |       1 |       33 |

### tests_total

| kata                         | workflow                     | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 |  30.53 |    19 |    39 |   8    |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 |  35.2  |    34 |    37 |   1.3  |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 |  31.67 |    28 |    35 |   3.51 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 |  20.8  |     1 |    40 |  19.29 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 |  34    |    29 |    38 |   4.58 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 |  15.4  |     0 |    38 |  20.18 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 |  33.67 |    33 |    35 |   1.15 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 |  28.83 |     1 |    43 |  12.74 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 |  29    |    26 |    32 |   3    |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 |   5.8  |     0 |    26 |  11.3  |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 |  29    |     7 |    42 |  19.16 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 |  23    |    10 |    33 |  11.79 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 |  19.67 |     8 |    26 |  10.12 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   1 |  26    |    26 |    26 | nan    |

### cycle_count

| kata                         | workflow                     | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 |  15.13 |     0 |    39 |  17.39 |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 |  25.8  |     8 |    33 |  10.8  |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 |  21    |    11 |    32 |  10.54 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 |  16.2  |     0 |    41 |  21.74 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 |  34    |    29 |    38 |   4.58 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 |   4.8  |     0 |    22 |   9.65 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 |  34.33 |    33 |    37 |   2.31 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 |  15.92 |     0 |    43 |  19.77 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 |  22.67 |    13 |    29 |   8.5  |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 |   0.6  |     0 |     2 |   0.89 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 |  27    |     0 |    42 |  23.43 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 |  17.33 |     0 |    26 |  15.01 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 |  17    |     0 |    26 |  14.73 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   1 |  26    |    26 |    26 | nan    |

### refactorings_applied

| kata                         | workflow                     | model                        |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 |   5.4  |     0 |    20 |   6.6  |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 |  10.4  |     4 |    13 |   3.78 |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 |  16    |     7 |    29 |  11.53 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 |   3.8  |     0 |    12 |   5.5  |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 |  14    |    10 |    16 |   3.46 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 |   1.8  |     0 |     9 |   4.02 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 |  12.33 |    11 |    13 |   1.15 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 |   5    |     0 |    16 |   6.34 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 |  13.33 |     6 |    19 |   6.66 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 |   0    |     0 |     0 |   0    |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 |  23.67 |     0 |    42 |  21.5  |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 |  18.67 |     0 |    30 |  16.29 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 |  17    |     0 |    26 |  14.73 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   1 |  26    |    26 |    26 | nan    |

### duration_seconds

| kata                         | workflow                     | model                        |   n |    mean |   min |   max |     std |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 | 2633    |  1665 |  4095 |  837.59 |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 | 2116    |  1058 |  2883 |  716.26 |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 | 2021.33 |  1147 |  3056 |  964.55 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 | 1680    |   186 |  3523 | 1444.01 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 | 2217.67 |  2051 |  2424 |  189.64 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 | 1126    |    84 |  2662 | 1348.53 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 | 2177.67 |  2017 |  2476 |  258.62 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 | 2696.25 |   210 |  4127 | 1036.99 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 | 2000.33 |  1238 |  2615 |  700.28 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 |  558.4  |    89 |  2132 |  880.87 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 | 2885    |   783 |  4348 | 1866.43 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 | 2475.33 |   861 |  3501 | 1415.03 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 | 2285.67 |   897 |  3104 | 1209    |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   1 | 3058    |  3058 |  3058 |  nan    |

### total_tokens

| kata                         | workflow                     | model                        |   n |             mean |              min |              max |              std |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|-----------------:|-----------------:|-----------------:|-----------------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 |      2.26795e+07 | 377985           |      5.78407e+07 |      2.50901e+07 |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 |      3.3248e+07  |      2.14921e+07 |      3.90968e+07 |      7.41969e+06 |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 |      3.29336e+07 |      2.61851e+07 |      4.1297e+07  |      7.68426e+06 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 |      2.04302e+07 | 323988           |      5.20879e+07 |      2.69641e+07 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 |      3.7376e+07  |      3.53673e+07 |      3.8767e+07  |      1.78204e+06 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 |      8.32729e+06 | 396160           |      3.95254e+07 |      1.74413e+07 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 |      3.92687e+07 |      3.59768e+07 |      4.18392e+07 |      2.99705e+06 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 |      2.02565e+07 | 380203           |      5.01155e+07 |      2.45394e+07 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 |      3.22839e+07 |      2.6121e+07  |      3.65994e+07 |      5.47803e+06 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 | 568723           | 388741           | 974067           | 256885           |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 |      3.59917e+07 | 353159           |      5.71708e+07 |      3.10462e+07 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 |      2.86817e+07 | 302630           |      4.43308e+07 |      2.46203e+07 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 |      2.57827e+07 | 354557           |      3.85191e+07 |      2.20215e+07 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   1 |      4.05136e+07 |      4.05136e+07 |      4.05136e+07 |    nan           |

### completed_within_budget (rate %)

| kata                         | workflow                     | model                        |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-6-portkey-no-thinking |  15 |      15 |      100 |
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking         |   5 |       5 |      100 |
| claim-office-example-mapping | v6.1-no-app                  | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-no-rules                | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.3-no-pep                  | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-6-portkey-no-thinking |  12 |      12 |      100 |
| claim-office-example-mapping | v6.4-no-emoji                | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking         |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking         |   3 |       3 |      100 |
