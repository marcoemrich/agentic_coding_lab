# Analysis Report: 2026-05-08_11-42-20_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

Generated: 2026-05-09T11:10:35+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 257s |
| Started | 2026-05-08T11:42:20+00:00 |
| Ended | 2026-05-08T11:46:38+00:00 |

## Code Metrics

- **Implementation file**: premium.ts
- **Implementation LOC**: 120
- **Test file**: premium.spec.ts
- **Test file LOC**: 243
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-42-20_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-42-20_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

 ✓ src/premium.spec.ts  (17 tests) 3ms
 ✓ src/scenario.spec.ts  (6 tests) 6ms
 ✓ src/claim.spec.ts  (15 tests) 6ms

 Test Files  3 passed (3)
      Tests  38 passed (38)
   Start at  11:10:36
   Duration  366ms (transform 67ms, setup 2ms, collect 91ms, tests 15ms, environment 1ms, prepare 269ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 31 | ×1 | 31 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **328** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 97 |
| Functions | 6 |
| Longest Function | 14 lines |
| Avg LOC/Function | 8 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 2.91 | 1 |
| Cognitive (SonarJS) | 22 | 6.70 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3096343 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 24.81s |
| Avg Red Phase | 0.74s |
| Avg Green Phase | 23s |
| Avg Refactor Phase | 1.07s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


