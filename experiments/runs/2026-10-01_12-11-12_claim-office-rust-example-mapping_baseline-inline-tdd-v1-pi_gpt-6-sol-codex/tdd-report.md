# TDD phase chain — 2026-10-01_12-11-12_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

**11 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red -> Green -> Red -> Green -> Red -> Green -> Red -> Red(c) -> Green -> Skip -> Refactor
```

Deviations present: `Skip` ×1 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 11 |
| `cycles_total` | 5 |
| `cycles_closed` | 4 |
| `test_first_rate` | 0.833 |
| `red_batch_size` | 1.5 |
| `red_batch_max` | 2 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 2.0 |
| `refactor_events` | 1 |
| `skip_events` | 1 |
| `refactor_per_cycle` | 0.25 |
| `green_attempts` | 0.0 |
| `deviations` | 1 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.763 |
| `tdd_discipline_test_first` | 0.833 |
| `tdd_discipline_step` | 0.667 |
| `tdd_discipline_closure` | 0.8 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (4 of 5 closed with a Green)

  1. `1–2`  Red -> Green
  2. `3–4`  Red -> Green
  3. `5–6`  Red -> Green
  4. `7–9`  Red -> Red(c) -> Green
  5. `10–11`  Skip -> Refactor  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 4 | a new failing test arrived |
| `Green` | 4 | implementation changed, suite went green |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Skip` | 1 | test arrived and passed immediately — never red |
| `Refactor` | 1 | implementation changed, suite stayed green |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red | fail | 0/1 | _(initial tree: 2 files)_ |
| 2 | Green | pass | 1/0 | `src/lib.rs` |
| 3 | Red | fail | 1/2 | `src/lib.rs#test` |
| 4 | Green | pass | 3/0 | `src/lib.rs` |
| 5 | Red | fail | 4/2 | `src/lib.rs#test` |
| 6 | Green | pass | 6/0 | `src/lib.rs` |
| 7 | Red | fail | 7/1 | `src/lib.rs#test` |
| 8 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test`, `tests/cli.rs#test` |
| 9 | Green | pass | 10/0 | `src/main.rs` |
| 10 | Skip | pass | 12/0 | `src/lib.rs#test` |
| 11 | Refactor | pass | 12/0 | `src/lib.rs` |

Final suite state: **pass**.

