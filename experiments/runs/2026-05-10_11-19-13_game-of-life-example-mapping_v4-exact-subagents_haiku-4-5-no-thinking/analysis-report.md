# Analysis Report: 2026-05-10_11-19-13_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

Generated: 2026-05-10T11:30:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 703s |
| Started | 2026-05-10T11:19:13+00:00 |
| Ended | 2026-05-10T11:30:58+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 126
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 28
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_11-19-13_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

 ✓ src/game-of-life.spec.ts  (7 tests) 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  11:30:59
   Duration  162ms (transform 27ms, setup 0ms, collect 25ms, tests 3ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 48 | ×2 | 96 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **474** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 96 |
| Functions | 11 |
| Longest Function | 21 lines |
| Avg LOC/Function | 10 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.78 | 0 |
| Cognitive (SonarJS) | 7 | 2.73 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2407287 |
| Context Utilization | 28% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 111.80s |
| Avg Red Phase | 33.48s |
| Avg Green Phase | 50.27s |
| Avg Refactor Phase | 28.05s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 5 |
| Predictions Total | 6 |
| Accuracy | 83% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


