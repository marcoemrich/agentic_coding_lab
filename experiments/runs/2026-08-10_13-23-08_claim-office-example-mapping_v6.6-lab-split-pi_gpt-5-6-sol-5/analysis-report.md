# Analysis Report: 2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-5

Generated: 2026-08-10T13:43:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1245s |
| Started | 2026-08-10T13:23:08+00:00 |
| Ended | 2026-08-10T13:43:56+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 100
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 144
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-5

 ✓ src/claim-office.spec.ts  (30 tests) 1455ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  13:43:57
   Duration  1.63s (transform 38ms, setup 0ms, collect 37ms, tests 1.46s, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 77% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 7 | ×5 | 35 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **486** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 94 |
| Functions | 4 |
| Longest Function | 20 lines |
| Avg LOC/Function | 11.75 |
| Median LOC/Function | 12.50 |
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
| McCabe (Cyclomatic) | 9 | 3.40 | 0 |
| Cognitive (SonarJS) | 5 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5231659 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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


