# Analysis Report: 2026-05-10_09-29-13_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

Generated: 2026-05-10T09:30:17+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 62s |
| Started | 2026-05-10T09:29:13+00:00 |
| Ended | 2026-05-10T09:30:17+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 71
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 140
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_09-29-13_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

 ✓ src/game-of-life.spec.ts  (14 tests) 4ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  09:30:17
   Duration  177ms (transform 28ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 49ms)
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
| Invocations | 36 | ×2 | 72 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 13 | ×5 | 65 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **298** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 52 |
| Functions | 2 |
| Longest Function | 55 lines |
| Avg LOC/Function | 35 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 16 | 11.00 | 1 |
| Cognitive (SonarJS) | 33 | 21.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1365744 |
| Context Utilization | 22% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 5.94s |
| Avg Red Phase | 4.72s |
| Avg Green Phase | 1.22s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


