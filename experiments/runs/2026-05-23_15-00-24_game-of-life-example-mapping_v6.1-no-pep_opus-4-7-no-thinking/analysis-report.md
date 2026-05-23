# Analysis Report: 2026-05-23_15-00-24_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking

Generated: 2026-05-23T15:16:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-no-pep |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 987s |
| Started | 2026-05-23T15:00:24+00:00 |
| Ended | 2026-05-23T15:16:52+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 41
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 52
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_15-00-24_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_15-00-24_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  15:16:52
   Duration  160ms (transform 26ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **138** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 4 |
| Longest Function | 21 lines |
| Avg LOC/Function | 7.50 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 7 | 2.60 | 0 |
| Cognitive (SonarJS) | 8 | 5.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10393293 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 95.62s |
| Avg Red Phase | 20.93s |
| Avg Green Phase | 10.63s |
| Avg Refactor Phase | 64.06s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


