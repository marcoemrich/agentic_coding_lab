# Analysis Report: 2026-05-21_14-13-07_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-21T15:43:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5400s |
| Started | 2026-05-21T14:13:07+00:00 |
| Ended | 2026-05-21T15:43:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 132
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 361
- **Active tests**: 34
- **Remaining todos**: 14

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_14-13-07_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_14-13-07_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (48 tests | 14 skipped) 5ms

 Test Files  1 passed (1)
      Tests  34 passed | 14 todo (48)
   Start at  15:43:10
   Duration  216ms (transform 65ms, setup 0ms, collect 62ms, tests 5ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 37 | ×2 | 74 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 5 | ×5 | 25 |
| Assignments | 24 | ×6 | 144 |
| **Total Mass** | | | **312** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 105 |
| Functions | 12 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.75 |
| Median LOC/Function | 5.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.82 | 0 |
| Cognitive (SonarJS) | 2 | 1.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9976605 |
| Context Utilization | 51% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 199.20s |
| Avg Red Phase | 57.03s |
| Avg Green Phase | 56.61s |
| Avg Refactor Phase | 85.56s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 121 |
| Predictions Total | 121 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


