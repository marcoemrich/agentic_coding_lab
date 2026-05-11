# Analysis Report: 2026-05-11_03-41-15_game-of-life-example-mapping_v4.2-conservative_opus-4-6-portkey-2

Generated: 2026-05-11T03:53:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.2-conservative |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 742s |
| Started | 2026-05-11T03:41:15+00:00 |
| Ended | 2026-05-11T03:53:39+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 59
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 51
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_03-41-15_game-of-life-example-mapping_v4.2-conservative_opus-4-6-portkey-2

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  03:53:40
   Duration  151ms (transform 23ms, setup 0ms, collect 21ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 7 | ×5 | 35 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **191** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 4 |
| Longest Function | 9 lines |
| Avg LOC/Function | 4.50 |
| Median LOC/Function | 3.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.00 | 0 |
| Cognitive (SonarJS) | 13 | 8.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4124992 |
| Context Utilization | 37% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 110.03s |
| Avg Red Phase | 33.27s |
| Avg Green Phase | 23.05s |
| Avg Refactor Phase | 53.71s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


