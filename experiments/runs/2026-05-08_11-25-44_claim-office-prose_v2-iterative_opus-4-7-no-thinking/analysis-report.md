# Analysis Report: 2026-05-08_11-25-44_claim-office-prose_v2-iterative_opus-4-7-no-thinking

Generated: 2026-05-09T11:09:54+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v2-iterative |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 190s |
| Started | 2026-05-08T11:25:44+00:00 |
| Ended | 2026-05-08T11:28:56+00:00 |

## Code Metrics

- **Implementation file**: claims.ts
- **Implementation LOC**: 62
- **Test file**: claims.spec.ts
- **Test file LOC**: 70
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-25-44_claim-office-prose_v2-iterative_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-25-44_claim-office-prose_v2-iterative_opus-4-7-no-thinking

 ✓ src/claims.spec.ts  (6 tests) 2ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms
 ✓ src/pricing.spec.ts  (11 tests) 3ms

 Test Files  3 passed (3)
      Tests  20 passed (20)
   Start at  11:09:55
   Duration  335ms (transform 56ms, setup 0ms, collect 71ms, tests 8ms, environment 0ms, prepare 258ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 3 | ×5 | 15 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **160** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 5 |
| Longest Function | 15 lines |
| Avg LOC/Function | 7 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **18** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.12 | 0 |
| Cognitive (SonarJS) | 11 | 3.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1811185 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 74.41s |
| Avg Red Phase | 27.52s |
| Avg Green Phase | 46.89s |
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


