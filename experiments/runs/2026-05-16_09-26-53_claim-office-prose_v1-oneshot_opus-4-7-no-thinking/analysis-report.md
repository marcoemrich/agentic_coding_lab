# Analysis Report: 2026-05-16_09-26-53_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-23T11:50:46+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 168s |
| Started | 2026-05-16T09:26:53+00:00 |
| Ended | 2026-05-16T09:29:42+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, engine.ts, pricing.ts, types.ts
- **Implementation LOC** (total): 316
- **Test file**: engine.spec.ts
- **Test file LOC**: 185
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-26-53_claim-office-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-26-53_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/pricing.spec.ts  (9 tests) 2ms
 ✓ src/engine.spec.ts  (7 tests) 3ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  11:50:47
   Duration  395ms (transform 42ms, setup 0ms, collect 58ms, tests 5ms, environment 0ms, prepare 178ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 83 | ×1 | 83 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 13 | ×5 | 65 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **790** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 248 |
| Functions | 13 |
| Longest Function | 42 lines |
| Avg LOC/Function | 13.00 |
| Median LOC/Function | 6.00 |
| Imports | 8 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.25 | 0 |
| Cognitive (SonarJS) | 18 | 4.75 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1459870 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 68.93s |
| Avg Red Phase | 25.05s |
| Avg Green Phase | 43.88s |
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


