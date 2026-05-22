# RQ-21 — Aggregation

_Schließt v4.2-shared-context — durch persistierte Shared-Context-Files (example-mapping, tdd-journal, architecture-notes) — den Korrektheits-Gap zwischen v4-Subagents und v6-hybrid auf claim-office-example-mapping × Opus 4.7 (Direct API, no-thinking)?_

Generated: 2026-05-21T14:19:53Z

Cells declared: 4 · matched runs: 24 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v4.2-shared-context | opus-4-7-no-thinking | 4 | 4 | ⚠️ unter min_replicates (4/5) |
| claim-office-example-mapping | v6-hybrid | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.67 |  0.2  |  1    |   0.36 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   4 |   0.95 |  0.8  |  1    |   0.1  |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   1 |   0.93 |  0.93 |  0.93 | nan    |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   1    |  1    |  1    |   0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  10    |     3 |    15 |   5.33 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   4 |  14.25 |    12 |    15 |   1.5  |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   1 |  14    |    14 |    14 | nan    |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  15    |    15 |    15 |   0    |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   4 |       1 |       25 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |

### cli_built (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   4 |       1 |       25 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  37.8  |    16 |    49 |   9.51 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   4 |  46.25 |    34 |    55 |   8.96 |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   1 |  19    |    19 |    19 | nan    |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  25.8  |     8 |    33 |  10.8  |

### refactorings_applied

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  16.4  |     3 |    27 |   7.4  |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   4 |   7.75 |     2 |    19 |   7.8  |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   1 |  19    |    19 |    19 | nan    |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  10.4  |     4 |    13 |   3.78 |

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  3692.7 |  1640 |  4822 | 942.11 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   4 |  3491   |  2585 |  4333 | 818.55 |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   1 | 11552   | 11552 | 11552 | nan    |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  2116   |  1058 |  2883 | 716.26 |

### total_tokens

| kata                         | workflow                | model                |   n |        mean |         min |         max |           std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|------------:|------------:|--------------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1.3655e+07  | 9.41155e+06 | 1.65481e+07 |   2.09204e+06 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   4 | 1.38542e+07 | 1.14228e+07 | 1.88694e+07 |   3.39641e+06 |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   1 | 7.40882e+06 | 7.40882e+06 | 7.40882e+06 | nan           |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 | 3.3248e+07  | 2.14921e+07 | 3.90968e+07 |   7.41969e+06 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4.2-shared-context     | opus-4-7-no-thinking |   4 |       4 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |
