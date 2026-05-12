# RQ-1 — Aggregation

_Steigert Example-Mapping die Korrektheit gegenüber Prose und User-Story — und ist der Effekt modellabhängig?_

Generated: 2026-05-12T10:25:08Z

Cells declared: 24 · matched runs: 93 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | v5-exact-single-context | opus-4-7 | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | opus-4-6-portkey | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7 | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ⚠️ unter min_replicates (3/5) |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | opus-4-7 | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | opus-4-6-portkey | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                | model                          |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0    |  0    |  0    |  0    |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |  0    |  0    |  0    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |   0.37 |  0    |  1    |  0.44 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   0.6  |  0    |  1    |  0.55 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   3 |   1    |  1    |  1    |  0    |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   0.35 |  0    |  1    |  0.41 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   0.71 |  0.4  |  0.87 |  0.18 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0    |  0    |  0    |  0    |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |  0    |  0    |  0    |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |   0.15 |  0    |  0.27 |  0.14 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   0.23 |  0.07 |  0.33 |  0.1  |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   0.21 |  0.13 |  0.27 |  0.07 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   0.23 |  0.13 |  0.27 |  0.06 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0.01 |  0    |  0.07 |  0.03 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |  0    |  0    |  0    |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   5 |   0.25 |  0.2  |  0.27 |  0.03 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   0.23 |  0    |  0.33 |  0.13 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   0.19 |  0.07 |  0.33 |  0.1  |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   0.17 |  0.07 |  0.27 |  0.08 |

### verification_passed

| kata                         | workflow                | model                          |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    0   |     0 |     0 |  0    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |    5.6 |     0 |    15 |  6.66 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |    9   |     0 |    15 |  8.22 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   3 |   15   |    15 |    15 |  0    |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |    5.2 |     0 |    15 |  6.22 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   10.6 |     6 |    13 |  2.7  |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |    0   |     0 |     0 |  0    |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    0   |     0 |     0 |  0    |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |    2.2 |     0 |     4 |  2.05 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |    3.4 |     1 |     5 |  1.52 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |    3.2 |     2 |     4 |  1.1  |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |    3.4 |     2 |     4 |  0.89 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |    0.2 |     0 |     1 |  0.45 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |    0   |     0 |     0 |  0    |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   5 |    3.8 |     3 |     4 |  0.45 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |    3.4 |     0 |     5 |  1.95 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |    2.8 |     1 |     5 |  1.48 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |    2.6 |     1 |     4 |  1.14 |

### verification_total

| kata                         | workflow                | model                          |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   3 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |

### duration_seconds

| kata                         | workflow                | model                          |   n |    mean |   min |   max |     std |
|:-----------------------------|:------------------------|:-------------------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |   31.8  |    29 |    35 |    2.28 |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  171.6  |    17 |   424 |  209.2  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 | 2301.8  |  1905 |  2755 |  308.65 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 | 2321.2  |  1942 |  2867 |  390.83 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   3 |  684.33 |   607 |   822 |  119.53 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 | 2541    |   874 |  4562 | 1503.65 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 | 2313.2  |  1928 |  2764 |  399.7  |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |  174.4  |    31 |   734 |  312.84 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  193.4  |    16 |   488 |  238.29 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 | 1526.8  |  1391 |  1709 |  122.04 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 | 1695.4  |  1447 |  1879 |  167.76 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 | 2006.6  |  1547 |  2614 |  455.78 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 | 1323.6  |  1084 |  1536 |  167.83 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |  463.2  |    36 |   802 |  391.24 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  105.8  |    19 |   449 |  191.86 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   5 | 1818.4  |  1596 |  1987 |  142.98 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 | 1726.4  |  1323 |  2166 |  318.48 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 | 1664.8  |   964 |  2141 |  433.7  |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 | 1755.2  |  1560 |  2096 |  200.82 |

### total_tokens

| kata                         | workflow                | model                          |   n |             mean |      min |      max |              std |
|:-----------------------------|:------------------------|:-------------------------------|----:|-----------------:|---------:|---------:|-----------------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 | 462331           |   443413 |   487975 |  23032.7         |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |      6.54494e+06 |   302839 | 16405850 |      8.5145e+06  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |      4.89998e+07 | 39292918 | 55584203 |      6.00359e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |      5.14164e+07 | 46713470 | 56812750 |      4.06108e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   3 |      1.55372e+07 | 12322036 | 21511782 |      5.17918e+06 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |      3.75699e+07 | 15488355 | 67819498 |      2.08058e+07 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      4.81837e+07 | 39740384 | 59521612 |      7.57245e+06 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |      6.05654e+06 |   430719 | 28470170 |      1.25296e+07 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |      7.31808e+06 |   293014 | 18959572 |      9.61201e+06 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |      3.10797e+07 | 27177964 | 35157278 |      3.08574e+06 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |      3.56625e+07 | 34099386 | 38106108 |      1.53697e+06 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |      2.81786e+07 | 20970332 | 42797184 |      8.55052e+06 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      2.7411e+07  | 25101057 | 32117809 |      2.80943e+06 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |      1.79006e+07 |   431889 | 34194423 |      1.61997e+07 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |      3.75227e+06 |   293789 | 17411006 |      7.63559e+06 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   5 |      3.81718e+07 | 37556307 | 38793223 | 462220           |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |      3.60116e+07 | 24626759 | 43041881 |      7.19777e+06 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |      2.82173e+07 | 15836012 | 34942470 |      7.49981e+06 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      3.53626e+07 | 28398925 | 47889308 |      7.53889e+06 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                          |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-------------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   3 |       3 |      100 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
