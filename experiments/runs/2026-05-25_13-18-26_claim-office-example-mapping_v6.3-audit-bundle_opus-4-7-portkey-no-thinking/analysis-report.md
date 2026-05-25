# Analysis Report: 2026-05-25_13-18-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T13:37:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-audit-bundle |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1119s |
| Started | 2026-05-25T13:18:26+00:00 |
| Ended | 2026-05-25T13:37:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 104
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 217
- **Active tests**: 14
- **Remaining todos**: 29

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_13-18-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_13-18-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests | 29 skipped) 3ms

 Test Files  1 passed (1)
      Tests  14 passed | 29 todo (43)
   Start at  13:37:07
   Duration  179ms (transform 34ms, setup 0ms, collect 34ms, tests 3ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 30 | ×1 | 30 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 5 | ×5 | 25 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **419** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 84 |
| Functions | 11 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.09 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 3 | 1.60 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19342584 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 75.48s |
| Avg Red Phase | 16.45s |
| Avg Green Phase | 13.74s |
| Avg Refactor Phase | 45.29s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 28 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


