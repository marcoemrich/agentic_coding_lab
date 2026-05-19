# Analysis Report: 2026-05-19_16-08-31_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T16:11:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 205s |
| Started | 2026-05-19T16:08:31+00:00 |
| Ended | 2026-05-19T16:11:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 22
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 84
- **Active tests**: 1
- **Remaining todos**: 39

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_16-08-31_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_16-08-31_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

 ❯ src/claim-office.spec.ts  (40 tests | 1 failed | 39 skipped) 3ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Quote - Base Premiums > should return 5 G for an empty item list (processing fee only)
     → Cannot read properties of undefined (reading 'results')

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Quote - Base Premiums > should return 5 G for an empty item list (processing fee only)
TypeError: Cannot read properties of undefined (reading 'results')
 ❯ src/claim-office.spec.ts:12:21
     10|       };
     11|       const result = processScenario(scenario);
     12|       expect(result.results[0].premium).toBe(5);
       |                     ^
     13|     });
     14|     it.todo("should compute base premium for a single sword (100 G + 5…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 39 todo (40)
   Start at  16:11:58
   Duration  160ms (transform 23ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 47ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 8 | ×1 | 8 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 0 | ×5 | 0 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **82** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 20 |
| Functions | 1 |
| Longest Function | 3 lines |
| Avg LOC/Function | 3.00 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.67 | 0 |
| Cognitive (SonarJS) | 3 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 676266 |
| Context Utilization | 20% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 14.87s |
| Avg Red Phase | 0s |
| Avg Green Phase | 14.87s |
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


