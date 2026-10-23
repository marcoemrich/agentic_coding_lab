# TDD phase chain — 2026-10-23_02-20-31_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking-2

**100 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Red -> Green -> Both -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Both -> Red -> Green -> Both -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Verify
```

Deviations present: `Both` ×3 (test and implementation changed together — no verified red), `Skip` ×26 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 100 |
| `cycles_total` | 59 |
| `cycles_closed` | 29 |
| `test_first_rate` | 0.508 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 10 |
| `skip_events` | 26 |
| `refactor_per_cycle` | 0.345 |
| `green_attempts` | 0.0 |
| `deviations` | 29 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.63 |
| `tdd_discipline_test_first` | 0.508 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.492 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (29 of 59 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red(c) -> Red -> Green
  3. `5–6`  Red -> Green
  4. `7–8`  Both -> Refactor  ← never closed
  5. `9–10`  Red -> Green
  6. `11–12`  Red -> Green
  7. `13–14`  Red -> Green
  8. `15–16`  Red -> Green
  9. `17–18`  Red -> Green
 10. `19–20`  Red -> Green
 11. `21–21`  Skip  ← never closed
 12. `22–22`  Skip  ← never closed
 13. `23–25`  Red -> Green -> Refactor
 14. `26–26`  Skip  ← never closed
 15. `27–29`  Red -> Green -> Refactor
 16. `30–33`  Red -> Green -> Refactor -> Refactor
 17. `34–34`  Skip  ← never closed
 18. `35–35`  Skip  ← never closed
 19. `36–37`  Red -> Green
 20. `38–38`  Skip  ← never closed
 21. `39–39`  Skip  ← never closed
 22. `40–42`  Red -> Green -> Refactor
 23. `43–43`  Skip  ← never closed
 24. `44–44`  Skip  ← never closed
 25. `45–45`  Skip  ← never closed
 26. `46–47`  Red -> Green
 27. `48–48`  Both  ← never closed
 28. `49–50`  Red -> Green
 29. `51–51`  Both  ← never closed
 30. `52–53`  Red -> Green
 31. `54–55`  Red -> Green
 32. `56–58`  Red -> Green -> Refactor
 33. `59–59`  Skip  ← never closed
 34. `60–60`  Skip  ← never closed
 35. `61–61`  Skip  ← never closed
 36. `62–62`  Skip  ← never closed
 37. `63–63`  Skip  ← never closed
 38. `64–64`  Skip  ← never closed
 39. `65–66`  Red -> Green
 40. `67–68`  Red -> Green
 41. `69–70`  Red -> Green
 42. `71–71`  Skip  ← never closed
 43. `72–73`  Red -> Green
 44. `74–75`  Red -> Green
 45. `76–79`  Red -> Green -> Refactor -> Refactor
 46. `80–80`  Skip  ← never closed
 47. `81–81`  Skip  ← never closed
 48. `82–83`  Red -> Green
 49. `84–84`  Skip  ← never closed
 50. `85–86`  Red -> Green
 51. `87–87`  Skip  ← never closed
 52. `88–88`  Skip  ← never closed
 53. `89–90`  Red -> Green
 54. `91–92`  Red -> Green
 55. `93–93`  Skip  ← never closed
 56. `94–96`  Red -> Green -> Refactor
 57. `97–97`  Skip  ← never closed
 58. `98–98`  Skip  ← never closed
 59. `99–100`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 29 | a new failing test arrived |
| `Green` | 29 | implementation changed, suite went green |
| `Skip` | 26 | test arrived and passed immediately — never red |
| `Refactor` | 10 | implementation changed, suite stayed green |
| `Both` | 3 | test and implementation changed together — no verified red |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Verify` | 1 | nothing changed, suite re-run |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/claim-office.ts` |
| 4 | Green | pass | 1/0 | `src/claim-office.ts` |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green | pass | 2/0 | `src/claim-office.ts` |
| 7 | Both | pass | 2/0 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 8 | Refactor | pass | 2/0 | `src/claim-office.ts` |
| 9 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 10 | Green | pass | 3/0 | `src/claim-office.ts` |
| 11 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 4/0 | `src/claim-office.ts` |
| 13 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 5/0 | `src/claim-office.ts` |
| 15 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 6/0 | `src/claim-office.ts` |
| 17 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 7/0 | `src/claim-office.ts` |
| 19 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 8/0 | `src/claim-office.ts` |
| 21 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 22 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 23 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 24 | Green | pass | 11/0 | `src/claim-office.ts` |
| 25 | Refactor | pass | 11/0 | `src/claim-office.ts` |
| 26 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 27 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 28 | Green | pass | 13/0 | `src/claim-office.ts` |
| 29 | Refactor | pass | 13/0 | `src/claim-office.ts` |
| 30 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 31 | Green | fail | 7/7 | `src/claim-office.ts` |
| 32 | Refactor | pass | 14/0 | `src/claim-office.ts` |
| 33 | Refactor | pass | 14/0 | `src/claim-office.ts` |
| 34 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 35 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 36 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 37 | Green | pass | 19/0 | `src/claim-office.ts` |
| 38 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 39 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 40 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 41 | Green | pass | 22/0 | `src/claim-office.ts` |
| 42 | Refactor | pass | 22/0 | `src/claim-office.ts` |
| 43 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 44 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 45 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 46 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 47 | Green | pass | 26/0 | `src/claim-office.ts` |
| 48 | Both | pass | 26/0 | `src/claim-office.spec.ts`, `src/claim-office.ts`, `src/quote.ts` |
| 49 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 50 | Green | pass | 27/0 | `src/claim-office.ts`, `src/claim.ts` |
| 51 | Both | pass | 27/0 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 52 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 53 | Green | pass | 28/0 | `src/claim.ts` |
| 54 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 55 | Green | pass | 29/0 | `src/claim.ts` |
| 56 | Red | fail | 29/1 | `src/claim-office.spec.ts` |
| 57 | Green | pass | 30/0 | `src/claim.ts` |
| 58 | Refactor | pass | 30/0 | `src/claim.ts` |
| 59 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 63 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 65 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 66 | Green | pass | 39/0 | `src/claim.ts` |
| 67 | Red | fail | 39/1 | `src/claim-office.spec.ts` |
| 68 | Green | pass | 40/0 | `src/claim.ts` |
| 69 | Red | fail | 40/1 | `src/claim-office.spec.ts` |
| 70 | Green | pass | 41/0 | `src/claim.ts` |
| 71 | Skip | pass | 42/0 | `src/claim-office.spec.ts` |
| 72 | Red | fail | 42/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 43/0 | `src/claim.ts` |
| 74 | Red | fail | 43/1 | `src/claim-office.spec.ts` |
| 75 | Green | pass | 44/0 | `src/claim.ts` |
| 76 | Red | fail | 44/1 | `src/claim-office.spec.ts` |
| 77 | Green | pass | 45/0 | `src/claim.ts` |
| 78 | Refactor | pass | 45/0 | `src/claim.ts`, `src/price-list.ts`, `src/quote.ts` |
| 79 | Refactor | pass | 45/0 | `src/price-list.ts` |
| 80 | Skip | pass | 46/0 | `src/claim-office.spec.ts` |
| 81 | Skip | pass | 47/0 | `src/claim-office.spec.ts` |
| 82 | Red | fail | 47/1 | `src/claim-office.spec.ts` |
| 83 | Green | pass | 48/0 | `src/claim-office.ts`, `src/claim.ts` |
| 84 | Skip | pass | 49/0 | `src/claim-office.spec.ts` |
| 85 | Red | fail | 49/1 | `src/claim-office.spec.ts` |
| 86 | Green | pass | 50/0 | `src/claim.ts` |
| 87 | Skip | pass | 51/0 | `src/claim-office.spec.ts` |
| 88 | Skip | pass | 52/0 | `src/claim-office.spec.ts` |
| 89 | Red | fail | 52/1 | `src/claim-office.spec.ts` |
| 90 | Green | pass | 53/0 | `src/claim.ts` |
| 91 | Red | fail | 53/1 | `src/claim-office.spec.ts` |
| 92 | Green | pass | 54/0 | `src/claim-office.ts` |
| 93 | Skip | pass | 55/0 | `src/claim-office.spec.ts` |
| 94 | Red | fail | 55/1 | `src/cli.spec.ts` |
| 95 | Green | pass | 56/0 | `src/cli.ts` |
| 96 | Refactor | pass | 56/0 | `src/node-api.d.ts` |
| 97 | Skip | pass | 57/0 | `src/cli.spec.ts` |
| 98 | Skip | pass | 58/0 | `src/cli.spec.ts` |
| 99 | Skip | pass | 59/0 | `src/cli.spec.ts` |
| 100 | Verify | pass | 59/0 | — |

Final suite state: **pass**.

