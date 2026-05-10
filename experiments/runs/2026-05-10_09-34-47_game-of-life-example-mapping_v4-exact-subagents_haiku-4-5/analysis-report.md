# Analysis Report: 2026-05-10_09-34-47_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5

Generated: 2026-05-10T09:53:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 1142s |
| Started | 2026-05-10T09:34:47+00:00 |
| Ended | 2026-05-10T09:53:51+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 62
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 105
- **Active tests**: 10
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (10 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_09-34-47_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5

 ✓ src/game-of-life.spec.ts  (11 tests | 1 skipped) 4ms

 Test Files  1 passed (1)
      Tests  10 passed | 1 todo (11)
   Start at  09:53:52
   Duration  167ms (transform 27ms, setup 0ms, collect 26ms, tests 4ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 27 | ×1 | 27 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 8 | ×5 | 40 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **227** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 6 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 1 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 6 | 3.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4687553 |
| Context Utilization | 32% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 124.21s |
| Avg Red Phase | 43.45s |
| Avg Green Phase | 51.06s |
| Avg Refactor Phase | 29.7s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 17 |
| Predictions Total | 20 |
| Accuracy | 85% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


