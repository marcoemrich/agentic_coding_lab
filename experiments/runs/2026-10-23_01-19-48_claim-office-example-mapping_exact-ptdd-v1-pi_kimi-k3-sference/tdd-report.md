# TDD phase chain — 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

**95 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red -> Green? -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Refactor -> Skip -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Skip -> Verify -> Red -> Green -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Red -> Green -> Skip -> Verify -> Red -> Green -> Skip -> Verify -> Skip -> Verify -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Verify
```

Deviations present: `Green?` ×1 (implementation changed, still failing), `Skip` ×26 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 95 |
| `cycles_total` | 43 |
| `cycles_closed` | 16 |
| `test_first_rate` | 0.395 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 13.5 |
| `refactor_events` | 7 |
| `skip_events` | 26 |
| `refactor_per_cycle` | 0.438 |
| `green_attempts` | 0.062 |
| `deviations` | 26 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.528 |
| `tdd_discipline_test_first` | 0.395 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.372 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (16 of 43 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–4`  Red -> Green? -> Green
  3. `5–6`  Red -> Green
  4. `7–8`  Red -> Green
  5. `9–10`  Red -> Green
  6. `11–12`  Red -> Green
  7. `13–14`  Red -> Green
  8. `15–16`  Skip -> Verify  ← never closed
  9. `17–19`  Red -> Green -> Refactor
 10. `20–21`  Skip -> Verify  ← never closed
 11. `22–23`  Skip -> Verify  ← never closed
 12. `24–26`  Skip -> Verify -> Refactor  ← never closed
 13. `27–28`  Skip -> Verify  ← never closed
 14. `29–31`  Red -> Green -> Refactor
 15. `32–34`  Red -> Green -> Refactor
 16. `35–36`  Skip -> Verify  ← never closed
 17. `37–38`  Skip -> Verify  ← never closed
 18. `39–40`  Skip -> Verify  ← never closed
 19. `41–42`  Red -> Green
 20. `43–44`  Skip -> Verify  ← never closed
 21. `45–46`  Red -> Green
 22. `47–48`  Skip -> Verify  ← never closed
 23. `49–50`  Skip -> Verify  ← never closed
 24. `51–52`  Skip -> Verify  ← never closed
 25. `53–54`  Skip -> Verify  ← never closed
 26. `55–56`  Red -> Green
 27. `57–58`  Red -> Green
 28. `59–60`  Skip -> Verify  ← never closed
 29. `61–62`  Red -> Green
 30. `63–64`  Skip -> Verify  ← never closed
 31. `65–67`  Skip -> Verify -> Refactor  ← never closed
 32. `68–69`  Skip -> Verify  ← never closed
 33. `70–71`  Skip -> Verify  ← never closed
 34. `72–73`  Skip -> Verify  ← never closed
 35. `74–76`  Red -> Green -> Refactor
 36. `77–78`  Skip -> Verify  ← never closed
 37. `79–80`  Skip -> Verify  ← never closed
 38. `81–82`  Skip -> Verify  ← never closed
 39. `83–85`  Red -> Skip -> Verify  ← never closed
 40. `86–87`  Skip -> Verify  ← never closed
 41. `88–89`  Skip -> Verify  ← never closed
 42. `90–91`  Skip -> Verify  ← never closed
 43. `92–95`  Red -> Green -> Refactor -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 27 | nothing changed, suite re-run |
| `Skip` | 26 | test arrived and passed immediately — never red |
| `Red` | 17 | a new failing test arrived |
| `Green` | 16 | implementation changed, suite went green |
| `Refactor` | 7 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 3 | Green? | fail | 0/1 | `src/cli.ts` |
| 4 | Green | pass | 1/0 | `src/cli.ts` |
| 5 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 6 | Green | pass | 2/0 | `src/cli.ts` |
| 7 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 8 | Green | pass | 3/0 | `src/cli.ts` |
| 9 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 10 | Green | pass | 4/0 | `src/cli.ts` |
| 11 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 12 | Green | pass | 5/0 | `src/cli.ts` |
| 13 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 6/0 | `src/cli.ts` |
| 15 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 16 | Verify | pass | 7/0 | — |
| 17 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 18 | Green | pass | 8/0 | `src/cli.ts` |
| 19 | Refactor | pass | 8/0 | `src/cli.ts` |
| 20 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 21 | Verify | pass | 9/0 | — |
| 22 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 23 | Verify | pass | 10/0 | — |
| 24 | Skip | pass | 0/0 | `src/claim-office.spec.ts` |
| 25 | Verify | fail | 0/1 | — |
| 26 | Refactor | pass | 11/0 | `src/cli.ts` |
| 27 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 28 | Verify | pass | 12/0 | — |
| 29 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 30 | Green | pass | 13/0 | `src/cli.ts` |
| 31 | Refactor | pass | 13/0 | `src/cli.ts` |
| 32 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 33 | Green | pass | 14/0 | `src/cli.ts` |
| 34 | Refactor | pass | 14/0 | `src/cli.ts` |
| 35 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 36 | Verify | pass | 15/0 | — |
| 37 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 38 | Verify | pass | 16/0 | — |
| 39 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 40 | Verify | pass | 17/0 | — |
| 41 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 42 | Green | pass | 18/0 | `src/cli.ts` |
| 43 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 44 | Verify | pass | 19/0 | — |
| 45 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 46 | Green | pass | 20/0 | `src/cli.ts` |
| 47 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 48 | Verify | pass | 21/0 | — |
| 49 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 50 | Verify | pass | 22/0 | — |
| 51 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 52 | Verify | pass | 23/0 | — |
| 53 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 54 | Verify | pass | 24/0 | — |
| 55 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 56 | Green | pass | 25/0 | `src/cli.ts` |
| 57 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 58 | Green | pass | 26/0 | `src/cli.ts` |
| 59 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 60 | Verify | pass | 27/0 | — |
| 61 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 62 | Green | pass | 28/0 | `src/cli.ts` |
| 63 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 64 | Verify | pass | 29/0 | — |
| 65 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 66 | Verify | pass | 30/0 | — |
| 67 | Refactor | pass | 30/0 | `src/cli.ts` |
| 68 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 69 | Verify | pass | 31/0 | — |
| 70 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 71 | Verify | pass | 32/0 | — |
| 72 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 73 | Verify | pass | 33/0 | — |
| 74 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 75 | Green | pass | 34/0 | `src/cli.ts` |
| 76 | Refactor | pass | 34/0 | `src/cli.ts` |
| 77 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 78 | Verify | pass | 35/0 | — |
| 79 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 80 | Verify | pass | 36/0 | — |
| 81 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 82 | Verify | pass | 37/0 | — |
| 83 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 84 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 85 | Verify | pass | 38/0 | — |
| 86 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 87 | Verify | pass | 39/0 | — |
| 88 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 89 | Verify | pass | 40/0 | — |
| 90 | Skip | pass | 1/0 | `src/claim-office.spec.ts` |
| 91 | Verify | pass | 41/0 | — |
| 92 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 93 | Green | pass | 42/0 | `src/cli.ts` |
| 94 | Refactor | pass | 42/0 | `src/cli.ts` |
| 95 | Verify | pass | 42/0 | — |

Final suite state: **pass**.

