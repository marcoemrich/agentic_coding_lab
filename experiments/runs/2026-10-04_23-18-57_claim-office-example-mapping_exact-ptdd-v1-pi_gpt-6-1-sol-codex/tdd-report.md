# TDD phase chain — 2026-10-04_23-18-57_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-1-sol-codex

**124 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red -> Green -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Skip -> Refactor -> Skip -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Skip -> Refactor
```

Deviations present: `Skip` ×25 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 124 |
| `cycles_total` | 50 |
| `cycles_closed` | 24 |
| `test_first_rate` | 0.49 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 24.5 |
| `refactor_events` | 22 |
| `skip_events` | 25 |
| `refactor_per_cycle` | 0.917 |
| `green_attempts` | 0.0 |
| `deviations` | 25 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.617 |
| `tdd_discipline_test_first` | 0.49 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.48 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (24 of 50 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red -> Green -> Refactor
  3. `5–8`  Skip -> Verify -> Refactor -> Refactor  ← never closed
  4. `9–11`  Red -> Green -> Verify
  5. `12–14`  Red -> Green -> Verify
  6. `15–17`  Red -> Green -> Verify
  7. `18–20`  Red -> Green -> Verify
  8. `21–23`  Red -> Green -> Refactor
  9. `24–25`  Skip -> Verify  ← never closed
 10. `26–28`  Red -> Green -> Refactor
 11. `29–30`  Skip -> Verify  ← never closed
 12. `31–32`  Skip -> Verify  ← never closed
 13. `33–34`  Skip -> Verify  ← never closed
 14. `35–36`  Skip -> Verify  ← never closed
 15. `37–39`  Red -> Green -> Refactor
 16. `40–41`  Skip -> Verify  ← never closed
 17. `42–44`  Red -> Green -> Refactor
 18. `45–46`  Skip -> Verify  ← never closed
 19. `47–49`  Red -> Green -> Refactor
 20. `50–51`  Skip -> Verify  ← never closed
 21. `52–53`  Skip -> Verify  ← never closed
 22. `54–55`  Skip -> Verify  ← never closed
 23. `56–58`  Red -> Green -> Refactor
 24. `59–60`  Skip -> Verify  ← never closed
 25. `61–63`  Red -> Green -> Refactor
 26. `64–66`  Red -> Green -> Refactor
 27. `67–69`  Red -> Green -> Refactor
 28. `70–72`  Red -> Green -> Verify
 29. `73–75`  Red -> Green -> Verify
 30. `76–78`  Red -> Green -> Refactor
 31. `79–81`  Red -> Green -> Refactor
 32. `82–83`  Skip -> Refactor  ← never closed
 33. `84–85`  Skip -> Verify  ← never closed
 34. `86–87`  Skip -> Verify  ← never closed
 35. `88–89`  Skip -> Refactor  ← never closed
 36. `90–91`  Skip -> Verify  ← never closed
 37. `92–93`  Skip -> Verify  ← never closed
 38. `94–95`  Skip -> Verify  ← never closed
 39. `96–98`  Red -> Green -> Refactor
 40. `99–101`  Red -> Green -> Verify
 41. `102–103`  Skip -> Verify  ← never closed
 42. `104–106`  Red -> Green -> Verify
 43. `107–109`  Red -> Green -> Refactor
 44. `110–111`  Skip -> Refactor  ← never closed
 45. `112–113`  Skip -> Verify  ← never closed
 46. `114–116`  Red -> Green -> Refactor
 47. `117–119`  Red -> Green -> Refactor
 48. `120–121`  Skip -> Verify  ← never closed
 49. `122–122`  Skip  ← never closed
 50. `123–124`  Skip -> Refactor  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 28 | nothing changed, suite re-run |
| `Skip` | 25 | test arrived and passed immediately — never red |
| `Red` | 24 | a new failing test arrived |
| `Green` | 24 | implementation changed, suite went green |
| `Refactor` | 22 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 3 | Green | pass | 1/0 | `src/cli.ts` |
| 4 | Refactor | pass | 1/0 | `src/cli.ts`, `src/premium.ts` |
| 5 | Skip | pass | 0/0 | `src/claim-office.spec.ts` |
| 6 | Verify | fail | 0/1 | — |
| 7 | Refactor | pass | 2/0 | `src/cli.ts`, `src/premium.ts` |
| 8 | Refactor | pass | 2/0 | `src/premium.ts` |
| 9 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 10 | Green | pass | 3/0 | `src/premium.ts` |
| 11 | Verify | pass | 3/0 | — |
| 12 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 4/0 | `src/premium.ts` |
| 14 | Verify | pass | 4/0 | — |
| 15 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 5/0 | `src/premium.ts` |
| 17 | Verify | pass | 5/0 | — |
| 18 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 6/0 | `src/premium.ts` |
| 20 | Verify | pass | 6/0 | — |
| 21 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 22 | Green | pass | 7/0 | `src/premium.ts` |
| 23 | Refactor | pass | 7/0 | `src/premium.ts` |
| 24 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 25 | Verify | pass | 8/0 | — |
| 26 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 27 | Green | pass | 9/0 | `src/premium.ts` |
| 28 | Refactor | pass | 9/0 | `src/premium.ts` |
| 29 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 30 | Verify | pass | 10/0 | — |
| 31 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 32 | Verify | pass | 11/0 | — |
| 33 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 34 | Verify | pass | 12/0 | — |
| 35 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 36 | Verify | pass | 13/0 | — |
| 37 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 38 | Green | pass | 14/0 | `src/premium.ts` |
| 39 | Refactor | pass | 14/0 | `src/premium.ts` |
| 40 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 41 | Verify | pass | 15/0 | — |
| 42 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 43 | Green | pass | 16/0 | `src/cli.ts`, `src/premium.ts` |
| 44 | Refactor | pass | 16/0 | `src/premium.ts` |
| 45 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 46 | Verify | pass | 17/0 | — |
| 47 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 48 | Green | pass | 18/0 | `src/premium.ts` |
| 49 | Refactor | pass | 18/0 | `src/premium.ts` |
| 50 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 51 | Verify | pass | 19/0 | — |
| 52 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 53 | Verify | pass | 20/0 | — |
| 54 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 55 | Verify | pass | 21/0 | — |
| 56 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 57 | Green | pass | 22/0 | `src/cli.ts`, `src/premium.ts` |
| 58 | Refactor | pass | 22/0 | `src/cli.ts`, `src/scenario.ts` |
| 59 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 60 | Verify | pass | 23/0 | — |
| 61 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 62 | Green | pass | 24/0 | `src/claim.ts`, `src/scenario.ts` |
| 63 | Refactor | pass | 24/0 | `src/claim.ts`, `src/policy.ts`, `src/scenario.ts` |
| 64 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 65 | Green | pass | 25/0 | `src/policy.ts` |
| 66 | Refactor | pass | 25/0 | `src/policy.ts` |
| 67 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 68 | Green | pass | 26/0 | `src/policy.ts` |
| 69 | Refactor | pass | 26/0 | `src/policy.ts` |
| 70 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 71 | Green | pass | 27/0 | `src/policy.ts` |
| 72 | Verify | pass | 27/0 | — |
| 73 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 74 | Green | pass | 28/0 | `src/policy.ts` |
| 75 | Verify | pass | 28/0 | — |
| 76 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 77 | Green | pass | 29/0 | `src/policy.ts` |
| 78 | Refactor | pass | 29/0 | `src/item.ts`, `src/policy.ts`, `src/premium.ts`, `src/scenario.ts` |
| 79 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 80 | Green | pass | 30/0 | `src/claim.ts` |
| 81 | Refactor | pass | 30/0 | `src/claim.ts`, `src/reimbursement.ts` |
| 82 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 83 | Refactor | pass | 31/0 | `src/claim.ts` |
| 84 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 85 | Verify | pass | 32/0 | — |
| 86 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 87 | Verify | pass | 33/0 | — |
| 88 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 89 | Refactor | pass | 34/0 | `src/claim.ts` |
| 90 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 91 | Verify | pass | 35/0 | — |
| 92 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 93 | Verify | pass | 36/0 | — |
| 94 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 95 | Verify | pass | 37/0 | — |
| 96 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 97 | Green | pass | 38/0 | `src/claim.ts` |
| 98 | Refactor | pass | 38/0 | `src/claim.ts`, `src/policy.ts` |
| 99 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 100 | Green | pass | 39/0 | `src/claim.ts` |
| 101 | Verify | pass | 39/0 | — |
| 102 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 103 | Verify | pass | 40/0 | — |
| 104 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 105 | Green | pass | 41/0 | `src/claim.ts` |
| 106 | Verify | pass | 41/0 | — |
| 107 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 108 | Green | pass | 42/0 | `src/premium.ts` |
| 109 | Refactor | pass | 42/0 | `src/cli.ts` |
| 110 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 111 | Refactor | pass | 43/0 | `src/claim.ts` |
| 112 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 113 | Verify | pass | 44/0 | — |
| 114 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 115 | Green | pass | 45/0 | `src/claim.ts` |
| 116 | Refactor | pass | 45/0 | `src/claim.ts`, `src/coverage.ts`, `src/scenario.ts` |
| 117 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 118 | Green | pass | 46/0 | `src/coverage.ts` |
| 119 | Refactor | pass | 46/0 | `src/claim.ts`, `src/coverage.ts`, `src/damage.ts`, `src/scenario.ts` |
| 120 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 121 | Verify | pass | 47/0 | — |
| 122 | Skip | pass | 47/0 | `src/claim-office.spec.ts` |
| 123 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 124 | Refactor | pass | 48/0 | `src/premium.ts` |

Final suite state: **pass**.

