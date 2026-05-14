# Analysis Report: 2026-05-14_21-38-56_game-of-life-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

Generated: 2026-05-14T21:40:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 82s |
| Started | 2026-05-14T21:38:56+00:00 |
| Ended | 2026-05-14T21:40:19+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 41
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 86
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-14_21-38-56_game-of-life-example-mapping_v3-basic-tdd_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-14_21-38-56_game-of-life-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (12 tests) 3ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  21:40:20
   Duration  160ms (transform 25ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 6 | ×5 | 30 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **180** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 32 |
| Functions | 2 |
| Longest Function | 37 lines |
| Avg LOC/Function | 19.50 |
| Median LOC/Function | 19.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 7.50 | 1 |
| Cognitive (SonarJS) | 28 | 28.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 935220 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 24.69s |
| Avg Red Phase | 19.98s |
| Avg Green Phase | 2.26s |
| Avg Refactor Phase | 2.45s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


