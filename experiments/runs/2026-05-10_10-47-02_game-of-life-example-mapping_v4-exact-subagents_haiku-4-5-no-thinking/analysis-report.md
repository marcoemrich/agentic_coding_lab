# Analysis Report: 2026-05-10_10-47-02_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

Generated: 2026-05-10T11:19:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 1919s |
| Started | 2026-05-10T10:47:02+00:00 |
| Ended | 2026-05-10T11:19:03+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 79
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 218
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_10-47-02_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

 ✓ src/game-of-life.spec.ts  (13 tests) 5ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  11:19:04
   Duration  164ms (transform 31ms, setup 0ms, collect 28ms, tests 5ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 27 | ×1 | 27 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 30 | ×6 | 180 |
| **Total Mass** | | | **286** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 68 |
| Functions | 7 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.27 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3835509 |
| Context Utilization | 33% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 193.25s |
| Avg Red Phase | 34.61s |
| Avg Green Phase | 119.75s |
| Avg Refactor Phase | 38.89s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 21 |
| Predictions Total | 22 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


