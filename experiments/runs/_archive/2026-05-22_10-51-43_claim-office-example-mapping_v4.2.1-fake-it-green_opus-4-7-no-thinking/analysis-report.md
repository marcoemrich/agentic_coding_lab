# Analysis Report: 2026-05-22_10-51-43_claim-office-example-mapping_v4.2.1-fake-it-green_opus-4-7-no-thinking

Generated: 2026-05-22T12:26:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2.1-fake-it-green |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 5664s |
| Started | 2026-05-22T10:51:43+00:00 |
| Ended | 2026-05-22T12:26:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 215
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 444
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_10-51-43_claim-office-example-mapping_v4.2.1-fake-it-green_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_10-51-43_claim-office-example-mapping_v4.2.1-fake-it-green_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 962ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  12:26:09
   Duration  1.14s (transform 41ms, setup 0ms, collect 51ms, tests 962ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 7 | ×5 | 35 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **602** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 187 |
| Functions | 14 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.71 |
| Median LOC/Function | 4.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.77 | 0 |
| Cognitive (SonarJS) | 4 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 27726167 |
| Context Utilization | 20% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 130.80s |
| Avg Red Phase | 48.73s |
| Avg Green Phase | 35.42s |
| Avg Refactor Phase | 46.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 109 |
| Predictions Total | 110 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


