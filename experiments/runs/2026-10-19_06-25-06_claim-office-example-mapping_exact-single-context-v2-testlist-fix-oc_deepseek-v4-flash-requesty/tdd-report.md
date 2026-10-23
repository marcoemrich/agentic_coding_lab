# TDD phase chain — 2026-10-19_06-25-06_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

**7 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Red -> Verify -> Green
```

No deviations — every invocation falls in the healthy vocabulary.

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 7 |
| `cycles_total` | 3 |
| `cycles_closed` | 2 |
| `test_first_rate` | 1.0 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 0 |
| `skip_events` | 0 |
| `refactor_per_cycle` | 0.0 |
| `green_attempts` | 0.0 |
| `deviations` | 0 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.874 |
| `tdd_discipline_test_first` | 1.0 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.667 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (2 of 3 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red(c) -> Red -> Green
  3. `5–7`  Red -> Verify -> Green

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 2 | a new failing test arrived |
| `Green` | 2 | implementation changed, suite went green |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Verify` | 1 | nothing changed, suite re-run |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/insurance.spec.ts` |
| 3 | Red | fail | 0/1 | `src/insurance.ts` |
| 4 | Green | pass | 1/0 | `src/insurance.ts` |
| 5 | Red | fail | 1/1 | `src/insurance.spec.ts` |
| 6 | Verify | fail | 1/1 | — |
| 7 | Green | pass | 2/0 | `src/insurance.ts` |

Final suite state: **pass**.

