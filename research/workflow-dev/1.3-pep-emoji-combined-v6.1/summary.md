# RQ-pep-emoji-v6.1 — Aggregation

_Sind die Effekte der pep- und emoji-Reduktionen auf v6.1-Basis additiv (zwei unabhaengige Kanaele) oder gemeinsam getragen (ein 'Prompt-Drumherum'-Mechanismus)?_

Generated: 2026-05-23T20:51:58Z

Cells declared: 4 · matched runs: 25 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.1-no-pep | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.1-no-emoji | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji | opus-4-7-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |  153.7 |   131 |   191 | 18.79 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |  156.8 |   146 |   172 | 10.06 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |  144.6 |   130 |   161 | 11.67 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |  153.2 |   136 |   161 | 11.08 |

### smell_total

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |    2.4 |     2 |     3 |  0.52 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    2   |     2 |     2 |  0    |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    2   |     2 |     2 |  0    |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |

### cc_longest_function

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |   14.2 |     2 |    25 |  6.25 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |   11.4 |     4 |    15 |  4.34 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |   13.2 |     2 |    25 |  9.73 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |   16.2 |    13 |    20 |  3.27 |

### cognitive_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |    6.5 |     2 |    12 |  3.24 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    6.6 |     4 |    10 |  2.3  |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    4.6 |     2 |     8 |  2.79 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    7.8 |     7 |    10 |  1.3  |

### mccabe_max

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |    5.2 |     3 |     8 |  1.69 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    4.6 |     4 |     6 |  0.89 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    4.8 |     3 |     7 |  2.05 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    5   |     4 |     7 |  1.41 |

### refactorings_applied

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |    4.1 |     2 |     7 |  1.97 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    5.4 |     3 |     9 |  2.88 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    7   |     3 |    10 |  3.24 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    3.8 |     3 |     5 |  0.84 |

### cycle_count

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |    8.7 |     7 |     9 |  0.67 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    8.8 |     8 |     9 |  0.45 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    8.8 |     8 |    10 |  0.84 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    9.2 |     9 |    10 |  0.45 |

### predictions_correct_rate (pooled %)

| kata                         | workflow                       | cell_model                   |   n |   correct |   total |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |       172 |     173 |     99.4 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |        86 |      88 |     97.7 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |        79 |      79 |    100   |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |        71 |      72 |     98.6 |

### tests_passed_immediately

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |   std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |    4.7 |     0 |     7 |  2.75 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |    2.2 |     0 |     6 |  3.03 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |    1.2 |     0 |     6 |  2.68 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |    1.2 |     0 |     6 |  2.68 |

### duration_seconds

| kata                         | workflow                       | cell_model                   |   n |   mean |   min |   max |    std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |  507.9 |   292 |   727 | 147.13 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |  668.8 |   493 |   896 | 200.58 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |  777.2 |   474 |   987 | 216.69 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |  432   |   373 |   493 |  43.77 |

### total_tokens

| kata                         | workflow                       | cell_model                   |   n |        mean |     min |      max |              std |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|------------:|--------:|---------:|-----------------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 | 6.94053e+06 | 5264335 |  9796559 |      1.36348e+06 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 | 7.77662e+06 | 6124991 |  9536497 |      1.30671e+06 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 | 8.65681e+06 | 5934545 | 10393293 |      1.81888e+06 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 | 7.57597e+06 | 7031186 |  7951054 | 384237           |

### tests_passing (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### verification_pct (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow                       | cell_model                   |   n |   match |   rate_% |
|:-----------------------------|:-------------------------------|:-----------------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6.1-hybrid-testlist-scope-fix | opus-4-7-portkey-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.1-no-emoji                  | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep                    | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-example-mapping | v6.1-no-pep-no-emoji           | opus-4-7-portkey-no-thinking |   5 |       5 |      100 |
