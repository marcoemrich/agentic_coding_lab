# Analysis Report: 2026-08-11_04-52-33_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T05:10:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1087s |
| Started | 2026-08-11T04:52:33+00:00 |
| Ended | 2026-08-11T05:10:41+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 45
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 128
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_04-52-33_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_04-52-33_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (11 tests) 4ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  05:10:41
   Duration  153ms (transform 26ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 41ms)
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
| Invocations | 20 | ×2 | 40 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **175** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 6 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.83 |
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
| McCabe (Cyclomatic) | 3 | 1.20 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15101885 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 85.60s |
| Avg Red Phase | 19.13s |
| Avg Green Phase | 12.34s |
| Avg Refactor Phase | 54.13s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


