# RQ-tdd-correctness — Aggregation

_Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata?_

Generated: 2026-09-11T07:48:32Z

Cells declared: 7 · matched runs: 36 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 7 | 7 | ✅ |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |   0.97 |  0.87 |     1 |  0.06 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |   0.98 |  0.93 |     1 |  0.04 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |   0.96 |  0.8  |     1 |  0.09 |

### verification_passed

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |  14.6  |    13 |    15 |  0.89 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |  14.67 |    14 |    15 |  0.58 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |  14.4  |    12 |    15 |  1.34 |

### verification_total

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |

### tests_passing (rate %)

| kata                         | cell_workflow                           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |   3.6  |     2 |     5 |  1.14 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |   5.4  |     4 |     8 |  1.95 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |   3.8  |     3 |     6 |  1.3  |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |  18.33 |     9 |    25 |  8.33 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |  28    |     5 |    43 | 12.96 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   5.5  |     2 |    19 |  6.66 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |  44.6  |    34 |    55 |  8.59 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |   1    |     1 |     1 |  0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |   1    |     1 |     1 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |   1.8  |     1 |     2 |  0.45 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |  14    |     5 |    23 |  9    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |  11    |     4 |    17 |  5.1  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   2.17 |     1 |     3 |  0.75 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |   6.8  |     2 |    19 |  7.09 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                           | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |        99 |      99 |    100   |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |       292 |     303 |     96.4 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |        39 |      39 |    100   |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |       302 |     325 |     92.9 |

### tests_passed_immediately

| kata                         | cell_workflow                           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |   0.6  |     0 |     2 |  0.89 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 |   6.33 |     1 |    11 |  5.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |  13.57 |     1 |    26 |  8.62 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   1.67 |     0 |     9 |  3.61 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |  22.2  |    15 |    29 |  6.14 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |  307.8  |   280 |   368 |  35.1  |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |  276.4  |   228 |   362 |  53.17 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |  312.4  |   257 |   381 |  53.36 |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 | 1969.67 |  1340 |  2747 | 715.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 | 1569    |   556 |  2071 | 519.28 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |  641    |   525 |   872 | 122.02 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 | 3228.8  |  2180 |  4333 | 919.93 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                   |   n |        mean |      min |      max |              std |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 | 2.12087e+06 |  1432251 |  3226054 | 695551           |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 | 3.44636e+06 |  2116892 |  5135072 |      1.09186e+06 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 | 3.28141e+06 |  2734813 |  4185323 | 545757           |
| claim-office-example-mapping | exact-green-refactor-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   3 | 2.61112e+07 | 20513627 | 32777883 |      6.20163e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 | 3.45442e+07 |  9306264 | 44845398 |      1.19731e+07 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 | 1.87267e+07 | 14120743 | 28366021 |      5.35498e+06 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 | 1.41003e+07 | 11422803 | 18869365 |      2.99239e+06 |
