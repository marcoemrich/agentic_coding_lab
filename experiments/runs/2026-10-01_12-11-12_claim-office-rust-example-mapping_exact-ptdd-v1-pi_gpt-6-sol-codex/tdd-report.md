# TDD phase chain — 2026-10-01_12-11-12_claim-office-rust-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

**40 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Red(c) -> Red -> Green -> Verify -> Red -> Green -> Verify -> Both -> Refactor -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Verify -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Skip` ×11 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 40 |
| `cycles_total` | 22 |
| `cycles_closed` | 9 |
| `test_first_rate` | 0.455 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 6.0 |
| `refactor_events` | 3 |
| `skip_events` | 11 |
| `refactor_per_cycle` | 0.333 |
| `green_attempts` | 0.0 |
| `deviations` | 12 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.571 |
| `tdd_discipline_test_first` | 0.455 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.409 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (9 of 22 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–6`  Red(c) -> Red -> Green -> Verify
  4. `7–9`  Red -> Green -> Verify
  5. `10–12`  Both -> Refactor -> Verify  ← never closed
  6. `13–15`  Red -> Green -> Refactor
  7. `16–17`  Red -> Green
  8. `18–19`  Red -> Green
  9. `20–21`  Red -> Green
 10. `22–23`  Red -> Green
 11. `24–25`  Skip -> Verify  ← never closed
 12. `26–27`  Red -> Green
 13. `28–28`  Skip  ← never closed
 14. `29–29`  Skip  ← never closed
 15. `30–30`  Skip  ← never closed
 16. `31–32`  Skip -> Verify  ← never closed
 17. `33–35`  Red -> Green -> Refactor
 18. `36–36`  Skip  ← never closed
 19. `37–37`  Skip  ← never closed
 20. `38–38`  Skip  ← never closed
 21. `39–39`  Skip  ← never closed
 22. `40–40`  Skip  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 11 | test arrived and passed immediately — never red |
| `Red` | 9 | a new failing test arrived |
| `Green` | 9 | implementation changed, suite went green |
| `Verify` | 5 | nothing changed, suite re-run |
| `Refactor` | 3 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Both` | 1 | test and implementation changed together — no verified red |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 0 files)_ |
| 2 | Skip | pass | 0/0 | `tests/scenarios.rs#test` |
| 3 | Red(c) | fail (1 collect err) | 0/0 | `tests/scenarios.rs#test` |
| 4 | Red | fail | 0/1 | `src/lib.rs` |
| 5 | Green | pass | 1/0 | `src/lib.rs` |
| 6 | Verify | pass | 1/0 | — |
| 7 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 8 | Green | pass | 1/0 | `src/lib.rs` |
| 9 | Verify | pass | 2/0 | — |
| 10 | Both | fail | 0/1 | `src/main.rs`, `tests/scenarios.rs#test` |
| 11 | Refactor | pass | 1/0 | `src/lib.rs` |
| 12 | Verify | pass | 3/0 | — |
| 13 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 14 | Green | pass | 4/0 | `src/lib.rs` |
| 15 | Refactor | pass | 4/0 | `src/lib.rs` |
| 16 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 17 | Green | pass | 5/0 | `src/lib.rs` |
| 18 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 19 | Green | pass | 6/0 | `src/lib.rs` |
| 20 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 21 | Green | pass | 7/0 | `src/lib.rs` |
| 22 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 23 | Green | pass | 8/0 | `src/lib.rs` |
| 24 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 25 | Verify | pass | 9/0 | — |
| 26 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 27 | Green | pass | 10/0 | `src/lib.rs` |
| 28 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 29 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 30 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 31 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 32 | Verify | pass | 14/0 | — |
| 33 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 34 | Green | pass | 15/0 | `src/lib.rs` |
| 35 | Refactor | pass | 15/0 | `src/lib.rs` |
| 36 | Skip | pass | 23/0 | `tests/scenarios.rs#test` |
| 37 | Skip | pass | 29/0 | `tests/scenarios.rs#test` |
| 38 | Skip | pass | 36/0 | `tests/scenarios.rs#test` |
| 39 | Skip | pass | 42/0 | `tests/scenarios.rs#test` |
| 40 | Skip | pass | 42/0 | `tests/scenarios.rs#test` |

Final suite state: **pass**.

