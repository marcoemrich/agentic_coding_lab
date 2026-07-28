# Analysis Report: 2026-07-28_07-02-15_game-of-life-example-mapping_v6.6-lab-split-pi_kimi-k3-nebius

Generated: 2026-07-28T07:55:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-pi |
| Model | kimi-k3-nebius |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3211s |
| Started | 2026-07-28T07:02:15+00:00 |
| Ended | 2026-07-28T07:55:48+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 61
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 41
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-28_07-02-15_game-of-life-example-mapping_v6.6-lab-split-pi_kimi-k3-nebius
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-28_07-02-15_game-of-life-example-mapping_v6.6-lab-split-pi_kimi-k3-nebius

 ✓ src/game-of-life.spec.ts  (8 tests) 5ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  07:55:49
   Duration  183ms (transform 25ms, setup 0ms, collect 24ms, tests 5ms, environment 0ms, prepare 53ms)
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
| Invocations | 31 | ×2 | 62 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **159** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 9 |
| Longest Function | 6 lines |
| Avg LOC/Function | 4.44 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 2 | 1.20 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1645110 |
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
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


