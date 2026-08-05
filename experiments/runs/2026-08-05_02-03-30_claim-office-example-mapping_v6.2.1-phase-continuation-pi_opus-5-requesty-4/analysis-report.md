# Analysis Report: 2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-4

Generated: 2026-08-05T02:52:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | opus-5-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2938s |
| Started | 2026-08-05T02:03:30+00:00 |
| Ended | 2026-08-05T02:52:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 271
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 620
- **Active tests**: 40
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-4

 ✓ src/claim-office.spec.ts  (41 tests | 1 skipped) 315ms

 Test Files  1 passed (1)
      Tests  40 passed | 1 todo (41)
   Start at  02:52:31
   Duration  494ms (transform 42ms, setup 0ms, collect 44ms, tests 315ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 8 | ×5 | 40 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **706** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 210 |
| Functions | 33 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.24 |
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
| McCabe (Cyclomatic) | 2 | 1.30 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19280230 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 48 |
| Predictions Total | 48 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


