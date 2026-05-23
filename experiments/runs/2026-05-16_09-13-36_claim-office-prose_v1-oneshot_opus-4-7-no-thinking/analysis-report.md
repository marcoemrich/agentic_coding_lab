# Analysis Report: 2026-05-16_09-13-36_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-23T11:50:13+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 223s |
| Started | 2026-05-16T09:13:36+00:00 |
| Ended | 2026-05-16T09:17:20+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, engine.ts, pricing.ts, types.ts
- **Implementation LOC** (total): 320
- **Test file**: claims.spec.ts
- **Test file LOC**: 82
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-13-36_claim-office-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-13-36_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/pricing.spec.ts  (11 tests) 3ms
 ✓ src/claims.spec.ts  (6 tests) 3ms
 ✓ src/engine.spec.ts  (4 tests) 4ms

 Test Files  3 passed (3)
      Tests  21 passed (21)
   Start at  11:50:13
   Duration  387ms (transform 59ms, setup 0ms, collect 79ms, tests 10ms, environment 1ms, prepare 301ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 91 | ×1 | 91 |
| Invocations | 97 | ×2 | 194 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 15 | ×5 | 75 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **822** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 248 |
| Functions | 17 |
| Longest Function | 52 lines |
| Avg LOC/Function | 11.29 |
| Median LOC/Function | 6.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 1 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.43 | 0 |
| Cognitive (SonarJS) | 14 | 4.10 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1911655 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 140.21s |
| Avg Red Phase | 86.21s |
| Avg Green Phase | 54s |
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


