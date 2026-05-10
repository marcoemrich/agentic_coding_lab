# Analysis Report: 2026-05-09_15-46-10_claim-office-example-mapping_v4-exact-subagents_haiku-4-5

Generated: 2026-05-10T14:58:44+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 3186s |
| Started | 2026-05-09T15:46:10+00:00 |
| Ended | 2026-05-09T16:39:18+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 176
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 122
- **Active tests**: 23
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_15-46-10_claim-office-example-mapping_v4-exact-subagents_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_15-46-10_claim-office-example-mapping_v4-exact-subagents_haiku-4-5

 ❯ src/claim-office.spec.ts  (23 tests | 9 failed) 10ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should calculate premium for single sword without modifiers
     → expected 116 to be 100 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should calculate premium for single amulet without modifiers
     → expected 172 to be 150 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should calculate premium for single staff without modifiers
     → expected 227 to be 200 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should calculate premium for multiple different items
     → expected 385.05 to be 450 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should apply cursed item surcharge
     → expected 128 to be 110 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should apply high enchantment surcharge for enchantment level >= 5
     → expected 139 to be 120 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should apply first insurance surcharge
     → expected 116 to be 111 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should enforce policy cap at 2x total item value
     → expected 116 to be 200 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office - Process Claim > should process reimbursement for standard item damage
     → expected 50 to be +0 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 9 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should calculate premium for single sword without modifiers
AssertionError: expected 116 to be 100 // Object.is equality

- Expected
+ Received

- 100
+ 116

 ❯ src/claim-office.spec.ts:7:32
      5|   it("should calculate premium for single sword without modifiers", ()…
      6|     const items = [{ type: "sword", baseCost: 100 }];
      7|     expect(quotePolicy(items)).toBe(100);
       |                                ^
      8|   });
      9|   it("should calculate premium for single amulet without modifiers", (…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/9]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should calculate premium for single amulet without modifiers
AssertionError: expected 172 to be 150 // Object.is equality

- Expected
+ Received

- 150
+ 172

 ❯ src/claim-office.spec.ts:11:32
      9|   it("should calculate premium for single amulet without modifiers", (…
     10|     const items = [{ type: "amulet", baseCost: 150 }];
     11|     expect(quotePolicy(items)).toBe(150);
       |                                ^
     12|   });
     13|   it("should calculate premium for single staff without modifiers", ()…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/9]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should calculate premium for single staff without modifiers
AssertionError: expected 227 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 227

 ❯ src/claim-office.spec.ts:15:32
     13|   it("should calculate premium for single staff without modifiers", ()…
     14|     const items = [{ type: "staff", baseCost: 200 }];
     15|     expect(quotePolicy(items)).toBe(200);
       |                                ^
     16|   });
     17|   it("should calculate premium for multiple different items", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/9]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should calculate premium for multiple different items
AssertionError: expected 385.05 to be 450 // Object.is equality

- Expected
+ Received

- 450
+ 385.05

 ❯ src/claim-office.spec.ts:23:32
     21|       { type: "staff", baseCost: 200 }
     22|     ];
     23|     expect(quotePolicy(items)).toBe(450);
       |                                ^
     24|   });
     25|   it("should apply cursed item surcharge", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/9]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should apply cursed item surcharge
AssertionError: expected 128 to be 110 // Object.is equality

- Expected
+ Received

- 110
+ 128

 ❯ src/claim-office.spec.ts:27:32
     25|   it("should apply cursed item surcharge", () => {
     26|     const items = [{ type: "sword", baseCost: 100, cursed: true }];
     27|     expect(quotePolicy(items)).toBe(110);
       |                                ^
     28|   });
     29|   it("should apply high enchantment surcharge for enchantment level >=…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/9]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should apply high enchantment surcharge for enchantment level >= 5
AssertionError: expected 139 to be 120 // Object.is equality

- Expected
+ Received

- 120
+ 139

 ❯ src/claim-office.spec.ts:31:32
     29|   it("should apply high enchantment surcharge for enchantment level >=…
     30|     const items = [{ type: "sword", baseCost: 100, enchantment: 5 }];
     31|     expect(quotePolicy(items)).toBe(120);
       |                                ^
     32|   });
     33|   it("should apply loyalty discount for loyalty >= 2 years", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should apply first insurance surcharge
AssertionError: expected 116 to be 111 // Object.is equality

- Expected
+ Received

- 111
+ 116

 ❯ src/claim-office.spec.ts:39:32
     37|   it("should apply first insurance surcharge", () => {
     38|     const items = [{ type: "sword", baseCost: 100 }];
     39|     expect(quotePolicy(items)).toBe(111);
       |                                ^
     40|   });
     41|   it("should apply follow-up contract discount", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/9]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Quote Policy > should enforce policy cap at 2x total item value
AssertionError: expected 116 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 116

 ❯ src/claim-office.spec.ts:67:32
     65|   it("should enforce policy cap at 2x total item value", () => {
     66|     const items = [{ type: "sword", baseCost: 100 }];
     67|     expect(quotePolicy(items)).toBe(200);
       |                                ^
     68|   });
     69|   it("should throw error for unknown item type", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/9]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office - Process Claim > should process reimbursement for standard item damage
AssertionError: expected 50 to be +0 // Object.is equality

- Expected
+ Received

- 0
+ 50

 ❯ src/claim-office.spec.ts:84:42
     82|     const policy = [{ type: "sword", baseCost: 100 }];
     83|     const claims = [{ itemIndex: 0, damageAmount: 50 }];
     84|     expect(processClaim(policy, claims)).toBe(0);
       |                                          ^
     85|   });
     86|   it("should apply 50% reimbursement for high enchantment >= 8", () =>…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/9]⎯

 Test Files  1 failed (1)
      Tests  9 failed | 14 passed (23)
   Start at  14:58:45
   Duration  364ms (transform 27ms, setup 0ms, collect 25ms, tests 10ms, environment 0ms, prepare 97ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 8 | ×5 | 40 |
| Assignments | 33 | ×6 | 198 |
| **Total Mass** | | | **502** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 135 |
| Functions | 16 |
| Longest Function | 29 lines |
| Avg LOC/Function | 7.56 |
| Median LOC/Function | 5.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.53 | 0 |
| Cognitive (SonarJS) | 5 | 2.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11615809 |
| Context Utilization | 51% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 130.55s |
| Avg Red Phase | 26.8s |
| Avg Green Phase | 59.73s |
| Avg Refactor Phase | 44.02s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 43 |
| Accuracy | 88% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


