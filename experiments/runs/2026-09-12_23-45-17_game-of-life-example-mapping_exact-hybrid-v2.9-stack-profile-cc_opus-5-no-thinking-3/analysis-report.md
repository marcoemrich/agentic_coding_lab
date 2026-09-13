# Analysis Report: 2026-09-12_23-45-17_game-of-life-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking-3

Generated: 2026-09-13T00:15:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-hybrid-v2.9-stack-profile-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1785s |
| Started | 2026-09-12T23:45:17+00:00 |
| Ended | 2026-09-13T00:15:08+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 43
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 103
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-12_23-45-17_game-of-life-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-12_23-45-17_game-of-life-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking-3

 ✓ src/game-of-life.spec.ts  (13 tests) 11ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  00:15:09
   Duration  328ms (transform 55ms, setup 0ms, collect 54ms, tests 11ms, environment 0ms, prepare 93ms)
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
| Invocations | 21 | ×2 | 42 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 6 | ×5 | 30 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **187** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 32 |
| Functions | 5 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.40 |
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
| McCabe (Cyclomatic) | 4 | 1.60 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 33636029 |
| Context Utilization | 126% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 133.01s |
| Avg Red Phase | 41.2s |
| Avg Green Phase | 36.94s |
| Avg Refactor Phase | 54.87s |

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
| Tests Passed Immediately | 1 |


