# TDD phase chain — 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-4

**75 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green? -> Verify -> Green -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Skip -> Skip -> Red -> Green -> Red -> Green -> Verify -> Skip -> Verify
```

Deviations present: `Green?` ×1 (implementation changed, still failing), `Skip` ×22 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 75 |
| `cycles_total` | 42 |
| `cycles_closed` | 19 |
| `test_first_rate` | 0.463 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 3 |
| `skip_events` | 22 |
| `refactor_per_cycle` | 0.158 |
| `green_attempts` | 0.053 |
| `deviations` | 22 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.594 |
| `tdd_discipline_test_first` | 0.463 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.452 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (19 of 42 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–3`  Red -> Green
  3. `4–5`  Red -> Green
  4. `6–7`  Red -> Green
  5. `8–9`  Red -> Green
  6. `10–11`  Red -> Green
  7. `12–14`  Red -> Green -> Refactor
  8. `15–22`  Red -> Green? -> Verify -> Verify -> Verify -> Verify -> Verify -> Green
  9. `23–23`  Skip  ← never closed
 10. `24–25`  Red -> Green
 11. `26–26`  Skip  ← never closed
 12. `27–27`  Skip  ← never closed
 13. `28–30`  Red -> Green -> Refactor
 14. `31–32`  Red -> Green
 15. `33–33`  Skip  ← never closed
 16. `34–34`  Skip  ← never closed
 17. `35–35`  Skip  ← never closed
 18. `36–37`  Red -> Green
 19. `38–38`  Skip  ← never closed
 20. `39–40`  Red -> Green
 21. `41–41`  Skip  ← never closed
 22. `42–44`  Red -> Green -> Refactor
 23. `45–45`  Skip  ← never closed
 24. `46–46`  Skip  ← never closed
 25. `47–47`  Skip  ← never closed
 26. `48–49`  Red -> Green
 27. `50–50`  Skip  ← never closed
 28. `51–51`  Skip  ← never closed
 29. `52–52`  Skip  ← never closed
 30. `53–53`  Skip  ← never closed
 31. `54–54`  Skip  ← never closed
 32. `55–55`  Skip  ← never closed
 33. `56–56`  Skip  ← never closed
 34. `57–58`  Red -> Green
 35. `59–59`  Skip  ← never closed
 36. `60–61`  Red -> Green
 37. `62–63`  Red -> Green
 38. `64–64`  Skip  ← never closed
 39. `65–65`  Skip  ← never closed
 40. `66–67`  Red -> Green
 41. `68–70`  Red -> Green -> Verify
 42. `71–75`  Skip -> Verify -> Verify -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 22 | test arrived and passed immediately — never red |
| `Red` | 19 | a new failing test arrived |
| `Green` | 19 | implementation changed, suite went green |
| `Verify` | 10 | nothing changed, suite re-run |
| `Refactor` | 3 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red | fail | 0/1 | `src/scenario.spec.ts` |
| 3 | Green | pass | 1/0 | `src/scenario.ts` |
| 4 | Red | fail | 1/1 | `src/scenario.spec.ts` |
| 5 | Green | pass | 2/0 | `src/scenario.ts` |
| 6 | Red | fail | 2/1 | `src/scenario.spec.ts` |
| 7 | Green | pass | 3/0 | `src/scenario.ts` |
| 8 | Red | fail | 3/1 | `src/scenario.spec.ts` |
| 9 | Green | pass | 4/0 | `src/scenario.ts` |
| 10 | Red | fail | 4/1 | `src/scenario.spec.ts` |
| 11 | Green | pass | 5/0 | `src/scenario.ts` |
| 12 | Red | fail | 5/1 | `src/scenario.spec.ts` |
| 13 | Green | pass | 6/0 | `src/scenario.ts` |
| 14 | Refactor | pass | 6/0 | `src/scenario.ts` |
| 15 | Red | fail | 6/1 | `src/scenario.spec.ts` |
| 16 | Green? | fail | 5/2 | `src/scenario.ts` |
| 17 | Verify | fail | 5/2 | — |
| 18 | Verify | fail | 5/2 | — |
| 19 | Verify | fail | 5/2 | — |
| 20 | Verify | fail | 5/2 | — |
| 21 | Verify | fail | 5/2 | — |
| 22 | Green | pass | 7/0 | `src/scenario.ts` |
| 23 | Skip | pass | 8/0 | `src/scenario.spec.ts` |
| 24 | Red | fail | 8/1 | `src/scenario.spec.ts` |
| 25 | Green | pass | 9/0 | `src/scenario.ts` |
| 26 | Skip | pass | 10/0 | `src/scenario.spec.ts` |
| 27 | Skip | pass | 11/0 | `src/scenario.spec.ts` |
| 28 | Red | fail | 11/1 | `src/scenario.spec.ts` |
| 29 | Green | pass | 12/0 | `src/scenario.ts` |
| 30 | Refactor | pass | 12/0 | `src/scenario.ts` |
| 31 | Red | fail | 12/1 | `src/scenario.spec.ts` |
| 32 | Green | pass | 13/0 | `src/scenario.ts` |
| 33 | Skip | pass | 14/0 | `src/scenario.spec.ts` |
| 34 | Skip | pass | 15/0 | `src/scenario.spec.ts` |
| 35 | Skip | pass | 16/0 | `src/scenario.spec.ts` |
| 36 | Red | fail | 16/1 | `src/scenario.spec.ts` |
| 37 | Green | pass | 17/0 | `src/scenario.ts` |
| 38 | Skip | pass | 18/0 | `src/scenario.spec.ts` |
| 39 | Red | fail | 18/1 | `src/scenario.spec.ts` |
| 40 | Green | pass | 19/0 | `src/scenario.ts` |
| 41 | Skip | pass | 20/0 | `src/scenario.spec.ts` |
| 42 | Red | fail | 20/1 | `src/scenario.spec.ts` |
| 43 | Green | pass | 21/0 | `src/scenario.ts` |
| 44 | Refactor | pass | 21/0 | `src/scenario.ts` |
| 45 | Skip | pass | 22/0 | `src/scenario.spec.ts` |
| 46 | Skip | pass | 23/0 | `src/scenario.spec.ts` |
| 47 | Skip | pass | 24/0 | `src/scenario.spec.ts` |
| 48 | Red | fail | 24/1 | `src/scenario.spec.ts` |
| 49 | Green | pass | 25/0 | `src/scenario.ts` |
| 50 | Skip | pass | 26/0 | `src/scenario.spec.ts` |
| 51 | Skip | pass | 27/0 | `src/scenario.spec.ts` |
| 52 | Skip | pass | 28/0 | `src/scenario.spec.ts` |
| 53 | Skip | pass | 29/0 | `src/scenario.spec.ts` |
| 54 | Skip | pass | 30/0 | `src/scenario.spec.ts` |
| 55 | Skip | pass | 31/0 | `src/scenario.spec.ts` |
| 56 | Skip | pass | 32/0 | `src/scenario.spec.ts` |
| 57 | Red | fail | 32/1 | `src/scenario.spec.ts` |
| 58 | Green | pass | 33/0 | `src/scenario.ts` |
| 59 | Skip | pass | 34/0 | `src/scenario.spec.ts` |
| 60 | Red | fail | 34/1 | `src/scenario.spec.ts` |
| 61 | Green | pass | 35/0 | `src/scenario.ts` |
| 62 | Red | fail | 35/1 | `src/scenario.spec.ts` |
| 63 | Green | pass | 36/0 | `src/scenario.ts` |
| 64 | Skip | pass | 37/0 | `src/scenario.spec.ts` |
| 65 | Skip | pass | 38/0 | `src/scenario.spec.ts` |
| 66 | Red | fail | 38/1 | `src/scenario.spec.ts` |
| 67 | Green | pass | 39/0 | `src/scenario.ts` |
| 68 | Red | fail | 39/1 | `src/scenario.spec.ts` |
| 69 | Green | pass | 40/0 | `src/cli.ts` |
| 70 | Verify | pass | 40/0 | — |
| 71 | Skip | pass | 41/0 | `src/scenario.spec.ts` |
| 72 | Verify | pass | 41/0 | — |
| 73 | Verify | pass | 41/0 | — |
| 74 | Verify | pass | 41/0 | — |
| 75 | Verify | pass | 41/0 | — |

Final suite state: **pass**.

