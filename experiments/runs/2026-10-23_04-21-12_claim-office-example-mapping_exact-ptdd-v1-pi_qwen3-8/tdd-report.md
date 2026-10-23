# TDD phase chain — 2026-10-23_04-21-12_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

**69 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Both -> Refactor -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Red -> Both -> Both -> Both -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Both -> Red -> Both -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Both -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Verify
```

Deviations present: `Both` ×7 (test and implementation changed together — no verified red), `Skip` ×19 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 69 |
| `cycles_total` | 41 |
| `cycles_closed` | 16 |
| `test_first_rate` | 0.422 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 6 |
| `skip_events` | 19 |
| `refactor_per_cycle` | 0.375 |
| `green_attempts` | 0.0 |
| `deviations` | 26 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.548 |
| `tdd_discipline_test_first` | 0.422 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.39 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (16 of 41 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–3`  Both -> Refactor  ← never closed
  3. `4–5`  Red -> Green
  4. `6–6`  Skip  ← never closed
  5. `7–9`  Red -> Green -> Refactor
  6. `10–13`  Red -> Both -> Both -> Both  ← never closed
  7. `14–15`  Red -> Green
  8. `16–16`  Skip  ← never closed
  9. `17–17`  Skip  ← never closed
 10. `18–19`  Red -> Green
 11. `20–20`  Skip  ← never closed
 12. `21–22`  Red -> Both  ← never closed
 13. `23–24`  Red -> Both  ← never closed
 14. `25–25`  Skip  ← never closed
 15. `26–26`  Skip  ← never closed
 16. `27–29`  Red -> Green -> Refactor
 17. `30–30`  Skip  ← never closed
 18. `31–32`  Red -> Green
 19. `33–33`  Skip  ← never closed
 20. `34–34`  Skip  ← never closed
 21. `35–37`  Red -> Green -> Refactor
 22. `38–39`  Red -> Green
 23. `40–41`  Red -> Green
 24. `42–43`  Red -> Green
 25. `44–44`  Skip  ← never closed
 26. `45–45`  Skip  ← never closed
 27. `46–46`  Skip  ← never closed
 28. `47–47`  Skip  ← never closed
 29. `48–48`  Skip  ← never closed
 30. `49–49`  Skip  ← never closed
 31. `50–51`  Red -> Green
 32. `52–54`  Red -> Green -> Refactor
 33. `55–55`  Skip  ← never closed
 34. `56–56`  Skip  ← never closed
 35. `57–57`  Skip  ← never closed
 36. `58–58`  Both  ← never closed
 37. `59–60`  Red -> Green
 38. `61–62`  Red -> Green
 39. `63–63`  Skip  ← never closed
 40. `64–65`  Red -> Green
 41. `66–69`  Red -> Green -> Refactor -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 19 | a new failing test arrived |
| `Skip` | 19 | test arrived and passed immediately — never red |
| `Green` | 16 | implementation changed, suite went green |
| `Both` | 7 | test and implementation changed together — no verified red |
| `Refactor` | 6 | implementation changed, suite stayed green |
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
| 6 | Skip | pass | 2/0 | `src/claim-office.spec.ts` |
| 7 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 8 | Green | pass | 3/0 | `src/claim-office.ts` |
| 9 | Refactor | pass | 3/0 | `src/claim-office.ts` |
| 10 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 11 | Both | fail | 4/1 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 12 | Both | fail | 5/1 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 13 | Both | pass | 7/0 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 14 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 8/0 | `src/claim-office.ts` |
| 16 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 17 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 18 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 11/0 | `src/claim-office.ts` |
| 20 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 21 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 22 | Both | pass | 13/0 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 23 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 24 | Both | pass | 14/0 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 25 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 26 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 27 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 28 | Green | pass | 17/0 | `src/claim-office.ts` |
| 29 | Refactor | pass | 17/0 | `src/claim-office.ts` |
| 30 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 31 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 32 | Green | pass | 19/0 | `src/claim-office.ts` |
| 33 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 34 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 35 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 22/0 | `src/claim-office.ts` |
| 37 | Refactor | pass | 22/0 | `src/claim-office.ts` |
| 38 | Red | fail | 22/1 | `src/claim-office.spec.ts` |
| 39 | Green | pass | 23/0 | `src/claim-office.ts` |
| 40 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 41 | Green | pass | 24/0 | `src/claim-office.ts` |
| 42 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 43 | Green | pass | 25/0 | `src/claim-office.ts` |
| 44 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 45 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 46 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 47 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 48 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 49 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 50 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 51 | Green | pass | 32/0 | `src/claim-office.ts` |
| 52 | Red | fail | 32/1 | `src/claim-office.spec.ts` |
| 53 | Green | pass | 33/0 | `src/claim-office.ts` |
| 54 | Refactor | pass | 33/0 | `src/claim-office.ts` |
| 55 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 56 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 57 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 58 | Both | pass | 37/0 | `src/claim-office.spec.ts`, `src/cli.ts` |
| 59 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 60 | Green | pass | 38/0 | `src/claim-office.ts` |
| 61 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 62 | Green | pass | 39/0 | `src/claim-office.ts` |
| 63 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 64 | Red | fail | 40/1 | `src/claim-office.spec.ts` |
| 65 | Green | pass | 41/0 | `src/claim-office.ts` |
| 66 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 67 | Green | pass | 42/0 | `src/claim-office.ts` |
| 68 | Refactor | pass | 42/0 | `src/claim-office.ts` |
| 69 | Verify | pass | 42/0 | — |

Final suite state: **pass**.

