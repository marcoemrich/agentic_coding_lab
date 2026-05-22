# RQ-2 — Aggregation

_Beeinflusst der Prompt-Stil (prose/user-story/example-mapping) bei einer trainingsbekannten Kata (Game of Life) Korrektheit und Code-Qualität — und ist dieser Effekt modellabhängig?_

Generated: 2026-05-13T09:38:14Z

Cells declared: 9 · matched runs: 45 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-cli-prose | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-prose | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-prose | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-user-story | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-user-story | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-user-story | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                             | workflow                | model                          |   n |   mean |   min |   max |   std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0.63 |     0 |     1 |  0.51 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   1    |     1 |     1 |  0    |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   1    |     1 |     1 |  0    |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0.24 |     0 |     1 |  0.43 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   1    |     1 |     1 |  0    |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   1    |     1 |     1 |  0    |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |     0 |     0 |  0    |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   1    |     1 |     1 |  0    |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   1    |     1 |     1 |  0    |

### verification_passed

| kata                             | workflow                | model                          |   n |   mean |   min |   max |   std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    9.4 |     0 |    15 |   7.7 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   15   |    15 |    15 |   0   |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   15   |    15 |    15 |   0   |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    3.6 |     0 |    15 |   6.5 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   15   |    15 |    15 |   0   |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   15   |    15 |    15 |   0   |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    0   |     0 |     0 |   0   |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   15   |    15 |    15 |   0   |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   15   |    15 |    15 |   0   |

### verification_total

| kata                             | workflow                | model                          |   n |   mean |   min |   max |   std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |

### tests_passing (rate %)

| kata                             | workflow                | model                          |   n |   match |   rate_% |
|:---------------------------------|:------------------------|:-------------------------------|----:|--------:|---------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       4 |       80 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       2 |       40 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       0 |        0 |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |

### completed_within_budget (rate %)

| kata                             | workflow                | model                          |   n |   match |   rate_% |
|:---------------------------------|:------------------------|:-------------------------------|----:|--------:|---------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |

### cli_built (rate %)

| kata                             | workflow                | model                          |   n |   match |   rate_% |
|:---------------------------------|:------------------------|:-------------------------------|----:|--------:|---------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |

### code_mass

| kata                             | workflow                | model                          |   n |   mean |   min |   max |    std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  224.2 |     0 |   318 | 127.59 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |  221.6 |   159 |   282 |  48.71 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |  222.8 |   191 |   265 |  26.63 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   82.8 |     0 |   281 | 123.83 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |  249.2 |   219 |   358 |  60.96 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |  237.6 |   225 |   250 |   8.88 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    2   |     0 |     5 |   2.74 |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |  230.2 |   211 |   287 |  32.27 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |  249.8 |   218 |   307 |  35.17 |

### smell_total

| kata                             | workflow                | model                          |   n |   mean |   min |   max |   std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    4.8 |     0 |    12 |  4.44 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |    4   |     3 |     6 |  1.22 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |    3.4 |     2 |     6 |  1.67 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    1.4 |     0 |     5 |  2.19 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |    3.8 |     3 |     4 |  0.45 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |    3   |     2 |     4 |  1    |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |    4.4 |     4 |     6 |  0.89 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |    3.2 |     2 |     4 |  0.84 |

### cc_longest_function

| kata                             | workflow                | model                          |   n |   mean |   min |   max |   std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   16.8 |     0 |    34 | 14.53 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   20   |     7 |    27 |  8    |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   19.4 |    12 |    25 |  4.72 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    5.6 |     0 |    13 |  5.03 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   23.4 |    19 |    25 |  2.51 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   21.8 |    16 |    26 |  3.77 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    1.6 |     0 |     4 |  2.19 |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   24.2 |    23 |    28 |  2.17 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   19   |     8 |    26 |  8.12 |

### cc_loc

| kata                             | workflow                | model                          |   n |   mean |   min |   max |   std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   41.6 |     0 |    66 | 25.77 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   36.2 |    24 |    46 |  9.26 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   39.6 |    35 |    46 |  4.88 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   25.6 |     0 |    81 | 34.32 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   43.6 |    36 |    65 | 12.1  |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   39.6 |    37 |    45 |  3.29 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    1.8 |     0 |     6 |  2.68 |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   39.4 |    35 |    53 |  7.64 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   43.8 |    35 |    56 |  8.23 |

### mccabe_max

| kata                             | workflow                | model                          |   n |   mean |   min |   max |   std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    6.8 |     0 |    10 |  4.09 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |    7.4 |     4 |    12 |  3.21 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |    8.6 |     7 |    12 |  1.95 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    2.6 |     0 |    10 |  4.34 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |    9.2 |     6 |    11 |  2.49 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |    8.8 |     7 |    11 |  1.64 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   10.6 |     9 |    11 |  0.89 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |    8.4 |     5 |    13 |  3.78 |

### cognitive_max

| kata                             | workflow                | model                          |   n |   mean |   min |   max |   std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    8.8 |     0 |    14 |  5.26 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   12.2 |     6 |    18 |  5.76 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   12.8 |     9 |    18 |  3.96 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    2.8 |     0 |    11 |  4.76 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   14.4 |     9 |    17 |  3.71 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   11.4 |     8 |    17 |  3.91 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    0   |     0 |     0 |  0    |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   17.2 |    17 |    18 |  0.45 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   12   |     7 |    19 |  6    |

### duration_seconds

| kata                             | workflow                | model                          |   n |   mean |   min |   max |    std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|-------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  390.8 |    12 |   710 | 258.06 |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |  677.8 |   509 |   897 | 139.75 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |  537.8 |   414 |   620 |  94.29 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  148.6 |    14 |   374 | 182.96 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |  618.8 |   477 |   769 | 135.49 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |  485.4 |   432 |   531 |  37.68 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   15   |    13 |    17 |   1.58 |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |  724.2 |   543 |   896 | 129.77 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |  691.2 |   495 |  1024 | 224.43 |

### total_tokens

| kata                             | workflow                | model                          |   n |             mean |     min |      max |             std |
|:---------------------------------|:------------------------|:-------------------------------|----:|-----------------:|--------:|---------:|----------------:|
| game-of-life-cli-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |      1.08445e+07 |  287857 | 16698499 |     6.4818e+06  |
| game-of-life-cli-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |      1.32846e+07 | 9103184 | 19631161 |     3.88712e+06 |
| game-of-life-cli-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      9.34068e+06 | 7040519 | 11500220 |     1.90832e+06 |
| game-of-life-cli-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |      5.12989e+06 |  286398 | 14659709 |     6.76229e+06 |
| game-of-life-cli-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |      1.21395e+07 | 7856703 | 16746952 |     3.66431e+06 |
| game-of-life-cli-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      8.42725e+06 | 6494907 | 10239016 |     1.38081e+06 |
| game-of-life-cli-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 | 320017           |  285726 |   370968 | 46444.7         |
| game-of-life-cli-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |      1.37844e+07 | 9941566 | 17273059 |     3.20806e+06 |
| game-of-life-cli-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      1.29674e+07 | 9293089 | 20607403 |     4.78364e+06 |
