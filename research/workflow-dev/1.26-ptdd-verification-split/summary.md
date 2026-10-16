# RQ-ptdd-verification-split — Aggregation

_Does splitting the PTDD v1 test list into driving tests and a trailing verification group keep Correctness, safety net and code quality at least at the v1 level on Opus 5.5 and GPT-6.1 Sol, while making the phase-chain discipline readable for a test-list workflow?_

Generated: 2026-10-16T06:21:39Z

Cells declared: 4 · matched runs: 20 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |      1 |    0 |

### tests_passing

| kata                         | cell_workflow                         | cell_model           |   n |   k |   null |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |   5 |      0 |      100 |

### tests_total

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   47.8 | 1.64 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   47.6 | 2.7  |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   48.8 | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   54.6 | 2.51 |

### mutation_score

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   0.94 | 0.05 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   0.92 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   0.54 | 0.49 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   0.94 | 0.02 |

### mutants_total

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |  124   | 4.9  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |  124.8 | 2.59 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |  113   | 3.81 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |  112.2 | 3.63 |

### mutants_survived

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    7.8 |  6.3  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   10   |  4.06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   51.4 | 54.45 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |    6.6 |  2.41 |

### code_mass

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |  632.4 | 35.98 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |  639.6 | 37.85 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |  561.2 | 18.05 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |  514.8 | 29.51 |

### smell_total

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |      0 |    0 |

### cognitive_max

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    2.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |    2.2 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |    3   | 1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |    2.2 | 0.45 |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   1.43 | 0.21 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   1.4  | 0.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   1.47 | 0.32 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   1.33 | 0.06 |

### mccabe_max

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    3.4 | 0.55 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |    3.2 | 0.45 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |    3.8 | 1.1  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |    3.2 | 0.45 |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   4.81 | 0.62 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   4.64 | 0.47 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   4.56 | 0.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   4.72 | 0.34 |

### lines_of_code

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |    sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |  222.2 | 24.14 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |  222.6 | 11.13 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |  139.6 | 13.85 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |  133.2 |  4.55 |

### verification_tests

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   20   |   3.39 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   0 |      5 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   33.4 |   3.58 |

### verification_red

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   0 |      5 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   0 |      5 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |      0 |    0 |

### tdd_after_cutoff

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   0 |      5 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   0 |      5 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |      0 |    0 |

### red_batch_max

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |      1 |    0 |

### cycles_closed

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   24.2 | 1.64 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   26   | 0.71 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   25   | 1    |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   18.6 | 3.65 |

### refactor_events

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   16.6 | 2.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   19   | 3.08 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   19.6 | 3.36 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   17.8 | 1.3  |

### skip_events

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   23.8 | 1.3  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |    2.4 | 1.34 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   23   | 1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |    0.2 | 0.45 |

### tdd_discipline

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   0.63 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |   0.93 | 0.03 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   0.63 | 0.01 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   0.89 | 0.04 |

### predictions_correct

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    2   | 4.47 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   96   | 1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |  108.2 | 5.02 |

### predictions_total

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    2   | 4.47 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |    0   | 0    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   97.6 | 2.19 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |  109.2 | 5.02 |

### duration_seconds

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |  922.2 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 | 1078   |  69.99 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 | 2171.4 | 190.46 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 | 1632   | 749.26 |

### total_tokens

| kata                         | cell_workflow                         | cell_model           |   n |   null |        mean |          sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------------:|------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 | 2.44e+07    | 1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 | 2.83608e+07 | 2.45945e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 | 8.97392e+06 | 3.43777e+06 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 | 9.79363e+06 | 1.21408e+06 |

### cost_usd

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   9.79 | 0.49 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   5 |      0 |  11.3  | 0.78 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   1.47 | 0.58 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   5 |      0 |   1.54 | 0.24 |
