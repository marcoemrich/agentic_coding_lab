# RQ-external-tdd-workflows-opus5 — Aggregation

_Can the inner TDD loop of EXACT Coding be substituted by an externally authored TDD workflow, and what does the substitution cost or buy? Example mapping stays the entry point; only the implement/test/refactor loop is exchanged. Measured on claim-office-example-mapping against the current exact-coding baseline exact-hybrid-v2.4-lab-split-cc — on correctness, code quality, TDD discipline and cost._

Generated: 2026-10-12T08:37:40Z

Cells declared: 4 · matched runs: 15 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | external-pocock-2026-09-04-cc | opus-5-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc | opus-5-no-thinking | 0 | 0 | ❌ no runs |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   0.96 |   0.04 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |   1    |   0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |   1    |   0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 | nan    | nan    |

### tests_passing

| kata                         | cell_workflow                      | cell_model         |   n |   k |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |   5 |      0 |      100 |    nan |  nan |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 | nan |      0 |      nan |    nan |  nan |

### refactorings_applied

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   33   |  14.27 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |    4.2 |   3.42 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |    0   |   0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### tests_passed_immediately

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   20.4 |  11.84 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |    2   |   1.22 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |    0   |   0    |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### predictions_correct_rate

| kata                         | cell_workflow                      | cell_model         |   n |   k |   t |   null |   rate_% |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|----:|----:|-------:|---------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 | 478 | 480 |      0 |     99.6 |    nan |  nan |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   0 | nan | nan |      5 |    nan   |    nan |  nan |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   0 | nan | nan |      5 |    nan   |    nan |  nan |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 | nan | nan |      0 |    nan   |    nan |  nan |

### cycle_count

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   48   |   2.55 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |   13.4 |   2.51 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |   35.2 |   2.28 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### test_blocks

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   48.4 |   2.07 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |   13.4 |   2.51 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |   19   |   2.74 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### test_cases_total

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   49   |   2    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |   45   |  11.51 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |   36.8 |   5.26 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### test_cases_first_block

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |   sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |      1 |    0 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |    nan |  nan |

### red_verified

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   48.4 |   2.07 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |   12.4 |   3.58 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |   18.8 |   2.39 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### red_unverified

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |    0   |   0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |    1   |   1.73 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |    0.2 |   0.45 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### suite_cycles

| kata                         | cell_workflow                      | cell_model         |   n |   null | mean   | sd   |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|:-------|:-----|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |        |      |

### suite_new_failures

| kata                         | cell_workflow                      | cell_model         |   n |   null | mean   | sd   |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|:-------|:-----|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |        |      |

### suite_opens_red

| kata                         | cell_workflow                      | cell_model         |   n |   null | mean   | sd   |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|:-------|:-----|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |        |      |

### suite_unresolved_red

| kata                         | cell_workflow                      | cell_model         |   n |   null | mean   | sd   |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|:-------|:-----|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |        |      |

### suite_runs

| kata                         | cell_workflow                      | cell_model         |   n |   null | mean   | sd   |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|:-------|:-----|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |        |      |

### suite_unknown_runs

| kata                         | cell_workflow                      | cell_model         |   n |   null | mean   | sd   |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|:-------|:-----|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   0 |      5 |        |      |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |        |      |

### avg_loc_per_function

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   4.49 |   0.54 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |   7.9  |   1.15 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |  10.41 |   1.45 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 | nan    | nan    |

### longest_function

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   17.6 |   4.39 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |   23.4 |   3.13 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |   26.6 |   4.22 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### cognitive_max

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |    2.8 |   0.84 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |    6.2 |   2.17 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |    6.6 |   2.41 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### mccabe_max

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |    3.4 |   0.55 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |    5.2 |   1.1  |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |    5.4 |   1.14 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### smell_total

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |    0   |   0    |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |    0   |   0    |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |    0.2 |   0.45 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### code_mass

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |     sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|-------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |  821.2 | 110.71 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |  666.4 |  25.53 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |  599.8 |  59.52 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   | nan    |

### duration_seconds

| kata                         | cell_workflow                      | cell_model         |   n |   null |   mean |      sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|-------:|--------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 | 3841   | 1522.52 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |  548.4 |   56.73 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |  582.4 |   66.41 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 |  nan   |  nan    |

### total_tokens

| kata                         | cell_workflow                      | cell_model         |   n |   null |          mean |            sd |
|:-----------------------------|:-----------------------------------|:-------------------|----:|-------:|--------------:|--------------:|
| claim-office-example-mapping | exact-hybrid-v2.4-lab-split-cc     | opus-5-no-thinking |   5 |      0 |   1.40925e+08 |   4.64453e+07 |
| claim-office-example-mapping | external-superpowers-2026-09-04-cc | opus-5-no-thinking |   5 |      0 |   1.21539e+07 |   1.28586e+06 |
| claim-office-example-mapping | external-pocock-2026-09-04-cc      | opus-5-no-thinking |   5 |      0 |   1.25898e+07 |   1.44321e+06 |
| claim-office-example-mapping | external-kesseler-2026-09-30-cc    | opus-5-no-thinking |   0 |      0 | nan           | nan           |
