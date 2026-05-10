# Analysis Report: 2026-05-10_09-28-18_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

Generated: 2026-05-10T09:29:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 43s |
| Started | 2026-05-10T09:28:18+00:00 |
| Ended | 2026-05-10T09:29:03+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 73
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 80
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_09-28-18_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  09:29:03
   Duration  164ms (transform 26ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 38 | ×2 | 76 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 9 | ×5 | 45 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **278** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 59 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 1 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.50 | 0 |
| Cognitive (SonarJS) | 10 | 6.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1029777 |
| Context Utilization | 22% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 4.36s |
| Avg Red Phase | 2.06s |
| Avg Green Phase | 2.3s |
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
| Tests Passed Immediately | 1 |


