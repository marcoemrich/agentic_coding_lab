# TDD phase chain — 2026-10-01_01-07-05_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-5-no-thinking

**102 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Red(c) -> Red -> Verify -> Green -> Refactor -> Red -> Green? -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Verify -> Refactor -> Skip -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Verify -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Verify
```

Deviations present: `Green?` ×1 (implementation changed, still failing), `Skip` ×18 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 102 |
| `cycles_total` | 42 |
| `cycles_closed` | 24 |
| `test_first_rate` | 0.581 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 1 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 24 |
| `skip_events` | 18 |
| `refactor_per_cycle` | 1.0 |
| `green_attempts` | 0.042 |
| `deviations` | 18 |
| `opens_red` | True |
| `ends_green` | True |
| `tdd_discipline` | 0.693 |
| `tdd_discipline_test_first` | 0.581 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.571 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (24 of 42 closed with a Green)

  1. `1–5`  Red(c) -> Red -> Verify -> Green -> Refactor
  2. `6–9`  Red -> Green? -> Green -> Refactor
  3. `10–12`  Red -> Green -> Refactor
  4. `13–15`  Red -> Green -> Refactor
  5. `16–18`  Red -> Green -> Refactor
  6. `19–21`  Red -> Green -> Refactor
  7. `22–22`  Skip  ← never closed
  8. `23–25`  Red -> Green -> Refactor
  9. `26–26`  Skip  ← never closed
 10. `27–27`  Skip  ← never closed
 11. `28–31`  Red -> Green -> Verify -> Refactor
 12. `32–34`  Red -> Green -> Refactor
 13. `35–38`  Red -> Green -> Verify -> Refactor
 14. `39–41`  Red -> Green -> Refactor
 15. `42–42`  Skip  ← never closed
 16. `43–43`  Skip  ← never closed
 17. `44–46`  Red -> Green -> Refactor
 18. `47–47`  Skip  ← never closed
 19. `48–48`  Skip  ← never closed
 20. `49–51`  Red -> Green -> Refactor
 21. `52–52`  Skip  ← never closed
 22. `53–56`  Red -> Green -> Verify -> Refactor
 23. `57–57`  Skip  ← never closed
 24. `58–60`  Red -> Green -> Refactor
 25. `61–61`  Skip  ← never closed
 26. `62–65`  Red -> Green -> Verify -> Refactor
 27. `66–68`  Red -> Green -> Refactor
 28. `69–69`  Skip  ← never closed
 29. `70–70`  Skip  ← never closed
 30. `71–71`  Skip  ← never closed
 31. `72–75`  Red -> Verify -> Green -> Refactor
 32. `76–76`  Skip  ← never closed
 33. `77–77`  Skip  ← never closed
 34. `78–78`  Skip  ← never closed
 35. `79–79`  Skip  ← never closed
 36. `80–83`  Red -> Green -> Verify -> Refactor
 37. `84–86`  Red -> Green -> Refactor
 38. `87–87`  Skip  ← never closed
 39. `88–90`  Red -> Green -> Refactor
 40. `91–93`  Red -> Green -> Refactor
 41. `94–97`  Red -> Green -> Refactor -> Verify
 42. `98–102`  Red -> Green -> Verify -> Refactor -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 24 | a new failing test arrived |
| `Green` | 24 | implementation changed, suite went green |
| `Refactor` | 24 | implementation changed, suite stayed green |
| `Skip` | 18 | test arrived and passed immediately — never red |
| `Verify` | 10 | nothing changed, suite re-run |
| `Red(c)` | 1 | test arrived, suite does not compile yet |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Red(c) | fail (1 collect err) | 0/0 | _(initial tree: 1 files)_ |
| 2 | Red | fail | 0/1 | `src/claim-office.ts` |
| 3 | Verify | fail | 0/1 | — |
| 4 | Green | pass | 1/0 | `src/claim-office.ts` |
| 5 | Refactor | pass | 1/0 | `src/claim-office.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green? | fail | 1/1 | `src/claim-office.ts` |
| 8 | Green | pass | 2/0 | `src/claim-office.ts` |
| 9 | Refactor | pass | 2/0 | `src/claim-office.ts` |
| 10 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 3/0 | `src/claim-office.ts` |
| 12 | Refactor | pass | 3/0 | `src/claim-office.ts` |
| 13 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 14 | Green | pass | 4/0 | `src/claim-office.ts` |
| 15 | Refactor | pass | 4/0 | `src/claim-office.ts` |
| 16 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 5/0 | `src/claim-office.ts` |
| 18 | Refactor | pass | 5/0 | `src/claim-office.ts` |
| 19 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 20 | Green | pass | 6/0 | `src/claim-office.ts` |
| 21 | Refactor | pass | 6/0 | `src/claim-office.ts` |
| 22 | Skip | pass | 7/0 | `src/claim-office.spec.ts` |
| 23 | Red | fail | 7/1 | `src/claim-office.spec.ts` |
| 24 | Green | pass | 8/0 | `src/claim-office.ts` |
| 25 | Refactor | pass | 8/0 | `src/claim-office.ts` |
| 26 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 27 | Skip | pass | 10/0 | `src/claim-office.spec.ts` |
| 28 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 29 | Green | pass | 11/0 | `src/claim-office.ts` |
| 30 | Verify | pass | 11/0 | — |
| 31 | Refactor | pass | 11/0 | `src/claim-office.ts` |
| 32 | Red | fail | 11/1 | `src/claim-office.spec.ts` |
| 33 | Green | pass | 12/0 | `src/claim-office.ts` |
| 34 | Refactor | pass | 12/0 | `src/claim-office.ts` |
| 35 | Red | fail | 12/1 | `src/claim-office.spec.ts` |
| 36 | Green | pass | 13/0 | `src/claim-office.ts` |
| 37 | Verify | pass | 13/0 | — |
| 38 | Refactor | pass | 13/0 | `src/claim-office.ts` |
| 39 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 40 | Green | pass | 14/0 | `src/claim-office.ts` |
| 41 | Refactor | pass | 14/0 | `src/claim-office.ts` |
| 42 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 43 | Skip | pass | 16/0 | `src/claim-office.spec.ts` |
| 44 | Red | fail | 16/1 | `src/claim-office.spec.ts` |
| 45 | Green | pass | 17/0 | `src/claim-office.ts` |
| 46 | Refactor | pass | 17/0 | `src/claim-office.ts` |
| 47 | Skip | pass | 18/0 | `src/claim-office.spec.ts` |
| 48 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 49 | Red | fail | 19/1 | `src/claim-office.spec.ts` |
| 50 | Green | pass | 20/0 | `src/claim-office.ts` |
| 51 | Refactor | pass | 20/0 | `src/claim-office.ts` |
| 52 | Skip | pass | 21/0 | `src/claim-office.spec.ts` |
| 53 | Red | fail | 21/1 | `src/claim-office.spec.ts` |
| 54 | Green | pass | 22/0 | `src/claim-office.ts` |
| 55 | Verify | pass | 22/0 | — |
| 56 | Refactor | pass | 22/0 | `src/claim-office.ts` |
| 57 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 58 | Red | fail | 23/1 | `src/claim-office.spec.ts` |
| 59 | Green | pass | 24/0 | `src/claim-office.ts` |
| 60 | Refactor | pass | 24/0 | `src/claim-office.ts` |
| 61 | Skip | pass | 25/0 | `src/claim-office.spec.ts` |
| 62 | Red | fail | 25/1 | `src/claim-office.spec.ts` |
| 63 | Green | pass | 26/0 | `src/claim-office.ts` |
| 64 | Verify | pass | 26/0 | — |
| 65 | Refactor | pass | 26/0 | `src/claim-office.ts` |
| 66 | Red | fail | 26/1 | `src/claim-office.spec.ts` |
| 67 | Green | pass | 27/0 | `src/claim-office.ts` |
| 68 | Refactor | pass | 27/0 | `src/claim-office.ts` |
| 69 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 70 | Skip | pass | 29/0 | `src/claim-office.spec.ts` |
| 71 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 72 | Red | fail | 30/1 | `src/claim-office.spec.ts` |
| 73 | Verify | fail | 30/1 | — |
| 74 | Green | pass | 31/0 | `src/claim-office.ts` |
| 75 | Refactor | pass | 31/0 | `src/claim-office.ts` |
| 76 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 77 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 78 | Skip | pass | 34/0 | `src/claim-office.spec.ts` |
| 79 | Skip | pass | 35/0 | `src/claim-office.spec.ts` |
| 80 | Red | fail | 35/1 | `src/claim-office.spec.ts` |
| 81 | Green | pass | 36/0 | `src/claim-office.ts` |
| 82 | Verify | pass | 36/0 | — |
| 83 | Refactor | pass | 36/0 | `src/claim-office.ts` |
| 84 | Red | fail | 36/1 | `src/claim-office.spec.ts` |
| 85 | Green | pass | 37/0 | `src/claim-office.ts` |
| 86 | Refactor | pass | 37/0 | `src/claim-office.ts` |
| 87 | Skip | pass | 38/0 | `src/claim-office.spec.ts` |
| 88 | Red | fail | 38/1 | `src/claim-office.spec.ts` |
| 89 | Green | pass | 39/0 | `src/claim-office.ts` |
| 90 | Refactor | pass | 39/0 | `src/claim-office.ts` |
| 91 | Red | fail | 39/1 | `src/claim-office.spec.ts` |
| 92 | Green | pass | 40/0 | `src/claim-office.ts` |
| 93 | Refactor | pass | 40/0 | `src/claim-office.ts` |
| 94 | Red | fail | 40/1 | `src/claim-office.spec.ts` |
| 95 | Green | pass | 41/0 | `src/cli.ts` |
| 96 | Refactor | pass | 41/0 | `src/cli.ts` |
| 97 | Verify | pass | 41/0 | — |
| 98 | Red | fail | 41/1 | `src/claim-office.spec.ts` |
| 99 | Green | pass | 42/0 | `src/cli.ts` |
| 100 | Verify | pass | 42/0 | — |
| 101 | Refactor | pass | 42/0 | `src/claim-office.ts` |
| 102 | Verify | pass | 42/0 | — |

Final suite state: **pass**.

