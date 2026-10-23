# TDD phase chain — 2026-10-23_03-27-25_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

**72 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Verify -> Red -> Green? -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Red -> Green -> Skip -> Skip -> Red -> Green -> Red -> Green -> Refactor -> Red -> Green? -> Verify -> Skip -> Skip -> Red -> Green -> Skip -> Red -> Green -> Skip -> Red -> Green -> Red -> Green -> Verify -> Skip -> Refactor -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Skip -> Skip -> Skip -> Red -> Green -> Skip -> Skip -> Skip -> Skip -> Red -> Green -> Refactor -> Red -> Green -> Refactor -> Skip -> Red -> Green -> Red -> Green -> Verify
```

Deviations present: `Green?` ×2 (implementation changed, still failing), `Skip` ×19 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 72 |
| `cycles_total` | 39 |
| `cycles_closed` | 20 |
| `test_first_rate` | 0.525 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 2 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 5 |
| `skip_events` | 19 |
| `refactor_per_cycle` | 0.25 |
| `green_attempts` | 0.1 |
| `deviations` | 19 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.646 |
| `tdd_discipline_test_first` | 0.525 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.513 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (20 of 39 closed with a Green)

  1. `1–2`  Start -> Verify  ← never closed
  2. `3–5`  Red -> Green? -> Green
  3. `6–7`  Red -> Green
  4. `8–9`  Red -> Green
  5. `10–11`  Red -> Green
  6. `12–13`  Red -> Green
  7. `14–15`  Red -> Green
  8. `16–17`  Red -> Green
  9. `18–18`  Skip  ← never closed
 10. `19–19`  Skip  ← never closed
 11. `20–21`  Red -> Green
 12. `22–24`  Red -> Green -> Refactor
 13. `25–28`  Red -> Green? -> Verify -> Skip  ← never closed
 14. `29–29`  Skip  ← never closed
 15. `30–31`  Red -> Green
 16. `32–32`  Skip  ← never closed
 17. `33–34`  Red -> Green
 18. `35–35`  Skip  ← never closed
 19. `36–37`  Red -> Green
 20. `38–42`  Red -> Green -> Verify -> Skip -> Refactor
 21. `43–43`  Skip  ← never closed
 22. `44–45`  Red -> Green
 23. `46–46`  Skip  ← never closed
 24. `47–47`  Skip  ← never closed
 25. `48–48`  Skip  ← never closed
 26. `49–51`  Red -> Green -> Refactor
 27. `52–52`  Skip  ← never closed
 28. `53–53`  Skip  ← never closed
 29. `54–54`  Skip  ← never closed
 30. `55–56`  Red -> Green
 31. `57–57`  Skip  ← never closed
 32. `58–58`  Skip  ← never closed
 33. `59–59`  Skip  ← never closed
 34. `60–60`  Skip  ← never closed
 35. `61–63`  Red -> Green -> Refactor
 36. `64–66`  Red -> Green -> Refactor
 37. `67–67`  Skip  ← never closed
 38. `68–69`  Red -> Green
 39. `70–72`  Red -> Green -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Red` | 21 | a new failing test arrived |
| `Green` | 20 | implementation changed, suite went green |
| `Skip` | 19 | test arrived and passed immediately — never red |
| `Refactor` | 5 | implementation changed, suite stayed green |
| `Verify` | 4 | nothing changed, suite re-run |
| `Green?` | 2 | implementation changed, still failing |
| `Start` | 1 | first invocation |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Verify | pass | 0/0 | — |
| 3 | Red | fail | 0/1 | `src/claim-office.spec.ts` |
| 4 | Green? | fail | 0/1 | `src/cli.ts` |
| 5 | Green | pass | 1/0 | `src/cli.ts` |
| 6 | Red | fail | 1/1 | `src/claim-office.spec.ts` |
| 7 | Green | pass | 2/0 | `src/cli.ts` |
| 8 | Red | fail | 2/1 | `src/claim-office.spec.ts` |
| 9 | Green | pass | 3/0 | `src/cli.ts` |
| 10 | Red | fail | 3/1 | `src/claim-office.spec.ts` |
| 11 | Green | pass | 4/0 | `src/cli.ts` |
| 12 | Red | fail | 4/1 | `src/claim-office.spec.ts` |
| 13 | Green | pass | 5/0 | `src/cli.ts` |
| 14 | Red | fail | 5/1 | `src/claim-office.spec.ts` |
| 15 | Green | pass | 6/0 | `src/cli.ts` |
| 16 | Red | fail | 6/1 | `src/claim-office.spec.ts` |
| 17 | Green | pass | 7/0 | `src/cli.ts` |
| 18 | Skip | pass | 8/0 | `src/claim-office.spec.ts` |
| 19 | Skip | pass | 9/0 | `src/claim-office.spec.ts` |
| 20 | Red | fail | 9/1 | `src/claim-office.spec.ts` |
| 21 | Green | pass | 10/0 | `src/cli.ts` |
| 22 | Red | fail | 10/1 | `src/claim-office.spec.ts` |
| 23 | Green | pass | 11/0 | `src/cli.ts` |
| 24 | Refactor | pass | 11/0 | `src/cli.ts` |
| 25 | Red | fail | 11/1 | `src/claim-office.spec.ts` |
| 26 | Green? | fail | 11/1 | `src/cli.ts` |
| 27 | Verify | fail | 11/1 | — |
| 28 | Skip | pass | 12/0 | `src/claim-office.spec.ts` |
| 29 | Skip | pass | 13/0 | `src/claim-office.spec.ts` |
| 30 | Red | fail | 13/1 | `src/claim-office.spec.ts` |
| 31 | Green | pass | 14/0 | `src/cli.ts` |
| 32 | Skip | pass | 15/0 | `src/claim-office.spec.ts` |
| 33 | Red | fail | 15/1 | `src/claim-office.spec.ts` |
| 34 | Green | pass | 16/0 | `src/cli.ts` |
| 35 | Skip | pass | 17/0 | `src/claim-office.spec.ts` |
| 36 | Red | fail | 17/1 | `src/claim-office.spec.ts` |
| 37 | Green | pass | 18/0 | `src/cli.ts` |
| 38 | Red | fail | 17/2 | `src/claim-office.spec.ts` |
| 39 | Green | fail | 17/2 | `src/cli.ts` |
| 40 | Verify | fail | 17/2 | — |
| 41 | Skip | pass | 19/0 | `src/claim-office.spec.ts` |
| 42 | Refactor | pass | 19/0 | `src/cli.ts` |
| 43 | Skip | pass | 20/0 | `src/claim-office.spec.ts` |
| 44 | Red | fail | 20/1 | `src/claim-office.spec.ts` |
| 45 | Green | pass | 21/0 | `src/cli.ts` |
| 46 | Skip | pass | 22/0 | `src/claim-office.spec.ts` |
| 47 | Skip | pass | 23/0 | `src/claim-office.spec.ts` |
| 48 | Skip | pass | 24/0 | `src/claim-office.spec.ts` |
| 49 | Red | fail | 24/1 | `src/claim-office.spec.ts` |
| 50 | Green | pass | 25/0 | `src/cli.ts` |
| 51 | Refactor | pass | 25/0 | `src/cli.ts` |
| 52 | Skip | pass | 26/0 | `src/claim-office.spec.ts` |
| 53 | Skip | pass | 27/0 | `src/claim-office.spec.ts` |
| 54 | Skip | pass | 28/0 | `src/claim-office.spec.ts` |
| 55 | Red | fail | 28/1 | `src/claim-office.spec.ts` |
| 56 | Green | pass | 29/0 | `src/cli.ts` |
| 57 | Skip | pass | 30/0 | `src/claim-office.spec.ts` |
| 58 | Skip | pass | 31/0 | `src/claim-office.spec.ts` |
| 59 | Skip | pass | 32/0 | `src/claim-office.spec.ts` |
| 60 | Skip | pass | 33/0 | `src/claim-office.spec.ts` |
| 61 | Red | fail | 33/1 | `src/claim-office.spec.ts` |
| 62 | Green | pass | 34/0 | `src/cli.ts` |
| 63 | Refactor | pass | 34/0 | `src/cli.ts` |
| 64 | Red | fail | 34/1 | `src/claim-office.spec.ts` |
| 65 | Green | pass | 35/0 | `src/cli.ts` |
| 66 | Refactor | pass | 35/0 | `src/cli.ts` |
| 67 | Skip | pass | 36/0 | `src/claim-office.spec.ts` |
| 68 | Red | fail | 36/1 | `src/claim-office.spec.ts` |
| 69 | Green | pass | 37/0 | `src/cli.ts` |
| 70 | Red | fail | 37/1 | `src/claim-office.spec.ts` |
| 71 | Green | pass | 38/0 | `src/cli.ts` |
| 72 | Verify | pass | 38/0 | — |

Final suite state: **pass**.

