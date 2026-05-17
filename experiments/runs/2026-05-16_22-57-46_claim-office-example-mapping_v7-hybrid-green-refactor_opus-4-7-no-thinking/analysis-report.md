# Analysis Report: 2026-05-16_22-57-46_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

Generated: 2026-05-16T23:33:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2129s |
| Started | 2026-05-16T22:57:46+00:00 |
| Ended | 2026-05-16T23:33:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 198
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 458
- **Active tests**: 24
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_22-57-46_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_22-57-46_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (25 tests | 1 skipped) 5ms

 Test Files  1 passed (1)
      Tests  24 passed | 1 todo (25)
   Start at  23:33:17
   Duration  171ms (transform 37ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 7 | ×5 | 35 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **730** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 166 |
| Functions | 23 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.39 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.52 | 0 |
| Cognitive (SonarJS) | 3 | 1.70 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22870703 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 141.07s |
| Avg Red Phase | 40.26s |
| Avg Green Phase | 32.83s |
| Avg Refactor Phase | 67.98s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


