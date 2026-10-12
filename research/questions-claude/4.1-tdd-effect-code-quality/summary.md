# RQ-tdd-quality — Aggregation

_How does the workflow structure (from oneshot through iterative to strict TDD with subagents) affect code quality, and does TDD strictness make a difference?_

Generated: 2026-10-12T16:44:03Z

Cells declared: 16 · matched runs: 103 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | baseline-oneshot-v1-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-prose | baseline-oneshot-v1-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-prose | baseline-iterative-v1-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-prose | baseline-iterative-v1-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 6 | 6 | ✅ |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking | 7 | 7 | ✅ |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 | 155    |  8.06 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 | 835.4  | 69.19 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 | 157.8  |  8.72 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 | 851    | 46.18 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 | 165.6  | 13.88 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 | 992.4  | 50.71 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 156.6  | 18.06 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 621.6  | 65.58 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 154    | 11.81 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 | 692.67 | 78.8  |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 | 153.7  | 18.79 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 861.29 | 74.51 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 | 142    | 14.05 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 | 813.8  | 81.4  |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 145.8  |  6.72 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 780.2  | 75.34 |

### smell_total

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |   4.8  | 1.23 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |  11.6  | 7.57 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |   4.1  | 1.29 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |  15.8  | 3.7  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |   6    | 1.41 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |  16.8  | 6.22 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   2.4  | 0.55 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  13.2  | 7.53 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   4.8  | 0.45 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   6.83 | 7.55 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |   2.4  | 0.52 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   1.29 | 1.5  |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   3    | 1    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   4    | 4.69 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   2.4  | 0.89 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   6.2  | 5.45 |

### longest_function

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |  31.7  |  3.3  |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |  40.4  |  7.23 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |  32.1  |  4.61 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |  41.4  |  5.32 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |  32.5  |  5.84 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |  51.6  | 17.16 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  16.4  |  5.18 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  40.8  | 27.12 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  20.8  |  4.44 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  32.67 | 10.19 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |  14.2  |  6.25 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |  18.14 |  5.11 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |  17.6  |  6.27 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |  28.4  |  1.52 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  17.6  |  6.47 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  35.8  | 11.52 |

### production_loc

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |  33.6  |  1.78 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 | 269.4  | 31.15 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |  32.5  |  2.8  |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 | 268.6  | 10.5  |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |  31.9  |  3.48 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 | 317.4  | 25.09 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  32    |  4.3  |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 156.8  | 37.96 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  26.6  |  2.88 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 | 167.17 | 27.92 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |  29.2  |  5.53 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 191.14 | 20.32 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |  31.2  |  3.56 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 | 245.6  | 33.49 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  31    |  4.85 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 | 238.8  | 26.86 |

### mccabe_max

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |  12.8  | 1.81 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |   8.4  | 1.14 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |  11.6  | 1.51 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |   8.4  | 2.61 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |  13.7  | 1.57 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |  15.4  | 5.08 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   5    | 1.41 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  16    | 8.97 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  10.2  | 2.28 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  10.17 | 2.64 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |   5.2  | 1.69 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   5.71 | 2.36 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   7.4  | 2.07 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   6.6  | 1.95 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   6.8  | 2.39 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   8    | 2.92 |

### cognitive_max

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |    sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|------:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |  18.8  |  3.58 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |  12.2  |  3.9  |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |  16.2  |  3.58 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |  11.4  |  4.77 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |  21.8  |  3.61 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |  19.8  |  5.85 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   6.4  |  2.51 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  26.8  | 24.07 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  17.6  |  3.44 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  14.83 |  4.17 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |   6.5  |  3.24 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   5.71 |  2.87 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |  10.6  |  4.93 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   7.4  |  2.3  |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   9    |  4.47 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  11    |  4.64 |

### mutation_score

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |   0.95 |   0.01 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |   0.86 |   0.08 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |   0.95 |   0.01 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |   0.87 |   0.04 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |   0.95 |   0.01 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |   0.78 |   0.02 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   0 |      5 | nan    | nan    |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   0 |      6 | nan    | nan    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   0 |     10 | nan    | nan    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   0 |      7 | nan    | nan    |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   0 |      5 | nan    | nan    |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   0 |      5 | nan    | nan    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   0 |      5 | nan    | nan    |

### tests_passing

| kata                         | cell_workflow                           | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|----:|-------:|---------:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |   6 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |   7 |      0 |      100 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |   5 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |   1    | 0    |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |   0.28 | 0.06 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |   1    | 0    |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |   0.28 | 0.06 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   0.96 | 0.09 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   1    | 0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   1    | 0    |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   0.97 | 0.06 |

### verification_passed

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |   15   | 0    |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |    4.2 | 0.84 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |   15   | 0    |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |    4.2 | 0.84 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |   15   | 0    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |   15   | 0    |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |   14.4 | 1.34 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |   15   | 0    |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |   15   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |   15   | 0    |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |   15   | 0    |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   15   | 0    |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |   14.6 | 0.89 |

### verification_total

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |     15 |    0 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |     15 |    0 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |     15 |    0 |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |     15 |    0 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |     15 |    0 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |     15 |    0 |

### duration_seconds

| kata                         | cell_workflow                           | cell_model                   |   n |   null |   mean |     sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-------:|-------:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 |   87.7 |  21.92 |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |  231   |  57.35 |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 |   83.3 |  13.42 |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |  244.2 |  42.39 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 |   75.1 |  21    |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |  312.4 |  53.36 |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |  837.6 | 187    |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 | 3228.8 | 919.93 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  292.6 |  53.33 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |  641   | 122.02 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |  507.9 | 147.13 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 | 1569   | 519.28 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |  142.8 |  20.66 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |  307.8 |  35.1  |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  115.8 |  27.71 |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |  276.4 |  53.17 |

### total_tokens

| kata                         | cell_workflow                           | cell_model                   |   n |   null |             mean |               sd |
|:-----------------------------|:----------------------------------------|:-----------------------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |  10 |      0 | 993521           | 223585           |
| claim-office-prose           | baseline-oneshot-v1-cc                  | opus-4-7-portkey-no-thinking |   5 |      0 |      2.10814e+06 | 736133           |
| game-of-life-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |  10 |      0 | 966999           | 175027           |
| claim-office-prose           | baseline-iterative-v1-cc                | opus-4-7-portkey-no-thinking |   5 |      0 |      2.11557e+06 | 444735           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |  10 |      0 | 799074           | 187141           |
| claim-office-example-mapping | baseline-inline-tdd-v1-cc               | opus-4-7-portkey-no-thinking |   5 |      0 |      3.28141e+06 | 545757           |
| game-of-life-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |      1.01462e+07 |      2.09991e+06 |
| claim-office-example-mapping | exact-subagents-v2-testlist-fix-cc      | opus-4-7-portkey-no-thinking |   5 |      0 |      3.48702e+07 |      6.07042e+06 |
| game-of-life-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   5 |      0 |      8.40104e+06 |      3.43516e+06 |
| claim-office-example-mapping | exact-single-context-v2-testlist-fix-cc | opus-4-7-portkey-no-thinking |   6 |      0 |      1.87267e+07 |      5.35498e+06 |
| game-of-life-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |  10 |      0 |      8.14625e+06 |      1.85681e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc         | opus-4-7-portkey-no-thinking |   7 |      0 |      3.78763e+07 |      1.34521e+07 |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |      1.47425e+06 | 202901           |
| claim-office-example-mapping | baseline-end-refactor-only-v1-agent-cc  | opus-4-7-portkey-no-thinking |   5 |      0 |      3.55263e+06 | 808118           |
| game-of-life-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |      1.3226e+06  | 171935           |
| claim-office-example-mapping | baseline-end-refactor-only-v1-native-cc | opus-4-7-portkey-no-thinking |   5 |      0 |      3.44636e+06 |      1.09186e+06 |
