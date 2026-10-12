# RQ-stability — Aggregation

_How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count?_

Generated: 2026-10-12T08:37:41Z

Cells declared: 6 · matched runs: 59 · min_replicates: 10

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | baseline-oneshot-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-prose | baseline-iterative-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking | 9 | 9 | ⚠️ below min_replicates (9/10) |
| game-of-life-example-mapping | exact-hybrid-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome pivots (per cell)

### code_mass

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|------:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 | 155    |  8.06 |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 | 157.8  |  8.72 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 | 165.6  | 13.88 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 | 166.6  | 17.65 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 | 154.44 | 13.32 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 | 158.6  | 15.14 |

### smell_total

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |   4.8  | 1.23 |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |   4.1  | 1.29 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |   6    | 1.41 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |   2.6  | 0.7  |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |   4.33 | 1.73 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |   2.2  | 0.42 |

### longest_function

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |  31.7  | 3.3  |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |  32.1  | 4.61 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |  32.5  | 5.84 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |   8.1  | 4.04 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |  17.11 | 9.77 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |  13.1  | 5.97 |

### mccabe_max

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |   12.8 | 1.81 |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |   11.6 | 1.51 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |   13.7 | 1.57 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |    4.5 | 2.42 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |    9   | 2.18 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |    4.5 | 1.51 |

### cognitive_max

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |  18.8  | 3.58 |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |  16.2  | 3.58 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |  21.8  | 3.61 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |   4.4  | 4.48 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |  15.11 | 4.7  |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |   5.2  | 2.3  |

### mutation_score

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |   0.95 | 0.01 |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |   0.95 | 0.01 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |   0.95 | 0.01 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |   0.91 | 0.08 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |   0.94 | 0.04 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |   0.95 | 0    |

### predictions_correct_rate

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |   k |   t |   rate_% |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|----:|----:|---------:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |   0 |     10 |    nan |  nan | nan | nan |    nan   |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |   0 |     10 |    nan |  nan | nan | nan |    nan   |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |   0 |     10 |    nan |  nan | nan | nan |    nan   |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |    nan |  nan |  99 | 101 |     98   |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |    nan |  nan | 132 | 132 |    100   |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |    nan |  nan | 169 | 170 |     99.4 |

### refactorings_applied

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |   0    | 0    |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |   0    | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |   0.1  | 0.32 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |   5.9  | 2.02 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |   6.67 | 2.4  |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |   4    | 1.63 |

### cycle_count

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |   1    | 0    |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |   1    | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |   1.5  | 0.97 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |   7.8  | 0.92 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |   7.44 | 1.33 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |   8.3  | 0.82 |

### tests_passed_immediately

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |    1   | 0    |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |    1   | 0    |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |    0.5 | 0.97 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |    3.3 | 2.87 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |    1   | 1.73 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |    3.3 | 3.02 |

### tests_passing

| kata                         | cell_workflow              | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:---------------------------|:---------------------|----:|----:|-------:|---------:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |  10 |      0 |      100 |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |  10 |      0 |      100 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |  10 |      0 |      100 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |  10 |      0 |      100 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |   9 |      0 |      100 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |  10 |      0 |      100 |

### verification_pct

| kata                         | cell_workflow              | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-------:|-----:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |      1 |    0 |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |      1 |    0 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |      1 |    0 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |      1 |    0 |

### duration_seconds

| kata                         | cell_workflow              | cell_model           |   n |   null |    mean |     sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|--------:|-------:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 |   87.7  |  21.92 |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 |   83.3  |  13.42 |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 |   75.1  |  21    |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 | 1162.9  | 984.46 |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |  379.56 | 100.79 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |  521.4  |  95.48 |

### total_tokens

| kata                         | cell_workflow              | cell_model           |   n |   null |             mean |               sd |
|:-----------------------------|:---------------------------|:---------------------|----:|-------:|-----------------:|-----------------:|
| game-of-life-prose           | baseline-oneshot-v1-cc     | opus-4-7-no-thinking |  10 |      0 | 993521           | 223585           |
| game-of-life-prose           | baseline-iterative-v1-cc   | opus-4-7-no-thinking |  10 |      0 | 966999           | 175027           |
| game-of-life-example-mapping | baseline-inline-tdd-v1-cc  | opus-4-7-no-thinking |  10 |      0 | 799074           | 187141           |
| game-of-life-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking |  10 |      0 |      7.28733e+06 |      1.0652e+06  |
| game-of-life-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking |   9 |      0 |      9.04728e+06 |      2.63708e+06 |
| game-of-life-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking |  10 |      0 |      7.85506e+06 |      1.6018e+06  |
