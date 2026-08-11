# Analysis Report: 2026-08-11_14-27-24_game-of-life-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking

Generated: 2026-08-11T14:50:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.7-app-subordinate-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1399s |
| Started | 2026-08-11T14:27:24+00:00 |
| Ended | 2026-08-11T14:50:44+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 63
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 127
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_14-27-24_game-of-life-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_14-27-24_game-of-life-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (13 tests) 8ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  14:50:45
   Duration  227ms (transform 33ms, setup 0ms, collect 40ms, tests 8ms, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 2 | ×5 | 10 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **138** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 52 |
| Functions | 8 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.38 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 3 | 1.33 | 0 |
| Cognitive (SonarJS) | 2 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18414211 |
| Context Utilization | 81% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 92.09s |
| Avg Red Phase | 24.46s |
| Avg Green Phase | 11.81s |
| Avg Refactor Phase | 55.82s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


