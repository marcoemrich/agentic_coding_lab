# Analysis Report: 2026-05-11_01-15-42_game-of-life-example-mapping_v5.1-minimized_opus-4-6-portkey

Generated: 2026-05-11T01:23:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-minimized |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 458s |
| Started | 2026-05-11T01:15:42+00:00 |
| Ended | 2026-05-11T01:23:21+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 39
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 46
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_01-15-42_game-of-life-example-mapping_v5.1-minimized_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 6ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  01:23:22
   Duration  187ms (transform 28ms, setup 0ms, collect 27ms, tests 6ms, environment 0ms, prepare 56ms)
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
| Invocations | 26 | ×2 | 52 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **184** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 32 |
| Functions | 5 |
| Longest Function | 13 lines |
| Avg LOC/Function | 7.20 |
| Median LOC/Function | 9.00 |
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
| McCabe (Cyclomatic) | 5 | 1.70 | 0 |
| Cognitive (SonarJS) | 7 | 6.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10982839 |
| Context Utilization | 49% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 59.99s |
| Avg Red Phase | 22.32s |
| Avg Green Phase | 20.35s |
| Avg Refactor Phase | 17.32s |

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
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


