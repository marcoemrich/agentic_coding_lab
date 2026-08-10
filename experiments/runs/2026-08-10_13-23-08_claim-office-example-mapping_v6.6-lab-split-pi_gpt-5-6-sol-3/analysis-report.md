# Analysis Report: 2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-3

Generated: 2026-08-10T13:39:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 985s |
| Started | 2026-08-10T13:23:08+00:00 |
| Ended | 2026-08-10T13:39:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 138
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 135
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-3

 ✓ src/claim-office.spec.ts  (18 tests) 741ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  13:39:37
   Duration  916ms (transform 34ms, setup 0ms, collect 34ms, tests 741ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 7 | ×5 | 35 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **487** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 128 |
| Functions | 7 |
| Longest Function | 16 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 8.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 1.93 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3733240 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


