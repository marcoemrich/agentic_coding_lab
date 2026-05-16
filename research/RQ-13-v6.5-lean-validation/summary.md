# RQ-13 — Aggregation

_Performt v6.5-lean (Four Rules raus, Pep raus, Emojis raus, mit strukturellen Rewrites + Why-Begruendungen) mindestens gleichwertig zu v6 auf Code-Qualitaet und TDD-Disziplin?_

Generated: 2026-05-16T22:39:32Z

Cells declared: 2 · matched runs: 15 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.5-lean | opus-4-7-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |  145   |   140 |   148 |  3    |

### smell_total

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |    2.2 |     2 |     3 |  0.45 |

### cc_longest_function

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |   14.6 |     6 |    24 |  6.84 |

### cognitive_max

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |    5.2 |     2 |    12 |  4.09 |

### mccabe_max

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |    4.6 |     3 |     8 |  2.07 |

### refactorings_applied

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    4   |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |    6.8 |     4 |    10 |  2.68 |

### cycle_count

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |    8.4 |     8 |    10 |  0.89 |

### predictions_correct_rate (pooled %)

| kata                         | workflow   | model                |   n |   correct |   total |   rate_% |
|:-----------------------------|:-----------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |       169 |     170 |     99.4 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |        86 |      86 |    100   |

### tests_passed_immediately

| kata                         | workflow   | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |    1.8 |     0 |     5 |  2.49 |

### duration_seconds

| kata                         | workflow   | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:-----------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |  521.4 |   427 |   711 |  95.48 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |  628   |   440 |   902 | 180.89 |

### total_tokens

| kata                         | workflow   | model                |   n |        mean |     min |      max |         std |
|:-----------------------------|:-----------|:---------------------|----:|------------:|--------:|---------:|------------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 | 6.62354e+06 | 4863281 |  8557921 | 1.31893e+06 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 | 7.52499e+06 | 6100822 | 10942484 | 1.95399e+06 |

### tests_passing (rate %)

| kata                         | workflow   | model                |   n |   match |   rate_% |
|:-----------------------------|:-----------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |       5 |      100 |

### verification_pct (rate %)

| kata                         | workflow   | model                |   n |   match |   rate_% |
|:-----------------------------|:-----------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow   | model                |   n |   match |   rate_% |
|:-----------------------------|:-----------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid  | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean  | opus-4-7-no-thinking |   5 |       5 |      100 |
