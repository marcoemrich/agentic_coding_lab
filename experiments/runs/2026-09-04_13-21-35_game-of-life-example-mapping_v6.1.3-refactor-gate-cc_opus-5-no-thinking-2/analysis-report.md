# Analysis Report: 2026-09-04_13-21-35_game-of-life-example-mapping_v6.1.3-refactor-gate-cc_opus-5-no-thinking-2

Generated: 2026-09-04T13:28:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.3-refactor-gate-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 442s |
| Started | 2026-09-04T13:21:35+00:00 |
| Ended | 2026-09-04T13:28:59+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 44
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 52
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_13-21-35_game-of-life-example-mapping_v6.1.3-refactor-gate-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_13-21-35_game-of-life-example-mapping_v6.1.3-refactor-gate-cc_opus-5-no-thinking-2

 ✓ src/game-of-life.spec.ts  (10 tests) 5ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  13:29:01
   Duration  310ms (transform 43ms, setup 0ms, collect 42ms, tests 5ms, environment 0ms, prepare 95ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 2 | ×5 | 10 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **173** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 8 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.00 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 2 | 1.25 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8275978 |
| Context Utilization | 51% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 103.28s |
| Avg Red Phase | 23.11s |
| Avg Green Phase | 23.62s |
| Avg Refactor Phase | 56.55s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


