# TDD phase chain — 2026-10-23_02-20-31_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

**102 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Verify -> Green -> Refactor -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Refactor -> Red -> Green -> Verify -> Skip -> Skip -> Verify
```

Deviations present: `Skip` ×24 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 102 |
| `cycles_total` | 53 |
| `cycles_closed` | 28 |
| `test_first_rate` | 0.547 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 17 |
| `skip_events` | 24 |
| `refactor_per_cycle` | 0.607 |
| `green_attempts` | 0.0 |
| `deviations` | 24 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.661 |
| `tdd_discipline_test_first` | 0.547 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.528 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (28 of 53 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red(c) -> Red -> Green
  3. `5–7`  Red -> Green -> Refactor
  4. `8–10`  Red -> Green -> Refactor
  5. `11–12`  Red -> Green
  6. `13–14`  Red -> Green
  7. `15–16`  Red -> Green
  8. `17–19`  Red -> Green -> Refactor
  9. `20–22`  Red -> Green -> Refactor
 10. `23–23`  Skip  ← never closed
 11. `24–24`  Skip  ← never closed
 12. `25–25`  Skip  ← never closed
 13. `26–26`  Skip  ← never closed
 14. `27–27`  Skip  ← never closed
 15. `28–30`  Red -> Green -> Refactor
 16. `31–31`  Skip  ← never closed
 17. `32–32`  Skip  ← never closed
 18. `33–35`  Red -> Green -> Refactor
 19. `36–36`  Skip  ← never closed
 20. `37–37`  Skip  ← never closed
 21. `38–38`  Skip  ← never closed
 22. `39–41`  Red -> Green -> Refactor
 23. `42–42`  Skip  ← never closed
 24. `43–45`  Red -> Green -> Refactor
 25. `46–46`  Skip  ← never closed
 26. `47–48`  Red -> Green
 27. `49–50`  Red -> Green
 28. `51–53`  Red -> Green -> Refactor
 29. `54–55`  Red -> Green
 30. `56–58`  Red -> Green -> Refactor
 31. `59–60`  Red -> Green
 32. `61–62`  Red -> Green
 33. `63–64`  Red -> Green
 34. `65–67`  Red -> Green -> Refactor
 35. `68–70`  Red -> Green -> Refactor
 36. `71–71`  Skip  ← never closed
 37. `72–72`  Skip  ← never closed
 38. `73–73`  Skip  ← never closed
 39. `74–74`  Skip  ← never closed
 40. `75–77`  Red -> Green -> Refactor
 41. `78–78`  Skip  ← never closed
 42. `79–79`  Skip  ← never closed
 43. `80–82`  Red -> Green -> Refactor
 44. `83–83`  Skip  ← never closed
 45. `84–84`  Skip  ← never closed
 46. `85–88`  Red -> Verify -> Green -> Refactor
 47. `89–90`  Red -> Green
 48. `91–91`  Skip  ← never closed
 49. `92–92`  Skip  ← never closed
 50. `93–96`  Red -> Green -> Refactor -> Refactor
 51. `97–99`  Red -> Green -> Verify
 52. `100–100`  Skip  ← never closed
 53. `101–102`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 28 | a new failing test arrived |
| `Green` | 28 | implementation changed, suite went green |
| `Skip` | 24 | test arrived and passed immediately — never red |
| `Refactor` | 17 | implementation changed, suite stayed green |
| `Verify` | 3 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/scenario.ts` |
| 4 | Green | pass | 1/0 | `src/scenario.ts` |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green | pass | 2/0 | `src/scenario.ts` |
| 7 | Refactor | pass | 2/0 | `src/scenario.ts` |
| 8 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 9 | Green | pass | 3/0 | `src/scenario.ts` |
| 10 | Refactor | pass | 3/0 | `src/price-list.ts`, `src/scenario.ts` |
| 11 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 4/0 | `src/price-list.ts` |
| 13 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 5/0 | `src/price-list.ts` |
| 15 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 6/0 | `src/price-list.ts` |
| 17 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 7/0 | `src/price-list.ts` |
| 19 | Refactor | pass | 7/0 | `src/price-list.ts` |
| 20 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 21 | Green | pass | 8/0 | `src/price-list.ts`, `src/scenario.ts` |
| 22 | Refactor | pass | 8/0 | `src/price-list.ts` |
| 23 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 24 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 25 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 26 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 27 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 28 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 29 | Green | pass | 14/0 | `src/scenario.ts` |
| 30 | Refactor | pass | 14/0 | `src/scenario.ts` |
| 31 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 32 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 33 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 34 | Green | pass | 17/0 | `src/scenario.ts` |
| 35 | Refactor | pass | 17/0 | `src/scenario.ts` |
| 36 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 37 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 38 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 39 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 40 | Green | pass | 21/0 | `src/scenario.ts` |
| 41 | Refactor | pass | 21/0 | `src/premium.ts`, `src/scenario.ts` |
| 42 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 43 | Red | fail | 22/1 | `src/claim-office.spec.ts` |
| 44 | Green | pass | 23/0 | `src/premium.ts`, `src/scenario.ts` |
| 45 | Refactor | pass | 23/0 | `src/premium.ts` |
| 46 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 47 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 48 | Green | pass | 25/0 | `src/scenario.ts` |
| 49 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 50 | Green | pass | 26/0 | `src/price-list.ts` |
| 51 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 52 | Green | pass | 27/0 | `src/claim.ts`, `src/price-list.ts`, `src/scenario.ts` |
| 53 | Refactor | pass | 27/0 | `src/price-list.ts` |
| 54 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 55 | Green | pass | 28/0 | `src/price-list.ts` |
| 56 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 57 | Green | pass | 29/0 | `src/claim.ts` |
| 58 | Refactor | pass | 29/0 | `src/claim.ts` |
| 59 | Red | fail | 29/1 | `src/claim-office.spec.ts` |
| 60 | Green | pass | 30/0 | `src/price-list.ts` |
| 61 | Red | fail | 30/1 | `src/claim-office.spec.ts` |
| 62 | Green | pass | 31/0 | `src/price-list.ts` |
| 63 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 64 | Green | pass | 32/0 | `src/price-list.ts` |
| 65 | Red | fail | 32/1 | `src/claim-office.spec.ts` |
| 66 | Green | pass | 33/0 | `src/price-list.ts` |
| 67 | Refactor | pass | 33/0 | `src/price-list.ts` |
| 68 | Red | fail | 33/1 | `src/claim-office.spec.ts` |
| 69 | Green | pass | 34/0 | `src/claim.ts` |
| 70 | Refactor | pass | 34/0 | `src/claim.ts` |
| 71 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 72 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 73 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 74 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 75 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 76 | Green | pass | 39/0 | `src/claim.ts` |
| 77 | Refactor | pass | 39/0 | `src/claim.ts` |
| 78 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 79 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 80 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 81 | Green | pass | 42/0 | `src/claim.ts` |
| 82 | Refactor | pass | 42/0 | `src/claim.ts` |
| 83 | Skip | pass | 43/0 | `src/claim-office.spec.ts` |
| 84 | Skip | pass | 44/0 | `src/claim-office.spec.ts` |
| 85 | Red | fail | 44/1 | `src/claim-office.spec.ts` |
| 86 | Verify | fail | 44/1 | — |
| 87 | Green | pass | 45/0 | `src/claim.ts`, `src/scenario.ts` |
| 88 | Refactor | pass | 45/0 | `src/claim.ts`, `src/scenario.ts` |
| 89 | Red | fail | 45/1 | `src/claim-office.spec.ts` |
| 90 | Green | pass | 46/0 | `src/claim.ts` |
| 91 | Skip | pass | 47/0 | `src/claim-office.spec.ts` |
| 92 | Skip | pass | 48/0 | `src/claim-office.spec.ts` |
| 93 | Red | fail | 48/1 | `src/claim-office.spec.ts` |
| 94 | Green | pass | 49/0 | `src/claim.ts` |
| 95 | Refactor | pass | 49/0 | `src/claim.ts`, `src/reimbursement.ts` |
| 96 | Refactor | pass | 49/0 | `src/claim.ts`, `src/scenario.ts` |
| 97 | Red | fail | 49/1 | `src/cli.spec.ts` |
| 98 | Green | pass | 50/0 | `src/cli.ts` |
| 99 | Verify | pass | 50/0 | — |
| 100 | Skip | pass | 51/0 | `src/cli.spec.ts` |
| 101 | Skip | pass | 52/0 | `src/cli.spec.ts` |
| 102 | Verify | pass | 52/0 | — |

Final suite state: **pass**.

