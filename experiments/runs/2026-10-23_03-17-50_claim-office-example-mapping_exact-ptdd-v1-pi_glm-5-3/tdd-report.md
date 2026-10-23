# TDD phase chain — 2026-10-23_03-17-50_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

**85 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Both -> Refactor -> Red -> Green? -> Verify -> Green -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green? -> Verify -> Green -> Red -> Green -> Break -> Verify -> Green -> Skip -> Skip -> Red -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Skip -> Skip -> Red -> Verify -> Skip -> Skip -> Skip -> Skip -> Red -> Verify -> Green -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Refactor -> Skip -> Verify
```

Deviations present: `Both` ×1 (test and implementation changed together — no verified red), `Break` ×1 (implementation change broke a green suite), `Green?` ×2 (implementation changed, still failing), `Skip` ×33 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 85 |
| `cycles_total` | 49 |
| `cycles_closed` | 14 |
| `test_first_rate` | 0.32 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 9 |
| `skip_events` | 33 |
| `refactor_per_cycle` | 0.643 |
| `green_attempts` | 0.143 |
| `deviations` | 35 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.45 |
| `tdd_discipline_test_first` | 0.32 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.286 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (14 of 49 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–4`  Both -> Refactor  ← never closed
  4. `5–10`  Red -> Green? -> Verify -> Green -> Refactor -> Refactor
  5. `11–11`  Skip  ← never closed
  6. `12–12`  Skip  ← never closed
  7. `13–13`  Skip  ← never closed
  8. `14–14`  Skip  ← never closed
  9. `15–15`  Skip  ← never closed
 10. `16–16`  Skip  ← never closed
 11. `17–19`  Red -> Green -> Refactor
 12. `20–20`  Skip  ← never closed
 13. `21–21`  Skip  ← never closed
 14. `22–22`  Skip  ← never closed
 15. `23–23`  Skip  ← never closed
 16. `24–24`  Skip  ← never closed
 17. `25–26`  Red -> Green
 18. `27–28`  Red -> Green
 19. `29–29`  Skip  ← never closed
 20. `30–30`  Skip  ← never closed
 21. `31–32`  Red -> Green
 22. `33–33`  Skip  ← never closed
 23. `34–36`  Red -> Green -> Refactor
 24. `37–37`  Skip  ← never closed
 25. `38–38`  Skip  ← never closed
 26. `39–42`  Red -> Green? -> Verify -> Green
 27. `43–47`  Red -> Green -> Break -> Verify -> Green
 28. `48–48`  Skip  ← never closed
 29. `49–49`  Skip  ← never closed
 30. `50–54`  Red -> Skip -> Verify -> Refactor -> Refactor  ← never closed
 31. `55–55`  Skip  ← never closed
 32. `56–56`  Skip  ← never closed
 33. `57–57`  Skip  ← never closed
 34. `58–60`  Red -> Verify -> Skip  ← never closed
 35. `61–61`  Skip  ← never closed
 36. `62–62`  Skip  ← never closed
 37. `63–63`  Skip  ← never closed
 38. `64–66`  Red -> Verify -> Green
 39. `67–67`  Skip  ← never closed
 40. `68–69`  Red -> Green
 41. `70–71`  Red -> Green
 42. `72–73`  Red -> Green
 43. `74–74`  Skip  ← never closed
 44. `75–77`  Red -> Green -> Refactor
 45. `78–78`  Skip  ← never closed
 46. `79–80`  Red -> Green
 47. `81–81`  Skip  ← never closed
 48. `82–83`  Skip -> Refactor  ← never closed
 49. `84–85`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Skip` | 33 | test arrived and passed immediately — never red |
| `Red` | 16 | a new failing test arrived |
| `Green` | 15 | implementation changed, suite went green |
| `Refactor` | 9 | implementation changed, suite stayed green |
| `Verify` | 7 | nothing changed, suite re-run |
| `Green?` | 2 | implementation changed, still failing |
| `Start` | 1 | first invocation |
| `Both` | 1 | test and implementation changed together — no verified red |
| `Break` | 1 | implementation change broke a green suite |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Skip | pass | 0/0 | `src/claim-office.spec.ts` |
| 3 | Both | fail | 0/1 | `src/claim-office.spec.ts`, `src/office.ts` |
| 4 | Refactor | pass | 1/0 | `src/office.ts` |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green? | fail | 1/1 | `src/office.ts` |
| 7 | Verify | fail | 1/1 | — |
| 8 | Green | pass | 2/0 | `src/office.ts` |
| 9 | Refactor | pass | 2/0 | `src/office.ts` |
| 10 | Refactor | pass | 2/0 | `src/office.ts`, `src/premium.ts` |
| 11 | Skip | pass | 3/0 | `src/claim-office.spec.ts` |
| 12 | Skip | pass | 4/0 | `src/claim-office.spec.ts` |
| 13 | Skip | pass | 5/0 | `src/claim-office.spec.ts` |
| 14 | Skip | pass | 6/0 | `src/claim-office.spec.ts` |
| 15 | Skip | pass | 7/0 | `src/claim-office.spec.ts` |
| 16 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 17 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 9/0 | `src/premium.ts` |
| 19 | Refactor | pass | 9/0 | `src/premium.ts` |
| 20 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 21 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 22 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 23 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 24 | Skip | pass | 14/0 | `src/claim-office.spec.ts` |
| 25 | Red | fail | 14/1 | `src/claim-office.spec.ts` |
| 26 | Green | pass | 15/0 | `src/premium.ts` |
| 27 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 28 | Green | pass | 16/0 | `src/premium.ts` |
| 29 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 30 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 31 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 32 | Green | pass | 19/0 | `src/office.ts`, `src/premium.ts` |
| 33 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 34 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 35 | Green | pass | 21/0 | `src/office.ts`, `src/premium.ts` |
| 36 | Refactor | pass | 21/0 | `src/premium.ts` |
| 37 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 38 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 39 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 40 | Green? | fail | 23/1 | `src/premium.ts` |
| 41 | Verify | fail | 23/1 | — |
| 42 | Green | pass | 24/0 | `src/premium.ts` |
| 43 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 44 | Green | pass | 25/0 | `src/claim.ts`, `src/office.ts` |
| 45 | Break | fail | 24/1 | `src/claim.ts`, `src/premium.ts` |
| 46 | Verify | fail | 24/1 | — |
| 47 | Green | pass | 25/0 | `src/office.ts` |
| 48 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 49 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 50 | Red | fail | 27/1 | `src/claim-office.spec.ts` |
| 51 | Skip | fail | 27/1 | `src/claim-office.spec.ts` |
| 52 | Verify | fail | 27/1 | — |
| 53 | Refactor | pass | 28/0 | `src/claim.ts` |
| 54 | Refactor | pass | 28/0 | `src/claim.ts`, `src/premium.ts` |
| 55 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 56 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 57 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 58 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 59 | Verify | fail | 31/1 | — |
| 60 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 61 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 62 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 63 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 64 | Red | fail | 35/1 | `src/claim-office.spec.ts` |
| 65 | Verify | fail | 35/1 | — |
| 66 | Green | pass | 36/0 | `src/claim.ts` |
| 67 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 68 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 69 | Green | pass | 38/0 | `src/claim.ts` |
| 70 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 71 | Green | pass | 39/0 | `src/claim.ts` |
| 72 | Red | fail | 39/1 | `src/claim-office.spec.ts` |
| 73 | Green | pass | 40/0 | `src/claim.ts` |
| 74 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 75 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 76 | Green | pass | 42/0 | `src/office.ts` |
| 77 | Refactor | pass | 42/0 | `src/office.ts` |
| 78 | Skip | pass | 43/0 | `src/claim-office.spec.ts` |
| 79 | Red | fail | 43/1 | `src/claim-office.spec.ts` |
| 80 | Green | pass | 44/0 | `src/cli.ts` |
| 81 | Skip | pass | 45/0 | `src/claim-office.spec.ts` |
| 82 | Skip | pass | 46/0 | `src/claim-office.spec.ts` |
| 83 | Refactor | pass | 46/0 | `src/cli.ts` |
| 84 | Skip | pass | 47/0 | `src/claim-office.spec.ts` |
| 85 | Verify | pass | 47/0 | — |

Final suite state: **pass**.

