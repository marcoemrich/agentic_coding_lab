# TDD phase chain — 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-3

**78 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Green -> Red -> Green -> Red -> Green -> Verify -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Both -> Refactor -> Refactor -> Skip -> Red -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Verify -> Green -> Red -> Green -> Red -> Verify -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Refactor -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Verify
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Skip` ×18 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 78 |
| `cycles_total` | 40 |
| `cycles_closed` | 20 |
| `test_first_rate` | 0.537 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 11 |
| `skip_events` | 18 |
| `refactor_per_cycle` | 0.55 |
| `green_attempts` | 0.0 |
| `deviations` | 19 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.645 |
| `tdd_discipline_test_first` | 0.537 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.5 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (20 of 40 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–3`  Red(c) -> Green
  3. `4–5`  Red -> Green
  4. `6–8`  Red -> Green -> Verify
  5. `9–10`  Red -> Green
  6. `11–12`  Red -> Green
  7. `13–14`  Red -> Green
  8. `15–17`  Red -> Green -> Refactor
  9. `18–18`  Skip  ← never closed
 10. `19–20`  Red -> Green
 11. `21–21`  Skip  ← never closed
 12. `22–22`  Skip  ← never closed
 13. `23–24`  Red -> Green
 14. `25–25`  Skip  ← never closed
 15. `26–28`  Red -> Green -> Refactor
 16. `29–29`  Skip  ← never closed
 17. `30–32`  Red -> Green -> Refactor
 18. `33–33`  Skip  ← never closed
 19. `34–34`  Skip  ← never closed
 20. `35–37`  Red -> Green -> Refactor
 21. `38–40`  Both -> Refactor -> Refactor  ← never closed
 22. `41–41`  Skip  ← never closed
 23. `42–43`  Red -> Skip  ← never closed
 24. `44–45`  Red -> Green
 25. `46–46`  Skip  ← never closed
 26. `47–47`  Skip  ← never closed
 27. `48–48`  Skip  ← never closed
 28. `49–52`  Red -> Verify -> Verify -> Green
 29. `53–54`  Red -> Green
 30. `55–57`  Red -> Verify -> Skip  ← never closed
 31. `58–58`  Skip  ← never closed
 32. `59–59`  Skip  ← never closed
 33. `60–60`  Skip  ← never closed
 34. `61–61`  Skip  ← never closed
 35. `62–65`  Red -> Green -> Refactor -> Refactor
 36. `66–67`  Red -> Green
 37. `68–70`  Red -> Green -> Refactor
 38. `71–71`  Skip  ← never closed
 39. `72–74`  Red -> Green -> Refactor
 40. `75–78`  Red -> Green -> Refactor -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 21 | a new failing test arrived |
| `Green` | 20 | implementation changed, suite went green |
| `Skip` | 18 | test arrived and passed immediately — never red |
| `Refactor` | 11 | implementation changed, suite stayed green |
| `Verify` | 5 | nothing changed, suite re-run |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Both` | 1 | test and implementation changed together — no verified red |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Green | pass | 1/0 | `src/premium.ts`, `src/scenario.ts` |
| 4 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 5 | Green | pass | 2/0 | `src/premium.ts` |
| 6 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 7 | Green | pass | 3/0 | `src/premium.ts` |
| 8 | Verify | pass | 3/0 | — |
| 9 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 10 | Green | pass | 4/0 | `src/premium.ts` |
| 11 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 5/0 | `src/premium.ts` |
| 13 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 6/0 | `src/premium.ts` |
| 15 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 7/0 | `src/premium.ts` |
| 17 | Refactor | pass | 7/0 | `src/premium.ts` |
| 18 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 19 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 9/0 | `src/premium.ts` |
| 21 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 22 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 23 | Red | fail | 11/1 | `src/claim-office.spec.ts` |
| 24 | Green | pass | 12/0 | `src/premium.ts` |
| 25 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 26 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 27 | Green | pass | 14/0 | `src/premium.ts` |
| 28 | Refactor | pass | 14/0 | `src/premium.ts` |
| 29 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 30 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 31 | Green | pass | 16/0 | `src/premium.ts` |
| 32 | Refactor | pass | 16/0 | `src/premium.ts` |
| 33 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 34 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 35 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 19/0 | `src/premium.ts`, `src/scenario.ts` |
| 37 | Refactor | pass | 19/0 | `src/premium.ts` |
| 38 | Both | fail | 19/1 | `src/claim-office.spec.ts`, `src/scenario.ts` |
| 39 | Refactor | pass | 20/0 | `src/scenario.ts` |
| 40 | Refactor | pass | 20/0 | `src/scenario.ts` |
| 41 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 42 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 43 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 44 | Red | fail | 22/1 | `src/claim-office.spec.ts` |
| 45 | Green | pass | 23/0 | `src/scenario.ts` |
| 46 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 47 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 48 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 49 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 50 | Verify | fail | 26/1 | — |
| 51 | Verify | fail | 26/1 | — |
| 52 | Green | pass | 27/0 | `src/scenario.ts` |
| 53 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 54 | Green | pass | 28/0 | `src/scenario.ts` |
| 55 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 56 | Verify | fail | 28/1 | — |
| 57 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 58 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 59 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 62 | Red | fail | 33/1 | `src/claim-office.spec.ts` |
| 63 | Green | pass | 34/0 | `src/cli.ts` |
| 64 | Refactor | pass | 34/0 | `src/scenario.ts` |
| 65 | Refactor | pass | 34/0 | `src/scenario.ts` |
| 66 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 67 | Green | pass | 35/0 | `src/cli.ts`, `src/premium.ts` |
| 68 | Red | fail | 35/1 | `src/claim-office.spec.ts` |
| 69 | Green | pass | 36/0 | `src/scenario.ts` |
| 70 | Refactor | pass | 36/0 | `src/scenario.ts` |
| 71 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 72 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 38/0 | `src/scenario.ts` |
| 74 | Refactor | pass | 38/0 | `src/scenario.ts` |
| 75 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 76 | Green | pass | 39/0 | `src/scenario.ts` |
| 77 | Refactor | pass | 39/0 | `src/scenario.ts` |
| 78 | Verify | pass | 39/0 | — |

Final suite state: **pass**.

