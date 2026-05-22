# RQ-prompt-correctness — Aggregation

_Steigert Example-Mapping die Korrektheit gegenüber Prose und User-Story — und ist der Effekt modellabhängig?_

Generated: 2026-05-22T16:38:07Z

Cells declared: 24 · matched runs: 126 · min_replicates: 5

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | v5-exact-single-context | opus-4-7 | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | opus-4-6-portkey | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-prose | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7 | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 9 | 9 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | opus-4-7 | 4 | 4 | ⚠️ unter min_replicates (4/5) |
| claim-office-user-story | v5-exact-single-context | opus-4-7-no-thinking | 3 | 1 | ⚠️ unter min_replicates (3/5) |
| claim-office-user-story | v5-exact-single-context | opus-4-6-portkey | 7 | 7 | ✅ |
| claim-office-user-story | v5-exact-single-context | opus-4-6-portkey-no-thinking | 8 | 8 | ✅ |
| claim-office-user-story | v5-exact-single-context | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-user-story | v5-exact-single-context | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome-Pivots (pro Zelle)

### verification_pct

| kata                         | workflow                | cell_model                     |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0    |  0    |  0    |  0    |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |  0    |  0    |  0    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |   0.77 |  0.2  |  1    |  0.35 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   0.87 |  0.33 |  1    |  0.3  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7                       |   5 |   0.95 |  0.73 |  1    |  0.12 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   9 |   0.97 |  0.73 |  1    |  0.09 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   0.35 |  0    |  1    |  0.41 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   0.71 |  0.4  |  0.87 |  0.18 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0    |  0    |  0    |  0    |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |  0    |  0    |  0    |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |   0.15 |  0    |  0.27 |  0.14 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   0.23 |  0.07 |  0.33 |  0.1  |
| claim-office-prose           | v5-exact-single-context | opus-4-7                       |   5 |   0.33 |  0.13 |  0.6  |  0.18 |
| claim-office-prose           | v5-exact-single-context | opus-4-7-no-thinking           |   5 |   0.21 |  0.13 |  0.27 |  0.06 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   0.21 |  0.13 |  0.27 |  0.07 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   0.23 |  0.13 |  0.27 |  0.06 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0.01 |  0    |  0.07 |  0.03 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |  0    |  0    |  0    |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   7 |   0.22 |  0    |  0.27 |  0.1  |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   8 |   0.18 |  0    |  0.33 |  0.15 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7                       |   4 |   0.2  |  0.07 |  0.33 |  0.12 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7-no-thinking           |   3 |   0.07 |  0    |  0.2  |  0.12 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   0.19 |  0.07 |  0.33 |  0.1  |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   0.17 |  0.07 |  0.27 |  0.08 |

### verification_passed

| kata                         | workflow                | cell_model                     |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |     0 |     0 |  0    |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |  11.6  |     3 |    15 |  5.27 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |  13    |     5 |    15 |  4.47 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7                       |   5 |  14.2  |    11 |    15 |  1.79 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   9 |  14.56 |    11 |    15 |  1.33 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   5.2  |     0 |    15 |  6.22 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |  10.6  |     6 |    13 |  2.7  |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0    |     0 |     0 |  0    |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |     0 |     0 |  0    |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |   2.2  |     0 |     4 |  2.05 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |   3.4  |     1 |     5 |  1.52 |
| claim-office-prose           | v5-exact-single-context | opus-4-7                       |   5 |   5    |     2 |     9 |  2.74 |
| claim-office-prose           | v5-exact-single-context | opus-4-7-no-thinking           |   5 |   3.2  |     2 |     4 |  0.84 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   3.2  |     2 |     4 |  1.1  |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   3.4  |     2 |     4 |  0.89 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |   0.2  |     0 |     1 |  0.45 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |   0    |     0 |     0 |  0    |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   7 |   3.29 |     0 |     4 |  1.5  |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   8 |   2.62 |     0 |     5 |  2.2  |
| claim-office-user-story      | v5-exact-single-context | opus-4-7                       |   4 |   3    |     1 |     5 |  1.83 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7-no-thinking           |   3 |   1    |     0 |     3 |  1.73 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |   2.8  |     1 |     5 |  1.48 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |   2.6  |     1 |     4 |  1.14 |

### verification_total

| kata                         | workflow                | cell_model                     |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:-------------------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7                       |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   9 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |     15 |    15 |    15 |     0 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | opus-4-7                       |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | opus-4-7-no-thinking           |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |     15 |    15 |    15 |     0 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   7 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   8 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7                       |   4 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7-no-thinking           |   3 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |     15 |    15 |    15 |     0 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |     15 |    15 |    15 |     0 |

### duration_seconds

| kata                         | workflow                | cell_model                     |   n |    mean |   min |   max |     std |
|:-----------------------------|:------------------------|:-------------------------------|----:|--------:|------:|------:|--------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |   31.8  |    29 |    35 |    2.28 |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  171.6  |    17 |   424 |  209.2  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 | 2301.8  |  1905 |  2755 |  308.65 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 | 2321.2  |  1942 |  2867 |  390.83 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7                       |   5 | 1128.2  |   891 |  1435 |  206.09 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   9 |  688.22 |   526 |   822 |   97.14 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 | 2541    |   874 |  4562 | 1503.65 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 | 2313.2  |  1928 |  2764 |  399.7  |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |  174.4  |    31 |   734 |  312.84 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  193.4  |    16 |   488 |  238.29 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 | 1526.8  |  1391 |  1709 |  122.04 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 | 1695.4  |  1447 |  1879 |  167.76 |
| claim-office-prose           | v5-exact-single-context | opus-4-7                       |   5 |  992.2  |   759 |  1183 |  161.42 |
| claim-office-prose           | v5-exact-single-context | opus-4-7-no-thinking           |   5 |  625.2  |   459 |   882 |  187.15 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 | 2006.6  |  1547 |  2614 |  455.78 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 | 1323.6  |  1084 |  1536 |  167.83 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |  463.2  |    36 |   802 |  391.24 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |  105.8  |    19 |   449 |  191.86 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   5 | 1818.4  |  1596 |  1987 |  142.98 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 | 1726.4  |  1323 |  2166 |  318.48 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7                       |   4 | 1017.5  |   503 |  1963 |  648.42 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7-no-thinking           |   3 | 9128    |   649 | 13662 | 7348.93 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 | 1664.8  |   964 |  2141 |  433.7  |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 | 1755.2  |  1560 |  2096 |  200.82 |

### total_tokens

| kata                         | workflow                | cell_model                     |   n |             mean |      min |      max |             std |
|:-----------------------------|:------------------------|:-------------------------------|----:|-----------------:|---------:|---------:|----------------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 | 462331           |   443413 |   487975 | 23032.7         |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |      6.54494e+06 |   302839 | 16405850 |     8.5145e+06  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |      4.89998e+07 | 39292918 | 55584203 |     6.00359e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |      5.14164e+07 | 46713470 | 56812750 |     4.06108e+06 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7                       |   5 |      3.48997e+07 | 29059380 | 41935771 |     4.8014e+06  |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   9 |      1.46868e+07 |  7282501 | 23265439 |     5.33619e+06 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |      3.75699e+07 | 15488355 | 67819498 |     2.08058e+07 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      4.81837e+07 | 39740384 | 59521612 |     7.57245e+06 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |      6.05654e+06 |   430719 | 28470170 |     1.25296e+07 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |      7.31808e+06 |   293014 | 18959572 |     9.61201e+06 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |      3.10797e+07 | 27177964 | 35157278 |     3.08574e+06 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |      3.56625e+07 | 34099386 | 38106108 |     1.53697e+06 |
| claim-office-prose           | v5-exact-single-context | opus-4-7                       |   5 |      2.57427e+07 | 20034138 | 29084174 |     4.11168e+06 |
| claim-office-prose           | v5-exact-single-context | opus-4-7-no-thinking           |   5 |      1.80114e+07 | 11743187 | 25211791 |     6.1787e+06  |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |      2.81786e+07 | 20970332 | 42797184 |     8.55052e+06 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      2.7411e+07  | 25101057 | 32117809 |     2.80943e+06 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |      1.79006e+07 |   431889 | 34194423 |     1.61997e+07 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |      3.75227e+06 |   293789 | 17411006 |     7.63559e+06 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   7 |      3.7945e+07  | 29426549 | 45329167 |     4.62244e+06 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   8 |      4.01048e+07 | 24626759 | 48631837 |     7.93036e+06 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7                       |   4 |      2.34368e+07 | 14260628 | 34282887 |     8.33659e+06 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7-no-thinking           |   3 |      7.99939e+06 |        0 | 23998170 |     1.38553e+07 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |      2.82173e+07 | 15836012 | 34942470 |     7.49981e+06 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |      3.53626e+07 | 28398925 | 47889308 |     7.53889e+06 |

### completed_within_budget (rate %)

| kata                         | workflow                | cell_model                     |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:-------------------------------|----:|--------:|---------:|
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey              |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey               |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7                       |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking           |   9 |       9 |      100 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey             |   5 |       5 |      100 |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey              |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey               |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | opus-4-7                       |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | opus-4-7-no-thinking           |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey             |   5 |       5 |      100 |
| claim-office-prose           | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey              |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | haiku-4-5-portkey-no-thinking  |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey               |   7 |       7 |      100 |
| claim-office-user-story      | v5-exact-single-context | opus-4-6-portkey-no-thinking   |   8 |       8 |      100 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7                       |   4 |       4 |      100 |
| claim-office-user-story      | v5-exact-single-context | opus-4-7-no-thinking           |   3 |       1 |       33 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey             |   5 |       5 |      100 |
| claim-office-user-story      | v5-exact-single-context | sonnet-4-6-portkey-no-thinking |   5 |       5 |      100 |
