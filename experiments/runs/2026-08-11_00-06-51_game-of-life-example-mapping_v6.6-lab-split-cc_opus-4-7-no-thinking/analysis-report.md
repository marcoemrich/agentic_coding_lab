# Analysis Report: 2026-08-11_00-06-51_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

Generated: 2026-08-11T00:28:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1288s |
| Started | 2026-08-11T00:06:51+00:00 |
| Ended | 2026-08-11T00:28:20+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 41
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 53
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_00-06-51_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_00-06-51_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 5ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  00:28:21
   Duration  182ms (transform 27ms, setup 0ms, collect 26ms, tests 5ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 4 | ×5 | 20 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **174** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 32 |
| Functions | 7 |
| Longest Function | 6 lines |
| Avg LOC/Function | 2.86 |
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
| McCabe (Cyclomatic) | 4 | 1.56 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11355862 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 106.05s |
| Avg Red Phase | 25.1s |
| Avg Green Phase | 10.69s |
| Avg Refactor Phase | 70.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 17 |
| Predictions Total | 18 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


