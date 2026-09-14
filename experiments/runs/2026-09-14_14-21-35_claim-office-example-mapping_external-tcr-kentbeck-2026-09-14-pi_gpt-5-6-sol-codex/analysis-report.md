# Analysis Report: 2026-09-14_14-21-35_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:57:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 355s |
| Started | 2026-09-14T14:21:36+00:00 |
| Ended | 2026-09-14T14:27:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 200
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 137
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-21-35_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-21-35_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (8 tests) 12ms
 ✓ src/cli.spec.ts  (2 tests) 367ms

 Test Files  2 passed (2)
      Tests  10 passed (10)
   Start at  15:57:01
   Duration  710ms (transform 77ms, setup 0ms, collect 87ms, tests 379ms, environment 0ms, prepare 207ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 11 | ×5 | 55 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **740** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 180 |
| Functions | 12 |
| Longest Function | 29 lines |
| Avg LOC/Function | 9.42 |
| Median LOC/Function | 8.50 |
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
| McCabe (Cyclomatic) | 7 | 2.57 | 0 |
| Cognitive (SonarJS) | 7 | 3.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 543543 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


