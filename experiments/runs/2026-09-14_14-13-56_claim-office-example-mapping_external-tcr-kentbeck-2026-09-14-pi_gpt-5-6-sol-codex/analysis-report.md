# Analysis Report: 2026-09-14_14-13-56_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:55:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 426s |
| Started | 2026-09-14T14:13:58+00:00 |
| Ended | 2026-09-14T14:21:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 238
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 211
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-13-56_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-13-56_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (25 tests) 9ms
 ✓ src/cli.spec.ts  (5 tests) 895ms

 Test Files  2 passed (2)
      Tests  30 passed (30)
   Start at  15:55:59
   Duration  1.29s (transform 88ms, setup 0ms, collect 101ms, tests 904ms, environment 0ms, prepare 240ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 69% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 83 | ×1 | 83 |
| Invocations | 111 | ×2 | 222 |
| Conditionals | 27 | ×4 | 108 |
| Loops | 12 | ×5 | 60 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **851** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 212 |
| Functions | 17 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.71 |
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
| McCabe (Cyclomatic) | 8 | 2.28 | 0 |
| Cognitive (SonarJS) | 7 | 1.89 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 712732 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
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


