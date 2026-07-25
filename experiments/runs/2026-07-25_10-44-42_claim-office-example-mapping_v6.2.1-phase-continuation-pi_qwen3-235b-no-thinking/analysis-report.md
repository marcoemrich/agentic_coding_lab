# Analysis Report: 2026-07-25_10-44-42_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking

Generated: 2026-07-25T13:12:42+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | qwen3-235b-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 504s |
| Started | 2026-07-25T10:44:42+00:00 |
| Ended | 2026-07-25T10:53:07+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 87
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 173
- **Active tests**: 14
- **Remaining todos**: 21

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_10-44-42_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_10-44-42_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking

 ❯ src/claim-office.spec.ts  (35 tests | 12 failed | 21 skipped) 9ms
   ❯ src/claim-office.spec.ts > Claim Office > should apply base premium for a sword -- 100 G base premium for a sword
     → expected 116 to be 105 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should apply base premium for an amulet -- 60 G base premium for amulet
     → expected 71 to be 65 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should apply base premium for a staff -- 80 G base premium for a staff
     → expected 93 to be 85 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should apply base premium for a potion -- 40 G base premium for a potion
     → expected 49 to be 45 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should apply base premium of 25 G per component for runes and moonstones -- 25 G each
     → expected 33 to be 30 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should apply special base premium of 60 G for exactly 3 alike components -- block of 3 runes → 60 G
     → expected 71 to be 65 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should not apply block discount for 4 runes -- 4 runes → 100 G (no block)
     → expected 116 to be 105 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should apply block discount separately per component type -- 3 runes + 3 moonstones → 120 G (two separate blocks)
     → expected 137 to be 125 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should not apply block discount for mixed component types -- 2 runes + 1 moonstone → 75 G (different types)
     → expected 88 to be 80 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should add 50 % risk surcharge for cursed items -- cursed sword (100 G base) → +50 G surcharge
     → expected 170 to be 155 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should add 30 % risk surcharge for highly enchanted items (enchantment ≥ 5) -- sword with enchantment 5 → +30 G surcharge
     → expected 148 to be 135 // Object.is equality
   ❯ src/claim-office.spec.ts > Claim Office > should apply 20 % loyalty discount for long-standing customers (≥ 2 years) -- 3-year customer → 20 % off policy base premium
     → expected 93 to be 85 // Object.is equality

⎯⎯⎯⎯⎯⎯ Failed Tests 12 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should apply base premium for a sword -- 100 G base premium for a sword
AssertionError: expected 116 to be 105 // Object.is equality

- Expected
+ Received

- 105
+ 116

 ❯ src/claim-office.spec.ts:24:39
     22|     };
     23|     const result = processScenario(input);
     24|     expect(result.results[0].premium).toBe(100 + 5); // base premium +…
       |                                       ^
     25|   });
     26|   it("should apply base premium for an amulet -- 60 G base premium for…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should apply base premium for an amulet -- 60 G base premium for amulet
AssertionError: expected 71 to be 65 // Object.is equality

- Expected
+ Received

- 65
+ 71

 ❯ src/claim-office.spec.ts:34:39
     32|     };
     33|     const result = processScenario(input);
     34|     expect(result.results[0].premium).toBe(60 + 5); // base premium + …
       |                                       ^
     35|   });
     36|   it("should apply base premium for a staff -- 80 G base premium for a…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should apply base premium for a staff -- 80 G base premium for a staff
AssertionError: expected 93 to be 85 // Object.is equality

- Expected
+ Received

- 85
+ 93

 ❯ src/claim-office.spec.ts:44:39
     42|     };
     43|     const result = processScenario(input);
     44|     expect(result.results[0].premium).toBe(80 + 5); // base premium + …
       |                                       ^
     45|   });
     46|   it("should apply base premium for a potion -- 40 G base premium for …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should apply base premium for a potion -- 40 G base premium for a potion
AssertionError: expected 49 to be 45 // Object.is equality

- Expected
+ Received

- 45
+ 49

 ❯ src/claim-office.spec.ts:54:39
     52|     };
     53|     const result = processScenario(input);
     54|     expect(result.results[0].premium).toBe(40 + 5); // base premium + …
       |                                       ^
     55|   });
     56|   it("should apply base premium of 25 G per component for runes and mo…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should apply base premium of 25 G per component for runes and moonstones -- 25 G each
AssertionError: expected 33 to be 30 // Object.is equality

- Expected
+ Received

- 30
+ 33

 ❯ src/claim-office.spec.ts:64:39
     62|     };
     63|     const result = processScenario(input);
     64|     expect(result.results[0].premium).toBe(25 + 5); // base premium + …
       |                                       ^
     65|   });
     66|   it("should apply special base premium of 60 G for exactly 3 alike co…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should apply special base premium of 60 G for exactly 3 alike components -- block of 3 runes → 60 G
AssertionError: expected 71 to be 65 // Object.is equality

- Expected
+ Received

- 65
+ 71

 ❯ src/claim-office.spec.ts:74:39
     72|     };
     73|     const result = processScenario(input);
     74|     expect(result.results[0].premium).toBe(60 + 5); // block premium +…
       |                                       ^
     75|   });
     76|   it("should not apply block discount for 4 runes -- 4 runes → 100 G (…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should not apply block discount for 4 runes -- 4 runes → 100 G (no block)
AssertionError: expected 116 to be 105 // Object.is equality

- Expected
+ Received

- 105
+ 116

 ❯ src/claim-office.spec.ts:84:39
     82|     };
     83|     const result = processScenario(input);
     84|     expect(result.results[0].premium).toBe(100 + 5); // 4 × 25 = 100 +…
       |                                       ^
     85|   });
     86|   it("should apply block discount separately per component type -- 3 r…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should apply block discount separately per component type -- 3 runes + 3 moonstones → 120 G (two separate blocks)
AssertionError: expected 137 to be 125 // Object.is equality

- Expected
+ Received

- 125
+ 137

 ❯ src/claim-office.spec.ts:97:39
     95|     };
     96|     const result = processScenario(input);
     97|     expect(result.results[0].premium).toBe(120 + 5); // 60 + 60 + proc…
       |                                       ^
     98|   });
     99|   it("should not apply block discount for mixed component types -- 2 r…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should not apply block discount for mixed component types -- 2 runes + 1 moonstone → 75 G (different types)
AssertionError: expected 88 to be 80 // Object.is equality

- Expected
+ Received

- 80
+ 88

 ❯ src/claim-office.spec.ts:110:39
    108|     };
    109|     const result = processScenario(input);
    110|     expect(result.results[0].premium).toBe(75 + 5); // 2×25 + 1×25 = 7…
       |                                       ^
    111|   });
    112|   it("should add 50 % risk surcharge for cursed items -- cursed sword …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should add 50 % risk surcharge for cursed items -- cursed sword (100 G base) → +50 G surcharge
AssertionError: expected 170 to be 155 // Object.is equality

- Expected
+ Received

- 155
+ 170

 ❯ src/claim-office.spec.ts:120:39
    118|     };
    119|     const result = processScenario(input);
    120|     expect(result.results[0].premium).toBe(100 + 50 + 5); // base + su…
       |                                       ^
    121|   });
    122|   it("should add 30 % risk surcharge for highly enchanted items (encha…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should add 30 % risk surcharge for highly enchanted items (enchantment ≥ 5) -- sword with enchantment 5 → +30 G surcharge
AssertionError: expected 148 to be 135 // Object.is equality

- Expected
+ Received

- 135
+ 148

 ❯ src/claim-office.spec.ts:130:39
    128|     };
    129|     const result = processScenario(input);
    130|     expect(result.results[0].premium).toBe(100 + 30 + 5); // base + su…
       |                                       ^
    131|   });
    132|   it("should apply 20 % loyalty discount for long-standing customers (…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/12]⎯

 FAIL  src/claim-office.spec.ts > Claim Office > should apply 20 % loyalty discount for long-standing customers (≥ 2 years) -- 3-year customer → 20 % off policy base premium
AssertionError: expected 93 to be 85 // Object.is equality

- Expected
+ Received

- 85
+ 93

 ❯ src/claim-office.spec.ts:140:39
    138|     };
    139|     const result = processScenario(input);
    140|     expect(result.results[0].premium).toBe(Math.ceil(100 * 0.8) + 5); …
       |                                       ^
    141|   });
    142|   it("should add 10 % initial assessment surcharge for first insurance…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/12]⎯

 Test Files  1 failed (1)
      Tests  12 failed | 2 passed | 21 todo (35)
   Start at  13:12:43
   Duration  314ms (transform 28ms, setup 0ms, collect 25ms, tests 9ms, environment 0ms, prepare 67ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 48 | ×1 | 48 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 12 | ×5 | 60 |
| Assignments | 27 | ×6 | 162 |
| **Total Mass** | | | **340** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 55 |
| Functions | 3 |
| Longest Function | 55 lines |
| Avg LOC/Function | 23.33 |
| Median LOC/Function | 8.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 6 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.67 | 0 |
| Cognitive (SonarJS) | 7 | 3.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4596438 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


