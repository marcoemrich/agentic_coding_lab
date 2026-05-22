# Analysis Report: 2026-05-21_10-59-42_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T12:29:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5400s |
| Started | 2026-05-21T10:59:42+00:00 |
| Ended | 2026-05-21T12:29:43+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 156
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 717
- **Active tests**: 34
- **Remaining todos**: 15

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_10-59-42_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_10-59-42_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (49 tests | 15 skipped) 7ms

 Test Files  1 passed (1)
      Tests  34 passed | 15 todo (49)
   Start at  12:29:44
   Duration  216ms (transform 56ms, setup 0ms, collect 57ms, tests 7ms, environment 0ms, prepare 57ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 37 | ×2 | 74 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 6 | ×5 | 30 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **458** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 135 |
| Functions | 10 |
| Longest Function | 26 lines |
| Avg LOC/Function | 7.30 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 4 | 2.27 | 0 |
| Cognitive (SonarJS) | 4 | 2.11 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8584571 |
| Context Utilization | 47% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 202.82s |
| Avg Red Phase | 56.99s |
| Avg Green Phase | 55.05s |
| Avg Refactor Phase | 90.78s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 99 |
| Predictions Total | 101 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


