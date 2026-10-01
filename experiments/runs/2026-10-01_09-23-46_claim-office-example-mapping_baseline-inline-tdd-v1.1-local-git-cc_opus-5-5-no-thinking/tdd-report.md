# TDD phase chain — 2026-10-01_09-23-46_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

**7 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Green -> Red(c) -> Green -> Red(c) -> Green -> Refactor
```

No deviations — every invocation falls in the healthy vocabulary.

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 7 |
| `cycles_total` | 3 |
| `cycles_closed` | 3 |
| `test_first_rate` | 1.0 |
| `red_batch_size` | None |
| `red_batch_max` | None |
| `red_batch_unmeasurable` | 3 |
| `green_batch_size` | 15.0 |
| `refactor_events` | 1 |
| `skip_events` | 0 |
| `refactor_per_cycle` | 0.333 |
| `green_attempts` | 0.0 |
| `deviations` | 0 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | None |
| `tdd_discipline_test_first` | 1.0 |
| `tdd_discipline_step` | None |
| `tdd_discipline_closure` | 1.0 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (3 of 3 closed with a Green)

  1. `1–2`  Red(c) -> Green
  2. `3–4`  Red(c) -> Green
  3. `5–7`  Red(c) -> Green -> Refactor

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red(c)` | 3 | test arrived, suite does not compile yet |
| `Green` | 3 | implementation changed, suite went green |
| `Refactor` | 1 | implementation changed, suite stayed green |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Green | pass | 15/0 | `src/catalog.ts`, `src/premium.ts` |
| 3 | Red(c) | fail (1 collect err) | 15/0 | `src/policy.spec.ts` |
| 4 | Green | pass | 31/0 | `src/policy.ts` |
| 5 | Red(c) | fail (1 collect err) | 31/0 | `src/cli.spec.ts` |
| 6 | Green | pass | 37/0 | `src/cli.ts`, `src/scenario.ts` |
| 7 | Refactor | pass | 37/0 | `src/premium.ts` |

Final suite state: **pass**.

