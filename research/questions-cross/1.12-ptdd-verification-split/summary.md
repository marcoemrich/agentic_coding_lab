# RQ-ptdd-verification-split — Aggregation

_Does splitting the PTDD v1 test list into driving tests and a trailing verification group keep Correctness, safety net and code quality at least at the v1 level on Opus 5.5 and GPT-6.1 Sol, while making the phase-chain discipline readable for a test-list workflow?_

Generated: 2026-10-12T07:27:51Z

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

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      1 |     1 |     1 |   nan |

### tests_passing (rate %)

| kata                         | cell_workflow                         | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:--------------------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |       5 |      100 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |       1 |      100 |

### tests_total

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   47.8 |    45 |    49 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   48.8 |    48 |    50 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |   57   |    57 |    57 | nan    |

### mutation_score

| kata                         | cell_workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking |   5 |   0.94 |  0.88 |  0.99 |  0.05 |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex    |   5 |   0.54 |  0    |  0.92 |  0.49 |

### mutants_total

| kata                         | cell_workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking |   5 |    124 |   118 |   130 |  4.9  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex    |   5 |    113 |   109 |   118 |  3.81 |

### mutants_survived

| kata                         | cell_workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc | opus-5-5-no-thinking |   5 |    7.8 |     1 |    15 |  6.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi | gpt-6-1-sol-codex    |   5 |   51.4 |     9 |   111 | 54.45 |

### code_mass

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |  632.4 |   599 |   692 |  35.98 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |  561.2 |   535 |   580 |  18.05 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |  476   |   476 |   476 | nan    |

### smell_total

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      0 |     0 |     0 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      0 |     0 |     0 |   nan |

### cognitive_max

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |    2.4 |     2 |     3 |   0.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |    3   |     2 |     5 |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |    3   |     3 |     3 | nan    |

### cognitive_avg

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   1.43 |  1.21 |  1.75 |   0.21 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   1.47 |  1.18 |  1.91 |   0.32 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |   1.4  |  1.4  |  1.4  | nan    |

### mccabe_max

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |    3.4 |     3 |     4 |   0.55 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |    3.8 |     3 |     5 |   1.1  |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |    4   |     4 |     4 | nan    |

### unit_size_avg

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   4.81 |  4.08 |  5.6  |   0.62 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   4.56 |  4.14 |  5.25 |   0.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |   4.56 |  4.56 |  4.56 | nan    |

### lines_of_code

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |  222.2 |   184 |   251 |  24.14 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |  139.6 |   129 |   163 |  13.85 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |  132   |   132 |   132 | nan    |

### verification_tests

| kata                         | cell_workflow                         | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex |   1 |     37 |    37 |    37 |   nan |

### verification_red

| kata                         | cell_workflow                         | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex |   1 |      0 |     0 |     0 |   nan |

### tdd_after_cutoff

| kata                         | cell_workflow                         | cell_model        |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex |   1 |      0 |     0 |     0 |   nan |

### red_batch_max

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |      1 |     1 |     1 |     0 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |      1 |     1 |     1 |   nan |

### cycles_closed

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   24.2 |    22 |    26 |   1.64 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   25   |    24 |    26 |   1    |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |   17   |    17 |    17 | nan    |

### refactor_events

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   16.6 |    14 |    20 |   2.41 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   19.6 |    16 |    24 |   3.36 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |   19   |    19 |    19 | nan    |

### skip_events

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   23.8 |    22 |    25 |   1.3  |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   23   |    22 |    25 |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |    0   |     0 |     0 | nan    |

### tdd_discipline

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   0.63 |  0.61 |  0.64 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   0.63 |  0.62 |  0.64 |   0.01 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |   0.88 |  0.88 |  0.88 | nan    |

### predictions_correct

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |      2 |     0 |    10 |   4.47 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |     96 |    95 |    98 |   1.41 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |    113 |   113 |   113 | nan    |

### predictions_total

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |    2   |     0 |    10 |   4.47 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   97.6 |    96 |   100 |   2.19 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |  114   |   114 |   114 | nan    |

### duration_seconds

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |  922.2 |   838 |  1053 |  80.42 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 | 2171.4 |  1945 |  2437 | 190.46 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 | 1200   |  1200 |  1200 | nan    |

### total_tokens

| kata                         | cell_workflow                         | cell_model           |   n |        mean |      min |      max |           std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|------------:|---------:|---------:|--------------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 | 2.44e+07    | 22675592 | 26353742 |   1.83647e+06 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 | 8.97392e+06 |  3500257 | 12129902 |   3.43777e+06 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 | 1.03368e+07 | 10336786 | 10336786 | nan           |

### cost_usd

| kata                         | cell_workflow                         | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:--------------------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | exact-ptdd-v1-cc                      | opus-5-5-no-thinking |   5 |   9.79 |  9.32 | 10.52 |   0.49 |
| claim-office-example-mapping | exact-ptdd-v1-pi                      | gpt-6-1-sol-codex    |   5 |   1.47 |  0.51 |  2    |   0.58 |
| claim-office-example-mapping | exact-ptdd-v1.2-verification-split-pi | gpt-6-1-sol-codex    |   1 |   0    |  0    |  0    | nan    |
