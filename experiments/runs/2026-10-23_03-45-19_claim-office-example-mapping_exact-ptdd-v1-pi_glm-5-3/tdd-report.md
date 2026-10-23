# TDD phase chain — 2026-10-23_03-45-19_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

**80 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Both -> Refactor -> Red -> Green? -> Verify -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Both -> Drop -> Both -> Refactor -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Verify
```

Deviations present: `Both` ×3 (test and implementation changed together — no verified red), `Drop` ×1 (tests were removed), `Green?` ×1 (implementation changed, still failing), `Skip` ×30 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 80 |
| `cycles_total` | 53 |
| `cycles_closed` | 19 |
| `test_first_rate` | 0.365 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 3 |
| `skip_events` | 30 |
| `refactor_per_cycle` | 0.158 |
| `green_attempts` | 0.053 |
| `deviations` | 34 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.508 |
| `tdd_discipline_test_first` | 0.365 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.358 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (19 of 53 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–4`  Both -> Refactor  ← never closed
  4. `5–9`  Red -> Green? -> Verify -> Green -> Refactor
  5. `10–11`  Red -> Green
  6. `12–13`  Red -> Green
  7. `14–15`  Red -> Green
  8. `16–17`  Red -> Green
  9. `18–19`  Red -> Green
 10. `20–20`  Skip  ← never closed
 11. `21–22`  Red -> Green
 12. `23–24`  Red -> Green
 13. `25–25`  Skip  ← never closed
 14. `26–26`  Skip  ← never closed
 15. `27–27`  Skip  ← never closed
 16. `28–28`  Skip  ← never closed
 17. `29–29`  Skip  ← never closed
 18. `30–31`  Red -> Green
 19. `32–33`  Red -> Green
 20. `34–34`  Skip  ← never closed
 21. `35–36`  Red -> Green
 22. `37–37`  Skip  ← never closed
 23. `38–38`  Skip  ← never closed
 24. `39–40`  Red -> Green
 25. `41–41`  Skip  ← never closed
 26. `42–42`  Skip  ← never closed
 27. `43–44`  Red -> Green
 28. `45–45`  Skip  ← never closed
 29. `46–46`  Skip  ← never closed
 30. `47–48`  Red -> Green
 31. `49–49`  Skip  ← never closed
 32. `50–50`  Skip  ← never closed
 33. `51–51`  Skip  ← never closed
 34. `52–53`  Red -> Green
 35. `54–54`  Skip  ← never closed
 36. `55–55`  Skip  ← never closed
 37. `56–56`  Skip  ← never closed
 38. `57–57`  Skip  ← never closed
 39. `58–59`  Red -> Green
 40. `60–60`  Skip  ← never closed
 41. `61–61`  Skip  ← never closed
 42. `62–62`  Skip  ← never closed
 43. `63–63`  Skip  ← never closed
 44. `64–64`  Skip  ← never closed
 45. `65–66`  Both -> Drop  ← never closed
 46. `67–68`  Both -> Refactor  ← never closed
 47. `69–70`  Red -> Green
 48. `71–71`  Skip  ← never closed
 49. `72–73`  Red -> Green
 50. `74–75`  Red -> Green
 51. `76–76`  Skip  ← never closed
 52. `77–77`  Skip  ← never closed
 53. `78–80`  Skip -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 30 | test arrived and passed immediately — never red |
| `Red` | 19 | a new failing test arrived |
| `Green` | 19 | implementation changed, suite went green |
| `Both` | 3 | test and implementation changed together — no verified red |
| `Refactor` | 3 | implementation changed, suite stayed green |
| `Verify` | 3 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Green?` | 1 | implementation changed, still failing |
| `Drop` | 1 | tests were removed |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Skip | pass | 0/0 | `src/claim-office.spec.ts` |
| 3 | Both | fail | 0/1 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 4 | Refactor | pass | 1/0 | `src/claim-office.ts` |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green? | fail | 1/1 | `src/claim-office.ts` |
| 7 | Verify | fail | 1/1 | — |
| 8 | Green | pass | 2/0 | `src/claim-office.ts` |
| 9 | Refactor | pass | 2/0 | `src/claim-office.ts` |
| 10 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 3/0 | `src/claim-office.ts` |
| 12 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 4/0 | `src/claim-office.ts` |
| 14 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 5/0 | `src/claim-office.ts` |
| 16 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 6/0 | `src/claim-office.ts` |
| 18 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 7/0 | `src/claim-office.ts` |
| 20 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 21 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 22 | Green | pass | 9/0 | `src/claim-office.ts` |
| 23 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 24 | Green | pass | 10/0 | `src/claim-office.ts` |
| 25 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 26 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 27 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 28 | Skip | pass | 14/0 | `src/claim-office.spec.ts` |
| 29 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 30 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 31 | Green | pass | 16/0 | `src/claim-office.ts` |
| 32 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 33 | Green | pass | 17/0 | `src/claim-office.ts` |
| 34 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 35 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 19/0 | `src/claim-office.ts` |
| 37 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 38 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 39 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 40 | Green | pass | 22/0 | `src/claim-office.ts` |
| 41 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 42 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 43 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 44 | Green | pass | 25/0 | `src/claim-office.ts` |
| 45 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 46 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 47 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 48 | Green | pass | 28/0 | `src/claim-office.ts` |
| 49 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 50 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 51 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 52 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 53 | Green | pass | 32/0 | `src/claim-office.ts` |
| 54 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 55 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 56 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 57 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 58 | Red | fail | 36/1 | `src/claim-office.spec.ts` |
| 59 | Green | pass | 37/0 | `src/claim-office.ts` |
| 60 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 63 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 42/0 | `src/claim-office.spec.ts` |
| 65 | Both | pass | 43/0 | `src/claim-office.spec.ts`, `src/cli.ts` |
| 66 | Drop | pass | 1/0 | `src/check-spawn.spec.ts` |
| 67 | Both | fail | 42/1 | `src/check-spawn.spec.ts`, `src/cli.ts` |
| 68 | Refactor | pass | 43/0 | `src/claim-office.ts`, `src/cli.ts` |
| 69 | Red | fail | 43/1 | `src/claim-office.spec.ts` |
| 70 | Green | pass | 44/0 | `src/claim-office.ts` |
| 71 | Skip | pass | 45/0 | `src/claim-office.spec.ts` |
| 72 | Red | fail | 45/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 46/0 | `src/claim-office.ts` |
| 74 | Red | fail | 46/1 | `src/claim-office.spec.ts` |
| 75 | Green | pass | 47/0 | `src/claim-office.ts` |
| 76 | Skip | pass | 48/0 | `src/claim-office.spec.ts` |
| 77 | Skip | pass | 49/0 | `src/claim-office.spec.ts` |
| 78 | Skip | pass | 50/0 | `src/claim-office.spec.ts` |
| 79 | Verify | pass | 50/0 | — |
| 80 | Verify | pass | 50/0 | — |

Final suite state: **pass**.

