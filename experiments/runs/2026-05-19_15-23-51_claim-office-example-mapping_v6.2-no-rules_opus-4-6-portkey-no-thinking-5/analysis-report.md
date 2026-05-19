# Analysis Report: 2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-5

Generated: 2026-05-19T15:28:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-no-rules |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 281s |
| Started | 2026-05-19T15:23:51+00:00 |
| Ended | 2026-05-19T15:28:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 91
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 71
- **Active tests**: 1
- **Remaining todos**: 33

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-5

 ❯ src/claim-office.spec.ts  (34 tests | 1 failed | 33 skipped) 5ms
   ❯ src/claim-office.spec.ts > Claim Office > Quote - base premiums > returns 5G processing fee for an empty item list
     → expected undefined to be 5 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > Claim Office > Quote - base premiums > returns 5G processing fee for an empty item list
AssertionError: expected undefined to be 5 // Object.is equality

- Expected: 
5

+ Received: 
undefined

 ❯ src/claim-office.spec.ts:8:22
      6|     it("returns 5G processing fee for an empty item list", () => {
      7|       const result = quote({ yearsWithMHPCO: 0 }, [], false);
      8|       expect(result).toBe(5);
       |                      ^
      9|     });
     10|     it.todo("returns base premium plus fee for a single sword (105G)");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 33 todo (34)
   Start at  15:28:35
   Duration  168ms (transform 25ms, setup 0ms, collect 28ms, tests 5ms, environment 0ms, prepare 47ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 1 | ×5 | 5 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **201** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 77 |
| Functions | 3 |
| Longest Function | 28 lines |
| Avg LOC/Function | 13.67 |
| Median LOC/Function | 11.00 |
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
| McCabe (Cyclomatic) | 6 | 1.86 | 0 |
| Cognitive (SonarJS) | 8 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1602318 |
| Context Utilization | 27% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 4.05s |
| Avg Red Phase | 0s |
| Avg Green Phase | 4.05s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


