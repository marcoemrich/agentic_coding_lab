# TDD phase chain — 2026-10-23_03-57-25_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

**128 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Drop -> Verify -> Drop -> Verify -> Red -> Green -> Refactor -> Drop -> Verify -> Drop -> Verify -> Drop -> Verify -> Drop -> Red -> Green -> Verify -> Red -> Green -> Refactor -> Drop -> Verify -> Red -> Green -> Verify -> Drop -> Verify -> Red -> Green -> Red -> Green -> Break -> Green -> Red -> Green -> Verify -> Drop -> Verify -> Drop -> Verify -> Drop -> Verify -> Drop -> Verify -> Red -> Green -> Refactor -> Drop -> Red(c) -> Red -> Green -> Verify -> Drop -> Verify -> Red -> Green -> Refactor -> Verify -> Skip -> Verify -> Red -> Green -> Refactor -> Drop -> Verify -> Drop -> Verify -> Drop -> Verify -> Red -> Green -> Red -> Green -> Refactor -> Refactor -> Drop -> Verify -> Drop -> Verify -> Drop -> Red -> Green -> Verify -> Drop -> Red -> Green -> Verify -> Drop -> Verify -> Red -> Verify -> Skip -> Verify -> Drop -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Drop -> Red -> Green -> Red -> Green -> Verify
```

Deviations present: `Break` ×1 (implementation change broke a green suite), `Drop` ×24 (tests were removed), `Skip` ×2 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 128 |
| `cycles_total` | 28 |
| `cycles_closed` | 25 |
| `test_first_rate` | 0.933 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 2 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 8 |
| `skip_events` | 2 |
| `refactor_per_cycle` | 0.32 |
| `green_attempts` | 0.0 |
| `deviations` | 27 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.941 |
| `tdd_discipline_test_first` | 0.933 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.893 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (25 of 28 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Red(c) -> Red -> Green -> Verify
  3. `6–8`  Red -> Green -> Refactor
  4. `9–11`  Red -> Green -> Verify
  5. `12–14`  Red -> Green -> Verify
  6. `15–17`  Red -> Green -> Verify
  7. `18–24`  Red -> Green -> Verify -> Drop -> Verify -> Drop -> Verify
  8. `25–34`  Red -> Green -> Refactor -> Drop -> Verify -> Drop -> Verify -> Drop -> Verify -> Drop
  9. `35–37`  Red -> Green -> Verify
 10. `38–42`  Red -> Green -> Refactor -> Drop -> Verify
 11. `43–47`  Red -> Green -> Verify -> Drop -> Verify
 12. `48–49`  Red -> Green
 13. `50–53`  Red -> Green -> Break -> Green
 14. `54–64`  Red -> Green -> Verify -> Drop -> Verify -> Drop -> Verify -> Drop -> Verify -> Drop -> Verify
 15. `65–68`  Red -> Green -> Refactor -> Drop
 16. `69–74`  Red(c) -> Red -> Green -> Verify -> Drop -> Verify
 17. `75–78`  Red -> Green -> Refactor -> Verify
 18. `79–80`  Skip -> Verify  ← never closed
 19. `81–89`  Red -> Green -> Refactor -> Drop -> Verify -> Drop -> Verify -> Drop -> Verify
 20. `90–91`  Red -> Green
 21. `92–100`  Red -> Green -> Refactor -> Refactor -> Drop -> Verify -> Drop -> Verify -> Drop
 22. `101–104`  Red -> Green -> Verify -> Drop
 23. `105–110`  Red -> Green -> Verify -> Verify -> Drop -> Verify
 24. `111–116`  Red -> Verify -> Skip -> Verify -> Drop -> Verify  ← never closed
 25. `117–119`  Red -> Green -> Verify
 26. `120–123`  Red -> Green -> Verify -> Drop
 27. `124–125`  Red -> Green
 28. `126–128`  Red -> Green -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 38 | nothing changed, suite re-run |
| `Red` | 26 | a new failing test arrived |
| `Green` | 26 | implementation changed, suite went green |
| `Drop` | 24 | tests were removed |
| `Refactor` | 8 | implementation changed, suite stayed green |
| `Red(c)` | 2 | test arrived, suite does not compile yet |
| `Skip` | 2 | test arrived and passed immediately — never red |
| `Start` | 1 | first invocation |
| `Break` | 1 | implementation change broke a green suite |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 3 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/premium.spec.ts` |
| 3 | Red | fail | 0/1 | `src/premium.ts` |
| 4 | Green | pass | 1/0 | `src/premium.ts` |
| 5 | Verify | pass | 1/0 | — |
| 6 | Red | fail | 1/1 | `src/premium.spec.ts` |
| 7 | Green | pass | 2/0 | `src/premium.ts` |
| 8 | Refactor | pass | 2/0 | `src/premium.ts` |
| 9 | Red | fail | 2/1 | `src/premium.spec.ts` |
| 10 | Green | pass | 3/0 | `src/premium.ts` |
| 11 | Verify | pass | 3/0 | — |
| 12 | Red | fail | 3/1 | `src/premium.spec.ts` |
| 13 | Green | pass | 4/0 | `src/premium.ts` |
| 14 | Verify | pass | 4/0 | — |
| 15 | Red | fail | 4/1 | `src/premium.spec.ts` |
| 16 | Green | pass | 5/0 | `src/premium.ts` |
| 17 | Verify | pass | 5/0 | — |
| 18 | Red | fail | 5/1 | `src/premium.spec.ts` |
| 19 | Green | pass | 6/0 | `src/premium.ts` |
| 20 | Verify | pass | 6/0 | — |
| 21 | Drop | pass | 7/0 | `src/premium.spec.ts` |
| 22 | Verify | pass | 7/0 | — |
| 23 | Drop | pass | 8/0 | `src/premium.spec.ts` |
| 24 | Verify | pass | 8/0 | — |
| 25 | Red | fail | 8/1 | `src/premium.spec.ts` |
| 26 | Green | pass | 9/0 | `src/premium.ts` |
| 27 | Refactor | pass | 9/0 | `src/premium.ts` |
| 28 | Drop | pass | 10/0 | `src/premium.spec.ts` |
| 29 | Verify | pass | 10/0 | — |
| 30 | Drop | pass | 11/0 | `src/premium.spec.ts` |
| 31 | Verify | pass | 11/0 | — |
| 32 | Drop | pass | 12/0 | `src/premium.spec.ts` |
| 33 | Verify | pass | 12/0 | — |
| 34 | Drop | pass | 13/0 | `src/premium.spec.ts` |
| 35 | Red | fail | 13/1 | `src/premium.spec.ts` |
| 36 | Green | pass | 14/0 | `src/premium.ts` |
| 37 | Verify | pass | 14/0 | — |
| 38 | Red | fail | 14/1 | `src/premium.spec.ts` |
| 39 | Green | pass | 15/0 | `src/premium.ts` |
| 40 | Refactor | pass | 15/0 | `src/premium.ts` |
| 41 | Drop | pass | 16/0 | `src/premium.spec.ts` |
| 42 | Verify | pass | 16/0 | — |
| 43 | Red | fail | 16/1 | `src/premium.spec.ts` |
| 44 | Green | pass | 17/0 | `src/premium.ts` |
| 45 | Verify | pass | 17/0 | — |
| 46 | Drop | pass | 18/0 | `src/premium.spec.ts` |
| 47 | Verify | pass | 18/0 | — |
| 48 | Red | fail | 18/1 | `src/premium.spec.ts` |
| 49 | Green | pass | 19/0 | `src/premium.ts` |
| 50 | Red | fail | 19/1 | `src/premium.spec.ts` |
| 51 | Green | pass | 20/0 | `src/premium.ts` |
| 52 | Break | fail | 18/2 | `src/premium.ts` |
| 53 | Green | pass | 20/0 | `src/premium.ts` |
| 54 | Red | fail | 20/1 | `src/premium.spec.ts` |
| 55 | Green | pass | 21/0 | `src/premium.ts` |
| 56 | Verify | pass | 21/0 | — |
| 57 | Drop | pass | 22/0 | `src/premium.spec.ts` |
| 58 | Verify | pass | 22/0 | — |
| 59 | Drop | pass | 23/0 | `src/premium.spec.ts` |
| 60 | Verify | pass | 23/0 | — |
| 61 | Drop | pass | 24/0 | `src/premium.spec.ts` |
| 62 | Verify | pass | 24/0 | — |
| 63 | Drop | pass | 25/0 | `src/premium.spec.ts` |
| 64 | Verify | pass | 25/0 | — |
| 65 | Red | fail | 25/1 | `src/premium.spec.ts` |
| 66 | Green | pass | 26/0 | `src/premium.ts` |
| 67 | Refactor | pass | 26/0 | `src/premium.ts` |
| 68 | Drop | pass | 27/0 | `src/premium.spec.ts` |
| 69 | Red(c) | fail (1 collect err) | 0/0 | `src/claim.spec.ts` |
| 70 | Red | fail | 0/1 | `src/claim.ts` |
| 71 | Green | pass | 1/0 | `src/claim.ts` |
| 72 | Verify | pass | 28/0 | — |
| 73 | Drop | pass | 2/0 | `src/claim.spec.ts` |
| 74 | Verify | pass | 29/0 | — |
| 75 | Red | fail | 2/1 | `src/claim.spec.ts` |
| 76 | Green | pass | 3/0 | `src/claim.ts` |
| 77 | Refactor | pass | 30/0 | `src/claim.ts` |
| 78 | Verify | pass | 3/0 | — |
| 79 | Skip | pass | 4/0 | `src/claim.spec.ts` |
| 80 | Verify | pass | 31/0 | — |
| 81 | Red | fail | 4/1 | `src/claim.spec.ts` |
| 82 | Green | pass | 5/0 | `src/claim.ts` |
| 83 | Refactor | pass | 32/0 | `src/claim.ts` |
| 84 | Drop | pass | 6/0 | `src/claim.spec.ts` |
| 85 | Verify | pass | 33/0 | — |
| 86 | Drop | pass | 7/0 | `src/claim.spec.ts` |
| 87 | Verify | pass | 34/0 | — |
| 88 | Drop | pass | 8/0 | `src/claim.spec.ts` |
| 89 | Verify | pass | 35/0 | — |
| 90 | Red | fail | 8/1 | `src/claim.spec.ts` |
| 91 | Green | pass | 9/0 | `src/claim.ts` |
| 92 | Red | fail | 9/1 | `src/claim.spec.ts` |
| 93 | Green | pass | 10/0 | `src/claim.ts` |
| 94 | Refactor | pass | 37/0 | `src/premium.ts`, `src/priceList.ts` |
| 95 | Refactor | pass | 37/0 | `src/claim.ts` |
| 96 | Drop | pass | 11/0 | `src/claim.spec.ts` |
| 97 | Verify | pass | 38/0 | — |
| 98 | Drop | pass | 12/0 | `src/claim.spec.ts` |
| 99 | Verify | pass | 39/0 | — |
| 100 | Drop | pass | 13/0 | `src/claim.spec.ts` |
| 101 | Red | fail | 13/1 | `src/claim.spec.ts` |
| 102 | Green | pass | 14/0 | `src/claim.ts` |
| 103 | Verify | pass | 41/0 | — |
| 104 | Drop | pass | 15/0 | `src/claim.spec.ts` |
| 105 | Red | fail | 0/1 | `src/cli.spec.ts` |
| 106 | Green | pass | 1/0 | `src/cli.ts`, `src/scenario.ts` |
| 107 | Verify | pass | 43/0 | — |
| 108 | Verify | pass | 43/0 | — |
| 109 | Drop | pass | 2/0 | `src/cli.spec.ts` |
| 110 | Verify | pass | 44/0 | — |
| 111 | Red | fail | 2/1 | `src/cli.spec.ts` |
| 112 | Verify | fail | 2/1 | — |
| 113 | Skip | pass | 3/0 | `src/cli.spec.ts` |
| 114 | Verify | pass | 45/0 | — |
| 115 | Drop | pass | 4/0 | `src/cli.spec.ts` |
| 116 | Verify | pass | 46/0 | — |
| 117 | Red | fail | 4/1 | `src/cli.spec.ts` |
| 118 | Green | pass | 5/0 | `src/priceList.ts`, `src/scenario.ts` |
| 119 | Verify | pass | 47/0 | — |
| 120 | Red | fail | 5/1 | `src/cli.spec.ts` |
| 121 | Green | pass | 6/0 | `src/claim.ts` |
| 122 | Verify | pass | 48/0 | — |
| 123 | Drop | pass | 7/0 | `src/cli.spec.ts` |
| 124 | Red | fail | 7/1 | `src/cli.spec.ts` |
| 125 | Green | pass | 8/0 | `src/claim.ts` |
| 126 | Red | fail | 8/1 | `src/cli.spec.ts` |
| 127 | Green | pass | 51/0 | `src/claim.ts` |
| 128 | Verify | pass | 51/0 | — |

Final suite state: **pass**.

