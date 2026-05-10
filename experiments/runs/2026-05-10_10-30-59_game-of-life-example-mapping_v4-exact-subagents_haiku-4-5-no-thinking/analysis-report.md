# Analysis Report: 2026-05-10_10-30-59_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

Generated: 2026-05-10T10:46:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 951s |
| Started | 2026-05-10T10:30:59+00:00 |
| Ended | 2026-05-10T10:46:52+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 78
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 128
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_10-30-59_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

 ✓ src/game-of-life.spec.ts  (11 tests) 4ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  10:46:53
   Duration  166ms (transform 25ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 32 | ×1 | 32 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 6 | ×5 | 30 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **230** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 63 |
| Functions | 6 |
| Longest Function | 26 lines |
| Avg LOC/Function | 8 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 1 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.25 | 0 |
| Cognitive (SonarJS) | 6 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4012003 |
| Context Utilization | 32% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 74.08s |
| Avg Red Phase | 26.6s |
| Avg Green Phase | 13.2s |
| Avg Refactor Phase | 34.28s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 29 |
| Predictions Total | 29 |
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


