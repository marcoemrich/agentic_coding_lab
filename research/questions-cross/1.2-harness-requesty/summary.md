# RQ-harness-requesty — Aggregation

_How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant?_

Generated: 2026-07-28T06:19:39Z

Cells declared: 8 · matched runs: 31 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-8-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned | opus-4-8-requesty | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-8-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-8-requesty | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-requesty | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-requesty | 5 | 5 | ✅ |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty | 1 | 1 | ⚠️ unter min_replicates (1/5) |
| game-of-life-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | cell_workflow                    | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |       1 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |       5 |      100 |

### tests_total

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   39.8 |    35 |    44 |   3.7  |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   36.4 |    32 |    40 |   2.88 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   39.4 |    32 |    43 |   4.28 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |   38   |    38 |    38 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    8.8 |     8 |     9 |   0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |    8.4 |     8 |     9 |   0.55 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |    8.6 |     8 |    10 |   0.89 |

### verification_pct

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   0.93 |  0.73 |     1 |   0.12 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   0.88 |  0.67 |     1 |   0.17 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   0.99 |  0.93 |     1 |   0.03 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |   1    |  1    |     1 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   1    |  1    |     1 |   0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   1    |  1    |     1 |   0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   1    |  1    |     1 |   0    |

### verification_passed

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   14   |    11 |    15 |   1.73 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   13.2 |    10 |    15 |   2.49 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   14.8 |    14 |    15 |   0.45 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |   15   |    15 |    15 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   15   |    15 |    15 |   0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   15   |    15 |    15 |   0    |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   15   |    15 |    15 |   0    |

### code_mass

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |  862.8 |   790 |   976 |  76.28 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |  920.6 |   847 |   985 |  60    |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |  782   |   653 |   866 |  85.84 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |  732   |   732 |   732 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |  158.6 |   136 |   171 |  13.58 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |  154.2 |   140 |   174 |  12.48 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |  150.8 |   145 |   156 |   5.07 |

### cognitive_max

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    3   |     2 |     4 |   1    |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |    4.6 |     4 |     7 |   1.34 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |    3.6 |     3 |     6 |   1.34 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |    6   |     6 |     6 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    5   |     3 |     7 |   1.87 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   12.6 |     5 |    17 |   5.37 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   11   |     7 |    15 |   4    |

### mccabe_max

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    3.8 |     3 |     4 |   0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |    4.4 |     4 |     6 |   0.89 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |    3.8 |     3 |     6 |   1.3  |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |    5   |     5 |     5 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    4.6 |     4 |     6 |   0.89 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |    8.8 |     5 |    11 |   2.49 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |    8   |     6 |    10 |   1.87 |

### cc_longest_function

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   15   |    10 |    25 |   5.87 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   18.4 |    12 |    30 |   6.99 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   22   |    17 |    25 |   4.12 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |   18   |    18 |    18 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   11.6 |    10 |    14 |   1.52 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   21.8 |    15 |    25 |   3.96 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   17.8 |     3 |    23 |   8.41 |

### lines_of_code

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |  256.2 |   205 |   287 |  33.28 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |  315.6 |   260 |   398 |  52.9  |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |  271.6 |   257 |   292 |  16.76 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |  229   |   229 |   229 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   44.6 |    32 |    55 |   8.2  |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   36.8 |    32 |    51 |   8.01 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   35.2 |    33 |    38 |   2.17 |

### smell_total

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    0   |     0 |     0 |   0    |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |    0.2 |     0 |     1 |   0.45 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |    0.4 |     0 |     2 |   0.89 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |    0   |     0 |     0 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    2.2 |     2 |     3 |   0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |    3.2 |     2 |     4 |   1.1  |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |    3.4 |     2 |     5 |   1.34 |

### cycle_count

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   39.8 |    35 |    44 |   3.7  |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   36.4 |    32 |    40 |   2.88 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   40.2 |    32 |    44 |   4.76 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |   39   |    39 |    39 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    8.8 |     8 |     9 |   0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |    8.4 |     8 |     9 |   0.55 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |    9.8 |     8 |    15 |   3.03 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                    | cell_model        |   n |   correct |   total |   rate_% |
|:-----------------------------|:---------------------------------|:------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |       364 |     366 |     99.5 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |       359 |     362 |     99.2 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |       348 |     350 |     99.4 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |        31 |      32 |     96.9 |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |        88 |      88 |    100   |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |        76 |      84 |     90.5 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |        40 |      41 |     97.6 |

### refactorings_applied

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |   28   |    18 |    44 |  12.47 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |   23.2 |    18 |    40 |   9.47 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |   19.4 |    14 |    27 |   5.18 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |   16   |    16 |    16 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |    8.8 |     8 |     9 |   0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |    3.2 |     3 |     4 |   0.45 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |    2.8 |     2 |     3 |   0.45 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                    | cell_model        |   n |   match |   rate_% |
|:-----------------------------|:---------------------------------|:------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |       5 |      100 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 |       1 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow                    | cell_model        |   n |   mean |   min |   max |    std |
|:-----------------------------|:---------------------------------|:------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 | 3148.8 |  2443 |  3939 | 644.59 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 | 2393.2 |  1958 |  3410 | 594.51 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 | 1883.8 |  1435 |  2375 | 392.48 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 | 1674   |  1674 |  1674 | nan    |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 |  718.6 |   661 |   739 |  32.53 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 |  349.8 |   308 |   371 |  28.24 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 |  326   |   297 |   366 |  32.76 |

### total_tokens

| kata                         | cell_workflow                    | cell_model        |   n |        mean |      min |      max |              std |
|:-----------------------------|:---------------------------------|:------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 | 4.98975e+07 | 37985796 | 57642271 |      7.38067e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 | 3.4057e+07  | 26459386 | 47009694 |      7.87302e+06 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 | 1.3833e+07  | 10251676 | 18310499 |      3.09284e+06 |
| claim-office-example-mapping | v6.2.1-phase-continuation-cursor | opus-4-8-requesty |   1 | 3.90831e+06 |  3908314 |  3908314 |    nan           |
| game-of-life-example-mapping | v6.2-with-why-cleaned            | opus-4-8-requesty |   5 | 4.09249e+06 |  3434019 |  4609405 | 519750           |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc         | opus-4-8-requesty |   5 | 1.95775e+06 |  1624297 |  2453524 | 346811           |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi         | opus-4-8-requesty |   5 | 1.0667e+06  |   950699 |  1231119 | 111680           |

### cost_usd

| kata                         | cell_workflow            | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |  32.89 | 25.56 | 37.46 |  4.52 |
| claim-office-example-mapping | v6.2-with-why-cleaned-oc | opus-4-8-requesty |   5 |  22.3  | 17.61 | 29.77 |  4.64 |
| claim-office-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-requesty |   5 |  14.43 | 11.04 | 18.67 |  2.98 |
| game-of-life-example-mapping | v6.2-with-why-cleaned    | opus-4-8-requesty |   5 |   3.45 |  3.07 |  3.77 |  0.34 |
| game-of-life-example-mapping | v6.2-with-why-cleaned-oc | opus-4-8-requesty |   5 |   1.99 |  1.67 |  2.32 |  0.3  |
| game-of-life-example-mapping | v6.2-with-why-cleaned-pi | opus-4-8-requesty |   5 |   1.78 |  1.57 |  2    |  0.16 |
