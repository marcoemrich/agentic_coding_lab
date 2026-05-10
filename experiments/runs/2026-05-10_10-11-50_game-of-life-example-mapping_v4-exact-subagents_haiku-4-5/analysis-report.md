# Analysis Report: 2026-05-10_10-11-50_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5

Generated: 2026-05-10T10:30:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 1136s |
| Started | 2026-05-10T10:11:51+00:00 |
| Ended | 2026-05-10T10:30:49+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 139
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 53
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_10-11-50_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  10:30:50
   Duration  152ms (transform 25ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 48 | ×2 | 96 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 12 | ×5 | 60 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **500** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 105 |
| Functions | 7 |
| Longest Function | 52 lines |
| Avg LOC/Function | 19 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 6 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 3.91 | 1 |
| Cognitive (SonarJS) | 19 | 9.00 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2987229 |
| Context Utilization | 29% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 120.75s |
| Avg Red Phase | 18.52s |
| Avg Green Phase | 60.35s |
| Avg Refactor Phase | 41.88s |

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
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


