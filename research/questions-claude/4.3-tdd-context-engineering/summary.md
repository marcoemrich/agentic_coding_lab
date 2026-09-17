# RQ-context — Aggregation

_Which form of context structuring — isolated subagent contexts per TDD phase (subagents-v2), a shared, accumulated single context (single-context-v2), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (hybrid-v2), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (green-refactor-v2) — leads to better code quality?_

Generated: 2026-09-17T01:17:38Z

Cells declared: 4 · matched runs: 21 · min_replicates: 3

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 7 | 7 | ✅ |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 | 801    |   798 |   805 |  3.61 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 | 861.29 |   759 |   982 | 74.51 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 | 692.67 |   575 |   796 | 78.8  |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 | 621.6  |   538 |   703 | 65.58 |

### smell_total

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |   2.33 |     1 |     5 |  2.31 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |   1.29 |     0 |     4 |  1.5  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   6.83 |     1 |    17 |  7.55 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |  13.2  |     0 |    19 |  7.53 |

### cc_longest_function

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |  19.33 |    17 |    22 |  2.52 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |  18.14 |    11 |    25 |  5.11 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |  32.67 |    20 |    50 | 10.19 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |  40.8  |    17 |    86 | 27.12 |

### cc_loc

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 | 187.33 |   170 |   221 | 29.16 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 | 191.14 |   170 |   221 | 20.32 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 | 167.17 |   121 |   193 | 27.92 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 | 156.8  |   125 |   220 | 37.96 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |   4.67 |     4 |     5 |  0.58 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |   5.71 |     4 |    10 |  2.36 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |  10.17 |     7 |    14 |  2.64 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |  16    |     5 |    30 |  8.97 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |   5    |     4 |     6 |  1    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |   5.71 |     3 |    11 |  2.87 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |  14.83 |     8 |    19 |  4.17 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |  26.8  |     5 |    68 | 24.07 |

### tests_passing (rate %)

| kata                         | cell_workflow                           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### verification_pct

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |   0.98 |  0.93 |     1 |  0.04 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |   0.96 |  0.8  |     1 |  0.09 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### mutation_score

_All values are missing or non-numeric._

### total_tokens

| kata                         | cell_workflow                           | cell_model                   |   n |        mean |      min |      max |         std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 | 2.61112e+07 | 20513627 | 32777883 | 6.20163e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 | 3.45442e+07 |  9306264 | 44845398 | 1.19731e+07 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 | 1.87267e+07 | 14120743 | 28366021 | 5.35498e+06 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 | 1.41003e+07 | 11422803 | 18869365 | 2.99239e+06 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 | 1969.67 |  1340 |  2747 | 715.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 | 1569    |   556 |  2071 | 519.28 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |  641    |   525 |   872 | 122.02 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 | 3228.8  |  2180 |  4333 | 919.93 |
