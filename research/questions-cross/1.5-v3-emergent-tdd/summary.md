# RQ-v3-emergent-tdd — Aggregation

_Under a bare 'use TDD' instruction that prescribes no phase markers (inline-tdd-v1), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated?_

Generated: 2026-10-12T08:37:44Z

Cells declared: 10 · matched runs: 49 · min_replicates: 3

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking | 3 | 3 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking | 3 | 3 | ✅ |

## Outcome pivots (per cell)

### cycle_count

| kata                         | cell_workflow             | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------|:-----------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 |   3.67 | 1.37 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 |   5.17 | 2.32 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 |   4.2  | 1.48 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 |   3.6  | 2.07 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |  10 |      0 |   1.5  | 0.97 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |   5 |      0 |   3.8  | 1.3  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 |   3    | 1    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 |   2.33 | 0.58 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 |   4.67 | 1.53 |

### refactorings_applied

| kata                         | cell_workflow             | cell_model             |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------|:-----------------------|----:|-------:|-------:|-----:|
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 |   0.33 | 0.82 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 |   2    | 0.89 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 |   0.4  | 0.55 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 |   1    | 1    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |  10 |      0 |   0.1  | 0.32 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |   5 |      0 |   1.8  | 0.45 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 |   0    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 |   0    | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 |   0    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 |   1    | 1.73 |

### tests_passing

| kata                         | cell_workflow             | cell_model             |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------|:-----------------------|----:|----:|-------:|---------:|
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |   3 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |   3 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |   3 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |   3 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow             | cell_model             |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------|:-----------------------|----:|-------:|-------:|-------:|
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 |   1    |   0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 |   1    |   0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 |   1    |   0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 |   1    |   0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |  10 |      0 |   1    |   0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |   5 |      0 |   1    |   0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   0 |      3 | nan    | nan    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 |   0.96 |   0.08 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   0 |      3 | nan    | nan    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 |   0.87 |   0.12 |

### duration_seconds

| kata                         | cell_workflow             | cell_model             |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------|:-----------------------|----:|-------:|-------:|------:|
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 | 166.5  | 25.67 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 | 329.5  | 65.09 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 | 139.6  | 16.27 |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 | 229    | 80.74 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |  10 |      0 |  75.1  | 21    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |   5 |      0 | 312.4  | 53.36 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 |  51.67 |  2.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 | 329.67 | 75.06 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 |  55.33 | 10.69 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 | 294.33 | 89.63 |

### total_tokens

| kata                         | cell_workflow             | cell_model             |   n |   null |             mean |               sd |
|:-----------------------------|:--------------------------|:-----------------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 |      2.08094e+06 | 361627           |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking     |   6 |      0 |      4.4615e+06  | 834832           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 | 134408           |  30455.6         |
| claim-office-example-mapping | baseline-inline-tdd-v1-pi | gpt-5-6-sol            |   5 |      0 | 287901           | 158796           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |  10 |      0 | 799074           | 187141           |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking   |   5 |      0 |      3.28141e+06 | 545757           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 | 468258           |  38466.6         |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | sonnet-4-6-no-thinking |   3 |      0 |      2.90658e+06 | 913197           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 |      1.21158e+06 | 169680           |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | haiku-4-5-no-thinking  |   3 |      0 |      7.61311e+06 |      3.09365e+06 |
