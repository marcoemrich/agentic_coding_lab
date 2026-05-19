# Analysis Report: 2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-19T10:31:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 210s |
| Started | 2026-05-19T10:28:16+00:00 |
| Ended | 2026-05-19T10:31:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 42
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 91
- **Active tests**: 1
- **Remaining todos**: 41

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking-3

 ❯ src/claim-office.spec.ts  (42 tests | 1 failed | 41 skipped) 5ms
   ❯ src/claim-office.spec.ts > Claim Office > quote - base premiums > returns 5G premium for an empty item list (processing fee only)
     → expected undefined to be 5 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > Claim Office > quote - base premiums > returns 5G premium for an empty item list (processing fee only)
AssertionError: expected undefined to be 5 // Object.is equality

- Expected: 
5

+ Received: 
undefined

 ❯ src/claim-office.spec.ts:8:22
      6|     it("returns 5G premium for an empty item list (processing fee only…
      7|       const result = quote({ yearsWithMHPCO: 0 }, [], false);
      8|       expect(result).toBe(5);
       |                      ^
      9|     });
     10|     it.todo("returns 105G premium for a single sword (100G base + 5G f…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 41 todo (42)
   Start at  10:31:49
   Duration  174ms (transform 28ms, setup 0ms, collect 26ms, tests 5ms, environment 0ms, prepare 47ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **131** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 3 |
| Longest Function | 22 lines |
| Avg LOC/Function | 11.33 |
| Median LOC/Function | 9.00 |
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
| McCabe (Cyclomatic) | 5 | 1.57 | 0 |
| Cognitive (SonarJS) | 6 | 6.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 397361 |
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


