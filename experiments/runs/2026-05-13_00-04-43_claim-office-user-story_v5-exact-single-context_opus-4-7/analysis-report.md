# Analysis Report: 2026-05-13_00-04-43_claim-office-user-story_v5-exact-single-context_opus-4-7

Generated: 2026-05-13T00:19:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 872s |
| Started | 2026-05-13T00:04:43+00:00 |
| Ended | 2026-05-13T00:19:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 120
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 259
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-13_00-04-43_claim-office-user-story_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-13_00-04-43_claim-office-user-story_v5-exact-single-context_opus-4-7

 ✓ src/claim-office.spec.ts  (14 tests) 4ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  00:19:17
   Duration  167ms (transform 33ms, setup 0ms, collect 32ms, tests 4ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 37 | ×2 | 74 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 5 | ×5 | 25 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **530** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 104 |
| Functions | 9 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.94 | 0 |
| Cognitive (SonarJS) | 4 | 2.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24223814 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 58.29s |
| Avg Red Phase | 21.25s |
| Avg Green Phase | 24.83s |
| Avg Refactor Phase | 12.21s |

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
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


