# Analysis Report: 2026-08-10_15-37-45_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T15:41:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 252s |
| Started | 2026-08-10T15:37:45+00:00 |
| Ended | 2026-08-10T15:41:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 97
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 108
- **Active tests**: 2
- **Remaining todos**: 46

## Test Results

**Status**: ✅ All tests passing (2 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-37-45_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-37-45_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests | 46 skipped) 2ms

 Test Files  1 passed (1)
      Tests  2 passed | 46 todo (48)
   Start at  15:41:59
   Duration  181ms (transform 29ms, setup 0ms, collect 27ms, tests 2ms, environment 0ms, prepare 60ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 2 | ×5 | 10 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **177** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 76 |
| Functions | 6 |
| Longest Function | 8 lines |
| Avg LOC/Function | 4.67 |
| Median LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 2 | 1.25 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3841157 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 76.63s |
| Avg Red Phase | 22.2s |
| Avg Green Phase | 27.18s |
| Avg Refactor Phase | 27.25s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


