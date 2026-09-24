# Analysis Report: 2026-09-23_13-10-00_game-of-life-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-23T13:22:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 739s |
| Started | 2026-09-23T13:10:02+00:00 |
| Ended | 2026-09-23T13:22:29+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 57
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 52
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_13-10-00_game-of-life-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_13-10-00_game-of-life-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex

 ✓ src/game-of-life.spec.ts  (12 tests) 7ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  13:22:31
   Duration  483ms (transform 130ms, setup 0ms, collect 98ms, tests 7ms, environment 0ms, prepare 140ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 8 | ×1 | 8 |
| Invocations | 38 | ×2 | 76 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **212** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 48 |
| Functions | 8 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.38 |
| Median LOC/Function | 3.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.67 | 0 |
| Cognitive (SonarJS) | 7 | 4.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1446392 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


