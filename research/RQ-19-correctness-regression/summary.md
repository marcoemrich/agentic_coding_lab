# RQ-19 — Aggregation

_An welcher Stelle in der Optimierungskette v6 → v6.5 → v6.5.1 → v6.5.2 → v6.5.3 → v6.5.4 (→ v6.6) ist die verification_pct-Regression auf claim-office-example-mapping entstanden? v6-hybrid liefert 1.0 ± 0, v6.5.4 nur 0.40 ± 0.43 — die Stufe dazwischen ist nicht beobachtet._

Generated: 2026-05-18T16:54:39Z

Cells declared: 7 · matched runs: 27 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6-hybrid | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.5-lean | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.5.2-bullets-cut | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.5.3-targeted-cuts | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v6.5.4-refactor-cut-only | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v6.6-leaner | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                     | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 |   1    |  1    |  1    |   0    |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 |   0.38 |  0    |  1    |   0.54 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 |   0.36 |  0    |  1    |   0.56 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 |   0.51 |  0.13 |  0.73 |   0.33 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   1 |   0.73 |  0.73 |  0.73 | nan    |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |   0.4  |  0    |  1    |   0.43 |

### verification_passed

| kata                         | workflow                     | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 |  15    |    15 |    15 |   0    |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 |   5.67 |     0 |    15 |   8.14 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 |   5.33 |     0 |    15 |   8.39 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 |   7.67 |     2 |    11 |   4.93 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   1 |  11    |    11 |    11 | nan    |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |   6    |     0 |    15 |   6.46 |

### tests_passing (rate %)

| kata                         | workflow                     | model                |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   3 |       1 |       33 |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |      10 |      100 |

### tests_total

| kata                         | workflow                     | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 |  35.2  |    34 |    37 |   1.3  |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 |  29    |     7 |    42 |  19.16 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 |  23    |    10 |    33 |  11.79 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 |  19.67 |     8 |    26 |  10.12 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   1 |  26    |    26 |    26 | nan    |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |  13.1  |     6 |    35 |   8.91 |

### cycle_count

| kata                         | workflow                     | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 |  25.8  |     8 |    33 |  10.8  |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 |  27    |     0 |    42 |  23.43 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 |  17.33 |     0 |    26 |  15.01 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 |  17    |     0 |    26 |  14.73 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   1 |  26    |    26 |    26 | nan    |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |   8.3  |     0 |    35 |  12.12 |

### refactorings_applied

| kata                         | workflow                     | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 |  10.4  |     4 |    13 |   3.78 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 |  23.67 |     0 |    42 |  21.5  |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 |  18.67 |     0 |    30 |  16.29 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 |  17    |     0 |    26 |  14.73 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   1 |  26    |    26 |    26 | nan    |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |   8.4  |     0 |    35 |  12.16 |

### duration_seconds

| kata                         | workflow                     | model                |   n |    mean |   min |   max |     std |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 | 2116    |  1058 |  2883 |  716.26 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 | 2885    |   783 |  4348 | 1866.43 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 | 2475.33 |   861 |  3501 | 1415.03 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 | 2285.67 |   897 |  3104 | 1209    |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   1 | 3058    |  3058 |  3058 |  nan    |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 | 1520.2  |   604 |  4286 | 1120.48 |

### total_tokens

| kata                         | workflow                     | model                |   n |        mean |              min |         max |           std |
|:-----------------------------|:-----------------------------|:---------------------|----:|------------:|-----------------:|------------:|--------------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 | 3.3248e+07  |      2.14921e+07 | 3.90968e+07 |   7.41969e+06 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 | 3.59917e+07 | 353159           | 5.71708e+07 |   3.10462e+07 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 | 2.86817e+07 | 302630           | 4.43308e+07 |   2.46203e+07 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 | 2.57827e+07 | 354557           | 3.85191e+07 |   2.20215e+07 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   1 | 4.05136e+07 |      4.05136e+07 | 4.05136e+07 | nan           |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 | 1.26385e+07 | 302078           | 4.90287e+07 |   1.73828e+07 |

### completed_within_budget (rate %)

| kata                         | workflow                     | model                |   n |   match |   rate_% |
|:-----------------------------|:-----------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6-hybrid                    | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v6.5-lean                    | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.1-orchestration-audited | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.2-bullets-cut           | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.3-targeted-cuts         | opus-4-7-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v6.5.4-refactor-cut-only     | opus-4-7-no-thinking |  10 |      10 |      100 |
