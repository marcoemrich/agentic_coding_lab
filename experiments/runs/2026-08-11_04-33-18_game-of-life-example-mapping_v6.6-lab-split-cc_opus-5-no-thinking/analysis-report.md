# Analysis Report: 2026-08-11_04-33-18_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T04:52:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1139s |
| Started | 2026-08-11T04:33:18+00:00 |
| Ended | 2026-08-11T04:52:18+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 51
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 109
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_04-33-18_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_04-33-18_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  04:52:18
   Duration  154ms (transform 24ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 4 | ×5 | 20 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **216** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 9 |
| Longest Function | 4 lines |
| Avg LOC/Function | 2.33 |
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
| McCabe (Cyclomatic) | 2 | 1.06 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14008976 |
| Context Utilization | 69% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 94.41s |
| Avg Red Phase | 21.17s |
| Avg Green Phase | 13.18s |
| Avg Refactor Phase | 60.06s |

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


