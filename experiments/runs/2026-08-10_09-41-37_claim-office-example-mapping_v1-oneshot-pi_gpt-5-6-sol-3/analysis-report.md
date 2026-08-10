# Analysis Report: 2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-3

Generated: 2026-08-10T09:43:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v1-oneshot-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 134s |
| Started | 2026-08-10T09:41:37+00:00 |
| Ended | 2026-08-10T09:43:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 221
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 62
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-3

 ✓ src/claim-office.spec.ts  (5 tests) 4ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  09:43:54
   Duration  157ms (transform 29ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 78% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 94 | ×1 | 94 |
| Invocations | 121 | ×2 | 242 |
| Conditionals | 27 | ×4 | 108 |
| Loops | 14 | ×5 | 70 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **832** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 193 |
| Functions | 17 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.00 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 7 | 2.34 | 0 |
| Cognitive (SonarJS) | 6 | 2.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 123265 |
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


