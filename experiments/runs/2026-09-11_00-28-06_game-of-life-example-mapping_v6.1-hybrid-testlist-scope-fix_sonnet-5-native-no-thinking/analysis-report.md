# Analysis Report: 2026-09-11_00-28-06_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking

Generated: 2026-09-11T00:35:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | sonnet-5-native-no-thinking |
| Model Version(s) | claude-sonnet-5 |
| Thinking | unknown |
| Duration | 420s |
| Started | 2026-09-11T00:28:06+00:00 |
| Ended | 2026-09-11T00:35:08+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 42
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 99
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-11_00-28-06_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-11_00-28-06_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 4ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  00:35:09
   Duration  230ms (transform 44ms, setup 1ms, collect 38ms, tests 4ms, environment 0ms, prepare 64ms)
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
| Invocations | 20 | ×2 | 40 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **145** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 4 |
| Longest Function | 19 lines |
| Avg LOC/Function | 7.75 |
| Median LOC/Function | 4.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.80 | 0 |
| Cognitive (SonarJS) | 7 | 5.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7077778 |
| Context Utilization | 52% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 73.94s |
| Avg Red Phase | 17.09s |
| Avg Green Phase | 12.3s |
| Avg Refactor Phase | 44.55s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


