# Analysis Report: 2026-05-26_10-08-16_claim-office-example-mapping_v6.2-refactor-vocab_opus-4-7-portkey-no-thinking

Generated: 2026-05-26T10:47:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-refactor-vocab |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2328s |
| Started | 2026-05-26T10:08:16+00:00 |
| Ended | 2026-05-26T10:47:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 205
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 590
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_10-08-16_claim-office-example-mapping_v6.2-refactor-vocab_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_10-08-16_claim-office-example-mapping_v6.2-refactor-vocab_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 11ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  10:47:07
   Duration  245ms (transform 59ms, setup 0ms, collect 57ms, tests 11ms, environment 0ms, prepare 64ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 11 | ×5 | 55 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **745** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 171 |
| Functions | 30 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.93 |
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
| McCabe (Cyclomatic) | 3 | 1.49 | 0 |
| Cognitive (SonarJS) | 3 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 43037442 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 92.31s |
| Avg Red Phase | 24.65s |
| Avg Green Phase | 21.74s |
| Avg Refactor Phase | 45.92s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 65 |
| Predictions Total | 66 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


