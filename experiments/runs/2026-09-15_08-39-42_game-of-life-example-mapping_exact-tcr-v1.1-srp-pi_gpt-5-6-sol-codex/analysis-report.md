# Analysis Report: 2026-09-15_08-39-42_game-of-life-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T08:46:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-tcr-v1.1-srp-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 385s |
| Started | 2026-09-15T08:39:43+00:00 |
| Ended | 2026-09-15T08:46:11+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 36
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 48
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_08-39-42_game-of-life-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_08-39-42_game-of-life-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex

 ✓ src/game-of-life.spec.ts  (11 tests) 6ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  08:46:12
   Duration  308ms (transform 65ms, setup 0ms, collect 51ms, tests 6ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 6 | ×5 | 30 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **161** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 30 |
| Functions | 3 |
| Longest Function | 17 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.78 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1004546 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


