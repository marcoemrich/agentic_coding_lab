# Analysis Report: 2026-05-30_13-40-42_game-of-life-example-mapping_v6.5-end-refactor_opus-4-7-no-thinking

Generated: 2026-05-30T13:59:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1134s |
| Started | 2026-05-30T13:40:42+00:00 |
| Ended | 2026-05-30T13:59:38+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 32
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 51
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_13-40-42_game-of-life-example-mapping_v6.5-end-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_13-40-42_game-of-life-example-mapping_v6.5-end-refactor_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 5ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  13:59:38
   Duration  154ms (transform 24ms, setup 0ms, collect 23ms, tests 5ms, environment 0ms, prepare 42ms)
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
| Invocations | 18 | ×2 | 36 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **153** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 24 |
| Functions | 5 |
| Longest Function | 9 lines |
| Avg LOC/Function | 3.40 |
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
| McCabe (Cyclomatic) | 3 | 1.20 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11447367 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 106.58s |
| Avg Red Phase | 26.62s |
| Avg Green Phase | 13.58s |
| Avg Refactor Phase | 66.38s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


