# RQ-v3-emergent-tdd — Aggregation

_Under a bare 'use TDD' instruction that prescribes no phase markers (v3), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated?_

Generated: 2026-08-11T21:19:02Z

Cells declared: 10 · matched runs: 49 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v3-basic-tdd | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | haiku-4-5-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | haiku-4-5-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### cycle_count

| kata                         | cell_workflow   | cell_model             |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |   4.67 |     3 |     6 |  1.53 |
| claim-office-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |   5 |   3.8  |     3 |     6 |  1.3  |
| claim-office-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |   5.17 |     2 |     8 |  2.32 |
| claim-office-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |   3    |     2 |     4 |  1    |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |   3.6  |     2 |     7 |  2.07 |
| game-of-life-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |   2.33 |     2 |     3 |  0.58 |
| game-of-life-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |  10 |   1.5  |     1 |     4 |  0.97 |
| game-of-life-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |   3.67 |     2 |     6 |  1.37 |
| game-of-life-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |   1    |     1 |     1 |  0    |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |   4.2  |     2 |     6 |  1.48 |

### refactorings_applied

| kata                         | cell_workflow   | cell_model             |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |   1    |     0 |     3 |  1.73 |
| claim-office-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |   5 |   1.8  |     1 |     2 |  0.45 |
| claim-office-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |   2    |     1 |     3 |  0.89 |
| claim-office-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |   1    |     0 |     2 |  1    |
| game-of-life-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |  10 |   0.1  |     0 |     1 |  0.32 |
| game-of-life-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |   0.33 |     0 |     2 |  0.82 |
| game-of-life-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |   0.4  |     0 |     1 |  0.55 |

### tests_passing (rate %)

| kata                         | cell_workflow   | cell_model             |   n |   match |   rate_% |
|:-----------------------------|:----------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| claim-office-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |       6 |      100 |
| claim-office-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |  10 |      10 |      100 |
| game-of-life-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |       5 |      100 |

### verification_pct

| kata                         | cell_workflow   | cell_model             |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |   0.87 |  0.8  |     1 |  0.12 |
| claim-office-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |   0.96 |  0.87 |     1 |  0.08 |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |  10 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |   1    |  1    |     1 |  0    |

### completed_within_budget (rate %)

| kata                         | cell_workflow   | cell_model             |   n |   match |   rate_% |
|:-----------------------------|:----------------|:-----------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| claim-office-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |   5 |       5 |      100 |
| claim-office-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |       6 |      100 |
| claim-office-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |  10 |      10 |      100 |
| game-of-life-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |       6 |      100 |
| game-of-life-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |       3 |      100 |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 |       5 |      100 |

### duration_seconds

| kata                         | cell_workflow   | cell_model             |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------|:-----------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 | 294.33 |   191 |   351 | 89.63 |
| claim-office-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |   5 | 312.4  |   257 |   381 | 53.36 |
| claim-office-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 | 329.5  |   258 |   453 | 65.09 |
| claim-office-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 | 329.67 |   253 |   403 | 75.06 |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 | 229    |   154 |   334 | 80.74 |
| game-of-life-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |  55.33 |    43 |    62 | 10.69 |
| game-of-life-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |  10 |  75.1  |    59 |   126 | 21    |
| game-of-life-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 | 166.5  |   143 |   205 | 25.67 |
| game-of-life-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |  51.67 |    49 |    54 |  2.52 |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 | 139.6  |   112 |   154 | 16.27 |

### total_tokens

| kata                         | cell_workflow   | cell_model             |   n |             mean |     min |      max |              std |
|:-----------------------------|:----------------|:-----------------------|----:|-----------------:|--------:|---------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |      7.61311e+06 | 4177833 | 10179161 |      3.09365e+06 |
| claim-office-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |   5 |      3.28141e+06 | 2734813 |  4185323 | 545757           |
| claim-office-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |      4.4615e+06  | 3194079 |  5719313 | 834832           |
| claim-office-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 |      2.90658e+06 | 1998546 |  3824855 | 913197           |
| claim-office-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 | 287901           |  157812 |   496677 | 158796           |
| game-of-life-example-mapping | v3-basic-tdd    | haiku-4-5-no-thinking  |   3 |      1.21158e+06 | 1029777 |  1365744 | 169680           |
| game-of-life-example-mapping | v3-basic-tdd    | opus-4-7-no-thinking   |  10 | 799074           |  595232 |  1263063 | 187141           |
| game-of-life-example-mapping | v3-basic-tdd    | opus-5-no-thinking     |   6 |      2.08094e+06 | 1777833 |  2774928 | 361627           |
| game-of-life-example-mapping | v3-basic-tdd    | sonnet-4-6-no-thinking |   3 | 468258           |  445511 |   512671 |  38466.6         |
| game-of-life-example-mapping | v3-basic-tdd-pi | gpt-5-6-sol            |   5 | 134408           |   87615 |   167331 |  30455.6         |
