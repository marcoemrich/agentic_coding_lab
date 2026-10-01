# TDD phase chain — 2026-10-01_12-11-12_claim-office-rust-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-4

**106 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Red -> Green? -> Green -> Verify -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Break(c) -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip
```

Deviations present: `Break(c)` ×1 (implementation change broke compilation of a green suite), `Green?` ×1 (implementation changed, still failing), `Skip` ×45 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 106 |
| `cycles_total` | 51 |
| `cycles_closed` | 5 |
| `test_first_rate` | 0.1 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 3 |
| `skip_events` | 45 |
| `refactor_per_cycle` | 0.6 |
| `green_attempts` | 0.2 |
| `deviations` | 46 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.214 |
| `tdd_discipline_test_first` | 0.1 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.098 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (5 of 51 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–6`  Red -> Green? -> Green -> Verify
  4. `7–10`  Red -> Green -> Verify -> Refactor
  5. `11–13`  Red -> Green -> Refactor
  6. `14–17`  Red -> Green -> Break(c) -> Refactor
  7. `18–19`  Skip -> Verify  ← never closed
  8. `20–21`  Skip -> Verify  ← never closed
  9. `22–23`  Skip -> Verify  ← never closed
 10. `24–25`  Skip -> Verify  ← never closed
 11. `26–27`  Skip -> Verify  ← never closed
 12. `28–29`  Skip -> Verify  ← never closed
 13. `30–31`  Skip -> Verify  ← never closed
 14. `32–33`  Skip -> Verify  ← never closed
 15. `34–35`  Skip -> Verify  ← never closed
 16. `36–37`  Skip -> Verify  ← never closed
 17. `38–39`  Skip -> Verify  ← never closed
 18. `40–41`  Skip -> Verify  ← never closed
 19. `42–43`  Skip -> Verify  ← never closed
 20. `44–45`  Skip -> Verify  ← never closed
 21. `46–47`  Skip -> Verify  ← never closed
 22. `48–49`  Skip -> Verify  ← never closed
 23. `50–51`  Skip -> Verify  ← never closed
 24. `52–54`  Red -> Green -> Verify
 25. `55–56`  Skip -> Verify  ← never closed
 26. `57–58`  Skip -> Verify  ← never closed
 27. `59–60`  Skip -> Verify  ← never closed
 28. `61–62`  Skip -> Verify  ← never closed
 29. `63–64`  Skip -> Verify  ← never closed
 30. `65–66`  Skip -> Verify  ← never closed
 31. `67–68`  Skip -> Verify  ← never closed
 32. `69–70`  Skip -> Verify  ← never closed
 33. `71–72`  Skip -> Verify  ← never closed
 34. `73–74`  Skip -> Verify  ← never closed
 35. `75–76`  Skip -> Verify  ← never closed
 36. `77–78`  Skip -> Verify  ← never closed
 37. `79–80`  Skip -> Verify  ← never closed
 38. `81–82`  Skip -> Verify  ← never closed
 39. `83–84`  Skip -> Verify  ← never closed
 40. `85–86`  Skip -> Verify  ← never closed
 41. `87–88`  Skip -> Verify  ← never closed
 42. `89–90`  Skip -> Verify  ← never closed
 43. `91–92`  Skip -> Verify  ← never closed
 44. `93–94`  Skip -> Verify  ← never closed
 45. `95–96`  Skip -> Verify  ← never closed
 46. `97–98`  Skip -> Verify  ← never closed
 47. `99–99`  Skip  ← never closed
 48. `100–101`  Skip -> Verify  ← never closed
 49. `102–103`  Skip -> Verify  ← never closed
 50. `104–105`  Skip -> Verify  ← never closed
 51. `106–106`  Skip  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 45 | test arrived and passed immediately — never red |
| `Verify` | 45 | nothing changed, suite re-run |
| `Red` | 5 | a new failing test arrived |
| `Green` | 5 | implementation changed, suite went green |
| `Refactor` | 3 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |
| `Green?` | 1 | implementation changed, still failing |
| `Break(c)` | 1 | implementation change broke compilation of a green suite |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 0 files)_ |
| 2 | Skip | pass | 0/0 | `tests/scenarios.rs#test` |
| 3 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 4 | Green? | fail | 0/1 | `src/main.rs` |
| 5 | Green | pass | 1/0 | `src/main.rs` |
| 6 | Verify | pass | 1/0 | — |
| 7 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 8 | Green | pass | 1/0 | `src/lib.rs`, `src/main.rs` |
| 9 | Verify | pass | 2/0 | — |
| 10 | Refactor | pass | 2/0 | `src/lib.rs`, `src/main.rs` |
| 11 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 12 | Green | pass | 3/0 | `src/lib.rs` |
| 13 | Refactor | pass | 3/0 | `src/lib.rs` |
| 14 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 15 | Green | pass | 4/0 | `src/lib.rs` |
| 16 | Break(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 17 | Refactor | pass | 4/0 | `src/lib.rs` |
| 18 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 19 | Verify | pass | 5/0 | — |
| 20 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 21 | Verify | pass | 6/0 | — |
| 22 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 23 | Verify | pass | 7/0 | — |
| 24 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 25 | Verify | pass | 8/0 | — |
| 26 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 27 | Verify | pass | 9/0 | — |
| 28 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 29 | Verify | pass | 10/0 | — |
| 30 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 31 | Verify | pass | 11/0 | — |
| 32 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 33 | Verify | pass | 12/0 | — |
| 34 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 35 | Verify | pass | 13/0 | — |
| 36 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 37 | Verify | pass | 14/0 | — |
| 38 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 39 | Verify | pass | 15/0 | — |
| 40 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 41 | Verify | pass | 16/0 | — |
| 42 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 43 | Verify | pass | 17/0 | — |
| 44 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 45 | Verify | pass | 18/0 | — |
| 46 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 47 | Verify | pass | 19/0 | — |
| 48 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 49 | Verify | pass | 20/0 | — |
| 50 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 51 | Verify | pass | 21/0 | — |
| 52 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 53 | Green | pass | 1/0 | `src/lib.rs` |
| 54 | Verify | pass | 22/0 | — |
| 55 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 56 | Verify | pass | 23/0 | — |
| 57 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 58 | Verify | pass | 24/0 | — |
| 59 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 60 | Verify | pass | 25/0 | — |
| 61 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 62 | Verify | pass | 26/0 | — |
| 63 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 64 | Verify | pass | 27/0 | — |
| 65 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 66 | Verify | pass | 28/0 | — |
| 67 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 68 | Verify | pass | 29/0 | — |
| 69 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 70 | Verify | pass | 30/0 | — |
| 71 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 72 | Verify | pass | 31/0 | — |
| 73 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 74 | Verify | pass | 32/0 | — |
| 75 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 76 | Verify | pass | 33/0 | — |
| 77 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 78 | Verify | pass | 34/0 | — |
| 79 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 80 | Verify | pass | 35/0 | — |
| 81 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 82 | Verify | pass | 36/0 | — |
| 83 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 84 | Verify | pass | 37/0 | — |
| 85 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 86 | Verify | pass | 38/0 | — |
| 87 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 88 | Verify | pass | 39/0 | — |
| 89 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 90 | Verify | pass | 40/0 | — |
| 91 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 92 | Verify | pass | 41/0 | — |
| 93 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 94 | Verify | pass | 42/0 | — |
| 95 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 96 | Verify | pass | 43/0 | — |
| 97 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 98 | Verify | pass | 44/0 | — |
| 99 | Skip | pass | 44/0 | `tests/scenarios.rs#test` |
| 100 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 101 | Verify | pass | 45/0 | — |
| 102 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 103 | Verify | pass | 46/0 | — |
| 104 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 105 | Verify | pass | 47/0 | — |
| 106 | Skip | pass | 47/0 | `tests/scenarios.rs#test` |

Final suite state: **pass**.

