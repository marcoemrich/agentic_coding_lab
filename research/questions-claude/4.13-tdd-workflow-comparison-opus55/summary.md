# RQ-tdd-workflow-comparison-opus55 — Aggregation

_How do seven TDD workflows compare on correctness, TDD discipline, code quality and cost? Three lines meet on one kata: the maintained EXACT Coding Predictive-TDD pair (with and without an isolated refactor subagent), the retired Opus hybrid pair, and three vendored third-party TDD skills — measured on claim-office-example-mapping × opus-5-5-no-thinking × Claude Code._

Generated: 2026-10-01T11:30:37Z

Cells declared: 7 · matched runs: 35 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | external-pocock-2026-09-04-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280 | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.96 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   0.96 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.96 |   0.8 |     1 |  0.09 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   1    |   1   |     1 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |

### tdd_discipline

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.71 |  0.69 |  0.73 |  0.02 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   0.7  |  0.69 |  0.71 |  0.01 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   0.63 |  0.61 |  0.64 |  0.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.62 |  0.58 |  0.65 |  0.03 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.85 |  0.75 |  0.93 |  0.06 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   0.82 |  0.71 |  0.92 |  0.07 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.84 |  0.78 |  0.89 |  0.04 |

### tdd_discipline_test_first

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.61 |  0.58 |  0.63 |  0.02 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   0.59 |  0.58 |  0.62 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   0.51 |  0.49 |  0.53 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.5  |  0.46 |  0.53 |  0.03 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.78 |  0.67 |  0.91 |  0.09 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   0.8  |  0.74 |  0.88 |  0.05 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.75 |  0.7  |  0.79 |  0.04 |

### tdd_discipline_step

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |   1   |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |   1   |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |   1   |     1 |  0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |   1   |     1 |  0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    0.9 |   0.5 |     1 |  0.22 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |   1   |     1 |  0    |

### tdd_discipline_closure

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.59 |  0.56 |  0.62 |  0.02 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   0.58 |  0.57 |  0.59 |  0.01 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   0.49 |  0.46 |  0.5  |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.48 |  0.43 |  0.52 |  0.04 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.78 |  0.63 |  0.88 |  0.09 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   0.8  |  0.74 |  0.88 |  0.07 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.8  |  0.68 |  0.9  |  0.09 |

### test_first_rate

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.61 |  0.58 |  0.63 |  0.02 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   0.59 |  0.58 |  0.62 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   0.51 |  0.49 |  0.53 |  0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.5  |  0.46 |  0.53 |  0.03 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.78 |  0.67 |  0.91 |  0.09 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   0.8  |  0.74 |  0.88 |  0.05 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.75 |  0.7  |  0.79 |  0.04 |

### red_batch_size

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    1.2 |     1 |     2 |  0.45 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |

### red_batch_max

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    2.6 |     1 |     3 |  0.89 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    4.4 |     2 |     6 |  1.67 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    4.8 |     4 |     6 |  0.84 |

### red_batch_unmeasurable

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1.8 |     1 |     3 |  0.84 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |     1 |  0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    1.2 |     1 |     2 |  0.45 |

### green_batch_size

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |   1   |  0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |   1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |   1   |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |   1   |  0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |   1   |  0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    1.1 |     1 |   1.5 |  0.22 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    1   |     1 |   1   |  0    |

### chain_suite_runs

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |  103.6 |    92 |   113 |  8.91 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |  106.2 |    97 |   118 |  9.23 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   95.4 |    89 |   101 |  5.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  161.8 |   149 |   182 | 13.18 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   83.4 |    71 |   103 | 11.8  |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   36.6 |    32 |    43 |  4.51 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   52.6 |    46 |    65 |  7.3  |

### cycles_total

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   42.4 |    42 |    43 |  0.55 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   41.8 |    39 |    44 |  1.79 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   49.6 |    46 |    52 |  2.19 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   52   |    48 |    56 |  3.16 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   39.4 |    32 |    46 |  5.08 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   18.8 |    16 |    23 |  2.95 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   23.2 |    20 |    28 |  3.42 |

### cycles_closed

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   25.2 |    24 |    26 |  0.84 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   24.2 |    23 |    26 |  1.1  |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   24.2 |    22 |    26 |  1.64 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   25   |    23 |    27 |  1.58 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   30.4 |    26 |    37 |  4.16 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   15   |    14 |    18 |  1.73 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   18.6 |    15 |    23 |  3.05 |

### refactor_events

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   24.8 |    16 |    29 |  5.17 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   29.6 |    24 |    40 |  6.54 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   16.6 |    14 |    20 |  2.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   30.6 |    22 |    46 |  9.69 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    7.2 |     4 |    10 |  2.39 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    0.6 |     0 |     2 |  0.89 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    5   |     2 |     9 |  2.65 |

### skip_events

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   16.6 |    15 |    18 |  1.14 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   16.6 |    15 |    18 |  1.34 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   23.8 |    22 |    25 |  1.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   25.8 |    22 |    30 |  2.95 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    8.2 |     3 |    11 |  3.11 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    3.8 |     2 |     5 |  1.64 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     1 |     4 |  1.34 |

### refactor_per_cycle

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.98 |  0.64 |  1.17 |  0.21 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   1.22 |  1    |  1.67 |  0.26 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   0.69 |  0.56 |  0.8  |  0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   1.23 |  0.88 |  1.92 |  0.41 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.24 |  0.14 |  0.35 |  0.08 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   0.04 |  0    |  0.13 |  0.06 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.27 |  0.1  |  0.4  |  0.13 |

### green_attempts

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.04 |  0    |  0.12 |  0.05 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   0.06 |  0    |  0.13 |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   0.03 |  0    |  0.08 |  0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0.06 |  0    |  0.12 |  0.05 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   0.07 |  0.03 |  0.11 |  0.03 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   0.01 |  0    |  0.07 |  0.03 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   0.02 |  0    |  0.06 |  0.03 |

### chain_deviations

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   17.4 |    16 |    19 |  1.14 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   17.6 |    15 |    19 |  1.52 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   24.6 |    23 |    26 |  1.34 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   27   |    25 |    31 |  2.35 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   10.2 |     4 |    15 |  4.76 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    4   |     2 |     5 |  1.41 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    8.4 |     6 |    11 |  1.95 |

### chain_opens_red (rate %)

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |       4 |       80 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |       0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       0 |        0 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |

### chain_ends_green (rate %)

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |       5 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   2.92 |  2.14 |  3.26 |  0.46 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   3.32 |  3.03 |  3.72 |  0.27 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   4.81 |  4.08 |  5.6  |  0.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   4.46 |  3.98 |  5.09 |  0.4  |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   6.23 |  4.87 |  8.4  |  1.51 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   9.46 |  8.25 | 10.75 |  1.11 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   6.48 |  5.2  |  7.29 |  0.82 |

### cc_longest_function

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   11   |     4 |    16 |  4.36 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   14.2 |    10 |    25 |  6.38 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   13   |    11 |    15 |  1.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   14.2 |    11 |    16 |  2.17 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   14.8 |    13 |    17 |  1.64 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   19.2 |    17 |    22 |  1.92 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   15.8 |    14 |    17 |  1.3  |

### cognitive_max

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |     4 |  0.89 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     1 |     4 |  1.14 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |    2.4 |     2 |     3 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    2   |     2 |     2 |  0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    3.6 |     3 |     6 |  1.34 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    7.2 |     3 |    12 |  3.42 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    4   |     3 |     6 |  1.41 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |    3.2 |     3 |     4 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |    3.4 |     3 |     4 |  0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    3   |     3 |     3 |  0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    4.4 |     4 |     6 |  0.89 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    6.4 |     4 |    10 |  2.3  |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    4.4 |     4 |     5 |  0.55 |

### smell_total

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    0.8 |     0 |     1 |  0.45 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |    0.8 |     0 |     1 |  0.45 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |    2.2 |     0 |     8 |  3.35 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |    0   |     0 |     0 |  0    |

### code_mass

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |  742.2 |   674 |   843 |  61.94 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |  733   |   637 |   908 | 104.95 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |  632.4 |   599 |   692 |  35.98 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  655.2 |   593 |   741 |  56.74 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |  559.6 |   539 |   569 |  12.88 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |  584.6 |   560 |   596 |  14.62 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  634.2 |   599 |   673 |  29.89 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 | 1116.8 |   950 |  1292 | 138.46 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 | 1216.6 |  1050 |  1454 | 165.13 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |  922.2 |   838 |  1053 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 | 2664.2 |  2176 |  3157 | 433.21 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |  604.8 |   525 |   671 |  58.83 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |  310.2 |   268 |   378 |  44.12 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |  371.8 |   323 |   427 |  45.25 |

### total_tokens

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |        mean |      min |      max |              std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 | 5.09643e+07 | 42741828 | 54911185 |      5.23465e+06 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 | 5.40006e+07 | 40003807 | 70699850 |      1.25442e+07 |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 | 2.44e+07    | 22675592 | 26353742 |      1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 | 5.52526e+07 | 48118690 | 67209488 |      7.64498e+06 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 | 1.55156e+07 | 13802295 | 17899649 |      2.0099e+06  |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 | 5.25403e+06 |  4669128 |  6137569 | 653621           |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 | 7.33909e+06 |  6587136 |  8445100 | 771027           |

### cost_usd

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |  18.35 | 14.74 | 19.98 |  2.18 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |  20.16 | 16.08 | 26.32 |  4.2  |
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   9.79 |  9.32 | 10.52 |  0.49 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |  28.34 | 24.26 | 33.15 |  3.3  |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   6.85 |  6.16 |  7.86 |  0.84 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   2.97 |  2.66 |  3.33 |  0.33 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   3.45 |  3.17 |  3.76 |  0.25 |
