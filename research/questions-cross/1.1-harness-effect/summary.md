# RQ-harness — Aggregation

_Wie wirkt sich der Harness-Wechsel (Claude Code vs OpenCode) auf Korrektheit, Code-Qualität und TDD-Disziplin aus, wenn Modell, Workflow-Intention und Prompt-Stil konstant gehalten werden?_

Generated: 2026-05-26T14:46:20Z

Cells declared: 4 · matched runs: 28 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow                 | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### tests_total

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |  37.25 |    35 |    40 |  1.67 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  38.2  |    36 |    41 |  2.17 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |   8.5  |     5 |    10 |  1.35 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |   9.2  |     8 |    10 |  0.84 |

### verification_pct

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |   0.96 |  0.73 |     1 |  0.09 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |

### verification_passed

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |  14.38 |    11 |    15 |  1.41 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  15    |    15 |    15 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |  15    |    15 |    15 |  0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  15    |    15 |    15 |  0    |

### code_mass

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |  878.5 |   783 |  1066 | 91.44 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  827   |   666 |   938 | 99.36 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |  153.3 |   129 |   170 | 13.83 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  149.4 |   136 |   165 | 11.61 |

### cognitive_max

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |    5   |     3 |     8 |  1.77 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |    4.8 |     3 |    10 |  2.95 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |    4.3 |     1 |    10 |  2.79 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |    6.2 |     3 |     9 |  2.59 |

### mccabe_max

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |    4.5 |     3 |     5 |  0.76 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |    4.8 |     4 |     8 |  1.79 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |    4.2 |     2 |     6 |  1.32 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |    5.4 |     4 |     8 |  1.95 |

### cc_longest_function

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |  12.38 |    10 |    15 |  1.41 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  15    |     9 |    27 |  7.04 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |  12.2  |     2 |    24 |  6.89 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  17    |    12 |    23 |  5.15 |

### lines_of_code

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 | 254.75 |   201 |   326 | 42.61 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 | 270.6  |   209 |   315 | 43.78 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |  40.7  |    31 |    53 |  6.7  |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  39    |    33 |    46 |  5.1  |

### smell_total

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     2 |  0.74 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |   0.2  |     0 |     1 |  0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |   2.4  |     2 |     3 |  0.52 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |   2.2  |     2 |     3 |  0.45 |

### cycle_count

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |  37.38 |    35 |    40 |  1.6  |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  33    |    14 |    40 | 10.72 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |   8.5  |     5 |    10 |  1.35 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |   9.2  |     8 |    10 |  0.84 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                 | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |       582 |     599 |     97.2 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |       255 |     256 |     99.6 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |       170 |     170 |    100   |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |        86 |      86 |    100   |

### refactorings_applied

| kata                         | workflow                 | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |  24.88 |    18 |    37 |  6.9  |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  19    |     7 |    37 | 11.38 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |   7.9  |     4 |     9 |  1.85 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |   5    |     3 |    10 |  2.83 |

### completed_within_budget (rate %)

| kata                         | workflow                 | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### duration_seconds

| kata                         | workflow                 | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 | 2530.38 |  2194 |  3285 | 401.16 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 | 2230    |  1325 |  3802 | 951.98 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 |  627    |   442 |   783 | 117.15 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 |  516    |   370 |   857 | 196.35 |

### total_tokens

| kata                         | workflow                 | cell_model                   |   n |        mean |      min |      max |              std |
|:-----------------------------|:-------------------------|:-----------------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |   8 | 4.44426e+07 | 39301139 | 49093278 |      3.40183e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 | 3.08044e+07 | 13662523 | 57052151 |      1.6338e+07  |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-7-portkey-no-thinking |  10 | 8.31736e+06 |  4985045 |  9943890 |      1.61451e+06 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-7-portkey-no-thinking |   5 | 2.44081e+06 |  1903764 |  3695106 | 744235           |
