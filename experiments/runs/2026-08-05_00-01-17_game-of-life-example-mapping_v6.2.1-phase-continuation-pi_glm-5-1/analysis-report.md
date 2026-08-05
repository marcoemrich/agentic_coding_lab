# Analysis Report: 2026-08-05_00-01-17_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_glm-5-1

Generated: 2026-08-05T00:20:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1146s |
| Started | 2026-08-05T00:01:17+00:00 |
| Ended | 2026-08-05T00:20:25+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 58
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 71
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_00-01-17_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_glm-5-1
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_00-01-17_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_glm-5-1

 ✓ src/game-of-life.spec.ts  (12 tests) 4ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  00:20:26
   Duration  170ms (transform 26ms, setup 0ms, collect 26ms, tests 4ms, environment 0ms, prepare 52ms)
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
| Invocations | 31 | ×2 | 62 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 7 | ×5 | 35 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **192** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 45 |
| Functions | 6 |
| Longest Function | 25 lines |
| Avg LOC/Function | 8.50 |
| Median LOC/Function | 3.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.33 | 0 |
| Cognitive (SonarJS) | 12 | 7.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1234308 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 23 |
| Predictions Total | 24 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


