# TDD phase chain — 2026-10-01_12-21-27_claim-office-rust-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

**29 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Both -> Refactor -> Red -> Green -> Both -> Both -> Refactor -> Both -> Both -> Refactor -> Both -> Refactor -> Both -> Both -> Refactor -> Skip -> Both -> Refactor -> Both -> Verify -> Refactor -> Refactor -> Both -> Refactor -> Refactor -> Skip -> Refactor -> Verify
```

Deviations present: `Both` ×11 (test and implementation changed together — no verified red), `Skip` ×2 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 29 |
| `cycles_total` | 14 |
| `cycles_closed` | 1 |
| `test_first_rate` | 0.071 |
| `red_batch_size` | 2.0 |
| `red_batch_max` | 2 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 2.0 |
| `refactor_events` | 11 |
| `skip_events` | 2 |
| `refactor_per_cycle` | 11.0 |
| `green_attempts` | 0.0 |
| `deviations` | 13 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.137 |
| `tdd_discipline_test_first` | 0.071 |
| `tdd_discipline_step` | 0.5 |
| `tdd_discipline_closure` | 0.071 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (1 of 14 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–3`  Both -> Refactor  ← never closed
  3. `4–5`  Red -> Green
  4. `6–8`  Both -> Both -> Refactor  ← never closed
  5. `9–9`  Both  ← never closed
  6. `10–11`  Both -> Refactor  ← never closed
  7. `12–13`  Both -> Refactor  ← never closed
  8. `14–14`  Both  ← never closed
  9. `15–16`  Both -> Refactor  ← never closed
 10. `17–17`  Skip  ← never closed
 11. `18–19`  Both -> Refactor  ← never closed
 12. `20–23`  Both -> Verify -> Refactor -> Refactor  ← never closed
 13. `24–26`  Both -> Refactor -> Refactor  ← never closed
 14. `27–29`  Skip -> Refactor -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Both` | 11 | test and implementation changed together — no verified red |
| `Refactor` | 11 | implementation changed, suite stayed green |
| `Skip` | 2 | test arrived and passed immediately — never red |
| `Verify` | 2 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Red` | 1 | a new failing test arrived |
| `Green` | 1 | implementation changed, suite went green |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 0 files)_ |
| 2 | Both | fail | 0/1 | `src/lib.rs`, `src/pricing.rs`, `src/pricing.rs#test` |
| 3 | Refactor | pass | 1/0 | `src/pricing.rs` |
| 4 | Red | fail | 2/2 | `src/pricing.rs#test` |
| 5 | Green | pass | 4/0 | `src/pricing.rs` |
| 6 | Both | fail | 4/1 | `src/pricing.rs`, `src/pricing.rs#test` |
| 7 | Both | fail | 4/2 | `src/pricing.rs`, `src/pricing.rs#test` |
| 8 | Refactor | pass | 6/0 | `src/pricing.rs` |
| 9 | Both | pass | 9/0 | `src/item.rs`, `src/item.rs#test`, `src/lib.rs` |
| 10 | Both | fail | 10/4 | `src/lib.rs`, `src/quote.rs`, `src/quote.rs#test` |
| 11 | Refactor | pass | 14/0 | `src/quote.rs` |
| 12 | Both | fail | 14/3 | `src/quote.rs`, `src/quote.rs#test` |
| 13 | Refactor | pass | 17/0 | `src/quote.rs` |
| 14 | Both | pass | 22/0 | `src/lib.rs`, `src/money.rs`, `src/money.rs#test` |
| 15 | Both | fail | 22/4 | `src/quote.rs`, `src/quote.rs#test` |
| 16 | Refactor | pass | 26/0 | `src/quote.rs` |
| 17 | Skip | pass | 31/0 | `src/quote.rs#test` |
| 18 | Both | fail | 31/6 | `src/claim.rs`, `src/claim.rs#test`, `src/lib.rs` |
| 19 | Refactor | pass | 37/0 | `src/claim.rs` |
| 20 | Both | fail | 38/8 | `src/claim.rs`, `src/claim.rs#test` |
| 21 | Verify | fail | 38/8 | — |
| 22 | Refactor | pass | 46/0 | `src/claim.rs` |
| 23 | Refactor | pass | 46/0 | `src/claim.rs` |
| 24 | Both | fail | 46/7 | `src/lib.rs`, `src/scenario.rs`, `src/scenario.rs#test` |
| 25 | Refactor | pass | 53/0 | `src/scenario.rs` |
| 26 | Refactor | pass | 53/0 | `src/main.rs` |
| 27 | Skip | pass | 54/0 | `src/quote.rs#test` |
| 28 | Refactor | pass | 54/0 | `src/scenario.rs` |
| 29 | Verify | pass | 54/0 | — |

Final suite state: **pass**.

