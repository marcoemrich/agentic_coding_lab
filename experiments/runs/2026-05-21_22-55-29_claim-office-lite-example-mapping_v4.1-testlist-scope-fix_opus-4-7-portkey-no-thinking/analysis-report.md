# Analysis Report: 2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T23:45:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2979s |
| Started | 2026-05-21T22:55:29+00:00 |
| Ended | 2026-05-21T23:45:10+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 190
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 596
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 8ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  23:45:11
   Duration  210ms (transform 50ms, setup 0ms, collect 51ms, tests 8ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **672** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 171 |
| Functions | 17 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.82 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 1.96 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16713664 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 83.31s |
| Avg Red Phase | 25.79s |
| Avg Green Phase | 20.81s |
| Avg Refactor Phase | 36.71s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 44 |
| Predictions Total | 46 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


