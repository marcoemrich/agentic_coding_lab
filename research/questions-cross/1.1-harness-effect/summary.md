# RQ-harness — Aggregation

_Wie wirkt sich der Harness-Wechsel (Claude Code vs OpenCode) auf Korrektheit und Code-Qualität aus, wenn Modell, Workflow-Intention und Prompt-Stil konstant gehalten werden?_

Generated: 2026-05-25T07:32:21Z

Cells declared: 4 · matched runs: 2 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-prose | v1-oneshot | opus-4-7-portkey | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v1-oneshot | opus-4-7-portkey | 0 | 0 | ❌ keine Runs |
| game-of-life-prose | v1-oneshot-oc | opus-4-7-portkey | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey | 2 | 2 | ⚠️ unter min_replicates (2/5) |

## Outcome-Pivots (pro Zelle)

### tests_passing (rate %)

| kata               | workflow      | cell_model       |   n |   match |   rate_% |
|:-------------------|:--------------|:-----------------|----:|--------:|---------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |       2 |      100 |

### tests_total

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |      8 |     6 |    10 |  2.83 |

### verification_pct

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |    0.2 |   0.2 |   0.2 |     0 |

### verification_passed

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |      3 |     3 |     3 |     0 |

### code_mass

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |  871.5 |   828 |   915 | 61.52 |

### cognitive_max

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |     12 |    10 |    14 |  2.83 |

### mccabe_max

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |    9.5 |     9 |    10 |  0.71 |

### cc_longest_function

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |     38 |    36 |    40 |  2.83 |

### lines_of_code

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |    317 |   291 |   343 | 36.77 |

### smell_total

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |   13.5 |    10 |    17 |  4.95 |

### completed_within_budget (rate %)

| kata               | workflow      | cell_model       |   n |   match |   rate_% |
|:-------------------|:--------------|:-----------------|----:|--------:|---------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |       2 |      100 |

### duration_seconds

| kata               | workflow      | cell_model       |   n |   mean |   min |   max |   std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|------:|------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 |    143 |   128 |   158 | 21.21 |

### total_tokens

| kata               | workflow      | cell_model       |   n |   mean |   min |    max |    std |
|:-------------------|:--------------|:-----------------|----:|-------:|------:|-------:|-------:|
| claim-office-prose | v1-oneshot-oc | opus-4-7-portkey |   2 | 227772 |     0 | 455544 | 322118 |
