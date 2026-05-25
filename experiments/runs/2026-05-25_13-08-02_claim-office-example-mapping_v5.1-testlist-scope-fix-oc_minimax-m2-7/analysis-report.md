# Analysis Report: 2026-05-25_13-08-02_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7

Generated: 2026-05-25T13:19:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | minimax-m2-7 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 711s |
| Started | 2026-05-25T13:08:02+00:00 |
| Ended | 2026-05-25T13:19:54+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 244
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 393
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_13-08-02_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_13-08-02_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7

 ✓ src/claim-office.spec.ts  (54 tests) 8ms

 Test Files  1 passed (1)
      Tests  54 passed (54)
   Start at  13:19:55
   Duration  182ms (transform 45ms, setup 0ms, collect 47ms, tests 8ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 28 | ×4 | 112 |
| Loops | 6 | ×5 | 30 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **700** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 206 |
| Functions | 7 |
| Longest Function | 41 lines |
| Avg LOC/Function | 11.86 |
| Median LOC/Function | 7.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 5.00 | 2 |
| Cognitive (SonarJS) | 17 | 5.75 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15728474 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


