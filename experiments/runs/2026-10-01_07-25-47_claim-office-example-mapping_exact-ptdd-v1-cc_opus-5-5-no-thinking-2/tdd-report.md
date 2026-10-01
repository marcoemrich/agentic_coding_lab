# TDD phase chain — 2026-10-01_07-25-47_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking-2

**94 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Red -> Green? -> Green -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green? -> Green -> Refactor -> Red -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Skip -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Verify
```

Deviations present: `Green?` ×2 (implementation changed, still failing), `Skip` ×24 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 94 |
| `cycles_total` | 50 |
| `cycles_closed` | 25 |
| `test_first_rate` | 0.52 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 14 |
| `skip_events` | 24 |
| `refactor_per_cycle` | 0.56 |
| `green_attempts` | 0.08 |
| `deviations` | 24 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.638 |
| `tdd_discipline_test_first` | 0.52 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.5 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (25 of 50 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red(c) -> Red -> Green
  3. `5–7`  Red -> Green? -> Green
  4. `8–10`  Red -> Green -> Refactor
  5. `11–12`  Red -> Green
  6. `13–14`  Red -> Green
  7. `15–17`  Red -> Green -> Refactor
  8. `18–20`  Red -> Green -> Refactor
  9. `21–21`  Skip  ← never closed
 10. `22–23`  Red -> Green
 11. `24–24`  Skip  ← never closed
 12. `25–25`  Skip  ← never closed
 13. `26–26`  Skip  ← never closed
 14. `27–27`  Skip  ← never closed
 15. `28–28`  Skip  ← never closed
 16. `29–31`  Red -> Green -> Refactor
 17. `32–32`  Skip  ← never closed
 18. `33–35`  Red -> Green -> Refactor
 19. `36–36`  Skip  ← never closed
 20. `37–37`  Skip  ← never closed
 21. `38–38`  Skip  ← never closed
 22. `39–41`  Red -> Green -> Refactor
 23. `42–42`  Skip  ← never closed
 24. `43–44`  Red -> Green
 25. `45–45`  Skip  ← never closed
 26. `46–46`  Skip  ← never closed
 27. `47–50`  Red -> Green? -> Green -> Refactor
 28. `51–52`  Red -> Green
 29. `53–54`  Red -> Green
 30. `55–55`  Skip  ← never closed
 31. `56–56`  Skip  ← never closed
 32. `57–57`  Skip  ← never closed
 33. `58–60`  Red -> Green -> Refactor
 34. `61–62`  Red -> Green
 35. `63–63`  Skip  ← never closed
 36. `64–64`  Skip  ← never closed
 37. `65–67`  Red -> Green -> Refactor
 38. `68–68`  Skip  ← never closed
 39. `69–69`  Skip  ← never closed
 40. `70–70`  Skip  ← never closed
 41. `71–72`  Red -> Green
 42. `73–74`  Red -> Green
 43. `75–75`  Skip  ← never closed
 44. `76–78`  Red -> Green -> Refactor
 45. `79–81`  Red -> Green -> Verify
 46. `82–83`  Skip -> Refactor  ← never closed
 47. `84–86`  Red -> Green -> Refactor
 48. `87–87`  Skip  ← never closed
 49. `88–90`  Red -> Green -> Refactor
 50. `91–94`  Red -> Green -> Refactor -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 25 | a new failing test arrived |
| `Green` | 25 | implementation changed, suite went green |
| `Skip` | 24 | test arrived and passed immediately — never red |
| `Refactor` | 14 | implementation changed, suite stayed green |
| `Green?` | 2 | implementation changed, still failing |
| `Verify` | 2 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/claim-office.ts` |
| 4 | Green | pass | 1/0 | `src/claim-office.ts` |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green? | fail | 1/1 | `src/claim-office.ts` |
| 7 | Green | pass | 2/0 | `src/claim-office.ts` |
| 8 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 9 | Green | pass | 3/0 | `src/claim-office.ts` |
| 10 | Refactor | pass | 3/0 | `src/claim-office.ts` |
| 11 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 4/0 | `src/claim-office.ts` |
| 13 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 5/0 | `src/claim-office.ts` |
| 15 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 6/0 | `src/claim-office.ts` |
| 17 | Refactor | pass | 6/0 | `src/claim-office.ts` |
| 18 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 7/0 | `src/claim-office.ts` |
| 20 | Refactor | pass | 7/0 | `src/claim-office.ts` |
| 21 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 22 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 23 | Green | pass | 9/0 | `src/claim-office.ts` |
| 24 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 25 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 26 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 27 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 28 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 29 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 30 | Green | pass | 14/0 | `src/claim-office.ts` |
| 31 | Refactor | pass | 14/0 | `src/claim-office.ts` |
| 32 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 33 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 34 | Green | pass | 16/0 | `src/claim-office.ts` |
| 35 | Refactor | pass | 16/0 | `src/claim-office.ts`, `src/item.ts`, `src/premium.ts` |
| 36 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 37 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 38 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 39 | Red | fail | 19/1 | `src/claim-office.spec.ts` |
| 40 | Green | pass | 20/0 | `src/claim-office.ts`, `src/premium.ts` |
| 41 | Refactor | pass | 20/0 | `src/premium.ts` |
| 42 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 43 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 44 | Green | pass | 22/0 | `src/claim-office.ts`, `src/premium.ts` |
| 45 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 46 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 47 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 48 | Green? | fail | 24/1 | `src/claim-office.ts` |
| 49 | Green | pass | 25/0 | `src/claim-office.ts`, `src/claim.ts` |
| 50 | Refactor | pass | 25/0 | `src/claim-office.ts` |
| 51 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 52 | Green | pass | 26/0 | `src/claim.ts` |
| 53 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 54 | Green | pass | 27/0 | `src/claim.ts` |
| 55 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 56 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 57 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 58 | Red | fail | 30/1 | `src/claim-office.spec.ts` |
| 59 | Green | pass | 31/0 | `src/claim.ts` |
| 60 | Refactor | pass | 31/0 | `src/claim.ts` |
| 61 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 62 | Green | pass | 32/0 | `src/claim.ts` |
| 63 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 65 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 66 | Green | pass | 35/0 | `src/claim-office.ts`, `src/claim.ts` |
| 67 | Refactor | pass | 35/0 | `src/claim-office.ts`, `src/claim.ts` |
| 68 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 69 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 70 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 71 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 72 | Green | pass | 39/0 | `src/claim.ts` |
| 73 | Red | fail | 39/1 | `src/claim-office.spec.ts` |
| 74 | Green | pass | 40/0 | `src/claim.ts` |
| 75 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 76 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 77 | Green | pass | 42/0 | `src/claim.ts` |
| 78 | Refactor | pass | 42/0 | `src/claim.ts`, `src/item.ts`, `src/premium.ts` |
| 79 | Red | fail | 42/1 | `src/claim-office.spec.ts` |
| 80 | Green | pass | 43/0 | `src/cli.ts` |
| 81 | Verify | pass | 43/0 | — |
| 82 | Skip | pass | 44/0 | `src/claim-office.spec.ts` |
| 83 | Refactor | pass | 44/0 | `src/cli.ts`, `src/item.ts` |
| 84 | Red | fail | 44/1 | `src/claim-office.spec.ts` |
| 85 | Green | pass | 45/0 | `src/claim.ts` |
| 86 | Refactor | pass | 45/0 | `src/claim.ts` |
| 87 | Skip | pass | 46/0 | `src/claim-office.spec.ts` |
| 88 | Red | fail | 46/1 | `src/claim-office.spec.ts` |
| 89 | Green | pass | 47/0 | `src/claim.ts` |
| 90 | Refactor | pass | 47/0 | `src/claim.ts` |
| 91 | Red | fail | 47/1 | `src/claim-office.spec.ts` |
| 92 | Green | pass | 48/0 | `src/claim.ts` |
| 93 | Refactor | pass | 48/0 | `src/claim.ts` |
| 94 | Verify | pass | 48/0 | — |

Final suite state: **pass**.

