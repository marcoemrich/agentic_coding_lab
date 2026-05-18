# Analysis Report: 2026-05-18_11-57-54_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking

Generated: 2026-05-18T12:12:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5.2-bullets-cut |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 897s |
| Started | 2026-05-18T11:57:54+00:00 |
| Ended | 2026-05-18T12:12:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 92
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 139
- **Active tests**: 8
- **Remaining todos**: 16

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_11-57-54_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_11-57-54_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (24 tests | 16 skipped) 3ms

 Test Files  1 passed (1)
      Tests  8 passed | 16 todo (24)
   Start at  12:12:53
   Duration  221ms (transform 34ms, setup 1ms, collect 32ms, tests 3ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 71% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 36 | ×2 | 72 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 5 | ×5 | 25 |
| Assignments | 33 | ×6 | 198 |
| **Total Mass** | | | **331** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 76 |
| Functions | 11 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.73 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 3 | 1.53 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 354557 |
| Context Utilization | 5% |

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


