# Analysis Report: 2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T17:38:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1665s |
| Started | 2026-05-19T17:10:58+00:00 |
| Ended | 2026-05-19T17:38:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 80
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 329
- **Active tests**: 20
- **Remaining todos**: 20

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_17-10-58_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (40 tests | 20 skipped) 5ms

 Test Files  1 passed (1)
      Tests  20 passed | 20 todo (40)
   Start at  17:38:46
   Duration  185ms (transform 35ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 39 | ×1 | 39 |
| Invocations | 30 | ×2 | 60 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 5 | ×5 | 25 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **364** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 69 |
| Functions | 6 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.17 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 4 | 1.75 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 418383 |
| Context Utilization | 20% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
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


