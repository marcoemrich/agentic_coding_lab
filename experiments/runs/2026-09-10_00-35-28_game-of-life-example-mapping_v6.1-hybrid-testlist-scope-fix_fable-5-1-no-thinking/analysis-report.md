# Analysis Report: 2026-09-10_00-35-28_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

Generated: 2026-09-10T00:42:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-1-no-thinking |
| Model Version(s) | claude-fable-5-1 |
| Thinking | unknown |
| Duration | 407s |
| Started | 2026-09-10T00:35:28+00:00 |
| Ended | 2026-09-10T00:42:18+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 43
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 49
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_00-35-28_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_00-35-28_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  00:42:19
   Duration  169ms (transform 27ms, setup 0ms, collect 23ms, tests 4ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 8 | ×1 | 8 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 4 | ×5 | 20 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **210** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 33 |
| Functions | 8 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.88 |
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
| McCabe (Cyclomatic) | 2 | 1.12 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5373688 |
| Context Utilization | 45% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 62.58s |
| Avg Red Phase | 15.24s |
| Avg Green Phase | 11.46s |
| Avg Refactor Phase | 35.88s |

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
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


