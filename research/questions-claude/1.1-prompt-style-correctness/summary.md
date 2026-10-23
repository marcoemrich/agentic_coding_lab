# RQ-prompt-correctness — Aggregation

_Does example mapping increase correctness compared to prose and user story — and is the effect model-dependent?_

Generated: 2026-10-20T05:02:44Z

Cells declared: 24 · matched runs: 129 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | exact-single-context-v1-cc | opus-4-7 | 5 | 5 | ✅ |
| claim-office-prose | exact-single-context-v1-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | exact-single-context-v1-cc | opus-4-6-portkey | 5 | 5 | ✅ |
| claim-office-prose | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | exact-single-context-v1-cc | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-prose | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-prose | exact-single-context-v1-cc | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-prose | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7 | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking | 9 | 9 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-user-story | exact-single-context-v1-cc | opus-4-7 | 5 | 5 | ✅ |
| claim-office-user-story | exact-single-context-v1-cc | opus-4-7-no-thinking | 5 | 5 | ✅ |
| claim-office-user-story | exact-single-context-v1-cc | opus-4-6-portkey | 7 | 7 | ✅ |
| claim-office-user-story | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking | 8 | 8 | ✅ |
| claim-office-user-story | exact-single-context-v1-cc | sonnet-4-6-portkey | 5 | 5 | ✅ |
| claim-office-user-story | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| claim-office-user-story | exact-single-context-v1-cc | haiku-4-5-portkey | 5 | 5 | ✅ |
| claim-office-user-story | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                         | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |   0.29 | 0.19 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |   0.21 | 0.06 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 |   0.24 | 0.04 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   0.23 | 0.1  |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |   0.21 | 0.07 |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   0.23 | 0.06 |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |   0    | 0    |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |   0.95 | 0.12 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking           |   9 |      0 |   0.97 | 0.09 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 |   0.77 | 0.35 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   0.87 | 0.3  |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |   0.35 | 0.41 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   0.71 | 0.18 |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0    | 0    |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |   0.21 | 0.11 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |   0.28 | 0.11 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey               |   7 |      0 |   0.22 | 0.1  |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   8 |      0 |   0.18 | 0.15 |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |   0.19 | 0.1  |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   0.17 | 0.08 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |   0.01 | 0.03 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0    | 0    |

### verification_passed

| kata                         | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |   4.4  | 2.79 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |   3.2  | 0.84 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 |   3.6  | 0.55 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   3.4  | 1.52 |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |   3.2  | 1.1  |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   3.4  | 0.89 |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |   0    | 0    |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |  14.2  | 1.79 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking           |   9 |      0 |  14.56 | 1.33 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 |  11.6  | 5.27 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |  13    | 4.47 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |   5.2  | 6.22 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |  10.6  | 2.7  |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |   0    | 0    |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0    | 0    |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |   3.2  | 1.64 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |   4.2  | 1.64 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey               |   7 |      0 |   3.29 | 1.5  |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   8 |      0 |   2.62 | 2.2  |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |   2.8  | 1.48 |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   2.6  | 1.14 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |   0.2  | 0.45 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0    | 0    |

### verification_total

| kata                         | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:-----------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |     15 |    0 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |     15 |    0 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 |     15 |    0 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |     15 |    0 |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |     15 |    0 |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |     15 |    0 |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking           |   9 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |     15 |    0 |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |     15 |    0 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |     15 |    0 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |     15 |    0 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey               |   7 |      0 |     15 |    0 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   8 |      0 |     15 |    0 |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |     15 |    0 |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |     15 |    0 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |     15 |    0 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |     15 |    0 |

### duration_seconds

| kata                         | cell_workflow              | cell_model                     |   n |   null |    mean |      sd |
|:-----------------------------|:---------------------------|:-------------------------------|----:|-------:|--------:|--------:|
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 | 1218.6  |  576.23 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |  625.2  |  187.15 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 | 1526.8  |  122.04 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 | 1695.4  |  167.76 |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 | 2006.6  |  455.78 |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 | 1323.6  |  167.83 |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |  174.4  |  312.84 |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |  193.4  |  238.29 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 | 1128.2  |  206.09 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking           |   9 |      0 |  688.22 |   97.14 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 | 2094    |  582.34 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 | 2321.2  |  390.83 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 | 2541    | 1503.65 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 | 2313.2  |  399.7  |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |   31.8  |    2.28 |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |  171.6  |  209.2  |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 | 1112.8  |  600.63 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |  750.8  |  354.83 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      2 | 1818.4  |  142.98 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      3 | 1726.4  |  318.48 |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 | 1664.8  |  433.7  |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 | 1755.2  |  200.82 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |  463.2  |  391.24 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |  105.8  |  191.86 |

### total_tokens

| kata                         | cell_workflow              | cell_model                     |   n |   null |             mean |              sd |
|:-----------------------------|:---------------------------|:-------------------------------|----:|-------:|-----------------:|----------------:|
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |      3.15682e+07 |     1.51673e+07 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |      1.80114e+07 |     6.1787e+06  |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 |      3.10797e+07 |     3.08574e+06 |
| claim-office-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |      3.56625e+07 |     1.53697e+06 |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |      2.81786e+07 |     8.55052e+06 |
| claim-office-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |      2.7411e+07  |     2.80943e+06 |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |      6.05654e+06 |     1.25296e+07 |
| claim-office-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |      7.31808e+06 |     9.61201e+06 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |      3.48997e+07 |     4.8014e+06  |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-7-no-thinking           |   9 |      0 |      1.46868e+07 |     5.33619e+06 |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey               |   5 |      0 |      4.55433e+07 |     8.6113e+06  |
| claim-office-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |      5.14164e+07 |     4.06108e+06 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |      3.75699e+07 |     2.08058e+07 |
| claim-office-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |      4.81837e+07 |     7.57245e+06 |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 | 462331           | 23032.7         |
| claim-office-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |      6.54494e+06 |     8.5145e+06  |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7                       |   5 |      0 |      2.78729e+07 |     1.22687e+07 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-7-no-thinking           |   5 |      0 |      2.73558e+07 |     1.47432e+07 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey               |   7 |      0 |      3.7945e+07  |     4.62244e+06 |
| claim-office-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   8 |      0 |      4.01048e+07 |     7.93036e+06 |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey             |   5 |      0 |      2.82173e+07 |     7.49981e+06 |
| claim-office-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |      3.53626e+07 |     7.53889e+06 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey              |   5 |      0 |      1.79006e+07 |     1.61997e+07 |
| claim-office-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |      3.75227e+06 |     7.63559e+06 |
