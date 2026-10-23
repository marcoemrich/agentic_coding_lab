# TDD phase chain — 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

**78 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Verify -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Skip -> Red -> Verify -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Red -> Both -> Verify -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Verify -> Skip -> Skip -> Skip -> Skip -> Red -> Both -> Refactor -> Skip -> Skip -> Red -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Both -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Refactor -> Red -> Green -> Skip -> Skip -> Red -> Green -> Verify
```

Deviations present: `Both` ×3 (test and implementation changed together — no verified red), `Skip` ×28 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 78 |
| `cycles_total` | 46 |
| `cycles_closed` | 16 |
| `test_first_rate` | 0.404 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 4 |
| `skip_events` | 28 |
| `refactor_per_cycle` | 0.25 |
| `green_attempts` | 0.0 |
| `deviations` | 31 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.52 |
| `tdd_discipline_test_first` | 0.404 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.348 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (16 of 46 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Red(c) -> Red -> Verify -> Green
  3. `6–7`  Red -> Green
  4. `8–9`  Red -> Green
  5. `10–11`  Red -> Green
  6. `12–13`  Red -> Green
  7. `14–15`  Red -> Green
  8. `16–17`  Red -> Green
  9. `18–18`  Skip  ← never closed
 10. `19–20`  Red -> Green
 11. `21–21`  Skip  ← never closed
 12. `22–24`  Red -> Verify -> Skip  ← never closed
 13. `25–25`  Skip  ← never closed
 14. `26–26`  Skip  ← never closed
 15. `27–28`  Red -> Green
 16. `29–30`  Red -> Green
 17. `31–31`  Skip  ← never closed
 18. `32–33`  Red -> Green
 19. `34–37`  Red -> Both -> Verify -> Skip  ← never closed
 20. `38–39`  Red -> Green
 21. `40–40`  Skip  ← never closed
 22. `41–41`  Skip  ← never closed
 23. `42–45`  Red -> Green -> Verify -> Skip
 24. `46–46`  Skip  ← never closed
 25. `47–47`  Skip  ← never closed
 26. `48–48`  Skip  ← never closed
 27. `49–51`  Red -> Both -> Refactor  ← never closed
 28. `52–52`  Skip  ← never closed
 29. `53–53`  Skip  ← never closed
 30. `54–55`  Red -> Skip  ← never closed
 31. `56–56`  Skip  ← never closed
 32. `57–57`  Skip  ← never closed
 33. `58–58`  Skip  ← never closed
 34. `59–60`  Red -> Green
 35. `61–61`  Skip  ← never closed
 36. `62–62`  Skip  ← never closed
 37. `63–63`  Skip  ← never closed
 38. `64–64`  Skip  ← never closed
 39. `65–67`  Both -> Refactor -> Refactor  ← never closed
 40. `68–68`  Skip  ← never closed
 41. `69–69`  Skip  ← never closed
 42. `70–71`  Skip -> Refactor  ← never closed
 43. `72–73`  Red -> Green
 44. `74–74`  Skip  ← never closed
 45. `75–75`  Skip  ← never closed
 46. `76–78`  Red -> Green -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 28 | test arrived and passed immediately — never red |
| `Red` | 20 | a new failing test arrived |
| `Green` | 16 | implementation changed, suite went green |
| `Verify` | 5 | nothing changed, suite re-run |
| `Refactor` | 4 | implementation changed, suite stayed green |
| `Both` | 3 | test and implementation changed together — no verified red |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/scenario.ts` |
| 4 | Verify | fail | 0/1 | — |
| 5 | Green | pass | 1/0 | `src/scenario.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green | pass | 2/0 | `src/scenario.ts` |
| 8 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 9 | Green | pass | 3/0 | `src/scenario.ts` |
| 10 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 4/0 | `src/scenario.ts` |
| 12 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 5/0 | `src/scenario.ts` |
| 14 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 6/0 | `src/scenario.ts` |
| 16 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 7/0 | `src/scenario.ts` |
| 18 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 19 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 9/0 | `src/scenario.ts` |
| 21 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 22 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 23 | Verify | fail | 10/1 | — |
| 24 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 25 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 26 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 27 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 28 | Green | pass | 14/0 | `src/scenario.ts` |
| 29 | Red | fail | 14/1 | `src/claim-office.spec.ts` |
| 30 | Green | pass | 15/0 | `src/scenario.ts` |
| 31 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 32 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 33 | Green | pass | 17/0 | `src/scenario.ts` |
| 34 | Red | fail | 17/1 | `src/claim-office.spec.ts` |
| 35 | Both | fail | 4/14 | `src/claim-office.spec.ts`, `src/scenario.ts` |
| 36 | Verify | fail | 4/14 | — |
| 37 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 38 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 39 | Green | pass | 19/0 | `src/scenario.ts` |
| 40 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 41 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 42 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 43 | Green | fail | 21/1 | `src/scenario.ts` |
| 44 | Verify | fail | 21/1 | — |
| 45 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 46 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 47 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 48 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 49 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 50 | Both | pass | 26/0 | `src/claim-office.spec.ts`, `src/scenario.ts` |
| 51 | Refactor | pass | 26/0 | `src/scenario.ts` |
| 52 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 53 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 54 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 55 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 56 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 57 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 58 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 59 | Red | fail | 32/1 | `src/claim-office.spec.ts` |
| 60 | Green | pass | 33/0 | `src/scenario.ts` |
| 61 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 63 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 65 | Both | fail | 37/1 | `src/claim-office.spec.ts`, `src/cli.ts`, `src/test-cli-helper.ts` |
| 66 | Refactor | pass | 38/0 | `src/cli.ts`, `src/scenario.ts` |
| 67 | Refactor | pass | 38/0 | `src/scenario.ts` |
| 68 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 69 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 70 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 71 | Refactor | pass | 41/0 | `src/scenario.ts` |
| 72 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 42/0 | `src/scenario.ts` |
| 74 | Skip | pass | 43/0 | `src/claim-office.spec.ts` |
| 75 | Skip | pass | 44/0 | `src/claim-office.spec.ts` |
| 76 | Red | fail | 44/1 | `src/claim-office.spec.ts` |
| 77 | Green | pass | 45/0 | `src/scenario.ts` |
| 78 | Verify | pass | 45/0 | — |

Final suite state: **pass**.

