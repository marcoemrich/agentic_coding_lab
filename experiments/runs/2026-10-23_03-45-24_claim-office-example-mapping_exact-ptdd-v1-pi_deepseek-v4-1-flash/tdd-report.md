# TDD phase chain — 2026-10-23_03-45-24_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

**89 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Red(c) -> Red -> Verify -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red(c) -> Red -> Green -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Red(c) -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Red(c) -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Red(c) -> Verify -> Red -> Green -> Verify -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Verify -> Red -> Skip -> Verify -> Break -> Verify -> Skip -> Verify
```

Deviations present: `Break` ×1 (implementation change broke a green suite), `Skip` ×21 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 89 |
| `cycles_total` | 46 |
| `cycles_closed` | 25 |
| `test_first_rate` | 0.596 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 5 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 3 |
| `skip_events` | 21 |
| `refactor_per_cycle` | 0.12 |
| `green_attempts` | 0.0 |
| `deviations` | 22 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.687 |
| `tdd_discipline_test_first` | 0.596 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.543 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (25 of 46 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Red(c) -> Red -> Verify -> Green
  3. `6–7`  Red -> Green
  4. `8–9`  Red -> Green
  5. `10–11`  Red -> Green
  6. `12–13`  Red -> Green
  7. `14–15`  Red -> Green
  8. `16–18`  Red(c) -> Red -> Green
  9. `19–21`  Red -> Green -> Refactor
 10. `22–22`  Skip  ← never closed
 11. `23–23`  Skip  ← never closed
 12. `24–24`  Skip  ← never closed
 13. `25–25`  Skip  ← never closed
 14. `26–27`  Red -> Green
 15. `28–29`  Red -> Green
 16. `30–31`  Red -> Green
 17. `32–33`  Red -> Green
 18. `34–34`  Skip  ← never closed
 19. `35–35`  Skip  ← never closed
 20. `36–37`  Red -> Green
 21. `38–38`  Skip  ← never closed
 22. `39–39`  Skip  ← never closed
 23. `40–41`  Red -> Green
 24. `42–44`  Red -> Green -> Refactor
 25. `45–47`  Red(c) -> Red -> Green
 26. `48–48`  Skip  ← never closed
 27. `49–49`  Skip  ← never closed
 28. `50–51`  Red -> Green
 29. `52–52`  Skip  ← never closed
 30. `53–53`  Skip  ← never closed
 31. `54–55`  Red -> Green
 32. `56–56`  Skip  ← never closed
 33. `57–58`  Red -> Green
 34. `59–61`  Red(c) -> Red -> Green
 35. `62–62`  Skip  ← never closed
 36. `63–63`  Skip  ← never closed
 37. `64–64`  Skip  ← never closed
 38. `65–66`  Red -> Green
 39. `67–71`  Red(c) -> Verify -> Red -> Green -> Verify
 40. `72–72`  Skip  ← never closed
 41. `73–73`  Skip  ← never closed
 42. `74–75`  Red -> Green
 43. `76–76`  Skip  ← never closed
 44. `77–78`  Red -> Green
 45. `79–82`  Red -> Green -> Refactor -> Verify
 46. `83–89`  Red -> Skip -> Verify -> Break -> Verify -> Skip -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 26 | a new failing test arrived |
| `Green` | 25 | implementation changed, suite went green |
| `Skip` | 21 | test arrived and passed immediately — never red |
| `Verify` | 7 | nothing changed, suite re-run |
| `Red(c)` | 5 | test arrived, suite does not compile yet |
| `Refactor` | 3 | implementation changed, suite stayed green |
| `Start` | 1 | first invocation |
| `Break` | 1 | implementation change broke a green suite |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 3 files)_ |
| 2 | Red(c) | fail (1 collect err) | 0/0 | `src/pricing.spec.ts` |
| 3 | Red | fail | 0/1 | `src/catalog.ts` |
| 4 | Verify | fail | 0/1 | — |
| 5 | Green | pass | 1/0 | `src/catalog.ts` |
| 6 | Red | fail | 1/1 | `src/pricing.spec.ts` |
| 7 | Green | pass | 2/0 | `src/catalog.ts` |
| 8 | Red | fail | 2/1 | `src/pricing.spec.ts` |
| 9 | Green | pass | 3/0 | `src/catalog.ts` |
| 10 | Red | fail | 3/1 | `src/pricing.spec.ts` |
| 11 | Green | pass | 4/0 | `src/catalog.ts` |
| 12 | Red | fail | 4/1 | `src/pricing.spec.ts` |
| 13 | Green | pass | 5/0 | `src/catalog.ts` |
| 14 | Red | fail | 5/1 | `src/pricing.spec.ts` |
| 15 | Green | pass | 6/0 | `src/catalog.ts` |
| 16 | Red(c) | fail (1 collect err) | 0/0 | `src/pricing.spec.ts` |
| 17 | Red | fail | 6/1 | `src/pricing.ts` |
| 18 | Green | pass | 7/0 | `src/pricing.ts` |
| 19 | Red | fail | 7/1 | `src/pricing.spec.ts` |
| 20 | Green | pass | 8/0 | `src/pricing.ts` |
| 21 | Refactor | pass | 8/0 | `src/pricing.ts` |
| 22 | Skip | pass | 9/0 | `src/pricing.spec.ts` |
| 23 | Skip | pass | 10/0 | `src/pricing.spec.ts` |
| 24 | Skip | pass | 11/0 | `src/pricing.spec.ts` |
| 25 | Skip | pass | 12/0 | `src/pricing.spec.ts` |
| 26 | Red | fail | 12/1 | `src/pricing.spec.ts` |
| 27 | Green | pass | 13/0 | `src/pricing.ts` |
| 28 | Red | fail | 13/1 | `src/pricing.spec.ts` |
| 29 | Green | pass | 14/0 | `src/pricing.ts` |
| 30 | Red | fail | 14/1 | `src/pricing.spec.ts` |
| 31 | Green | pass | 15/0 | `src/pricing.ts` |
| 32 | Red | fail | 15/1 | `src/pricing.spec.ts` |
| 33 | Green | pass | 16/0 | `src/pricing.ts` |
| 34 | Skip | pass | 17/0 | `src/pricing.spec.ts` |
| 35 | Skip | pass | 18/0 | `src/pricing.spec.ts` |
| 36 | Red | fail | 18/1 | `src/pricing.spec.ts` |
| 37 | Green | pass | 19/0 | `src/pricing.ts` |
| 38 | Skip | pass | 20/0 | `src/pricing.spec.ts` |
| 39 | Skip | pass | 21/0 | `src/pricing.spec.ts` |
| 40 | Red | fail | 21/1 | `src/pricing.spec.ts` |
| 41 | Green | pass | 22/0 | `src/pricing.ts` |
| 42 | Red | fail | 22/1 | `src/pricing.spec.ts` |
| 43 | Green | pass | 23/0 | `src/pricing.ts` |
| 44 | Refactor | pass | 23/0 | `src/pricing.ts` |
| 45 | Red(c) | fail (1 collect err) | 23/0 | `src/claims.spec.ts` |
| 46 | Red | fail | 23/1 | `src/claims.ts` |
| 47 | Green | pass | 24/0 | `src/claims.ts` |
| 48 | Skip | pass | 25/0 | `src/claims.spec.ts` |
| 49 | Skip | pass | 26/0 | `src/claims.spec.ts` |
| 50 | Red | fail | 26/1 | `src/claims.spec.ts` |
| 51 | Green | pass | 27/0 | `src/claims.ts` |
| 52 | Skip | pass | 28/0 | `src/claims.spec.ts` |
| 53 | Skip | pass | 29/0 | `src/claims.spec.ts` |
| 54 | Red | fail | 29/1 | `src/claims.spec.ts` |
| 55 | Green | pass | 30/0 | `src/claims.ts` |
| 56 | Skip | pass | 31/0 | `src/claims.spec.ts` |
| 57 | Red | fail | 31/1 | `src/claims.spec.ts` |
| 58 | Green | pass | 32/0 | `src/claims.ts` |
| 59 | Red(c) | fail (1 collect err) | 23/0 | `src/claims.spec.ts` |
| 60 | Red | fail | 32/1 | `src/policy.ts` |
| 61 | Green | pass | 33/0 | `src/policy.ts` |
| 62 | Skip | pass | 34/0 | `src/claims.spec.ts` |
| 63 | Skip | pass | 35/0 | `src/claims.spec.ts` |
| 64 | Skip | pass | 36/0 | `src/claims.spec.ts` |
| 65 | Red | fail | 36/1 | `src/claims.spec.ts` |
| 66 | Green | pass | 37/0 | `src/policy.ts` |
| 67 | Red(c) | fail (1 collect err) | 37/0 | `src/cli.spec.ts` |
| 68 | Verify | fail (1 collect err) | 37/0 | — |
| 69 | Red | fail | 37/1 | `src/cli.spec.ts` |
| 70 | Green | pass | 38/0 | `src/cli.ts`, `src/scenario.ts` |
| 71 | Verify | pass | 38/0 | — |
| 72 | Skip | pass | 39/0 | `src/cli.spec.ts` |
| 73 | Skip | pass | 40/0 | `src/cli.spec.ts` |
| 74 | Red | fail | 40/1 | `src/cli.spec.ts` |
| 75 | Green | pass | 41/0 | `src/claims.ts` |
| 76 | Skip | pass | 42/0 | `src/cli.spec.ts` |
| 77 | Red | fail | 42/1 | `src/cli.spec.ts` |
| 78 | Green | pass | 43/0 | `src/claims.ts` |
| 79 | Red | fail | 43/1 | `src/cli.spec.ts` |
| 80 | Green | pass | 44/0 | `src/claims.ts` |
| 81 | Refactor | pass | 44/0 | `src/claims.ts`, `src/items.ts`, `src/pricing.ts` |
| 82 | Verify | pass | 44/0 | — |
| 83 | Red | fail | 44/1 | `src/cli.spec.ts` |
| 84 | Skip | fail | 44/1 | `src/cli.spec.ts` |
| 85 | Verify | fail | 44/1 | — |
| 86 | Break | fail | 44/1 | `src/scenario.ts` |
| 87 | Verify | fail | 44/1 | — |
| 88 | Skip | pass | 45/0 | `src/cli.spec.ts` |
| 89 | Verify | pass | 45/0 | — |

Final suite state: **pass**.

