# Analysis Report: 2026-05-23_14-26-12_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking

Generated: 2026-05-23T14:37:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 697s |
| Started | 2026-05-23T14:26:12+00:00 |
| Ended | 2026-05-23T14:37:50+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 32
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 45
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_14-26-12_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_14-26-12_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (7 tests) 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  14:37:50
   Duration  179ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 57ms)
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
| Invocations | 14 | ×2 | 28 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 5 | ×5 | 25 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **145** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 25 |
| Functions | 4 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.50 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.86 | 0 |
| Cognitive (SonarJS) | 4 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7499143 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 92.44s |
| Avg Red Phase | 23.57s |
| Avg Green Phase | 13.35s |
| Avg Refactor Phase | 55.52s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


