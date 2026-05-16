# RQ-4 — Aggregation

_Wie wirkt sich die Workflow-Struktur (von oneshot ueber iterativ bis zu striktem TDD mit Subagents) auf die Code-Qualitaet aus, und macht die TDD-Striktheit einen Unterschied?_

Generated: 2026-05-16T11:19:08Z

Cells declared: 12 · matched runs: 100 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-prose | v1-oneshot | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-prose | v2-iterative | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-prose | v2-iterative | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v6-hybrid | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |  992.4 |   933 |  1058 |  50.71 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  625.9 |   167 |   932 | 289.39 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  761.6 |   238 |   939 | 208.57 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  883.2 |   839 |   923 |  36.53 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |  835.4 |   757 |   930 |  69.19 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |  851   |   811 |   927 |  46.18 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |  165.6 |   151 |   194 |  13.88 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  166.6 |   146 |   201 |  17.65 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  152.6 |   136 |   173 |  13.85 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 |  15.14 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |  155   |   137 |   167 |   8.06 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |  157.8 |   145 |   172 |   8.72 |

### smell_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |   16.8 |     6 |    21 |  6.22 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    1.8 |     0 |    10 |  3.29 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     0 |    20 |  7.71 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |   11.6 |     0 |    21 |  7.57 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |   15.8 |    12 |    22 |  3.7  |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |    6   |     4 |     8 |  1.41 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    2.6 |     2 |     4 |  0.7  |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    4.1 |     2 |     7 |  1.79 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |    4.8 |     2 |     6 |  1.23 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |    4.1 |     2 |     6 |  1.29 |

### cc_longest_function

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |   51.6 |    34 |    72 | 17.16 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   25   |    11 |    76 | 19.7  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   31.4 |    18 |    66 | 15.22 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   21   |    12 |    29 |  7.18 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |   40.4 |    34 |    52 |  7.23 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |   41.4 |    36 |    47 |  5.32 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   32.5 |    24 |    41 |  5.84 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    8.1 |     2 |    15 |  4.04 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   17.4 |     2 |    32 |  9.25 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   31.7 |    28 |    38 |  3.3  |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   32.1 |    24 |    39 |  4.61 |

### cc_loc

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |  317.4 |   277 |   344 | 25.09 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |  167.6 |    39 |   275 | 75.13 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  173.3 |    62 |   246 | 51.34 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |  186.6 |   163 |   214 | 18.15 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |  269.4 |   247 |   315 | 31.15 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |  268.6 |   257 |   281 | 10.5  |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   31.9 |    27 |    37 |  3.48 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   31.1 |    25 |    47 |  6.74 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   29.8 |    24 |    36 |  3.74 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |   30   |    24 |    43 |  5.23 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   33.6 |    31 |    37 |  1.78 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   32.5 |    29 |    38 |  2.8  |

### mccabe_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |   15.4 |     8 |    22 |  5.08 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    7.9 |     4 |    14 |  4.15 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   10.2 |     4 |    29 |  7    |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    6.2 |     4 |    12 |  3.35 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |    8.4 |     7 |    10 |  1.14 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |    8.4 |     6 |    12 |  2.61 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   13.7 |    11 |    15 |  1.57 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.5 |     3 |    11 |  2.42 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |    8.9 |     6 |    12 |  2.08 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   12.8 |     9 |    15 |  1.81 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   11.6 |     9 |    14 |  1.51 |

### cognitive_max

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |   19.8 |    12 |    28 |  5.85 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   10.5 |     4 |    30 |  9.44 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.2 |     5 |    49 | 12.65 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |    6.6 |     3 |    14 |  4.28 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |   12.2 |     8 |    18 |  3.9  |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |   11.4 |     6 |    18 |  4.77 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   21.8 |    17 |    28 |  3.61 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |    4.4 |     2 |    17 |  4.48 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   14.5 |     9 |    24 |  4.84 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   18.8 |    10 |    23 |  3.58 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   16.2 |    10 |    20 |  3.58 |

### mutation_score

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |   0.78 |  0.75 |  0.8  |  0.02 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.93 |  0.83 |  0.98 |  0.04 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   0.88 |  0.84 |  0.96 |  0.04 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   0.93 |  0.87 |  0.99 |  0.04 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |   0.86 |  0.73 |  0.91 |  0.08 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |   0.87 |  0.81 |  0.89 |  0.04 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0.01 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.91 |  0.74 |  0.96 |  0.08 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   0.94 |  0.84 |  0.96 |  0.04 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   0.95 |  0.93 |  0.96 |  0.01 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   0.95 |  0.94 |  0.96 |  0.01 |

### tests_passing (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |   1    |   1   |  1    |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   0.67 |   0.2 |  1    |  0.36 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   0.87 |   0   |  1    |  0.32 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   1    |   1   |  1    |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |   0.28 |   0.2 |  0.33 |  0.06 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |   0.28 |   0.2 |  0.33 |  0.06 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   1    |   1   |  1    |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   1    |   1   |  1    |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   1    |   1   |  1    |  0    |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |   1    |   1   |  1    |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   1    |   1   |  1    |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   1    |   1   |  1    |  0    |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   10   |     3 |    15 |  5.33 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   13.1 |     0 |    15 |  4.77 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |   15   |    15 |    15 |  0    |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |    4.2 |     3 |     5 |  0.84 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |    4.2 |     3 |     5 |  0.84 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   15   |    15 |    15 |  0    |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   15   |    15 |    15 |  0    |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |     15 |    15 |    15 |     0 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |     15 |    15 |    15 |     0 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |      10 |      100 |

### tdd_cycles

_Spalte `tdd_cycles` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### refactorings

_Spalte `refactorings` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### prediction_accuracy

_Spalte `prediction_accuracy` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### tests_immediately_passing

_Spalte `tests_immediately_passing` nicht in CSV — wird nicht erhoben oder Tippfehler im Frontmatter._

### duration_seconds

| kata                         | workflow                | model                |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |  312.4  |   257 |   381 |  53.36 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 3692.7  |  1640 |  4822 | 942.11 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |  655.1  |   357 |   822 | 139.14 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 | 2116    |  1058 |  2883 | 716.26 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |  231    |   168 |   321 |  57.35 |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |  244.2  |   198 |   310 |  42.39 |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 |   75.1  |    59 |   126 |  21    |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 | 1162.9  |   604 |  3923 | 984.46 |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   9 |  379.56 |   220 |   508 | 100.79 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |  521.4  |   427 |   711 |  95.48 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 |   87.7  |    62 |   125 |  21.92 |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 |   83.3  |    65 |   113 |  13.42 |

### total_tokens

| kata                         | workflow                | model                |   n |             mean |      min |      max |              std |
|:-----------------------------|:------------------------|:---------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |   5 |      3.28141e+06 |  2734813 |  4185323 | 545757           |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      1.3655e+07  |  9411553 | 16548065 |      2.09204e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      1.41439e+07 |  7282501 | 23265439 |      5.31583e+06 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking |   5 |      3.3248e+07  | 21492140 | 39096785 |      7.41969e+06 |
| claim-office-prose           | v1-oneshot              | opus-4-7-no-thinking |   5 |      2.10814e+06 |  1459870 |  3279079 | 736133           |
| claim-office-prose           | v2-iterative            | opus-4-7-no-thinking |   5 |      2.11557e+06 |  1500227 |  2659631 | 444735           |
| game-of-life-example-mapping | v3-basic-tdd            | opus-4-7-no-thinking |  10 | 799074           |   595232 |  1263063 | 187141           |
| game-of-life-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking |  10 |      2.56189e+06 |  2023377 |  3201698 | 382603           |
| game-of-life-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |  10 |      8.14255e+06 |        0 | 12207170 |      3.79036e+06 |
| game-of-life-example-mapping | v6-hybrid               | opus-4-7-no-thinking |  10 |      6.62354e+06 |  4863281 |  8557921 |      1.31893e+06 |
| game-of-life-prose           | v1-oneshot              | opus-4-7-no-thinking |  10 | 993521           |   679521 |  1302769 | 223585           |
| game-of-life-prose           | v2-iterative            | opus-4-7-no-thinking |  10 | 966999           |   719553 |  1225127 | 175027           |
