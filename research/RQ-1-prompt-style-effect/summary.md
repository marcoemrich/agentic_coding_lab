# RQ-1 — Aggregation

_Steigert Example-Mapping die Korrektheit gegenüber Prose und User-Story — und ist der Effekt modellabhängig?_

Generated: 2026-05-11T22:32:31Z

Cells declared: 24 · matched runs: 3 · min_replicates: 3

## Zell-Coverage

| kata | workflow | model | n | n_ok | status |
|---|---|---|---:|---:|---|
| claim-office-prose | v5-exact-single-context | opus-4-7 | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | opus-4-6-portkey | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | opus-4-6-portkey-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | sonnet-4-6 | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | haiku-4-5 | 0 | 0 | ❌ keine Runs |
| claim-office-prose | v5-exact-single-context | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7 | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking | 3 | 3 | ✅ |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | opus-4-6-portkey-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6 | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5 | 0 | 0 | ❌ keine Runs |
| claim-office-example-mapping | v5-exact-single-context | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | opus-4-7 | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | opus-4-7-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | opus-4-6-portkey | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | opus-4-6-portkey-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | sonnet-4-6 | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | sonnet-4-6-no-thinking | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | haiku-4-5 | 0 | 0 | ❌ keine Runs |
| claim-office-user-story | v5-exact-single-context | haiku-4-5-no-thinking | 0 | 0 | ❌ keine Runs |

## Outcome-Pivots (pro Zelle)

### verification_pct (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |

### verification_passed

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### verification_total

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |     15 |    15 |    15 |     0 |

### code_mass

| kata                         | workflow                | model                |   n |   mean |   min |   max |   std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|------:|
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |    835 |   759 |   883 | 66.57 |

### duration_seconds

| kata                         | workflow                | model                |   n |   mean |   min |   max |    std |
|:-----------------------------|:------------------------|:---------------------|----:|-------:|------:|------:|-------:|
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 684.33 |   607 |   822 | 119.53 |

### total_tokens

| kata                         | workflow                | model                |   n |        mean |      min |      max |         std |
|:-----------------------------|:------------------------|:---------------------|----:|------------:|---------:|---------:|------------:|
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 | 1.55372e+07 | 12322036 | 21511782 | 5.17918e+06 |

### completed_within_budget (rate %)

| kata                         | workflow                | model                |   n |   match |   rate_% |
|:-----------------------------|:------------------------|:---------------------|----:|--------:|---------:|
| claim-office-example-mapping | v5-exact-single-context | opus-4-7-no-thinking |   3 |       3 |      100 |
