# TDD phase chain — 2026-10-01_01-06-09_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

**97 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Verify -> Refactor -> Red -> Green? -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green? -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Refactor -> Skip -> Red -> Green -> Verify -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green? -> Green -> Refactor -> Skip -> Refactor -> Verify
```

Deviations present: `Green?` ×3 (implementation changed, still failing), `Skip` ×15 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 97 |
| `cycles_total` | 39 |
| `cycles_closed` | 23 |
| `test_first_rate` | 0.615 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 26 |
| `skip_events` | 15 |
| `refactor_per_cycle` | 1.13 |
| `green_attempts` | 0.13 |
| `deviations` | 15 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.713 |
| `tdd_discipline_test_first` | 0.615 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.59 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (23 of 39 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–6`  Red(c) -> Red -> Green -> Verify -> Refactor
  3. `7–10`  Red -> Green? -> Green -> Refactor
  4. `11–13`  Red -> Green -> Refactor
  5. `14–17`  Red -> Green -> Verify -> Refactor
  6. `18–20`  Red -> Green -> Refactor
  7. `21–21`  Skip  ← never closed
  8. `22–24`  Red -> Green -> Refactor
  9. `25–27`  Red -> Green -> Refactor
 10. `28–30`  Red -> Green -> Refactor
 11. `31–33`  Red -> Green -> Refactor
 12. `34–34`  Skip  ← never closed
 13. `35–37`  Red -> Green -> Refactor
 14. `38–38`  Skip  ← never closed
 15. `39–39`  Skip  ← never closed
 16. `40–40`  Skip  ← never closed
 17. `41–43`  Red -> Green -> Refactor
 18. `44–46`  Red -> Green -> Refactor
 19. `47–49`  Red -> Green -> Refactor
 20. `50–55`  Red -> Green? -> Green -> Verify -> Refactor -> Refactor
 21. `56–58`  Red -> Green -> Refactor
 22. `59–61`  Red -> Green -> Refactor
 23. `62–62`  Skip  ← never closed
 24. `63–63`  Skip  ← never closed
 25. `64–64`  Skip  ← never closed
 26. `65–67`  Red -> Green -> Refactor
 27. `68–70`  Red -> Green -> Refactor
 28. `71–73`  Red -> Green -> Refactor
 29. `74–74`  Skip  ← never closed
 30. `75–75`  Skip  ← never closed
 31. `76–79`  Red -> Green -> Refactor -> Refactor
 32. `80–80`  Skip  ← never closed
 33. `81–84`  Red -> Green -> Verify -> Refactor
 34. `85–85`  Skip  ← never closed
 35. `86–86`  Skip  ← never closed
 36. `87–89`  Red -> Green -> Refactor
 37. `90–90`  Skip  ← never closed
 38. `91–94`  Red -> Green? -> Green -> Refactor
 39. `95–97`  Skip -> Refactor -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Refactor` | 26 | implementation changed, suite stayed green |
| `Red` | 23 | a new failing test arrived |
| `Green` | 23 | implementation changed, suite went green |
| `Skip` | 15 | test arrived and passed immediately — never red |
| `Verify` | 5 | nothing changed, suite re-run |
| `Green?` | 3 | implementation changed, still failing |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 2 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Red | fail | 0/1 | `src/claim-office.ts` |
| 4 | Green | pass | 1/0 | `src/claim-office.ts` |
| 5 | Verify | pass | 1/0 | — |
| 6 | Refactor | pass | 1/0 | `src/claim-office.ts` |
| 7 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 8 | Green? | fail | 1/1 | `src/claim-office.ts` |
| 9 | Green | pass | 2/0 | `src/claim-office.ts` |
| 10 | Refactor | pass | 2/0 | `src/claim-office.ts` |
| 11 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 3/0 | `src/claim-office.ts` |
| 13 | Refactor | pass | 3/0 | `src/claim-office.ts` |
| 14 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 4/0 | `src/claim-office.ts` |
| 16 | Verify | pass | 4/0 | — |
| 17 | Refactor | pass | 4/0 | `src/claim-office.ts` |
| 18 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 19 | Green | pass | 5/0 | `src/claim-office.ts` |
| 20 | Refactor | pass | 5/0 | `src/claim-office.ts` |
| 21 | Skip | pass | 6/0 | `src/claim-office.spec.ts` |
| 22 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 23 | Green | pass | 7/0 | `src/claim-office.ts` |
| 24 | Refactor | pass | 7/0 | `src/claim-office.ts` |
| 25 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 26 | Green | pass | 8/0 | `src/claim-office.ts` |
| 27 | Refactor | pass | 8/0 | `src/claim-office.ts` |
| 28 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 29 | Green | pass | 9/0 | `src/claim-office.ts` |
| 30 | Refactor | pass | 9/0 | `src/claim-office.ts` |
| 31 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 32 | Green | pass | 10/0 | `src/claim-office.ts` |
| 33 | Refactor | pass | 10/0 | `src/claim-office.ts` |
| 34 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 35 | Red | fail | 11/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 12/0 | `src/claim-office.ts` |
| 37 | Refactor | pass | 12/0 | `src/claim-office.ts` |
| 38 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 39 | Skip | pass | 14/0 | `src/claim-office.spec.ts` |
| 40 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 41 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 42 | Green | pass | 16/0 | `src/claim-office.ts` |
| 43 | Refactor | pass | 16/0 | `src/claim-office.ts` |
| 44 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 45 | Green | pass | 17/0 | `src/claim-office.ts` |
| 46 | Refactor | pass | 17/0 | `src/claim-office.ts` |
| 47 | Red | fail | 17/1 | `src/claim-office.spec.ts` |
| 48 | Green | pass | 18/0 | `src/claim-office.ts` |
| 49 | Refactor | pass | 18/0 | `src/claim-office.ts` |
| 50 | Red | fail | 18/1 | `src/claim-office.spec.ts` |
| 51 | Green? | fail | 18/1 | `src/claim-office.ts` |
| 52 | Green | pass | 19/0 | `src/claim-office.ts` |
| 53 | Verify | pass | 19/0 | — |
| 54 | Refactor | pass | 19/0 | `src/claim-office.ts` |
| 55 | Refactor | pass | 19/0 | `src/claim-office.ts` |
| 56 | Red | fail | 19/1 | `src/claim-office.spec.ts` |
| 57 | Green | pass | 20/0 | `src/claim-office.ts` |
| 58 | Refactor | pass | 20/0 | `src/claim-office.ts` |
| 59 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 60 | Green | pass | 21/0 | `src/claim-office.ts` |
| 61 | Refactor | pass | 21/0 | `src/claim-office.ts` |
| 62 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 63 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 64 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 65 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 66 | Green | pass | 25/0 | `src/claim-office.ts` |
| 67 | Refactor | pass | 25/0 | `src/claim-office.ts` |
| 68 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 69 | Green | pass | 26/0 | `src/claim-office.ts` |
| 70 | Refactor | pass | 26/0 | `src/claim-office.ts` |
| 71 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 72 | Green | pass | 27/0 | `src/claim-office.ts` |
| 73 | Refactor | pass | 27/0 | `src/claim-office.ts` |
| 74 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 75 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 76 | Red | fail | 29/1 | `src/claim-office.spec.ts` |
| 77 | Green | pass | 30/0 | `src/claim-office.ts` |
| 78 | Refactor | pass | 30/0 | `src/claim-office.ts` |
| 79 | Refactor | pass | 30/0 | `src/claim-office.ts` |
| 80 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 81 | Red | fail | 31/1 | `src/claim-office.spec.ts` |
| 82 | Green | pass | 32/0 | `src/claim-office.ts` |
| 83 | Verify | pass | 32/0 | — |
| 84 | Refactor | pass | 32/0 | `src/claim-office.ts` |
| 85 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 86 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 87 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 88 | Green | pass | 35/0 | `src/claim-office.ts` |
| 89 | Refactor | pass | 35/0 | `src/claim-office.ts` |
| 90 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 91 | Red | fail | 36/1 | `src/cli.spec.ts` |
| 92 | Green? | fail | 36/1 | `src/cli.ts` |
| 93 | Green | pass | 37/0 | `src/cli.ts` |
| 94 | Refactor | pass | 37/0 | `src/cli.ts` |
| 95 | Skip | pass | 38/0 | `src/cli.spec.ts` |
| 96 | Refactor | pass | 38/0 | `src/cli.ts` |
| 97 | Verify | pass | 38/0 | — |

Final suite state: **pass**.

