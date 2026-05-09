# Analysis Report: 2026-05-09_09-02-47_claim-office-example-mapping_v3-basic-tdd_haiku-4-5

Generated: 2026-05-09T11:19:42+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 330s |
| Started | 2026-05-09T09:02:47+00:00 |
| Ended | 2026-05-09T09:08:20+00:00 |

## Code Metrics

- **Implementation file**: engine.ts
- **Implementation LOC**: 237
- **Test file**: engine.spec.ts
- **Test file LOC**: 391
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_09-02-47_claim-office-example-mapping_v3-basic-tdd_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_09-02-47_claim-office-example-mapping_v3-basic-tdd_haiku-4-5

 ✓ src/engine.spec.ts  (29 tests) 6ms
 ✓ src/cli.spec.ts  (5 tests) 1641ms

 Test Files  2 passed (2)
      Tests  34 passed (34)
   Start at  11:19:43
   Duration  1.99s (transform 58ms, setup 0ms, collect 63ms, tests 1.65s, environment 0ms, prepare 165ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 56% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 10 | ×5 | 50 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **661** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 5 |
| Longest Function | 41 lines |
| Avg LOC/Function | 18 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 12 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 23 | 4.06 | 1 |
| Cognitive (SonarJS) | 45 | 9.44 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7393869 |
| Context Utilization | 44% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 33.13s |
| Avg Red Phase | 4.86s |
| Avg Green Phase | 22.7s |
| Avg Refactor Phase | 5.57s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


