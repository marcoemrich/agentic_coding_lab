# Analysis Report: 2026-08-11_05-17-25_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

Generated: 2026-08-11T05:40:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1381s |
| Started | 2026-08-11T05:17:25+00:00 |
| Ended | 2026-08-11T05:40:27+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 40
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 66
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_05-17-25_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_05-17-25_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  05:40:27
   Duration  161ms (transform 23ms, setup 0ms, collect 21ms, tests 4ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 17 | ×2 | 34 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 6 | ×5 | 30 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **175** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 31 |
| Functions | 6 |
| Longest Function | 8 lines |
| Avg LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12851625 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 109.05s |
| Avg Red Phase | 26.47s |
| Avg Green Phase | 11.78s |
| Avg Refactor Phase | 70.8s |

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


