# RQ-architecture-axis-opus5 — Aggregation

_Does the TDD architecture axis (inline-tdd-v1 structureless / single-context-v2 single context / hybrid-v2 hybrid / hybrid-v6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer?_

Generated: 2026-10-12T10:46:31Z

Cells declared: 16 · matched runs: 111 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 18 | 18 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking | 7 | 7 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-5-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### avg_loc_per_function

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   8.9  | 1.65 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |  13.07 | 2.95 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   6.48 | 2.16 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |  16.52 | 4.55 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   5.89 | 0.78 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |  10.03 | 2.25 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   4.12 | 1.12 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |   9.58 | 1.77 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |   3.81 | 0.64 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |   5.75 | 1.56 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |   4.23 | 1.19 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |   6.56 | 2.67 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   3.19 | 0.23 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   3.67 | 0.52 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   3.46 | 1    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   3.62 | 1.27 |

### longest_function

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |  24.33 |  2.8  |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |  51.6  | 17.16 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |  14.5  |  5.01 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |  32.5  |  5.84 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |  18.6  |  6.69 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |  32.67 | 10.19 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   8    |  1.41 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  20.8  |  4.44 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |  16.22 |  5.78 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |  18.14 |  5.11 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |  10.17 |  3.31 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |  14.2  |  6.25 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |  13.83 |  3.19 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |  12    |  3    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   7.5  |  1.87 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   8.4  |  2.88 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   5.33 | 1.86 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |  19.8  | 5.85 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   7.17 | 2.04 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |  21.8  | 3.61 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   2.8  | 1.48 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |  14.83 | 4.17 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   1.8  | 1.3  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  17.6  | 3.44 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |   2.78 | 1.35 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |   5.71 | 2.87 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |   1.83 | 0.75 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |   6.5  | 3.24 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   2    | 1.1  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   3.2  | 1.1  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   1.17 | 0.41 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   2.2  | 0.84 |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   2.55 | 0.58 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |   5.77 | 1.02 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   5.33 | 1.62 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |  21.8  | 3.61 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   1.65 | 0.43 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |   4.62 | 1.51 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   1.6  | 0.89 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  15.4  | 5.14 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |   1.3  | 0.29 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |   2.32 | 0.63 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |   1.58 | 0.49 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |   5.17 | 3.18 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   1.15 | 0.17 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   1.35 | 0.19 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   1.17 | 0.41 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   1.9  | 0.65 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   5.33 | 1.03 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |  15.4  | 5.08 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   5.67 | 1.63 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |  13.7  | 1.57 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   3.4  | 0.89 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |  10.17 | 2.64 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   2.8  | 0.84 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  10.2  | 2.28 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |   3.39 | 0.78 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |   5.71 | 2.36 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |   3.17 | 0.41 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |   5.2  | 1.69 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   2.83 | 0.75 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   3.4  | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   2.5  | 0.55 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   3.2  | 0.84 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   2.13 | 0.38 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |   3.33 | 0.54 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   2.59 | 0.88 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |   6.55 | 2.01 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   1.58 | 0.25 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |   3.26 | 0.62 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   1.27 | 0.2  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |   4.2  | 1.04 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |   1.39 | 0.11 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |   1.86 | 0.35 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |   1.31 | 0.15 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |   2.6  | 0.97 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   1.29 | 0.05 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   1.47 | 0.2  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   1.19 | 0.11 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   1.56 | 0.38 |

### smell_total

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   0    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |  16.8  | 6.22 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   0    | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |   6    | 1.41 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   0.2  | 0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |   6.83 | 7.55 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |   4.8  | 0.45 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |   1.29 | 1.5  |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |   1    | 1.55 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |   2.4  | 0.52 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   0    | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   0    | 0    |

### code_mass

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 | 758.17 |  95.71 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 | 992.4  |  50.71 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 | 196.83 |  18.64 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 | 165.6  |  13.88 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 | 569    | 227.85 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 | 692.67 |  78.8  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 | 176.2  |  28.1  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 | 154    |  11.81 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 | 859.5  |  99.25 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 | 861.29 |  74.51 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 | 179    |  23.97 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 | 153.7  |  18.79 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 | 997    |  67.06 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 | 796    |  43.5  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 | 195.83 |  21.24 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 | 169.6  |  12.3  |

### verification_pct

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   0.79 | 0.44 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |   0.96 | 0.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   0.94 | 0.03 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |   1    | 0    |

### tests_passing

| kata                         | cell_workflow                           | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:---------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |  18 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |   7 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   6 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   5 |      0 |      100 |

### predictions_correct_rate

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |   sd |    k |    t |   rate_% |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|-----:|-----:|-----:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   0 |      6 |    nan |  nan |  nan |  nan |    nan   |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   0 |      5 |    nan |  nan |  nan |  nan |    nan   |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   0 |      6 |    nan |  nan |  nan |  nan |    nan   |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   0 |     10 |    nan |  nan |  nan |  nan |    nan   |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |    nan |  nan |  269 |  270 |     99.6 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |    nan |  nan |   39 |   39 |    100   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |    nan |  nan |   72 |   72 |    100   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |    nan |  nan |   78 |   78 |    100   |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |    nan |  nan | 1608 | 1614 |     99.6 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |    nan |  nan |  292 |  303 |     96.4 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |    nan |  nan |  124 |  124 |    100   |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |    nan |  nan |  172 |  173 |     99.4 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |    nan |  nan |  544 |  550 |     98.9 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |    nan |  nan |  226 |  251 |     90   |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |    nan |  nan |  124 |  126 |     98.4 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |    nan |  nan |   91 |   92 |     98.9 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model           |   n |   null |    mean |      sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|--------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |  329.5  |   65.09 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |  312.4  |   53.36 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |  166.5  |   25.67 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |   75.1  |   21    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 | 1388.8  |  822.9  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |  641    |  122.02 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |  430.6  |   68.68 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |  292.6  |   53.33 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 | 2650.06 |  464.89 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 | 1569    |  519.28 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |  580.17 |  127.5  |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |  507.9  |  147.13 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 | 5514.33 |  716.16 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 | 4553.6  | 1521.9  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 | 1145.33 |  294.1  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 | 1323.8  |  260.29 |

### total_tokens

| kata                         | cell_workflow                           | cell_model           |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-----------------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |      4.4615e+06  | 834832           |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |      3.28141e+06 | 545757           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |      2.08094e+06 | 361627           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 | 799074           | 187141           |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |      8.2553e+07  |      6.59236e+07 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |      1.87267e+07 |      5.35498e+06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |      1.18026e+07 |      2.65544e+06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |      8.40104e+06 |      3.43516e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |      9.42234e+07 |      1.76387e+07 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |      3.78763e+07 |      1.34521e+07 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |      9.23738e+06 |      2.2932e+06  |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |      8.14625e+06 |      1.85681e+06 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |      1.61604e+08 |      2.27384e+07 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |      7.565e+07   |      2.41815e+07 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |      1.96883e+07 |      4.62056e+06 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |      1.71973e+07 |      2.23497e+06 |

### cost_usd

| kata                         | cell_workflow                           | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   3.89 |  0.6  |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      0 |   2.92 |  0.52 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      0 |   1.72 |  0.22 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      0 |   0.81 |  0.26 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |  47.56 | 36.83 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      0 |  12.72 |  3.59 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      0 |   8.24 |  1.79 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      0 |   6.48 |  1.94 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      0 |  61.94 | 10.74 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      0 |  29.28 |  9.93 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      0 |   7.51 |  1.35 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      0 |   6.81 |  1.55 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 | 109.59 | 15.26 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |  53.77 | 16.54 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      0 |  16.5  |  4.16 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      0 |  14.1  |  1.37 |
