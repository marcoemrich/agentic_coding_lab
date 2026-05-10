# Analysis Report: 2026-05-09_18-25-01_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

Generated: 2026-05-10T14:59:04+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 2945s |
| Started | 2026-05-09T18:25:01+00:00 |
| Ended | 2026-05-09T19:14:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 229
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 139
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_18-25-01_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_18-25-01_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

 ❯ src/claim-office.spec.ts  (29 tests | 1 failed) 10ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office System > Quote Operations > should apply high enchantment surcharge (level 5+, 30%)
     → expected 131 to be 130 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office System > Quote Operations > should apply high enchantment surcharge (level 5+, 30%)
AssertionError: expected 131 to be 130 // Object.is equality

- Expected
+ Received

- 130
+ 131

 ❯ src/claim-office.spec.ts:45:76
     43|     });
     44|     it("should apply high enchantment surcharge (level 5+, 30%)", () =…
     45|       expect(createQuote([{ type: "sword", damage: 50, enchantment: 5 …
       |                                                                            ^
     46|     });
     47|     it("should apply cursed surcharge and enchanted surcharge together…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 28 passed (29)
   Start at  14:59:04
   Duration  353ms (transform 29ms, setup 0ms, collect 28ms, tests 10ms, environment 0ms, prepare 68ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 32 | ×4 | 128 |
| Loops | 5 | ×5 | 25 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **598** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 177 |
| Functions | 21 |
| Longest Function | 23 lines |
| Avg LOC/Function | 7.76 |
| Median LOC/Function | 5.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.31 | 0 |
| Cognitive (SonarJS) | 4 | 2.14 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11909426 |
| Context Utilization | 52% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 95.70s |
| Avg Red Phase | 29.22s |
| Avg Green Phase | 26.49s |
| Avg Refactor Phase | 39.99s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 58 |
| Predictions Total | 64 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


