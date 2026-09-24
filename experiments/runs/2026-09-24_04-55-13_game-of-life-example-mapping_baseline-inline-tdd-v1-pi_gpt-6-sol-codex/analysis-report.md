# Analysis Report: 2026-09-24_04-55-13_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

Generated: 2026-09-24T04:56:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 101s |
| Started | 2026-09-24T04:55:14+00:00 |
| Ended | 2026-09-24T04:56:58+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 26
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 55
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-55-13_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-55-13_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

 ✓ src/game-of-life.spec.ts  (9 tests) 6ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  04:56:59
   Duration  473ms (transform 117ms, setup 0ms, collect 92ms, tests 6ms, environment 0ms, prepare 127ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **144** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 23 |
| Functions | 2 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.50 |
| Median LOC/Function | 1.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 4.33 | 1 |
| Cognitive (SonarJS) | 21 | 21.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 127385 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


