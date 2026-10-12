# RQ-tdd-workflow-comparison-opus55 — Aggregation

_How do seven TDD workflows compare on correctness, TDD discipline, code quality and cost? Three lines meet on one kata: the maintained EXACT Coding Predictive-TDD pair (with and without an isolated refactor subagent), the retired Opus hybrid pair, and three vendored third-party TDD skills — measured on claim-office-example-mapping × opus-5-5-no-thinking × Claude Code._

Generated: 2026-10-12T10:46:30Z

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

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.96 | 0.09 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1    | 0    |

### tests_passing

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |

### tdd_discipline

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.63 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.62 | 0.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.71 | 0.02 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.7  | 0.01 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.84 | 0.04 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.82 | 0.07 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.85 | 0.06 |

### tdd_discipline_test_first

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.51 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.5  | 0.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.61 | 0.02 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.59 | 0.02 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.75 | 0.04 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.8  | 0.05 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.79 | 0.09 |

### tdd_discipline_step

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.9 | 0.22 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |

### tdd_discipline_closure

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.49 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.48 | 0.04 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.59 | 0.02 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.58 | 0.01 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.8  | 0.09 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.8  | 0.07 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.78 | 0.09 |

### test_first_rate

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.51 | 0.02 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.5  | 0.03 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.61 | 0.02 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.59 | 0.02 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.75 | 0.04 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.8  | 0.05 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.79 | 0.09 |

### red_batch_size

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1.2 | 0.45 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |

### red_batch_max

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4.8 | 0.84 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4.4 | 1.67 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.6 | 0.89 |

### red_batch_unmeasurable

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1.2 | 0.45 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1.8 | 0.84 |

### green_batch_size

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1.1 | 0.22 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    1   | 0    |

### chain_suite_runs

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |    sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   95.4 |  5.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  161.8 | 13.18 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  103.6 |  8.91 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  106.2 |  9.23 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   52.6 |  7.3  |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   36.6 |  4.51 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   83.4 | 11.8  |

### cycles_total

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   49.6 | 2.19 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   52   | 3.16 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   42.4 | 0.55 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   41.8 | 1.79 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   23.2 | 3.42 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   18.8 | 2.95 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   39.4 | 5.08 |

### cycles_closed

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   24.2 | 1.64 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   25   | 1.58 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   25.2 | 0.84 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   24.2 | 1.1  |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   18.6 | 3.05 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   15   | 1.73 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   30.4 | 4.16 |

### refactor_events

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   16.6 | 2.41 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   30.6 | 9.69 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   24.8 | 5.17 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   29.6 | 6.54 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    5   | 2.65 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.6 | 0.89 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    7.2 | 2.39 |

### skip_events

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   23.8 | 1.3  |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   25.8 | 2.95 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   16.6 | 1.14 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   16.6 | 1.34 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 1.34 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.8 | 1.64 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    8.2 | 3.11 |

### refactor_per_cycle

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.69 | 0.09 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.23 | 0.41 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.98 | 0.21 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   1.22 | 0.26 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.27 | 0.13 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.04 | 0.06 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.24 | 0.08 |

### green_attempts

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.03 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.06 | 0.05 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.04 | 0.05 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.06 | 0.05 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.02 | 0.03 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.01 | 0.03 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   0.07 | 0.03 |

### chain_deviations

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   24.6 | 1.34 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   27   | 2.35 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   17.4 | 1.14 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   17.6 | 1.52 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    8.4 | 1.95 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4   | 1.41 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   10.2 | 4.76 |

### chain_opens_red

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   0 |      0 |        0 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   4 |      0 |       80 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |

### chain_ends_green

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   k |   null |   rate_% |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |   5 |      0 |      100 |

### avg_loc_per_function

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   4.81 | 0.62 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   4.46 | 0.4  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   2.92 | 0.46 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   3.32 | 0.27 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   6.48 | 0.82 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   9.46 | 1.11 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   6.23 | 1.51 |

### longest_function

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   13   | 1.58 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   14.2 | 2.17 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   11   | 4.36 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   14.2 | 6.38 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   15.8 | 1.3  |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   19.2 | 1.92 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   14.8 | 1.64 |

### cognitive_max

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 0.89 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.4 | 1.14 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4   | 1.41 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    7.2 | 3.42 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.6 | 1.34 |

### mccabe_max

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.2 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    3.2 | 0.45 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4.4 | 0.55 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    6.4 | 2.3  |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    4.4 | 0.89 |

### smell_total

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.8 | 0.45 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0.8 | 0.45 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    2.2 | 3.35 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |    0   | 0    |

### code_mass

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  632.4 |  35.98 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  655.2 |  56.74 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  742.2 |  61.94 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  733   | 104.95 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  634.2 |  29.89 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  584.6 |  14.62 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  559.6 |  12.88 |

### duration_seconds

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |     sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  922.2 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 2664.2 | 433.21 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 1116.8 | 138.46 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 1216.6 | 165.13 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  371.8 |  45.25 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  310.2 |  44.12 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  604.8 |  58.83 |

### total_tokens

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |        mean |               sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|------------:|-----------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 2.44e+07    |      1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 5.52526e+07 |      7.64498e+06 |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 5.09643e+07 |      5.23465e+06 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 5.40006e+07 |      1.25442e+07 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 7.33909e+06 | 771027           |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 5.25403e+06 | 653621           |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 | 1.55156e+07 |      2.0099e+06  |

### cost_usd

| kata                         | cell_workflow                        | cell_model           | cell_harness   |   n |   null |   mean |   sd |
|:-----------------------------|:-------------------------------------|:---------------------|:---------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                     | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   9.79 | 0.49 |
| claim-office-example-mapping | exact-ptdd-v1.1-refactor-subagent-cc | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  28.34 | 3.3  |
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  18.35 | 2.18 |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc       | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |  20.16 | 4.2  |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc   | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   3.45 | 0.25 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc        | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   2.97 | 0.33 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc      | opus-5-5-no-thinking | 2.1.280        |   5 |      0 |   6.85 | 0.84 |
