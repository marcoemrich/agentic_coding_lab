# RQ-tdd-correctness — Aggregation

_Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata?_

Generated: 2026-10-12T08:37:38Z

Cells declared: 7 · matched runs: 36 · min_replicates: 3

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 7 | 7 | ✅ |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |   0.98 | 0.04 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0.97 | 0.06 |

### verification_passed

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |  15    | 0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  14.4  | 1.34 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  15    | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |  15    | 0    |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |  14.67 | 0.58 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |  15    | 0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  14.6  | 0.89 |

### verification_total

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |     15 |    0 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |

### tests_passing

| kata                         | cell_workflow                           | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |   7 |      0 |      100 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |   3 |      0 |      100 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |

### cycle_count

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |   3.8  |  1.3  |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  44.6  |  8.59 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   5.5  |  6.66 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |  28    | 12.96 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |  18.33 |  8.33 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   3.6  |  1.14 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   5.4  |  1.95 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |   1.8  | 0.45 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   6.8  | 7.09 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   2.17 | 0.75 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |  11    | 5.1  |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |  14    | 9    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |    nan |  nan | 302 | 325 |     92.9 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |    nan |  nan |  39 |  39 |    100   |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |    nan |  nan | 292 | 303 |     96.4 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |    nan |  nan |  99 |  99 |    100   |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   0 |      5 |    nan |  nan | nan | nan |    nan   |

### tests_passed_immediately

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |   0.6  | 0.89 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  22.2  | 6.14 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   1.67 | 3.61 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |  13.57 | 8.62 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 |   6.33 | 5.03 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0    | 0    |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                   |   n |   null |    mean |     sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|--------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |  312.4  |  53.36 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 3228.8  | 919.93 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  641    | 122.02 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 1569    | 519.28 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 | 1969.67 | 715.03 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |  307.8  |  35.1  |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  276.4  |  53.17 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                   |   n |   null |        mean |               sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 | 3.28141e+06 | 545757           |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 3.48702e+07 |      6.07042e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 | 1.87267e+07 |      5.35498e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 3.78763e+07 |      1.34521e+07 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |      0 | 3.57428e+07 |      1.0505e+07  |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 | 3.55263e+06 | 808118           |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 3.44636e+06 |      1.09186e+06 |
