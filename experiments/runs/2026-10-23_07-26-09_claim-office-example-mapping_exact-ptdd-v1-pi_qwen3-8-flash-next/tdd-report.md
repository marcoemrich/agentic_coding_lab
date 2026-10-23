# TDD phase chain — 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next

**89 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Red -> Green -> Refactor -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Red(c) -> Verify -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Verify -> Skip -> Red -> Green -> Verify -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Verify -> Skip -> Skip -> Verify -> Skip -> Red -> Green -> Verify -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Verify -> Skip -> Verify
```

Deviations present: `Skip` ×25 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 89 |
| `cycles_total` | 43 |
| `cycles_closed` | 17 |
| `test_first_rate` | 0.432 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 2 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 13 |
| `skip_events` | 25 |
| `refactor_per_cycle` | 0.765 |
| `green_attempts` | 0.0 |
| `deviations` | 25 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.555 |
| `tdd_discipline_test_first` | 0.432 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.395 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (17 of 43 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Red(c) -> Red -> Green -> Refactor
  3. `6–9`  Red -> Green -> Refactor -> Refactor
  4. `10–12`  Red -> Green -> Verify
  5. `13–14`  Red -> Green
  6. `15–18`  Red -> Green -> Refactor -> Verify
  7. `19–21`  Red -> Green -> Refactor
  8. `22–23`  Skip -> Verify  ← never closed
  9. `24–24`  Skip  ← never closed
 10. `25–32`  Red(c) -> Verify -> Verify -> Verify -> Red -> Green -> Refactor -> Refactor
 11. `33–33`  Skip  ← never closed
 12. `34–34`  Skip  ← never closed
 13. `35–35`  Skip  ← never closed
 14. `36–36`  Skip  ← never closed
 15. `37–39`  Red -> Green -> Verify
 16. `40–40`  Skip  ← never closed
 17. `41–44`  Red -> Green -> Verify -> Refactor
 18. `45–45`  Skip  ← never closed
 19. `46–46`  Skip  ← never closed
 20. `47–47`  Skip  ← never closed
 21. `48–49`  Red -> Green
 22. `50–50`  Skip  ← never closed
 23. `51–51`  Skip  ← never closed
 24. `52–52`  Skip  ← never closed
 25. `53–56`  Red -> Green -> Refactor -> Refactor
 26. `57–57`  Skip  ← never closed
 27. `58–58`  Skip  ← never closed
 28. `59–62`  Red -> Green -> Refactor -> Verify
 29. `63–63`  Skip  ← never closed
 30. `64–65`  Skip -> Verify  ← never closed
 31. `66–66`  Skip  ← never closed
 32. `67–69`  Red -> Green -> Verify
 33. `70–70`  Skip  ← never closed
 34. `71–71`  Skip  ← never closed
 35. `72–72`  Skip  ← never closed
 36. `73–73`  Skip  ← never closed
 37. `74–76`  Red -> Green -> Refactor
 38. `77–77`  Skip  ← never closed
 39. `78–79`  Red -> Green
 40. `80–82`  Red -> Green -> Refactor
 41. `83–83`  Skip  ← never closed
 42. `84–87`  Red -> Green -> Verify -> Verify
 43. `88–89`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 25 | test arrived and passed immediately — never red |
| `Red` | 17 | a new failing test arrived |
| `Green` | 17 | implementation changed, suite went green |
| `Verify` | 14 | nothing changed, suite re-run |
| `Refactor` | 13 | implementation changed, suite stayed green |
| `Red(c)` | 2 | test arrived, suite does not compile yet |
| `Start` | 1 | first invocation |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/scenario.ts` |
| 4 | Green | pass | 1/0 | `src/scenario.ts` |
| 5 | Refactor | pass | 1/0 | `src/premium.ts`, `src/scenario.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green | pass | 2/0 | `src/premium.ts` |
| 8 | Refactor | pass | 2/0 | `src/catalog.ts` |
| 9 | Refactor | pass | 2/0 | `src/premium.ts` |
| 10 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 3/0 | `src/catalog.ts` |
| 12 | Verify | pass | 3/0 | — |
| 13 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 4/0 | `src/catalog.ts` |
| 15 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 5/0 | `src/catalog.ts` |
| 17 | Refactor | pass | 5/0 | `src/catalog.ts` |
| 18 | Verify | pass | 5/0 | — |
| 19 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 6/0 | `src/catalog.ts`, `src/premium.ts` |
| 21 | Refactor | pass | 6/0 | `src/catalog.ts`, `src/premium.ts` |
| 22 | Skip | pass | 7/0 | `src/claim-office.spec.ts` |
| 23 | Verify | pass | 7/0 | — |
| 24 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 25 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 26 | Verify | fail (1 collect err) | 0/0 | — |
| 27 | Verify | fail (1 collect err) | 0/0 | — |
| 28 | Verify | fail (1 collect err) | 0/0 | — |
| 29 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 30 | Green | pass | 9/0 | `src/catalog.ts`, `src/premium.ts` |
| 31 | Refactor | pass | 9/0 | `src/premium.ts` |
| 32 | Refactor | pass | 9/0 | `src/catalog.ts`, `src/premium.ts` |
| 33 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 34 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 35 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 36 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 37 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 38 | Green | pass | 14/0 | `src/premium.ts` |
| 39 | Verify | pass | 14/0 | — |
| 40 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 41 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 42 | Green | pass | 16/0 | `src/premium.ts` |
| 43 | Verify | pass | 16/0 | — |
| 44 | Refactor | pass | 16/0 | `src/premium.ts` |
| 45 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 46 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 47 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 48 | Red | fail | 19/1 | `src/claim-office.spec.ts` |
| 49 | Green | pass | 20/0 | `src/premium.ts`, `src/scenario.ts` |
| 50 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 51 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 52 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 53 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 54 | Green | pass | 24/0 | `src/catalog.ts`, `src/claim.ts`, `src/scenario.ts` |
| 55 | Refactor | pass | 24/0 | `src/claim.ts`, `src/scenario.ts` |
| 56 | Refactor | pass | 24/0 | `src/scenario.ts` |
| 57 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 58 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 59 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 60 | Green | pass | 27/0 | `src/claim.ts` |
| 61 | Refactor | pass | 27/0 | `src/claim.ts` |
| 62 | Verify | pass | 27/0 | — |
| 63 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 65 | Verify | pass | 29/0 | — |
| 66 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 67 | Red | fail | 30/1 | `src/claim-office.spec.ts` |
| 68 | Green | pass | 31/0 | `src/claim.ts` |
| 69 | Verify | pass | 31/0 | — |
| 70 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 71 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 72 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 73 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 74 | Red | fail | 35/1 | `src/claim-office.spec.ts` |
| 75 | Green | pass | 36/0 | `src/claim.ts` |
| 76 | Refactor | pass | 36/0 | `src/claim.ts` |
| 77 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 78 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 79 | Green | pass | 38/0 | `src/claim.ts` |
| 80 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 81 | Green | pass | 39/0 | `src/claim.ts` |
| 82 | Refactor | pass | 39/0 | `src/claim.ts` |
| 83 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 84 | Red | fail | 40/1 | `src/claim-office.spec.ts` |
| 85 | Green | pass | 41/0 | `src/cli.ts` |
| 86 | Verify | pass | 41/0 | — |
| 87 | Verify | pass | 41/0 | — |
| 88 | Skip | pass | 42/0 | `src/claim-office.spec.ts` |
| 89 | Verify | pass | 42/0 | — |

Final suite state: **pass**.

