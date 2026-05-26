# Analysis Report: 2026-05-25_13-08-02_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7-2

Generated: 2026-05-26T13:16:18+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | minimax-m2-7 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2713s |
| Started | 2026-05-25T13:08:02+00:00 |
| Ended | 2026-05-25T13:53:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 39
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 300
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_13-08-02_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_13-08-02_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7-2

 ❯ src/claim-office.spec.ts  (39 tests | 19 failed) 16ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 115 G for a sword (100 base + 10% first insurance + 5 fee)
     → expected 116 to be 115 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 81 G for 3 runes (60 base with block + 10% first insurance + 5 fee)
     → expected 71 to be 81 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 115 G for 4 runes (100 base, no block + 10% first insurance + 5 fee)
     → expected 99 to be 115 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 200 G for 7 runes (2 blocks of 3: 120 + 25 base + 10% first insurance + 5 fee)
     → expected 165 to be 200 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 89 G for 2 runes + 1 moonstone (75 base, no block + 10% first insurance + 5 fee)
     → expected 88 to be 89 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 149 G for 3 runes + 3 moonstones (two blocks: 120 base + 10% first insurance + 5 fee)
     → expected 137 to be 149 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply cursed surcharge of 50% on cursed sword's base premium
     → expected 170 to be 165 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply high-enchantment surcharge of 30% on sword with enchantment 5
     → expected 148 to be 143 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply both surcharges on cursed sword with enchantment 5
     → expected 220 to be 214 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply loyalty discount of 20% for customer with >= 2 years
     → expected 94 to be 99 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply first insurance surcharge of 10%
     → expected 116 to be 115 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply follow-up contract discount of 15% on second quote
     → expected 99 to be 104 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Modifier Scope on Multi-Item Policies > should apply cursed surcharge only to cursed item's base premium, not policy total
     → expected 237 to be 226 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Modifier Scope on Multi-Item Policies > should apply policy-wide modifiers (loyalty, first insurance, follow-up) to sum of all item base premiums
     → expected 146 to be 167 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Premium Integration Examples > should calculate premium 165 G for newcomer with cursed sword (enchantment 3)
     → expected 170 to be 165 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Premium Integration Examples > should calculate premium 160 G for long-standing customer's second contract with cursed sword (enchantment 7)
     → expected 151 to be 160 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Modifier Thresholds > should apply loyalty discount for customer with exactly 2 years
     → expected 94 to be 99 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Modifier Thresholds > should apply high-enchantment surcharge for sword with exactly enchantment 5
     → expected 148 to be 143 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Modifier Thresholds > should not apply high-enchantment surcharge for sword with enchantment 4
     → expected 116 to be 115 // Object.is equality

⎯⎯⎯⎯⎯⎯ Failed Tests 19 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 115 G for a sword (100 base + 10% first insurance + 5 fee)
AssertionError: expected 116 to be 115 // Object.is equality

- Expected
+ Received

- 115
+ 116

 ❯ src/claim-office.spec.ts:133:112
    131|     });
    132|     it("should return 115 G for a sword (100 base + 10% first insuranc…
    133|       expect(calculatePremium({ items: [{ type: "sword" }], customer: …
       |                                                                                                                ^
    134|     });
    135|     it("should return 71 G for an amulet (60 base + 10% first insuranc…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 81 G for 3 runes (60 base with block + 10% first insurance + 5 fee)
AssertionError: expected 71 to be 81 // Object.is equality

- Expected
+ Received

- 81
+ 71

 ❯ src/claim-office.spec.ts:154:147
    152|     });
    153|     it("should return 81 G for 3 runes (60 base with block + 10% first…
    154|       expect(calculatePremium({ items: [{ type: "rune" }, { type: "run…
       |                                                                                                                                                   ^
    155|     });
    156|     it("should return 115 G for 4 runes (100 base, no block + 10% firs…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 115 G for 4 runes (100 base, no block + 10% first insurance + 5 fee)
AssertionError: expected 99 to be 115 // Object.is equality

- Expected
+ Received

- 115
+ 99

 ❯ src/claim-office.spec.ts:157:165
    155|     });
    156|     it("should return 115 G for 4 runes (100 base, no block + 10% firs…
    157|       expect(calculatePremium({ items: [{ type: "rune" }, { type: "run…
       |                                                                                                                                                                     ^
    158|     });
    159|     it("should return 200 G for 7 runes (2 blocks of 3: 120 + 25 base …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 200 G for 7 runes (2 blocks of 3: 120 + 25 base + 10% first insurance + 5 fee)
AssertionError: expected 165 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 165

 ❯ src/claim-office.spec.ts:160:219


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 89 G for 2 runes + 1 moonstone (75 base, no block + 10% first insurance + 5 fee)
AssertionError: expected 88 to be 89 // Object.is equality

- Expected
+ Received

- 89
+ 88

 ❯ src/claim-office.spec.ts:163:152
    161|     });
    162|     it("should return 89 G for 2 runes + 1 moonstone (75 base, no bloc…
    163|       expect(calculatePremium({ items: [{ type: "rune" }, { type: "run…
       |                                                                                                                                                        ^
    164|     });
    165|     it("should return 149 G for 3 runes + 3 moonstones (two blocks: 12…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Base Premium Calculation > should return 149 G for 3 runes + 3 moonstones (two blocks: 120 base + 10% first insurance + 5 fee)
AssertionError: expected 137 to be 149 // Object.is equality

- Expected
+ Received

- 149
+ 137

 ❯ src/claim-office.spec.ts:166:216


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply cursed surcharge of 50% on cursed sword's base premium
AssertionError: expected 170 to be 165 // Object.is equality

- Expected
+ Received

- 165
+ 170

 ❯ src/claim-office.spec.ts:172:126
    170|   describe("Premium Modifiers", () => {
    171|     it("should apply cursed surcharge of 50% on cursed sword's base pr…
    172|       expect(calculatePremium({ items: [{ type: "sword", cursed: true …
       |                                                                                                                              ^
    173|     });
    174|     it("should apply high-enchantment surcharge of 30% on sword with e…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply high-enchantment surcharge of 30% on sword with enchantment 5
AssertionError: expected 148 to be 143 // Object.is equality

- Expected
+ Received

- 143
+ 148

 ❯ src/claim-office.spec.ts:175:128
    173|     });
    174|     it("should apply high-enchantment surcharge of 30% on sword with e…
    175|       expect(calculatePremium({ items: [{ type: "sword", enchantment: …
       |                                                                                                                                ^
    176|     });
    177|     it("should apply both surcharges on cursed sword with enchantment …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply both surcharges on cursed sword with enchantment 5
AssertionError: expected 220 to be 214 // Object.is equality

- Expected
+ Received

- 214
+ 220

 ❯ src/claim-office.spec.ts:178:142
    176|     });
    177|     it("should apply both surcharges on cursed sword with enchantment …
    178|       expect(calculatePremium({ items: [{ type: "sword", cursed: true,…
       |                                                                                                                                              ^
    179|     });
    180|     it("should apply loyalty discount of 20% for customer with >= 2 ye…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply loyalty discount of 20% for customer with >= 2 years
AssertionError: expected 94 to be 99 // Object.is equality

- Expected
+ Received

- 99
+ 94

 ❯ src/claim-office.spec.ts:181:112
    179|     });
    180|     it("should apply loyalty discount of 20% for customer with >= 2 ye…
    181|       expect(calculatePremium({ items: [{ type: "sword" }], customer: …
       |                                                                                                                ^
    182|     });
    183|     it("should apply first insurance surcharge of 10%", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply first insurance surcharge of 10%
AssertionError: expected 116 to be 115 // Object.is equality

- Expected
+ Received

- 115
+ 116

 ❯ src/claim-office.spec.ts:184:112
    182|     });
    183|     it("should apply first insurance surcharge of 10%", () => {
    184|       expect(calculatePremium({ items: [{ type: "sword" }], customer: …
       |                                                                                                                ^
    185|     });
    186|     it("should apply follow-up contract discount of 15% on second quot…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Premium Modifiers > should apply follow-up contract discount of 15% on second quote
AssertionError: expected 99 to be 104 // Object.is equality

- Expected
+ Received

- 104
+ 99

 ❯ src/claim-office.spec.ts:187:112
    185|     });
    186|     it("should apply follow-up contract discount of 15% on second quot…
    187|       expect(calculatePremium({ items: [{ type: "sword" }], customer: …
       |                                                                                                                ^
    188|     });
    189|     it("should add 5 G processing fee to every premium", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Modifier Scope on Multi-Item Policies > should apply cursed surcharge only to cursed item's base premium, not policy total
AssertionError: expected 237 to be 226 // Object.is equality

- Expected
+ Received

- 226
+ 237

 ❯ src/claim-office.spec.ts:196:146
    194|   describe("Modifier Scope on Multi-Item Policies", () => {
    195|     it("should apply cursed surcharge only to cursed item's base premi…
    196|       expect(calculatePremium({ items: [{ type: "sword", cursed: true …
       |                                                                                                                                                  ^
    197|     });
    198|     it("should apply policy-wide modifiers (loyalty, first insurance, …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Modifier Scope on Multi-Item Policies > should apply policy-wide modifiers (loyalty, first insurance, follow-up) to sum of all item base premiums
AssertionError: expected 146 to be 167 // Object.is equality

- Expected
+ Received

- 167
+ 146

 ❯ src/claim-office.spec.ts:199:132
    197|     });
    198|     it("should apply policy-wide modifiers (loyalty, first insurance, …
    199|       expect(calculatePremium({ items: [{ type: "sword" }, { type: "am…
       |                                                                                                                                    ^
    200|     });
    201|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Premium Integration Examples > should calculate premium 165 G for newcomer with cursed sword (enchantment 3)
AssertionError: expected 170 to be 165 // Object.is equality

- Expected
+ Received

- 165
+ 170

 ❯ src/claim-office.spec.ts:216:142
    214|   describe("Premium Integration Examples", () => {
    215|     it("should calculate premium 165 G for newcomer with cursed sword …
    216|       expect(calculatePremium({ items: [{ type: "sword", cursed: true,…
       |                                                                                                                                              ^
    217|     });
    218|     it("should calculate premium 160 G for long-standing customer's se…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Premium Integration Examples > should calculate premium 160 G for long-standing customer's second contract with cursed sword (enchantment 7)
AssertionError: expected 151 to be 160 // Object.is equality

- Expected
+ Received

- 160
+ 151

 ❯ src/claim-office.spec.ts:219:142
    217|     });
    218|     it("should calculate premium 160 G for long-standing customer's se…
    219|       expect(calculatePremium({ items: [{ type: "sword", cursed: true,…
       |                                                                                                                                              ^
    220|     });
    221|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Modifier Thresholds > should apply loyalty discount for customer with exactly 2 years
AssertionError: expected 94 to be 99 // Object.is equality

- Expected
+ Received

- 99
+ 94

 ❯ src/claim-office.spec.ts:292:112
    290|   describe("Modifier Thresholds", () => {
    291|     it("should apply loyalty discount for customer with exactly 2 year…
    292|       expect(calculatePremium({ items: [{ type: "sword" }], customer: …
       |                                                                                                                ^
    293|     });
    294|     it("should apply high-enchantment surcharge for sword with exactly…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Modifier Thresholds > should apply high-enchantment surcharge for sword with exactly enchantment 5
AssertionError: expected 148 to be 143 // Object.is equality

- Expected
+ Received

- 143
+ 148

 ❯ src/claim-office.spec.ts:295:128
    293|     });
    294|     it("should apply high-enchantment surcharge for sword with exactly…
    295|       expect(calculatePremium({ items: [{ type: "sword", enchantment: …
       |                                                                                                                                ^
    296|     });
    297|     it("should not apply high-enchantment surcharge for sword with enc…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/19]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Modifier Thresholds > should not apply high-enchantment surcharge for sword with enchantment 4
AssertionError: expected 116 to be 115 // Object.is equality

- Expected
+ Received

- 115
+ 116

 ❯ src/claim-office.spec.ts:298:128
    296|     });
    297|     it("should not apply high-enchantment surcharge for sword with enc…
    298|       expect(calculatePremium({ items: [{ type: "sword", enchantment: …
       |                                                                                                                                ^
    299|     });
    300|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/19]⎯

 Test Files  1 failed (1)
      Tests  19 failed | 20 passed (39)
   Start at  13:16:20
   Duration  382ms (transform 32ms, setup 0ms, collect 26ms, tests 16ms, environment 0ms, prepare 103ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 2 | ×1 | 2 |
| Invocations | 2 | ×2 | 4 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 0 | ×5 | 0 |
| Assignments | 0 | ×6 | 0 |
| **Total Mass** | | | **18** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 2 |
| Longest Function | 9 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 8.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 1 | 1.00 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12644271 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 3 |
| Predictions Total | 3 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


