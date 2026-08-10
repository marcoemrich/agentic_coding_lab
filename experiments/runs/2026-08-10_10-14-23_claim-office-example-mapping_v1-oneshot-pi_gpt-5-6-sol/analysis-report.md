# Analysis Report: 2026-08-10_10-14-23_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol

Generated: 2026-08-10T10:17:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v1-oneshot-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 176s |
| Started | 2026-08-10T10:14:23+00:00 |
| Ended | 2026-08-10T10:17:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, validation.ts
- **Implementation LOC** (total): 245
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 43
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (4 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_10-14-23_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_10-14-23_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (4 tests) 3ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  10:17:21
   Duration  176ms (transform 29ms, setup 0ms, collect 29ms, tests 3ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 60% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 85 | ×1 | 85 |
| Invocations | 119 | ×2 | 238 |
| Conditionals | 29 | ×4 | 116 |
| Loops | 12 | ×5 | 60 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **925** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 212 |
| Functions | 24 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.67 |
| Median LOC/Function | 5.00 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 5 | 2.13 | 0 |
| Cognitive (SonarJS) | 5 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 246677 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


