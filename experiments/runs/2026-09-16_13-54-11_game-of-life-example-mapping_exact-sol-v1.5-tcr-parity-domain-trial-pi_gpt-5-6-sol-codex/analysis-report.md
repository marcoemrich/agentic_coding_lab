# Analysis Report: 2026-09-16_13-54-11_game-of-life-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex

Generated: 2026-09-16T14:02:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 482s |
| Started | 2026-09-16T13:54:13+00:00 |
| Ended | 2026-09-16T14:02:23+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 57
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 57
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_13-54-11_game-of-life-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_13-54-11_game-of-life-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex

 ✓ src/game-of-life.spec.ts  (10 tests) 8ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  14:02:25
   Duration  325ms (transform 50ms, setup 0ms, collect 46ms, tests 8ms, environment 0ms, prepare 86ms)
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
| Invocations | 24 | ×2 | 48 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 4 | ×5 | 20 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **148** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 50 |
| Functions | 6 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 6 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1070472 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
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
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


