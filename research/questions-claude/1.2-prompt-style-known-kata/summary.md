# RQ-prompt-known-kata — Aggregation

_Does the prompt style (prose/user-story/example-mapping) influence correctness and code quality on a training-known kata (Game of Life) — and is this effect model-dependent?_

Generated: 2026-10-12T10:46:26Z

Cells declared: 9 · matched runs: 45 · min_replicates: 5

## Cell coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| game-of-life-cli-prose | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-prose | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-prose | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-user-story | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-user-story | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-user-story | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking | 5 | 5 | ✅ |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking | 5 | 5 | ✅ |

## Outcome pivots (per cell)

### verification_pct

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   1    | 0    |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0.24 | 0.43 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   1    | 0    |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0    | 0    |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   1    | 0    |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   1    | 0    |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   0.63 | 0.51 |

### verification_passed

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   15   |  0   |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   15   |  0   |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    3.6 |  6.5 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   15   |  0   |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   15   |  0   |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    0   |  0   |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   15   |  0   |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   15   |  0   |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    9.4 |  7.7 |

### verification_total

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |     15 |    0 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |     15 |    0 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |     15 |    0 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |     15 |    0 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |     15 |    0 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |     15 |    0 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |     15 |    0 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |     15 |    0 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |     15 |    0 |

### tests_passing

| kata                             | cell_workflow              | cell_model                     |   n |   k |   null |   rate_% |
|:---------------------------------|:---------------------------|:-------------------------------|----:|----:|-------:|---------:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |   5 |      0 |      100 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |   2 |      0 |       40 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |   5 |      0 |      100 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |   0 |      0 |        0 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |   5 |      0 |      100 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |   4 |      0 |       80 |

### cli_built

| kata                             | cell_workflow              | cell_model                     |   n |   k |   null |   rate_% |
|:---------------------------------|:---------------------------|:-------------------------------|----:|----:|-------:|---------:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |   5 |      0 |      100 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |   5 |      0 |      100 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |   5 |      0 |      100 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |   5 |      0 |      100 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |   5 |      0 |      100 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |   5 |      0 |      100 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |   5 |      0 |      100 |

### code_mass

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |     sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-------:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |  249.2 |  60.96 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |  237.6 |   8.88 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   82.8 | 123.83 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |  230.2 |  32.27 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |  249.8 |  35.17 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    2   |   2.74 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |  221.6 |  48.71 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |  222.8 |  26.63 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |  224.2 | 127.59 |

### smell_total

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |    3.8 | 0.45 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |    3   | 1    |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    1.4 | 2.19 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |    4.4 | 0.89 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |    3.2 | 0.84 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    0   | 0    |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |    4   | 1.22 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |    3.4 | 1.67 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    4.8 | 4.44 |

### longest_function

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |    sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|------:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   23.4 |  2.51 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   21.8 |  3.77 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    5.6 |  5.03 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   24.2 |  2.17 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   19   |  8.12 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    1.6 |  2.19 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   20   |  8    |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   19.4 |  4.72 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   16.8 | 14.53 |

### production_loc

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |    sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|------:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   43.6 | 12.1  |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   39.6 |  3.29 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   25.6 | 34.32 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   39.4 |  7.64 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   43.8 |  8.23 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    1.8 |  2.68 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   36.2 |  9.26 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   39.6 |  4.88 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   41.6 | 25.77 |

### mccabe_max

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |    9.2 | 2.49 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |    8.8 | 1.64 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    2.6 | 4.34 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   10.6 | 0.89 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |    8.4 | 3.78 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    0   | 0    |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |    7.4 | 3.21 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |    8.6 | 1.95 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    6.8 | 4.09 |

### cognitive_max

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |   sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-----:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   14.4 | 3.71 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   11.4 | 3.91 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    2.8 | 4.76 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   17.2 | 0.45 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   12   | 6    |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    0   | 0    |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |   12.2 | 5.76 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |   12.8 | 3.96 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |    8.8 | 5.26 |

### duration_seconds

| kata                             | cell_workflow              | cell_model                     |   n |   null |   mean |     sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-------:|-------:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |  618.8 | 135.49 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |  485.4 |  37.68 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |  148.6 | 182.96 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |  724.2 | 129.77 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |  691.2 | 224.43 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |   15   |   1.58 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |  677.8 | 139.75 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |  537.8 |  94.29 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |  390.8 | 258.06 |

### total_tokens

| kata                             | cell_workflow              | cell_model                     |   n |   null |             mean |              sd |
|:---------------------------------|:---------------------------|:-------------------------------|----:|-------:|-----------------:|----------------:|
| game-of-life-cli-prose           | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |      1.21395e+07 |     3.66431e+06 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |      8.42725e+06 |     1.38081e+06 |
| game-of-life-cli-prose           | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |      5.12989e+06 |     6.76229e+06 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |      1.37844e+07 |     3.20806e+06 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |      1.29674e+07 |     4.78364e+06 |
| game-of-life-cli-user-story      | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 | 320017           | 46444.7         |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | opus-4-6-portkey-no-thinking   |   5 |      0 |      1.32846e+07 |     3.88712e+06 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | sonnet-4-6-portkey-no-thinking |   5 |      0 |      9.34068e+06 |     1.90832e+06 |
| game-of-life-cli-example-mapping | exact-single-context-v1-cc | haiku-4-5-portkey-no-thinking  |   5 |      0 |      1.08445e+07 |     6.4818e+06  |
