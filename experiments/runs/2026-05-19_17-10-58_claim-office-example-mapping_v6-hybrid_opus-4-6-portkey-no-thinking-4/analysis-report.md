# Analysis Report: 2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-4

Generated: 2026-05-19T18:19:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 4095s |
| Started | 2026-05-19T17:10:58+00:00 |
| Ended | 2026-05-19T18:19:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 211
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 624
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-4

 ❯ src/claim-office.spec.ts  (38 tests | 10 failed) 21ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - basic payout > applies 100 G deductible per damaged item
     → expected { payout: 400, remainingCap: 1600 } to deeply equal { payout: 400 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - basic payout > fully reimburses standard item damage minus deductible
     → expected { payout: 250, remainingCap: 950 } to deeply equal { payout: 250 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - dragon material > fully reimburses damage to dragon material items minus deductible
     → expected { payout: 600, remainingCap: 1400 } to deeply equal { payout: 600 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - high enchantment reimbursement > reimburses 50% of damage for enchantment >= 8, then applies deductible
     → expected { payout: 200, remainingCap: 1800 } to deeply equal { payout: 200 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - high enchantment reimbursement > 50% rule wins over dragon material when enchantment >= 8
     → expected { payout: 300, remainingCap: 1700 } to deeply equal { payout: 300 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - cap > caps total payout at twice the insurance sum
     → expected { payout: 800, remainingCap: +0 } to deeply equal { payout: 800 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - cap > tracks remaining cap across multiple claims on same policy
     → expected { payout: 500, remainingCap: 300 } to deeply equal { payout: 500 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - multiple damages in one event > applies deductible per damaged item in same event
     → expected { payout: 500, remainingCap: 2700 } to deeply equal { payout: 500 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - multiple damages in one event > handles two damages of same item type when policy covers two
     → expected { payout: 600, remainingCap: 3400 } to deeply equal { payout: 600 }
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - payout rounding > rounds payout down in MHPCO's favor (floor)
     → expected { payout: 177, remainingCap: 1823 } to deeply equal { payout: 177 }

⎯⎯⎯⎯⎯⎯ Failed Tests 10 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - basic payout > applies 100 G deductible per damaged item
AssertionError: expected { payout: 400, remainingCap: 1600 } to deeply equal { payout: 400 }

- Expected
+ Received

  Object {
    "payout": 400,
+   "remainingCap": 1600,
  }

 ❯ src/claim-office.spec.ts:376:33
    374|       });
    375|       // Sword insurance value: 1000 G, damage: 500, reimbursement: 50…
    376|       expect(result.results[1]).toEqual({ payout: 400 });
       |                                 ^
    377|     });
    378|     it("fully reimburses standard item damage minus deductible", () =>…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - basic payout > fully reimburses standard item damage minus deductible
AssertionError: expected { payout: 250, remainingCap: 950 } to deeply equal { payout: 250 }

- Expected
+ Received

  Object {
    "payout": 250,
+   "remainingCap": 950,
  }

 ❯ src/claim-office.spec.ts:393:33
    391|       });
    392|       // Amulet damage: 350 - 100 deductible = 250
    393|       expect(result.results[1]).toEqual({ payout: 250 });
       |                                 ^
    394|     });
    395|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - dragon material > fully reimburses damage to dragon material items minus deductible
AssertionError: expected { payout: 600, remainingCap: 1400 } to deeply equal { payout: 600 }

- Expected
+ Received

  Object {
    "payout": 600,
+   "remainingCap": 1400,
  }

 ❯ src/claim-office.spec.ts:413:33
    411|       });
    412|       // Dragon material: full reimbursement minus deductible = 700 - …
    413|       expect(result.results[1]).toEqual({ payout: 600 });
       |                                 ^
    414|     });
    415|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - high enchantment reimbursement > reimburses 50% of damage for enchantment >= 8, then applies deductible
AssertionError: expected { payout: 200, remainingCap: 1800 } to deeply equal { payout: 200 }

- Expected
+ Received

  Object {
    "payout": 200,
+   "remainingCap": 1800,
  }

 ❯ src/claim-office.spec.ts:433:33
    431|       });
    432|       // High enchantment: 50% of 600 = 300, then minus 100 deductible…
    433|       expect(result.results[1]).toEqual({ payout: 200 });
       |                                 ^
    434|     });
    435|     it("50% rule wins over dragon material when enchantment >= 8", () …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - high enchantment reimbursement > 50% rule wins over dragon material when enchantment >= 8
AssertionError: expected { payout: 300, remainingCap: 1700 } to deeply equal { payout: 300 }

- Expected
+ Received

  Object {
    "payout": 300,
+   "remainingCap": 1700,
  }

 ❯ src/claim-office.spec.ts:450:33
    448|       });
    449|       // Enchantment >= 8 wins over dragon: 50% of 800 = 400, minus 10…
    450|       expect(result.results[1]).toEqual({ payout: 300 });
       |                                 ^
    451|     });
    452|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - cap > caps total payout at twice the insurance sum
AssertionError: expected { payout: 800, remainingCap: +0 } to deeply equal { payout: 800 }

- Expected
+ Received

  Object {
    "payout": 800,
+   "remainingCap": 0,
  }

 ❯ src/claim-office.spec.ts:471:33
    469|       // Potion insurance value: 400 G, cap = 2 * 400 = 800
    470|       // Damage: 1000 - 100 deductible = 900, but capped at 800
    471|       expect(result.results[1]).toEqual({ payout: 800 });
       |                                 ^
    472|     });
    473|     it("tracks remaining cap across multiple claims on same policy", (…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - cap > tracks remaining cap across multiple claims on same policy
AssertionError: expected { payout: 500, remainingCap: 300 } to deeply equal { payout: 500 }

- Expected
+ Received

  Object {
    "payout": 500,
+   "remainingCap": 300,
  }

 ❯ src/claim-office.spec.ts:494:33
    492|       // Claim 1: 600 - 100 = 500, remaining cap = 800 - 500 = 300
    493|       // Claim 2: 500 - 100 = 400, but remaining cap = 300, so payout …
    494|       expect(result.results[1]).toEqual({ payout: 500 });
       |                                 ^
    495|       expect(result.results[2]).toEqual({ payout: 300 });
    496|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - multiple damages in one event > applies deductible per damaged item in same event
AssertionError: expected { payout: 500, remainingCap: 2700 } to deeply equal { payout: 500 }

- Expected
+ Received

  Object {
    "payout": 500,
+   "remainingCap": 2700,
  }

 ❯ src/claim-office.spec.ts:521:33
    519|       });
    520|       // Sword: 400 - 100 = 300, Amulet: 300 - 100 = 200, total = 500
    521|       expect(result.results[1]).toEqual({ payout: 500 });
       |                                 ^
    522|     });
    523|     it("handles two damages of same item type when policy covers two",…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - multiple damages in one event > handles two damages of same item type when policy covers two
AssertionError: expected { payout: 600, remainingCap: 3400 } to deeply equal { payout: 600 }

- Expected
+ Received

  Object {
    "payout": 600,
+   "remainingCap": 3400,
  }

 ❯ src/claim-office.spec.ts:544:33
    542|       });
    543|       // Two swords insured: damage 1: 500-100=400, damage 2: 300-100=…
    544|       expect(result.results[1]).toEqual({ payout: 600 });
       |                                 ^
    545|     });
    546|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - payout rounding > rounds payout down in MHPCO's favor (floor)
AssertionError: expected { payout: 177, remainingCap: 1823 } to deeply equal { payout: 177 }

- Expected
+ Received

  Object {
    "payout": 177,
+   "remainingCap": 1823,
  }

 ❯ src/claim-office.spec.ts:564:33
    562|       });
    563|       // High enchantment: 50% of 555 = 277.5, minus 100 deductible = …
    564|       expect(result.results[1]).toEqual({ payout: 177 });
       |                                 ^
    565|     });
    566|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯

 Test Files  1 failed (1)
      Tests  10 failed | 28 passed (38)
   Start at  18:19:16
   Duration  205ms (transform 44ms, setup 0ms, collect 57ms, tests 21ms, environment 0ms, prepare 41ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 60 | ×2 | 120 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **744** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 176 |
| Functions | 15 |
| Longest Function | 23 lines |
| Avg LOC/Function | 7.27 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.70 | 0 |
| Cognitive (SonarJS) | 7 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 57840697 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 173.76s |
| Avg Red Phase | 34.34s |
| Avg Green Phase | 37.81s |
| Avg Refactor Phase | 101.61s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


