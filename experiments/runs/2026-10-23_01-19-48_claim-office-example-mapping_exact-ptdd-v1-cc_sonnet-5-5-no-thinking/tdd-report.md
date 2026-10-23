# TDD phase chain — 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

**103 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Red -> Green -> Both -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Refactor -> Red -> Green -> Red -> Green -> Both -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Skip -> Both -> Refactor -> Both -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Verify -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Skip -> Refactor -> Skip -> Refactor -> Verify
```

Deviations present: `Both` ×4 (test and implementation changed together — no verified red), `Skip` ×22 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 103 |
| `cycles_total` | 56 |
| `cycles_closed` | 29 |
| `test_first_rate` | 0.536 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 15 |
| `skip_events` | 22 |
| `refactor_per_cycle` | 0.517 |
| `green_attempts` | 0.0 |
| `deviations` | 26 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.652 |
| `tdd_discipline_test_first` | 0.536 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.518 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (29 of 56 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red(c) -> Red -> Green
  3. `5–6`  Red -> Green
  4. `7–7`  Both  ← never closed
  5. `8–9`  Red -> Green
  6. `10–11`  Red -> Green
  7. `12–13`  Red -> Green
  8. `14–15`  Red -> Green
  9. `16–17`  Red -> Green
 10. `18–21`  Red -> Green -> Refactor -> Refactor
 11. `22–23`  Red -> Green
 12. `24–25`  Red -> Green
 13. `26–27`  Both -> Refactor  ← never closed
 14. `28–28`  Skip  ← never closed
 15. `29–29`  Skip  ← never closed
 16. `30–30`  Skip  ← never closed
 17. `31–31`  Skip  ← never closed
 18. `32–34`  Red -> Green -> Refactor
 19. `35–36`  Red -> Green
 20. `37–37`  Skip  ← never closed
 21. `38–38`  Skip  ← never closed
 22. `39–39`  Skip  ← never closed
 23. `40–40`  Skip  ← never closed
 24. `41–43`  Red -> Green -> Refactor
 25. `44–44`  Skip  ← never closed
 26. `45–45`  Skip  ← never closed
 27. `46–47`  Red -> Green
 28. `48–48`  Skip  ← never closed
 29. `49–50`  Both -> Refactor  ← never closed
 30. `51–51`  Both  ← never closed
 31. `52–53`  Red -> Green
 32. `54–56`  Red -> Green -> Refactor
 33. `57–57`  Skip  ← never closed
 34. `58–59`  Red -> Green
 35. `60–60`  Skip  ← never closed
 36. `61–61`  Skip  ← never closed
 37. `62–63`  Red -> Green
 38. `64–66`  Red -> Green -> Refactor
 39. `67–69`  Red -> Green -> Refactor
 40. `70–71`  Red -> Green
 41. `72–73`  Red -> Green
 42. `74–75`  Red -> Green
 43. `76–78`  Red -> Green -> Refactor
 44. `79–81`  Red -> Green -> Refactor
 45. `82–82`  Skip  ← never closed
 46. `83–83`  Skip  ← never closed
 47. `84–84`  Skip  ← never closed
 48. `85–88`  Red -> Verify -> Green -> Refactor
 49. `89–89`  Skip  ← never closed
 50. `90–91`  Red -> Green
 51. `92–92`  Skip  ← never closed
 52. `93–93`  Skip  ← never closed
 53. `94–96`  Red -> Green -> Refactor
 54. `97–98`  Red -> Green
 55. `99–100`  Skip -> Refactor  ← never closed
 56. `101–103`  Skip -> Refactor -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 29 | a new failing test arrived |
| `Green` | 29 | implementation changed, suite went green |
| `Skip` | 22 | test arrived and passed immediately — never red |
| `Refactor` | 15 | implementation changed, suite stayed green |
| `Both` | 4 | test and implementation changed together — no verified red |
| `Verify` | 2 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

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
| 8 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 9 | Green | pass | 3/0 | `src/claim-office.ts` |
| 10 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 4/0 | `src/claim-office.ts` |
| 12 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 5/0 | `src/claim-office.ts` |
| 14 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 6/0 | `src/claim-office.ts` |
| 16 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 7/0 | `src/claim-office.ts` |
| 18 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 8/0 | `src/claim-office.ts` |
| 20 | Refactor | pass | 8/0 | `src/claim-office.ts` |
| 21 | Refactor | pass | 8/0 | `src/claim-office.ts` |
| 22 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 23 | Green | pass | 9/0 | `src/claim-office.ts` |
| 24 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 25 | Green | pass | 10/0 | `src/claim-office.ts` |
| 26 | Both | pass | 10/0 | `src/claim-office.spec.ts`, `src/claim-office.ts`, `src/price-list.ts` |
| 27 | Refactor | pass | 10/0 | `src/claim-office.ts` |
| 28 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 29 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 30 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 31 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 32 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 33 | Green | pass | 16/0 | `src/claim-office.ts`, `src/price-list.ts` |
| 34 | Refactor | pass | 16/0 | `src/claim-office.ts`, `src/quote.ts` |
| 35 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 17/0 | `src/quote.ts` |
| 37 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 38 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 39 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 40 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 41 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 42 | Green | pass | 22/0 | `src/claim-office.ts`, `src/quote.ts` |
| 43 | Refactor | pass | 22/0 | `src/quote.ts` |
| 44 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 45 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 46 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 47 | Green | pass | 25/0 | `src/claim-office.ts`, `src/quote.ts` |
| 48 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 49 | Both | fail | 26/1 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 50 | Refactor | pass | 27/0 | `src/claim-office.ts`, `src/price-list.ts` |
| 51 | Both | pass | 27/0 | `src/claim-office.spec.ts`, `src/claim-office.ts`, `src/claim.ts` |
| 52 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 53 | Green | pass | 28/0 | `src/price-list.ts` |
| 54 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 55 | Green | pass | 29/0 | `src/claim.ts` |
| 56 | Refactor | pass | 29/0 | `src/claim.ts` |
| 57 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 58 | Red | fail | 30/1 | `src/claim-office.spec.ts` |
| 59 | Green | pass | 31/0 | `src/claim.ts` |
| 60 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 62 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 63 | Green | pass | 35/0 | `src/claim.ts` |
| 64 | Red | fail | 35/1 | `src/claim-office.spec.ts` |
| 65 | Green | pass | 36/0 | `src/claim.ts` |
| 66 | Refactor | pass | 36/0 | `src/claim.ts` |
| 67 | Red | fail | 36/1 | `src/claim-office.spec.ts` |
| 68 | Green | pass | 37/0 | `src/claim.ts` |
| 69 | Refactor | pass | 37/0 | `src/claim.ts` |
| 70 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 71 | Green | pass | 38/0 | `src/price-list.ts` |
| 72 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 39/0 | `src/price-list.ts` |
| 74 | Red | fail | 39/1 | `src/claim-office.spec.ts` |
| 75 | Green | pass | 40/0 | `src/price-list.ts` |
| 76 | Red | fail | 40/1 | `src/claim-office.spec.ts` |
| 77 | Green | pass | 41/0 | `src/price-list.ts` |
| 78 | Refactor | pass | 41/0 | `src/price-list.ts` |
| 79 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 80 | Green | pass | 42/0 | `src/claim.ts` |
| 81 | Refactor | pass | 42/0 | `src/claim.ts`, `src/price-list.ts` |
| 82 | Skip | pass | 43/0 | `src/claim-office.spec.ts` |
| 83 | Skip | pass | 44/0 | `src/claim-office.spec.ts` |
| 84 | Skip | pass | 45/0 | `src/claim-office.spec.ts` |
| 85 | Red | fail | 45/1 | `src/claim-office.spec.ts` |
| 86 | Verify | fail | 0/1 | — |
| 87 | Green | pass | 46/0 | `src/claim-office.ts`, `src/claim.ts` |
| 88 | Refactor | pass | 46/0 | `src/claim-office.ts`, `src/claim.ts` |
| 89 | Skip | pass | 47/0 | `src/claim-office.spec.ts` |
| 90 | Red | fail | 47/1 | `src/claim-office.spec.ts` |
| 91 | Green | pass | 48/0 | `src/claim.ts` |
| 92 | Skip | pass | 49/0 | `src/claim-office.spec.ts` |
| 93 | Skip | pass | 50/0 | `src/claim-office.spec.ts` |
| 94 | Red | fail | 50/1 | `src/claim-office.spec.ts` |
| 95 | Green | pass | 51/0 | `src/claim.ts` |
| 96 | Refactor | pass | 51/0 | `src/claim.ts` |
| 97 | Red | fail | 51/1 | `src/cli.spec.ts` |
| 98 | Green | pass | 52/0 | `src/cli.ts` |
| 99 | Skip | pass | 53/0 | `src/cli.spec.ts` |
| 100 | Refactor | pass | 53/0 | `src/cli.ts` |
| 101 | Skip | pass | 54/0 | `src/cli.spec.ts` |
| 102 | Refactor | pass | 54/0 | `src/cli.ts` |
| 103 | Verify | pass | 54/0 | — |

Final suite state: **pass**.

