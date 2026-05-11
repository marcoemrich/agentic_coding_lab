# RQ-2 — Aggregation

_Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität und Korrektheit?_

Generated: 2026-05-10T17:19:20Z

Cells declared: 3 · matched runs: 6 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | v4-exact-subagents | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking | 6 | 6 | ✅ |
| claim-office-user-story | v4-exact-subagents | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata                         | workflow           | model                |   n |   match |   rate_% |
|:-----------------------------|:-------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   6 |       5 |       83 |

### verification_pct

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |   0.72 |  0.27 |     1 |  0.38 |

### verification_passed

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |   10.8 |     4 |    15 |  5.76 |

### verification_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |  555.8 |   167 |   902 | 347.47 |

### smell_total

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |    0.6 |     0 |     2 |  0.89 |

### cc_longest_function

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |   14.2 |    11 |    17 |  2.59 |

### mccabe_max

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |    6.4 |     4 |    13 |  3.78 |

### cognitive_max

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |    6.6 |     5 |    10 |   2.3 |

### predictions_correct

| kata                         | workflow           | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 |     51 |    35 |    65 | 11.85 |

### duration_seconds

| kata                         | workflow           | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-no-thinking |   5 | 4051.4 |  3402 |  4780 | 602.88 |
