# Analysis Report: 2026-05-10_22-42-25_game-of-life-example-mapping_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-10T22:53:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 659s |
| Started | 2026-05-10T22:42:25+00:00 |
| Ended | 2026-05-10T22:53:29+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 40
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 57
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_22-42-25_game-of-life-example-mapping_v5-exact-single-context_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 5ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  22:53:30
   Duration  153ms (transform 24ms, setup 0ms, collect 23ms, tests 5ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 11 | ×1 | 11 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 3 | ×5 | 15 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **172** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 4 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.75 |
| Median LOC/Function | 7.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.50 | 0 |
| Cognitive (SonarJS) | 16 | 5.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12381383 |
| Context Utilization | 55% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 105.35s |
| Avg Red Phase | 29.84s |
| Avg Green Phase | 26.58s |
| Avg Refactor Phase | 48.93s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 15 |
| Predictions Total | 16 |
| Accuracy | 93% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


