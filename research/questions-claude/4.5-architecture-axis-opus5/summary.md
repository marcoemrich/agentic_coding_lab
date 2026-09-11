# RQ-architecture-axis-opus5 — Aggregation

_Does the TDD architecture axis (inline-tdd-v1 structureless / single-context-v2 single context / hybrid-v2 hybrid / hybrid-v6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer?_

Generated: 2026-09-11T07:48:33Z

Cells declared: 16 · matched runs: 111 · min_replicates: 5

## Zell-Coverage

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

## Outcome-Pivots (pro Zelle)

### cc_avg_loc_per_function

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |  13.07 |  9.15 | 16.57 |  2.95 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   8.9  |  7.44 | 11.54 |  1.65 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |   5.75 |  3.89 |  8.07 |  1.56 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |   3.81 |  2.64 |  5    |  0.64 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   3.67 |  3.17 |  4.52 |  0.52 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   3.19 |  2.91 |  3.48 |  0.23 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |  10.02 |  7.85 | 14    |  2.25 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   5.89 |  4.67 |  6.62 |  0.78 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |  16.52 |  9.67 | 22    |  4.55 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   6.48 |  4.25 |  9.25 |  2.16 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   6.56 |  1.83 | 11    |  2.67 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   4.23 |  2.71 |  5.33 |  1.19 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   3.62 |  2.3  |  5.2  |  1.27 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   3.46 |  2.33 |  5.09 |  1    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   9.58 |  7.75 | 12.5  |  1.77 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   4.12 |  3    |  5.78 |  1.12 |

### cc_longest_function

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |  51.6  |    34 |    72 | 17.16 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |  24.33 |    19 |    27 |  2.8  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |  18.14 |    11 |    25 |  5.11 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |  16.22 |     8 |    29 |  5.78 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |  12    |     9 |    17 |  3    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |  13.83 |    10 |    18 |  3.19 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |  32.67 |    20 |    50 | 10.19 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |  18.6  |     8 |    24 |  6.69 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |  32.5  |    24 |    41 |  5.84 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |  14.5  |     9 |    22 |  5.01 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |  14.2  |     2 |    25 |  6.25 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |  10.17 |     6 |    15 |  3.31 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   8.4  |     6 |    13 |  2.88 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   7.5  |     4 |     9 |  1.87 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  20.8  |    13 |    24 |  4.44 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   8    |     7 |    10 |  1.41 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |  19.8  |    12 |    28 |  5.85 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   5.33 |     4 |     9 |  1.86 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |   5.71 |     3 |    11 |  2.87 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |   2.78 |     1 |     7 |  1.35 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   3.2  |     2 |     4 |  1.1  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   2    |     1 |     3 |  1.1  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |  14.83 |     8 |    19 |  4.17 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   2.8  |     1 |     5 |  1.48 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |  21.8  |    17 |    28 |  3.61 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   7.17 |     5 |    10 |  2.04 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   6.5  |     2 |    12 |  3.24 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   1.83 |     1 |     3 |  0.75 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   2.2  |     1 |     3 |  0.84 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   1.17 |     1 |     2 |  0.41 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  17.6  |    12 |    21 |  3.44 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   1.8  |     1 |     4 |  1.3  |

### cognitive_avg

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |   5.77 |  4.08 |  6.7  |  1.02 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   2.55 |  2.2  |  3.67 |  0.58 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |   2.32 |  1.62 |  3.36 |  0.63 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |   1.3  |  1    |  2    |  0.29 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   1.35 |  1.23 |  1.69 |  0.19 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   1.15 |  1    |  1.36 |  0.17 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |   4.62 |  3.3  |  6.83 |  1.51 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   1.65 |  1    |  2.18 |  0.43 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |  21.8  | 17    | 28    |  3.61 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   5.33 |  3.33 |  8    |  1.62 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   5.17 |  2    | 12    |  3.18 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   1.58 |  1    |  2    |  0.49 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   1.9  |  1    |  2.5  |  0.65 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   1.17 |  1    |  2    |  0.41 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  15.4  |  9.5  | 21    |  5.14 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   1.6  |  1    |  3    |  0.89 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |  15.4  |     8 |    22 |  5.08 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   5.33 |     4 |     7 |  1.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |   5.71 |     4 |    10 |  2.36 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |   3.39 |     3 |     6 |  0.78 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   3.4  |     3 |     4 |  0.55 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   2.83 |     2 |     4 |  0.75 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |  10.17 |     7 |    14 |  2.64 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   3.4  |     2 |     4 |  0.89 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |  13.7  |    11 |    15 |  1.57 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   5.67 |     4 |     8 |  1.63 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   5.2  |     3 |     8 |  1.69 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   3.17 |     3 |     4 |  0.41 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   3.2  |     2 |     4 |  0.84 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   2.5  |     2 |     3 |  0.55 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  10.2  |     7 |    13 |  2.28 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   2.8  |     2 |     4 |  0.84 |

### mccabe_avg

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |   3.33 |  2.78 |  4.06 |  0.54 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   2.13 |  1.81 |  2.85 |  0.38 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |   1.86 |  1.4  |  2.45 |  0.35 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |   1.38 |  1.16 |  1.56 |  0.11 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   1.47 |  1.31 |  1.82 |  0.2  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   1.29 |  1.23 |  1.35 |  0.05 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |   3.26 |  2.6  |  4.22 |  0.62 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   1.58 |  1.25 |  1.88 |  0.25 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |   6.55 |  3.5  |  8    |  2.01 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   2.59 |  1.71 |  3.75 |  0.88 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   2.6  |  1.2  |  4.5  |  0.97 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   1.31 |  1.18 |  1.6  |  0.15 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   1.56 |  1.08 |  2    |  0.38 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   1.19 |  1.06 |  1.37 |  0.11 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   4.2  |  3.5  |  6    |  1.04 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   1.27 |  1.06 |  1.56 |  0.2  |

### smell_total

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |  16.8  |     6 |    21 |  6.22 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |   1.29 |     0 |     4 |  1.5  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |   6.83 |     1 |    17 |  7.55 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   0.2  |     0 |     1 |  0.45 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |   6    |     4 |     8 |  1.41 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   2.4  |     2 |     3 |  0.52 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   1    |     0 |     3 |  1.55 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   0    |     0 |     0 |  0    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   4.8  |     4 |     5 |  0.45 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   0    |     0 |     0 |  0    |

### code_mass

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 | 992.4  |   933 |  1058 |  50.71 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 | 758.17 |   674 |   881 |  95.71 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 | 861.29 |   759 |   982 |  74.51 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 | 859.5  |   725 |  1114 |  99.25 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 | 796    |   742 |   863 |  43.5  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 | 997    |   896 |  1083 |  67.06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 | 692.67 |   575 |   796 |  78.8  |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 | 569    |   177 |   770 | 227.85 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 | 165.6  |   151 |   194 |  13.88 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 | 196.83 |   166 |   216 |  18.64 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 | 153.7  |   131 |   191 |  18.79 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 | 179    |   142 |   211 |  23.97 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 | 169.6  |   156 |   185 |  12.3  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 | 195.83 |   171 |   222 |  21.24 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 | 154    |   142 |   172 |  11.81 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 | 176.2  |   128 |   198 |  28.1  |

### verification_pct

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |   0.96 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   0.94 |  0.93 |     1 |  0.03 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   0.79 |  0    |     1 |  0.44 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   1    |  1    |     1 |  0    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                           | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |       6 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      18 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |       6 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |       5 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                           | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:----------------------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |       6 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |       7 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      18 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |       6 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |       6 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |       5 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |       6 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |       5 |      100 |

### cycle_count

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |   3.8  |     3 |     6 |  1.3  |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   5.17 |     2 |     8 |  2.32 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |  28    |     5 |    43 | 12.96 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |  45.89 |    38 |    52 |  4.93 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |  25.8  |    18 |    32 |  6.87 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |  45.83 |    36 |    57 |  7.08 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |   5.5  |     2 |    19 |  6.66 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |  27    |     2 |    48 | 20.94 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |   1.5  |     1 |     4 |  0.97 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   3.67 |     2 |     6 |  1.37 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   8.7  |     7 |     9 |  0.67 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |  10.33 |     9 |    13 |  1.37 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   9.2  |     9 |    10 |  0.45 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |  10.33 |    10 |    11 |  0.52 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   7.6  |     6 |     9 |  1.52 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   7.2  |     5 |    10 |  2.59 |

### refactorings_applied

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |   1.8  |     1 |     2 |  0.45 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   2    |     1 |     3 |  0.89 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |  11    |     4 |    17 |  5.1  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |  21.28 |     9 |    46 |  7.55 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |  22.6  |    13 |    32 |  8.82 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |  44.5  |    36 |    57 |  8.02 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |   2.17 |     1 |     3 |  0.75 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |  12.2  |     2 |    30 | 12.3  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |   0.1  |     0 |     1 |  0.32 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   0.33 |     0 |     2 |  0.82 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   4.1  |     2 |     7 |  1.97 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |   4.33 |     4 |     5 |  0.52 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |   9.2  |     9 |    10 |  0.45 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |   8.83 |     2 |    11 |  3.37 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   4.8  |     2 |     9 |  3.42 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |   4.4  |     3 |     5 |  0.89 |

### predictions_correct_rate (pooled %)

| kata                         | cell_workflow                           | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------------------------|:---------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |       292 |     303 |     96.4 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      1608 |    1614 |     99.6 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |       226 |     251 |     90   |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |       544 |     550 |     98.9 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |        39 |      39 |    100   |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |       269 |     270 |     99.6 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |       172 |     173 |     99.4 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |       124 |     124 |    100   |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |        91 |      92 |     98.9 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |       124 |     126 |     98.4 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |        78 |      78 |    100   |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |        72 |      72 |    100   |

### duration_seconds

| kata                         | cell_workflow                           | cell_model           |   n |    mean |   min |   max |     std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |  312.4  |   257 |   381 |   53.36 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |  329.5  |   258 |   453 |   65.09 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 | 1569    |   556 |  2071 |  519.28 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 | 2650.06 |  1946 |  3685 |  464.89 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 | 4553.6  |  2730 |  5944 | 1521.9  |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 | 5514.33 |  4856 |  6450 |  716.16 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |  641    |   525 |   872 |  122.02 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 | 1388.8  |   252 |  2246 |  822.9  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |   75.1  |    59 |   126 |   21    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |  166.5  |   143 |   205 |   25.67 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |  507.9  |   292 |   727 |  147.13 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |  580.17 |   378 |   722 |  127.5  |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 | 1323.8  |  1103 |  1738 |  260.29 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 | 1145.33 |   602 |  1408 |  294.1  |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |  292.6  |   254 |   384 |   53.33 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |  430.6  |   355 |   536 |   68.68 |

### total_tokens

| kata                         | cell_workflow                           | cell_model           |   n |             mean |       min |       max |              std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-----------------:|----------:|----------:|-----------------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |      3.28141e+06 |   2734813 |   4185323 | 545757           |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      4.4615e+06  |   3194079 |   5719313 | 834832           |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |      3.45442e+07 |   9306264 |  44845398 |      1.19731e+07 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |  18 |      8.36653e+07 |  51719658 | 123086078 |      1.64834e+07 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      5.96504e+07 |  38510335 |  80833724 |      1.87096e+07 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      1.3611e+08  | 121120560 | 176135411 |      2.03967e+07 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |      1.87267e+07 |  14120743 |  28366021 |      5.35498e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      8.2553e+07  |   3841157 | 157449550 |      6.59236e+07 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 | 799074           |    595232 |   1263063 | 187141           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |      2.08094e+06 |   1777833 |   2774928 | 361627           |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |      6.94053e+06 |   5264335 |   9796559 |      1.36348e+06 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   6 |      7.39704e+06 |   4407948 |  10565106 |      2.08784e+06 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-4-7-no-thinking |   5 |      1.15181e+07 |   9199813 |  12857239 |      1.50078e+06 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |      1.50243e+07 |   8780237 |  19927182 |      3.69196e+06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |      8.40104e+06 |   5208968 |  12953864 |      3.43516e+06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-5-no-thinking   |   5 |      1.18026e+07 |   8095497 |  14837536 |      2.65544e+06 |

### cost_usd

| kata                         | cell_workflow                           | cell_model           |   n |   mean |   min |    max |   std |
|:-----------------------------|:----------------------------------------|:---------------------|----:|-------:|------:|-------:|------:|
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |   5 |   2.92 |  2.41 |   3.68 |  0.52 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   3.89 |  2.73 |   4.43 |  0.6  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |   7 |  23.33 |  7.82 |  30.31 |  7.52 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-5-no-thinking   |   5 |  42.68 | 31.43 |  47.31 |  6.48 |
| claim-office-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |  78.98 | 70.7  | 101.67 | 11.54 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   6 |  12.72 | 10.18 |  19.5  |  3.59 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-no-thinking |  10 |   0.81 |  0.58 |   1.48 |  0.26 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-5-no-thinking   |   6 |   1.72 |  1.52 |   2.11 |  0.22 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-no-thinking |  10 |   5.17 |  4.03 |   7.14 |  0.94 |
| game-of-life-example-mapping | exact-hybrid-v6-lab-split-cc            | opus-5-no-thinking   |   6 |  10.82 |  6.33 |  14.22 |  2.75 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-no-thinking |   5 |   6.48 |  4.69 |   8.96 |  1.94 |
