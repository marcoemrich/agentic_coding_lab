# TDD phase chain — 2026-10-23_03-36-43_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

**79 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Verify -> Both -> Verify -> Break -> Green? -> Green -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Red -> Verify -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Skip -> Red -> Green -> Red -> Verify -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Red -> Skip -> Red -> Skip -> Verify -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Refactor -> Red -> Green -> Refactor -> Refactor -> Skip -> Red -> Green -> Red -> Green -> Verify -> Refactor
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Break` ×1 (implementation change broke a green suite), `Green?` ×1 (implementation changed, still failing), `Skip` ×25 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 79 |
| `cycles_total` | 43 |
| `cycles_closed` | 17 |
| `test_first_rate` | 0.409 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 8 |
| `skip_events` | 25 |
| `refactor_per_cycle` | 0.471 |
| `green_attempts` | 0.059 |
| `deviations` | 27 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.545 |
| `tdd_discipline_test_first` | 0.409 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.395 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (17 of 43 closed with a Green)

  1. `1–2`  Start -> Verify  ← never closed
  2. `3–8`  Both -> Verify -> Break -> Green? -> Green -> Verify
  3. `9–11`  Red -> Green -> Refactor
  4. `12–13`  Red -> Green
  5. `14–16`  Red -> Verify -> Green
  6. `17–18`  Red -> Green
  7. `19–20`  Red -> Green
  8. `21–22`  Red -> Green
  9. `23–24`  Red -> Green
 10. `25–25`  Skip  ← never closed
 11. `26–26`  Skip  ← never closed
 12. `27–27`  Skip  ← never closed
 13. `28–28`  Skip  ← never closed
 14. `29–30`  Red -> Green
 15. `31–32`  Red -> Green
 16. `33–33`  Skip  ← never closed
 17. `34–34`  Skip  ← never closed
 18. `35–36`  Red -> Green
 19. `37–39`  Red -> Verify -> Green
 20. `40–40`  Skip  ← never closed
 21. `41–41`  Skip  ← never closed
 22. `42–45`  Red -> Green -> Refactor -> Refactor
 23. `46–46`  Skip  ← never closed
 24. `47–47`  Skip  ← never closed
 25. `48–49`  Red -> Skip  ← never closed
 26. `50–53`  Red -> Skip -> Verify -> Refactor  ← never closed
 27. `54–54`  Skip  ← never closed
 28. `55–55`  Skip  ← never closed
 29. `56–56`  Skip  ← never closed
 30. `57–58`  Red -> Green
 31. `59–59`  Skip  ← never closed
 32. `60–60`  Skip  ← never closed
 33. `61–61`  Skip  ← never closed
 34. `62–62`  Skip  ← never closed
 35. `63–63`  Skip  ← never closed
 36. `64–64`  Skip  ← never closed
 37. `65–65`  Skip  ← never closed
 38. `66–66`  Skip  ← never closed
 39. `67–68`  Skip -> Refactor  ← never closed
 40. `69–72`  Red -> Green -> Refactor -> Refactor
 41. `73–73`  Skip  ← never closed
 42. `74–75`  Red -> Green
 43. `76–79`  Red -> Green -> Verify -> Refactor

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 25 | test arrived and passed immediately — never red |
| `Red` | 18 | a new failing test arrived |
| `Green` | 17 | implementation changed, suite went green |
| `Refactor` | 8 | implementation changed, suite stayed green |
| `Verify` | 7 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Both` | 1 | test and implementation changed together — no verified red |
| `Break` | 1 | implementation change broke a green suite |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Verify | pass | 0/0 | — |
| 3 | Both | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts`, `src/cli-exit.ts`, `src/test-helpers.ts` |
| 4 | Verify | fail (1 collect err) | 0/0 | — |
| 5 | Break | fail | 0/1 | `src/cli-exit.ts`, `src/test-helpers.ts` |
| 6 | Green? | fail | 0/1 | `src/cli.ts` |
| 7 | Green | pass | 1/0 | `src/cli.ts` |
| 8 | Verify | pass | 1/0 | — |
| 9 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 10 | Green | pass | 2/0 | `src/cli.ts`, `src/premium.ts` |
| 11 | Refactor | pass | 2/0 | `src/cli.ts`, `src/premium.ts` |
| 12 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 3/0 | `src/premium.ts` |
| 14 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 15 | Verify | fail | 3/1 | — |
| 16 | Green | pass | 4/0 | `src/premium.ts` |
| 17 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 5/0 | `src/premium.ts` |
| 19 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 6/0 | `src/premium.ts` |
| 21 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 22 | Green | pass | 7/0 | `src/premium.ts` |
| 23 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 24 | Green | pass | 8/0 | `src/premium.ts` |
| 25 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 26 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 27 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 28 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 29 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 30 | Green | pass | 13/0 | `src/premium.ts` |
| 31 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 32 | Green | pass | 14/0 | `src/premium.ts` |
| 33 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 34 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 35 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 17/0 | `src/cli.ts`, `src/premium.ts` |
| 37 | Red | fail | 17/1 | `src/claim-office.spec.ts` |
| 38 | Verify | fail | 17/1 | — |
| 39 | Green | pass | 18/0 | `src/cli.ts`, `src/premium.ts` |
| 40 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 41 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 42 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 43 | Green | pass | 21/0 | `src/claim.ts`, `src/cli.ts`, `src/premium.ts` |
| 44 | Refactor | pass | 21/0 | `src/claim.ts`, `src/cli.ts` |
| 45 | Refactor | pass | 21/0 | `src/claim.ts` |
| 46 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 47 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 48 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 49 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 50 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 51 | Skip | fail | 24/1 | `src/claim-office.spec.ts` |
| 52 | Verify | fail | 24/1 | — |
| 53 | Refactor | pass | 25/0 | `src/claim.ts` |
| 54 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 55 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 56 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 57 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 58 | Green | pass | 29/0 | `src/claim.ts` |
| 59 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 63 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 65 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 66 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 67 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 68 | Refactor | pass | 38/0 | `src/cli.ts`, `src/premium.ts` |
| 69 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 70 | Green | pass | 39/0 | `src/claim-validation.ts`, `src/cli.ts` |
| 71 | Refactor | pass | 39/0 | `src/cli.ts` |
| 72 | Refactor | pass | 39/0 | `src/cli.ts` |
| 73 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 74 | Red | fail | 40/1 | `src/claim-office.spec.ts` |
| 75 | Green | pass | 41/0 | `src/cli.ts` |
| 76 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 77 | Green | pass | 42/0 | `src/cli.ts` |
| 78 | Verify | pass | 42/0 | — |
| 79 | Refactor | pass | 42/0 | `src/claim-validation.ts`, `src/claim.ts`, `src/cli.ts` |

Final suite state: **pass**.

