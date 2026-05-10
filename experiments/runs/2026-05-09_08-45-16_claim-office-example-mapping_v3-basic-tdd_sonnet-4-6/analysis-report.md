# Analysis Report: 2026-05-09_08-45-16_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6

Generated: 2026-05-10T14:56:15+02:00

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

- **Implementation files**: cli.ts, engine.ts, types.ts
- **Implementation LOC** (total): 337
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

 ✓ src/engine.spec.ts  (45 tests) 8ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  14:56:16
   Duration  358ms (transform 39ms, setup 0ms, collect 41ms, tests 8ms, environment 0ms, prepare 58ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 102 | ×2 | 204 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 16 | ×5 | 80 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **844** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 263 |
| Functions | 9 |
| Longest Function | 35 lines |
| Avg LOC/Function | 10.33 |
| Median LOC/Function | 3.00 |
| Imports | 3 |

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


