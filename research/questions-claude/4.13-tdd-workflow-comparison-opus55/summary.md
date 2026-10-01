# RQ-tdd-workflow-comparison-opus55 — Aggregation

_How do five TDD workflows compare on correctness, TDD discipline, code quality and cost — two lab-grown EXACT Coding variants against three vendored third-party TDD skills, measured on claim-office-example-mapping × opus-5-5-no-thinking × Claude Code?_

Generated: 2026-10-01T00:33:10Z

Cells declared: 5 · matched runs: 1 · min_replicates: 5

## Cell coverage

| kata | workflow | model | harness | n | n_ok | status |
|---|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2-testlist-fix-cc | opus-5-5-no-thinking | 2.1.280 | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc | opus-5-5-no-thinking | 2.1.280 | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-5-no-thinking | 2.1.280 | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | external-pocock-2026-09-04-cc | opus-5-5-no-thinking | 2.1.280 | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280 | 1 | 1 | ⚠️ below min_replicates (1/5) |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      1 |     1 |     1 |   nan |

### tests_passing (rate %)

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |       1 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |       1 |      100 |

### tdd_discipline

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |   0.75 |  0.75 |  0.75 |   nan |

### tdd_discipline_test_first

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |   0.67 |  0.67 |  0.67 |   nan |

### tdd_discipline_step

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      1 |     1 |     1 |   nan |

### tdd_discipline_closure

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |   0.63 |  0.63 |  0.63 |   nan |

### test_first_rate

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |   0.67 |  0.67 |  0.67 |   nan |

### red_batch_size

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      1 |     1 |     1 |   nan |

### red_batch_max

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      3 |     3 |     3 |   nan |

### red_batch_unmeasurable

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      1 |     1 |     1 |   nan |

### green_batch_size

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      1 |     1 |     1 |   nan |

### chain_suite_runs

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |     82 |    82 |    82 |   nan |

### cycles_total

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |     41 |    41 |    41 |   nan |

### cycles_closed

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |     26 |    26 |    26 |   nan |

### refactor_events

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      9 |     9 |     9 |   nan |

### skip_events

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |     10 |    10 |    10 |   nan |

### refactor_per_cycle

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |   0.35 |  0.35 |  0.35 |   nan |

### green_attempts

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |   0.08 |  0.08 |  0.08 |   nan |

### chain_deviations

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |     15 |    15 |    15 |   nan |

### chain_opens_red (rate %)

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |       1 |      100 |

### chain_ends_green (rate %)

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|--------:|---------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |       1 |      100 |

### cc_avg_loc_per_function

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |   5.56 |  5.56 |  5.56 |   nan |

### cc_longest_function

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |     14 |    14 |    14 |   nan |

### cognitive_max

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      3 |     3 |     3 |   nan |

### mccabe_max

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      4 |     4 |     4 |   nan |

### smell_total

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |      0 |     0 |     0 |   nan |

### code_mass

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |    555 |   555 |   555 |   nan |

### duration_seconds

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 |    625 |   625 |   625 |   nan |

### total_tokens

| kata                         | cell_workflow                   | cell_model           | cell_harness   |   n |        mean |      min |      max |   std |
|:-----------------------------|:--------------------------------|:---------------------|:---------------|----:|------------:|---------:|---------:|------:|
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-5-no-thinking | 2.1.280        |   1 | 1.74634e+07 | 17463376 | 17463376 |   nan |

### cost_usd

_All values are missing or non-numeric._
