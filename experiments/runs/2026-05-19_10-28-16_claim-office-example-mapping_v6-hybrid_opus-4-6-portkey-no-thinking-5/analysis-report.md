# Analysis Report: 2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-5

Generated: 2026-05-19T11:18:17+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2998s |
| Started | 2026-05-19T10:28:16+00:00 |
| Ended | 2026-05-19T11:18:17+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 179
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 756
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-5

 ✓ src/claim-office.spec.ts  (39 tests) 8ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  11:18:18
   Duration  214ms (transform 51ms, setup 0ms, collect 51ms, tests 8ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 11 | ×5 | 55 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **634** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 161 |
| Functions | 8 |
| Longest Function | 19 lines |
| Avg LOC/Function | 10.38 |
| Median LOC/Function | 12.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.81 | 0 |
| Cognitive (SonarJS) | 9 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 52281412 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 166.21s |
| Avg Red Phase | 31.65s |
| Avg Green Phase | 39.07s |
| Avg Refactor Phase | 95.49s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 77 |
| Predictions Total | 78 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


