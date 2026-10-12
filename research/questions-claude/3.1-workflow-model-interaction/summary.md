# RQ-workflow-model — Aggregation

_Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model?_

Generated: 2026-10-12T08:37:36Z

Cells declared: 6 · matched runs: 49 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | exact-subagents-v1-cc | opus-4-6-portkey-no-thinking | 5 | 4 | ⚠️ below min_replicates (4/5) |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking | 9 | 9 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v1-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-hybrid-v1-cc | opus-4-6-portkey-no-thinking | 15 | 15 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow              | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking         |  10 |      0 |   0.67 | 0.36 |
| claim-office-example-mapping | exact-subagents-v1-cc      | opus-4-6-portkey-no-thinking |   4 |      0 |   0.92 | 0.08 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking         |   9 |      0 |   0.97 | 0.09 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |   0.87 | 0.3  |
| claim-office-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking         |   5 |      0 |   1    | 0    |
| claim-office-example-mapping | exact-hybrid-v1-cc         | opus-4-6-portkey-no-thinking |  15 |      0 |   0.68 | 0.33 |

### verification_passed

| kata                         | cell_workflow              | cell_model                   |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:-----------------------------|----:|-------:|-------:|-----:|
| claim-office-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking         |  10 |      0 |  10    | 5.33 |
| claim-office-example-mapping | exact-subagents-v1-cc      | opus-4-6-portkey-no-thinking |   4 |      0 |  13.75 | 1.26 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking         |   9 |      0 |  14.56 | 1.33 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking |   5 |      0 |  13    | 4.47 |
| claim-office-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking         |   5 |      0 |  15    | 0    |
| claim-office-example-mapping | exact-hybrid-v1-cc         | opus-4-6-portkey-no-thinking |  15 |      0 |  10.13 | 4.9  |

### tests_passing

| kata                         | cell_workflow              | cell_model                   |   n |   k |   null |   rate_% |
|:-----------------------------|:---------------------------|:-----------------------------|----:|----:|-------:|---------:|
| claim-office-example-mapping | exact-subagents-v1-cc      | opus-4-7-no-thinking         |  10 |  10 |      0 |      100 |
| claim-office-example-mapping | exact-subagents-v1-cc      | opus-4-6-portkey-no-thinking |   4 |   4 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking         |   9 |   9 |      0 |      100 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v1-cc         | opus-4-7-no-thinking         |   5 |   5 |      0 |      100 |
| claim-office-example-mapping | exact-hybrid-v1-cc         | opus-4-6-portkey-no-thinking |  15 |  13 |      0 |       87 |
