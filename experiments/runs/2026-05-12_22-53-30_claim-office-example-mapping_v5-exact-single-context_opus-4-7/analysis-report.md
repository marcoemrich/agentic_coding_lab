# Analysis Report: 2026-05-12_22-53-30_claim-office-example-mapping_v5-exact-single-context_opus-4-7

Generated: 2026-05-12T23:13:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 1214s |
| Started | 2026-05-12T22:53:30+00:00 |
| Ended | 2026-05-12T23:13:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 193
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 454
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_22-53-30_claim-office-example-mapping_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_22-53-30_claim-office-example-mapping_v5-exact-single-context_opus-4-7

 ✓ src/claim-office.spec.ts  (44 tests) 7ms
 ✓ src/cli.spec.ts  (5 tests) 1945ms

 Test Files  2 passed (2)
      Tests  49 passed (49)
   Start at  23:13:45
   Duration  2.32s (transform 74ms, setup 0ms, collect 79ms, tests 1.95s, environment 0ms, prepare 100ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 13 | ×5 | 65 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **862** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 167 |
| Functions | 17 |
| Longest Function | 22 lines |
| Avg LOC/Function | 7.29 |
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
| McCabe (Cyclomatic) | 7 | 2.20 | 0 |
| Cognitive (SonarJS) | 8 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36560420 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 101.21s |
| Avg Red Phase | 76.19s |
| Avg Green Phase | 14.29s |
| Avg Refactor Phase | 10.73s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 24 |
| Accuracy | 91% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


