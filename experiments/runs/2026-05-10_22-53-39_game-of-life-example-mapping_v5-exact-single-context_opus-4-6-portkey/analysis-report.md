# Analysis Report: 2026-05-10_22-53-39_game-of-life-example-mapping_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-10T23:00:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 390s |
| Started | 2026-05-10T22:53:39+00:00 |
| Ended | 2026-05-10T23:00:10+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 24
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 40
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_22-53-39_game-of-life-example-mapping_v5-exact-single-context_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (7 tests) 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  23:00:10
   Duration  151ms (transform 22ms, setup 0ms, collect 20ms, tests 3ms, environment 0ms, prepare 42ms)
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
| Invocations | 14 | ×2 | 28 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **125** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 21 |
| Functions | 1 |
| Longest Function | 24 lines |
| Avg LOC/Function | 24.00 |
| Median LOC/Function | 24.00 |
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
| Total Tokens | 7360637 |
| Context Utilization | 44% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 91.66s |
| Avg Red Phase | 27.56s |
| Avg Green Phase | 21.41s |
| Avg Refactor Phase | 42.69s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


