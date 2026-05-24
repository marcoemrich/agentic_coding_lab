# Analysis Report: 2026-05-24_22-30-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking-3

Generated: 2026-05-24T22:40:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 594s |
| Started | 2026-05-24T22:30:28+00:00 |
| Ended | 2026-05-24T22:40:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 117
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 132
- **Active tests**: 8
- **Remaining todos**: 34

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_22-30-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_22-30-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (42 tests | 34 skipped) 3ms

 Test Files  1 passed (1)
      Tests  8 passed | 34 todo (42)
   Start at  22:40:24
   Duration  168ms (transform 33ms, setup 0ms, collect 32ms, tests 3ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 76% |
| Branches | 78% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 3 | ×5 | 15 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **263** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 94 |
| Functions | 10 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.30 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 3 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9079351 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 67.02s |
| Avg Red Phase | 18.4s |
| Avg Green Phase | 11.92s |
| Avg Refactor Phase | 36.7s |

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
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


