# Analysis Report: 2026-05-11_07-25-18_game-of-life-example-mapping_v4.3-targeted_opus-4-6-portkey

Generated: 2026-05-11T07:38:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.3-targeted |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 810s |
| Started | 2026-05-11T07:25:18+00:00 |
| Ended | 2026-05-11T07:38:50+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 26
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 52
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_07-25-18_game-of-life-example-mapping_v4.3-targeted_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  07:38:51
   Duration  162ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 11 | ×1 | 11 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **121** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 21 |
| Functions | 1 |
| Longest Function | 26 lines |
| Avg LOC/Function | 26.00 |
| Median LOC/Function | 26.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 6.00 | 1 |
| Cognitive (SonarJS) | 17 | 17.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3970664 |
| Context Utilization | 38% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 125.67s |
| Avg Red Phase | 35.29s |
| Avg Green Phase | 28.44s |
| Avg Refactor Phase | 61.94s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


