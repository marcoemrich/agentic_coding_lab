# Analysis Report: 2026-11-12_00-56-57_mars-rover-example-mapping_exact-subagents-v2-testlist-fix-cc_sonnet-5-5-no-thinking

Generated: 2026-11-12T01:09:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | mars-rover-example-mapping |
| Workflow | exact-subagents-v2-testlist-fix-cc |
| Model | sonnet-5-5-no-thinking |
| Model Version(s) | claude-sonnet-5-5 |
| Thinking | unknown |
| Duration | 750s |
| Started | 2026-11-12T00:56:57+00:00 |
| Ended | 2026-11-12T01:09:31+00:00 |

## Code Metrics

- **Implementation files**: mars-rover.ts
- **Implementation LOC** (total): 50
- **Test files**: mars-rover.spec.ts
- **Test LOC** (total): 149
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-11-12_00-56-57_mars-rover-example-mapping_exact-subagents-v2-testlist-fix-cc_sonnet-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-11-12_00-56-57_mars-rover-example-mapping_exact-subagents-v2-testlist-fix-cc_sonnet-5-5-no-thinking

 ✓ src/mars-rover.spec.ts  (19 tests) 5ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  01:09:33
   Duration  280ms (transform 56ms, setup 0ms, collect 51ms, tests 5ms, environment 0ms, prepare 84ms)
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
| Invocations | 6 | ×2 | 12 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **91** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 3 |
| Longest Function | 6 lines |
| Avg LOC/Function | 4.33 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 1 | 1.00 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18523995 |
| Context Utilization | 64% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
| Avg Cycle Time | 36.90s |
| Avg Red Phase | 13.27s |
| Avg Green Phase | 8.84s |
| Avg Refactor Phase | 14.79s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 38 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


