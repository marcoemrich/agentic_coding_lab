# TDD phase chain — 2026-10-23_02-20-32_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

**107 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Refactor -> Refactor -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red(c) -> Both -> Green -> Red -> Green -> Both -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Verify -> Green? -> Green -> Skip -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Both -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Refactor -> Red -> Verify -> Green -> Red -> Green -> Skip -> Refactor
```

Deviations present: `Both` ×3 (test and implementation changed together — no verified red), `Green?` ×1 (implementation changed, still failing), `Skip` ×27 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 107 |
| `cycles_total` | 58 |
| `cycles_closed` | 28 |
| `test_first_rate` | 0.492 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 2 |
| `green_batch_size` | 20.5 |
| `refactor_events` | 16 |
| `skip_events` | 27 |
| `refactor_per_cycle` | 0.571 |
| `green_attempts` | 0.036 |
| `deviations` | 30 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.619 |
| `tdd_discipline_test_first` | 0.492 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.483 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (28 of 58 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–6`  Red(c) -> Red -> Green -> Refactor -> Refactor
  3. `7–8`  Red -> Green
  4. `9–11`  Red -> Green -> Refactor
  5. `12–13`  Red -> Green
  6. `14–15`  Red -> Green
  7. `16–18`  Red -> Green -> Refactor
  8. `19–19`  Skip  ← never closed
  9. `20–20`  Skip  ← never closed
 10. `21–21`  Skip  ← never closed
 11. `22–24`  Red -> Green -> Refactor
 12. `25–25`  Skip  ← never closed
 13. `26–26`  Skip  ← never closed
 14. `27–29`  Red(c) -> Both -> Green
 15. `30–31`  Red -> Green
 16. `32–32`  Both  ← never closed
 17. `33–35`  Red -> Green -> Refactor
 18. `36–38`  Red -> Green -> Refactor
 19. `39–39`  Skip  ← never closed
 20. `40–40`  Skip  ← never closed
 21. `41–41`  Skip  ← never closed
 22. `42–44`  Red -> Green -> Refactor
 23. `45–45`  Skip  ← never closed
 24. `46–46`  Skip  ← never closed
 25. `47–47`  Skip  ← never closed
 26. `48–49`  Red -> Green
 27. `50–50`  Skip  ← never closed
 28. `51–51`  Skip  ← never closed
 29. `52–54`  Red -> Green -> Refactor
 30. `55–58`  Red -> Verify -> Green? -> Green
 31. `59–59`  Skip  ← never closed
 32. `60–61`  Red -> Green
 33. `62–63`  Red -> Green
 34. `64–64`  Skip  ← never closed
 35. `65–67`  Red -> Green -> Refactor
 36. `68–68`  Both  ← never closed
 37. `69–69`  Skip  ← never closed
 38. `70–70`  Skip  ← never closed
 39. `71–71`  Skip  ← never closed
 40. `72–73`  Red -> Green
 41. `74–74`  Skip  ← never closed
 42. `75–78`  Red -> Green -> Refactor -> Refactor
 43. `79–79`  Skip  ← never closed
 44. `80–80`  Skip  ← never closed
 45. `81–82`  Red -> Green
 46. `83–84`  Red -> Green
 47. `85–85`  Skip  ← never closed
 48. `86–87`  Red -> Green
 49. `88–89`  Red -> Green
 50. `90–92`  Red -> Green -> Refactor
 51. `93–93`  Skip  ← never closed
 52. `94–94`  Skip  ← never closed
 53. `95–95`  Skip  ← never closed
 54. `96–98`  Red -> Green -> Refactor
 55. `99–100`  Skip -> Refactor  ← never closed
 56. `101–103`  Red -> Verify -> Green
 57. `104–105`  Red -> Green
 58. `106–107`  Skip -> Refactor  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Green` | 28 | implementation changed, suite went green |
| `Red` | 27 | a new failing test arrived |
| `Skip` | 27 | test arrived and passed immediately — never red |
| `Refactor` | 16 | implementation changed, suite stayed green |
| `Both` | 3 | test and implementation changed together — no verified red |
| `Red(c)` | 2 | test arrived, suite does not compile yet |
| `Verify` | 2 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 4 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/base-premium.spec.ts` |
| 3 | Red | fail | 0/1 | `src/base-premium.ts` |
| 4 | Green | pass | 1/0 | `src/base-premium.ts` |
| 5 | Refactor | pass | 1/0 | `src/base-premium.ts` |
| 6 | Refactor | pass | 1/0 | `src/base-premium.ts` |
| 7 | Red | fail | 1/1 | `src/base-premium.spec.ts` |
| 8 | Green | pass | 2/0 | `src/base-premium.ts` |
| 9 | Red | fail | 2/1 | `src/base-premium.spec.ts` |
| 10 | Green | pass | 3/0 | `src/base-premium.ts` |
| 11 | Refactor | pass | 3/0 | `src/base-premium.ts`, `src/price-list.ts` |
| 12 | Red | fail | 3/1 | `src/base-premium.spec.ts` |
| 13 | Green | pass | 4/0 | `src/price-list.ts` |
| 14 | Red | fail | 4/1 | `src/base-premium.spec.ts` |
| 15 | Green | pass | 5/0 | `src/base-premium.ts`, `src/price-list.ts` |
| 16 | Red | fail | 5/1 | `src/base-premium.spec.ts` |
| 17 | Green | pass | 6/0 | `src/base-premium.ts`, `src/price-list.ts` |
| 18 | Refactor | pass | 6/0 | `src/base-premium.ts` |
| 19 | Skip | pass | 7/0 | `src/base-premium.spec.ts` |
| 20 | Skip | pass | 8/0 | `src/base-premium.spec.ts` |
| 21 | Skip | pass | 9/0 | `src/base-premium.spec.ts` |
| 22 | Red | fail | 9/1 | `src/base-premium.spec.ts` |
| 23 | Green | pass | 10/0 | `src/base-premium.ts` |
| 24 | Refactor | pass | 10/0 | `src/base-premium.ts` |
| 25 | Skip | pass | 11/0 | `src/base-premium.spec.ts` |
| 26 | Skip | pass | 12/0 | `src/base-premium.spec.ts` |
| 27 | Red(c) | fail (1 collect err) | 0/0 | `src/quote.spec.ts` |
| 28 | Both | fail | 0/1 | `src/quote.spec.ts`, `src/scenario.ts` |
| 29 | Green | pass | 13/0 | `src/scenario.ts` |
| 30 | Red | fail | 1/1 | `src/quote.spec.ts` |
| 31 | Green | pass | 14/0 | `src/scenario.ts` |
| 32 | Both | pass | 14/0 | `src/base-premium.ts`, `src/item.ts`, `src/premium.ts`, `src/quote.spec.ts`, `src/scenario.ts` |
| 33 | Red | fail | 2/1 | `src/quote.spec.ts` |
| 34 | Green | pass | 15/0 | `src/premium.ts` |
| 35 | Refactor | pass | 15/0 | `src/premium.ts` |
| 36 | Red | fail | 3/1 | `src/quote.spec.ts` |
| 37 | Green | pass | 16/0 | `src/premium.ts` |
| 38 | Refactor | pass | 16/0 | `src/item-risk-surcharge.ts`, `src/premium.ts` |
| 39 | Skip | pass | 17/0 | `src/quote.spec.ts` |
| 40 | Skip | pass | 18/0 | `src/quote.spec.ts` |
| 41 | Skip | pass | 19/0 | `src/quote.spec.ts` |
| 42 | Red | fail | 7/1 | `src/quote.spec.ts` |
| 43 | Green | pass | 20/0 | `src/premium.ts`, `src/scenario.ts` |
| 44 | Refactor | pass | 20/0 | `src/policy-modifiers.ts`, `src/premium.ts`, `src/scenario.ts` |
| 45 | Skip | pass | 21/0 | `src/quote.spec.ts` |
| 46 | Skip | pass | 22/0 | `src/quote.spec.ts` |
| 47 | Skip | pass | 23/0 | `src/quote.spec.ts` |
| 48 | Red | fail | 11/1 | `src/quote.spec.ts` |
| 49 | Green | pass | 24/0 | `src/policy-modifiers.ts`, `src/premium.ts`, `src/scenario.ts` |
| 50 | Skip | pass | 25/0 | `src/quote.spec.ts` |
| 51 | Skip | pass | 26/0 | `src/quote.spec.ts` |
| 52 | Red | fail | 14/1 | `src/quote.spec.ts` |
| 53 | Green | pass | 27/0 | `src/price-list.ts`, `src/scenario.ts` |
| 54 | Refactor | pass | 27/0 | `src/scenario.ts` |
| 55 | Red | fail | 0/1 | `src/claim.spec.ts` |
| 56 | Verify | fail | 0/1 | — |
| 57 | Green? | fail | 0/1 | `src/scenario.ts` |
| 58 | Green | pass | 28/0 | `src/claim.ts`, `src/price-list.ts`, `src/scenario.ts` |
| 59 | Skip | pass | 28/0 | `src/claim.spec.ts` |
| 60 | Red | fail | 1/1 | `src/claim.spec.ts` |
| 61 | Green | pass | 29/0 | `src/claim.ts`, `src/price-list.ts` |
| 62 | Red | fail | 2/1 | `src/claim.spec.ts` |
| 63 | Green | pass | 30/0 | `src/claim.ts` |
| 64 | Skip | pass | 31/0 | `src/claim.spec.ts` |
| 65 | Red | fail | 4/1 | `src/claim.spec.ts` |
| 66 | Green | pass | 32/0 | `src/claim.ts` |
| 67 | Refactor | pass | 32/0 | `src/claim.ts`, `src/reimbursement.ts` |
| 68 | Both | pass | 33/0 | `src/claim.spec.ts`, `src/claim.ts` |
| 69 | Skip | pass | 34/0 | `src/claim.spec.ts` |
| 70 | Skip | pass | 35/0 | `src/claim.spec.ts` |
| 71 | Skip | pass | 36/0 | `src/claim.spec.ts` |
| 72 | Red | fail | 9/1 | `src/claim.spec.ts` |
| 73 | Green | pass | 37/0 | `src/claim.ts` |
| 74 | Skip | pass | 38/0 | `src/claim.spec.ts` |
| 75 | Red | fail | 11/1 | `src/claim.spec.ts` |
| 76 | Green | pass | 39/0 | `src/claim.ts` |
| 77 | Refactor | pass | 39/0 | `src/coverage.ts`, `src/scenario.ts` |
| 78 | Refactor | pass | 39/0 | `src/claim.ts` |
| 79 | Skip | pass | 40/0 | `src/claim.spec.ts` |
| 80 | Skip | pass | 41/0 | `src/claim.spec.ts` |
| 81 | Red | fail | 14/1 | `src/claim.spec.ts` |
| 82 | Green | pass | 42/0 | `src/claim.ts` |
| 83 | Red | fail | 15/1 | `src/claim.spec.ts` |
| 84 | Green | pass | 43/0 | `src/scenario.ts` |
| 85 | Skip | pass | 44/0 | `src/claim.spec.ts` |
| 86 | Red | fail | 17/1 | `src/claim.spec.ts` |
| 87 | Green | pass | 45/0 | `src/price-list.ts` |
| 88 | Red | fail | 18/1 | `src/claim.spec.ts` |
| 89 | Green | pass | 46/0 | `src/price-list.ts` |
| 90 | Red | fail | 19/1 | `src/claim.spec.ts` |
| 91 | Green | pass | 47/0 | `src/price-list.ts` |
| 92 | Refactor | pass | 47/0 | `src/base-premium.ts`, `src/coverage.ts`, `src/item-risk-surcharge.ts`, `src/price-list.ts` |
| 93 | Skip | pass | 48/0 | `src/claim.spec.ts` |
| 94 | Skip | pass | 49/0 | `src/claim.spec.ts` |
| 95 | Skip | pass | 50/0 | `src/claim.spec.ts` |
| 96 | Red | fail | 23/1 | `src/claim.spec.ts` |
| 97 | Green | pass | 51/0 | `src/claim.ts`, `src/scenario.ts` |
| 98 | Refactor | pass | 51/0 | `src/scenario.ts` |
| 99 | Skip | pass | 52/0 | `src/quote.spec.ts` |
| 100 | Refactor | pass | 52/0 | `src/scenario.ts` |
| 101 | Red | fail | 0/1 | `src/cli.spec.ts` |
| 102 | Verify | fail | 0/1 | — |
| 103 | Green | pass | 53/0 | `src/cli.ts` |
| 104 | Red | fail | 1/1 | `src/cli.spec.ts` |
| 105 | Green | pass | 54/0 | `src/cli.ts` |
| 106 | Skip | pass | 55/0 | `src/cli.spec.ts` |
| 107 | Refactor | pass | 55/0 | `src/cli.ts` |

Final suite state: **pass**.

