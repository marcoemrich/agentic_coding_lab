# Analysis Report: 2026-09-23_13-00-00_game-of-life-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-4

Generated: 2026-09-23T13:10:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 634s |
| Started | 2026-09-23T13:00:05+00:00 |
| Ended | 2026-09-23T13:10:52+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 50
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 56
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_13-00-00_game-of-life-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_13-00-00_game-of-life-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-4

 ✓ src/game-of-life.spec.ts  (15 tests) 7ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  13:10:54
   Duration  373ms (transform 78ms, setup 0ms, collect 84ms, tests 7ms, environment 0ms, prepare 89ms)
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
| Invocations | 19 | ×2 | 38 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **164** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 5 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.40 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 2.40 | 0 |
| Cognitive (SonarJS) | 5 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1290697 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


