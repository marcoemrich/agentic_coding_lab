# TDD phase chain — 2026-11-12_01-56-34_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking-2

**122 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Both -> Refactor -> Red -> Green -> Skip -> Both -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Skip -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Both -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Both -> Refactor -> Skip -> Skip -> Red -> Verify -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Skip -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Both -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Red -> Verify -> Green -> Verify -> Red -> Green -> Skip -> Verify
```

Deviations present: `Both` ×5 (test and implementation changed together — no verified red), `Skip` ×28 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 122 |
| `cycles_total` | 63 |
| `cycles_closed` | 29 |
| `test_first_rate` | 0.484 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 23 |
| `skip_events` | 28 |
| `refactor_per_cycle` | 0.793 |
| `green_attempts` | 0.0 |
| `deviations` | 33 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.606 |
| `tdd_discipline_test_first` | 0.484 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.46 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (29 of 63 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–3`  Both -> Refactor  ← never closed
  3. `4–5`  Red -> Green
  4. `6–6`  Skip  ← never closed
  5. `7–7`  Both  ← never closed
  6. `8–10`  Red -> Green -> Refactor
  7. `11–12`  Red -> Green
  8. `13–14`  Red -> Green
  9. `15–15`  Skip  ← never closed
 10. `16–18`  Red -> Green -> Refactor
 11. `19–20`  Red -> Green
 12. `21–22`  Red -> Green
 13. `23–24`  Skip -> Refactor  ← never closed
 14. `25–27`  Red -> Green -> Refactor
 15. `28–28`  Skip  ← never closed
 16. `29–29`  Skip  ← never closed
 17. `30–32`  Red -> Green -> Refactor
 18. `33–33`  Both  ← never closed
 19. `34–35`  Red -> Green
 20. `36–38`  Red -> Green -> Refactor
 21. `39–41`  Red -> Green -> Refactor
 22. `42–44`  Red -> Green -> Refactor
 23. `45–45`  Skip  ← never closed
 24. `46–46`  Skip  ← never closed
 25. `47–47`  Skip  ← never closed
 26. `48–48`  Skip  ← never closed
 27. `49–51`  Red -> Both -> Refactor  ← never closed
 28. `52–52`  Skip  ← never closed
 29. `53–53`  Skip  ← never closed
 30. `54–57`  Red -> Verify -> Green -> Refactor
 31. `58–58`  Skip  ← never closed
 32. `59–59`  Skip  ← never closed
 33. `60–60`  Skip  ← never closed
 34. `61–61`  Skip  ← never closed
 35. `62–62`  Skip  ← never closed
 36. `63–65`  Red -> Green -> Refactor
 37. `66–68`  Red -> Green -> Refactor
 38. `69–70`  Red -> Green
 39. `71–72`  Red -> Green
 40. `73–75`  Red -> Green -> Refactor
 41. `76–76`  Skip  ← never closed
 42. `77–79`  Red -> Green -> Refactor
 43. `80–80`  Skip  ← never closed
 44. `81–81`  Skip  ← never closed
 45. `82–82`  Skip  ← never closed
 46. `83–84`  Red -> Green
 47. `85–88`  Red -> Green -> Refactor -> Refactor
 48. `89–89`  Skip  ← never closed
 49. `90–90`  Skip  ← never closed
 50. `91–91`  Skip  ← never closed
 51. `92–93`  Skip -> Refactor  ← never closed
 52. `94–96`  Red -> Green -> Refactor
 53. `97–97`  Skip  ← never closed
 54. `98–100`  Red -> Green -> Refactor
 55. `101–103`  Red -> Both -> Refactor  ← never closed
 56. `104–106`  Red -> Green -> Refactor
 57. `107–107`  Skip  ← never closed
 58. `108–108`  Skip  ← never closed
 59. `109–111`  Red -> Green -> Refactor
 60. `112–113`  Red -> Green
 61. `114–117`  Red -> Verify -> Green -> Verify
 62. `118–119`  Red -> Green
 63. `120–122`  Skip -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 31 | a new failing test arrived |
| `Green` | 29 | implementation changed, suite went green |
| `Skip` | 28 | test arrived and passed immediately — never red |
| `Refactor` | 23 | implementation changed, suite stayed green |
| `Both` | 5 | test and implementation changed together — no verified red |
| `Verify` | 5 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Both | fail | 0/1 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 3 | Refactor | pass | 1/0 | `src/claim-office.ts` |
| 4 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 5 | Green | pass | 2/0 | `src/claim-office.ts` |
| 6 | Skip | pass | 2/0 | `src/claim-office.spec.ts` |
| 7 | Both | pass | 2/0 | `src/claim-office.spec.ts`, `src/claim-office.ts`, `src/premium.ts` |
| 8 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 9 | Green | pass | 3/0 | `src/premium.ts` |
| 10 | Refactor | pass | 3/0 | `src/premium.ts` |
| 11 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 4/0 | `src/premium.ts` |
| 13 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 5/0 | `src/premium.ts` |
| 15 | Skip | pass | 6/0 | `src/claim-office.spec.ts` |
| 16 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 7/0 | `src/premium.ts` |
| 18 | Refactor | pass | 7/0 | `src/premium.ts` |
| 19 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 8/0 | `src/premium.ts` |
| 21 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 22 | Green | pass | 9/0 | `src/premium.ts` |
| 23 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 24 | Refactor | pass | 9/0 | `src/premium.ts` |
| 25 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 26 | Green | pass | 10/0 | `src/premium.ts` |
| 27 | Refactor | pass | 10/0 | `src/premium.ts` |
| 28 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 29 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 30 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 31 | Green | pass | 13/0 | `src/premium.ts` |
| 32 | Refactor | pass | 13/0 | `src/premium.ts` |
| 33 | Both | pass | 13/0 | `src/claim-office.spec.ts`, `src/claim-office.ts`, `src/premium.ts`, `src/price-list.ts` |
| 34 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 35 | Green | pass | 14/0 | `src/price-list.ts` |
| 36 | Red | fail | 14/1 | `src/claim-office.spec.ts` |
| 37 | Green | pass | 15/0 | `src/premium.ts`, `src/price-list.ts` |
| 38 | Refactor | pass | 15/0 | `src/premium.ts` |
| 39 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 40 | Green | pass | 16/0 | `src/premium.ts`, `src/price-list.ts` |
| 41 | Refactor | pass | 16/0 | `src/premium.ts` |
| 42 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 43 | Green | pass | 17/0 | `src/premium.ts`, `src/price-list.ts` |
| 44 | Refactor | pass | 17/0 | `src/premium.ts` |
| 45 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 46 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 47 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 48 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 49 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 50 | Both | pass | 22/0 | `src/claim-office.spec.ts`, `src/claim-office.ts`, `src/premium.ts` |
| 51 | Refactor | pass | 22/0 | `src/premium.ts` |
| 52 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 53 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 54 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 55 | Verify | fail | 24/1 | — |
| 56 | Green | pass | 25/0 | `src/claim-office.ts`, `src/premium.ts` |
| 57 | Refactor | pass | 25/0 | `src/premium.ts` |
| 58 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 59 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 63 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 64 | Green | pass | 29/0 | `src/claim-office.ts`, `src/claim.ts`, `src/price-list.ts` |
| 65 | Refactor | pass | 29/0 | `src/claim-office.ts`, `src/claim.ts` |
| 66 | Red | fail | 29/1 | `src/claim-office.spec.ts` |
| 67 | Green | pass | 30/0 | `src/price-list.ts` |
| 68 | Refactor | pass | 30/0 | `src/price-list.ts` |
| 69 | Red | fail | 30/1 | `src/claim-office.spec.ts` |
| 70 | Green | pass | 31/0 | `src/price-list.ts` |
| 71 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 72 | Green | pass | 32/0 | `src/price-list.ts` |
| 73 | Red | fail | 32/1 | `src/claim-office.spec.ts` |
| 74 | Green | pass | 33/0 | `src/price-list.ts` |
| 75 | Refactor | pass | 33/0 | `src/price-list.ts` |
| 76 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 77 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 78 | Green | pass | 35/0 | `src/claim.ts` |
| 79 | Refactor | pass | 35/0 | `src/claim.ts` |
| 80 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 81 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 82 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 83 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 84 | Green | pass | 39/0 | `src/claim.ts` |
| 85 | Red | fail | 39/1 | `src/claim-office.spec.ts` |
| 86 | Green | pass | 40/0 | `src/claim.ts` |
| 87 | Refactor | pass | 40/0 | `src/claim.ts`, `src/percent.ts`, `src/premium.ts` |
| 88 | Refactor | pass | 40/0 | `src/claim.ts` |
| 89 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 90 | Skip | pass | 42/0 | `src/claim-office.spec.ts` |
| 91 | Skip | pass | 43/0 | `src/claim-office.spec.ts` |
| 92 | Skip | pass | 44/0 | `src/claim-office.spec.ts` |
| 93 | Refactor | pass | 44/0 | `src/claim.ts`, `src/price-list.ts` |
| 94 | Red | fail | 44/1 | `src/claim-office.spec.ts` |
| 95 | Green | pass | 45/0 | `src/claim.ts` |
| 96 | Refactor | pass | 45/0 | `src/claim.ts`, `src/premium.ts`, `src/rounding.ts` |
| 97 | Skip | pass | 46/0 | `src/claim-office.spec.ts` |
| 98 | Red | fail | 46/1 | `src/claim-office.spec.ts` |
| 99 | Green | pass | 47/0 | `src/claim.ts` |
| 100 | Refactor | pass | 47/0 | `src/claim.ts` |
| 101 | Red | fail | 47/1 | `src/claim-office.spec.ts` |
| 102 | Both | pass | 48/0 | `src/claim-office.spec.ts`, `src/claim-office.ts`, `src/claim.ts` |
| 103 | Refactor | pass | 48/0 | `src/claim.ts` |
| 104 | Red | fail | 48/1 | `src/claim-office.spec.ts` |
| 105 | Green | pass | 49/0 | `src/claim.ts` |
| 106 | Refactor | pass | 49/0 | `src/claim.ts` |
| 107 | Skip | pass | 50/0 | `src/claim-office.spec.ts` |
| 108 | Skip | pass | 51/0 | `src/claim-office.spec.ts` |
| 109 | Red | fail | 51/1 | `src/claim-office.spec.ts` |
| 110 | Green | pass | 52/0 | `src/claim.ts` |
| 111 | Refactor | pass | 52/0 | `src/claim.ts` |
| 112 | Red | fail | 52/1 | `src/claim-office.spec.ts` |
| 113 | Green | pass | 53/0 | `src/claim-office.ts` |
| 114 | Red | fail | 53/1 | `src/cli.spec.ts` |
| 115 | Verify | fail | 53/1 | — |
| 116 | Green | pass | 54/0 | `src/cli.ts` |
| 117 | Verify | pass | 54/0 | — |
| 118 | Red | fail | 54/1 | `src/cli.spec.ts` |
| 119 | Green | pass | 55/0 | `src/cli.ts` |
| 120 | Skip | pass | 56/0 | `src/cli.spec.ts` |
| 121 | Verify | pass | 56/0 | — |
| 122 | Verify | pass | 56/0 | — |

Final suite state: **pass**.

