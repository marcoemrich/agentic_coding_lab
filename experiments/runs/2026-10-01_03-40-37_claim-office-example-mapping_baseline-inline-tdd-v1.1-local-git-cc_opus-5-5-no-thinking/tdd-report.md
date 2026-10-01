# TDD phase chain — 2026-10-01_03-40-37_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

**10 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Green -> Red -> Green -> Red(c) -> Green -> Red -> Green -> Verify -> Refactor
```

No deviations — every invocation falls in the healthy vocabulary.

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 10 |
| `cycles_total` | 4 |
| `cycles_closed` | 4 |
| `test_first_rate` | 1.0 |
| `red_batch_size` | 7.5 |
| `red_batch_max` | 12 |
| `red_batch_unmeasurable` | 2 |
| `green_batch_size` | 8.5 |
| `refactor_events` | 1 |
| `skip_events` | 0 |
| `refactor_per_cycle` | 0.25 |
| `green_attempts` | 0.0 |
| `deviations` | 0 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.511 |
| `tdd_discipline_test_first` | 1.0 |
| `tdd_discipline_step` | 0.133 |
| `tdd_discipline_closure` | 1.0 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (4 of 4 closed with a Green)

  1. `1–2`  Red(c) -> Green
  2. `3–4`  Red -> Green
  3. `5–6`  Red(c) -> Green
  4. `7–10`  Red -> Green -> Verify -> Refactor

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Green` | 4 | implementation changed, suite went green |
| `Red(c)` | 2 | test arrived, suite does not compile yet |
| `Red` | 2 | a new failing test arrived |
| `Verify` | 1 | nothing changed, suite re-run |
| `Refactor` | 1 | implementation changed, suite stayed green |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Green | pass | 5/0 | `src/catalog.ts`, `src/premium.ts` |
| 3 | Red | fail | 6/12 | `src/premium.spec.ts` |
| 4 | Green | pass | 18/0 | `src/premium.ts` |
| 5 | Red(c) | fail (1 collect err) | 18/0 | `src/policy.spec.ts` |
| 6 | Green | pass | 37/0 | `src/policy.ts` |
| 7 | Red | fail | 43/3 | `src/cli.spec.ts` |
| 8 | Green | pass | 46/0 | `src/cli.ts`, `src/scenario.ts` |
| 9 | Verify | pass | 46/0 | — |
| 10 | Refactor | pass | 46/0 | `src/policy.ts`, `src/premium.ts` |

Final suite state: **pass**.

