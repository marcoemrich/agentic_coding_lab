# TDD phase chain — 2026-10-01_12-12-08_claim-office-rust-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

**35 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Green -> Both -> Refactor -> Both -> Refactor -> Skip -> Red -> Green -> Both -> Refactor -> Red(c) -> Break(c) -> Green -> Both -> Both -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Both -> Break -> Verify -> Green -> Skip -> Both -> Refactor -> Verify
```

Deviations present: `Both` ×7 (test and implementation changed together — no verified red), `Break` ×1 (implementation change broke a green suite), `Break(c)` ×1 (implementation change broke compilation of a green suite), `Skip` ×3 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 35 |
| `cycles_total` | 17 |
| `cycles_closed` | 8 |
| `test_first_rate` | 0.412 |
| `red_batch_size` | 2.0 |
| `red_batch_max` | 2 |
| `red_batch_unmeasurable` | 2 |
| `green_batch_size` | 1.5 |
| `refactor_events` | 6 |
| `skip_events` | 3 |
| `refactor_per_cycle` | 0.75 |
| `green_attempts` | 0.0 |
| `deviations` | 12 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.459 |
| `tdd_discipline_test_first` | 0.412 |
| `tdd_discipline_step` | 0.5 |
| `tdd_discipline_closure` | 0.471 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (8 of 17 closed with a Green)

  1. `1–2`  Red(c) -> Green
  2. `3–4`  Both -> Refactor  ← never closed
  3. `5–6`  Both -> Refactor  ← never closed
  4. `7–7`  Skip  ← never closed
  5. `8–9`  Red -> Green
  6. `10–11`  Both -> Refactor  ← never closed
  7. `12–14`  Red(c) -> Break(c) -> Green
  8. `15–15`  Both  ← never closed
  9. `16–17`  Both -> Refactor  ← never closed
 10. `18–20`  Red -> Green -> Refactor
 11. `21–22`  Red -> Green
 12. `23–24`  Red -> Green
 13. `25–26`  Red -> Green
 14. `27–27`  Skip  ← never closed
 15. `28–31`  Both -> Break -> Verify -> Green
 16. `32–32`  Skip  ← never closed
 17. `33–35`  Both -> Refactor -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Green` | 8 | implementation changed, suite went green |
| `Both` | 7 | test and implementation changed together — no verified red |
| `Refactor` | 6 | implementation changed, suite stayed green |
| `Red` | 5 | a new failing test arrived |
| `Skip` | 3 | test arrived and passed immediately — never red |
| `Red(c)` | 2 | test arrived, suite does not compile yet |
| `Verify` | 2 | nothing changed, suite re-run |
| `Break(c)` | 1 | implementation change broke compilation of a green suite |
| `Break` | 1 | implementation change broke a green suite |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Green | pass | 1/0 | `src/lib.rs` |
| 3 | Both | fail | 1/1 | `src/lib.rs`, `src/lib.rs#test` |
| 4 | Refactor | pass | 2/0 | `src/lib.rs` |
| 5 | Both | fail | 2/2 | `src/lib.rs`, `src/lib.rs#test` |
| 6 | Refactor | pass | 4/0 | `src/lib.rs` |
| 7 | Skip | pass | 7/0 | `src/lib.rs#test` |
| 8 | Red | fail | 7/2 | `src/lib.rs#test` |
| 9 | Green | pass | 9/0 | `src/lib.rs` |
| 10 | Both | fail (1 collect err) | 0/0 | `src/lib.rs`, `src/lib.rs#test` |
| 11 | Refactor | pass | 10/0 | `src/lib.rs` |
| 12 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 13 | Break(c) | fail (1 collect err) | 0/0 | `src/lib.rs` |
| 14 | Green | pass | 11/0 | `src/lib.rs` |
| 15 | Both | pass | 11/0 | `src/lib.rs`, `src/lib.rs#test`, `src/money.rs`, `src/quote.rs`, `src/quote.rs#test` |
| 16 | Both | fail (1 collect err) | 0/0 | `src/claim.rs#test`, `src/lib.rs` |
| 17 | Refactor | pass | 12/0 | `src/claim.rs` |
| 18 | Red | fail | 15/2 | `src/claim.rs#test` |
| 19 | Green | pass | 17/0 | `src/claim.rs` |
| 20 | Refactor | pass | 17/0 | `src/claim.rs` |
| 21 | Red | fail | 17/1 | `src/claim.rs#test` |
| 22 | Green | pass | 18/0 | `src/claim.rs` |
| 23 | Red | fail | 20/2 | `src/claim.rs#test` |
| 24 | Green | pass | 22/0 | `src/claim.rs` |
| 25 | Red | fail | 22/1 | `src/claim.rs#test` |
| 26 | Green | pass | 23/0 | `src/claim.rs` |
| 27 | Skip | pass | 24/0 | `src/claim.rs#test` |
| 28 | Both | fail (1 collect err) | 0/0 | `src/lib.rs`, `src/scenario.rs#test` |
| 29 | Break | fail | 24/1 | `src/scenario.rs` |
| 30 | Verify | fail | 24/1 | — |
| 31 | Green | pass | 25/0 | `src/scenario.rs` |
| 32 | Skip | pass | 28/0 | `src/scenario.rs#test` |
| 33 | Both | pass | 28/0 | `src/claim.rs`, `src/claim.rs#test`, `src/lib.rs`, `src/main.rs`, `src/scenario.rs` |
| 34 | Refactor | pass | 28/0 | `src/quote.rs` |
| 35 | Verify | pass | 28/0 | — |

Final suite state: **pass**.

