# Analysis Report: 2026-05-21_19-46-52_claim-office-lite-prose_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T20:21:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2080s |
| Started | 2026-05-21T19:46:52+00:00 |
| Ended | 2026-05-21T20:21:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 185
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 281
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-46-52_claim-office-lite-prose_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-46-52_claim-office-lite-prose_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (29 tests) 4ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
   Start at  20:21:35
   Duration  176ms (transform 38ms, setup 0ms, collect 37ms, tests 4ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 67% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 4 | ×5 | 20 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **488** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 152 |
| Functions | 15 |
| Longest Function | 20 lines |
| Avg LOC/Function | 5.13 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.81 | 0 |
| Cognitive (SonarJS) | 2 | 1.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9107233 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 80.34s |
| Avg Red Phase | 26.96s |
| Avg Green Phase | 18.96s |
| Avg Refactor Phase | 34.42s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 40 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


