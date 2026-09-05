# Analysis Report: 2026-09-05_14-51-22_game-of-life-prose_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T14:56:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-prose |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 281s |
| Started | 2026-09-05T14:51:22+00:00 |
| Ended | 2026-09-05T14:56:05+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 32
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 89
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_14-51-22_game-of-life-prose_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_14-51-22_game-of-life-prose_v3-basic-tdd-pi_gpt-6-astra-codex-no-thinking

 ✓ src/game-of-life.spec.ts  (20 tests) 6ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  14:56:06
   Duration  294ms (transform 42ms, setup 0ms, collect 42ms, tests 6ms, environment 0ms, prepare 101ms)
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
| Invocations | 18 | ×2 | 36 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **142** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 27 |
| Functions | 2 |
| Longest Function | 26 lines |
| Avg LOC/Function | 14.50 |
| Median LOC/Function | 14.50 |
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
| Total Tokens | 308755 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
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


