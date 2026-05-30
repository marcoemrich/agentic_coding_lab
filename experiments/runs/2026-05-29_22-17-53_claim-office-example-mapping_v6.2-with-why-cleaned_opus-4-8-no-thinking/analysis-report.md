# Analysis Report: 2026-05-29_22-17-53_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

Generated: 2026-05-30T00:17:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8, <synthetic> |
| Thinking | unknown |
| Duration | 7201s |
| Started | 2026-05-29T22:17:53+00:00 |
| Ended | 2026-05-30T00:17:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 319
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 390
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_22-17-53_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_22-17-53_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 6ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  00:17:55
   Duration  172ms (transform 38ms, setup 0ms, collect 38ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 6 | ×5 | 30 |
| Assignments | 102 | ×6 | 612 |
| **Total Mass** | | | **947** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 255 |
| Functions | 41 |
| Longest Function | 29 lines |
| Avg LOC/Function | 3.71 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 5 | 1.36 | 0 |
| Cognitive (SonarJS) | 5 | 1.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 56777624 |
| Context Utilization | 144% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 232.81s |
| Avg Red Phase | 73.29s |
| Avg Green Phase | 28.8s |
| Avg Refactor Phase | 130.72s |

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
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


