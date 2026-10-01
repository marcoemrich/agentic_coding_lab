# TDD phase chain — 2026-10-01_09-23-43_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

**101 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Refactor -> Red -> Green? -> Green -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Break -> Green -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Refactor -> Skip -> Skip -> Skip -> Verify
```

Deviations present: `Break` ×1 (implementation change broke a green suite), `Green?` ×1 (implementation changed, still failing), `Skip` ×25 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 101 |
| `cycles_total` | 52 |
| `cycles_closed` | 26 |
| `test_first_rate` | 0.519 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 18 |
| `skip_events` | 25 |
| `refactor_per_cycle` | 0.692 |
| `green_attempts` | 0.038 |
| `deviations` | 26 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.638 |
| `tdd_discipline_test_first` | 0.519 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.5 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (26 of 52 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Red(c) -> Red -> Green -> Refactor
  3. `6–8`  Red -> Green? -> Green
  4. `9–11`  Red -> Green -> Refactor
  5. `12–13`  Red -> Green
  6. `14–15`  Red -> Green
  7. `16–17`  Red -> Green
  8. `18–20`  Red -> Green -> Refactor
  9. `21–24`  Red -> Green -> Break -> Green
 10. `25–25`  Skip  ← never closed
 11. `26–28`  Red -> Green -> Refactor
 12. `29–29`  Skip  ← never closed
 13. `30–30`  Skip  ← never closed
 14. `31–33`  Red -> Green -> Refactor
 15. `34–36`  Red -> Green -> Refactor
 16. `37–37`  Skip  ← never closed
 17. `38–38`  Skip  ← never closed
 18. `39–41`  Red -> Green -> Refactor
 19. `42–42`  Skip  ← never closed
 20. `43–43`  Skip  ← never closed
 21. `44–46`  Red -> Green -> Refactor
 22. `47–47`  Skip  ← never closed
 23. `48–50`  Red -> Green -> Refactor
 24. `51–51`  Skip  ← never closed
 25. `52–52`  Skip  ← never closed
 26. `53–54`  Red -> Green
 27. `55–56`  Red -> Green
 28. `57–57`  Skip  ← never closed
 29. `58–59`  Red -> Green
 30. `60–61`  Red -> Green
 31. `62–64`  Red -> Green -> Refactor
 32. `65–65`  Skip  ← never closed
 33. `66–66`  Skip  ← never closed
 34. `67–67`  Skip  ← never closed
 35. `68–70`  Red -> Green -> Refactor
 36. `71–74`  Red -> Green -> Refactor -> Refactor
 37. `75–75`  Skip  ← never closed
 38. `76–76`  Skip  ← never closed
 39. `77–77`  Skip  ← never closed
 40. `78–80`  Red -> Green -> Refactor
 41. `81–81`  Skip  ← never closed
 42. `82–82`  Skip  ← never closed
 43. `83–83`  Skip  ← never closed
 44. `84–85`  Red -> Green
 45. `86–86`  Skip  ← never closed
 46. `87–89`  Red -> Green -> Refactor
 47. `90–92`  Red -> Green -> Refactor
 48. `93–95`  Red -> Green -> Refactor
 49. `96–97`  Skip -> Refactor  ← never closed
 50. `98–98`  Skip  ← never closed
 51. `99–99`  Skip  ← never closed
 52. `100–101`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Green` | 27 | implementation changed, suite went green |
| `Red` | 26 | a new failing test arrived |
| `Skip` | 25 | test arrived and passed immediately — never red |
| `Refactor` | 18 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Green?` | 1 | implementation changed, still failing |
| `Break` | 1 | implementation change broke a green suite |
| `Verify` | 1 | nothing changed, suite re-run |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/claim-office.ts` |
| 4 | Green | pass | 1/0 | `src/claim-office.ts` |
| 5 | Refactor | pass | 1/0 | `src/claim-office.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green? | fail | 1/1 | `src/claim-office.ts` |
| 8 | Green | pass | 2/0 | `src/claim-office.ts` |
| 9 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 10 | Green | pass | 3/0 | `src/claim-office.ts` |
| 11 | Refactor | pass | 3/0 | `src/claim-office.ts` |
| 12 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 4/0 | `src/claim-office.ts` |
| 14 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 5/0 | `src/claim-office.ts` |
| 16 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 6/0 | `src/claim-office.ts` |
| 18 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 7/0 | `src/claim-office.ts` |
| 20 | Refactor | pass | 7/0 | `src/claim-office.ts` |
| 21 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 22 | Green | pass | 8/0 | `src/claim-office.ts` |
| 23 | Break | fail | 0/8 | `src/claim-office.ts`, `src/price-list.ts` |
| 24 | Green | pass | 8/0 | `src/claim-office.ts`, `src/price-list.ts` |
| 25 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 26 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 27 | Green | pass | 10/0 | `src/claim-office.ts` |
| 28 | Refactor | pass | 10/0 | `src/claim-office.ts` |
| 29 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 30 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 31 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 32 | Green | pass | 13/0 | `src/price-list.ts` |
| 33 | Refactor | pass | 13/0 | `src/price-list.ts` |
| 34 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 35 | Green | pass | 14/0 | `src/claim-office.ts`, `src/price-list.ts` |
| 36 | Refactor | pass | 14/0 | `src/claim-office.ts` |
| 37 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 38 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 39 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 40 | Green | pass | 17/0 | `src/claim-office.ts` |
| 41 | Refactor | pass | 17/0 | `src/claim-office.ts`, `src/premium.ts` |
| 42 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 43 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 44 | Red | fail | 19/1 | `src/claim-office.spec.ts` |
| 45 | Green | pass | 20/0 | `src/claim-office.ts`, `src/premium.ts` |
| 46 | Refactor | pass | 20/0 | `src/premium.ts` |
| 47 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 48 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 49 | Green | pass | 22/0 | `src/claim-office.ts`, `src/premium.ts` |
| 50 | Refactor | pass | 22/0 | `src/claim-office.ts`, `src/premium.ts` |
| 51 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 52 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 53 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 54 | Green | pass | 25/0 | `src/claim-office.ts`, `src/claim.ts`, `src/price-list.ts` |
| 55 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 56 | Green | pass | 26/0 | `src/price-list.ts` |
| 57 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 58 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 59 | Green | pass | 27/0 | `src/price-list.ts` |
| 60 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 61 | Green | pass | 28/0 | `src/price-list.ts` |
| 62 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 63 | Green | pass | 29/0 | `src/claim.ts` |
| 64 | Refactor | pass | 29/0 | `src/claim.ts` |
| 65 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 66 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 67 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 68 | Red | fail | 32/1 | `src/claim-office.spec.ts` |
| 69 | Green | pass | 33/0 | `src/claim.ts` |
| 70 | Refactor | pass | 33/0 | `src/claim.ts` |
| 71 | Red | fail | 33/1 | `src/claim-office.spec.ts` |
| 72 | Green | pass | 34/0 | `src/price-list.ts` |
| 73 | Refactor | pass | 34/0 | `src/price-list.ts` |
| 74 | Refactor | pass | 34/0 | `src/price-list.ts` |
| 75 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 76 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 77 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 78 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 79 | Green | pass | 38/0 | `src/claim.ts` |
| 80 | Refactor | pass | 38/0 | `src/claim.ts` |
| 81 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 82 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 83 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 84 | Red | fail | 40/1 | `src/claim-office.spec.ts` |
| 85 | Green | pass | 41/0 | `src/claim.ts` |
| 86 | Skip | pass | 42/0 | `src/claim-office.spec.ts` |
| 87 | Red | fail | 42/1 | `src/claim-office.spec.ts` |
| 88 | Green | pass | 43/0 | `src/claim.ts` |
| 89 | Refactor | pass | 43/0 | `src/claim.ts` |
| 90 | Red | fail | 43/1 | `src/claim-office.spec.ts` |
| 91 | Green | pass | 44/0 | `src/claim.ts` |
| 92 | Refactor | pass | 44/0 | `src/claim.ts` |
| 93 | Red | fail | 0/1 | `src/cli.spec.ts` |
| 94 | Green | pass | 45/0 | `src/cli.ts` |
| 95 | Refactor | pass | 45/0 | `src/cli.ts` |
| 96 | Skip | pass | 46/0 | `src/cli.spec.ts` |
| 97 | Refactor | pass | 46/0 | `src/cli.ts` |
| 98 | Skip | pass | 47/0 | `src/cli.spec.ts` |
| 99 | Skip | pass | 48/0 | `src/cli.spec.ts` |
| 100 | Skip | pass | 49/0 | `src/cli.spec.ts` |
| 101 | Verify | pass | 49/0 | — |

Final suite state: **pass**.

