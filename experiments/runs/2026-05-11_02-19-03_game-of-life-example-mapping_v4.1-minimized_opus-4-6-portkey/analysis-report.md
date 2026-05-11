# Analysis Report: 2026-05-11_02-19-03_game-of-life-example-mapping_v4.1-minimized_opus-4-6-portkey

Generated: 2026-05-11T02:32:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.1-minimized |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 790s |
| Started | 2026-05-11T02:19:03+00:00 |
| Ended | 2026-05-11T02:32:14+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 50
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 43
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_02-19-03_game-of-life-example-mapping_v4.1-minimized_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  02:32:15
   Duration  158ms (transform 23ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 32 | ×2 | 64 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 7 | ×5 | 35 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **193** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 5 |
| Longest Function | 26 lines |
| Avg LOC/Function | 9.20 |
| Median LOC/Function | 4.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.25 | 0 |
| Cognitive (SonarJS) | 9 | 5.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4685845 |
| Context Utilization | 40% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 86.78s |
| Avg Red Phase | 29.63s |
| Avg Green Phase | 21.52s |
| Avg Refactor Phase | 35.63s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


