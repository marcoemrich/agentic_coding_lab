# RQ-context — Aggregation

_Welche Form der Kontext-Strukturierung — isolierte Subagent-Kontexte pro TDD-Phase (v4.1), ein geteilter, akkumulierter Single-Context (v5.1) oder ein Hybrid mit Skill-basiertem Red/Green im Shared-Context und isoliertem Refactor-Subagent (v6.1) — fuehrt zu besserer Code-Qualitaet?_

Generated: 2026-05-22T21:38:30Z

Cells declared: 3 · matched runs: 14 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 621.6  |   538 |   703 | 65.58 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 | 692.67 |   575 |   796 | 78.8  |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 | 920.67 |   875 |   982 | 55.19 |

### smell_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  13.2  |     0 |    19 |  7.53 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   6.83 |     1 |    17 |  7.55 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   1.33 |     0 |     2 |  1.15 |

### cc_longest_function

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  40.8  |    17 |    86 | 27.12 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  32.67 |    20 |    50 | 10.19 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |  16.67 |    11 |    24 |  6.66 |

### cc_loc

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 156.8  |   125 |   220 | 37.96 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 | 167.17 |   121 |   193 | 27.92 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 | 184.33 |   181 |   190 |  4.93 |

### mccabe_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  16    |     5 |    30 |  8.97 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  10.17 |     7 |    14 |  2.64 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   5    |     4 |     7 |  1.73 |

### cognitive_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |  26.8  |     5 |    68 | 24.07 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  14.83 |     8 |    19 |  4.17 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   4.33 |     3 |     6 |  1.53 |

### tests_passing (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |   0.96 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |   1    |   1   |     1 |  0    |

### completed_within_budget (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |

### mutation_score

_Alle Werte fehlen oder sind nicht numerisch._

### total_tokens

| kata                         | workflow                       | cell_model                   |   n |        mean |      min |      max |         std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 1.41003e+07 | 11422803 | 18869365 | 2.99239e+06 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 | 1.87267e+07 | 14120743 | 28366021 | 5.35498e+06 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 | 3.01633e+07 |  9306264 | 44845398 | 1.85568e+07 |

### duration_seconds

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   5 | 3228.8 |  2180 |  4333 | 919.93 |
| claim-office-example-mapping | v5.1-testlist-scope-fix        | opus-4-7-portkey-no-thinking |   6 |  641   |   525 |   872 | 122.02 |
| claim-office-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |   3 | 1424   |   556 |  2071 | 781.3  |
