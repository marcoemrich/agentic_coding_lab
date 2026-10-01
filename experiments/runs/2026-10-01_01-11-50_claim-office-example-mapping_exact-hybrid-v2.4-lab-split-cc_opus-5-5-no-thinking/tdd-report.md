# TDD phase chain — 2026-10-01_01-11-50_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

**100 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Red -> Green -> Refactor -> Red -> Green -> Both -> Both -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green? -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Verify -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Verify -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green? -> Green -> Refactor -> Skip -> Refactor -> Refactor -> Refactor
```

Deviations present: `Both` ×2 (test and implementation changed together — no verified red), `Green?` ×2 (implementation changed, still failing), `Skip` ×16 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 100 |
| `cycles_total` | 42 |
| `cycles_closed` | 24 |
| `test_first_rate` | 0.581 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 26 |
| `skip_events` | 16 |
| `refactor_per_cycle` | 1.083 |
| `green_attempts` | 0.083 |
| `deviations` | 18 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.693 |
| `tdd_discipline_test_first` | 0.581 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.571 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (24 of 42 closed with a Green)

  1. `1–4`  Red(c) -> Red -> Green -> Refactor
  2. `5–6`  Red -> Green
  3. `7–7`  Both  ← never closed
  4. `8–8`  Both  ← never closed
  5. `9–11`  Red -> Green -> Refactor
  6. `12–14`  Red -> Green -> Refactor
  7. `15–17`  Red -> Green -> Verify
  8. `18–21`  Red -> Green -> Verify -> Refactor
  9. `22–24`  Red -> Green -> Refactor
 10. `25–25`  Skip  ← never closed
 11. `26–28`  Red -> Green -> Refactor
 12. `29–31`  Red -> Green -> Refactor
 13. `32–34`  Red -> Green -> Refactor
 14. `35–37`  Red -> Green -> Refactor
 15. `38–38`  Skip  ← never closed
 16. `39–41`  Red -> Green -> Refactor
 17. `42–42`  Skip  ← never closed
 18. `43–43`  Skip  ← never closed
 19. `44–46`  Red -> Green -> Refactor
 20. `47–47`  Skip  ← never closed
 21. `48–51`  Red -> Green -> Refactor -> Refactor
 22. `52–52`  Skip  ← never closed
 23. `53–55`  Red -> Green -> Refactor
 24. `56–59`  Red -> Green? -> Green -> Refactor
 25. `60–62`  Red -> Green -> Refactor
 26. `63–66`  Red -> Verify -> Green -> Refactor
 27. `67–69`  Red -> Green -> Refactor
 28. `70–70`  Skip  ← never closed
 29. `71–71`  Skip  ← never closed
 30. `72–72`  Skip  ← never closed
 31. `73–75`  Red -> Green -> Refactor
 32. `76–76`  Skip  ← never closed
 33. `77–77`  Skip  ← never closed
 34. `78–78`  Skip  ← never closed
 35. `79–79`  Skip  ← never closed
 36. `80–84`  Red -> Verify -> Verify -> Green -> Refactor
 37. `85–87`  Red -> Green -> Refactor
 38. `88–88`  Skip  ← never closed
 39. `89–89`  Skip  ← never closed
 40. `90–92`  Red -> Green -> Refactor
 41. `93–96`  Red -> Green? -> Green -> Refactor
 42. `97–100`  Skip -> Refactor -> Refactor -> Refactor  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Refactor` | 26 | implementation changed, suite stayed green |
| `Red` | 24 | a new failing test arrived |
| `Green` | 24 | implementation changed, suite went green |
| `Skip` | 16 | test arrived and passed immediately — never red |
| `Verify` | 5 | nothing changed, suite re-run |
| `Both` | 2 | test and implementation changed together — no verified red |
| `Green?` | 2 | implementation changed, still failing |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red | fail | 0/1 | `src/claim-office.ts` |
| 3 | Green | pass | 1/0 | `src/claim-office.ts` |
| 4 | Refactor | pass | 1/0 | `src/claim-office.ts` |
| 5 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 6 | Green | pass | 2/0 | `src/claim-office.ts` |
| 7 | Both | pass | 2/0 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 8 | Both | pass | 2/0 | `src/claim-office.spec.ts`, `src/claim-office.ts` |
| 9 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 10 | Green | pass | 3/0 | `src/claim-office.ts` |
| 11 | Refactor | pass | 3/0 | `src/claim-office.ts` |
| 12 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 4/0 | `src/claim-office.ts` |
| 14 | Refactor | pass | 4/0 | `src/claim-office.ts` |
| 15 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 16 | Green | pass | 5/0 | `src/claim-office.ts` |
| 17 | Verify | pass | 5/0 | — |
| 18 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 6/0 | `src/claim-office.ts` |
| 20 | Verify | pass | 6/0 | — |
| 21 | Refactor | pass | 6/0 | `src/claim-office.ts` |
| 22 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 23 | Green | pass | 7/0 | `src/claim-office.ts` |
| 24 | Refactor | pass | 7/0 | `src/claim-office.ts` |
| 25 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 26 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 27 | Green | pass | 9/0 | `src/claim-office.ts` |
| 28 | Refactor | pass | 9/0 | `src/claim-office.ts` |
| 29 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 30 | Green | pass | 10/0 | `src/claim-office.ts` |
| 31 | Refactor | pass | 10/0 | `src/claim-office.ts` |
| 32 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 33 | Green | pass | 11/0 | `src/claim-office.ts` |
| 34 | Refactor | pass | 11/0 | `src/claim-office.ts` |
| 35 | Red | fail | 11/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 12/0 | `src/claim-office.ts` |
| 37 | Refactor | pass | 12/0 | `src/claim-office.ts` |
| 38 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 39 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 40 | Green | pass | 14/0 | `src/claim-office.ts` |
| 41 | Refactor | pass | 14/0 | `src/claim-office.ts` |
| 42 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 43 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 44 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 45 | Green | pass | 17/0 | `src/claim-office.ts` |
| 46 | Refactor | pass | 17/0 | `src/claim-office.ts` |
| 47 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 48 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 49 | Green | pass | 19/0 | `src/claim-office.ts` |
| 50 | Refactor | pass | 19/0 | `src/claim-office.ts` |
| 51 | Refactor | pass | 19/0 | `src/claim-office.ts` |
| 52 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 53 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 54 | Green | pass | 21/0 | `src/claim-office.ts` |
| 55 | Refactor | pass | 21/0 | `src/claim-office.ts` |
| 56 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 57 | Green? | fail | 21/1 | `src/claim-office.ts` |
| 58 | Green | pass | 22/0 | `src/claim-office.ts` |
| 59 | Refactor | pass | 22/0 | `src/claim-office.ts` |
| 60 | Red | fail | 22/1 | `src/claim-office.spec.ts` |
| 61 | Green | pass | 23/0 | `src/claim-office.ts` |
| 62 | Refactor | pass | 23/0 | `src/claim-office.ts` |
| 63 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 64 | Verify | fail | 23/1 | — |
| 65 | Green | pass | 24/0 | `src/claim-office.ts` |
| 66 | Refactor | pass | 24/0 | `src/claim-office.ts` |
| 67 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 68 | Green | pass | 25/0 | `src/claim-office.ts` |
| 69 | Refactor | pass | 25/0 | `src/claim-office.ts` |
| 70 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 71 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 72 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 73 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 74 | Green | pass | 29/0 | `src/claim-office.ts` |
| 75 | Refactor | pass | 29/0 | `src/claim-office.ts` |
| 76 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 77 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 78 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 79 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 80 | Red | fail | 33/1 | `src/claim-office.spec.ts` |
| 81 | Verify | fail | 33/1 | — |
| 82 | Verify | fail | 33/1 | — |
| 83 | Green | pass | 34/0 | `src/claim-office.ts` |
| 84 | Refactor | pass | 34/0 | `src/claim-office.ts` |
| 85 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 86 | Green | pass | 35/0 | `src/claim-office.ts` |
| 87 | Refactor | pass | 35/0 | `src/claim-office.ts` |
| 88 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 89 | Skip | pass | 37/0 | `src/claim-office.spec.ts` |
| 90 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 91 | Green | pass | 38/0 | `src/claim-office.ts` |
| 92 | Refactor | pass | 38/0 | `src/claim-office.ts` |
| 93 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 94 | Green? | fail | 38/1 | `src/cli.ts` |
| 95 | Green | pass | 39/0 | `src/cli.ts` |
| 96 | Refactor | pass | 39/0 | `src/cli.ts` |
| 97 | Skip | pass | 40/0 | `src/claim-office.spec.ts` |
| 98 | Refactor | pass | 40/0 | `src/cli.ts` |
| 99 | Refactor | pass | 40/0 | `src/claim-office.ts` |
| 100 | Refactor | pass | 40/0 | `src/cli.ts` |

Final suite state: **pass**.

