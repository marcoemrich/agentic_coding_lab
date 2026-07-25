# Analysis Report: 2026-07-25_10-35-55_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking

Generated: 2026-07-25T13:12:33+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | qwen3-235b-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 511s |
| Started | 2026-07-25T10:35:55+00:00 |
| Ended | 2026-07-25T10:44:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office-mapping.ts, claim-office.ts, cli.ts
- **Implementation LOC** (total): 145
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 142
- **Active tests**: 15
- **Remaining todos**: 20

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_10-35-55_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_10-35-55_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking

 ❯ src/claim-office-mapping.spec.ts  (33 tests | 1 failed | 31 skipped) 4ms
   ❯ src/claim-office-mapping.spec.ts > MHPCO Claim Office Mapping > should compute base premium for sword - 100 G
     → Cannot read properties of undefined (reading 'premium')
 ❯ src/claim-office.spec.ts  (35 tests | 7 failed | 20 skipped) 8ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should compute base premium for a sword as 100 G
     → expected 110 to be 100 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should compute base premium for an amulet as 60 G
     → expected 66 to be 60 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should compute base premium for a staff as 80 G
     → expected 88 to be 80 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should compute base premium for a potion as 40 G
     → expected 44 to be 40 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should add 50% risk surcharge for cursed items (applied to item's base premium)
     → expected 165 to be 150 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should add 30% risk surcharge for highly enchanted items (enchantment level ≥ 5)
     → expected 143 to be 130 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should apply 20% loyalty discount for long-standing customers (≥ 2 years)
     → expected 88 to be 80 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 8 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office-mapping.spec.ts > MHPCO Claim Office Mapping > should compute base premium for sword - 100 G
TypeError: Cannot read properties of undefined (reading 'premium')
 ❯ src/claim-office-mapping.spec.ts:32:30
     30|     };
     31|     const result = claimOfficeMapping(input);
     32|     expect(result.results[0].premium).toBe(100);
       |                              ^
     33|   });
     34|   

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should compute base premium for a sword as 100 G
AssertionError: expected 110 to be 100 // Object.is equality

- Expected
+ Received

- 100
+ 110

 ❯ src/claim-office.spec.ts:16:20
     14|     const items = [{ type: "sword" }];
     15|     const result = calculatePremium(customer, items);
     16|     expect(result).toBe(100);
       |                    ^
     17|   });
     18|   it("should compute base premium for an amulet as 60 G", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/8]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should compute base premium for an amulet as 60 G
AssertionError: expected 66 to be 60 // Object.is equality

- Expected
+ Received

- 60
+ 66

 ❯ src/claim-office.spec.ts:22:20
     20|     const items = [{ type: "amulet" }];
     21|     const result = calculatePremium(customer, items);
     22|     expect(result).toBe(60);
       |                    ^
     23|   });
     24|   it("should compute base premium for a staff as 80 G", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/8]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should compute base premium for a staff as 80 G
AssertionError: expected 88 to be 80 // Object.is equality

- Expected
+ Received

- 80
+ 88

 ❯ src/claim-office.spec.ts:28:20
     26|     const items = [{ type: "staff" }];
     27|     const result = calculatePremium(customer, items);
     28|     expect(result).toBe(80);
       |                    ^
     29|   });
     30|   it("should compute base premium for a potion as 40 G", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/8]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should compute base premium for a potion as 40 G
AssertionError: expected 44 to be 40 // Object.is equality

- Expected
+ Received

- 40
+ 44

 ❯ src/claim-office.spec.ts:34:20
     32|     const items = [{ type: "potion" }];
     33|     const result = calculatePremium(customer, items);
     34|     expect(result).toBe(40);
       |                    ^
     35|   });
     36|   

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/8]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should add 50% risk surcharge for cursed items (applied to item's base premium)
AssertionError: expected 165 to be 150 // Object.is equality

- Expected
+ Received

- 150
+ 165

 ❯ src/claim-office.spec.ts:92:20
     90|     ];
     91|     const result = calculatePremium(customer, items);
     92|     expect(result).toBe(150);
       |                    ^
     93|   });
     94|   it("should add 30% risk surcharge for highly enchanted items (enchan…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/8]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should add 30% risk surcharge for highly enchanted items (enchantment level ≥ 5)
AssertionError: expected 143 to be 130 // Object.is equality

- Expected
+ Received

- 130
+ 143

 ❯ src/claim-office.spec.ts:100:20
     98|     ];
     99|     const result = calculatePremium(customer, items);
    100|     expect(result).toBe(130);
       |                    ^
    101|   });
    102|   it("should apply 20% loyalty discount for long-standing customers (≥…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/8]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should apply 20% loyalty discount for long-standing customers (≥ 2 years)
AssertionError: expected 88 to be 80 // Object.is equality

- Expected
+ Received

- 80
+ 88

 ❯ src/claim-office.spec.ts:108:20
    106|     ];
    107|     const result = calculatePremium(customer, items);
    108|     expect(result).toBe(80);
       |                    ^
    109|   });
    110|   it("should add 10% initial assessment surcharge for first insurance"…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/8]⎯

 Test Files  2 failed (2)
      Tests  8 failed | 9 passed | 51 todo (68)
   Start at  13:12:34
   Duration  398ms (transform 39ms, setup 0ms, collect 51ms, tests 12ms, environment 0ms, prepare 177ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 9 | ×5 | 45 |
| Assignments | 33 | ×6 | 198 |
| **Total Mass** | | | **431** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 96 |
| Functions | 5 |
| Longest Function | 55 lines |
| Avg LOC/Function | 23.60 |
| Median LOC/Function | 17.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 1 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.38 | 0 |
| Cognitive (SonarJS) | 11 | 5.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3814346 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 11 |
| Predictions Total | 22 |
| Accuracy | 50% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


