# Analysis Report: 2026-05-16_22-34-24_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking-2

Generated: 2026-05-16T22:57:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7-hybrid-green-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1383s |
| Started | 2026-05-16T22:34:24+00:00 |
| Ended | 2026-05-16T22:57:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 201
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 571
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_22-34-24_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_22-34-24_claim-office-example-mapping_v7-hybrid-green-refactor_opus-4-7-no-thinking-2

 ✓ src/claim-office.spec.ts  (36 tests) 461ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  22:57:29
   Duration  672ms (transform 56ms, setup 0ms, collect 56ms, tests 461ms, environment 0ms, prepare 57ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 14 | ×5 | 70 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **869** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 175 |
| Functions | 21 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.43 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 9 | 2.18 | 0 |
| Cognitive (SonarJS) | 9 | 2.14 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13621153 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 150.83s |
| Avg Red Phase | 25.81s |
| Avg Green Phase | 50.31s |
| Avg Refactor Phase | 74.71s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


