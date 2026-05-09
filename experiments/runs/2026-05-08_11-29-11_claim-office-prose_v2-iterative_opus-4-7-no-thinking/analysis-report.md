# Analysis Report: 2026-05-08_11-29-11_claim-office-prose_v2-iterative_opus-4-7-no-thinking

Generated: 2026-05-09T11:10:05+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v2-iterative |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 192s |
| Started | 2026-05-08T11:29:11+00:00 |
| Ended | 2026-05-08T11:32:25+00:00 |

## Code Metrics

- **Implementation file**: claims.ts
- **Implementation LOC**: 64
- **Test file**: claims.spec.ts
- **Test file LOC**: 74
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (25 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-29-11_claim-office-prose_v2-iterative_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-29-11_claim-office-prose_v2-iterative_opus-4-7-no-thinking

 ✓ src/pricing.spec.ts  (16 tests) 3ms
 ✓ src/claims.spec.ts  (6 tests) 3ms
 ✓ src/scenario.spec.ts  (3 tests) 2ms

 Test Files  3 passed (3)
      Tests  25 passed (25)
   Start at  11:10:05
   Duration  375ms (transform 67ms, setup 0ms, collect 88ms, tests 8ms, environment 0ms, prepare 252ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 14 | ×2 | 28 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 2 | ×5 | 10 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **135** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 2 |
| Longest Function | 22 lines |
| Avg LOC/Function | 18 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.72 | 0 |
| Cognitive (SonarJS) | 14 | 4.11 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1754380 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 56.55s |
| Avg Red Phase | 27.49s |
| Avg Green Phase | 29.06s |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


