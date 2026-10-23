# TDD phase chain — 2026-10-23_03-50-59_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

**130 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Green -> Verify -> Refactor -> Red -> Green? -> Verify -> Green -> Verify -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Red -> Verify -> Green -> Verify -> Red -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Verify -> Green -> Verify -> Red -> Green? -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify
```

Deviations present: `Green?` ×2 (implementation changed, still failing), `Skip` ×25 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 130 |
| `cycles_total` | 44 |
| `cycles_closed` | 19 |
| `test_first_rate` | 0.468 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 7 |
| `skip_events` | 25 |
| `refactor_per_cycle` | 0.368 |
| `green_attempts` | 0.105 |
| `deviations` | 25 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.587 |
| `tdd_discipline_test_first` | 0.468 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.432 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (19 of 44 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Red(c) -> Green -> Verify -> Refactor
  3. `6–12`  Red -> Green? -> Verify -> Verify -> Green -> Verify -> Refactor
  4. `13–15`  Red -> Green -> Verify
  5. `16–18`  Red -> Green -> Verify
  6. `19–21`  Red -> Green -> Verify
  7. `22–24`  Red -> Green -> Verify
  8. `25–27`  Red -> Green -> Verify
  9. `28–29`  Skip -> Verify  ← never closed
 10. `30–33`  Red -> Green -> Verify -> Refactor
 11. `34–35`  Skip -> Verify  ← never closed
 12. `36–37`  Skip -> Verify  ← never closed
 13. `38–39`  Skip -> Verify  ← never closed
 14. `40–41`  Skip -> Verify  ← never closed
 15. `42–45`  Red -> Green -> Verify -> Refactor
 16. `46–48`  Red -> Green -> Verify
 17. `49–50`  Skip -> Verify  ← never closed
 18. `51–52`  Skip -> Verify  ← never closed
 19. `53–54`  Skip -> Verify  ← never closed
 20. `55–56`  Skip -> Verify  ← never closed
 21. `57–59`  Red -> Green -> Verify
 22. `60–61`  Skip -> Verify  ← never closed
 23. `62–66`  Red -> Green -> Verify -> Refactor -> Refactor
 24. `67–68`  Skip -> Verify  ← never closed
 25. `69–72`  Red -> Green -> Verify -> Refactor
 26. `73–74`  Skip -> Verify  ← never closed
 27. `75–79`  Red -> Verify -> Verify -> Green -> Verify
 28. `80–83`  Red -> Verify -> Skip -> Verify  ← never closed
 29. `84–85`  Skip -> Verify  ← never closed
 30. `86–89`  Red -> Verify -> Skip -> Verify  ← never closed
 31. `90–91`  Skip -> Verify  ← never closed
 32. `92–93`  Skip -> Verify  ← never closed
 33. `94–95`  Skip -> Verify  ← never closed
 34. `96–97`  Skip -> Verify  ← never closed
 35. `98–99`  Skip -> Verify  ← never closed
 36. `100–101`  Skip -> Verify  ← never closed
 37. `102–103`  Skip -> Verify  ← never closed
 38. `104–107`  Red -> Verify -> Green -> Verify
 39. `108–115`  Red -> Green? -> Verify -> Verify -> Skip -> Verify -> Skip -> Verify  ← never closed
 40. `116–118`  Red -> Green -> Verify
 41. `119–121`  Red -> Green -> Verify
 42. `122–123`  Skip -> Verify  ← never closed
 43. `124–126`  Red -> Green -> Verify
 44. `127–130`  Red -> Green -> Verify -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 54 | nothing changed, suite re-run |
| `Skip` | 25 | test arrived and passed immediately — never red |
| `Red` | 21 | a new failing test arrived |
| `Green` | 19 | implementation changed, suite went green |
| `Refactor` | 7 | implementation changed, suite stayed green |
| `Green?` | 2 | implementation changed, still failing |
| `Start` | 1 | first invocation |
| `Red(c)` | 1 | test arrived, suite does not compile yet |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/claim-office.spec.ts` |
| 3 | Green | pass | 1/0 | `src/claim-office.ts` |
| 4 | Verify | pass | 1/0 | — |
| 5 | Refactor | pass | 1/0 | `src/claim-office.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green? | fail | 1/1 | `src/claim-office.ts` |
| 8 | Verify | fail | 1/1 | — |
| 9 | Verify | fail | 1/1 | — |
| 10 | Green | pass | 2/0 | `src/claim-office.ts` |
| 11 | Verify | pass | 2/0 | — |
| 12 | Refactor | pass | 2/0 | `src/claim-office.ts` |
| 13 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 3/0 | `src/claim-office.ts` |
| 15 | Verify | pass | 3/0 | — |
| 16 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 4/0 | `src/claim-office.ts` |
| 18 | Verify | pass | 4/0 | — |
| 19 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 5/0 | `src/claim-office.ts` |
| 21 | Verify | pass | 5/0 | — |
| 22 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 23 | Green | pass | 6/0 | `src/claim-office.ts` |
| 24 | Verify | pass | 6/0 | — |
| 25 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 26 | Green | pass | 7/0 | `src/claim-office.ts` |
| 27 | Verify | pass | 7/0 | — |
| 28 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 29 | Verify | pass | 8/0 | — |
| 30 | Red | fail | 8/1 | `src/claim-office.spec.ts` |
| 31 | Green | pass | 9/0 | `src/claim-office.ts` |
| 32 | Verify | pass | 9/0 | — |
| 33 | Refactor | pass | 9/0 | `src/claim-office.ts` |
| 34 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 35 | Verify | pass | 10/0 | — |
| 36 | Skip | pass | 11/0 | `src/claim-office.spec.ts` |
| 37 | Verify | pass | 11/0 | — |
| 38 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 39 | Verify | pass | 12/0 | — |
| 40 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 41 | Verify | pass | 13/0 | — |
| 42 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 43 | Green | pass | 14/0 | `src/claim-office.ts` |
| 44 | Verify | pass | 14/0 | — |
| 45 | Refactor | pass | 14/0 | `src/claim-office.ts` |
| 46 | Red | fail | 14/1 | `src/claim-office.spec.ts` |
| 47 | Green | pass | 15/0 | `src/claim-office.ts` |
| 48 | Verify | pass | 15/0 | — |
| 49 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 50 | Verify | pass | 16/0 | — |
| 51 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 52 | Verify | pass | 17/0 | — |
| 53 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 54 | Verify | pass | 18/0 | — |
| 55 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 56 | Verify | pass | 19/0 | — |
| 57 | Red | fail | 19/1 | `src/claim-office.spec.ts` |
| 58 | Green | pass | 20/0 | `src/claim-office.ts` |
| 59 | Verify | pass | 20/0 | — |
| 60 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 61 | Verify | pass | 21/0 | — |
| 62 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 63 | Green | pass | 22/0 | `src/claim-office.ts` |
| 64 | Verify | pass | 22/0 | — |
| 65 | Refactor | pass | 22/0 | `src/claim-office.ts` |
| 66 | Refactor | pass | 22/0 | `src/claim-office.ts` |
| 67 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 68 | Verify | pass | 23/0 | — |
| 69 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 70 | Green | pass | 24/0 | `src/claim-office.ts` |
| 71 | Verify | pass | 24/0 | — |
| 72 | Refactor | pass | 24/0 | `src/claim-office.ts` |
| 73 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 74 | Verify | pass | 25/0 | — |
| 75 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 76 | Verify | fail | 25/1 | — |
| 77 | Verify | fail | 25/1 | — |
| 78 | Green | pass | 26/0 | `src/claim-office.ts` |
| 79 | Verify | pass | 26/0 | — |
| 80 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 81 | Verify | fail | 26/1 | — |
| 82 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 83 | Verify | pass | 27/0 | — |
| 84 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 85 | Verify | pass | 28/0 | — |
| 86 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 87 | Verify | fail | 28/1 | — |
| 88 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 89 | Verify | pass | 29/0 | — |
| 90 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 91 | Verify | pass | 30/0 | — |
| 92 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 93 | Verify | pass | 31/0 | — |
| 94 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 95 | Verify | pass | 32/0 | — |
| 96 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 97 | Verify | pass | 33/0 | — |
| 98 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 99 | Verify | pass | 34/0 | — |
| 100 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 101 | Verify | pass | 35/0 | — |
| 102 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 103 | Verify | pass | 36/0 | — |
| 104 | Red | fail | 36/1 | `src/claim-office.spec.ts` |
| 105 | Verify | fail | 36/1 | — |
| 106 | Green | pass | 37/0 | `src/claim-office.ts` |
| 107 | Verify | pass | 37/0 | — |
| 108 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 109 | Green? | fail | 37/1 | `src/cli.ts` |
| 110 | Verify | fail | 37/1 | — |
| 111 | Verify | fail | 37/1 | — |
| 112 | Skip | fail | 37/1 | `src/claim-office.spec.ts` |
| 113 | Verify | fail | 37/1 | — |
| 114 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 115 | Verify | pass | 38/0 | — |
| 116 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 117 | Green | pass | 39/0 | `src/claim-office.ts` |
| 118 | Verify | pass | 39/0 | — |
| 119 | Red | fail | 39/1 | `src/claim-office.spec.ts` |
| 120 | Green | pass | 40/0 | `src/claim-office.ts` |
| 121 | Verify | pass | 40/0 | — |
| 122 | Skip | pass | 41/0 | `src/claim-office.spec.ts` |
| 123 | Verify | pass | 41/0 | — |
| 124 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 125 | Green | pass | 42/0 | `src/claim-office.ts` |
| 126 | Verify | pass | 42/0 | — |
| 127 | Red | fail | 42/1 | `src/claim-office.spec.ts` |
| 128 | Green | pass | 43/0 | `src/claim-office.ts` |
| 129 | Verify | pass | 43/0 | — |
| 130 | Verify | pass | 43/0 | — |

Final suite state: **pass**.

