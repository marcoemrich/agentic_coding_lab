# Analysis Report: 2026-05-10_22-53-00_game-of-life-example-mapping_v5.1-minimized_opus-4-6-portkey

Generated: 2026-05-10T23:00:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-minimized |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 433s |
| Started | 2026-05-10T22:53:00+00:00 |
| Ended | 2026-05-10T23:00:14+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 29
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 43
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_22-53-00_game-of-life-example-mapping_v5.1-minimized_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  23:00:15
   Duration  171ms (transform 26ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 44ms)
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
| Invocations | 17 | ×2 | 34 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **143** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 25 |
| Functions | 3 |
| Longest Function | 23 lines |
| Avg LOC/Function | 9.33 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 11 | 3.50 | 1 |
| Cognitive (SonarJS) | 17 | 17.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9121708 |
| Context Utilization | 45% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 78.03s |
| Avg Red Phase | 31.62s |
| Avg Green Phase | 19.92s |
| Avg Refactor Phase | 26.49s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


