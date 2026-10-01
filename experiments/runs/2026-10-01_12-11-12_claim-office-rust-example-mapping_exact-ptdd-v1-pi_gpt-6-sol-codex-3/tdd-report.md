# TDD phase chain — 2026-10-01_12-11-12_claim-office-rust-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-3

**134 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Both -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Skip -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Skip` ×22 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 134 |
| `cycles_total` | 47 |
| `cycles_closed` | 23 |
| `test_first_rate` | 0.5 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 10 |
| `skip_events` | 22 |
| `refactor_per_cycle` | 0.435 |
| `green_attempts` | 0.0 |
| `deviations` | 23 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.625 |
| `tdd_discipline_test_first` | 0.5 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.489 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (23 of 47 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Both  ← never closed
  3. `3–5`  Red -> Green -> Verify
  4. `6–9`  Red -> Green -> Refactor -> Verify
  5. `10–12`  Red -> Green -> Verify
  6. `13–15`  Red -> Green -> Verify
  7. `16–18`  Red -> Green -> Verify
  8. `19–23`  Red -> Green -> Verify -> Refactor -> Verify
  9. `24–26`  Red -> Green -> Verify
 10. `27–28`  Skip -> Verify  ← never closed
 11. `29–33`  Red -> Green -> Verify -> Refactor -> Verify
 12. `34–35`  Skip -> Verify  ← never closed
 13. `36–37`  Skip -> Verify  ← never closed
 14. `38–39`  Skip -> Verify  ← never closed
 15. `40–42`  Red -> Green -> Verify
 16. `43–47`  Red -> Green -> Verify -> Refactor -> Verify
 17. `48–49`  Skip -> Verify  ← never closed
 18. `50–51`  Skip -> Verify  ← never closed
 19. `52–54`  Red -> Green -> Verify
 20. `55–56`  Skip -> Verify  ← never closed
 21. `57–61`  Red -> Green -> Verify -> Refactor -> Verify
 22. `62–63`  Skip -> Verify  ← never closed
 23. `64–68`  Red -> Green -> Verify -> Refactor -> Verify
 24. `69–70`  Skip -> Verify  ← never closed
 25. `71–75`  Red -> Green -> Verify -> Refactor -> Verify
 26. `76–78`  Red -> Green -> Verify
 27. `79–80`  Skip -> Verify  ← never closed
 28. `81–85`  Red -> Green -> Verify -> Refactor -> Verify
 29. `86–87`  Skip -> Verify  ← never closed
 30. `88–89`  Skip -> Verify  ← never closed
 31. `90–94`  Red -> Green -> Verify -> Refactor -> Verify
 32. `95–96`  Skip -> Verify  ← never closed
 33. `97–98`  Skip -> Verify  ← never closed
 34. `99–100`  Skip -> Verify  ← never closed
 35. `101–102`  Skip -> Verify  ← never closed
 36. `103–104`  Skip -> Verify  ← never closed
 37. `105–107`  Red -> Green -> Verify
 38. `108–109`  Skip -> Verify  ← never closed
 39. `110–114`  Red -> Green -> Verify -> Refactor -> Verify
 40. `115–116`  Skip -> Verify  ← never closed
 41. `117–118`  Skip -> Verify  ← never closed
 42. `119–120`  Skip -> Verify  ← never closed
 43. `121–123`  Red -> Green -> Verify
 44. `124–124`  Skip  ← never closed
 45. `125–127`  Red -> Green -> Verify
 46. `128–130`  Red -> Green -> Verify
 47. `131–134`  Red -> Green -> Verify -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 54 | nothing changed, suite re-run |
| `Red` | 23 | a new failing test arrived |
| `Green` | 23 | implementation changed, suite went green |
| `Skip` | 22 | test arrived and passed immediately — never red |
| `Refactor` | 10 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |
| `Both` | 1 | test and implementation changed together — no verified red |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 0 files)_ |
| 2 | Both | pass | 0/0 | `src/main.rs`, `tests/scenarios.rs#test` |
| 3 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 4 | Green | pass | 1/0 | `src/lib.rs`, `src/main.rs` |
| 5 | Verify | pass | 1/0 | — |
| 6 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 7 | Green | pass | 1/0 | `src/lib.rs` |
| 8 | Refactor | pass | 1/0 | `src/lib.rs` |
| 9 | Verify | pass | 2/0 | — |
| 10 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 11 | Green | pass | 1/0 | `src/lib.rs` |
| 12 | Verify | pass | 3/0 | — |
| 13 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 14 | Green | pass | 1/0 | `src/lib.rs` |
| 15 | Verify | pass | 4/0 | — |
| 16 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 17 | Green | pass | 1/0 | `src/lib.rs` |
| 18 | Verify | pass | 5/0 | — |
| 19 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 20 | Green | pass | 1/0 | `src/lib.rs` |
| 21 | Verify | pass | 6/0 | — |
| 22 | Refactor | pass | 1/0 | `src/lib.rs` |
| 23 | Verify | pass | 6/0 | — |
| 24 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 25 | Green | pass | 1/0 | `src/lib.rs` |
| 26 | Verify | pass | 7/0 | — |
| 27 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 28 | Verify | pass | 8/0 | — |
| 29 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 30 | Green | pass | 1/0 | `src/lib.rs` |
| 31 | Verify | pass | 9/0 | — |
| 32 | Refactor | pass | 1/0 | `src/lib.rs` |
| 33 | Verify | pass | 9/0 | — |
| 34 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 35 | Verify | pass | 10/0 | — |
| 36 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 37 | Verify | pass | 11/0 | — |
| 38 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 39 | Verify | pass | 12/0 | — |
| 40 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 41 | Green | pass | 1/0 | `src/lib.rs` |
| 42 | Verify | pass | 13/0 | — |
| 43 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 44 | Green | pass | 1/0 | `src/lib.rs` |
| 45 | Verify | pass | 14/0 | — |
| 46 | Refactor | pass | 1/0 | `src/lib.rs` |
| 47 | Verify | pass | 14/0 | — |
| 48 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 49 | Verify | pass | 15/0 | — |
| 50 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 51 | Verify | pass | 16/0 | — |
| 52 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 53 | Green | pass | 1/0 | `src/lib.rs` |
| 54 | Verify | pass | 17/0 | — |
| 55 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 56 | Verify | pass | 18/0 | — |
| 57 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 58 | Green | pass | 1/0 | `src/lib.rs` |
| 59 | Verify | pass | 19/0 | — |
| 60 | Refactor | pass | 1/0 | `src/lib.rs` |
| 61 | Verify | pass | 19/0 | — |
| 62 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 63 | Verify | pass | 20/0 | — |
| 64 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 65 | Green | pass | 1/0 | `src/lib.rs` |
| 66 | Verify | pass | 21/0 | — |
| 67 | Refactor | pass | 1/0 | `src/lib.rs` |
| 68 | Verify | pass | 21/0 | — |
| 69 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 70 | Verify | pass | 22/0 | — |
| 71 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 72 | Green | pass | 1/0 | `src/lib.rs` |
| 73 | Verify | pass | 23/0 | — |
| 74 | Refactor | pass | 1/0 | `src/lib.rs` |
| 75 | Verify | pass | 23/0 | — |
| 76 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 77 | Green | pass | 1/0 | `src/lib.rs` |
| 78 | Verify | pass | 24/0 | — |
| 79 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 80 | Verify | pass | 25/0 | — |
| 81 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 82 | Green | pass | 1/0 | `src/lib.rs` |
| 83 | Verify | pass | 26/0 | — |
| 84 | Refactor | pass | 1/0 | `src/lib.rs` |
| 85 | Verify | pass | 26/0 | — |
| 86 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 87 | Verify | pass | 27/0 | — |
| 88 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 89 | Verify | pass | 28/0 | — |
| 90 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 91 | Green | pass | 1/0 | `src/lib.rs` |
| 92 | Verify | pass | 29/0 | — |
| 93 | Refactor | pass | 1/0 | `src/lib.rs` |
| 94 | Verify | pass | 29/0 | — |
| 95 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 96 | Verify | pass | 30/0 | — |
| 97 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 98 | Verify | pass | 31/0 | — |
| 99 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 100 | Verify | pass | 32/0 | — |
| 101 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 102 | Verify | pass | 33/0 | — |
| 103 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 104 | Verify | pass | 34/0 | — |
| 105 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 106 | Green | pass | 1/0 | `src/lib.rs` |
| 107 | Verify | pass | 35/0 | — |
| 108 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 109 | Verify | pass | 36/0 | — |
| 110 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 111 | Green | pass | 1/0 | `src/lib.rs` |
| 112 | Verify | pass | 37/0 | — |
| 113 | Refactor | pass | 1/0 | `src/lib.rs` |
| 114 | Verify | pass | 37/0 | — |
| 115 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 116 | Verify | pass | 38/0 | — |
| 117 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 118 | Verify | pass | 39/0 | — |
| 119 | Skip | pass | 1/0 | `tests/scenarios.rs#test` |
| 120 | Verify | pass | 40/0 | — |
| 121 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 122 | Green | pass | 1/0 | `src/lib.rs` |
| 123 | Verify | pass | 41/0 | — |
| 124 | Skip | pass | 41/0 | `tests/scenarios.rs#test` |
| 125 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 126 | Green | pass | 1/0 | `src/lib.rs` |
| 127 | Verify | pass | 42/0 | — |
| 128 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 129 | Green | pass | 1/0 | `src/lib.rs` |
| 130 | Verify | pass | 43/0 | — |
| 131 | Red | fail | 0/1 | `tests/scenarios.rs#test` |
| 132 | Green | pass | 1/0 | `src/lib.rs` |
| 133 | Verify | pass | 44/0 | — |
| 134 | Verify | pass | 44/0 | — |

Final suite state: **pass**.

