# Analysis Report: 2026-08-11_22-40-22_game-of-life-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T22:49:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.1-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 562s |
| Started | 2026-08-11T22:40:22+00:00 |
| Ended | 2026-08-11T22:49:46+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 87
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 141
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_22-40-22_game-of-life-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_22-40-22_game-of-life-example-mapping_v6.1.1-lab-split-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  22:49:46
   Duration  188ms (transform 28ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **241** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 63 |
| Functions | 9 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.11 |
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
| McCabe (Cyclomatic) | 5 | 2.22 | 0 |
| Cognitive (SonarJS) | 7 | 4.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9585529 |
| Context Utilization | 54% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 127.57s |
| Avg Red Phase | 25.03s |
| Avg Green Phase | 27.89s |
| Avg Refactor Phase | 74.65s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 8 |


