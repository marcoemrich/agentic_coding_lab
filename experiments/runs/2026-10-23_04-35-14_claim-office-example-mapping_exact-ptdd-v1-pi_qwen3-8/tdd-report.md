# TDD phase chain — 2026-10-23_04-35-14_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

**58 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Both -> Verify -> Refactor -> Red -> Green? -> Verify -> Green -> Red -> Green -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Skip -> Verify -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Verify -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Both -> Refactor -> Verify -> Skip -> Red -> Green -> Red -> Green -> Skip -> Verify -> Both -> Verify
```

Deviations present: `Both` ×3 (test and implementation changed together — no verified red), `Green?` ×1 (implementation changed, still failing), `Skip` ×18 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 58 |
| `cycles_total` | 33 |
| `cycles_closed` | 11 |
| `test_first_rate` | 0.344 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 4 |
| `skip_events` | 18 |
| `refactor_per_cycle` | 0.364 |
| `green_attempts` | 0.091 |
| `deviations` | 21 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.486 |
| `tdd_discipline_test_first` | 0.344 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.333 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (11 of 33 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Both -> Verify -> Verify -> Refactor  ← never closed
  3. `6–9`  Red -> Green? -> Verify -> Green
  4. `10–13`  Red -> Green -> Refactor -> Refactor
  5. `14–14`  Skip  ← never closed
  6. `15–15`  Skip  ← never closed
  7. `16–16`  Skip  ← never closed
  8. `17–18`  Skip -> Verify  ← never closed
  9. `19–19`  Skip  ← never closed
 10. `20–21`  Red -> Green
 11. `22–22`  Skip  ← never closed
 12. `23–23`  Skip  ← never closed
 13. `24–24`  Skip  ← never closed
 14. `25–26`  Red -> Green
 15. `27–28`  Red -> Green
 16. `29–31`  Skip -> Verify -> Verify  ← never closed
 17. `32–33`  Red -> Green
 18. `34–35`  Red -> Green
 19. `36–36`  Skip  ← never closed
 20. `37–38`  Red -> Green
 21. `39–39`  Skip  ← never closed
 22. `40–40`  Skip  ← never closed
 23. `41–42`  Red -> Green
 24. `43–43`  Skip  ← never closed
 25. `44–44`  Skip  ← never closed
 26. `45–45`  Skip  ← never closed
 27. `46–46`  Skip  ← never closed
 28. `47–49`  Both -> Refactor -> Verify  ← never closed
 29. `50–50`  Skip  ← never closed
 30. `51–52`  Red -> Green
 31. `53–54`  Red -> Green
 32. `55–56`  Skip -> Verify  ← never closed
 33. `57–58`  Both -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 18 | test arrived and passed immediately — never red |
| `Red` | 11 | a new failing test arrived |
| `Green` | 11 | implementation changed, suite went green |
| `Verify` | 9 | nothing changed, suite re-run |
| `Refactor` | 4 | implementation changed, suite stayed green |
| `Both` | 3 | test and implementation changed together — no verified red |
| `Start` | 1 | first invocation |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Both | fail | 0/1 | `src/claim-office.spec.ts`, `src/scenario.ts` |
| 3 | Verify | fail | 0/1 | — |
| 4 | Verify | fail | 0/1 | — |
| 5 | Refactor | pass | 1/0 | `src/scenario.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green? | fail | 1/1 | `src/scenario.ts` |
| 8 | Verify | fail | 1/1 | — |
| 9 | Green | pass | 2/0 | `src/scenario.ts` |
| 10 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 3/0 | `src/scenario.ts` |
| 12 | Refactor | pass | 3/0 | `src/price-list.ts`, `src/scenario.ts` |
| 13 | Refactor | pass | 3/0 | `src/price-list.ts` |
| 14 | Skip | pass | 4/0 | `src/claim-office.spec.ts` |
| 15 | Skip | pass | 5/0 | `src/claim-office.spec.ts` |
| 16 | Skip | pass | 6/0 | `src/claim-office.spec.ts` |
| 17 | Skip | pass | 7/0 | `src/claim-office.spec.ts` |
| 18 | Verify | pass | 7/0 | — |
| 19 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 20 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 21 | Green | pass | 9/0 | `src/price-list.ts`, `src/scenario.ts` |
| 22 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 23 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 24 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 25 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 26 | Green | pass | 14/0 | `src/scenario.ts` |
| 27 | Red | fail | 14/1 | `src/claim-office.spec.ts` |
| 28 | Green | pass | 15/0 | `src/scenario.ts` |
| 29 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 30 | Verify | pass | 17/0 | — |
| 31 | Verify | pass | 17/0 | — |
| 32 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 33 | Green | pass | 19/0 | `src/scenario.ts` |
| 34 | Red | fail | 19/1 | `src/claim-office.spec.ts` |
| 35 | Green | pass | 20/0 | `src/scenario.ts` |
| 36 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 37 | Red | fail | 22/1 | `src/claim-office.spec.ts` |
| 38 | Green | pass | 23/0 | `src/amounts.ts`, `src/claim.ts`, `src/price-list.ts`, `src/scenario.ts` |
| 39 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 40 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 41 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 42 | Green | pass | 26/0 | `src/claim.ts` |
| 43 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 44 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 45 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 46 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 47 | Both | fail | 33/1 | `src/claim-office.spec.ts`, `src/cli.ts` |
| 48 | Refactor | pass | 34/0 | `src/scenario.ts` |
| 49 | Verify | pass | 34/0 | — |
| 50 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 51 | Red | fail | 36/1 | `src/claim-office.spec.ts` |
| 52 | Green | pass | 37/0 | `src/claim.ts` |
| 53 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 54 | Green | pass | 38/0 | `src/claim.ts` |
| 55 | Skip | pass | 39/0 | `src/claim-office.spec.ts` |
| 56 | Verify | pass | 39/0 | — |
| 57 | Both | pass | 39/0 | `src/claim-office.spec.ts`, `src/quote.ts`, `src/scenario.ts` |
| 58 | Verify | pass | 39/0 | — |

Final suite state: **pass**.

