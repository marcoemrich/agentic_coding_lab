# Analysis Report: 2026-07-25_03-46-34_claim-office-example-mapping_v6.2-with-why-cleaned-pi_qwen3-235b

Generated: 2026-07-25T20:35:37+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | qwen3-235b |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 59s |
| Started | 2026-07-25T03:46:34+00:00 |
| Ended | 2026-07-25T03:47:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 27
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 100
- **Active tests**: 1
- **Remaining todos**: 48

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-46-34_claim-office-example-mapping_v6.2-with-why-cleaned-pi_qwen3-235b
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-46-34_claim-office-example-mapping_v6.2-with-why-cleaned-pi_qwen3-235b

 ❯ src/claim-office.spec.ts  (49 tests | 1 failed | 48 skipped) 4ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should compute premium for empty item list as 5 G (only processing fee)
     → Cannot read properties of undefined (reading '0')

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should compute premium for empty item list as 5 G (only processing fee)
TypeError: Cannot read properties of undefined (reading '0')
 ❯ src/claim-office.spec.ts:17:19
     15|     };
     16|     const result = processScenario(input);
     17|     expect(result.results[0].premium).toBe(5);
       |                   ^
     18|   });
     19|   

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 48 todo (49)
   Start at  20:35:37
   Duration  396ms (transform 21ms, setup 0ms, collect 19ms, tests 4ms, environment 0ms, prepare 58ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 7 | ×1 | 7 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **85** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 25 |
| Functions | 2 |
| Longest Function | 19 lines |
| Avg LOC/Function | 11.00 |
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
| McCabe (Cyclomatic) | 2 | 1.20 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 322416 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


