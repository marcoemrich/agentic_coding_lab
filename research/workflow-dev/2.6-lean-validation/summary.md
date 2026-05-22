# RQ-lean — Aggregation

_Performt v6.5-lean (Four Rules raus, Pep raus, Emojis raus, mit strukturellen Rewrites + Why-Begruendungen) mindestens gleichwertig zu v6 auf Code-Qualitaet und TDD-Disziplin?_

Generated: 2026-05-22T16:38:12Z

Cells declared: 3 · matched runs: 30 · min_replicates: 10

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-example-mapping | v6-hybrid | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.5-lean | opus-4-7-no-thinking | 10 | 10 | ✅ |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking | 10 | 10 | ✅ |

## Outcome-Pivots (pro Zelle)

### code_mass

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |  158.6 |   140 |   187 | 15.14 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |  143.9 |   133 |   154 |  6.06 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |  146.4 |   134 |   169 | 10.27 |

### smell_total

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |    2.2 |     2 |     3 |  0.42 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |    2.5 |     2 |     3 |  0.53 |

### cc_longest_function

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |   13.1 |     4 |    21 |  5.97 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |   12.7 |     6 |    24 |  5.79 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |   15.7 |    10 |    22 |  4.99 |

### cognitive_max

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    5.2 |     1 |     7 |  2.3  |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |    5.1 |     2 |    12 |  3.84 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |    5.8 |     2 |    12 |  4.02 |

### mccabe_max

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    4.5 |     2 |     7 |  1.51 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |    4.5 |     3 |     8 |  2.01 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |    5   |     3 |     8 |  2.05 |

### refactorings_applied

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    4   |     3 |     8 |  1.63 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |    6.9 |     3 |    10 |  2.33 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |    5.9 |     3 |     8 |  1.45 |

### cycle_count

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    8.3 |     7 |    10 |  0.82 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |    8.2 |     8 |    10 |  0.63 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |    6   |     4 |     8 |  1.25 |

### predictions_correct_rate (pooled %)

| kata                         | workflow    | cell_model           |   n |   correct |   total |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|----------:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |       169 |     170 |     99.4 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |       166 |     166 |    100   |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |       119 |     122 |     97.5 |

### tests_passed_immediately

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |    3.3 |     0 |     7 |  3.02 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |    1.4 |     0 |     5 |  2.27 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |    0.4 |     0 |     2 |  0.7  |

### duration_seconds

| kata                         | workflow    | cell_model           |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------|:---------------------|----:|-------:|------:|------:|-------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |  521.4 |   427 |   711 |  95.48 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |  623.6 |   440 |   902 | 136.94 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |  802.5 |   320 |  2656 | 661.72 |

### total_tokens

| kata                         | workflow    | cell_model           |   n |        mean |     min |      max |         std |
|:-----------------------------|:------------|:---------------------|----:|------------:|--------:|---------:|------------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 | 6.62354e+06 | 4863281 |  8557921 | 1.31893e+06 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 | 7.40528e+06 | 5251393 | 10942484 | 1.57655e+06 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 | 6.21911e+06 | 3357376 |  7345819 | 1.22247e+06 |

### tests_passing (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |      10 |      100 |

### verification_pct (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |      10 |      100 |

### completed_within_budget (rate %)

| kata                         | workflow    | cell_model           |   n |   match |   rate_% |
|:-----------------------------|:------------|:---------------------|----:|--------:|---------:|
| game-of-life-example-mapping | v6-hybrid   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.5-lean   | opus-4-7-no-thinking |  10 |      10 |      100 |
| game-of-life-example-mapping | v6.6-leaner | opus-4-7-no-thinking |  10 |      10 |      100 |
