# Analysis Report: 2026-09-12_23-45-17_game-of-life-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking-4

Generated: 2026-09-13T00:11:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-hybrid-v2.9-stack-profile-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1576s |
| Started | 2026-09-12T23:45:17+00:00 |
| Ended | 2026-09-13T00:11:38+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 47
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 70
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-12_23-45-17_game-of-life-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-12_23-45-17_game-of-life-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking-4

 ✓ src/game-of-life.spec.ts  (11 tests) 10ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  00:11:40
   Duration  540ms (transform 94ms, setup 0ms, collect 95ms, tests 10ms, environment 0ms, prepare 150ms)
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
| Invocations | 22 | ×2 | 44 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 4 | ×5 | 20 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **191** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 6 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.83 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.62 | 0 |
| Cognitive (SonarJS) | 3 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17093064 |
| Context Utilization | 95% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 155.20s |
| Avg Red Phase | 34.54s |
| Avg Green Phase | 43.74s |
| Avg Refactor Phase | 76.92s |

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
| Tests Passed Immediately | 8 |


