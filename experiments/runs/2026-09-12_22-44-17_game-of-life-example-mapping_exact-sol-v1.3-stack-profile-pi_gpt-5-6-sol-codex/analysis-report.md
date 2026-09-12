# Analysis Report: 2026-09-12_22-44-17_game-of-life-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex

Generated: 2026-09-12T22:53:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-sol-v1.3-stack-profile-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 522s |
| Started | 2026-09-12T22:44:18+00:00 |
| Ended | 2026-09-12T22:53:01+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 55
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 54
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-12_22-44-17_game-of-life-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-12_22-44-17_game-of-life-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex

 ✓ src/game-of-life.spec.ts  (11 tests) 4ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  22:53:02
   Duration  172ms (transform 28ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 51ms)
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
| Invocations | 31 | ×2 | 62 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 7 | ×5 | 35 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **177** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 7 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.86 |
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
| McCabe (Cyclomatic) | 5 | 2.11 | 0 |
| Cognitive (SonarJS) | 7 | 3.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1719561 |
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
| Predictions Correct | 16 |
| Predictions Total | 16 |
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


