# TDD phase chain — 2026-10-01_12-17-52_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

**277 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Skip -> Verify -> Skip -> Verify -> Refactor -> Skip -> Skip -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Skip -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Skip -> Verify -> Refactor -> Red(c) -> Both -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Skip -> Red(c) -> Both -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Skip -> Verify -> Red(c) -> Green -> Verify -> Skip -> Skip -> Verify -> Skip -> Verify -> Both -> Both -> Skip -> Verify -> Skip -> Verify -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Both -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Skip -> Skip -> Verify -> Refactor -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Both -> Both -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Skip -> Skip -> Red -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Skip -> Refactor -> Verify -> Red(c) -> Both -> Green -> Verify -> Refactor -> Skip -> Verify -> Red(c) -> Both -> Break(c) -> Verify -> Both -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Red(c) -> Both -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Red(c) -> Red -> Verify -> Green? -> Green -> Both -> Refactor -> Verify -> Refactor -> Verify
```

Deviations present: `Both` ×12 (test and implementation changed together — no verified red), `Break(c)` ×1 (implementation change broke compilation of a green suite), `Green?` ×1 (implementation changed, still failing), `Skip` ×43 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 277 |
| `cycles_total` | 78 |
| `cycles_closed` | 28 |
| `test_first_rate` | 0.389 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 12 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 74 |
| `skip_events` | 43 |
| `refactor_per_cycle` | 2.643 |
| `green_attempts` | 0.036 |
| `deviations` | 56 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.519 |
| `tdd_discipline_test_first` | 0.389 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.359 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (28 of 78 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–8`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor
  4. `9–14`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor
  5. `15–19`  Red -> Green -> Verify -> Refactor -> Refactor
  6. `20–24`  Red -> Green -> Verify -> Refactor -> Refactor
  7. `25–29`  Red -> Green -> Verify -> Refactor -> Refactor
  8. `30–33`  Red -> Green -> Verify -> Refactor
  9. `34–37`  Red -> Green -> Verify -> Refactor
 10. `38–41`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 11. `42–47`  Red -> Green -> Verify -> Verify -> Refactor -> Refactor
 12. `48–50`  Skip -> Verify -> Refactor  ← never closed
 13. `51–51`  Skip  ← never closed
 14. `52–53`  Skip -> Verify  ← never closed
 15. `54–56`  Skip -> Verify -> Refactor  ← never closed
 16. `57–57`  Skip  ← never closed
 17. `58–61`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 18. `62–67`  Red -> Green -> Verify -> Refactor -> Refactor -> Verify
 19. `68–71`  Red -> Green -> Verify -> Refactor
 20. `72–73`  Skip -> Verify  ← never closed
 21. `74–74`  Skip  ← never closed
 22. `75–78`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 23. `79–80`  Skip -> Verify  ← never closed
 24. `81–83`  Skip -> Verify -> Refactor  ← never closed
 25. `84–89`  Red(c) -> Both -> Green -> Verify -> Refactor -> Refactor
 26. `90–91`  Skip -> Verify  ← never closed
 27. `92–92`  Skip  ← never closed
 28. `93–97`  Red(c) -> Both -> Green -> Verify -> Refactor
 29. `98–100`  Skip -> Verify -> Refactor  ← never closed
 30. `101–101`  Skip  ← never closed
 31. `102–103`  Skip -> Verify  ← never closed
 32. `104–106`  Red(c) -> Green -> Verify
 33. `107–107`  Skip  ← never closed
 34. `108–110`  Skip -> Verify -> Verify  ← never closed
 35. `111–112`  Skip -> Verify  ← never closed
 36. `113–113`  Both  ← never closed
 37. `114–114`  Both  ← never closed
 38. `115–117`  Skip -> Verify -> Verify  ← never closed
 39. `118–120`  Skip -> Verify -> Verify  ← never closed
 40. `121–128`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 41. `129–131`  Skip -> Verify -> Refactor  ← never closed
 42. `132–132`  Both  ← never closed
 43. `133–134`  Skip -> Verify  ← never closed
 44. `135–138`  Red -> Green -> Verify -> Refactor
 45. `139–140`  Skip -> Verify  ← never closed
 46. `141–141`  Skip  ← never closed
 47. `142–144`  Skip -> Verify -> Refactor  ← never closed
 48. `145–146`  Skip -> Verify  ← never closed
 49. `147–149`  Skip -> Verify -> Verify  ← never closed
 50. `150–151`  Skip -> Verify  ← never closed
 51. `152–154`  Skip -> Verify -> Refactor  ← never closed
 52. `155–159`  Red(c) -> Red -> Green -> Verify -> Refactor
 53. `160–160`  Both  ← never closed
 54. `161–162`  Both -> Verify  ← never closed
 55. `163–167`  Red -> Green -> Verify -> Refactor -> Refactor
 56. `168–169`  Skip -> Verify  ← never closed
 57. `170–170`  Skip  ← never closed
 58. `171–171`  Skip  ← never closed
 59. `172–177`  Red -> Green -> Verify -> Verify -> Refactor -> Refactor
 60. `178–179`  Skip -> Verify  ← never closed
 61. `180–182`  Skip -> Refactor -> Verify  ← never closed
 62. `183–187`  Red(c) -> Both -> Green -> Verify -> Refactor
 63. `188–189`  Skip -> Verify  ← never closed
 64. `190–198`  Red(c) -> Both -> Break(c) -> Verify -> Both -> Green -> Verify -> Refactor -> Refactor
 65. `199–202`  Red -> Green -> Verify -> Refactor
 66. `203–207`  Skip -> Verify -> Refactor -> Refactor -> Refactor  ← never closed
 67. `208–217`  Red(c) -> Both -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Refactor
 68. `218–220`  Skip -> Verify -> Verify  ← never closed
 69. `221–227`  Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Verify
 70. `228–234`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor
 71. `235–239`  Skip -> Verify -> Refactor -> Refactor -> Refactor  ← never closed
 72. `240–246`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify
 73. `247–248`  Skip -> Verify  ← never closed
 74. `249–254`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor
 75. `255–263`  Red -> Green -> Verify -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor
 76. `264–266`  Skip -> Verify -> Verify  ← never closed
 77. `267–271`  Red(c) -> Red -> Verify -> Green? -> Green
 78. `272–277`  Both -> Refactor -> Verify -> Refactor -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 82 | nothing changed, suite re-run |
| `Refactor` | 74 | implementation changed, suite stayed green |
| `Skip` | 43 | test arrived and passed immediately — never red |
| `Green` | 28 | implementation changed, suite went green |
| `Red` | 23 | a new failing test arrived |
| `Red(c)` | 12 | test arrived, suite does not compile yet |
| `Both` | 12 | test and implementation changed together — no verified red |
| `Start` | 1 | first invocation |
| `Break(c)` | 1 | implementation change broke compilation of a green suite |
| `Green?` | 1 | implementation changed, still failing |

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
| 15 | Red | fail | 2/1 | `src/lib.rs#test` |
| 16 | Green | pass | 3/0 | `src/lib.rs` |
| 17 | Verify | pass | 3/0 | — |
| 18 | Refactor | pass | 3/0 | `src/lib.rs` |
| 19 | Refactor | pass | 3/0 | `src/lib.rs` |
| 20 | Red | fail | 3/1 | `src/lib.rs#test` |
| 21 | Green | pass | 4/0 | `src/lib.rs` |
| 22 | Verify | pass | 4/0 | — |
| 23 | Refactor | pass | 4/0 | `src/lib.rs` |
| 24 | Refactor | pass | 4/0 | `src/lib.rs` |
| 25 | Red | fail | 4/1 | `src/lib.rs#test` |
| 26 | Green | pass | 5/0 | `src/lib.rs` |
| 27 | Verify | pass | 5/0 | — |
| 28 | Refactor | pass | 5/0 | `src/lib.rs` |
| 29 | Refactor | pass | 5/0 | `src/lib.rs` |
| 30 | Red | fail | 5/1 | `src/lib.rs#test` |
| 31 | Green | pass | 6/0 | `src/lib.rs` |
| 32 | Verify | pass | 6/0 | — |
| 33 | Refactor | pass | 6/0 | `src/lib.rs` |
| 34 | Red | fail | 6/1 | `src/lib.rs#test` |
| 35 | Green | pass | 7/0 | `src/lib.rs` |
| 36 | Verify | pass | 7/0 | — |
| 37 | Refactor | pass | 7/0 | `src/lib.rs` |
| 38 | Skip | pass | 8/0 | `src/lib.rs#test` |
| 39 | Verify | pass | 8/0 | — |
| 40 | Refactor | pass | 8/0 | `src/lib.rs` |
| 41 | Refactor | pass | 8/0 | `src/lib.rs` |
| 42 | Red | fail | 8/1 | `src/lib.rs#test` |
| 43 | Green | pass | 9/0 | `src/lib.rs` |
| 44 | Verify | pass | 9/0 | — |
| 45 | Verify | pass | 9/0 | — |
| 46 | Refactor | pass | 9/0 | `src/lib.rs` |
| 47 | Refactor | pass | 9/0 | `src/lib.rs` |
| 48 | Skip | pass | 10/0 | `src/lib.rs#test` |
| 49 | Verify | pass | 10/0 | — |
| 50 | Refactor | pass | 10/0 | `src/lib.rs` |
| 51 | Skip | pass | 10/0 | `src/lib.rs#test` |
| 52 | Skip | pass | 11/0 | `src/lib.rs#test` |
| 53 | Verify | pass | 11/0 | — |
| 54 | Skip | pass | 12/0 | `src/lib.rs#test` |
| 55 | Verify | pass | 12/0 | — |
| 56 | Refactor | pass | 12/0 | `src/lib.rs` |
| 57 | Skip | pass | 12/0 | `src/lib.rs#test` |
| 58 | Skip | pass | 13/0 | `src/lib.rs#test` |
| 59 | Verify | pass | 13/0 | — |
| 60 | Refactor | pass | 13/0 | `src/lib.rs` |
| 61 | Refactor | pass | 13/0 | `src/lib.rs` |
| 62 | Red | fail | 13/1 | `src/lib.rs#test` |
| 63 | Green | pass | 14/0 | `src/lib.rs` |
| 64 | Verify | pass | 14/0 | — |
| 65 | Refactor | pass | 14/0 | `src/lib.rs` |
| 66 | Refactor | pass | 14/0 | `src/lib.rs` |
| 67 | Verify | pass | 14/0 | — |
| 68 | Red | fail | 14/1 | `src/lib.rs#test` |
| 69 | Green | pass | 15/0 | `src/lib.rs` |
| 70 | Verify | pass | 15/0 | — |
| 71 | Refactor | pass | 15/0 | `src/lib.rs` |
| 72 | Skip | pass | 16/0 | `src/lib.rs#test` |
| 73 | Verify | pass | 16/0 | — |
| 74 | Skip | pass | 16/0 | `src/lib.rs#test` |
| 75 | Skip | pass | 17/0 | `src/lib.rs#test` |
| 76 | Verify | pass | 17/0 | — |
| 77 | Refactor | pass | 17/0 | `src/lib.rs` |
| 78 | Refactor | pass | 17/0 | `src/lib.rs` |
| 79 | Skip | pass | 18/0 | `src/lib.rs#test` |
| 80 | Verify | pass | 18/0 | — |
| 81 | Skip | pass | 19/0 | `src/lib.rs#test` |
| 82 | Verify | pass | 19/0 | — |
| 83 | Refactor | pass | 19/0 | `src/lib.rs` |
| 84 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 85 | Both | fail | 19/1 | `src/lib.rs`, `src/lib.rs#test` |
| 86 | Green | pass | 20/0 | `src/lib.rs` |
| 87 | Verify | pass | 20/0 | — |
| 88 | Refactor | pass | 20/0 | `src/lib.rs` |
| 89 | Refactor | pass | 20/0 | `src/lib.rs` |
| 90 | Skip | pass | 21/0 | `src/lib.rs#test` |
| 91 | Verify | pass | 21/0 | — |
| 92 | Skip | pass | 21/0 | `src/lib.rs#test` |
| 93 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 94 | Both | fail | 21/1 | `src/lib.rs`, `src/lib.rs#test` |
| 95 | Green | pass | 22/0 | `src/lib.rs` |
| 96 | Verify | pass | 22/0 | — |
| 97 | Refactor | pass | 22/0 | `src/lib.rs` |
| 98 | Skip | pass | 23/0 | `src/lib.rs#test` |
| 99 | Verify | pass | 23/0 | — |
| 100 | Refactor | pass | 23/0 | `src/lib.rs` |
| 101 | Skip | pass | 23/0 | `src/lib.rs#test` |
| 102 | Skip | pass | 23/0 | `src/lib.rs#test` |
| 103 | Verify | pass | 23/0 | — |
| 104 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 105 | Green | pass | 24/0 | `src/lib.rs#test` |
| 106 | Verify | pass | 24/0 | — |
| 107 | Skip | pass | 24/0 | `src/lib.rs#test` |
| 108 | Skip | pass | 25/0 | `src/lib.rs#test` |
| 109 | Verify | pass | 25/0 | — |
| 110 | Verify | pass | 25/0 | — |
| 111 | Skip | pass | 26/0 | `src/lib.rs#test` |
| 112 | Verify | pass | 26/0 | — |
| 113 | Both | pass | 26/0 | `src/lib.rs`, `src/lib.rs#test`, `src/premium.rs`, `src/premium.rs#test` |
| 114 | Both | pass | 26/0 | `src/lib.rs`, `src/lib.rs#test`, `src/premium.rs`, `src/premium.rs#test` |
| 115 | Skip | pass | 27/0 | `src/lib.rs#test` |
| 116 | Verify | pass | 27/0 | — |
| 117 | Verify | pass | 27/0 | — |
| 118 | Skip | pass | 28/0 | `src/lib.rs#test` |
| 119 | Verify | pass | 28/0 | — |
| 120 | Verify | pass | 28/0 | — |
| 121 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 122 | Red | fail | 28/1 | `src/lib.rs` |
| 123 | Green | pass | 29/0 | `src/lib.rs` |
| 124 | Verify | pass | 29/0 | — |
| 125 | Refactor | pass | 29/0 | `src/lib.rs` |
| 126 | Refactor | pass | 29/0 | `src/lib.rs` |
| 127 | Refactor | pass | 29/0 | `src/lib.rs` |
| 128 | Verify | pass | 29/0 | — |
| 129 | Skip | pass | 30/0 | `src/lib.rs#test` |
| 130 | Verify | pass | 30/0 | — |
| 131 | Refactor | pass | 30/0 | `src/lib.rs` |
| 132 | Both | pass | 30/0 | `src/lib.rs`, `src/lib.rs#test` |
| 133 | Skip | pass | 31/0 | `src/lib.rs#test` |
| 134 | Verify | pass | 31/0 | — |
| 135 | Red | fail | 31/1 | `src/lib.rs#test` |
| 136 | Green | pass | 32/0 | `src/lib.rs` |
| 137 | Verify | pass | 32/0 | — |
| 138 | Refactor | pass | 32/0 | `src/lib.rs` |
| 139 | Skip | pass | 33/0 | `src/lib.rs#test` |
| 140 | Verify | pass | 33/0 | — |
| 141 | Skip | pass | 33/0 | `src/lib.rs#test` |
| 142 | Skip | pass | 34/0 | `src/lib.rs#test` |
| 143 | Verify | pass | 34/0 | — |
| 144 | Refactor | pass | 34/0 | `src/lib.rs` |
| 145 | Skip | pass | 35/0 | `src/lib.rs#test` |
| 146 | Verify | pass | 35/0 | — |
| 147 | Skip | pass | 35/0 | `src/lib.rs#test` |
| 148 | Verify | pass | 35/0 | — |
| 149 | Verify | pass | 35/0 | — |
| 150 | Skip | pass | 36/0 | `src/lib.rs#test` |
| 151 | Verify | pass | 36/0 | — |
| 152 | Skip | pass | 37/0 | `src/lib.rs#test` |
| 153 | Verify | pass | 37/0 | — |
| 154 | Refactor | pass | 37/0 | `src/lib.rs` |
| 155 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 156 | Red | fail | 37/1 | `src/lib.rs` |
| 157 | Green | pass | 38/0 | `src/lib.rs` |
| 158 | Verify | pass | 38/0 | — |
| 159 | Refactor | pass | 38/0 | `src/lib.rs` |
| 160 | Both | pass | 0/0 | `src/lib.rs`, `src/lib.rs#test` |
| 161 | Both | pass | 38/0 | `src/lib.rs`, `src/lib.rs#test` |
| 162 | Verify | pass | 38/0 | — |
| 163 | Red | fail | 38/1 | `src/lib.rs#test` |
| 164 | Green | pass | 39/0 | `src/lib.rs` |
| 165 | Verify | pass | 39/0 | — |
| 166 | Refactor | pass | 39/0 | `src/lib.rs` |
| 167 | Refactor | pass | 39/0 | `src/lib.rs` |
| 168 | Skip | pass | 40/0 | `src/lib.rs#test` |
| 169 | Verify | pass | 40/0 | — |
| 170 | Skip | pass | 40/0 | `src/lib.rs#test` |
| 171 | Skip | pass | 40/0 | `src/lib.rs#test` |
| 172 | Red | fail | 40/1 | `src/lib.rs#test` |
| 173 | Green | pass | 41/0 | `src/lib.rs` |
| 174 | Verify | pass | 41/0 | — |
| 175 | Verify | pass | 41/0 | — |
| 176 | Refactor | pass | 41/0 | `src/lib.rs` |
| 177 | Refactor | pass | 41/0 | `src/lib.rs` |
| 178 | Skip | pass | 42/0 | `src/lib.rs#test` |
| 179 | Verify | pass | 42/0 | — |
| 180 | Skip | pass | 42/0 | `src/lib.rs#test` |
| 181 | Refactor | pass | 42/0 | `src/lib.rs` |
| 182 | Verify | pass | 42/0 | — |
| 183 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 184 | Both | fail | 42/1 | `src/lib.rs`, `src/lib.rs#test` |
| 185 | Green | pass | 43/0 | `src/lib.rs` |
| 186 | Verify | pass | 43/0 | — |
| 187 | Refactor | pass | 43/0 | `src/lib.rs` |
| 188 | Skip | pass | 44/0 | `src/lib.rs#test` |
| 189 | Verify | pass | 44/0 | — |
| 190 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 191 | Both | fail (1 collect err) | 0/0 | `src/lib.rs`, `src/lib.rs#test` |
| 192 | Break(c) | fail (1 collect err) | 0/0 | `src/lib.rs` |
| 193 | Verify | fail (1 collect err) | 0/0 | — |
| 194 | Both | fail | 44/1 | `src/lib.rs`, `src/lib.rs#test` |
| 195 | Green | pass | 45/0 | `src/lib.rs` |
| 196 | Verify | pass | 45/0 | — |
| 197 | Refactor | pass | 45/0 | `src/lib.rs` |
| 198 | Refactor | pass | 45/0 | `src/lib.rs` |
| 199 | Red | fail | 45/1 | `src/lib.rs#test` |
| 200 | Green | pass | 46/0 | `src/lib.rs` |
| 201 | Verify | pass | 46/0 | — |
| 202 | Refactor | pass | 46/0 | `src/lib.rs` |
| 203 | Skip | pass | 47/0 | `src/lib.rs#test` |
| 204 | Verify | pass | 47/0 | — |
| 205 | Refactor | pass | 47/0 | `src/lib.rs` |
| 206 | Refactor | pass | 47/0 | `src/lib.rs` |
| 207 | Refactor | pass | 47/0 | `src/lib.rs` |
| 208 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 209 | Both | fail (1 collect err) | 0/0 | `src/lib.rs`, `src/lib.rs#test` |
| 210 | Verify | fail (1 collect err) | 0/0 | — |
| 211 | Red | fail | 47/1 | `src/lib.rs#test` |
| 212 | Green | pass | 48/0 | `src/lib.rs` |
| 213 | Verify | pass | 48/0 | — |
| 214 | Refactor | pass | 48/0 | `src/lib.rs` |
| 215 | Verify | pass | 48/0 | — |
| 216 | Refactor | pass | 48/0 | `src/lib.rs` |
| 217 | Refactor | pass | 48/0 | `src/lib.rs` |
| 218 | Skip | pass | 48/0 | `src/lib.rs#test` |
| 219 | Verify | pass | 48/0 | — |
| 220 | Verify | pass | 48/0 | — |
| 221 | Red | fail | 48/1 | `src/lib.rs#test` |
| 222 | Green | pass | 49/0 | `src/lib.rs` |
| 223 | Verify | pass | 49/0 | — |
| 224 | Refactor | pass | 49/0 | `src/lib.rs` |
| 225 | Verify | pass | 49/0 | — |
| 226 | Refactor | pass | 49/0 | `src/lib.rs` |
| 227 | Verify | pass | 49/0 | — |
| 228 | Red | fail | 49/1 | `src/lib.rs#test` |
| 229 | Green | pass | 50/0 | `src/lib.rs` |
| 230 | Verify | pass | 50/0 | — |
| 231 | Refactor | pass | 50/0 | `src/lib.rs` |
| 232 | Refactor | pass | 50/0 | `src/lib.rs` |
| 233 | Refactor | pass | 50/0 | `src/lib.rs` |
| 234 | Refactor | pass | 50/0 | `src/lib.rs` |
| 235 | Skip | pass | 51/0 | `src/lib.rs#test` |
| 236 | Verify | pass | 51/0 | — |
| 237 | Refactor | pass | 51/0 | `src/lib.rs` |
| 238 | Refactor | pass | 51/0 | `src/lib.rs` |
| 239 | Refactor | pass | 51/0 | `src/lib.rs` |
| 240 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 241 | Red | fail | 51/1 | `src/lib.rs` |
| 242 | Green | pass | 52/0 | `src/lib.rs` |
| 243 | Verify | pass | 52/0 | — |
| 244 | Refactor | pass | 52/0 | `src/lib.rs` |
| 245 | Refactor | pass | 52/0 | `src/lib.rs` |
| 246 | Verify | pass | 52/0 | — |
| 247 | Skip | pass | 54/0 | `src/lib.rs#test` |
| 248 | Verify | pass | 1/0 | — |
| 249 | Red | fail | 53/1 | `src/lib.rs#test` |
| 250 | Green | pass | 54/0 | `src/lib.rs` |
| 251 | Verify | pass | 54/0 | — |
| 252 | Refactor | pass | 54/0 | `src/lib.rs` |
| 253 | Refactor | pass | 54/0 | `src/lib.rs` |
| 254 | Refactor | pass | 54/0 | `src/lib.rs` |
| 255 | Red | fail | 54/1 | `src/lib.rs#test` |
| 256 | Green | pass | 55/0 | `src/lib.rs` |
| 257 | Verify | pass | 55/0 | — |
| 258 | Verify | pass | 55/0 | — |
| 259 | Refactor | pass | 55/0 | `src/lib.rs` |
| 260 | Refactor | pass | 55/0 | `src/lib.rs` |
| 261 | Refactor | pass | 55/0 | `src/lib.rs` |
| 262 | Refactor | pass | 55/0 | `src/lib.rs` |
| 263 | Refactor | pass | 55/0 | `src/lib.rs` |
| 264 | Skip | pass | 56/0 | `src/lib.rs#test` |
| 265 | Verify | pass | 56/0 | — |
| 266 | Verify | pass | 56/0 | — |
| 267 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 268 | Red | fail | 56/1 | `src/lib.rs` |
| 269 | Verify | fail | 0/1 | — |
| 270 | Green? | fail | 56/1 | `src/lib.rs` |
| 271 | Green | pass | 57/0 | `src/lib.rs` |
| 272 | Both | fail | 57/1 | `src/lib.rs#test`, `src/main.rs` |
| 273 | Refactor | pass | 58/0 | `src/lib.rs` |
| 274 | Verify | pass | 58/0 | — |
| 275 | Refactor | pass | 58/0 | `src/main.rs` |
| 276 | Verify | pass | 58/0 | — |
| 277 | Verify | pass | 58/0 | — |

Final suite state: **pass**.

