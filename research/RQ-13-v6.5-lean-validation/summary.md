# RQ-13 — Aggregation

_Performt v6.5-lean (Four Rules raus, Pep raus, Emojis raus, mit strukturellen Rewrites + Why-Begruendungen) mindestens gleichwertig zu v6 auf Code-Qualitaet und TDD-Disziplin?_

Generated: 2026-05-17T00:09:20Z

Cells declared: 2 · matched runs: 20 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.5-lean | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |  143.9 |   133 |   154 |  6.06 |

### smell_total

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |

### cc_longest_function

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |   12.7 |     6 |    24 |  5.79 |

### cognitive_max

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |    5.1 |     2 |    12 |  3.84 |

### mccabe_max

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |    4.5 |     3 |     8 |  2.01 |

### refactorings_applied

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    4   |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |    6.9 |     3 |    10 |  2.33 |

### cycle_count

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |    8.2 |     8 |    10 |  0.63 |

### predictions_correct_rate (pooled %)

| kata                         | workflow   | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |       169 |     170 |     99.4 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |       166 |     166 |    100   |

### tests_passed_immediately

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |    1.4 |     0 |     5 |  2.27 |

### duration_seconds

| kata                         | workflow   | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |  521.4 |   427 |   711 |  95.48 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |  623.6 |   440 |   902 | 136.94 |

### total_tokens

| kata                         | workflow   | model                |   n |        mean |     min |      max |         std |
|:-----------------------------|:-----------|:---------------------|----:|------------:|--------:|---------:|------------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 | 6.62354e+06 | 4863281 |  8557921 | 1.31893e+06 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 | 7.40528e+06 | 5251393 | 10942484 | 1.57655e+06 |

### tests_passing (rate %)

| kata                         | workflow   | model                |   n |   match |   rate_% |
|:-----------------------------|:-----------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow   | model                |   n |   match |   rate_% |
|:-----------------------------|:-----------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow   | model                |   n |   match |   rate_% |
|:-----------------------------|:-----------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |  10 |      10 |      100 |
