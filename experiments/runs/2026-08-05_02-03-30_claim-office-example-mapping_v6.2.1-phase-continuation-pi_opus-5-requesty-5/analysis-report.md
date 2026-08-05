# Analysis Report: 2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-5

Generated: 2026-08-05T02:50:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | opus-5-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2803s |
| Started | 2026-08-05T02:03:30+00:00 |
| Ended | 2026-08-05T02:50:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 265
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 590
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-5

 ✓ src/claim-office.spec.ts  (42 tests) 605ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  02:50:16
   Duration  790ms (transform 41ms, setup 0ms, collect 50ms, tests 605ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **761** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 26 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.85 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.49 | 0 |
| Cognitive (SonarJS) | 3 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14505477 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 62 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 44 |
| Predictions Total | 44 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


