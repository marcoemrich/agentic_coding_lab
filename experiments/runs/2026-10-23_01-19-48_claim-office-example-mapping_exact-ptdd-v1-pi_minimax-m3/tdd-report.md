# TDD phase chain — 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

**65 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Both -> Refactor -> Red -> Green -> Both -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Both -> Red -> Green -> Skip -> Skip -> Drop -> Red -> Verify -> Green -> Refactor -> Both -> Refactor -> Refactor -> Refactor -> Red -> Green -> Drop -> Verify -> Refactor -> Verify
```

Deviations present: `Both` ×4 (test and implementation changed together — no verified red), `Drop` ×2 (tests were removed), `Skip` ×21 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 65 |
| `cycles_total` | 37 |
| `cycles_closed` | 12 |
| `test_first_rate` | 0.324 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 6 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 10 |
| `skip_events` | 21 |
| `refactor_per_cycle` | 0.833 |
| `green_attempts` | 0.0 |
| `deviations` | 27 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.472 |
| `tdd_discipline_test_first` | 0.324 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.324 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (12 of 37 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–3`  Both -> Refactor  ← never closed
  3. `4–5`  Red -> Green
  4. `6–6`  Both  ← never closed
  5. `7–7`  Skip  ← never closed
  6. `8–8`  Skip  ← never closed
  7. `9–9`  Skip  ← never closed
  8. `10–12`  Red -> Green -> Refactor
  9. `13–14`  Red -> Green
 10. `15–15`  Skip  ← never closed
 11. `16–19`  Red -> Green -> Refactor -> Refactor
 12. `20–20`  Skip  ← never closed
 13. `21–21`  Skip  ← never closed
 14. `22–22`  Skip  ← never closed
 15. `23–23`  Skip  ← never closed
 16. `24–26`  Red -> Green -> Refactor
 17. `27–28`  Red -> Green
 18. `29–29`  Skip  ← never closed
 19. `30–30`  Skip  ← never closed
 20. `31–31`  Skip  ← never closed
 21. `32–32`  Skip  ← never closed
 22. `33–34`  Red -> Green
 23. `35–35`  Skip  ← never closed
 24. `36–36`  Skip  ← never closed
 25. `37–38`  Red -> Green
 26. `39–39`  Skip  ← never closed
 27. `40–40`  Skip  ← never closed
 28. `41–41`  Skip  ← never closed
 29. `42–42`  Skip  ← never closed
 30. `43–44`  Red -> Green
 31. `45–45`  Skip  ← never closed
 32. `46–48`  Both -> Red -> Green
 33. `49–49`  Skip  ← never closed
 34. `50–51`  Skip -> Drop  ← never closed
 35. `52–55`  Red -> Verify -> Green -> Refactor
 36. `56–59`  Both -> Refactor -> Refactor -> Refactor  ← never closed
 37. `60–65`  Red -> Green -> Drop -> Verify -> Refactor -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 21 | test arrived and passed immediately — never red |
| `Red` | 12 | a new failing test arrived |
| `Green` | 12 | implementation changed, suite went green |
| `Refactor` | 10 | implementation changed, suite stayed green |
| `Both` | 4 | test and implementation changed together — no verified red |
| `Verify` | 3 | nothing changed, suite re-run |
| `Drop` | 2 | tests were removed |
| `Start` | 1 | first invocation |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Both | fail | 0/1 | `src/claim-office.spec.ts`, `src/quote.ts` |
| 3 | Refactor | pass | 1/0 | `src/quote.ts` |
| 4 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 5 | Green | pass | 2/0 | `src/quote.ts` |
| 6 | Both | pass | 2/0 | `src/claim-office.spec.ts`, `src/quote.ts` |
| 7 | Skip | pass | 3/0 | `src/claim-office.spec.ts` |
| 8 | Skip | pass | 4/0 | `src/claim-office.spec.ts` |
| 9 | Skip | pass | 5/0 | `src/claim-office.spec.ts` |
| 10 | Red | fail | 1/4 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 5/0 | `src/quote.ts` |
| 12 | Refactor | pass | 5/0 | `src/quote.ts` |
| 13 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 6/0 | `src/quote.ts` |
| 15 | Skip | pass | 7/0 | `src/claim-office.spec.ts` |
| 16 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 8/0 | `src/quote.ts` |
| 18 | Refactor | pass | 8/0 | `src/quote.ts` |
| 19 | Refactor | pass | 8/0 | `src/quote.ts` |
| 20 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 21 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 22 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 23 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 24 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 25 | Green | pass | 13/0 | `src/quote.ts` |
| 26 | Refactor | pass | 13/0 | `src/quote.ts` |
| 27 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 28 | Green | pass | 14/0 | `src/quote.ts` |
| 29 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 30 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 31 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 32 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 33 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 34 | Green | pass | 19/0 | `src/quote.ts` |
| 35 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 36 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 37 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 38 | Green | pass | 22/0 | `src/quote.ts` |
| 39 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 40 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 41 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 42 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 43 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 44 | Green | pass | 27/0 | `src/quote.ts` |
| 45 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 46 | Both | fail (1 collect err) | 28/0 | `src/claim.spec.ts`, `src/claim.ts` |
| 47 | Red | fail | 28/1 | `src/claim.spec.ts` |
| 48 | Green | pass | 29/0 | `src/claim.ts` |
| 49 | Skip | pass | 30/0 | `src/claim.spec.ts` |
| 50 | Skip | pass | 31/0 | `src/claim.spec.ts` |
| 51 | Drop | pass | 31/0 | `src/claim-office.spec.ts` |
| 52 | Red | fail | 40/6 | `src/claim.spec.ts` |
| 53 | Verify | fail | 40/6 | — |
| 54 | Green | pass | 46/0 | `src/claim.ts` |
| 55 | Refactor | pass | 46/0 | `src/claim.ts` |
| 56 | Both | pass | 49/0 | `src/claim.spec.ts`, `src/claim.ts` |
| 57 | Refactor | pass | 49/0 | `src/claim.ts` |
| 58 | Refactor | pass | 49/0 | `src/cli.ts`, `src/scenario.ts` |
| 59 | Refactor | pass | 49/0 | `src/claim.ts` |
| 60 | Red | fail | 57/1 | `src/cli.spec.ts` |
| 61 | Green | pass | 58/0 | `src/cli.ts` |
| 62 | Drop | pass | 58/0 | `src/claim-office.spec.ts` |
| 63 | Verify | pass | 58/0 | — |
| 64 | Refactor | pass | 58/0 | `src/claim.ts` |
| 65 | Verify | pass | 58/0 | — |

Final suite state: **pass**.

