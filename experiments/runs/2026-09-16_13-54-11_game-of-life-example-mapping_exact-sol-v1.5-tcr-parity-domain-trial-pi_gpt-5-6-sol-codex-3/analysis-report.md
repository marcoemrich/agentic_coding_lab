# Analysis Report: 2026-09-16_13-54-11_game-of-life-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex-3

Generated: 2026-09-16T14:02:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 464s |
| Started | 2026-09-16T13:54:13+00:00 |
| Ended | 2026-09-16T14:02:03+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 51
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 50
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_13-54-11_game-of-life-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_13-54-11_game-of-life-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex-3

 ✓ src/game-of-life.spec.ts  (11 tests) 7ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  14:02:04
   Duration  447ms (transform 70ms, setup 0ms, collect 46ms, tests 7ms, environment 0ms, prepare 155ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **144** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 6 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.83 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 267624 |
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
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


