# TDD phase chain — 2026-10-01_12-27-33_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

**243 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Break -> Verify -> Green -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Red(c) -> Both -> Green -> Verify -> Refactor -> Verify -> Red(c) -> Both -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Red(c) -> Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Both -> Verify -> Skip -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Both -> Both -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Red -> Green?(c) -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red(c) -> Both -> Break(c) -> Green -> Verify -> Refactor -> Refactor -> Verify -> Red(c) -> Both -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Red(c) -> Red -> Green?(c) -> Green?(c) -> Green?(c) -> Green -> Refactor -> Refactor -> Refactor -> Verify
```

Deviations present: `Both` ×7 (test and implementation changed together — no verified red), `Break` ×1 (implementation change broke a green suite), `Break(c)` ×1 (implementation change broke compilation of a green suite), `Green?(c)` ×4 (implementation changed, does not compile), `Skip` ×26 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 243 |
| `cycles_total` | 50 |
| `cycles_closed` | 21 |
| `test_first_rate` | 0.441 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 9 |
| `green_batch_size` | 8.0 |
| `refactor_events` | 79 |
| `skip_events` | 26 |
| `refactor_per_cycle` | 3.762 |
| `green_attempts` | 0.19 |
| `deviations` | 35 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.57 |
| `tdd_discipline_test_first` | 0.441 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.42 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (21 of 50 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–8`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor
  4. `9–13`  Red -> Green -> Verify -> Refactor -> Refactor
  5. `14–18`  Red -> Green -> Verify -> Refactor -> Refactor
  6. `19–23`  Red -> Green -> Verify -> Refactor -> Refactor
  7. `24–31`  Red -> Green -> Verify -> Break -> Verify -> Green -> Refactor -> Refactor
  8. `32–36`  Red -> Green -> Verify -> Refactor -> Refactor
  9. `37–40`  Red -> Green -> Verify -> Refactor
 10. `41–44`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 11. `45–49`  Red -> Green -> Verify -> Refactor -> Verify
 12. `50–54`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 13. `55–58`  Skip -> Verify -> Refactor -> Verify  ← never closed
 14. `59–62`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 15. `63–64`  Skip -> Verify  ← never closed
 16. `65–70`  Red(c) -> Both -> Green -> Verify -> Refactor -> Verify
 17. `71–76`  Red(c) -> Both -> Green -> Verify -> Refactor -> Verify
 18. `77–80`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 19. `81–84`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 20. `85–88`  Red -> Green -> Verify -> Refactor
 21. `89–92`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 22. `93–97`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 23. `98–101`  Red -> Green -> Verify -> Refactor
 24. `102–106`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 25. `107–112`  Skip -> Verify -> Refactor -> Refactor -> Refactor -> Verify  ← never closed
 26. `113–118`  Skip -> Verify -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 27. `119–123`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 28. `124–129`  Skip -> Verify -> Refactor -> Refactor -> Refactor -> Verify  ← never closed
 29. `130–136`  Red(c) -> Red -> Green -> Verify -> Refactor -> Verify -> Refactor
 30. `137–140`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 31. `141–145`  Red -> Green -> Verify -> Refactor -> Refactor
 32. `146–148`  Red(c) -> Both -> Verify  ← never closed
 33. `149–153`  Skip -> Green -> Verify -> Refactor -> Verify
 34. `154–157`  Skip -> Verify -> Refactor -> Verify  ← never closed
 35. `158–160`  Skip -> Verify -> Refactor  ← never closed
 36. `161–161`  Both  ← never closed
 37. `162–164`  Both -> Verify -> Verify  ← never closed
 38. `165–170`  Skip -> Verify -> Refactor -> Refactor -> Verify -> Verify  ← never closed
 39. `171–178`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor
 40. `179–182`  Skip -> Verify -> Refactor -> Verify  ← never closed
 41. `183–187`  Skip -> Verify -> Refactor -> Verify -> Verify  ← never closed
 42. `188–194`  Red -> Green?(c) -> Skip -> Verify -> Refactor -> Verify -> Verify  ← never closed
 43. `195–198`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 44. `199–202`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 45. `203–210`  Red(c) -> Both -> Break(c) -> Green -> Verify -> Refactor -> Refactor -> Verify
 46. `211–216`  Red(c) -> Both -> Green -> Verify -> Refactor -> Verify
 47. `217–221`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 48. `222–228`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 49. `229–232`  Red -> Green -> Verify -> Refactor
 50. `233–243`  Red(c) -> Red -> Green?(c) -> Green?(c) -> Green?(c) -> Green -> Refactor -> Refactor -> Refactor -> Verify -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Refactor` | 79 | implementation changed, suite stayed green |
| `Verify` | 76 | nothing changed, suite re-run |
| `Skip` | 26 | test arrived and passed immediately — never red |
| `Green` | 22 | implementation changed, suite went green |
| `Red` | 17 | a new failing test arrived |
| `Red(c)` | 9 | test arrived, suite does not compile yet |
| `Both` | 7 | test and implementation changed together — no verified red |
| `Green?(c)` | 4 | implementation changed, does not compile |
| `Start` | 1 | first invocation |
| `Break` | 1 | implementation change broke a green suite |
| `Break(c)` | 1 | implementation change broke compilation of a green suite |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 0 files)_ |
| 2 | Skip | pass | 0/0 | `src/lib.rs#test` |
| 3 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 4 | Red | fail | 0/1 | `src/lib.rs` |
| 5 | Green | pass | 1/0 | `src/lib.rs` |
| 6 | Verify | pass | 1/0 | — |
| 7 | Refactor | pass | 1/0 | `src/lib.rs` |
| 8 | Refactor | pass | 1/0 | `src/lib.rs` |
| 9 | Red | fail | 0/1 | `src/lib.rs#test` |
| 10 | Green | pass | 2/0 | `src/lib.rs` |
| 11 | Verify | pass | 2/0 | — |
| 12 | Refactor | pass | 2/0 | `src/lib.rs` |
| 13 | Refactor | pass | 2/0 | `src/lib.rs` |
| 14 | Red | fail | 0/1 | `src/lib.rs#test` |
| 15 | Green | pass | 3/0 | `src/lib.rs` |
| 16 | Verify | pass | 3/0 | — |
| 17 | Refactor | pass | 3/0 | `src/lib.rs` |
| 18 | Refactor | pass | 3/0 | `src/lib.rs` |
| 19 | Red | fail | 0/1 | `src/lib.rs#test` |
| 20 | Green | pass | 4/0 | `src/lib.rs` |
| 21 | Verify | pass | 4/0 | — |
| 22 | Refactor | pass | 4/0 | `src/lib.rs` |
| 23 | Refactor | pass | 4/0 | `src/lib.rs` |
| 24 | Red | fail | 0/1 | `src/lib.rs#test` |
| 25 | Green | pass | 5/0 | `src/lib.rs` |
| 26 | Verify | pass | 5/0 | — |
| 27 | Break | fail | 4/1 | `src/lib.rs` |
| 28 | Verify | fail | 4/1 | — |
| 29 | Green | pass | 5/0 | `src/lib.rs` |
| 30 | Refactor | pass | 5/0 | `src/lib.rs` |
| 31 | Refactor | pass | 5/0 | `src/lib.rs` |
| 32 | Red | fail | 0/1 | `src/lib.rs#test` |
| 33 | Green | pass | 6/0 | `src/lib.rs` |
| 34 | Verify | pass | 6/0 | — |
| 35 | Refactor | pass | 6/0 | `src/lib.rs` |
| 36 | Refactor | pass | 6/0 | `src/lib.rs` |
| 37 | Red | fail | 0/1 | `src/lib.rs#test` |
| 38 | Green | pass | 7/0 | `src/lib.rs` |
| 39 | Verify | pass | 7/0 | — |
| 40 | Refactor | pass | 7/0 | `src/lib.rs` |
| 41 | Skip | pass | 8/0 | `src/lib.rs#test` |
| 42 | Verify | pass | 8/0 | — |
| 43 | Refactor | pass | 8/0 | `src/lib.rs` |
| 44 | Refactor | pass | 8/0 | `src/lib.rs` |
| 45 | Red | fail | 0/1 | `src/lib.rs#test` |
| 46 | Green | pass | 9/0 | `src/lib.rs` |
| 47 | Verify | pass | 9/0 | — |
| 48 | Refactor | pass | 9/0 | `src/lib.rs` |
| 49 | Verify | pass | 9/0 | — |
| 50 | Skip | pass | 10/0 | `src/lib.rs#test` |
| 51 | Verify | pass | 10/0 | — |
| 52 | Refactor | pass | 10/0 | `src/lib.rs` |
| 53 | Refactor | pass | 10/0 | `src/lib.rs` |
| 54 | Verify | pass | 10/0 | — |
| 55 | Skip | pass | 11/0 | `src/lib.rs#test` |
| 56 | Verify | pass | 11/0 | — |
| 57 | Refactor | pass | 11/0 | `src/lib.rs` |
| 58 | Verify | pass | 11/0 | — |
| 59 | Skip | pass | 12/0 | `src/lib.rs#test` |
| 60 | Verify | pass | 12/0 | — |
| 61 | Refactor | pass | 12/0 | `src/lib.rs` |
| 62 | Refactor | pass | 12/0 | `src/lib.rs` |
| 63 | Skip | pass | 13/0 | `src/lib.rs#test` |
| 64 | Verify | pass | 13/0 | — |
| 65 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 66 | Both | fail | 0/1 | `src/lib.rs`, `src/lib.rs#test` |
| 67 | Green | pass | 14/0 | `src/lib.rs` |
| 68 | Verify | pass | 14/0 | — |
| 69 | Refactor | pass | 14/0 | `src/lib.rs` |
| 70 | Verify | pass | 14/0 | — |
| 71 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 72 | Both | fail | 14/1 | `src/lib.rs`, `src/lib.rs#test` |
| 73 | Green | pass | 15/0 | `src/lib.rs` |
| 74 | Verify | pass | 15/0 | — |
| 75 | Refactor | pass | 15/0 | `src/lib.rs` |
| 76 | Verify | pass | 15/0 | — |
| 77 | Skip | pass | 16/0 | `src/lib.rs#test` |
| 78 | Verify | pass | 16/0 | — |
| 79 | Refactor | pass | 16/0 | `src/lib.rs` |
| 80 | Refactor | pass | 16/0 | `src/lib.rs` |
| 81 | Skip | pass | 17/0 | `src/lib.rs#test` |
| 82 | Verify | pass | 17/0 | — |
| 83 | Refactor | pass | 17/0 | `src/lib.rs` |
| 84 | Refactor | pass | 17/0 | `src/lib.rs` |
| 85 | Red | fail | 0/1 | `src/lib.rs#test` |
| 86 | Green | pass | 18/0 | `src/lib.rs` |
| 87 | Verify | pass | 18/0 | — |
| 88 | Refactor | pass | 18/0 | `src/lib.rs` |
| 89 | Skip | pass | 19/0 | `src/lib.rs#test` |
| 90 | Verify | pass | 19/0 | — |
| 91 | Refactor | pass | 19/0 | `src/lib.rs` |
| 92 | Refactor | pass | 19/0 | `src/lib.rs` |
| 93 | Skip | pass | 20/0 | `src/lib.rs#test` |
| 94 | Verify | pass | 20/0 | — |
| 95 | Refactor | pass | 20/0 | `src/lib.rs` |
| 96 | Refactor | pass | 20/0 | `src/lib.rs` |
| 97 | Verify | pass | 20/0 | — |
| 98 | Red | fail | 0/1 | `src/lib.rs#test` |
| 99 | Green | pass | 21/0 | `src/lib.rs` |
| 100 | Verify | pass | 21/0 | — |
| 101 | Refactor | pass | 21/0 | `src/lib.rs` |
| 102 | Skip | pass | 22/0 | `src/lib.rs#test` |
| 103 | Verify | pass | 22/0 | — |
| 104 | Refactor | pass | 22/0 | `src/lib.rs` |
| 105 | Refactor | pass | 22/0 | `src/lib.rs` |
| 106 | Verify | pass | 22/0 | — |
| 107 | Skip | pass | 23/0 | `src/lib.rs#test` |
| 108 | Verify | pass | 23/0 | — |
| 109 | Refactor | pass | 23/0 | `src/lib.rs` |
| 110 | Refactor | pass | 23/0 | `src/lib.rs` |
| 111 | Refactor | pass | 23/0 | `src/lib.rs` |
| 112 | Verify | pass | 23/0 | — |
| 113 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 114 | Verify | pass | 24/0 | — |
| 115 | Verify | pass | 24/0 | — |
| 116 | Refactor | pass | 24/0 | `src/lib.rs`, `src/pricing.rs` |
| 117 | Refactor | pass | 24/0 | `src/pricing.rs` |
| 118 | Verify | pass | 24/0 | — |
| 119 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 120 | Verify | pass | 25/0 | — |
| 121 | Refactor | pass | 25/0 | `src/lib.rs`, `src/risk.rs` |
| 122 | Refactor | pass | 25/0 | `src/lib.rs`, `src/standing.rs` |
| 123 | Verify | pass | 25/0 | — |
| 124 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 125 | Verify | pass | 26/0 | — |
| 126 | Refactor | pass | 26/0 | `src/lib.rs` |
| 127 | Refactor | pass | 26/0 | `src/lib.rs` |
| 128 | Refactor | pass | 26/0 | `src/lib.rs` |
| 129 | Verify | pass | 26/0 | — |
| 130 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 131 | Red | fail | 0/1 | `src/lib.rs` |
| 132 | Green | pass | 27/0 | `src/lib.rs` |
| 133 | Verify | pass | 27/0 | — |
| 134 | Refactor | pass | 27/0 | `src/lib.rs`, `src/reimbursement.rs` |
| 135 | Verify | pass | 27/0 | — |
| 136 | Refactor | pass | 27/0 | `src/reimbursement.rs` |
| 137 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 138 | Verify | pass | 28/0 | — |
| 139 | Refactor | pass | 28/0 | `src/pricing.rs` |
| 140 | Refactor | pass | 28/0 | `src/pricing.rs` |
| 141 | Red | fail | 0/1 | `src/lib.rs#test` |
| 142 | Green | pass | 29/0 | `src/lib.rs`, `src/reimbursement.rs` |
| 143 | Verify | pass | 29/0 | — |
| 144 | Refactor | pass | 29/0 | `src/reimbursement.rs` |
| 145 | Refactor | pass | 29/0 | `src/reimbursement.rs` |
| 146 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 147 | Both | pass | 30/0 | `src/lib.rs`, `src/lib.rs#test` |
| 148 | Verify | pass | 30/0 | — |
| 149 | Skip | pass | 30/0 | `src/lib.rs#test` |
| 150 | Green | pass | 1/0 | `src/lib.rs#test` |
| 151 | Verify | pass | 31/0 | — |
| 152 | Refactor | pass | 31/0 | `src/reimbursement.rs` |
| 153 | Verify | pass | 31/0 | — |
| 154 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 155 | Verify | pass | 32/0 | — |
| 156 | Refactor | pass | 32/0 | `src/reimbursement.rs` |
| 157 | Verify | pass | 32/0 | — |
| 158 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 159 | Verify | pass | 33/0 | — |
| 160 | Refactor | pass | 33/0 | `src/lib.rs`, `src/premium.rs` |
| 161 | Both | pass | 0/0 | `src/lib.rs`, `src/lib.rs#test`, `src/premium.rs` |
| 162 | Both | pass | 33/0 | `src/lib.rs`, `src/lib.rs#test` |
| 163 | Verify | pass | 33/0 | — |
| 164 | Verify | pass | 33/0 | — |
| 165 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 166 | Verify | pass | 34/0 | — |
| 167 | Refactor | pass | 34/0 | `src/lib.rs`, `src/reimbursement.rs` |
| 168 | Refactor | pass | 34/0 | `src/reimbursement.rs` |
| 169 | Verify | pass | 34/0 | — |
| 170 | Verify | pass | 34/0 | — |
| 171 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 172 | Red | fail | 0/1 | `src/lib.rs` |
| 173 | Green | pass | 35/0 | `src/lib.rs`, `src/pricing.rs` |
| 174 | Verify | pass | 35/0 | — |
| 175 | Refactor | pass | 35/0 | `src/lib.rs`, `src/settlement_limit.rs` |
| 176 | Refactor | pass | 35/0 | `src/lib.rs`, `src/settlement_limit.rs` |
| 177 | Refactor | pass | 35/0 | `src/lib.rs`, `src/settlement_limit.rs` |
| 178 | Refactor | pass | 35/0 | `src/settlement_limit.rs` |
| 179 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 180 | Verify | pass | 36/0 | — |
| 181 | Refactor | pass | 36/0 | `src/lib.rs`, `src/settlement_limit.rs` |
| 182 | Verify | pass | 36/0 | — |
| 183 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 184 | Verify | pass | 37/0 | — |
| 185 | Refactor | pass | 37/0 | `src/coverage.rs`, `src/lib.rs` |
| 186 | Verify | pass | 37/0 | — |
| 187 | Verify | pass | 37/0 | — |
| 188 | Red | fail | 0/1 | `src/lib.rs#test` |
| 189 | Green?(c) | fail (1 collect err) | 0/0 | `src/lib.rs`, `src/settlement_limit.rs` |
| 190 | Skip | pass | 38/0 | `src/lib.rs#test` |
| 191 | Verify | pass | 38/0 | — |
| 192 | Refactor | pass | 38/0 | `src/lib.rs`, `src/settlement_limit.rs` |
| 193 | Verify | pass | 38/0 | — |
| 194 | Verify | pass | 38/0 | — |
| 195 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 196 | Verify | pass | 39/0 | — |
| 197 | Refactor | pass | 39/0 | `src/pricing.rs` |
| 198 | Refactor | pass | 39/0 | `src/pricing.rs` |
| 199 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 200 | Verify | pass | 40/0 | — |
| 201 | Refactor | pass | 40/0 | `src/coverage.rs`, `src/lib.rs` |
| 202 | Refactor | pass | 40/0 | `src/coverage.rs`, `src/lib.rs` |
| 203 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 204 | Both | fail | 40/1 | `src/lib.rs`, `src/lib.rs#test` |
| 205 | Break(c) | fail (2 collect err) | 0/0 | `src/lib.rs`, `src/pricing.rs` |
| 206 | Green | pass | 41/0 | `src/lib.rs` |
| 207 | Verify | pass | 41/0 | — |
| 208 | Refactor | pass | 41/0 | `src/pricing.rs` |
| 209 | Refactor | pass | 41/0 | `src/lib.rs` |
| 210 | Verify | pass | 41/0 | — |
| 211 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 212 | Both | fail | 41/1 | `src/lib.rs`, `src/lib.rs#test` |
| 213 | Green | pass | 42/0 | `src/lib.rs` |
| 214 | Verify | pass | 42/0 | — |
| 215 | Refactor | pass | 42/0 | `src/lib.rs` |
| 216 | Verify | pass | 42/0 | — |
| 217 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 218 | Verify | pass | 43/0 | — |
| 219 | Refactor | pass | 43/0 | `src/admissibility.rs`, `src/lib.rs` |
| 220 | Refactor | pass | 43/0 | `src/lib.rs`, `src/rounding.rs` |
| 221 | Verify | pass | 43/0 | — |
| 222 | Red | fail | 0/1 | `src/lib.rs#test` |
| 223 | Green | pass | 44/0 | `src/admissibility.rs`, `src/coverage.rs` |
| 224 | Verify | pass | 44/0 | — |
| 225 | Refactor | pass | 44/0 | `src/coverage.rs`, `src/lib.rs`, `src/reimbursement.rs` |
| 226 | Refactor | pass | 44/0 | `src/coverage.rs`, `src/lib.rs` |
| 227 | Refactor | pass | 44/0 | `src/coverage.rs` |
| 228 | Verify | pass | 44/0 | — |
| 229 | Red | fail | 0/1 | `src/lib.rs#test` |
| 230 | Green | pass | 45/0 | `src/admissibility.rs` |
| 231 | Verify | pass | 45/0 | — |
| 232 | Refactor | pass | 45/0 | `src/admissibility.rs` |
| 233 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 234 | Red | fail | 0/1 | `src/lib.rs` |
| 235 | Green?(c) | fail (1 collect err) | 0/0 | `src/lib.rs`, `src/scenario.rs` |
| 236 | Green?(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 237 | Green?(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 238 | Green | pass | 46/0 | `src/lib.rs` |
| 239 | Refactor | pass | 46/0 | `src/main.rs` |
| 240 | Refactor | pass | 46/0 | `src/business_done.rs`, `src/lib.rs` |
| 241 | Refactor | pass | 46/0 | `src/business_done.rs`, `src/lib.rs` |
| 242 | Verify | pass | 46/0 | — |
| 243 | Verify | pass | 46/0 | — |

Final suite state: **pass**.

