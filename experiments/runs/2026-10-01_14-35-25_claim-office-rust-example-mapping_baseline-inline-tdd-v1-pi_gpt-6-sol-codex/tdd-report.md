# TDD phase chain — 2026-10-01_14-35-25_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

**7 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Red -> Green? -> Red(c) -> Green -> Skip -> Verify
```

Deviations present: `Green?` ×1 (implementation changed, still failing), `Skip` ×1 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 7 |
| `cycles_total` | 2 |
| `cycles_closed` | 1 |
| `test_first_rate` | 0.75 |
| `red_batch_size` | 6.0 |
| `red_batch_max` | 6 |
| `red_batch_unmeasurable` | 2 |
| `green_batch_size` | 11.0 |
| `refactor_events` | 0 |
| `skip_events` | 1 |
| `refactor_per_cycle` | 0.0 |
| `green_attempts` | 1.0 |
| `deviations` | 1 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.397 |
| `tdd_discipline_test_first` | 0.75 |
| `tdd_discipline_step` | 0.167 |
| `tdd_discipline_closure` | 0.5 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (1 of 2 closed with a Green)

  1. `1–5`  Red(c) -> Red -> Green? -> Red(c) -> Green
  2. `6–7`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red(c)` | 2 | test arrived, suite does not compile yet |
| `Red` | 1 | a new failing test arrived |
| `Green?` | 1 | implementation changed, still failing |
| `Green` | 1 | implementation changed, suite went green |
| `Skip` | 1 | test arrived and passed immediately — never red |
| `Verify` | 1 | nothing changed, suite re-run |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red | fail | 1/6 | `src/lib.rs` |
| 3 | Green? | fail | 5/2 | `src/lib.rs` |
| 4 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test`, `tests/cli.rs#test` |
| 5 | Green | pass | 11/0 | `src/main.rs` |
| 6 | Skip | pass | 12/0 | `src/lib.rs#test` |
| 7 | Verify | pass | 12/0 | — |

Final suite state: **pass**.

