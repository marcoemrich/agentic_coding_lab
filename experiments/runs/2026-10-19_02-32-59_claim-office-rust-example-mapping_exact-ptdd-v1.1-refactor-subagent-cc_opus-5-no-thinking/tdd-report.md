# TDD phase chain — 2026-10-19_02-32-59_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

**301 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red(c) -> Both -> Green -> Verify -> Refactor -> Verify -> Red(c) -> Both -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Skip -> Verify -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Both -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Red(c) -> Red -> Green -> Verify -> Both -> Verify -> Skip -> Verify -> Skip -> Verify -> Red(c) -> Green -> Verify -> Break(c) -> Refactor -> Skip -> Verify -> Red(c) -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Red -> Green -> Verify -> Red(c) -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Skip -> Verify -> Refactor -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Red(c) -> Both -> Verify -> Refactor -> Verify -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Refactor -> Red(c) -> Both -> Red -> Skip -> Verify -> Refactor -> Verify -> Red(c) -> Red -> Green -> Verify -> Both -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Verify -> Red -> Green?(c) -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Break(c) -> Refactor -> Red(c) -> Red -> Green? -> Verify -> Green? -> Verify -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Verify -> Skip -> Red -> Green -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Red(c) -> Verify -> Red -> Green? -> Skip -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Skip -> Skip -> Skip -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Skip -> Red -> Green -> Verify -> Refactor -> Verify
```

Deviations present: `Both` ×7 (test and implementation changed together — no verified red), `Break(c)` ×2 (implementation change broke compilation of a green suite), `Green?` ×3 (implementation changed, still failing), `Green?(c)` ×1 (implementation changed, does not compile), `Skip` ×37 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 301 |
| `cycles_total` | 72 |
| `cycles_closed` | 31 |
| `test_first_rate` | 0.506 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 16 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 83 |
| `skip_events` | 37 |
| `refactor_per_cycle` | 2.677 |
| `green_attempts` | 0.129 |
| `deviations` | 46 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.602 |
| `tdd_discipline_test_first` | 0.506 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.431 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (31 of 72 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–8`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor
  4. `9–15`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify
  5. `16–20`  Red -> Green -> Verify -> Refactor -> Refactor
  6. `21–25`  Red -> Green -> Verify -> Refactor -> Refactor
  7. `26–29`  Red -> Green -> Verify -> Refactor
  8. `30–34`  Red -> Green -> Verify -> Refactor -> Verify
  9. `35–39`  Red -> Green -> Verify -> Refactor -> Refactor
 10. `40–42`  Skip -> Verify -> Refactor  ← never closed
 11. `43–47`  Red -> Green -> Verify -> Refactor -> Verify
 12. `48–51`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 13. `52–55`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 14. `56–58`  Skip -> Verify -> Refactor  ← never closed
 15. `59–62`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 16. `63–68`  Red(c) -> Both -> Green -> Verify -> Refactor -> Verify
 17. `69–73`  Red(c) -> Both -> Green -> Verify -> Refactor
 18. `74–77`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 19. `78–80`  Skip -> Verify -> Verify  ← never closed
 20. `81–83`  Skip -> Verify -> Refactor  ← never closed
 21. `84–88`  Red(c) -> Red -> Green -> Verify -> Refactor
 22. `89–90`  Both -> Verify  ← never closed
 23. `91–94`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 24. `95–97`  Skip -> Verify -> Refactor  ← never closed
 25. `98–101`  Red(c) -> Red -> Green -> Verify
 26. `102–103`  Both -> Verify  ← never closed
 27. `104–105`  Skip -> Verify  ← never closed
 28. `106–108`  Skip -> Verify -> Verify  ← never closed
 29. `109–113`  Red(c) -> Green -> Verify -> Break(c) -> Refactor
 30. `114–116`  Skip -> Verify -> Verify  ← never closed
 31. `117–122`  Red(c) -> Red -> Green -> Verify -> Refactor -> Verify
 32. `123–124`  Skip -> Verify  ← never closed
 33. `125–126`  Skip -> Verify  ← never closed
 34. `127–127`  Skip  ← never closed
 35. `128–131`  Red -> Green -> Verify -> Verify
 36. `132–138`  Red(c) -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor
 37. `139–141`  Skip -> Verify -> Verify  ← never closed
 38. `142–144`  Skip -> Verify -> Refactor  ← never closed
 39. `145–146`  Skip -> Verify  ← never closed
 40. `147–152`  Red -> Green -> Verify -> Refactor -> Refactor -> Verify
 41. `153–156`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 42. `157–165`  Red(c) -> Both -> Verify -> Refactor -> Verify -> Green -> Verify -> Refactor -> Verify
 43. `166–170`  Skip -> Verify -> Refactor -> Verify -> Refactor  ← never closed
 44. `171–177`  Red(c) -> Both -> Red -> Skip -> Verify -> Refactor -> Verify  ← never closed
 45. `178–181`  Red(c) -> Red -> Green -> Verify
 46. `182–185`  Both -> Verify -> Verify -> Refactor  ← never closed
 47. `186–188`  Skip -> Verify -> Refactor  ← never closed
 48. `189–196`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Verify
 49. `197–201`  Red -> Green?(c) -> Green -> Verify -> Refactor
 50. `202–204`  Skip -> Verify -> Refactor  ← never closed
 51. `205–213`  Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Refactor -> Refactor -> Refactor
 52. `214–220`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 53. `221–221`  Skip  ← never closed
 54. `222–225`  Red -> Green -> Verify -> Refactor
 55. `226–231`  Red -> Green -> Verify -> Refactor -> Break(c) -> Refactor
 56. `232–244`  Red(c) -> Red -> Green? -> Verify -> Verify -> Green? -> Verify -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 57. `245–245`  Skip  ← never closed
 58. `246–252`  Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Verify
 59. `253–253`  Skip  ← never closed
 60. `254–258`  Red -> Green -> Verify -> Refactor -> Verify
 61. `259–266`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor
 62. `267–271`  Red(c) -> Verify -> Red -> Green? -> Skip  ← never closed
 63. `272–275`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 64. `276–276`  Skip  ← never closed
 65. `277–284`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 66. `285–286`  Skip -> Verify  ← never closed
 67. `287–287`  Skip  ← never closed
 68. `288–288`  Skip  ← never closed
 69. `289–291`  Skip -> Refactor -> Refactor  ← never closed
 70. `292–295`  Skip -> Verify -> Refactor -> Verify  ← never closed
 71. `296–296`  Skip  ← never closed
 72. `297–301`  Red -> Green -> Verify -> Refactor -> Verify

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 91 | nothing changed, suite re-run |
| `Refactor` | 83 | implementation changed, suite stayed green |
| `Skip` | 37 | test arrived and passed immediately — never red |
| `Green` | 31 | implementation changed, suite went green |
| `Red` | 29 | a new failing test arrived |
| `Red(c)` | 16 | test arrived, suite does not compile yet |
| `Both` | 7 | test and implementation changed together — no verified red |
| `Green?` | 3 | implementation changed, still failing |
| `Break(c)` | 2 | implementation change broke compilation of a green suite |
| `Start` | 1 | first invocation |
| `Green?(c)` | 1 | implementation changed, does not compile |

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
| 9 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 10 | Red | fail | 1/1 | `src/lib.rs` |
| 11 | Green | pass | 2/0 | `src/lib.rs` |
| 12 | Verify | pass | 2/0 | — |
| 13 | Refactor | pass | 2/0 | `src/lib.rs` |
| 14 | Refactor | pass | 2/0 | `src/lib.rs` |
| 15 | Verify | pass | 2/0 | — |
| 16 | Red | fail | 2/1 | `src/lib.rs#test` |
| 17 | Green | pass | 3/0 | `src/lib.rs` |
| 18 | Verify | pass | 3/0 | — |
| 19 | Refactor | pass | 3/0 | `src/lib.rs` |
| 20 | Refactor | pass | 3/0 | `src/lib.rs` |
| 21 | Red | fail | 3/1 | `src/lib.rs#test` |
| 22 | Green | pass | 4/0 | `src/lib.rs` |
| 23 | Verify | pass | 4/0 | — |
| 24 | Refactor | pass | 4/0 | `src/lib.rs` |
| 25 | Refactor | pass | 4/0 | `src/lib.rs` |
| 26 | Red | fail | 4/1 | `src/lib.rs#test` |
| 27 | Green | pass | 5/0 | `src/lib.rs` |
| 28 | Verify | pass | 5/0 | — |
| 29 | Refactor | pass | 5/0 | `src/lib.rs` |
| 30 | Red | fail | 5/1 | `src/lib.rs#test` |
| 31 | Green | pass | 6/0 | `src/lib.rs` |
| 32 | Verify | pass | 6/0 | — |
| 33 | Refactor | pass | 6/0 | `src/lib.rs` |
| 34 | Verify | pass | 6/0 | — |
| 35 | Red | fail | 6/1 | `src/lib.rs#test` |
| 36 | Green | pass | 7/0 | `src/lib.rs` |
| 37 | Verify | pass | 7/0 | — |
| 38 | Refactor | pass | 7/0 | `src/lib.rs` |
| 39 | Refactor | pass | 7/0 | `src/lib.rs` |
| 40 | Skip | pass | 8/0 | `src/lib.rs#test` |
| 41 | Verify | pass | 8/0 | — |
| 42 | Refactor | pass | 8/0 | `src/lib.rs` |
| 43 | Red | fail | 8/1 | `src/lib.rs#test` |
| 44 | Green | pass | 9/0 | `src/lib.rs` |
| 45 | Verify | pass | 9/0 | — |
| 46 | Refactor | pass | 9/0 | `src/lib.rs` |
| 47 | Verify | pass | 9/0 | — |
| 48 | Skip | pass | 10/0 | `src/lib.rs#test` |
| 49 | Verify | pass | 10/0 | — |
| 50 | Refactor | pass | 10/0 | `src/lib.rs` |
| 51 | Refactor | pass | 10/0 | `src/lib.rs` |
| 52 | Skip | pass | 11/0 | `src/lib.rs#test` |
| 53 | Verify | pass | 11/0 | — |
| 54 | Refactor | pass | 11/0 | `src/lib.rs` |
| 55 | Refactor | pass | 11/0 | `src/lib.rs` |
| 56 | Skip | pass | 12/0 | `src/lib.rs#test` |
| 57 | Verify | pass | 12/0 | — |
| 58 | Refactor | pass | 12/0 | `src/lib.rs` |
| 59 | Skip | pass | 13/0 | `src/lib.rs#test` |
| 60 | Verify | pass | 13/0 | — |
| 61 | Refactor | pass | 13/0 | `src/lib.rs` |
| 62 | Refactor | pass | 13/0 | `src/lib.rs` |
| 63 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 64 | Both | fail | 13/1 | `src/lib.rs`, `src/lib.rs#test` |
| 65 | Green | pass | 14/0 | `src/lib.rs` |
| 66 | Verify | pass | 14/0 | — |
| 67 | Refactor | pass | 14/0 | `src/lib.rs` |
| 68 | Verify | pass | 14/0 | — |
| 69 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 70 | Both | fail | 14/1 | `src/lib.rs`, `src/lib.rs#test` |
| 71 | Green | pass | 15/0 | `src/lib.rs` |
| 72 | Verify | pass | 15/0 | — |
| 73 | Refactor | pass | 15/0 | `src/lib.rs` |
| 74 | Skip | pass | 16/0 | `src/lib.rs#test` |
| 75 | Verify | pass | 16/0 | — |
| 76 | Refactor | pass | 16/0 | `src/lib.rs` |
| 77 | Refactor | pass | 16/0 | `src/lib.rs` |
| 78 | Skip | pass | 17/0 | `src/lib.rs#test` |
| 79 | Verify | pass | 17/0 | — |
| 80 | Verify | pass | 17/0 | — |
| 81 | Skip | pass | 18/0 | `src/lib.rs#test` |
| 82 | Verify | pass | 18/0 | — |
| 83 | Refactor | pass | 18/0 | `src/lib.rs` |
| 84 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 85 | Red | fail | 18/1 | `src/lib.rs` |
| 86 | Green | pass | 19/0 | `src/lib.rs` |
| 87 | Verify | pass | 19/0 | — |
| 88 | Refactor | pass | 19/0 | `src/lib.rs` |
| 89 | Both | pass | 19/0 | `src/lib.rs`, `src/lib.rs#test` |
| 90 | Verify | pass | 19/0 | — |
| 91 | Skip | pass | 20/0 | `src/lib.rs#test` |
| 92 | Verify | pass | 20/0 | — |
| 93 | Refactor | pass | 20/0 | `src/lib.rs` |
| 94 | Refactor | pass | 20/0 | `src/lib.rs` |
| 95 | Skip | pass | 21/0 | `src/lib.rs#test` |
| 96 | Verify | pass | 21/0 | — |
| 97 | Refactor | pass | 21/0 | `src/lib.rs` |
| 98 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 99 | Red | fail | 21/1 | `src/lib.rs` |
| 100 | Green | pass | 22/0 | `src/lib.rs` |
| 101 | Verify | pass | 22/0 | — |
| 102 | Both | pass | 22/0 | `src/lib.rs`, `src/lib.rs#test` |
| 103 | Verify | pass | 22/0 | — |
| 104 | Skip | pass | 23/0 | `src/lib.rs#test` |
| 105 | Verify | pass | 23/0 | — |
| 106 | Skip | pass | 24/0 | `src/lib.rs#test` |
| 107 | Verify | pass | 24/0 | — |
| 108 | Verify | pass | 24/0 | — |
| 109 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 110 | Green | pass | 25/0 | `src/lib.rs#test` |
| 111 | Verify | pass | 25/0 | — |
| 112 | Break(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 113 | Refactor | pass | 25/0 | `src/lib.rs` |
| 114 | Skip | pass | 26/0 | `src/lib.rs#test` |
| 115 | Verify | pass | 26/0 | — |
| 116 | Verify | pass | 26/0 | — |
| 117 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 118 | Red | fail | 26/1 | `src/lib.rs` |
| 119 | Green | pass | 27/0 | `src/lib.rs` |
| 120 | Verify | pass | 27/0 | — |
| 121 | Refactor | pass | 27/0 | `src/lib.rs` |
| 122 | Verify | pass | 27/0 | — |
| 123 | Skip | pass | 28/0 | `src/lib.rs#test` |
| 124 | Verify | pass | 28/0 | — |
| 125 | Skip | pass | 29/0 | `src/lib.rs#test` |
| 126 | Verify | pass | 29/0 | — |
| 127 | Skip | pass | 29/0 | `src/lib.rs#test` |
| 128 | Red | fail | 29/1 | `src/lib.rs#test` |
| 129 | Green | pass | 30/0 | `src/lib.rs` |
| 130 | Verify | pass | 30/0 | — |
| 131 | Verify | pass | 30/0 | — |
| 132 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 133 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 134 | Red | fail | 30/1 | `src/lib.rs` |
| 135 | Green | pass | 31/0 | `src/lib.rs` |
| 136 | Verify | pass | 31/0 | — |
| 137 | Refactor | pass | 31/0 | `src/lib.rs` |
| 138 | Refactor | pass | 31/0 | `src/lib.rs` |
| 139 | Skip | pass | 32/0 | `src/lib.rs#test` |
| 140 | Verify | pass | 32/0 | — |
| 141 | Verify | pass | 32/0 | — |
| 142 | Skip | pass | 33/0 | `src/lib.rs#test` |
| 143 | Verify | pass | 33/0 | — |
| 144 | Refactor | pass | 33/0 | `src/lib.rs` |
| 145 | Skip | pass | 34/0 | `src/lib.rs#test` |
| 146 | Verify | pass | 34/0 | — |
| 147 | Red | fail | 34/1 | `src/lib.rs#test` |
| 148 | Green | pass | 35/0 | `src/lib.rs` |
| 149 | Verify | pass | 35/0 | — |
| 150 | Refactor | pass | 35/0 | `src/lib.rs` |
| 151 | Refactor | pass | 35/0 | `src/lib.rs` |
| 152 | Verify | pass | 35/0 | — |
| 153 | Skip | pass | 36/0 | `src/lib.rs#test` |
| 154 | Verify | pass | 36/0 | — |
| 155 | Refactor | pass | 36/0 | `src/lib.rs` |
| 156 | Refactor | pass | 36/0 | `src/lib.rs` |
| 157 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 158 | Both | pass | 37/0 | `src/lib.rs`, `src/lib.rs#test` |
| 159 | Verify | pass | 37/0 | — |
| 160 | Refactor | pass | 37/0 | `src/lib.rs` |
| 161 | Verify | pass | 37/0 | — |
| 162 | Green | pass | 38/0 | `src/lib.rs#test` |
| 163 | Verify | pass | 38/0 | — |
| 164 | Refactor | pass | 38/0 | `src/lib.rs` |
| 165 | Verify | pass | 38/0 | — |
| 166 | Skip | pass | 39/0 | `src/lib.rs#test` |
| 167 | Verify | pass | 39/0 | — |
| 168 | Refactor | pass | 39/0 | `src/lib.rs` |
| 169 | Verify | pass | 39/0 | — |
| 170 | Refactor | pass | 39/0 | `src/lib.rs` |
| 171 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 172 | Both | fail | 39/1 | `src/lib.rs`, `src/lib.rs#test` |
| 173 | Red | fail | 31/9 | `src/lib.rs` |
| 174 | Skip | pass | 40/0 | `src/lib.rs#test` |
| 175 | Verify | pass | 40/0 | — |
| 176 | Refactor | pass | 40/0 | `src/lib.rs` |
| 177 | Verify | pass | 40/0 | — |
| 178 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 179 | Red | fail | 40/1 | `src/lib.rs` |
| 180 | Green | pass | 41/0 | `src/lib.rs` |
| 181 | Verify | pass | 41/0 | — |
| 182 | Both | pass | 41/0 | `src/lib.rs`, `src/lib.rs#test` |
| 183 | Verify | pass | 41/0 | — |
| 184 | Verify | pass | 41/0 | — |
| 185 | Refactor | pass | 41/0 | `src/lib.rs` |
| 186 | Skip | pass | 42/0 | `src/lib.rs#test` |
| 187 | Verify | pass | 42/0 | — |
| 188 | Refactor | pass | 42/0 | `src/lib.rs` |
| 189 | Red | fail | 0/1 | `src/lib.rs#test` |
| 190 | Green | pass | 43/0 | `src/lib.rs` |
| 191 | Verify | pass | 43/0 | — |
| 192 | Refactor | pass | 43/0 | `src/lib.rs` |
| 193 | Refactor | pass | 43/0 | `src/lib.rs` |
| 194 | Refactor | pass | 43/0 | `src/lib.rs` |
| 195 | Refactor | pass | 43/0 | `src/lib.rs` |
| 196 | Verify | pass | 43/0 | — |
| 197 | Red | fail | 0/1 | `src/lib.rs#test` |
| 198 | Green?(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 199 | Green | pass | 44/0 | `src/lib.rs` |
| 200 | Verify | pass | 44/0 | — |
| 201 | Refactor | pass | 44/0 | `src/lib.rs` |
| 202 | Skip | pass | 45/0 | `src/lib.rs#test` |
| 203 | Verify | pass | 45/0 | — |
| 204 | Refactor | pass | 45/0 | `src/lib.rs` |
| 205 | Red | fail | 0/1 | `src/lib.rs#test` |
| 206 | Green | pass | 46/0 | `src/lib.rs` |
| 207 | Verify | pass | 46/0 | — |
| 208 | Refactor | pass | 46/0 | `src/lib.rs` |
| 209 | Verify | pass | 46/0 | — |
| 210 | Refactor | pass | 46/0 | `src/lib.rs` |
| 211 | Refactor | pass | 46/0 | `src/lib.rs` |
| 212 | Refactor | pass | 46/0 | `src/lib.rs` |
| 213 | Refactor | pass | 46/0 | `src/lib.rs` |
| 214 | Red | fail | 0/1 | `src/lib.rs#test` |
| 215 | Green | pass | 47/0 | `src/lib.rs` |
| 216 | Verify | pass | 47/0 | — |
| 217 | Refactor | pass | 47/0 | `src/lib.rs` |
| 218 | Refactor | pass | 47/0 | `src/lib.rs` |
| 219 | Refactor | pass | 47/0 | `src/lib.rs` |
| 220 | Verify | pass | 47/0 | — |
| 221 | Skip | pass | 47/0 | `src/lib.rs#test` |
| 222 | Red | fail | 0/1 | `src/lib.rs#test` |
| 223 | Green | pass | 48/0 | `src/lib.rs` |
| 224 | Verify | pass | 48/0 | — |
| 225 | Refactor | pass | 48/0 | `src/lib.rs` |
| 226 | Red | fail | 0/1 | `src/lib.rs#test` |
| 227 | Green | pass | 49/0 | `src/lib.rs` |
| 228 | Verify | pass | 49/0 | — |
| 229 | Refactor | pass | 49/0 | `src/lib.rs` |
| 230 | Break(c) | fail (2 collect err) | 0/0 | `src/lib.rs` |
| 231 | Refactor | pass | 49/0 | `src/lib.rs` |
| 232 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 233 | Red | fail | 0/1 | `src/lib.rs` |
| 234 | Green? | fail | 0/1 | `src/lib.rs` |
| 235 | Verify | fail | 0/1 | — |
| 236 | Verify | fail | 0/1 | — |
| 237 | Green? | fail | 49/1 | `src/lib.rs` |
| 238 | Verify | fail | 49/1 | — |
| 239 | Green | pass | 50/0 | `src/lib.rs` |
| 240 | Verify | pass | 50/0 | — |
| 241 | Refactor | pass | 50/0 | `src/lib.rs` |
| 242 | Refactor | pass | 50/0 | `src/lib.rs` |
| 243 | Refactor | pass | 50/0 | `src/lib.rs` |
| 244 | Verify | pass | 50/0 | — |
| 245 | Skip | pass | 50/0 | `src/lib.rs#test` |
| 246 | Red | fail | 0/1 | `src/lib.rs#test` |
| 247 | Green | pass | 51/0 | `src/lib.rs` |
| 248 | Verify | pass | 51/0 | — |
| 249 | Refactor | pass | 51/0 | `src/lib.rs` |
| 250 | Verify | pass | 51/0 | — |
| 251 | Refactor | pass | 51/0 | `src/lib.rs` |
| 252 | Verify | pass | 51/0 | — |
| 253 | Skip | pass | 51/0 | `src/lib.rs#test` |
| 254 | Red | fail | 0/1 | `src/lib.rs#test` |
| 255 | Green | pass | 52/0 | `src/lib.rs` |
| 256 | Verify | pass | 52/0 | — |
| 257 | Refactor | pass | 52/0 | `src/lib.rs` |
| 258 | Verify | pass | 52/0 | — |
| 259 | Red | fail | 0/1 | `src/lib.rs#test` |
| 260 | Green | pass | 53/0 | `src/lib.rs` |
| 261 | Verify | pass | 53/0 | — |
| 262 | Refactor | pass | 53/0 | `src/lib.rs` |
| 263 | Refactor | pass | 53/0 | `src/lib.rs` |
| 264 | Refactor | pass | 53/0 | `src/lib.rs` |
| 265 | Refactor | pass | 53/0 | `src/lib.rs` |
| 266 | Refactor | pass | 53/0 | `src/lib.rs` |
| 267 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 268 | Verify | fail (1 collect err) | 0/0 | — |
| 269 | Red | fail | 0/1 | `src/lib.rs` |
| 270 | Green? | fail | 53/1 | `src/lib.rs` |
| 271 | Skip | pass | 54/0 | `src/lib.rs#test` |
| 272 | Skip | pass | 54/0 | `src/lib.rs#test` |
| 273 | Verify | pass | 54/0 | — |
| 274 | Refactor | pass | 54/0 | `src/lib.rs` |
| 275 | Refactor | pass | 54/0 | `src/lib.rs` |
| 276 | Skip | pass | 54/0 | `tests/cli.rs#test` |
| 277 | Red(c) | fail (1 collect err) | 0/0 | `tests/cli.rs#test` |
| 278 | Red | fail | 0/1 | `src/main.rs` |
| 279 | Green | pass | 55/0 | `src/main.rs` |
| 280 | Verify | pass | 55/0 | — |
| 281 | Refactor | pass | 55/0 | `src/main.rs` |
| 282 | Refactor | pass | 55/0 | `src/lib.rs` |
| 283 | Refactor | pass | 55/0 | `src/lib.rs` |
| 284 | Verify | pass | 55/0 | — |
| 285 | Skip | pass | 2/0 | `tests/cli.rs#test` |
| 286 | Verify | pass | 56/0 | — |
| 287 | Skip | pass | 56/0 | `tests/cli.rs#test` |
| 288 | Skip | pass | 56/0 | `tests/cli.rs#test` |
| 289 | Skip | pass | 56/0 | `tests/cli.rs#test` |
| 290 | Refactor | pass | 56/0 | `src/main.rs` |
| 291 | Refactor | pass | 56/0 | `src/main.rs` |
| 292 | Skip | pass | 57/0 | `tests/cli.rs#test` |
| 293 | Verify | pass | 57/0 | — |
| 294 | Refactor | pass | 57/0 | `src/lib.rs` |
| 295 | Verify | pass | 57/0 | — |
| 296 | Skip | pass | 57/0 | `src/lib.rs#test` |
| 297 | Red | fail | 0/1 | `src/lib.rs#test` |
| 298 | Green | pass | 58/0 | `src/lib.rs` |
| 299 | Verify | pass | 58/0 | — |
| 300 | Refactor | pass | 58/0 | `src/lib.rs` |
| 301 | Verify | pass | 58/0 | — |

Final suite state: **pass**.

