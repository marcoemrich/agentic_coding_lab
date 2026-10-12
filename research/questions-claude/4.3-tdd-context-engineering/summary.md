# RQ-context — Aggregation

_Which form of context structuring — isolated subagent contexts per TDD phase (subagents-v2), a shared, accumulated single context (single-context-v2), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (hybrid-v2), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (green-refactor-v2) — leads to better code quality?_

Generated: 2026-10-12T08:37:39Z

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

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 621.6  | 65.58 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 | 692.67 | 78.8  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 861.29 | 74.51 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 | 801    |  3.61 |

### smell_total

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  13.2  | 7.53 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   6.83 | 7.55 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   1.29 | 1.5  |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |   2.33 | 2.31 |

### longest_function

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  40.8  | 27.12 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  32.67 | 10.19 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |  18.14 |  5.11 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |  19.33 |  2.52 |

### production_loc

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 156.8  | 37.96 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 | 167.17 | 27.92 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 191.14 | 20.32 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 | 187.33 | 29.16 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  16    | 8.97 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  10.17 | 2.64 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   5.71 | 2.36 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |   4.67 | 0.58 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  26.8  | 24.07 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  14.83 |  4.17 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   5.71 |  2.87 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |   5    |  1    |

### tests_passing

| kata                         | cell_workflow                           | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |   7 |      0 |      100 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |   3 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |   0.98 | 0.04 |

### mutation_score

| kata                         | cell_workflow                           | cell_model                   |   n |   null | mean   | sd   |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|:-------|:-----|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   0 |      6 |        |      |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   0 |      7 |        |      |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   0 |      3 |        |      |

### total_tokens

| kata                         | cell_workflow                           | cell_model                   |   n |   null |        mean |          sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 3.48702e+07 | 6.07042e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 | 1.87267e+07 | 5.35498e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 3.78763e+07 | 1.34521e+07 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 | 3.57428e+07 | 1.0505e+07  |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                   |   n |   null |    mean |     sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|--------:|-------:|
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 3228.8  | 919.93 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  641    | 122.02 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 1569    | 519.28 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 | 1969.67 | 715.03 |
