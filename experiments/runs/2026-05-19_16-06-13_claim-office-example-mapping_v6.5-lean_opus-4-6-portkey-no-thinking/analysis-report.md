# Analysis Report: 2026-05-19_16-06-13_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T16:09:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 168s |
| Started | 2026-05-19T16:06:13+00:00 |
| Ended | 2026-05-19T16:09:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 13
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 103
- **Active tests**: 1
- **Remaining todos**: 34

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_16-06-13_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_16-06-13_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

 ❯ src/claim-office.spec.ts  (35 tests | 1 failed | 34 skipped) 4ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Quote - base premiums > empty item list returns premium of 5 G (processing fee only)
     → Cannot read properties of undefined (reading 'results')

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Quote - base premiums > empty item list returns premium of 5 G (processing fee only)
TypeError: Cannot read properties of undefined (reading 'results')
 ❯ src/claim-office.spec.ts:12:21
     10|       };
     11|       const result = processScenario(scenario);
     12|       expect(result.results[0]).toEqual({ premium: 5 });
       |                     ^
     13|     });
     14|     it.todo("single sword returns premium of 115 G (100 base + 10 firs…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 34 todo (35)
   Start at  16:09:04
   Duration  182ms (transform 28ms, setup 0ms, collect 26ms, tests 4ms, environment 0ms, prepare 50ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 6 | ×1 | 6 |
| Invocations | 8 | ×2 | 16 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 5 | ×6 | 30 |
| **Total Mass** | | | **52** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 12 |
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
| McCabe (Cyclomatic) | 1 | 1.00 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 390357 |
| Context Utilization | 18% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
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


