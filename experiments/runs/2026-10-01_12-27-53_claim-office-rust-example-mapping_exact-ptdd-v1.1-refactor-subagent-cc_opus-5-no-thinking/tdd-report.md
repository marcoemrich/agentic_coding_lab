# TDD phase chain — 2026-10-01_12-27-53_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

**266 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Skip -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Green -> Verify -> Refactor -> Verify -> Red(c) -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Green -> Verify -> Red(c) -> Green -> Verify -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Red(c) -> Verify -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Refactor -> Verify -> Refactor -> Refactor -> Verify -> Refactor -> Verify -> Red(c) -> Green -> Verify -> Refactor -> Skip -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Verify -> Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red(c) -> Both -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Red(c) -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Red(c) -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Red(c) -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Red(c) -> Red -> Green -> Refactor -> Skip -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Both -> Both -> Refactor -> Refactor -> Refactor -> Refactor -> Verify -> Both -> Refactor -> Refactor -> Verify
```

Deviations present: `Both` ×4 (test and implementation changed together — no verified red), `Skip` ×28 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 266 |
| `cycles_total` | 54 |
| `cycles_closed` | 23 |
| `test_first_rate` | 0.492 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 17 |
| `green_batch_size` | 8.0 |
| `refactor_events` | 86 |
| `skip_events` | 28 |
| `refactor_per_cycle` | 3.739 |
| `green_attempts` | 0.0 |
| `deviations` | 32 |
| `opens_red` | False |
| `ends_green` | True |
| `tdd_discipline` | 0.594 |
| `tdd_discipline_test_first` | 0.492 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.426 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (23 of 54 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–2`  Skip  ← never closed
  3. `3–8`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor
  4. `9–14`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor
  5. `15–19`  Red(c) -> Green -> Verify -> Refactor -> Verify
  6. `20–24`  Red(c) -> Green -> Verify -> Refactor -> Refactor
  7. `25–29`  Red(c) -> Green -> Verify -> Refactor -> Refactor
  8. `30–33`  Red(c) -> Green -> Verify -> Verify
  9. `34–38`  Red(c) -> Green -> Verify -> Refactor -> Refactor
 10. `39–45`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor
 11. `46–51`  Red(c) -> Verify -> Green -> Verify -> Refactor -> Refactor
 12. `52–60`  Red -> Green -> Refactor -> Verify -> Refactor -> Refactor -> Verify -> Refactor -> Verify
 13. `61–65`  Red(c) -> Green -> Verify -> Verify -> Refactor
 14. `66–66`  Skip  ← never closed
 15. `67–74`  Skip -> Verify -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor  ← never closed
 16. `75–78`  Skip -> Verify -> Verify -> Refactor  ← never closed
 17. `79–81`  Skip -> Verify -> Verify  ← never closed
 18. `82–88`  Red(c) -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor
 19. `89–93`  Red(c) -> Red -> Green -> Verify -> Refactor
 20. `94–97`  Skip -> Verify -> Verify -> Refactor  ← never closed
 21. `98–103`  Skip -> Verify -> Verify -> Refactor -> Verify -> Refactor  ← never closed
 22. `104–107`  Red -> Green -> Verify -> Refactor
 23. `108–112`  Skip -> Verify -> Verify -> Refactor -> Refactor  ← never closed
 24. `113–118`  Red(c) -> Both -> Green -> Verify -> Refactor -> Refactor
 25. `119–125`  Skip -> Verify -> Verify -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 26. `126–132`  Skip -> Verify -> Verify -> Refactor -> Refactor -> Refactor -> Verify  ← never closed
 27. `133–137`  Skip -> Verify -> Verify -> Refactor -> Verify  ← never closed
 28. `138–141`  Skip -> Verify -> Verify -> Refactor  ← never closed
 29. `142–147`  Skip -> Verify -> Verify -> Refactor -> Refactor -> Refactor  ← never closed
 30. `148–152`  Red(c) -> Red -> Green -> Verify -> Refactor
 31. `153–157`  Skip -> Verify -> Verify -> Refactor -> Refactor  ← never closed
 32. `158–161`  Red -> Green -> Verify -> Refactor
 33. `162–165`  Skip -> Verify -> Verify -> Refactor  ← never closed
 34. `166–173`  Red(c) -> Green -> Verify -> Verify -> Verify -> Refactor -> Refactor -> Refactor
 35. `174–177`  Skip -> Verify -> Verify -> Refactor  ← never closed
 36. `178–181`  Skip -> Verify -> Verify -> Refactor  ← never closed
 37. `182–186`  Skip -> Verify -> Verify -> Refactor -> Refactor  ← never closed
 38. `187–190`  Skip -> Verify -> Verify -> Verify  ← never closed
 39. `191–195`  Red(c) -> Red -> Green -> Verify -> Refactor
 40. `196–199`  Skip -> Verify -> Verify -> Refactor  ← never closed
 41. `200–203`  Skip -> Verify -> Verify -> Refactor  ← never closed
 42. `204–207`  Red -> Green -> Verify -> Refactor
 43. `208–212`  Skip -> Verify -> Verify -> Refactor -> Refactor  ← never closed
 44. `213–216`  Skip -> Verify -> Verify -> Refactor  ← never closed
 45. `217–221`  Red -> Green -> Verify -> Refactor -> Verify
 46. `222–225`  Skip -> Verify -> Verify -> Refactor  ← never closed
 47. `226–230`  Skip -> Verify -> Verify -> Refactor -> Verify  ← never closed
 48. `231–237`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 49. `238–241`  Red(c) -> Red -> Green -> Refactor
 50. `242–242`  Skip  ← never closed
 51. `243–248`  Skip -> Verify -> Verify -> Refactor -> Refactor -> Refactor  ← never closed
 52. `249–253`  Skip -> Verify -> Verify -> Refactor -> Refactor  ← never closed
 53. `254–260`  Both -> Both -> Refactor -> Refactor -> Refactor -> Refactor -> Verify  ← never closed
 54. `261–266`  Both -> Refactor -> Refactor -> Verify -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 93 | nothing changed, suite re-run |
| `Refactor` | 86 | implementation changed, suite stayed green |
| `Skip` | 28 | test arrived and passed immediately — never red |
| `Green` | 23 | implementation changed, suite went green |
| `Red(c)` | 17 | test arrived, suite does not compile yet |
| `Red` | 14 | a new failing test arrived |
| `Both` | 4 | test and implementation changed together — no verified red |
| `Start` | 1 | first invocation |

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
| 10 | Red | fail | 0/1 | `src/lib.rs` |
| 11 | Green | pass | 2/0 | `src/lib.rs` |
| 12 | Verify | pass | 2/0 | — |
| 13 | Refactor | pass | 2/0 | `src/lib.rs` |
| 14 | Refactor | pass | 2/0 | `src/lib.rs` |
| 15 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 16 | Green | pass | 3/0 | `src/lib.rs` |
| 17 | Verify | pass | 3/0 | — |
| 18 | Refactor | pass | 3/0 | `src/lib.rs` |
| 19 | Verify | pass | 3/0 | — |
| 20 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 21 | Green | pass | 4/0 | `src/lib.rs` |
| 22 | Verify | pass | 4/0 | — |
| 23 | Refactor | pass | 4/0 | `src/lib.rs` |
| 24 | Refactor | pass | 4/0 | `src/lib.rs` |
| 25 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 26 | Green | pass | 5/0 | `src/lib.rs` |
| 27 | Verify | pass | 5/0 | — |
| 28 | Refactor | pass | 5/0 | `src/lib.rs` |
| 29 | Refactor | pass | 5/0 | `src/lib.rs` |
| 30 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 31 | Green | pass | 6/0 | `src/lib.rs` |
| 32 | Verify | pass | 6/0 | — |
| 33 | Verify | pass | 6/0 | — |
| 34 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 35 | Green | pass | 7/0 | `src/lib.rs` |
| 36 | Verify | pass | 7/0 | — |
| 37 | Refactor | pass | 7/0 | `src/lib.rs` |
| 38 | Refactor | pass | 7/0 | `src/lib.rs` |
| 39 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 40 | Red | fail | 0/1 | `src/lib.rs` |
| 41 | Green | pass | 8/0 | `src/lib.rs` |
| 42 | Verify | pass | 8/0 | — |
| 43 | Refactor | pass | 8/0 | `src/lib.rs` |
| 44 | Refactor | pass | 8/0 | `src/lib.rs` |
| 45 | Refactor | pass | 8/0 | `src/lib.rs` |
| 46 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 47 | Verify | fail (1 collect err) | 0/0 | — |
| 48 | Green | pass | 9/0 | `src/lib.rs` |
| 49 | Verify | pass | 9/0 | — |
| 50 | Refactor | pass | 9/0 | `src/lib.rs` |
| 51 | Refactor | pass | 9/0 | `src/lib.rs` |
| 52 | Red | fail | 0/1 | `src/lib.rs#test` |
| 53 | Green | fail | 6/4 | `src/lib.rs` |
| 54 | Refactor | pass | 10/0 | `src/lib.rs` |
| 55 | Verify | pass | 10/0 | — |
| 56 | Refactor | pass | 10/0 | `src/lib.rs` |
| 57 | Refactor | pass | 10/0 | `src/lib.rs` |
| 58 | Verify | pass | 10/0 | — |
| 59 | Refactor | pass | 10/0 | `src/lib.rs` |
| 60 | Verify | pass | 10/0 | — |
| 61 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 62 | Green | pass | 1/0 | `src/lib.rs#test` |
| 63 | Verify | pass | 11/0 | — |
| 64 | Verify | pass | 11/0 | — |
| 65 | Refactor | pass | 11/0 | `src/lib.rs` |
| 66 | Skip | pass | 11/0 | `src/lib.rs#test` |
| 67 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 68 | Verify | pass | 12/0 | — |
| 69 | Verify | pass | 12/0 | — |
| 70 | Refactor | pass | 12/0 | `src/lib.rs` |
| 71 | Refactor | pass | 12/0 | `src/lib.rs` |
| 72 | Refactor | pass | 12/0 | `src/lib.rs` |
| 73 | Refactor | pass | 12/0 | `src/lib.rs` |
| 74 | Refactor | pass | 12/0 | `src/lib.rs` |
| 75 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 76 | Verify | pass | 13/0 | — |
| 77 | Verify | pass | 13/0 | — |
| 78 | Refactor | pass | 13/0 | `src/lib.rs` |
| 79 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 80 | Verify | pass | 14/0 | — |
| 81 | Verify | pass | 14/0 | — |
| 82 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 83 | Red | fail | 0/1 | `src/lib.rs` |
| 84 | Green | pass | 15/0 | `src/lib.rs` |
| 85 | Verify | pass | 15/0 | — |
| 86 | Refactor | pass | 15/0 | `src/lib.rs` |
| 87 | Refactor | pass | 15/0 | `src/lib.rs` |
| 88 | Refactor | pass | 15/0 | `src/lib.rs` |
| 89 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 90 | Red | fail | 0/1 | `src/lib.rs` |
| 91 | Green | pass | 16/0 | `src/lib.rs` |
| 92 | Verify | pass | 16/0 | — |
| 93 | Refactor | pass | 16/0 | `src/lib.rs` |
| 94 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 95 | Verify | pass | 17/0 | — |
| 96 | Verify | pass | 17/0 | — |
| 97 | Refactor | pass | 17/0 | `src/lib.rs` |
| 98 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 99 | Verify | pass | 18/0 | — |
| 100 | Verify | pass | 18/0 | — |
| 101 | Refactor | pass | 18/0 | `src/lib.rs` |
| 102 | Verify | pass | 18/0 | — |
| 103 | Refactor | pass | 18/0 | `src/lib.rs` |
| 104 | Red | fail | 0/1 | `src/lib.rs#test` |
| 105 | Green | pass | 19/0 | `src/lib.rs` |
| 106 | Verify | pass | 19/0 | — |
| 107 | Refactor | pass | 19/0 | `src/lib.rs` |
| 108 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 109 | Verify | pass | 20/0 | — |
| 110 | Verify | pass | 20/0 | — |
| 111 | Refactor | pass | 20/0 | `src/lib.rs` |
| 112 | Refactor | pass | 20/0 | `src/lib.rs` |
| 113 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 114 | Both | fail | 20/1 | `src/lib.rs`, `src/lib.rs#test` |
| 115 | Green | pass | 21/0 | `src/lib.rs` |
| 116 | Verify | pass | 21/0 | — |
| 117 | Refactor | pass | 21/0 | `src/lib.rs` |
| 118 | Refactor | pass | 21/0 | `src/lib.rs` |
| 119 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 120 | Verify | pass | 22/0 | — |
| 121 | Verify | pass | 22/0 | — |
| 122 | Verify | pass | 22/0 | — |
| 123 | Refactor | pass | 22/0 | `src/lib.rs` |
| 124 | Refactor | pass | 22/0 | `src/lib.rs` |
| 125 | Verify | pass | 22/0 | — |
| 126 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 127 | Verify | pass | 23/0 | — |
| 128 | Verify | pass | 23/0 | — |
| 129 | Refactor | pass | 23/0 | `src/lib.rs` |
| 130 | Refactor | pass | 23/0 | `src/lib.rs` |
| 131 | Refactor | pass | 23/0 | `src/lib.rs` |
| 132 | Verify | pass | 23/0 | — |
| 133 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 134 | Verify | pass | 24/0 | — |
| 135 | Verify | pass | 24/0 | — |
| 136 | Refactor | pass | 24/0 | `src/lib.rs` |
| 137 | Verify | pass | 24/0 | — |
| 138 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 139 | Verify | pass | 25/0 | — |
| 140 | Verify | pass | 25/0 | — |
| 141 | Refactor | pass | 25/0 | `src/lib.rs` |
| 142 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 143 | Verify | pass | 26/0 | — |
| 144 | Verify | pass | 26/0 | — |
| 145 | Refactor | pass | 26/0 | `src/lib.rs` |
| 146 | Refactor | pass | 26/0 | `src/lib.rs` |
| 147 | Refactor | pass | 26/0 | `src/lib.rs` |
| 148 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 149 | Red | fail | 0/1 | `src/lib.rs` |
| 150 | Green | pass | 27/0 | `src/lib.rs` |
| 151 | Verify | pass | 27/0 | — |
| 152 | Refactor | pass | 27/0 | `src/lib.rs` |
| 153 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 154 | Verify | pass | 28/0 | — |
| 155 | Verify | pass | 28/0 | — |
| 156 | Refactor | pass | 28/0 | `src/lib.rs` |
| 157 | Refactor | pass | 28/0 | `src/lib.rs` |
| 158 | Red | fail | 0/1 | `src/lib.rs#test` |
| 159 | Green | pass | 29/0 | `src/lib.rs` |
| 160 | Verify | pass | 29/0 | — |
| 161 | Refactor | pass | 29/0 | `src/lib.rs` |
| 162 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 163 | Verify | pass | 30/0 | — |
| 164 | Verify | pass | 30/0 | — |
| 165 | Refactor | pass | 30/0 | `src/lib.rs` |
| 166 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 167 | Green | pass | 1/0 | `src/lib.rs` |
| 168 | Verify | pass | 31/0 | — |
| 169 | Verify | pass | 31/0 | — |
| 170 | Verify | pass | 31/0 | — |
| 171 | Refactor | pass | 31/0 | `src/lib.rs` |
| 172 | Refactor | pass | 31/0 | `src/lib.rs` |
| 173 | Refactor | pass | 31/0 | `src/lib.rs` |
| 174 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 175 | Verify | pass | 32/0 | — |
| 176 | Verify | pass | 32/0 | — |
| 177 | Refactor | pass | 32/0 | `src/lib.rs` |
| 178 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 179 | Verify | pass | 33/0 | — |
| 180 | Verify | pass | 33/0 | — |
| 181 | Refactor | pass | 33/0 | `src/lib.rs` |
| 182 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 183 | Verify | pass | 34/0 | — |
| 184 | Verify | pass | 34/0 | — |
| 185 | Refactor | pass | 34/0 | `src/lib.rs` |
| 186 | Refactor | pass | 34/0 | `src/lib.rs` |
| 187 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 188 | Verify | pass | 35/0 | — |
| 189 | Verify | pass | 35/0 | — |
| 190 | Verify | pass | 35/0 | — |
| 191 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 192 | Red | fail | 0/1 | `src/lib.rs` |
| 193 | Green | pass | 36/0 | `src/lib.rs` |
| 194 | Verify | pass | 36/0 | — |
| 195 | Refactor | pass | 36/0 | `src/lib.rs` |
| 196 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 197 | Verify | pass | 37/0 | — |
| 198 | Verify | pass | 37/0 | — |
| 199 | Refactor | pass | 37/0 | `src/lib.rs` |
| 200 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 201 | Verify | pass | 38/0 | — |
| 202 | Verify | pass | 38/0 | — |
| 203 | Refactor | pass | 38/0 | `src/lib.rs` |
| 204 | Red | fail | 0/1 | `src/lib.rs#test` |
| 205 | Green | pass | 39/0 | `src/lib.rs` |
| 206 | Verify | pass | 39/0 | — |
| 207 | Refactor | pass | 39/0 | `src/lib.rs` |
| 208 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 209 | Verify | pass | 40/0 | — |
| 210 | Verify | pass | 40/0 | — |
| 211 | Refactor | pass | 40/0 | `src/lib.rs` |
| 212 | Refactor | pass | 40/0 | `src/lib.rs` |
| 213 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 214 | Verify | pass | 41/0 | — |
| 215 | Verify | pass | 41/0 | — |
| 216 | Refactor | pass | 41/0 | `src/lib.rs` |
| 217 | Red | fail | 0/1 | `src/lib.rs#test` |
| 218 | Green | pass | 42/0 | `src/lib.rs` |
| 219 | Verify | pass | 42/0 | — |
| 220 | Refactor | pass | 42/0 | `src/lib.rs` |
| 221 | Verify | pass | 42/0 | — |
| 222 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 223 | Verify | pass | 43/0 | — |
| 224 | Verify | pass | 43/0 | — |
| 225 | Refactor | pass | 43/0 | `src/lib.rs` |
| 226 | Skip | pass | 2/0 | `src/lib.rs#test` |
| 227 | Verify | pass | 44/0 | — |
| 228 | Verify | pass | 44/0 | — |
| 229 | Refactor | pass | 44/0 | `src/lib.rs` |
| 230 | Verify | pass | 44/0 | — |
| 231 | Red | fail | 0/1 | `src/lib.rs#test` |
| 232 | Green | pass | 45/0 | `src/lib.rs` |
| 233 | Verify | pass | 45/0 | — |
| 234 | Refactor | pass | 45/0 | `src/lib.rs` |
| 235 | Refactor | pass | 45/0 | `src/lib.rs` |
| 236 | Refactor | pass | 45/0 | `src/lib.rs` |
| 237 | Verify | pass | 45/0 | — |
| 238 | Red(c) | fail (1 collect err) | 0/0 | `src/lib.rs#test` |
| 239 | Red | fail | 0/1 | `src/lib.rs` |
| 240 | Green | pass | 46/0 | `src/lib.rs` |
| 241 | Refactor | pass | 46/0 | `src/lib.rs` |
| 242 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 243 | Skip | pass | 46/0 | `src/lib.rs#test` |
| 244 | Verify | pass | 46/0 | — |
| 245 | Verify | pass | 46/0 | — |
| 246 | Refactor | pass | 46/0 | `src/lib.rs` |
| 247 | Refactor | pass | 46/0 | `src/lib.rs` |
| 248 | Refactor | pass | 46/0 | `src/lib.rs` |
| 249 | Skip | pass | 1/0 | `src/lib.rs#test` |
| 250 | Verify | pass | 47/0 | — |
| 251 | Verify | pass | 47/0 | — |
| 252 | Refactor | pass | 47/0 | `src/lib.rs` |
| 253 | Refactor | pass | 47/0 | `src/lib.rs` |
| 254 | Both | fail (1 collect err) | 0/0 | `src/lib.rs`, `src/lib.rs#test` |
| 255 | Both | fail (1 collect err) | 0/0 | `src/lib.rs`, `src/lib.rs#test` |
| 256 | Refactor | pass | 49/0 | `src/lib.rs` |
| 257 | Refactor | pass | 49/0 | `src/lib.rs` |
| 258 | Refactor | pass | 49/0 | `src/lib.rs` |
| 259 | Refactor | pass | 49/0 | `src/main.rs` |
| 260 | Verify | pass | 49/0 | — |
| 261 | Both | pass | 49/0 | `src/lib.rs`, `src/lib.rs#test` |
| 262 | Refactor | pass | 49/0 | `src/lib.rs` |
| 263 | Refactor | pass | 49/0 | `src/lib.rs` |
| 264 | Verify | pass | 49/0 | — |
| 265 | Verify | pass | 49/0 | — |
| 266 | Verify | pass | 49/0 | — |

Final suite state: **pass**.

