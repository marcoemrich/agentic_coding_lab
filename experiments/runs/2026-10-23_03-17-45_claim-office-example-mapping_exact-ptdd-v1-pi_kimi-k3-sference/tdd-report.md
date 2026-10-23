# TDD phase chain — 2026-10-23_03-17-45_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

**77 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red -> Green -> Verify -> Red -> Green? -> Verify -> Green -> Refactor -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green? -> Verify -> Green -> Skip -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Red -> Verify -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Red -> Green -> Skip -> Verify
```

Deviations present: `Green?` ×2 (implementation changed, still failing), `Skip` ×21 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 77 |
| `cycles_total` | 40 |
| `cycles_closed` | 18 |
| `test_first_rate` | 0.475 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 6 |
| `skip_events` | 21 |
| `refactor_per_cycle` | 0.333 |
| `green_attempts` | 0.111 |
| `deviations` | 21 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.598 |
| `tdd_discipline_test_first` | 0.475 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.45 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (18 of 40 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red -> Green -> Verify
  3. `5–9`  Red -> Green? -> Verify -> Green -> Refactor
  4. `10–11`  Red -> Green
  5. `12–12`  Skip  ← never closed
  6. `13–13`  Skip  ← never closed
  7. `14–15`  Red -> Green
  8. `16–16`  Skip  ← never closed
  9. `17–18`  Red -> Green
 10. `19–20`  Red -> Green
 11. `21–22`  Red -> Green
 12. `23–24`  Red -> Green
 13. `25–28`  Red -> Green? -> Verify -> Green
 14. `29–29`  Skip  ← never closed
 15. `30–31`  Red -> Green
 16. `32–32`  Skip  ← never closed
 17. `33–35`  Red -> Green -> Refactor
 18. `36–36`  Skip  ← never closed
 19. `37–38`  Red -> Green
 20. `39–39`  Skip  ← never closed
 21. `40–40`  Skip  ← never closed
 22. `41–41`  Skip  ← never closed
 23. `42–44`  Red -> Green -> Refactor
 24. `45–45`  Skip  ← never closed
 25. `46–51`  Red -> Skip -> Verify -> Verify -> Refactor -> Refactor  ← never closed
 26. `52–52`  Skip  ← never closed
 27. `53–53`  Skip  ← never closed
 28. `54–54`  Skip  ← never closed
 29. `55–57`  Red -> Verify -> Green
 30. `58–58`  Skip  ← never closed
 31. `59–59`  Skip  ← never closed
 32. `60–60`  Skip  ← never closed
 33. `61–61`  Skip  ← never closed
 34. `62–62`  Skip  ← never closed
 35. `63–64`  Red -> Green
 36. `65–67`  Red -> Green -> Refactor
 37. `68–68`  Skip  ← never closed
 38. `69–70`  Red -> Green
 39. `71–72`  Red -> Green
 40. `73–77`  Skip -> Verify -> Verify -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 21 | test arrived and passed immediately — never red |
| `Red` | 19 | a new failing test arrived |
| `Green` | 18 | implementation changed, suite went green |
| `Verify` | 10 | nothing changed, suite re-run |
| `Refactor` | 6 | implementation changed, suite stayed green |
| `Green?` | 2 | implementation changed, still failing |
| `Start` | 1 | first invocation |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 3 | Green | pass | 1/0 | `src/cli.ts` |
| 4 | Verify | pass | 1/0 | — |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green? | fail | 1/1 | `src/cli.ts` |
| 7 | Verify | fail | 1/1 | — |
| 8 | Green | pass | 2/0 | `src/cli.ts` |
| 9 | Refactor | pass | 2/0 | `src/cli.ts`, `src/premium.ts` |
| 10 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 3/0 | `src/premium.ts` |
| 12 | Skip | pass | 4/0 | `src/claim-office.spec.ts` |
| 13 | Skip | pass | 5/0 | `src/claim-office.spec.ts` |
| 14 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 6/0 | `src/premium.ts` |
| 16 | Skip | pass | 7/0 | `src/claim-office.spec.ts` |
| 17 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 8/0 | `src/premium.ts` |
| 19 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 9/0 | `src/premium.ts` |
| 21 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 22 | Green | pass | 10/0 | `src/premium.ts` |
| 23 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 24 | Green | pass | 11/0 | `src/premium.ts` |
| 25 | Red | fail | 11/1 | `src/claim-office.spec.ts` |
| 26 | Green? | fail | 11/1 | `src/premium.ts` |
| 27 | Verify | fail | 11/1 | — |
| 28 | Green | pass | 12/0 | `src/premium.ts` |
| 29 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 30 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 31 | Green | pass | 14/0 | `src/premium.ts` |
| 32 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 33 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 34 | Green | pass | 16/0 | `src/cli.ts`, `src/premium.ts` |
| 35 | Refactor | pass | 16/0 | `src/premium.ts` |
| 36 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 37 | Red | fail | 17/1 | `src/claim-office.spec.ts` |
| 38 | Green | pass | 18/0 | `src/cli.ts`, `src/premium.ts` |
| 39 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 40 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 41 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 42 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 43 | Green | pass | 22/0 | `src/claims.ts`, `src/cli.ts` |
| 44 | Refactor | pass | 22/0 | `src/catalogue.ts`, `src/claims.ts`, `src/premium.ts` |
| 45 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 46 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 47 | Skip | fail | 23/1 | `src/claim-office.spec.ts` |
| 48 | Verify | fail | 23/1 | — |
| 49 | Verify | fail | 23/1 | — |
| 50 | Refactor | pass | 24/0 | `src/claims.ts` |
| 51 | Refactor | pass | 24/0 | `src/claims.ts` |
| 52 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 53 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 54 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 55 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 56 | Verify | fail | 27/1 | — |
| 57 | Green | pass | 28/0 | `src/claims.ts` |
| 58 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 59 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 63 | Red | fail | 33/1 | `src/claim-office.spec.ts` |
| 64 | Green | pass | 34/0 | `src/catalogue.ts`, `src/cli.ts` |
| 65 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 66 | Green | pass | 35/0 | `src/claims.ts` |
| 67 | Refactor | pass | 35/0 | `src/claims.ts` |
| 68 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 69 | Red | fail | 36/1 | `src/claim-office.spec.ts` |
| 70 | Green | pass | 37/0 | `src/claims.ts` |
| 71 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 72 | Green | pass | 38/0 | `src/claims.ts` |
| 73 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 74 | Verify | pass | 39/0 | — |
| 75 | Verify | pass | 39/0 | — |
| 76 | Verify | pass | 39/0 | — |
| 77 | Verify | pass | 39/0 | — |

Final suite state: **pass**.

