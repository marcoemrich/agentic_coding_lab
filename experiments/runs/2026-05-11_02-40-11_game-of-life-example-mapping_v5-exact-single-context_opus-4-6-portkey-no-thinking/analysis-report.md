# Analysis Report: 2026-05-11_02-40-11_game-of-life-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-11T02:50:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 637s |
| Started | 2026-05-11T02:40:11+00:00 |
| Ended | 2026-05-11T02:50:50+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 27
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 34
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_02-40-11_game-of-life-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (7 tests) 4ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  02:50:51
   Duration  172ms (transform 23ms, setup 0ms, collect 23ms, tests 4ms, environment 0ms, prepare 52ms)
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
| Invocations | 17 | ×2 | 34 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **137** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 23 |
| Functions | 3 |
| Longest Function | 23 lines |
| Avg LOC/Function | 8.67 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 3.50 | 1 |
| Cognitive (SonarJS) | 17 | 17.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11101434 |
| Context Utilization | 54% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 99.96s |
| Avg Red Phase | 29.87s |
| Avg Green Phase | 22.98s |
| Avg Refactor Phase | 47.11s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


