# TDD phase chain — 2026-10-23_02-20-32_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking-2

**1 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start
```

No deviations — every invocation falls in the healthy vocabulary.

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 1 |
| `cycles_total` | 1 |
| `cycles_closed` | 0 |
| `test_first_rate` | None |
| `red_batch_size` | None |
| `red_batch_max` | None |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | None |
| `refactor_events` | 0 |
| `skip_events` | 0 |
| `refactor_per_cycle` | None |
| `green_attempts` | None |
| `deviations` | 0 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | None |
| `tdd_discipline_test_first` | None |
| `tdd_discipline_step` | None |
| `tdd_discipline_closure` | 0.0 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (0 of 1 closed with a Green)

  1. `1–1`  Start  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Start` | 1 | first invocation |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |

Final suite state: **pass**.

