# TDD phase chain — 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

**78 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Refactor -> Refactor -> Red -> Verify -> Green? -> Verify -> Green -> Refactor -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green? -> Verify -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Verify -> Refactor -> Skip -> Skip -> Refactor
```

Deviations present: `Green?` ×2 (implementation changed, still failing), `Skip` ×24 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 78 |
| `cycles_total` | 41 |
| `cycles_closed` | 16 |
| `test_first_rate` | 0.415 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 14 |
| `skip_events` | 24 |
| `refactor_per_cycle` | 0.875 |
| `green_attempts` | 0.125 |
| `deviations` | 24 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.545 |
| `tdd_discipline_test_first` | 0.415 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.39 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (16 of 41 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–6`  Red(c) -> Red -> Green -> Refactor -> Refactor
  3. `7–13`  Red -> Verify -> Green? -> Verify -> Green -> Refactor -> Refactor
  4. `14–15`  Red -> Green
  5. `16–17`  Red -> Green
  6. `18–19`  Red -> Green
  7. `20–21`  Red -> Green
  8. `22–24`  Red -> Green -> Refactor
  9. `25–25`  Skip  ← never closed
 10. `26–28`  Red -> Green -> Refactor
 11. `29–29`  Skip  ← never closed
 12. `30–30`  Skip  ← never closed
 13. `31–31`  Skip  ← never closed
 14. `32–32`  Skip  ← never closed
 15. `33–35`  Red -> Green -> Refactor
 16. `36–38`  Red -> Green -> Refactor
 17. `39–39`  Skip  ← never closed
 18. `40–40`  Skip  ← never closed
 19. `41–41`  Skip  ← never closed
 20. `42–46`  Red -> Green? -> Verify -> Green -> Refactor
 21. `47–47`  Skip  ← never closed
 22. `48–50`  Red -> Green -> Refactor
 23. `51–51`  Skip  ← never closed
 24. `52–54`  Red -> Green -> Refactor
 25. `55–55`  Skip  ← never closed
 26. `56–57`  Red -> Green
 27. `58–58`  Skip  ← never closed
 28. `59–59`  Skip  ← never closed
 29. `60–60`  Skip  ← never closed
 30. `61–61`  Skip  ← never closed
 31. `62–62`  Skip  ← never closed
 32. `63–63`  Skip  ← never closed
 33. `64–64`  Skip  ← never closed
 34. `65–65`  Skip  ← never closed
 35. `66–66`  Skip  ← never closed
 36. `67–67`  Skip  ← never closed
 37. `68–70`  Red -> Green -> Refactor
 38. `71–71`  Skip  ← never closed
 39. `72–75`  Red -> Green -> Verify -> Refactor
 40. `76–76`  Skip  ← never closed
 41. `77–78`  Skip -> Refactor  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 24 | test arrived and passed immediately — never red |
| `Red` | 16 | a new failing test arrived |
| `Green` | 16 | implementation changed, suite went green |
| `Refactor` | 14 | implementation changed, suite stayed green |
| `Verify` | 4 | nothing changed, suite re-run |
| `Green?` | 2 | implementation changed, still failing |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/scenario.ts` |
| 4 | Green | pass | 1/0 | `src/scenario.ts` |
| 5 | Refactor | pass | 1/0 | `src/scenario.ts` |
| 6 | Refactor | pass | 1/0 | `src/scenario.ts` |
| 7 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 8 | Verify | fail | 1/1 | — |
| 9 | Green? | fail | 1/1 | `src/scenario.ts` |
| 10 | Verify | fail | 1/1 | — |
| 11 | Green | pass | 2/0 | `src/scenario.ts` |
| 12 | Refactor | pass | 2/0 | `src/scenario.ts` |
| 13 | Refactor | pass | 2/0 | `src/scenario.ts` |
| 14 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 3/0 | `src/scenario.ts` |
| 16 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 4/0 | `src/scenario.ts` |
| 18 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 5/0 | `src/scenario.ts` |
| 20 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 21 | Green | pass | 6/0 | `src/scenario.ts` |
| 22 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 23 | Green | pass | 7/0 | `src/scenario.ts` |
| 24 | Refactor | pass | 7/0 | `src/scenario.ts` |
| 25 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 26 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 27 | Green | pass | 9/0 | `src/scenario.ts` |
| 28 | Refactor | pass | 9/0 | `src/scenario.ts` |
| 29 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 30 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 31 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 32 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 33 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 34 | Green | pass | 14/0 | `src/scenario.ts` |
| 35 | Refactor | pass | 14/0 | `src/scenario.ts` |
| 36 | Red | fail | 14/1 | `src/claim-office.spec.ts` |
| 37 | Green | pass | 15/0 | `src/scenario.ts` |
| 38 | Refactor | pass | 15/0 | `src/scenario.ts` |
| 39 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 40 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 41 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 42 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 43 | Green? | fail | 18/1 | `src/scenario.ts` |
| 44 | Verify | fail | 18/1 | — |
| 45 | Green | pass | 19/0 | `src/scenario.ts` |
| 46 | Refactor | pass | 19/0 | `src/scenario.ts` |
| 47 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 48 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 49 | Green | pass | 21/0 | `src/scenario.ts` |
| 50 | Refactor | pass | 21/0 | `src/scenario.ts` |
| 51 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 52 | Red | fail | 22/1 | `src/claim-office.spec.ts` |
| 53 | Green | pass | 23/0 | `src/scenario.ts` |
| 54 | Refactor | pass | 23/0 | `src/scenario.ts` |
| 55 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 56 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 57 | Green | pass | 25/0 | `src/scenario.ts` |
| 58 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 59 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 63 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 65 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 66 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 67 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 68 | Red | fail | 35/1 | `src/claim-office.spec.ts` |
| 69 | Green | pass | 36/0 | `src/scenario.ts` |
| 70 | Refactor | pass | 36/0 | `src/scenario.ts` |
| 71 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 72 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 38/0 | `src/cli.ts` |
| 74 | Verify | pass | 38/0 | — |
| 75 | Refactor | pass | 38/0 | `src/cli.ts` |
| 76 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 77 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 78 | Refactor | pass | 40/0 | `src/cli.ts`, `src/scenario.ts` |

Final suite state: **pass**.

