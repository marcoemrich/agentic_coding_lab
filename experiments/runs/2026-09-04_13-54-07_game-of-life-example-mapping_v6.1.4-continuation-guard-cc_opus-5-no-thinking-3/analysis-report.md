# Analysis Report: 2026-09-04_13-54-07_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking-3

Generated: 2026-09-04T14:03:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.4-continuation-guard-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 544s |
| Started | 2026-09-04T13:54:07+00:00 |
| Ended | 2026-09-04T14:03:16+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 62
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 133
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_13-54-07_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_13-54-07_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking-3

 ✓ src/game-of-life.spec.ts  (10 tests) 6ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  14:03:17
   Duration  309ms (transform 62ms, setup 0ms, collect 66ms, tests 6ms, environment 0ms, prepare 89ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 12 | ×1 | 12 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 6 | ×5 | 30 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **180** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 47 |
| Functions | 5 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.60 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.60 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8266007 |
| Context Utilization | 52% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 134.61s |
| Avg Red Phase | 20.52s |
| Avg Green Phase | 28.79s |
| Avg Refactor Phase | 85.3s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 8 |


