# TDD phase chain — 2026-10-01_14-35-25_claim-office-rust-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

**56 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Both -> Refactor -> Refactor -> Verify -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Verify -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Verify -> Skip -> Skip -> Skip -> Skip -> Skip -> Verify
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Skip` ×39 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 56 |
| `cycles_total` | 43 |
| `cycles_closed` | 2 |
| `test_first_rate` | 0.048 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 2.5 |
| `refactor_events` | 6 |
| `skip_events` | 39 |
| `refactor_per_cycle` | 3.0 |
| `green_attempts` | 0.0 |
| `deviations` | 40 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.13 |
| `tdd_discipline_test_first` | 0.048 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.047 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (2 of 43 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–6`  Both -> Refactor -> Refactor -> Verify  ← never closed
  4. `7–8`  Red -> Green
  5. `9–11`  Red -> Green -> Refactor
  6. `12–14`  Skip -> Verify -> Refactor  ← never closed
  7. `15–15`  Skip  ← never closed
  8. `16–16`  Skip  ← never closed
  9. `17–17`  Skip  ← never closed
 10. `18–18`  Skip  ← never closed
 11. `19–19`  Skip  ← never closed
 12. `20–20`  Skip  ← never closed
 13. `21–21`  Skip  ← never closed
 14. `22–22`  Skip  ← never closed
 15. `23–24`  Skip -> Verify  ← never closed
 16. `25–25`  Skip  ← never closed
 17. `26–26`  Skip  ← never closed
 18. `27–27`  Skip  ← never closed
 19. `28–28`  Skip  ← never closed
 20. `29–29`  Skip  ← never closed
 21. `30–30`  Skip  ← never closed
 22. `31–31`  Skip  ← never closed
 23. `32–32`  Skip  ← never closed
 24. `33–34`  Skip -> Refactor  ← never closed
 25. `35–35`  Skip  ← never closed
 26. `36–36`  Skip  ← never closed
 27. `37–37`  Skip  ← never closed
 28. `38–38`  Skip  ← never closed
 29. `39–39`  Skip  ← never closed
 30. `40–40`  Skip  ← never closed
 31. `41–41`  Skip  ← never closed
 32. `42–43`  Skip -> Refactor  ← never closed
 33. `44–44`  Skip  ← never closed
 34. `45–45`  Skip  ← never closed
 35. `46–46`  Skip  ← never closed
 36. `47–47`  Skip  ← never closed
 37. `48–48`  Skip  ← never closed
 38. `49–50`  Skip -> Verify  ← never closed
 39. `51–51`  Skip  ← never closed
 40. `52–52`  Skip  ← never closed
 41. `53–53`  Skip  ← never closed
 42. `54–54`  Skip  ← never closed
 43. `55–56`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 39 | test arrived and passed immediately — never red |
| `Refactor` | 6 | implementation changed, suite stayed green |
| `Verify` | 5 | nothing changed, suite re-run |
| `Red` | 2 | a new failing test arrived |
| `Green` | 2 | implementation changed, suite went green |
| `Start` | 1 | first invocation |
| `Both` | 1 | test and implementation changed together — no verified red |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 0 files)_ |
| 2 | Skip | pass | 0/0 | `tests/scenarios.rs#test` |
| 3 | Both | fail | 0/1 | `src/main.rs`, `tests/scenarios.rs#test` |
| 4 | Refactor | pass | 1/0 | `src/main.rs` |
| 5 | Refactor | pass | 1/0 | `src/lib.rs`, `src/main.rs` |
| 6 | Verify | pass | 1/0 | — |
| 7 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 8 | Green | pass | 2/0 | `src/lib.rs` |
| 9 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 10 | Green | pass | 3/0 | `src/lib.rs` |
| 11 | Refactor | pass | 3/0 | `src/lib.rs` |
| 12 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 13 | Verify | pass | 4/0 | — |
| 14 | Refactor | pass | 4/0 | `src/lib.rs` |
| 15 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 16 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 17 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 18 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 19 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 20 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 21 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 22 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 23 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 24 | Verify | pass | 13/0 | — |
| 25 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 26 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 27 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 28 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 29 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 30 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 31 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 32 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 33 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 34 | Refactor | pass | 22/0 | `src/lib.rs` |
| 35 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 36 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 37 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 38 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 39 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 40 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 41 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 42 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 43 | Refactor | pass | 30/0 | `src/lib.rs` |
| 44 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 45 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 46 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 47 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 48 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 49 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 50 | Verify | pass | 36/0 | — |
| 51 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 52 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 53 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 54 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 55 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 56 | Verify | pass | 41/0 | — |

Final suite state: **pass**.

