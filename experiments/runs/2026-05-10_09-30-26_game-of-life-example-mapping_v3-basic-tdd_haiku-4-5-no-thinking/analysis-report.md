# Analysis Report: 2026-05-10_09-30-26_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

Generated: 2026-05-10T09:31:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 61s |
| Started | 2026-05-10T09:30:26+00:00 |
| Ended | 2026-05-10T09:31:29+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 84
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 102
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_09-30-26_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  09:31:30
   Duration  197ms (transform 30ms, setup 0ms, collect 30ms, tests 4ms, environment 0ms, prepare 62ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 26 | ×1 | 26 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 11 | ×5 | 55 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **307** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 64 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 1 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.60 | 0 |
| Cognitive (SonarJS) | 11 | 5.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1239216 |
| Context Utilization | 20% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 6.40s |
| Avg Red Phase | 2.32s |
| Avg Green Phase | 4.08s |
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
| Tests Passed Immediately | 2 |


