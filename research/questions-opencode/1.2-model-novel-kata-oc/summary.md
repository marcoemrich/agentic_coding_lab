# RQ-model-novel-oc — Aggregation

_Wie unterscheiden sich fünf via OpenCode-Harness erreichbare Modelle in Korrektheit und TDD-Disziplin auf claim-office-example-mapping mit dem v5.1-testlist-scope-fix-oc-Workflow?_

Generated: 2026-05-25T13:05:59Z

Cells declared: 4 · matched runs: 4 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey | 1 | 1 | ⚠️ unter min_replicates (1/5) |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6 | 1 | 1 | ⚠️ unter min_replicates (1/5) |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7 | 1 | 1 | ⚠️ unter min_replicates (1/5) |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash | 1 | 1 | ⚠️ unter min_replicates (1/5) |

## Outcome-Pivots (pro Zelle)

### verification_pct (rate %)

| kata                         | workflow                   | cell_model       |   n |   match |   rate_% |
|:-----------------------------|:---------------------------|:-----------------|----:|--------:|---------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |       1 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |       1 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |       0 |        0 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |       1 |      100 |

### verification_passed

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |     15 |    15 |    15 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |     15 |    15 |    15 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |      0 |     0 |     0 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |     15 |    15 |    15 |   nan |

### verification_total

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |     15 |    15 |    15 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |     15 |    15 |    15 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |     15 |    15 |    15 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |     15 |    15 |    15 |   nan |

### code_mass

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |    624 |   624 |   624 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |    800 |   800 |   800 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |    484 |   484 |   484 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |    735 |   735 |   735 |   nan |

### cognitive_max

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |     25 |    25 |    25 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |     26 |    26 |    26 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |     19 |    19 |    19 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |     11 |    11 |    11 |   nan |

### mccabe_max

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |     20 |    20 |    20 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |     22 |    22 |    22 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |     10 |    10 |    10 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |      9 |     9 |     9 |   nan |

### cc_longest_function

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |     63 |    63 |    63 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |     79 |    79 |    79 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |     41 |    41 |    41 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |     25 |    25 |    25 |   nan |

### lines_of_code

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |    218 |   218 |   218 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |    286 |   286 |   286 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |    132 |   132 |   132 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |    266 |   266 |   266 |   nan |

### smell_total

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |     20 |    20 |    20 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |     16 |    16 |    16 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |     14 |    14 |    14 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |      1 |     1 |     1 |   nan |

### cycle_count

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |      2 |     2 |     2 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |      3 |     3 |     3 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |      1 |     1 |     1 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |      2 |     2 |     2 |   nan |

### refactorings_applied

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |      3 |     3 |     3 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |      2 |     2 |     2 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |      1 |     1 |     1 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |      1 |     1 |     1 |   nan |

### predictions_correct

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |      0 |     0 |     0 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |      0 |     0 |     0 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |      0 |     0 |     0 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |      4 |     4 |     4 |   nan |

### predictions_total

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |      0 |     0 |     0 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |      0 |     0 |     0 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |      2 |     2 |     2 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |      4 |     4 |     4 |   nan |

### tests_passing (rate %)

| kata                         | workflow                   | cell_model       |   n |   match |   rate_% |
|:-----------------------------|:---------------------------|:-----------------|----:|--------:|---------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |       1 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |       1 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |       1 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |       1 |      100 |

### tests_total

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |     32 |    32 |    32 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |     46 |    46 |    46 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |     37 |    37 |    37 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |     36 |    36 |    36 |   nan |

### completed_within_budget (rate %)

| kata                         | workflow                   | cell_model       |   n |   match |   rate_% |
|:-----------------------------|:---------------------------|:-----------------|----:|--------:|---------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |       1 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |       1 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |       1 |      100 |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |       1 |      100 |

### duration_seconds

| kata                         | workflow                   | cell_model       |   n |   mean |   min |   max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 |    483 |   483 |   483 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 |   1925 |  1925 |  1925 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 |   2114 |  2114 |  2114 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 |    724 |   724 |   724 |   nan |

### total_tokens

| kata                         | workflow                   | cell_model       |   n |        mean |     min |     max |   std |
|:-----------------------------|:---------------------------|:-----------------|----:|------------:|--------:|--------:|------:|
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | gemini-3-5-flash |   1 | 7.20188e+06 | 7201882 | 7201882 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | kimi-k2-6        |   1 | 2.59077e+06 | 2590768 | 2590768 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | minimax-m2-7     |   1 | 7.50241e+06 | 7502409 | 7502409 |   nan |
| claim-office-example-mapping | v5.1-testlist-scope-fix-oc | opus-4-7-portkey |   1 | 9.16241e+06 | 9162412 | 9162412 |   nan |
