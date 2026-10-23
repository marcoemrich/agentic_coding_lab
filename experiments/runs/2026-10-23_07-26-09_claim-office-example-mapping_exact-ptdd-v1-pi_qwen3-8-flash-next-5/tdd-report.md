# TDD phase chain — 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-5

**59 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Refactor -> Skip -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red(c) -> Both -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Verify
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Skip` ×32 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 59 |
| `cycles_total` | 42 |
| `cycles_closed` | 9 |
| `test_first_rate` | 0.233 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 2 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 5 |
| `skip_events` | 32 |
| `refactor_per_cycle` | 0.556 |
| `green_attempts` | 0.0 |
| `deviations` | 33 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.368 |
| `tdd_discipline_test_first` | 0.233 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.214 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (9 of 42 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red(c) -> Red -> Green
  3. `5–6`  Red -> Green
  4. `7–7`  Skip  ← never closed
  5. `8–8`  Skip  ← never closed
  6. `9–9`  Skip  ← never closed
  7. `10–10`  Skip  ← never closed
  8. `11–14`  Red -> Green -> Refactor -> Refactor
  9. `15–15`  Skip  ← never closed
 10. `16–17`  Red -> Green
 11. `18–18`  Skip  ← never closed
 12. `19–21`  Red -> Green -> Refactor
 13. `22–22`  Skip  ← never closed
 14. `23–23`  Skip  ← never closed
 15. `24–24`  Skip  ← never closed
 16. `25–28`  Red(c) -> Both -> Green -> Refactor
 17. `29–29`  Skip  ← never closed
 18. `30–30`  Skip  ← never closed
 19. `31–31`  Skip  ← never closed
 20. `32–32`  Skip  ← never closed
 21. `33–33`  Skip  ← never closed
 22. `34–34`  Skip  ← never closed
 23. `35–35`  Skip  ← never closed
 24. `36–36`  Skip  ← never closed
 25. `37–38`  Red -> Green
 26. `39–39`  Skip  ← never closed
 27. `40–40`  Skip  ← never closed
 28. `41–41`  Skip  ← never closed
 29. `42–42`  Skip  ← never closed
 30. `43–43`  Skip  ← never closed
 31. `44–44`  Skip  ← never closed
 32. `45–45`  Skip  ← never closed
 33. `46–46`  Skip  ← never closed
 34. `47–47`  Skip  ← never closed
 35. `48–48`  Skip  ← never closed
 36. `49–50`  Red -> Green
 37. `51–51`  Skip  ← never closed
 38. `52–52`  Skip  ← never closed
 39. `53–55`  Red -> Green -> Refactor
 40. `56–56`  Skip  ← never closed
 41. `57–57`  Skip  ← never closed
 42. `58–59`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 32 | test arrived and passed immediately — never red |
| `Green` | 9 | implementation changed, suite went green |
| `Red` | 8 | a new failing test arrived |
| `Refactor` | 5 | implementation changed, suite stayed green |
| `Red(c)` | 2 | test arrived, suite does not compile yet |
| `Start` | 1 | first invocation |
| `Both` | 1 | test and implementation changed together — no verified red |
| `Verify` | 1 | nothing changed, suite re-run |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/premium.ts` |
| 4 | Green | pass | 1/0 | `src/premium.ts` |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green | pass | 2/0 | `src/premium.ts` |
| 7 | Skip | pass | 3/0 | `src/claim-office.spec.ts` |
| 8 | Skip | pass | 4/0 | `src/claim-office.spec.ts` |
| 9 | Skip | pass | 5/0 | `src/claim-office.spec.ts` |
| 10 | Skip | pass | 6/0 | `src/claim-office.spec.ts` |
| 11 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 7/0 | `src/premium.ts` |
| 13 | Refactor | pass | 7/0 | `src/premium.ts` |
| 14 | Refactor | pass | 7/0 | `src/premium.ts` |
| 15 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 16 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 9/0 | `src/premium.ts` |
| 18 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 19 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 11/0 | `src/premium.ts` |
| 21 | Refactor | pass | 11/0 | `src/premium.ts` |
| 22 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 23 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 24 | Skip | pass | 14/0 | `src/claim-office.spec.ts` |
| 25 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 26 | Both | fail | 14/1 | `src/claim-office.spec.ts`, `src/cli.ts`, `src/premium.ts`, `src/scenario.ts` |
| 27 | Green | pass | 15/0 | `src/claims.ts`, `src/premium.ts`, `src/scenario.ts` |
| 28 | Refactor | pass | 15/0 | `src/cli.ts`, `src/node.d.ts`, `src/scenario.ts` |
| 29 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 30 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 31 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 32 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 33 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 34 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 35 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 36 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 37 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 38 | Green | pass | 24/0 | `src/claims.ts`, `src/scenario.ts` |
| 39 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 40 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 41 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 42 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 43 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 44 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 45 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 46 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 47 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 48 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 49 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 50 | Green | pass | 35/0 | `src/premium.ts` |
| 51 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 52 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 53 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 54 | Green | pass | 38/0 | `src/claims.ts` |
| 55 | Refactor | pass | 38/0 | `src/claims.ts` |
| 56 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 57 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 58 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 59 | Verify | pass | 41/0 | — |

Final suite state: **pass**.

