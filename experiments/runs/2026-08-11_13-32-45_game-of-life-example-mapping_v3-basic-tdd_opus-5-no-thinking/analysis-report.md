# Analysis Report: 2026-08-11_13-32-45_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-11T13:35:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 152s |
| Started | 2026-08-11T13:32:45+00:00 |
| Ended | 2026-08-11T13:35:19+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 67
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 144
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_13-32-45_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_13-32-45_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (16 tests) 6ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  13:35:19
   Duration  192ms (transform 38ms, setup 0ms, collect 33ms, tests 6ms, environment 0ms, prepare 66ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 6 | ×5 | 30 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **216** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 50 |
| Functions | 7 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.43 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 4 | 1.88 | 0 |
| Cognitive (SonarJS) | 5 | 3.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1777833 |
| Context Utilization | 28% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 10.11s |
| Avg Red Phase | 8.18s |
| Avg Green Phase | 1.93s |
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


