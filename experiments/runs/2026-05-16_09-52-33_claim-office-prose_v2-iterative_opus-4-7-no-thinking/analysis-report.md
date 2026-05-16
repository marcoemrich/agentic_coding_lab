# Analysis Report: 2026-05-16_09-52-33_claim-office-prose_v2-iterative_opus-4-7-no-thinking

Generated: 2026-05-16T09:55:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v2-iterative |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 198s |
| Started | 2026-05-16T09:52:33+00:00 |
| Ended | 2026-05-16T09:55:52+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, pricing.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 349
- **Test file**: claims.spec.ts
- **Test file LOC**: 92
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_09-52-33_claim-office-prose_v2-iterative_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_09-52-33_claim-office-prose_v2-iterative_opus-4-7-no-thinking

 ✓ src/pricing.spec.ts  (13 tests) 3ms
 ✓ src/claims.spec.ts  (6 tests) 2ms
 ✓ src/scenario.spec.ts  (3 tests) 2ms

 Test Files  3 passed (3)
      Tests  22 passed (22)
   Start at  09:55:53
   Duration  416ms (transform 42ms, setup 0ms, collect 52ms, tests 7ms, environment 0ms, prepare 127ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 91 | ×1 | 91 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 13 | ×5 | 65 |
| Assignments | 75 | ×6 | 450 |
| **Total Mass** | | | **860** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 281 |
| Functions | 14 |
| Longest Function | 47 lines |
| Avg LOC/Function | 11.64 |
| Median LOC/Function | 5.00 |
| Imports | 8 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.04 | 0 |
| Cognitive (SonarJS) | 11 | 4.25 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1500227 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 92.91s |
| Avg Red Phase | 35.26s |
| Avg Green Phase | 57.65s |
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
| Tests Passed Immediately | 1 |


