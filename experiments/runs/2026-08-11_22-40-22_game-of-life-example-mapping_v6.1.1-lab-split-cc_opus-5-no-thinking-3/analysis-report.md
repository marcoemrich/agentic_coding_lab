# Analysis Report: 2026-08-11_22-40-22_game-of-life-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-3

Generated: 2026-08-11T22:50:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.1-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 599s |
| Started | 2026-08-11T22:40:22+00:00 |
| Ended | 2026-08-11T22:50:23+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 36
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 55
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_22-40-22_game-of-life-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_22-40-22_game-of-life-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking-3

 ✓ src/game-of-life.spec.ts  (11 tests) 3ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  22:50:24
   Duration  173ms (transform 27ms, setup 0ms, collect 25ms, tests 3ms, environment 0ms, prepare 51ms)
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
| Invocations | 21 | ×2 | 42 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 3 | ×5 | 15 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **176** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 27 |
| Functions | 9 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.89 |
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
| McCabe (Cyclomatic) | 2 | 1.15 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9613998 |
| Context Utilization | 56% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 90.74s |
| Avg Red Phase | 20.79s |
| Avg Green Phase | 16.66s |
| Avg Refactor Phase | 53.29s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


