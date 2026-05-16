# Analysis Report: 2026-05-16_09-48-02_claim-office-prose_v2-iterative_opus-4-7-no-thinking

Generated: 2026-05-16T09:52:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v2-iterative |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 253s |
| Started | 2026-05-16T09:48:02+00:00 |
| Ended | 2026-05-16T09:52:16+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, pricing.ts, runner.ts, types.ts
- **Implementation LOC** (total): 315
- **Test file**: claims.spec.ts
- **Test file LOC**: 90
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_09-48-02_claim-office-prose_v2-iterative_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_09-48-02_claim-office-prose_v2-iterative_opus-4-7-no-thinking

 ✓ src/pricing.spec.ts  (9 tests) 3ms
 ✓ src/claims.spec.ts  (6 tests) 2ms
 ✓ src/runner.spec.ts  (3 tests) 3ms

 Test Files  3 passed (3)
      Tests  18 passed (18)
   Start at  09:52:17
   Duration  416ms (transform 40ms, setup 0ms, collect 49ms, tests 8ms, environment 0ms, prepare 128ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 110 | ×1 | 110 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 15 | ×5 | 75 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **927** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 261 |
| Functions | 14 |
| Longest Function | 37 lines |
| Avg LOC/Function | 11.93 |
| Median LOC/Function | 6.50 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 21 |
| Code Quality | 0 |
| **Total** | **22** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.30 | 0 |
| Cognitive (SonarJS) | 6 | 3.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2308542 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 64.97s |
| Avg Red Phase | 29.17s |
| Avg Green Phase | 35.8s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
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


