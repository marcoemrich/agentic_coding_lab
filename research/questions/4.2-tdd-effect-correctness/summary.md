# RQ-tdd-correctness — Aggregation

_Unterscheidet sich die externe Korrektheit (verification_pct) zwischen TDD-Workflow-Varianten auf der neuartigen claim-office-Kata?_

Generated: 2026-05-22T16:38:09Z

Cells declared: 5 · matched runs: 34 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-example-mapping | v3-basic-tdd | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v4-exact-subagents | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking | 9 | 9 | ✅ |
| claim-office-example-mapping | v6-hybrid | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |   0.67 |  0.2  |     1 |  0.36 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |   0.96 |  0.8  |     1 |  0.09 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |   0.97 |  0.73 |     1 |  0.09 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |   1    |  1    |     1 |  0    |

### verification_passed

| kata                         | workflow                | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |  15    |    15 |    15 |  0    |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |  10    |     3 |    15 |  5.33 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |  14.4  |    12 |    15 |  1.34 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |  14.56 |    11 |    15 |  1.33 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |  15    |    15 |    15 |  0    |

### verification_total

| kata                         | workflow                | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |

### tests_passing (rate %)

| kata                         | workflow                | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |       9 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |       9 |      100 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### cycle_count

| kata                         | workflow                | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |   3.8  |     3 |     6 |  1.3  |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |  37.8  |    16 |    49 |  9.51 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |  44.6  |    34 |    55 |  8.59 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |   3.44 |     1 |     5 |  1.51 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |  25.8  |     8 |    33 | 10.8  |

### refactorings_applied

| kata                         | workflow                | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |    1.8 |     1 |     2 |  0.45 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |   16.4 |     3 |    27 |  7.4  |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |    6.8 |     2 |    19 |  7.09 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |    2   |     1 |     3 |  0.87 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |   10.4 |     4 |    13 |  3.78 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |       473 |     487 |     97.1 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |       302 |     325 |     92.9 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |        46 |      46 |    100   |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |       176 |     177 |     99.4 |

### tests_passed_immediately

| kata                         | workflow                | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |   0.6  |     0 |     2 |  0.89 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 |  17.8  |     6 |    27 |  6.97 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 |  22.2  |    15 |    29 |  6.14 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |   0.89 |     0 |     3 |  1.17 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 |  10    |     2 |    14 |  4.74 |

### duration_seconds

| kata                         | workflow                | cell_model                   |   n |    mean |   min |   max |    std |
|:-----------------------------|:------------------------|:-----------------------------|----:|--------:|------:|------:|-------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 |  312.4  |   257 |   381 |  53.36 |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 | 3692.7  |  1640 |  4822 | 942.11 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 | 3228.8  |  2180 |  4333 | 919.93 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 |  688.22 |   526 |   822 |  97.14 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 | 2116    |  1058 |  2883 | 716.26 |

### total_tokens

| kata                         | workflow                | cell_model                   |   n |        mean |      min |      max |              std |
|:-----------------------------|:------------------------|:-----------------------------|----:|------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v3-basic-tdd            | opus-4-7-portkey-no-thinking |   5 | 3.28141e+06 |  2734813 |  4185323 | 545757           |
| claim-office-example-mapping | v4-exact-subagents      | opus-4-7-portkey-no-thinking |  10 | 1.3655e+07  |  9411553 | 16548065 |      2.09204e+06 |
| claim-office-example-mapping | v4.1-testlist-scope-fix | opus-4-7-portkey-no-thinking |   5 | 1.41003e+07 | 11422803 | 18869365 |      2.99239e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-portkey-no-thinking |   9 | 1.46868e+07 |  7282501 | 23265439 |      5.33619e+06 |
| claim-office-example-mapping | v6-hybrid               | opus-4-7-portkey-no-thinking |   5 | 3.3248e+07  | 21492140 | 39096785 |      7.41969e+06 |
