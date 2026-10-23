# TDD phase chain — 2026-10-23_04-13-04_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

**72 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red -> Green? -> Verify -> Green -> Red -> Green -> Red -> Verify -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green? -> Verify -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Both -> Verify -> Refactor -> Refactor -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Verify
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Green?` ×2 (implementation changed, still failing), `Skip` ×22 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 72 |
| `cycles_total` | 43 |
| `cycles_closed` | 19 |
| `test_first_rate` | 0.452 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 3 |
| `skip_events` | 22 |
| `refactor_per_cycle` | 0.158 |
| `green_attempts` | 0.105 |
| `deviations` | 23 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.585 |
| `tdd_discipline_test_first` | 0.452 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.442 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (19 of 43 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Red -> Green? -> Verify -> Green
  3. `6–7`  Red -> Green
  4. `8–10`  Red -> Verify -> Green
  5. `11–12`  Red -> Green
  6. `13–14`  Red -> Green
  7. `15–16`  Red -> Green
  8. `17–18`  Red -> Green
  9. `19–19`  Skip  ← never closed
 10. `20–21`  Red -> Green
 11. `22–22`  Skip  ← never closed
 12. `23–23`  Skip  ← never closed
 13. `24–24`  Skip  ← never closed
 14. `25–25`  Skip  ← never closed
 15. `26–26`  Skip  ← never closed
 16. `27–30`  Red -> Green? -> Verify -> Green
 17. `31–32`  Red -> Green
 18. `33–33`  Skip  ← never closed
 19. `34–34`  Skip  ← never closed
 20. `35–35`  Skip  ← never closed
 21. `36–36`  Skip  ← never closed
 22. `37–38`  Red -> Green
 23. `39–39`  Skip  ← never closed
 24. `40–41`  Red -> Green
 25. `42–42`  Skip  ← never closed
 26. `43–44`  Red -> Green
 27. `45–46`  Red -> Green
 28. `47–48`  Red -> Green
 29. `49–49`  Skip  ← never closed
 30. `50–50`  Skip  ← never closed
 31. `51–51`  Skip  ← never closed
 32. `52–54`  Red -> Green -> Refactor
 33. `55–55`  Skip  ← never closed
 34. `56–56`  Skip  ← never closed
 35. `57–57`  Skip  ← never closed
 36. `58–58`  Skip  ← never closed
 37. `59–59`  Skip  ← never closed
 38. `60–60`  Skip  ← never closed
 39. `61–64`  Both -> Verify -> Refactor -> Refactor  ← never closed
 40. `65–66`  Red -> Green
 41. `67–68`  Red -> Green
 42. `69–69`  Skip  ← never closed
 43. `70–72`  Red -> Green -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 22 | test arrived and passed immediately — never red |
| `Red` | 19 | a new failing test arrived |
| `Green` | 19 | implementation changed, suite went green |
| `Verify` | 5 | nothing changed, suite re-run |
| `Refactor` | 3 | implementation changed, suite stayed green |
| `Green?` | 2 | implementation changed, still failing |
| `Start` | 1 | first invocation |
| `Both` | 1 | test and implementation changed together — no verified red |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 3 | Green? | fail | 0/1 | `src/scenario.ts` |
| 4 | Verify | fail | 0/1 | — |
| 5 | Green | pass | 1/0 | `src/premium.ts`, `src/scenario.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green | pass | 2/0 | `src/premium.ts`, `src/scenario.ts` |
| 8 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 9 | Verify | fail | 2/1 | — |
| 10 | Green | pass | 3/0 | `src/premium.ts` |
| 11 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 4/0 | `src/premium.ts` |
| 13 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 5/0 | `src/premium.ts` |
| 15 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 6/0 | `src/premium.ts` |
| 17 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 7/0 | `src/premium.ts` |
| 19 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 20 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 21 | Green | pass | 9/0 | `src/premium.ts` |
| 22 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 23 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 24 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 25 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 26 | Skip | pass | 14/0 | `src/claim-office.spec.ts` |
| 27 | Red | fail | 14/1 | `src/claim-office.spec.ts` |
| 28 | Green? | fail | 14/1 | `src/premium.ts` |
| 29 | Verify | fail | 14/1 | — |
| 30 | Green | pass | 15/0 | `src/premium.ts` |
| 31 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 32 | Green | pass | 16/0 | `src/premium.ts` |
| 33 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 34 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 35 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 36 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 37 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 38 | Green | pass | 21/0 | `src/premium.ts`, `src/scenario.ts` |
| 39 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 40 | Red | fail | 22/1 | `src/claim-office.spec.ts` |
| 41 | Green | pass | 23/0 | `src/premium.ts`, `src/scenario.ts` |
| 42 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 43 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 44 | Green | pass | 25/0 | `src/claim.ts`, `src/scenario.ts` |
| 45 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 46 | Green | pass | 26/0 | `src/claim.ts` |
| 47 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 48 | Green | pass | 27/0 | `src/claim.ts` |
| 49 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 50 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 51 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 52 | Red | fail | 30/1 | `src/claim-office.spec.ts` |
| 53 | Green | pass | 31/0 | `src/claim.ts` |
| 54 | Refactor | pass | 31/0 | `src/claim.ts`, `src/itemCatalog.ts`, `src/premium.ts` |
| 55 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 56 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 57 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 58 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 59 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 61 | Both | pass | 38/0 | `src/claim-office.spec.ts`, `src/cli.ts` |
| 62 | Verify | pass | 38/0 | — |
| 63 | Refactor | pass | 38/0 | `src/itemCatalog.ts`, `src/scenario.ts` |
| 64 | Refactor | pass | 38/0 | `src/scenario.ts` |
| 65 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 66 | Green | pass | 39/0 | `src/claim.ts` |
| 67 | Red | fail | 39/1 | `src/claim-office.spec.ts` |
| 68 | Green | pass | 40/0 | `src/claim.ts` |
| 69 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 70 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 71 | Green | pass | 42/0 | `src/claim.ts` |
| 72 | Verify | pass | 42/0 | — |

Final suite state: **pass**.

