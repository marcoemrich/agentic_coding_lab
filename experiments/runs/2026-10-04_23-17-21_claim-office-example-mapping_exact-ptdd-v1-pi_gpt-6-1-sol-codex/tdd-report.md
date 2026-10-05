# TDD phase chain — 2026-10-04_23-17-21_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-1-sol-codex

**132 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Refactor -> Red -> Green? -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Refactor -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Skip -> Verify -> Skip -> Verify
```

Deviations present: `Green?` ×1 (implementation changed, still failing), `Skip` ×24 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 132 |
| `cycles_total` | 51 |
| `cycles_closed` | 26 |
| `test_first_rate` | 0.52 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 23.5 |
| `refactor_events` | 19 |
| `skip_events` | 24 |
| `refactor_per_cycle` | 0.731 |
| `green_attempts` | 0.038 |
| `deviations` | 24 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.642 |
| `tdd_discipline_test_first` | 0.52 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.51 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (26 of 51 closed with a Green)

  1. `1–2`  Start -> Refactor  ← never closed
  2. `3–5`  Red -> Green -> Refactor
  3. `6–8`  Red -> Green -> Refactor
  4. `9–11`  Red -> Green -> Verify
  5. `12–14`  Red -> Green -> Verify
  6. `15–17`  Red -> Green -> Verify
  7. `18–20`  Red -> Green -> Verify
  8. `21–23`  Red -> Green -> Verify
  9. `24–25`  Skip -> Verify  ← never closed
 10. `26–29`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 11. `30–31`  Skip -> Verify  ← never closed
 12. `32–33`  Skip -> Verify  ← never closed
 13. `34–35`  Skip -> Verify  ← never closed
 14. `36–38`  Red -> Green -> Refactor
 15. `39–41`  Red -> Green -> Refactor
 16. `42–44`  Red -> Green -> Verify
 17. `45–47`  Red -> Green -> Refactor
 18. `48–49`  Skip -> Verify  ← never closed
 19. `50–52`  Red -> Green -> Refactor
 20. `53–54`  Skip -> Verify  ← never closed
 21. `55–56`  Skip -> Verify  ← never closed
 22. `57–58`  Skip -> Verify  ← never closed
 23. `59–60`  Skip -> Verify  ← never closed
 24. `61–64`  Red -> Green -> Refactor -> Refactor
 25. `65–68`  Red -> Green? -> Green -> Refactor
 26. `69–71`  Red -> Green -> Refactor
 27. `72–74`  Red -> Green -> Verify
 28. `75–77`  Red -> Green -> Verify
 29. `78–80`  Red -> Green -> Verify
 30. `81–83`  Red -> Green -> Verify
 31. `84–86`  Red -> Green -> Refactor
 32. `87–88`  Skip -> Verify  ← never closed
 33. `89–90`  Skip -> Verify  ← never closed
 34. `91–92`  Skip -> Verify  ← never closed
 35. `93–94`  Skip -> Refactor  ← never closed
 36. `95–96`  Skip -> Verify  ← never closed
 37. `97–98`  Skip -> Verify  ← never closed
 38. `99–101`  Red -> Green -> Refactor
 39. `102–103`  Skip -> Verify  ← never closed
 40. `104–105`  Skip -> Verify  ← never closed
 41. `106–107`  Skip -> Verify  ← never closed
 42. `108–110`  Red -> Green -> Refactor
 43. `111–113`  Red -> Green -> Verify
 44. `114–115`  Skip -> Verify  ← never closed
 45. `116–118`  Red -> Green -> Verify
 46. `119–121`  Red -> Green -> Refactor
 47. `122–123`  Skip -> Verify  ← never closed
 48. `124–125`  Skip -> Verify  ← never closed
 49. `126–128`  Red -> Green -> Refactor
 50. `129–130`  Skip -> Verify  ← never closed
 51. `131–132`  Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 35 | nothing changed, suite re-run |
| `Red` | 26 | a new failing test arrived |
| `Green` | 26 | implementation changed, suite went green |
| `Skip` | 24 | test arrived and passed immediately — never red |
| `Refactor` | 19 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Refactor | pass | 0/0 | `src/cli.ts` |
| 3 | Red | fail | 0/1 | `src/office.spec.ts` |
| 4 | Green | pass | 1/0 | `src/cli.ts` |
| 5 | Refactor | pass | 1/0 | `src/cli.ts`, `src/premium.ts` |
| 6 | Red | fail | 0/1 | `src/office.spec.ts` |
| 7 | Green | pass | 2/0 | `src/cli.ts`, `src/premium.ts` |
| 8 | Refactor | pass | 2/0 | `src/premium.ts` |
| 9 | Red | fail | 0/1 | `src/office.spec.ts` |
| 10 | Green | pass | 3/0 | `src/premium.ts` |
| 11 | Verify | pass | 3/0 | — |
| 12 | Red | fail | 0/1 | `src/office.spec.ts` |
| 13 | Green | pass | 4/0 | `src/premium.ts` |
| 14 | Verify | pass | 4/0 | — |
| 15 | Red | fail | 0/1 | `src/office.spec.ts` |
| 16 | Green | pass | 5/0 | `src/premium.ts` |
| 17 | Verify | pass | 5/0 | — |
| 18 | Red | fail | 0/1 | `src/office.spec.ts` |
| 19 | Green | pass | 6/0 | `src/premium.ts` |
| 20 | Verify | pass | 6/0 | — |
| 21 | Red | fail | 0/1 | `src/office.spec.ts` |
| 22 | Green | pass | 7/0 | `src/premium.ts` |
| 23 | Verify | pass | 7/0 | — |
| 24 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 25 | Verify | pass | 8/0 | — |
| 26 | Skip | pass | 0/0 | `src/office.spec.ts` |
| 27 | Verify | fail | 0/1 | — |
| 28 | Refactor | pass | 9/0 | `src/premium.ts` |
| 29 | Refactor | pass | 9/0 | `src/premium.ts` |
| 30 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 31 | Verify | pass | 10/0 | — |
| 32 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 33 | Verify | pass | 11/0 | — |
| 34 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 35 | Verify | pass | 12/0 | — |
| 36 | Red | fail | 0/1 | `src/office.spec.ts` |
| 37 | Green | pass | 13/0 | `src/premium.ts` |
| 38 | Refactor | pass | 13/0 | `src/premium.ts` |
| 39 | Red | fail | 0/1 | `src/office.spec.ts` |
| 40 | Green | pass | 14/0 | `src/premium.ts` |
| 41 | Refactor | pass | 14/0 | `src/premium.ts` |
| 42 | Red | fail | 0/1 | `src/office.spec.ts` |
| 43 | Green | pass | 15/0 | `src/premium.ts` |
| 44 | Verify | pass | 15/0 | — |
| 45 | Red | fail | 0/1 | `src/office.spec.ts` |
| 46 | Green | pass | 16/0 | `src/cli.ts`, `src/premium.ts` |
| 47 | Refactor | pass | 16/0 | `src/premium.ts` |
| 48 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 49 | Verify | pass | 17/0 | — |
| 50 | Red | fail | 0/1 | `src/office.spec.ts` |
| 51 | Green | pass | 18/0 | `src/premium.ts` |
| 52 | Refactor | pass | 18/0 | `src/premium.ts` |
| 53 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 54 | Verify | pass | 19/0 | — |
| 55 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 56 | Verify | pass | 20/0 | — |
| 57 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 58 | Verify | pass | 21/0 | — |
| 59 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 60 | Verify | pass | 22/0 | — |
| 61 | Red | fail | 0/1 | `src/office.spec.ts` |
| 62 | Green | pass | 23/0 | `src/cli.ts`, `src/premium.ts` |
| 63 | Refactor | pass | 23/0 | `src/cli.ts`, `src/scenario.ts` |
| 64 | Refactor | pass | 23/0 | `src/premium.ts` |
| 65 | Red | fail | 0/1 | `src/office.spec.ts` |
| 66 | Green? | fail | 0/1 | `src/scenario.ts` |
| 67 | Green | pass | 24/0 | `src/scenario.ts` |
| 68 | Refactor | pass | 24/0 | `src/claims.ts`, `src/scenario.ts` |
| 69 | Red | fail | 0/1 | `src/office.spec.ts` |
| 70 | Green | pass | 25/0 | `src/scenario.ts` |
| 71 | Refactor | pass | 25/0 | `src/claims.ts`, `src/policy.ts`, `src/scenario.ts` |
| 72 | Red | fail | 0/1 | `src/office.spec.ts` |
| 73 | Green | pass | 26/0 | `src/policy.ts` |
| 74 | Verify | pass | 26/0 | — |
| 75 | Red | fail | 0/1 | `src/office.spec.ts` |
| 76 | Green | pass | 27/0 | `src/policy.ts` |
| 77 | Verify | pass | 27/0 | — |
| 78 | Red | fail | 0/1 | `src/office.spec.ts` |
| 79 | Green | pass | 28/0 | `src/policy.ts` |
| 80 | Verify | pass | 28/0 | — |
| 81 | Red | fail | 0/1 | `src/office.spec.ts` |
| 82 | Green | pass | 29/0 | `src/policy.ts` |
| 83 | Verify | pass | 29/0 | — |
| 84 | Red | fail | 0/1 | `src/office.spec.ts` |
| 85 | Green | pass | 30/0 | `src/claims.ts` |
| 86 | Refactor | pass | 30/0 | `src/claims.ts` |
| 87 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 88 | Verify | pass | 31/0 | — |
| 89 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 90 | Verify | pass | 32/0 | — |
| 91 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 92 | Verify | pass | 33/0 | — |
| 93 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 94 | Refactor | pass | 34/0 | `src/claims.ts` |
| 95 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 96 | Verify | pass | 35/0 | — |
| 97 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 98 | Verify | pass | 36/0 | — |
| 99 | Red | fail | 0/1 | `src/office.spec.ts` |
| 100 | Green | pass | 37/0 | `src/claims.ts` |
| 101 | Refactor | pass | 37/0 | `src/claims.ts` |
| 102 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 103 | Verify | pass | 38/0 | — |
| 104 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 105 | Verify | pass | 39/0 | — |
| 106 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 107 | Verify | pass | 40/0 | — |
| 108 | Red | fail | 0/1 | `src/office.spec.ts` |
| 109 | Green | pass | 41/0 | `src/claims.ts` |
| 110 | Refactor | pass | 41/0 | `src/claims.ts`, `src/policy.ts` |
| 111 | Red | fail | 0/1 | `src/office.spec.ts` |
| 112 | Green | pass | 42/0 | `src/policy.ts` |
| 113 | Verify | pass | 42/0 | — |
| 114 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 115 | Verify | pass | 43/0 | — |
| 116 | Red | fail | 0/1 | `src/office.spec.ts` |
| 117 | Green | pass | 44/0 | `src/claims.ts` |
| 118 | Verify | pass | 44/0 | — |
| 119 | Red | fail | 0/1 | `src/office.spec.ts` |
| 120 | Green | pass | 45/0 | `src/premium.ts` |
| 121 | Refactor | pass | 45/0 | `src/premium.ts` |
| 122 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 123 | Verify | pass | 46/0 | — |
| 124 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 125 | Verify | pass | 47/0 | — |
| 126 | Red | fail | 0/1 | `src/office.spec.ts` |
| 127 | Green | pass | 48/0 | `src/claims.ts` |
| 128 | Refactor | pass | 48/0 | `src/claims.ts` |
| 129 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 130 | Verify | pass | 49/0 | — |
| 131 | Skip | pass | 1/0 | `src/office.spec.ts` |
| 132 | Verify | pass | 50/0 | — |

Final suite state: **pass**.

