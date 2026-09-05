# Analysis Report: 2026-09-05_09-12-26_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

Generated: 2026-09-05T09:21:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 520s |
| Started | 2026-09-05T09:12:26+00:00 |
| Ended | 2026-09-05T09:21:08+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 62
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 56
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-12-26_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-12-26_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 6ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  09:21:09
   Duration  351ms (transform 62ms, setup 0ms, collect 65ms, tests 6ms, environment 0ms, prepare 120ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 31 | ×1 | 31 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **208** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 47 |
| Functions | 9 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.89 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.64 | 0 |
| Cognitive (SonarJS) | 3 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7992072 |
| Context Utilization | 49% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 161.28s |
| Avg Red Phase | 18.55s |
| Avg Green Phase | 22.08s |
| Avg Refactor Phase | 120.65s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 8 |


