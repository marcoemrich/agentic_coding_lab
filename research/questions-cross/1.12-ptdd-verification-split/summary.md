# RQ-ptdd-verification-split — Aggregation

_Does splitting the PTDD v1 test list into driving tests and a trailing verification group keep Correctness, safety net and code quality at least at the v1 level on Opus 5.5 and GPT-6.1 Sol, while making the phase-chain discipline readable for a test-list workflow?_

Generated: 2026-10-12T08:37:42Z

Cells declared: 4 · matched runs: 11 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking | 0 | 0 | ❌ no runs |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex | 1 | 1 | ⚠️ below min_replicates (1/5) |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |      1 |  nan |

### tests_passing

| kata                         | cell_workflow                         | cell_model           |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 | nan |      0 |      nan |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |   1 |      0 |      100 |    nan |  nan |

### tests_total

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   47.8 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   48.8 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |   57   | nan    |

### mutation_score

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   0.94 |   0.05 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   0.54 |   0.49 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   0 |      1 | nan    | nan    |

### mutants_total

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    124 |   4.9  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |    113 |   3.81 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   0 |      1 |    nan | nan    |

### mutants_survived

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    7.8 |   6.3  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   51.4 |  54.45 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   0 |      1 |  nan   | nan    |

### code_mass

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |  632.4 |  35.98 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |  561.2 |  18.05 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |  476   | nan    |

### smell_total

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |      0 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |      0 |  nan |

### cognitive_max

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    2.4 |   0.55 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |    3   |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |    3   | nan    |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   1.43 |   0.21 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   1.47 |   0.32 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |   1.4  | nan    |

### mccabe_max

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    3.4 |   0.55 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |    3.8 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |    4   | nan    |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   4.81 |   0.62 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   4.56 |   0.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |   4.56 | nan    |

### lines_of_code

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |  222.2 |  24.14 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |  139.6 |  13.85 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |  132   | nan    |

### verification_tests

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean | sd   |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|:-----|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   0 |      5 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   0 |      5 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |     37 |      |

### verification_red

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean | sd   |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|:-----|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   0 |      5 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   0 |      5 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |      0 |      |

### tdd_after_cutoff

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean | sd   |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|:-----|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   0 |      5 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   0 |      5 |    nan |      |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |      0 |      |

### red_batch_max

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |   sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |    nan |  nan |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |      1 |  nan |

### cycles_closed

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   24.2 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   25   |   1    |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |   17   | nan    |

### refactor_events

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   16.6 |   2.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   19.6 |   3.36 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |   19   | nan    |

### skip_events

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   23.8 |   1.3  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   23   |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |    0   | nan    |

### tdd_discipline

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   0.63 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   0.63 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |   0.88 | nan    |

### predictions_correct

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |      2 |   4.47 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |    nan | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |     96 |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |    113 | nan    |

### predictions_total

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |    2   |   4.47 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   97.6 |   2.19 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |  114   | nan    |

### duration_seconds

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |  922.2 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 |  nan   | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 | 2171.4 | 190.46 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 | 1200   | nan    |

### total_tokens

| kata                         | cell_workflow                         | cell_model           |   n |   null |          mean |            sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|--------------:|--------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   2.44e+07    |   1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 | nan           | nan           |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   8.97392e+06 |   3.43777e+06 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |   1.03368e+07 | nan           |

### cost_usd

| kata                         | cell_workflow                         | cell_model           |   n |   null |   mean |     sd |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |   9.79 |   0.49 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-cc | opus-5-5-no-thinking |   0 |      0 | nan    | nan    |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |   1.47 |   0.58 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |   0    | nan    |
