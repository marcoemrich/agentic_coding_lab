# TDD phase chain — 2026-10-19_06-18-28_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

**262 suite invocations.** Derived from `tdd-events.jsonl`; no workflow markers, tool calls or commits were read.

## Chain

```
Start -> Both -> Refactor -> Verify -> Red -> Green? -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Skip -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Red -> Verify -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify -> Refactor -> Verify -> Both -> Verify -> Refactor -> Verify -> Both -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Refactor -> Verify -> Red -> Green -> Verify -> Refactor -> Refactor -> Verify -> Red -> Green -> Verify -> Break -> Green -> Refactor -> Refactor -> Refactor -> Verify -> Red -> Green? -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Skip -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Skip -> Verify
```

Deviations present: `Both` ×3 (test and implementation changed together — no verified red), `Break` ×1 (implementation change broke a green suite), `Green?` ×2 (implementation changed, still failing), `Skip` ×33 (test arrived and passed immediately — never red)

## Metrics

| Metric | Value |
|---|---:|
| `suite_runs` | 262 |
| `cycles_total` | 54 |
| `cycles_closed` | 17 |
| `test_first_rate` | 0.333 |
| `red_batch_size` | 1.0 |
| `red_batch_max` | 1 |
| `red_batch_unmeasurable` | 0 |
| `green_batch_size` | 1.0 |
| `refactor_events` | 86 |
| `skip_events` | 33 |
| `refactor_per_cycle` | 5.059 |
| `green_attempts` | 0.118 |
| `deviations` | 37 |
| `opens_red` | False |
| `ends_green` | True |
| `verification_tests` | 0 |
| `verification_red` | 0 |
| `tdd_after_cutoff` | 0 |
| `tdd_discipline` | 0.472 |
| `tdd_discipline_test_first` | 0.333 |
| `tdd_discipline_step` | 1.0 |
| `tdd_discipline_closure` | 0.315 |

`red_batch_size` is the one to read for step size: 1 means one failing test at a time, higher means a batch of tests was authored before any implementation existed. `green_batch_size` is its mirror on the implementation side — the two separate when a workflow writes several tests up front and then implements them one by one.

## Cycles (17 of 54 closed with a Green)

  1. `1–1`  Start  ← never closed
  2. `2–5`  Both -> Refactor -> Verify -> Verify  ← never closed
  3. `6–13`  Red -> Green? -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
  4. `14–19`  Red -> Green -> Verify -> Refactor -> Refactor -> Verify
  5. `20–23`  Red -> Green -> Verify -> Verify
  6. `24–27`  Red -> Green -> Verify -> Verify
  7. `28–32`  Red -> Green -> Verify -> Refactor -> Refactor
  8. `33–37`  Red -> Green -> Verify -> Refactor -> Refactor
  9. `38–42`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 10. `43–46`  Red -> Green -> Verify -> Refactor
 11. `47–50`  Skip -> Verify -> Refactor -> Verify  ← never closed
 12. `51–54`  Skip -> Verify -> Refactor -> Verify  ← never closed
 13. `55–58`  Skip -> Verify -> Refactor -> Verify  ← never closed
 14. `59–64`  Skip -> Verify -> Refactor -> Refactor -> Refactor -> Verify  ← never closed
 15. `65–69`  Red -> Green -> Verify -> Refactor -> Verify
 16. `70–76`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 17. `77–79`  Skip -> Verify -> Verify  ← never closed
 18. `80–81`  Skip -> Verify  ← never closed
 19. `82–84`  Skip -> Verify -> Verify  ← never closed
 20. `85–93`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Refactor -> Verify
 21. `94–97`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 22. `98–100`  Skip -> Verify -> Refactor  ← never closed
 23. `101–107`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 24. `108–111`  Skip -> Verify -> Refactor -> Verify  ← never closed
 25. `112–115`  Skip -> Verify -> Refactor -> Verify  ← never closed
 26. `116–119`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 27. `120–124`  Skip -> Verify -> Refactor -> Verify -> Refactor  ← never closed
 28. `125–129`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 29. `130–139`  Red -> Verify -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify -> Verify -> Verify
 30. `140–150`  Red -> Green -> Verify -> Verify -> Refactor -> Verify -> Refactor -> Refactor -> Refactor -> Refactor -> Verify
 31. `151–155`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 32. `156–161`  Red -> Green -> Verify -> Refactor -> Refactor -> Verify
 33. `162–165`  Skip -> Verify -> Verify -> Verify  ← never closed
 34. `166–170`  Skip -> Verify -> Refactor -> Refactor -> Refactor  ← never closed
 35. `171–174`  Skip -> Verify -> Refactor -> Verify  ← never closed
 36. `175–177`  Skip -> Verify -> Refactor  ← never closed
 37. `178–182`  Skip -> Verify -> Refactor -> Refactor -> Verify  ← never closed
 38. `183–186`  Skip -> Verify -> Refactor -> Verify  ← never closed
 39. `187–190`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 40. `191–194`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 41. `195–198`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 42. `199–201`  Skip -> Verify -> Verify  ← never closed
 43. `202–205`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 44. `206–209`  Skip -> Verify -> Refactor -> Verify  ← never closed
 45. `210–213`  Both -> Verify -> Refactor -> Verify  ← never closed
 46. `214–216`  Both -> Refactor -> Verify  ← never closed
 47. `217–223`  Red -> Green -> Verify -> Refactor -> Refactor -> Refactor -> Verify
 48. `224–227`  Skip -> Verify -> Refactor -> Verify  ← never closed
 49. `228–233`  Red -> Green -> Verify -> Refactor -> Refactor -> Verify
 50. `234–243`  Red -> Green -> Verify -> Break -> Green -> Refactor -> Refactor -> Refactor -> Verify -> Verify
 51. `244–252`  Red -> Green? -> Verify -> Skip -> Verify -> Refactor -> Refactor -> Verify -> Verify  ← never closed
 52. `253–255`  Skip -> Verify -> Verify  ← never closed
 53. `256–259`  Skip -> Verify -> Refactor -> Refactor  ← never closed
 54. `260–262`  Skip -> Verify -> Verify  ← never closed

## Label counts

| Label | n | Meaning |
|---|---:|---|
| `Verify` | 100 | nothing changed, suite re-run |
| `Refactor` | 86 | implementation changed, suite stayed green |
| `Skip` | 33 | test arrived and passed immediately — never red |
| `Red` | 18 | a new failing test arrived |
| `Green` | 18 | implementation changed, suite went green |
| `Both` | 3 | test and implementation changed together — no verified red |
| `Green?` | 2 | implementation changed, still failing |
| `Start` | 1 | first invocation |
| `Break` | 1 | implementation change broke a green suite |

## Per invocation

| # | Phase | Suite | Tests p/f | Changed since previous |
|---:|---|---|---|---|
| 1 | Start | pass | 0/0 | _(initial tree: 1 files)_ |
| 2 | Both | fail | 0/1 | `src/main/java/ClaimOfficeCli.java`, `src/test/java/ClaimOfficeTest.java` |
| 3 | Refactor | pass | 1/0 | `src/main/java/ClaimOfficeCli.java` |
| 4 | Verify | pass | 1/0 | — |
| 5 | Verify | pass | 1/0 | — |
| 6 | Red | fail | 1/1 | `src/test/java/ClaimOfficeTest.java` |
| 7 | Green? | fail | 1/1 | `src/main/java/ClaimOfficeCli.java` |
| 8 | Green | pass | 2/0 | `src/main/java/ClaimOfficeCli.java` |
| 9 | Verify | pass | 2/0 | — |
| 10 | Refactor | pass | 2/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/Item.java`, `src/main/java/PremiumPolicy.java` |
| 11 | Refactor | pass | 2/0 | `src/main/java/PremiumPolicy.java` |
| 12 | Refactor | pass | 2/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/Item.java`, `src/main/java/PremiumPolicy.java` |
| 13 | Verify | pass | 2/0 | — |
| 14 | Red | fail | 2/1 | `src/test/java/ClaimOfficeTest.java` |
| 15 | Green | pass | 3/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/PremiumPolicy.java` |
| 16 | Verify | pass | 3/0 | — |
| 17 | Refactor | pass | 3/0 | `src/main/java/PremiumPolicy.java`, `src/main/java/PriceList.java` |
| 18 | Refactor | pass | 3/0 | `src/main/java/ClaimOfficeCli.java` |
| 19 | Verify | pass | 3/0 | — |
| 20 | Red | fail | 3/1 | `src/test/java/ClaimOfficeTest.java` |
| 21 | Green | pass | 4/0 | `src/main/java/PriceList.java` |
| 22 | Verify | pass | 4/0 | — |
| 23 | Verify | pass | 4/0 | — |
| 24 | Red | fail | 4/1 | `src/test/java/ClaimOfficeTest.java` |
| 25 | Green | pass | 5/0 | `src/main/java/PriceList.java` |
| 26 | Verify | pass | 5/0 | — |
| 27 | Verify | pass | 5/0 | — |
| 28 | Red | fail | 5/1 | `src/test/java/ClaimOfficeTest.java` |
| 29 | Green | pass | 6/0 | `src/main/java/PriceList.java` |
| 30 | Verify | pass | 6/0 | — |
| 31 | Refactor | pass | 6/0 | `src/main/java/PolicyBasePremium.java`, `src/main/java/PremiumPolicy.java` |
| 32 | Refactor | pass | 6/0 | `src/main/java/PolicyBasePremium.java`, `src/main/java/PremiumPolicy.java` |
| 33 | Red | fail | 6/1 | `src/test/java/ClaimOfficeTest.java` |
| 34 | Green | pass | 7/0 | `src/main/java/PriceList.java` |
| 35 | Verify | pass | 7/0 | — |
| 36 | Refactor | pass | 7/0 | `src/main/java/PriceList.java` |
| 37 | Refactor | pass | 7/0 | `src/main/java/PriceList.java` |
| 38 | Skip | pass | 8/0 | `src/test/java/ClaimOfficeTest.java` |
| 39 | Verify | pass | 8/0 | — |
| 40 | Refactor | pass | 8/0 | `src/main/java/PriceList.java` |
| 41 | Refactor | pass | 8/0 | `src/main/java/PriceList.java` |
| 42 | Verify | pass | 8/0 | — |
| 43 | Red | fail | 8/1 | `src/test/java/ClaimOfficeTest.java` |
| 44 | Green | pass | 9/0 | `src/main/java/PremiumPolicy.java`, `src/main/java/PriceList.java` |
| 45 | Verify | pass | 9/0 | — |
| 46 | Refactor | pass | 9/0 | `src/main/java/PremiumPolicy.java`, `src/main/java/PriceList.java` |
| 47 | Skip | pass | 10/0 | `src/test/java/ClaimOfficeTest.java` |
| 48 | Verify | pass | 10/0 | — |
| 49 | Refactor | pass | 10/0 | `src/main/java/PriceList.java` |
| 50 | Verify | pass | 10/0 | — |
| 51 | Skip | pass | 11/0 | `src/test/java/ClaimOfficeTest.java` |
| 52 | Verify | pass | 11/0 | — |
| 53 | Refactor | pass | 11/0 | `src/main/java/PriceList.java` |
| 54 | Verify | pass | 11/0 | — |
| 55 | Skip | pass | 12/0 | `src/test/java/ClaimOfficeTest.java` |
| 56 | Verify | pass | 12/0 | — |
| 57 | Refactor | pass | 12/0 | `src/main/java/PriceList.java` |
| 58 | Verify | pass | 12/0 | — |
| 59 | Skip | pass | 13/0 | `src/test/java/ClaimOfficeTest.java` |
| 60 | Verify | pass | 13/0 | — |
| 61 | Refactor | pass | 13/0 | `src/main/java/PremiumPolicy.java`, `src/main/java/PriceList.java` |
| 62 | Refactor | pass | 13/0 | `src/main/java/PriceList.java` |
| 63 | Refactor | pass | 13/0 | `src/main/java/PriceList.java` |
| 64 | Verify | pass | 13/0 | — |
| 65 | Red | fail | 13/1 | `src/test/java/ClaimOfficeTest.java` |
| 66 | Green | pass | 14/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/InsuredItem.java`, `src/main/java/PremiumPolicy.java`, `src/main/java/PriceList.java` |
| 67 | Verify | pass | 14/0 | — |
| 68 | Refactor | pass | 14/0 | `src/main/java/PremiumPolicy.java` |
| 69 | Verify | pass | 14/0 | — |
| 70 | Red | fail | 14/1 | `src/test/java/ClaimOfficeTest.java` |
| 71 | Green | pass | 15/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/InsuredItem.java`, `src/main/java/PremiumPolicy.java` |
| 72 | Verify | pass | 15/0 | — |
| 73 | Refactor | pass | 15/0 | `src/main/java/PremiumPolicy.java` |
| 74 | Refactor | pass | 15/0 | `src/main/java/PremiumPolicy.java` |
| 75 | Refactor | pass | 15/0 | `src/main/java/PremiumPolicy.java` |
| 76 | Verify | pass | 15/0 | — |
| 77 | Skip | pass | 16/0 | `src/test/java/ClaimOfficeTest.java` |
| 78 | Verify | pass | 16/0 | — |
| 79 | Verify | pass | 16/0 | — |
| 80 | Skip | pass | 17/0 | `src/test/java/ClaimOfficeTest.java` |
| 81 | Verify | pass | 17/0 | — |
| 82 | Skip | pass | 18/0 | `src/test/java/ClaimOfficeTest.java` |
| 83 | Verify | pass | 18/0 | — |
| 84 | Verify | pass | 18/0 | — |
| 85 | Red | fail | 18/1 | `src/test/java/ClaimOfficeTest.java` |
| 86 | Green | pass | 19/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/Customer.java`, `src/main/java/PremiumPolicy.java` |
| 87 | Verify | pass | 19/0 | — |
| 88 | Refactor | pass | 19/0 | `src/main/java/Customer.java`, `src/main/java/PremiumPolicy.java` |
| 89 | Refactor | pass | 19/0 | `src/main/java/Customer.java`, `src/main/java/PremiumPolicy.java` |
| 90 | Refactor | pass | 19/0 | `src/main/java/PremiumPolicy.java` |
| 91 | Refactor | pass | 19/0 | `src/main/java/PremiumPolicy.java` |
| 92 | Refactor | pass | 19/0 | `src/main/java/PremiumPolicy.java` |
| 93 | Verify | pass | 19/0 | — |
| 94 | Skip | pass | 20/0 | `src/test/java/ClaimOfficeTest.java` |
| 95 | Verify | pass | 20/0 | — |
| 96 | Refactor | pass | 20/0 | `src/main/java/PolicyWideModifiers.java`, `src/main/java/PremiumPolicy.java` |
| 97 | Refactor | pass | 20/0 | `src/main/java/PolicyWideModifiers.java`, `src/main/java/PremiumPolicy.java` |
| 98 | Skip | pass | 21/0 | `src/test/java/ClaimOfficeTest.java` |
| 99 | Verify | pass | 21/0 | — |
| 100 | Refactor | pass | 21/0 | `src/main/java/PremiumPolicy.java` |
| 101 | Red | fail | 21/1 | `src/test/java/ClaimOfficeTest.java` |
| 102 | Green | pass | 22/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/PremiumPolicy.java` |
| 103 | Verify | pass | 22/0 | — |
| 104 | Refactor | pass | 22/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/Customer.java`, `src/main/java/PremiumPolicy.java` |
| 105 | Refactor | pass | 22/0 | `src/main/java/ClaimOfficeCli.java` |
| 106 | Refactor | pass | 22/0 | `src/main/java/ClaimOfficeCli.java` |
| 107 | Verify | pass | 22/0 | — |
| 108 | Skip | pass | 23/0 | `src/test/java/ClaimOfficeTest.java` |
| 109 | Verify | pass | 23/0 | — |
| 110 | Refactor | pass | 23/0 | `src/main/java/Customer.java`, `src/main/java/PremiumPolicy.java` |
| 111 | Verify | pass | 23/0 | — |
| 112 | Skip | pass | 24/0 | `src/test/java/ClaimOfficeTest.java` |
| 113 | Verify | pass | 24/0 | — |
| 114 | Refactor | pass | 24/0 | `src/main/java/InsuredItem.java`, `src/main/java/PremiumPolicy.java` |
| 115 | Verify | pass | 24/0 | — |
| 116 | Skip | pass | 25/0 | `src/test/java/ClaimOfficeTest.java` |
| 117 | Verify | pass | 25/0 | — |
| 118 | Refactor | pass | 25/0 | `src/main/java/PriceList.java` |
| 119 | Refactor | pass | 25/0 | `src/main/java/PriceList.java` |
| 120 | Skip | pass | 26/0 | `src/test/java/ClaimOfficeTest.java` |
| 121 | Verify | pass | 26/0 | — |
| 122 | Refactor | pass | 26/0 | `src/main/java/PremiumPolicy.java` |
| 123 | Verify | pass | 26/0 | — |
| 124 | Refactor | pass | 26/0 | `src/main/java/PremiumPolicy.java` |
| 125 | Skip | pass | 27/0 | `src/test/java/ClaimOfficeTest.java` |
| 126 | Verify | pass | 27/0 | — |
| 127 | Refactor | pass | 27/0 | `src/main/java/OfficesFavor.java`, `src/main/java/PremiumPolicy.java` |
| 128 | Refactor | pass | 27/0 | `src/main/java/OfficesFavor.java`, `src/main/java/PremiumPolicy.java` |
| 129 | Verify | pass | 27/0 | — |
| 130 | Red | fail | 27/1 | `src/test/java/ClaimOfficeTest.java` |
| 131 | Verify | fail | 27/1 | — |
| 132 | Green | pass | 28/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/ClaimPolicy.java`, `src/main/java/Policy.java`, `src/main/java/PriceList.java` |
| 133 | Verify | pass | 28/0 | — |
| 134 | Refactor | pass | 28/0 | `src/main/java/ClaimOfficeCli.java` |
| 135 | Refactor | pass | 28/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/ClaimPolicy.java`, `src/main/java/Policy.java` |
| 136 | Refactor | pass | 28/0 | `src/main/java/ClaimPolicy.java`, `src/main/java/InOfficesFavor.java`, `src/main/java/PremiumPolicy.java` |
| 137 | Verify | pass | 28/0 | — |
| 138 | Verify | pass | 28/0 | — |
| 139 | Verify | pass | 28/0 | — |
| 140 | Red | fail | 28/1 | `src/test/java/ClaimOfficeTest.java` |
| 141 | Green | fail | 23/6 | `src/main/java/PriceList.java` |
| 142 | Verify | fail | 23/6 | — |
| 143 | Verify | fail | 23/6 | — |
| 144 | Refactor | pass | 29/0 | `src/main/java/PriceList.java` |
| 145 | Verify | pass | 29/0 | — |
| 146 | Refactor | pass | 29/0 | `src/main/java/PriceList.java` |
| 147 | Refactor | pass | 29/0 | `src/main/java/PriceList.java` |
| 148 | Refactor | pass | 29/0 | `src/main/java/PriceList.java` |
| 149 | Refactor | pass | 29/0 | `src/main/java/PriceList.java` |
| 150 | Verify | pass | 29/0 | — |
| 151 | Skip | pass | 30/0 | `src/test/java/ClaimOfficeTest.java` |
| 152 | Verify | pass | 30/0 | — |
| 153 | Refactor | pass | 30/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/Policy.java` |
| 154 | Refactor | pass | 30/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/PremiumPolicy.java` |
| 155 | Verify | pass | 30/0 | — |
| 156 | Red | fail | 30/1 | `src/test/java/ClaimOfficeTest.java` |
| 157 | Green | pass | 31/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/ClaimPolicy.java`, `src/main/java/Damage.java`, `src/main/java/InsuredItem.java`, `src/main/java/Policy.java` |
| 158 | Verify | pass | 31/0 | — |
| 159 | Refactor | pass | 31/0 | `src/main/java/ClaimPolicy.java` |
| 160 | Refactor | pass | 31/0 | `src/main/java/Policy.java` |
| 161 | Verify | pass | 31/0 | — |
| 162 | Skip | pass | 32/0 | `src/test/java/ClaimOfficeTest.java` |
| 163 | Verify | pass | 32/0 | — |
| 164 | Verify | pass | 32/0 | — |
| 165 | Verify | pass | 32/0 | — |
| 166 | Skip | pass | 33/0 | `src/test/java/ClaimOfficeTest.java` |
| 167 | Verify | pass | 33/0 | — |
| 168 | Refactor | pass | 33/0 | `src/main/java/ClaimPolicy.java`, `src/main/java/InsuredItem.java` |
| 169 | Refactor | pass | 33/0 | `src/main/java/ClaimPolicy.java`, `src/main/java/ClauseBook.java` |
| 170 | Refactor | pass | 33/0 | `src/main/java/ClaimPolicy.java`, `src/main/java/ClauseBook.java` |
| 171 | Skip | pass | 34/0 | `src/test/java/ClaimOfficeTest.java` |
| 172 | Verify | pass | 34/0 | — |
| 173 | Refactor | pass | 34/0 | `src/main/java/ClaimOffice.java`, `src/main/java/ClaimOfficeCli.java` |
| 174 | Verify | pass | 34/0 | — |
| 175 | Skip | pass | 35/0 | `src/test/java/ClaimOfficeTest.java` |
| 176 | Verify | pass | 35/0 | — |
| 177 | Refactor | pass | 35/0 | `src/main/java/ClaimPolicy.java` |
| 178 | Skip | pass | 36/0 | `src/test/java/ClaimOfficeTest.java` |
| 179 | Verify | pass | 36/0 | — |
| 180 | Refactor | pass | 36/0 | `src/main/java/ClaimOffice.java` |
| 181 | Refactor | pass | 36/0 | `src/main/java/ClaimOffice.java`, `src/main/java/PayoutCap.java`, `src/main/java/Policy.java` |
| 182 | Verify | pass | 36/0 | — |
| 183 | Skip | pass | 37/0 | `src/test/java/ClaimOfficeTest.java` |
| 184 | Verify | pass | 37/0 | — |
| 185 | Refactor | pass | 37/0 | `src/main/java/Coverage.java`, `src/main/java/Policy.java` |
| 186 | Verify | pass | 37/0 | — |
| 187 | Skip | pass | 38/0 | `src/test/java/ClaimOfficeTest.java` |
| 188 | Verify | pass | 38/0 | — |
| 189 | Refactor | pass | 38/0 | `src/main/java/Policy.java` |
| 190 | Refactor | pass | 38/0 | `src/main/java/Policy.java` |
| 191 | Skip | pass | 39/0 | `src/test/java/ClaimOfficeTest.java` |
| 192 | Verify | pass | 39/0 | — |
| 193 | Refactor | pass | 39/0 | `src/main/java/PriceList.java` |
| 194 | Refactor | pass | 39/0 | `src/main/java/PriceList.java` |
| 195 | Skip | pass | 40/0 | `src/test/java/ClaimOfficeTest.java` |
| 196 | Verify | pass | 40/0 | — |
| 197 | Refactor | pass | 40/0 | `src/main/java/InsuranceSum.java`, `src/main/java/PayoutCap.java`, `src/main/java/PriceList.java` |
| 198 | Refactor | pass | 40/0 | `src/main/java/InsuranceSum.java`, `src/main/java/PayoutCap.java`, `src/main/java/PriceList.java` |
| 199 | Skip | pass | 41/0 | `src/test/java/ClaimOfficeTest.java` |
| 200 | Verify | pass | 41/0 | — |
| 201 | Verify | pass | 41/0 | — |
| 202 | Skip | pass | 42/0 | `src/test/java/ClaimOfficeTest.java` |
| 203 | Verify | pass | 42/0 | — |
| 204 | Refactor | pass | 42/0 | `src/main/java/Policy.java` |
| 205 | Refactor | pass | 42/0 | `src/main/java/Policy.java` |
| 206 | Skip | pass | 43/0 | `src/test/java/ClaimOfficeTest.java` |
| 207 | Verify | pass | 43/0 | — |
| 208 | Refactor | pass | 43/0 | `src/main/java/Policy.java` |
| 209 | Verify | pass | 43/0 | — |
| 210 | Both | fail | 43/1 | `src/main/java/ClaimOfficeCli.java`, `src/test/java/ClaimOfficeTest.java` |
| 211 | Verify | fail | 43/1 | — |
| 212 | Refactor | pass | 44/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/PriceList.java`, `src/main/java/RejectedScenario.java` |
| 213 | Verify | pass | 44/0 | — |
| 214 | Both | pass | 44/0 | `src/main/java/ClaimOfficeCli.java`, `src/test/java/ClaimOfficeTest.java` |
| 215 | Refactor | pass | 44/0 | `src/main/java/PriceList.java` |
| 216 | Verify | pass | 44/0 | — |
| 217 | Red | fail | 44/1 | `src/test/java/ClaimOfficeTest.java` |
| 218 | Green | pass | 45/0 | `src/main/java/Coverage.java` |
| 219 | Verify | pass | 45/0 | — |
| 220 | Refactor | pass | 45/0 | `src/main/java/Coverage.java`, `src/main/java/PriceList.java` |
| 221 | Refactor | pass | 45/0 | `src/main/java/Coverage.java` |
| 222 | Refactor | pass | 45/0 | `src/main/java/Coverage.java`, `src/main/java/InsuredItem.java` |
| 223 | Verify | pass | 45/0 | — |
| 224 | Skip | pass | 46/0 | `src/test/java/ClaimOfficeTest.java` |
| 225 | Verify | pass | 46/0 | — |
| 226 | Refactor | pass | 46/0 | `src/main/java/Coverage.java`, `src/main/java/InsuredItem.java` |
| 227 | Verify | pass | 46/0 | — |
| 228 | Red | fail | 46/1 | `src/test/java/ClaimOfficeTest.java` |
| 229 | Green | pass | 47/0 | `src/main/java/Coverage.java`, `src/main/java/Policy.java` |
| 230 | Verify | pass | 47/0 | — |
| 231 | Refactor | pass | 47/0 | `src/main/java/Coverage.java` |
| 232 | Refactor | pass | 47/0 | `src/main/java/Coverage.java` |
| 233 | Verify | pass | 47/0 | — |
| 234 | Red | fail | 47/1 | `src/test/java/ClaimOfficeTest.java` |
| 235 | Green | pass | 48/0 | `src/main/java/Damage.java` |
| 236 | Verify | pass | 48/0 | — |
| 237 | Break | fail | 47/1 | `src/main/java/ClaimPolicy.java` |
| 238 | Green | pass | 48/0 | `src/main/java/ClaimPolicy.java` |
| 239 | Refactor | pass | 48/0 | `src/main/java/Damage.java` |
| 240 | Refactor | pass | 48/0 | `src/main/java/RejectedScenario.java` |
| 241 | Refactor | pass | 48/0 | `src/main/java/ClaimPolicy.java` |
| 242 | Verify | pass | 48/0 | — |
| 243 | Verify | pass | 48/0 | — |
| 244 | Red | fail | 48/1 | `src/test/java/ClaimOfficeTest.java` |
| 245 | Green? | fail | 48/1 | `src/main/java/ClaimOfficeCli.java` |
| 246 | Verify | fail | 48/1 | — |
| 247 | Skip | pass | 49/0 | `src/test/java/ClaimOfficeTest.java` |
| 248 | Verify | pass | 49/0 | — |
| 249 | Refactor | pass | 49/0 | `src/main/java/ClaimOfficeCli.java`, `src/main/java/ScenarioProtocol.java` |
| 250 | Refactor | pass | 49/0 | `src/main/java/ScenarioProtocol.java` |
| 251 | Verify | pass | 49/0 | — |
| 252 | Verify | pass | 49/0 | — |
| 253 | Skip | pass | 50/0 | `src/test/java/ClaimOfficeTest.java` |
| 254 | Verify | pass | 50/0 | — |
| 255 | Verify | pass | 50/0 | — |
| 256 | Skip | pass | 51/0 | `src/test/java/ClaimOfficeTest.java` |
| 257 | Verify | pass | 51/0 | — |
| 258 | Refactor | pass | 51/0 | `src/main/java/PriceList.java` |
| 259 | Refactor | pass | 51/0 | `src/main/java/ClaimOffice.java`, `src/main/java/Policy.java` |
| 260 | Skip | pass | 51/0 | `src/test/java/ClaimOfficeTest.java` |
| 261 | Verify | pass | 51/0 | — |
| 262 | Verify | pass | 51/0 | — |

Final suite state: **pass**.

