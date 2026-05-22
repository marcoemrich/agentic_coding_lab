# Analysis Report: 2026-05-20_23-17-45_claim-office-example-mapping_v4.2-shared-context_opus-4-7

Generated: 2026-05-21T00:47:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7, <synthetic> |
| Thinking | true |
| Duration | 5400s |
| Started | 2026-05-20T23:17:45+00:00 |
| Ended | 2026-05-21T00:47:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 129
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 246
- **Active tests**: 23
- **Remaining todos**: 12

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-20_23-17-45_claim-office-example-mapping_v4.2-shared-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-20_23-17-45_claim-office-example-mapping_v4.2-shared-context_opus-4-7

 ✓ src/claim-office.spec.ts  (35 tests | 12 skipped) 4ms

 Test Files  1 passed (1)
      Tests  23 passed | 12 todo (35)
   Start at  00:47:47
   Duration  170ms (transform 36ms, setup 0ms, collect 35ms, tests 4ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 4 | ×5 | 20 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **399** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 114 |
| Functions | 6 |
| Longest Function | 16 lines |
| Avg LOC/Function | 7.00 |
| Median LOC/Function | 4.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.83 | 0 |
| Cognitive (SonarJS) | 7 | 3.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8395019 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 202.53s |
| Avg Red Phase | 57.74s |
| Avg Green Phase | 51.6s |
| Avg Refactor Phase | 93.19s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


