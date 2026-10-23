# TDD phase chain — 2026-10-23_03-19-14_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

**75 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red -> Green -> Red -> Green? -> Verify -> Green? -> Verify -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Break -> Verify -> Green -> Skip -> Red -> Green? -> Verify -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Verify
```

Deviations present: `Break` ×1 (implementation change broke a green suite), `Green?` ×3 (implementation changed, still failing), `Skip` ×20 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 75 |
| `cycles_total` | 40 |
| `cycles_closed` | 19 |
| `test_first_rate` | 0.487 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 6 |
| `skip_events` | 20 |
| `refactor_per_cycle` | 0.316 |
| `green_attempts` | 0.158 |
| `deviations` | 21 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.614 |
| `tdd_discipline_test_first` | 0.487 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.475 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (19 of 40 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–3`  Red -> Green
  3. `4–10`  Red -> Green? -> Verify -> Green? -> Verify -> Green -> Refactor
  4. `11–12`  Red -> Green
  5. `13–14`  Red -> Green
  6. `15–16`  Red -> Green
  7. `17–18`  Red -> Green
  8. `19–19`  Skip  ← never closed
  9. `20–21`  Red -> Green
 10. `22–22`  Skip  ← never closed
 11. `23–23`  Skip  ← never closed
 12. `24–28`  Red -> Green -> Break -> Verify -> Green
 13. `29–29`  Skip  ← never closed
 14. `30–33`  Red -> Green? -> Verify -> Green
 15. `34–36`  Red -> Green -> Refactor
 16. `37–37`  Skip  ← never closed
 17. `38–38`  Skip  ← never closed
 18. `39–40`  Red -> Green
 19. `41–43`  Red -> Green -> Refactor
 20. `44–44`  Skip  ← never closed
 21. `45–45`  Skip  ← never closed
 22. `46–47`  Red -> Green
 23. `48–48`  Skip  ← never closed
 24. `49–49`  Skip  ← never closed
 25. `50–51`  Red -> Green
 26. `52–52`  Skip  ← never closed
 27. `53–54`  Skip -> Refactor  ← never closed
 28. `55–55`  Skip  ← never closed
 29. `56–57`  Red -> Green
 30. `58–58`  Skip  ← never closed
 31. `59–59`  Skip  ← never closed
 32. `60–60`  Skip  ← never closed
 33. `61–61`  Skip  ← never closed
 34. `62–62`  Skip  ← never closed
 35. `63–63`  Skip  ← never closed
 36. `64–65`  Red -> Green
 37. `66–67`  Red -> Green
 38. `68–70`  Red -> Green -> Refactor
 39. `71–73`  Red -> Green -> Refactor
 40. `74–75`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Green` | 20 | implementation changed, suite went green |
| `Skip` | 20 | test arrived and passed immediately — never red |
| `Red` | 19 | a new failing test arrived |
| `Refactor` | 6 | implementation changed, suite stayed green |
| `Verify` | 5 | nothing changed, suite re-run |
| `Green?` | 3 | implementation changed, still failing |
| `Start` | 1 | first invocation |
| `Break` | 1 | implementation change broke a green suite |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 3 | Green | pass | 1/0 | `src/cli.ts` |
| 4 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 5 | Green? | fail | 1/1 | `src/cli.ts` |
| 6 | Verify | fail | 1/1 | — |
| 7 | Green? | fail | 1/1 | `src/cli.ts` |
| 8 | Verify | fail | 1/1 | — |
| 9 | Green | pass | 2/0 | `src/cli.ts` |
| 10 | Refactor | pass | 2/0 | `src/cli.ts`, `src/premium.ts` |
| 11 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 3/0 | `src/premium.ts` |
| 13 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 4/0 | `src/premium.ts` |
| 15 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 5/0 | `src/premium.ts` |
| 17 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 6/0 | `src/premium.ts` |
| 19 | Skip | pass | 7/0 | `src/claim-office.spec.ts` |
| 20 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 21 | Green | pass | 8/0 | `src/premium.ts` |
| 22 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 23 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 24 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 25 | Green | pass | 11/0 | `src/premium.ts` |
| 26 | Break | fail | 10/1 | `src/premium.ts` |
| 27 | Verify | fail | 10/1 | — |
| 28 | Green | pass | 11/0 | `src/premium.ts` |
| 29 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 30 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 31 | Green? | fail | 12/1 | `src/premium.ts` |
| 32 | Verify | fail | 12/1 | — |
| 33 | Green | pass | 13/0 | `src/premium.ts` |
| 34 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 35 | Green | pass | 14/0 | `src/premium.ts` |
| 36 | Refactor | pass | 14/0 | `src/premium.ts` |
| 37 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 38 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 39 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 40 | Green | pass | 17/0 | `src/cli.ts`, `src/premium.ts` |
| 41 | Red | fail | 17/1 | `src/claim-office.spec.ts` |
| 42 | Green | pass | 18/0 | `src/cli.ts`, `src/premium.ts` |
| 43 | Refactor | pass | 18/0 | `src/premium.ts` |
| 44 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 45 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 46 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 47 | Green | pass | 21/0 | `src/claims.ts`, `src/cli.ts` |
| 48 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 49 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 50 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 51 | Green | pass | 24/0 | `src/claims.ts`, `src/cli.ts` |
| 52 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 53 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 54 | Refactor | pass | 26/0 | `src/claims.ts` |
| 55 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 56 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 57 | Green | pass | 28/0 | `src/cli.ts` |
| 58 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 59 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 63 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 64 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 65 | Green | pass | 35/0 | `src/cli.ts`, `src/premium.ts` |
| 66 | Red | fail | 35/1 | `src/claim-office.spec.ts` |
| 67 | Green | pass | 36/0 | `src/claims.ts` |
| 68 | Red | fail | 36/1 | `src/claim-office.spec.ts` |
| 69 | Green | pass | 37/0 | `src/claims.ts` |
| 70 | Refactor | pass | 37/0 | `src/claims.ts` |
| 71 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 72 | Green | pass | 38/0 | `src/claims.ts` |
| 73 | Refactor | pass | 38/0 | `src/claims.ts` |
| 74 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 75 | Verify | pass | 39/0 | — |

Final suite state: **pass**.

