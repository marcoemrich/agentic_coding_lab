# RQ-2 — Aggregation

_Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität und Korrektheit?_

Generated: 2026-05-10T13:01:32Z

Cells declared: 3 · matched runs: 3 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | v4-exact-subagents | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-user-story | v4-exact-subagents | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model                |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |       3 |      100 |

### verification_pct

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   0.78 |  0.33 |     1 |  0.38 |

### verification_passed

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  11.67 |     5 |    15 |  5.77 |

### verification_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |    796 |   617 |   902 | 155.89 |

### smell_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |      1 |     0 |     2 |     1 |

### cc_longest_function

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |  14.33 |    12 |    16 |  2.08 |

### mccabe_max

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   7.33 |     4 |    13 |  4.93 |

### cognitive_max

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   7.67 |     5 |    10 |  2.52 |

### predictions_correct

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |     58 |    49 |    65 |  8.19 |

### duration_seconds

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   3 |   4247 |  3402 |  4780 | 740.09 |
