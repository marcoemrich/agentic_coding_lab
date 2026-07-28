# Analysis Report: 2026-07-28_03-26-38_game-of-life-example-mapping_v6.6-lab-split-oc_gpt-5-6-sol

Generated: 2026-07-28T03:36:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-oc |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 605s |
| Started | 2026-07-28T03:26:38+00:00 |
| Ended | 2026-07-28T03:36:45+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 30
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 39
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-28_03-26-38_game-of-life-example-mapping_v6.6-lab-split-oc_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-28_03-26-38_game-of-life-example-mapping_v6.6-lab-split-oc_gpt-5-6-sol

 ✓ src/game-of-life.spec.ts  (7 tests) 4ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  03:36:46
   Duration  190ms (transform 24ms, setup 0ms, collect 19ms, tests 4ms, environment 0ms, prepare 63ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **140** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 26 |
| Functions | 1 |
| Longest Function | 20 lines |
| Avg LOC/Function | 20.00 |
| Median LOC/Function | 20.00 |
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
| McCabe (Cyclomatic) | 4 | 2.25 | 0 |
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2076435 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 14 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


