# RQ-pocock-vs-v62 — Aggregation

_Wie schneidet der externe Matt-Pocock-TDD-Skill (v9-pocock-tdd: Single-Skill, Inline-Phasen, Tail-Refactor) auf claim-office-example-mapping gegen die interne Default-Baseline v6.2-with-why-cleaned (Multi-Command + Refactor-Subagent, Per-Cycle-Refactor) ab — auf Korrektheit, Code-Qualitaet, TDD-Disziplin und Kosten?_

Generated: 2026-05-25T22:57:47Z

Cells declared: 2 · matched runs: 11 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking | 8 | 8 | ✅ |
| claim-office-example-mapping | v9-pocock-tdd | opus-4-7-portkey-no-thinking | 3 | 3 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   0.96 |  0.73 |     1 |  0.09 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |   1    |  1    |     1 |  0    |

### tests_passing (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow              | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       8 |      100 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |       3 |      100 |

### refactorings_applied

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  24.88 |    18 |    37 |   6.9 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |   0    |     0 |     0 |   0   |

### tests_passed_immediately

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  15.12 |     1 |    19 |  5.84 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |   2.33 |     0 |     7 |  4.04 |

### predictions_correct_rate (pooled %)

| kata                         | workflow              | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:----------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |       582 |     599 |     97.2 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |        98 |     109 |     89.9 |

### cycle_count

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  37.38 |    35 |    40 |  1.6  |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |  14    |    12 |    18 |  3.46 |

### code_mass

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 | 878.5  |   783 |  1066 | 91.44 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 | 748.33 |   687 |   811 | 62.01 |

### smell_total

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   0.38 |     0 |     2 |  0.74 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |   6.67 |     1 |    17 |  8.96 |

### cc_longest_function

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |  12.38 |    10 |    15 |  1.41 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |  32.33 |    31 |    34 |  1.53 |

### cognitive_max

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   5    |     3 |     8 |  1.77 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |  14.33 |    13 |    16 |  1.53 |

### mccabe_max

| kata                         | workflow              | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:----------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 |   4.5  |     3 |     5 |  0.76 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |  11.67 |    11 |    12 |  0.58 |

### duration_seconds

| kata                         | workflow              | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:----------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 | 2530.38 |  2194 |  3285 | 401.16 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 |  570    |   452 |   657 | 105.96 |

### total_tokens

| kata                         | workflow              | cell_model                   |   n |        mean |      min |      max |         std |
|:-----------------------------|:----------------------|:-----------------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v6.2-with-why-cleaned | opus-4-7-portkey-no-thinking |   8 | 4.44426e+07 | 39301139 | 49093278 | 3.40183e+06 |
| claim-office-example-mapping | v9-pocock-tdd         | opus-4-7-portkey-no-thinking |   3 | 1.30936e+07 |  8432085 | 17623077 | 4.59692e+06 |
