# RQ-workflow-model — Aggregation

_Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model?_

Generated: 2026-08-10T00:23:01Z

Cells declared: 6 · matched runs: 49 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-6-portkey-no-thinking | 5 | 4 | ⚠️ nur 4/5 ohne Timeout |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 9 | 9 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6-hybrid | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v6-hybrid | opus-4-6-portkey-no-thinking | 15 | 15 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | cell_workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |   0.93 |  0.8  |     1 |  0.08 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |   0.67 |  0.2  |     1 |  0.36 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   5 |   0.87 |  0.33 |     1 |  0.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   9 |   0.97 |  0.73 |     1 |  0.09 |
| claim-office-example-mapping | v6-hybrid               | opus-4-6-portkey-no-thinking |  15 |   0.68 |  0.27 |     1 |  0.33 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking         |   5 |   1    |  1    |     1 |  0    |

### verification_passed

| kata                         | cell_workflow           | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |  14    |    12 |    15 |  1.22 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |  10    |     3 |    15 |  5.33 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   5 |  13    |     5 |    15 |  4.47 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   9 |  14.56 |    11 |    15 |  1.33 |
| claim-office-example-mapping | v6-hybrid               | opus-4-6-portkey-no-thinking |  15 |  10.13 |     4 |    15 |  4.9  |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking         |   5 |  15    |    15 |    15 |  0    |

### tests_passing (rate %)

| kata                         | cell_workflow           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   9 |       9 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-6-portkey-no-thinking |  15 |      13 |       87 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking         |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | cell_workflow           | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-6-portkey-no-thinking |   5 |       4 |       80 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-no-thinking         |  10 |      10 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking         |   9 |       9 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-6-portkey-no-thinking |  15 |      15 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-no-thinking         |   5 |       5 |      100 |
