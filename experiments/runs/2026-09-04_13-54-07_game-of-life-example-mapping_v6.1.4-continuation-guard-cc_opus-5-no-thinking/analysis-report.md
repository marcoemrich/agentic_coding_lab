# Analysis Report: 2026-09-04_13-54-07_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

Generated: 2026-09-04T14:08:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.4-continuation-guard-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 853s |
| Started | 2026-09-04T13:54:07+00:00 |
| Ended | 2026-09-04T14:08:25+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 47
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 139
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_13-54-07_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_13-54-07_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 6ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  14:08:26
   Duration  243ms (transform 46ms, setup 0ms, collect 41ms, tests 6ms, environment 0ms, prepare 62ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 2 | ×5 | 10 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **154** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 7 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.86 |
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
| McCabe (Cyclomatic) | 3 | 1.20 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11597131 |
| Context Utilization | 62% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 90.90s |
| Avg Red Phase | 22.16s |
| Avg Green Phase | 13.22s |
| Avg Refactor Phase | 55.52s |

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
| Tests Passed Immediately | 0 |


