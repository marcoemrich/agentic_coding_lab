# Analysis Report: 2026-05-09_08-45-16_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6

Generated: 2026-05-09T11:14:39+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 446s |
| Started | 2026-05-09T08:45:16+00:00 |
| Ended | 2026-05-09T08:52:45+00:00 |

## Code Metrics

- **Implementation file**: engine.ts
- **Implementation LOC**: 246
- **Test file**: engine.spec.ts
- **Test file LOC**: 602
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-45-16_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-45-16_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6

 ✓ src/engine.spec.ts  (45 tests) 7ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  11:14:40
   Duration  399ms (transform 39ms, setup 0ms, collect 39ms, tests 7ms, environment 0ms, prepare 78ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 15 | ×5 | 75 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **732** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 188 |
| Functions | 8 |
| Longest Function | 35 lines |
| Avg LOC/Function | 8 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 19 | 4.50 | 2 |
| Cognitive (SonarJS) | 20 | 8.14 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1992093 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 48.69s |
| Avg Red Phase | 0s |
| Avg Green Phase | 48.69s |
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


