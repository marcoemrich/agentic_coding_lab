# TDD phase chain — 2026-11-12_01-56-34_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

**123 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Both -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Verify -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Red -> Green? -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Verify -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Refactor -> Refactor -> Verify
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Green?` ×1 (implementation changed, still failing), `Skip` ×24 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 123 |
| `cycles_total` | 58 |
| `cycles_closed` | 32 |
| `test_first_rate` | 0.569 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 27 |
| `skip_events` | 24 |
| `refactor_per_cycle` | 0.844 |
| `green_attempts` | 0.031 |
| `deviations` | 25 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.68 |
| `tdd_discipline_test_first` | 0.569 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.552 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (32 of 58 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red(c) -> Red -> Green
  3. `5–5`  Skip  ← never closed
  4. `6–8`  Red -> Green -> Refactor
  5. `9–10`  Red -> Green
  6. `11–11`  Both  ← never closed
  7. `12–14`  Red -> Green -> Refactor
  8. `15–16`  Red -> Green
  9. `17–18`  Red -> Green
 10. `19–21`  Red -> Green -> Refactor
 11. `22–22`  Skip  ← never closed
 12. `23–25`  Red -> Green -> Refactor
 13. `26–26`  Skip  ← never closed
 14. `27–29`  Red -> Green -> Refactor
 15. `30–30`  Skip  ← never closed
 16. `31–34`  Red -> Green -> Refactor -> Refactor
 17. `35–37`  Red -> Green -> Refactor
 18. `38–38`  Skip  ← never closed
 19. `39–39`  Skip  ← never closed
 20. `40–40`  Skip  ← never closed
 21. `41–42`  Red -> Green
 22. `43–45`  Red -> Green -> Refactor
 23. `46–48`  Red -> Green -> Refactor
 24. `49–49`  Skip  ← never closed
 25. `50–53`  Red -> Verify -> Green -> Refactor
 26. `54–54`  Skip  ← never closed
 27. `55–55`  Skip  ← never closed
 28. `56–57`  Red -> Green
 29. `58–61`  Red -> Green? -> Green -> Refactor
 30. `62–64`  Red -> Green -> Refactor
 31. `65–67`  Red -> Green -> Refactor
 32. `68–68`  Skip  ← never closed
 33. `69–69`  Skip  ← never closed
 34. `70–70`  Skip  ← never closed
 35. `71–71`  Skip  ← never closed
 36. `72–74`  Red -> Green -> Refactor
 37. `75–75`  Skip  ← never closed
 38. `76–78`  Red -> Green -> Refactor
 39. `79–81`  Red -> Green -> Refactor
 40. `82–84`  Red -> Green -> Refactor
 41. `85–85`  Skip  ← never closed
 42. `86–86`  Skip  ← never closed
 43. `87–88`  Red -> Green
 44. `89–89`  Skip  ← never closed
 45. `90–90`  Skip  ← never closed
 46. `91–92`  Red -> Green
 47. `93–95`  Red -> Green -> Refactor
 48. `96–96`  Skip  ← never closed
 49. `97–99`  Red -> Green -> Refactor
 50. `100–100`  Skip  ← never closed
 51. `101–104`  Red -> Green -> Refactor -> Refactor
 52. `105–105`  Skip  ← never closed
 53. `106–106`  Skip  ← never closed
 54. `107–109`  Red -> Green -> Refactor
 55. `110–113`  Red -> Green -> Refactor -> Verify
 56. `114–115`  Red -> Green
 57. `116–118`  Red -> Green -> Refactor
 58. `119–123`  Skip -> Refactor -> Refactor -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 32 | a new failing test arrived |
| `Green` | 32 | implementation changed, suite went green |
| `Refactor` | 27 | implementation changed, suite stayed green |
| `Skip` | 24 | test arrived and passed immediately — never red |
| `Verify` | 4 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Both` | 1 | test and implementation changed together — no verified red |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/claim-office.ts` |
| 4 | Green | pass | 1/0 | `src/claim-office.ts` |
| 5 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green | pass | 2/0 | `src/claim-office.ts` |
| 8 | Refactor | pass | 2/0 | `src/claim-office.ts` |
| 9 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 10 | Green | pass | 3/0 | `src/claim-office.ts` |
| 11 | Both | pass | 3/0 | `src/claim-office.spec.ts`, `src/claim-office.ts`, `src/price-list.ts` |
| 12 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 4/0 | `src/price-list.ts` |
| 14 | Refactor | pass | 4/0 | `src/claim-office.ts`, `src/premium.ts` |
| 15 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 5/0 | `src/price-list.ts` |
| 17 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 6/0 | `src/price-list.ts` |
| 19 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 7/0 | `src/price-list.ts` |
| 21 | Refactor | pass | 7/0 | `src/price-list.ts` |
| 22 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 23 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 24 | Green | pass | 9/0 | `src/premium.ts` |
| 25 | Refactor | pass | 9/0 | `src/premium.ts` |
| 26 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 27 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 28 | Green | pass | 10/0 | `src/price-list.ts` |
| 29 | Refactor | pass | 10/0 | `src/price-list.ts` |
| 30 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 31 | Red | fail | 11/1 | `src/claim-office.spec.ts` |
| 32 | Green | pass | 12/0 | `src/premium.ts` |
| 33 | Refactor | pass | 12/0 | `src/premium.ts` |
| 34 | Refactor | pass | 12/0 | `src/premium.ts` |
| 35 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 13/0 | `src/premium.ts` |
| 37 | Refactor | pass | 13/0 | `src/premium.ts` |
| 38 | Skip | pass | 14/0 | `src/claim-office.spec.ts` |
| 39 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 40 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 41 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 42 | Green | pass | 17/0 | `src/premium.ts`, `src/price-list.ts` |
| 43 | Red | fail | 17/1 | `src/claim-office.spec.ts` |
| 44 | Green | pass | 18/0 | `src/premium.ts` |
| 45 | Refactor | pass | 18/0 | `src/percent.ts`, `src/premium.ts`, `src/risk-surcharge.ts` |
| 46 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 47 | Green | pass | 19/0 | `src/claim-office.ts`, `src/premium.ts` |
| 48 | Refactor | pass | 19/0 | `src/premium.ts` |
| 49 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 50 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 51 | Verify | fail | 20/1 | — |
| 52 | Green | pass | 21/0 | `src/claim-office.ts`, `src/premium.ts` |
| 53 | Refactor | pass | 21/0 | `src/premium.ts` |
| 54 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 55 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 56 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 57 | Green | pass | 24/0 | `src/price-list.ts` |
| 58 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 59 | Green? | fail | 24/1 | `src/claim-office.ts` |
| 60 | Green | pass | 25/0 | `src/claim-office.ts` |
| 61 | Refactor | pass | 25/0 | `src/claim-office.ts`, `src/claim.ts` |
| 62 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 63 | Green | pass | 26/0 | `src/claim-office.ts`, `src/claim.ts`, `src/price-list.ts` |
| 64 | Refactor | pass | 26/0 | `src/claim-office.ts` |
| 65 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 66 | Green | pass | 27/0 | `src/claim.ts` |
| 67 | Refactor | pass | 27/0 | `src/claim.ts` |
| 68 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 69 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 70 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 71 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 72 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 32/0 | `src/claim.ts` |
| 74 | Refactor | pass | 32/0 | `src/claim.ts` |
| 75 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 76 | Red | fail | 33/1 | `src/claim-office.spec.ts` |
| 77 | Green | pass | 34/0 | `src/claim.ts` |
| 78 | Refactor | pass | 34/0 | `src/claim.ts` |
| 79 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 80 | Green | pass | 35/0 | `src/claim.ts` |
| 81 | Refactor | pass | 35/0 | `src/claim.ts` |
| 82 | Red | fail | 35/1 | `src/claim-office.spec.ts` |
| 83 | Green | pass | 36/0 | `src/claim.ts` |
| 84 | Refactor | pass | 36/0 | `src/claim.ts`, `src/premium.ts`, `src/rounding.ts` |
| 85 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 86 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 87 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 88 | Green | pass | 39/0 | `src/price-list.ts` |
| 89 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 90 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 91 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 92 | Green | pass | 42/0 | `src/price-list.ts` |
| 93 | Red | fail | 42/1 | `src/claim-office.spec.ts` |
| 94 | Green | pass | 43/0 | `src/price-list.ts` |
| 95 | Refactor | pass | 43/0 | `src/price-list.ts` |
| 96 | Skip | pass | 44/0 | `src/claim-office.spec.ts` |
| 97 | Red | fail | 44/1 | `src/claim-office.spec.ts` |
| 98 | Green | pass | 45/0 | `src/claim-office.ts`, `src/claim.ts` |
| 99 | Refactor | pass | 45/0 | `src/claim-office.ts`, `src/claim.ts`, `src/policy.ts` |
| 100 | Skip | pass | 46/0 | `src/claim-office.spec.ts` |
| 101 | Red | fail | 46/1 | `src/claim-office.spec.ts` |
| 102 | Green | pass | 47/0 | `src/claim.ts` |
| 103 | Refactor | pass | 47/0 | `src/claim.ts` |
| 104 | Refactor | pass | 47/0 | `src/claim.ts` |
| 105 | Skip | pass | 48/0 | `src/claim-office.spec.ts` |
| 106 | Skip | pass | 49/0 | `src/claim-office.spec.ts` |
| 107 | Red | fail | 49/1 | `src/claim-office.spec.ts` |
| 108 | Green | pass | 50/0 | `src/claim.ts` |
| 109 | Refactor | pass | 50/0 | `src/claim-office.ts`, `src/claim.ts`, `src/coverage.ts` |
| 110 | Red | fail | 50/1 | `src/claim-office.spec.ts` |
| 111 | Green | pass | 51/0 | `src/claim-office.ts` |
| 112 | Refactor | pass | 51/0 | `src/claim-office.ts` |
| 113 | Verify | pass | 51/0 | — |
| 114 | Red | fail | 51/1 | `src/cli.spec.ts` |
| 115 | Green | pass | 52/0 | `src/cli.ts` |
| 116 | Red | fail | 52/1 | `src/cli.spec.ts` |
| 117 | Green | pass | 53/0 | `src/cli.ts` |
| 118 | Refactor | pass | 53/0 | `src/cli.ts` |
| 119 | Skip | pass | 54/0 | `src/cli.spec.ts` |
| 120 | Refactor | pass | 54/0 | `src/amounts.ts`, `src/claim.ts`, `src/premium.ts`, `src/price-list.ts`, `src/risk-surcharge.ts` |
| 121 | Refactor | pass | 54/0 | `src/percent.ts` |
| 122 | Verify | pass | 54/0 | — |
| 123 | Verify | pass | 54/0 | — |

Final suite state: **pass**.

