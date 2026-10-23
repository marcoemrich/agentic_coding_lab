# TDD phase chain — 2026-10-23_02-20-28_claim-office-example-mapping_exact-ptdd-v1-pi_gemini-4-argon-2

**78 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Both -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Both -> Refactor -> Refactor -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green -> Skip -> Verify
```

Deviations present: `Both` ×2 (test and implementation changed together — no verified red), `Skip` ×10 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 78 |
| `cycles_total` | 36 |
| `cycles_closed` | 23 |
| `test_first_rate` | 0.657 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 18 |
| `skip_events` | 10 |
| `refactor_per_cycle` | 0.783 |
| `green_attempts` | 0.0 |
| `deviations` | 12 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.749 |
| `tdd_discipline_test_first` | 0.657 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.639 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (23 of 36 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–3`  Both -> Refactor  ← never closed
  3. `4–6`  Red -> Green -> Refactor
  4. `7–9`  Red -> Green -> Refactor
  5. `10–12`  Red -> Green -> Refactor
  6. `13–14`  Red -> Green
  7. `15–17`  Red -> Green -> Refactor
  8. `18–20`  Red -> Green -> Refactor
  9. `21–23`  Red -> Green -> Refactor
 10. `24–24`  Skip  ← never closed
 11. `25–25`  Skip  ← never closed
 12. `26–27`  Red -> Green
 13. `28–29`  Red -> Green
 14. `30–32`  Red -> Green -> Refactor
 15. `33–33`  Skip  ← never closed
 16. `34–36`  Red -> Green -> Refactor
 17. `37–37`  Skip  ← never closed
 18. `38–40`  Red -> Green -> Refactor
 19. `41–42`  Red -> Green
 20. `43–45`  Red -> Green -> Refactor
 21. `46–48`  Red -> Green -> Refactor
 22. `49–49`  Skip  ← never closed
 23. `50–52`  Red -> Green -> Refactor
 24. `53–53`  Skip  ← never closed
 25. `54–54`  Skip  ← never closed
 26. `55–57`  Red -> Green -> Refactor
 27. `58–59`  Red -> Green
 28. `60–62`  Red -> Green -> Refactor
 29. `63–63`  Skip  ← never closed
 30. `64–64`  Skip  ← never closed
 31. `65–66`  Red -> Green
 32. `67–69`  Both -> Refactor -> Refactor  ← never closed
 33. `70–71`  Red -> Green
 34. `72–74`  Red -> Green -> Refactor
 35. `75–76`  Red -> Green
 36. `77–78`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 23 | a new failing test arrived |
| `Green` | 23 | implementation changed, suite went green |
| `Refactor` | 18 | implementation changed, suite stayed green |
| `Skip` | 10 | test arrived and passed immediately — never red |
| `Both` | 2 | test and implementation changed together — no verified red |
| `Start` | 1 | first invocation |
| `Verify` | 1 | nothing changed, suite re-run |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Both | fail | 0/1 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 3 | Refactor | pass | 1/0 | `src/claim-office.ts` |
| 4 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 5 | Green | pass | 2/0 | `src/claim-office.ts` |
| 6 | Refactor | pass | 2/0 | `src/claim-office.ts` |
| 7 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 8 | Green | pass | 3/0 | `src/claim-office.ts` |
| 9 | Refactor | pass | 3/0 | `src/claim-office.ts` |
| 10 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 4/0 | `src/claim-office.ts` |
| 12 | Refactor | pass | 4/0 | `src/claim-office.ts` |
| 13 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 5/0 | `src/claim-office.ts` |
| 15 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 6/0 | `src/claim-office.ts` |
| 17 | Refactor | pass | 6/0 | `src/claim-office.ts` |
| 18 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 7/0 | `src/claim-office.ts` |
| 20 | Refactor | pass | 7/0 | `src/claim-office.ts` |
| 21 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 22 | Green | pass | 8/0 | `src/claim-office.ts` |
| 23 | Refactor | pass | 8/0 | `src/claim-office.ts` |
| 24 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 25 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 26 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 27 | Green | pass | 11/0 | `src/claim-office.ts` |
| 28 | Red | fail | 11/1 | `src/claim-office.spec.ts` |
| 29 | Green | pass | 12/0 | `src/claim-office.ts` |
| 30 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 31 | Green | pass | 13/0 | `src/claim-office.ts` |
| 32 | Refactor | pass | 13/0 | `src/claim-office.ts` |
| 33 | Skip | pass | 14/0 | `src/claim-office.spec.ts` |
| 34 | Red | fail | 14/1 | `src/claim-office.spec.ts` |
| 35 | Green | pass | 15/0 | `src/claim-office.ts` |
| 36 | Refactor | pass | 15/0 | `src/claim-office.ts` |
| 37 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 38 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 39 | Green | pass | 17/0 | `src/claim-office.ts` |
| 40 | Refactor | pass | 17/0 | `src/claim-office.ts` |
| 41 | Red | fail | 17/1 | `src/claim-office.spec.ts` |
| 42 | Green | pass | 18/0 | `src/claim-office.ts` |
| 43 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 44 | Green | pass | 19/0 | `src/claim-office.ts` |
| 45 | Refactor | pass | 19/0 | `src/claim-office.ts` |
| 46 | Red | fail | 19/1 | `src/claim-office.spec.ts` |
| 47 | Green | pass | 20/0 | `src/claim-office.ts` |
| 48 | Refactor | pass | 20/0 | `src/claim-office.ts` |
| 49 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 50 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 51 | Green | pass | 22/0 | `src/claim-office.ts` |
| 52 | Refactor | pass | 22/0 | `src/claim-office.ts` |
| 53 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 54 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 55 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 56 | Green | pass | 25/0 | `src/claim-office.ts` |
| 57 | Refactor | pass | 25/0 | `src/claim-office.ts` |
| 58 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 59 | Green | pass | 26/0 | `src/claim-office.ts` |
| 60 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 61 | Green | pass | 27/0 | `src/claim-office.ts` |
| 62 | Refactor | pass | 27/0 | `src/claim-office.ts` |
| 63 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 65 | Red | fail | 29/1 | `src/claim-office.spec.ts` |
| 66 | Green | pass | 30/0 | `src/claim-office.ts` |
| 67 | Both | fail | 30/1 | `src/claim-office.spec.ts`, `src/cli.ts` |
| 68 | Refactor | pass | 31/0 | `src/claim-office.ts`, `src/cli.ts` |
| 69 | Refactor | pass | 31/0 | `src/node-shims.d.ts` |
| 70 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 71 | Green | pass | 32/0 | `src/claim-office.ts` |
| 72 | Red | fail | 32/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 33/0 | `src/claim-office.ts` |
| 74 | Refactor | pass | 33/0 | `src/claim-office.ts` |
| 75 | Red | fail | 33/1 | `src/claim-office.spec.ts` |
| 76 | Green | pass | 34/0 | `src/claim-office.ts` |
| 77 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 78 | Verify | pass | 35/0 | — |

Final suite state: **pass**.

