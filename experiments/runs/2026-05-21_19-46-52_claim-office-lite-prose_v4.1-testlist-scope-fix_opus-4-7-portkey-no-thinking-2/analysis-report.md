# Analysis Report: 2026-05-21_19-46-52_claim-office-lite-prose_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-21T20:23:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2218s |
| Started | 2026-05-21T19:46:52+00:00 |
| Ended | 2026-05-21T20:23:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 126
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 550
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-46-52_claim-office-lite-prose_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-46-52_claim-office-lite-prose_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (30 tests) 5ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  20:23:52
   Duration  187ms (transform 46ms, setup 0ms, collect 47ms, tests 5ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 42 | ×1 | 42 |
| Invocations | 51 | ×2 | 102 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 3 | ×5 | 15 |
| Assignments | 38 | ×6 | 228 |
| **Total Mass** | | | **403** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 111 |
| Functions | 13 |
| Longest Function | 21 lines |
| Avg LOC/Function | 5.85 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.33 | 0 |
| Cognitive (SonarJS) | 5 | 2.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11784427 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 88.51s |
| Avg Red Phase | 27.54s |
| Avg Green Phase | 21.41s |
| Avg Refactor Phase | 39.56s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


