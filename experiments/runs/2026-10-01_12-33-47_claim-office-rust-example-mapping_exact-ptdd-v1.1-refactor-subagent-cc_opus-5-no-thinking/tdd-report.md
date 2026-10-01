# TDD phase chain — 2026-10-01_12-33-47_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

**268 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Red(c) -> Red -> Verify -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Red(c) -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Green -> Verify -> Both -> Both -> Red(c) -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Green -> Verify -> Refactor -> Red(c) -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Both -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Red(c) -> Red -> Green -> Verify -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Verify -> Red(c) -> Both -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Red -> Green -> Skip -> Verify -> Refactor -> Refactor -> Both -> Verify -> Red(c) -> Red -> Both -> Verify -> Both -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Break(c) -> Break -> Verify -> Green? -> Verify -> Green -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Verify -> Red(c) -> Red -> Green?(c) -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Red(c) -> Green -> Verify -> Break(c) -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Skip -> Red -> Green -> Verify -> Refactor -> Verify -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Red(c) -> Red -> Both -> Verify -> Refactor -> Refactor -> Red -> Green?(c) -> Green -> Verify -> Break(c) -> Verify -> Refactor -> Red(c) -> Both -> Refactor -> Verify -> Green -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Skip -> Verify
```

Deviations present: `Both` ×9 (test and implementation changed together — no verified red), `Break` ×1 (implementation change broke a green suite), `Break(c)` ×3 (implementation change broke compilation of a green suite), `Green?` ×1 (implementation changed, still failing), `Green?(c)` ×2 (implementation changed, does not compile), `Skip` ×32 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 268 |
| `cycles_total` | 61 |
| `cycles_closed` | 23 |
| `test_first_rate` | 0.461 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 18 |
| `green_batch_size` | 11.5 |
| `refactor_events` | 78 |
| `skip_events` | 32 |
| `refactor_per_cycle` | 3.391 |
| `green_attempts` | 0.13 |
| `deviations` | 45 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.558 |
| `tdd_discipline_test_first` | 0.461 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.377 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (23 of 61 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–9`  Red(c) -> Red -> Verify -> Green -> Verify -> Refactor -> Refactor
  4. `10–13`  Red(c) -> Red -> Green -> Verify
  5. `14–18`  Red(c) -> Green -> Verify -> Refactor -> Refactor
  6. `19–21`  Red(c) -> Green -> Verify
  7. `22–22`  Both  ← never closed
  8. `23–23`  Both  ← never closed
  9. `24–28`  Red(c) -> Green -> Verify -> Refactor -> Refactor
 10. `29–32`  Red(c) -> Green -> Verify -> Refactor
 11. `33–38`  Red(c) -> Green -> Verify -> Refactor -> Refactor -> Refactor
 12. `39–40`  Skip -> Verify  ← never closed
 13. `41–45`  Red -> Green -> Verify -> Refactor -> Verify
 14. `46–48`  Skip -> Verify -> Refactor  ← never closed
 15. `49–51`  Skip -> Verify -> Refactor  ← never closed
 16. `52–53`  Both -> Verify  ← never closed
 17. `54–57`  Skip -> Verify -> Refactor -> Verify  ← never closed
 18. `58–59`  Skip -> Verify  ← never closed
 19. `60–64`  Red(c) -> Red -> Green -> Verify -> Refactor
 20. `65–71`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor
 21. `72–75`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 22. `76–78`  Skip -> Verify -> Refactor  ← never closed
 23. `79–80`  Skip -> Verify  ← never closed
 24. `81–86`  Red(c) -> Both -> Green -> Verify -> Refactor -> Refactor
 25. `87–91`  Skip -> Verify -> Refactor -> Refactor -> Refactor  ← never closed
 26. `92–97`  Red -> Green -> Skip -> Verify -> Refactor -> Refactor
 27. `98–99`  Both -> Verify  ← never closed
 28. `100–103`  Red(c) -> Red -> Both -> Verify  ← never closed
 29. `104–107`  Both -> Refactor -> Refactor -> Verify  ← never closed
 30. `108–110`  Skip -> Verify -> Refactor  ← never closed
 31. `111–123`  Red -> Green -> Verify -> Verify -> Refactor -> Skip -> Verify -> Break(c) -> Break -> Verify -> Green? -> Verify -> Green
 32. `124–130`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify
 33. `131–134`  Skip -> Verify -> Refactor -> Verify  ← never closed
 34. `135–138`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 35. `139–145`  Red(c) -> Red -> Green -> Verify -> Refactor -> Verify -> Verify
 36. `146–152`  Red(c) -> Red -> Green?(c) -> Green -> Verify -> Refactor -> Verify
 37. `153–155`  Skip -> Verify -> Refactor  ← never closed
 38. `156–158`  Skip -> Verify -> Refactor  ← never closed
 39. `159–162`  Skip -> Verify -> Refactor -> Verify  ← never closed
 40. `163–167`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 41. `168–172`  Skip -> Verify -> Refactor -> Verify -> Refactor  ← never closed
 42. `173–176`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 43. `177–180`  Skip -> Verify -> Refactor -> Verify  ← never closed
 44. `181–185`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 45. `186–187`  Skip -> Verify  ← never closed
 46. `188–195`  Red(c) -> Green -> Verify -> Verify -> Break(c) -> Refactor -> Refactor -> Verify
 47. `196–200`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 48. `201–205`  Skip -> Verify -> Refactor -> Refactor -> Refactor  ← never closed
 49. `206–211`  Skip -> Verify -> Refactor -> Verify -> Refactor -> Refactor  ← never closed
 50. `212–216`  Red -> Green -> Verify -> Refactor -> Verify
 51. `217–221`  Red -> Green -> Verify -> Refactor -> Verify
 52. `222–223`  Skip -> Verify  ← never closed
 53. `224–225`  Skip -> Verify  ← never closed
 54. `226–226`  Skip  ← never closed
 55. `227–227`  Skip  ← never closed
 56. `228–233`  Red -> Green -> Verify -> Refactor -> Verify -> Verify
 57. `234–240`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor
 58. `241–246`  Red(c) -> Red -> Both -> Verify -> Refactor -> Refactor  ← never closed
 59. `247–253`  Red -> Green?(c) -> Green -> Verify -> Break(c) -> Verify -> Refactor
 60. `254–265`  Red(c) -> Both -> Refactor -> Verify -> Green -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor
 61. `266–268`  Skip -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 82 | nothing changed, suite re-run |
| `Refactor` | 78 | implementation changed, suite stayed green |
| `Skip` | 32 | test arrived and passed immediately — never red |
| `Green` | 24 | implementation changed, suite went green |
| `Red(c)` | 18 | test arrived, suite does not compile yet |
| `Red` | 17 | a new failing test arrived |
| `Both` | 9 | test and implementation changed together — no verified red |
| `Break(c)` | 3 | implementation change broke compilation of a green suite |
| `Green?(c)` | 2 | implementation changed, does not compile |
| `Start` | 1 | first invocation |
| `Break` | 1 | implementation change broke a green suite |
| `Green?` | 1 | implementation changed, still failing |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 0 files)_ |
| 2 | Skip | pass | 0/0 | `src/lib.rs#test` |
| 3 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 4 | Red | fail | 0/1 | `src/lib.rs` |
| 5 | Verify | fail | 0/1 | — |
| 6 | Green | pass | 1/0 | `src/lib.rs` |
| 7 | Verify | pass | 1/0 | — |
| 8 | Refactor | pass | 1/0 | `src/lib.rs` |
| 9 | Refactor | pass | 1/0 | `src/lib.rs` |
| 10 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 11 | Red | fail | 0/1 | `src/lib.rs` |
| 12 | Green | pass | 2/0 | `src/lib.rs` |
| 13 | Verify | pass | 2/0 | — |
| 14 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 15 | Green | pass | 3/0 | `src/lib.rs` |
| 16 | Verify | pass | 3/0 | — |
| 17 | Refactor | pass | 3/0 | `src/lib.rs` |
| 18 | Refactor | pass | 3/0 | `src/lib.rs` |
| 19 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 20 | Green | pass | 4/0 | `src/lib.rs` |
| 21 | Verify | pass | 4/0 | — |
| 22 | Both | pass | 4/0 | `src/lib.rs`, `src/lib.rs#test` |
| 23 | Both | pass | 4/0 | `src/lib.rs`, `src/lib.rs#test` |
| 24 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 25 | Green | pass | 5/0 | `src/lib.rs` |
| 26 | Verify | pass | 5/0 | — |
| 27 | Refactor | pass | 5/0 | `src/lib.rs` |
| 28 | Refactor | pass | 5/0 | `src/lib.rs` |
| 29 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 30 | Green | pass | 6/0 | `src/lib.rs` |
| 31 | Verify | pass | 6/0 | — |
| 32 | Refactor | pass | 6/0 | `src/lib.rs` |
| 33 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 34 | Green | pass | 7/0 | `src/lib.rs` |
| 35 | Verify | pass | 7/0 | — |
| 36 | Refactor | pass | 7/0 | `src/lib.rs` |
| 37 | Refactor | pass | 7/0 | `src/lib.rs` |
| 38 | Refactor | pass | 7/0 | `src/lib.rs` |
| 39 | Skip | pass | 8/0 | `src/lib.rs#test` |
| 40 | Verify | pass | 8/0 | — |
| 41 | Red | fail | 0/1 | `src/lib.rs#test` |
| 42 | Green | pass | 9/0 | `src/lib.rs` |
| 43 | Verify | pass | 9/0 | — |
| 44 | Refactor | pass | 9/0 | `src/lib.rs` |
| 45 | Verify | pass | 9/0 | — |
| 46 | Skip | pass | 10/0 | `src/lib.rs#test` |
| 47 | Verify | pass | 10/0 | — |
| 48 | Refactor | pass | 10/0 | `src/lib.rs` |
| 49 | Skip | pass | 11/0 | `src/lib.rs#test` |
| 50 | Verify | pass | 11/0 | — |
| 51 | Refactor | pass | 11/0 | `src/lib.rs` |
| 52 | Both | pass | 11/0 | `src/lib.rs`, `src/lib.rs#test` |
| 53 | Verify | pass | 11/0 | — |
| 54 | Skip | pass | 12/0 | `src/lib.rs#test` |
| 55 | Verify | pass | 12/0 | — |
| 56 | Refactor | pass | 12/0 | `src/lib.rs` |
| 57 | Verify | pass | 12/0 | — |
| 58 | Skip | pass | 13/0 | `src/lib.rs#test` |
| 59 | Verify | pass | 13/0 | — |
| 60 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 61 | Red | fail | 0/1 | `src/lib.rs` |
| 62 | Green | pass | 14/0 | `src/lib.rs` |
| 63 | Verify | pass | 14/0 | — |
| 64 | Refactor | pass | 14/0 | `src/lib.rs` |
| 65 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 66 | Red | fail | 0/1 | `src/lib.rs` |
| 67 | Green | pass | 15/0 | `src/lib.rs` |
| 68 | Verify | pass | 15/0 | — |
| 69 | Refactor | pass | 15/0 | `src/lib.rs` |
| 70 | Refactor | pass | 15/0 | `src/lib.rs` |
| 71 | Refactor | pass | 15/0 | `src/lib.rs` |
| 72 | Skip | pass | 16/0 | `src/lib.rs#test` |
| 73 | Verify | pass | 16/0 | — |
| 74 | Refactor | pass | 16/0 | `src/lib.rs` |
| 75 | Refactor | pass | 16/0 | `src/lib.rs` |
| 76 | Skip | pass | 17/0 | `src/lib.rs#test` |
| 77 | Verify | pass | 17/0 | — |
| 78 | Refactor | pass | 17/0 | `src/lib.rs` |
| 79 | Skip | pass | 18/0 | `src/lib.rs#test` |
| 80 | Verify | pass | 18/0 | — |
| 81 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 82 | Both | fail | 18/1 | `src/lib.rs`, `src/lib.rs#test` |
| 83 | Green | pass | 19/0 | `src/lib.rs` |
| 84 | Verify | pass | 19/0 | — |
| 85 | Refactor | pass | 19/0 | `src/lib.rs` |
| 86 | Refactor | pass | 19/0 | `src/lib.rs` |
| 87 | Skip | pass | 20/0 | `src/lib.rs#test` |
| 88 | Verify | pass | 20/0 | — |
| 89 | Refactor | pass | 20/0 | `src/lib.rs` |
| 90 | Refactor | pass | 20/0 | `src/lib.rs` |
| 91 | Refactor | pass | 20/0 | `src/lib.rs` |
| 92 | Red | fail | 0/1 | `src/lib.rs#test` |
| 93 | Green | fail | 2/19 | `src/lib.rs` |
| 94 | Skip | pass | 21/0 | `src/lib.rs#test` |
| 95 | Verify | pass | 21/0 | — |
| 96 | Refactor | pass | 21/0 | `src/lib.rs` |
| 97 | Refactor | pass | 21/0 | `src/lib.rs` |
| 98 | Both | pass | 21/0 | `src/lib.rs`, `src/lib.rs#test` |
| 99 | Verify | pass | 21/0 | — |
| 100 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 101 | Red | fail | 0/1 | `src/lib.rs` |
| 102 | Both | pass | 22/0 | `src/lib.rs`, `src/lib.rs#test` |
| 103 | Verify | pass | 22/0 | — |
| 104 | Both | pass | 22/0 | `src/lib.rs`, `src/lib.rs#test` |
| 105 | Refactor | pass | 22/0 | `src/lib.rs` |
| 106 | Refactor | pass | 22/0 | `src/lib.rs` |
| 107 | Verify | pass | 22/0 | — |
| 108 | Skip | pass | 23/0 | `src/lib.rs#test` |
| 109 | Verify | pass | 23/0 | — |
| 110 | Refactor | pass | 23/0 | `src/lib.rs` |
| 111 | Red | fail | 0/1 | `src/lib.rs#test` |
| 112 | Green | fail | 16/8 | `src/lib.rs` |
| 113 | Verify | fail | 16/8 | — |
| 114 | Verify | fail | 16/8 | — |
| 115 | Refactor | fail | 20/4 | `src/lib.rs` |
| 116 | Skip | pass | 24/0 | `src/lib.rs#test` |
| 117 | Verify | pass | 24/0 | — |
| 118 | Break(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 119 | Break | fail | 1/23 | `src/lib.rs` |
| 120 | Verify | fail | 0/1 | — |
| 121 | Green? | fail | 21/3 | `src/lib.rs` |
| 122 | Verify | fail | 21/3 | — |
| 123 | Green | pass | 24/0 | `src/lib.rs` |
| 124 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 125 | Red | fail | 0/1 | `src/lib.rs` |
| 126 | Green | pass | 25/0 | `src/lib.rs` |
| 127 | Verify | pass | 25/0 | — |
| 128 | Refactor | pass | 25/0 | `src/lib.rs` |
| 129 | Refactor | pass | 25/0 | `src/lib.rs` |
| 130 | Verify | pass | 25/0 | — |
| 131 | Skip | pass | 26/0 | `src/lib.rs#test` |
| 132 | Verify | pass | 26/0 | — |
| 133 | Refactor | pass | 26/0 | `src/lib.rs` |
| 134 | Verify | pass | 26/0 | — |
| 135 | Skip | pass | 27/0 | `src/lib.rs#test` |
| 136 | Verify | pass | 27/0 | — |
| 137 | Refactor | pass | 27/0 | `src/lib.rs` |
| 138 | Refactor | pass | 27/0 | `src/lib.rs` |
| 139 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 140 | Red | fail | 0/1 | `src/lib.rs` |
| 141 | Green | pass | 28/0 | `src/lib.rs` |
| 142 | Verify | pass | 28/0 | — |
| 143 | Refactor | pass | 28/0 | `src/lib.rs` |
| 144 | Verify | pass | 28/0 | — |
| 145 | Verify | pass | 28/0 | — |
| 146 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 147 | Red | fail | 0/1 | `src/lib.rs` |
| 148 | Green?(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 149 | Green | pass | 29/0 | `src/lib.rs` |
| 150 | Verify | pass | 29/0 | — |
| 151 | Refactor | pass | 29/0 | `src/lib.rs` |
| 152 | Verify | pass | 29/0 | — |
| 153 | Skip | pass | 30/0 | `src/lib.rs#test` |
| 154 | Verify | pass | 30/0 | — |
| 155 | Refactor | pass | 30/0 | `src/lib.rs` |
| 156 | Skip | pass | 31/0 | `src/lib.rs#test` |
| 157 | Verify | pass | 31/0 | — |
| 158 | Refactor | pass | 31/0 | `src/lib.rs` |
| 159 | Skip | pass | 32/0 | `src/lib.rs#test` |
| 160 | Verify | pass | 32/0 | — |
| 161 | Refactor | pass | 32/0 | `src/lib.rs` |
| 162 | Verify | pass | 32/0 | — |
| 163 | Skip | pass | 33/0 | `src/lib.rs#test` |
| 164 | Verify | pass | 33/0 | — |
| 165 | Refactor | pass | 33/0 | `src/lib.rs` |
| 166 | Refactor | pass | 33/0 | `src/lib.rs` |
| 167 | Verify | pass | 33/0 | — |
| 168 | Skip | pass | 34/0 | `src/lib.rs#test` |
| 169 | Verify | pass | 34/0 | — |
| 170 | Refactor | pass | 34/0 | `src/lib.rs` |
| 171 | Verify | pass | 34/0 | — |
| 172 | Refactor | pass | 34/0 | `src/lib.rs` |
| 173 | Skip | pass | 35/0 | `src/lib.rs#test` |
| 174 | Verify | pass | 35/0 | — |
| 175 | Refactor | pass | 35/0 | `src/lib.rs` |
| 176 | Refactor | pass | 35/0 | `src/lib.rs` |
| 177 | Skip | pass | 36/0 | `src/lib.rs#test` |
| 178 | Verify | pass | 36/0 | — |
| 179 | Refactor | pass | 36/0 | `src/lib.rs` |
| 180 | Verify | pass | 36/0 | — |
| 181 | Skip | pass | 37/0 | `src/lib.rs#test` |
| 182 | Verify | pass | 37/0 | — |
| 183 | Refactor | pass | 37/0 | `src/lib.rs` |
| 184 | Refactor | pass | 37/0 | `src/lib.rs` |
| 185 | Verify | pass | 37/0 | — |
| 186 | Skip | pass | 38/0 | `src/lib.rs#test` |
| 187 | Verify | pass | 38/0 | — |
| 188 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 189 | Green | pass | 1/0 | `src/lib.rs` |
| 190 | Verify | pass | 39/0 | — |
| 191 | Verify | pass | 39/0 | — |
| 192 | Break(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 193 | Refactor | pass | 39/0 | `src/lib.rs` |
| 194 | Refactor | pass | 39/0 | `src/lib.rs` |
| 195 | Verify | pass | 39/0 | — |
| 196 | Skip | pass | 40/0 | `src/lib.rs#test` |
| 197 | Verify | pass | 40/0 | — |
| 198 | Refactor | pass | 40/0 | `src/lib.rs` |
| 199 | Refactor | pass | 40/0 | `src/lib.rs` |
| 200 | Verify | pass | 40/0 | — |
| 201 | Skip | pass | 41/0 | `src/lib.rs#test` |
| 202 | Verify | pass | 41/0 | — |
| 203 | Refactor | pass | 41/0 | `src/lib.rs` |
| 204 | Refactor | pass | 41/0 | `src/lib.rs` |
| 205 | Refactor | pass | 41/0 | `src/lib.rs` |
| 206 | Skip | pass | 42/0 | `src/lib.rs#test` |
| 207 | Verify | pass | 42/0 | — |
| 208 | Refactor | pass | 42/0 | `src/lib.rs` |
| 209 | Verify | pass | 42/0 | — |
| 210 | Refactor | pass | 42/0 | `src/lib.rs` |
| 211 | Refactor | pass | 42/0 | `src/lib.rs` |
| 212 | Red | fail | 0/1 | `src/lib.rs#test` |
| 213 | Green | pass | 43/0 | `src/lib.rs` |
| 214 | Verify | pass | 43/0 | — |
| 215 | Refactor | pass | 43/0 | `src/lib.rs` |
| 216 | Verify | pass | 43/0 | — |
| 217 | Red | fail | 0/1 | `src/lib.rs#test` |
| 218 | Green | pass | 44/0 | `src/lib.rs` |
| 219 | Verify | pass | 44/0 | — |
| 220 | Refactor | pass | 44/0 | `src/lib.rs` |
| 221 | Verify | pass | 44/0 | — |
| 222 | Skip | pass | 45/0 | `src/lib.rs#test` |
| 223 | Verify | pass | 45/0 | — |
| 224 | Skip | pass | 45/0 | `src/lib.rs#test` |
| 225 | Verify | pass | 45/0 | — |
| 226 | Skip | pass | 45/0 | `src/lib.rs#test` |
| 227 | Skip | pass | 45/0 | `src/lib.rs#test` |
| 228 | Red | fail | 0/1 | `src/lib.rs#test` |
| 229 | Green | pass | 46/0 | `src/lib.rs` |
| 230 | Verify | pass | 46/0 | — |
| 231 | Refactor | pass | 46/0 | `src/lib.rs` |
| 232 | Verify | pass | 46/0 | — |
| 233 | Verify | pass | 46/0 | — |
| 234 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 235 | Red | fail | 0/1 | `src/lib.rs` |
| 236 | Green | pass | 47/0 | `src/lib.rs` |
| 237 | Verify | pass | 47/0 | — |
| 238 | Refactor | pass | 47/0 | `src/lib.rs` |
| 239 | Refactor | pass | 47/0 | `src/lib.rs` |
| 240 | Refactor | pass | 47/0 | `src/lib.rs` |
| 241 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 242 | Red | fail | 0/1 | `src/lib.rs` |
| 243 | Both | pass | 48/0 | `src/lib.rs`, `src/lib.rs#test` |
| 244 | Verify | pass | 48/0 | — |
| 245 | Refactor | pass | 48/0 | `src/lib.rs` |
| 246 | Refactor | pass | 48/0 | `src/lib.rs` |
| 247 | Red | fail | 0/1 | `src/lib.rs#test` |
| 248 | Green?(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 249 | Green | pass | 49/0 | `src/lib.rs` |
| 250 | Verify | pass | 49/0 | — |
| 251 | Break(c) | fail (1 collect err) | 0/0 | `src/lib.rs` |
| 252 | Verify | fail (1 collect err) | 0/0 | — |
| 253 | Refactor | pass | 49/0 | `src/lib.rs` |
| 254 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 255 | Both | fail | 0/1 | `src/lib.rs`, `src/lib.rs#test` |
| 256 | Refactor | fail | 0/1 | `src/lib.rs` |
| 257 | Verify | fail | 0/1 | — |
| 258 | Green | pass | 50/0 | `src/lib.rs` |
| 259 | Refactor | pass | 50/0 | `src/main.rs` |
| 260 | Refactor | pass | 50/0 | `src/lib.rs`, `src/wire.rs` |
| 261 | Refactor | pass | 50/0 | `src/wire.rs` |
| 262 | Refactor | pass | 50/0 | `src/wire.rs` |
| 263 | Refactor | pass | 50/0 | `src/wire.rs` |
| 264 | Refactor | pass | 50/0 | `src/wire.rs` |
| 265 | Refactor | pass | 50/0 | `src/main.rs` |
| 266 | Skip | pass | 50/0 | `src/lib.rs#test` |
| 267 | Verify | pass | 50/0 | — |
| 268 | Verify | pass | 50/0 | — |

Final suite state: **pass**.

