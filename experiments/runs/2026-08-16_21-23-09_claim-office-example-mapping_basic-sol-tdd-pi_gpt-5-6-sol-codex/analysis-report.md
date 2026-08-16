# Analysis Report: 2026-08-16_21-23-09_claim-office-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T21:37:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 888s |
| Started | 2026-08-16T21:23:09+00:00 |
| Ended | 2026-08-16T21:37:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 120
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 220
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_21-23-09_claim-office-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_21-23-09_claim-office-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (39 tests) 538ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  21:38:00
   Duration  799ms (transform 44ms, setup 0ms, collect 43ms, tests 538ms, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 5 | ×5 | 25 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **525** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 111 |
| Functions | 9 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.44 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 6 | 2.14 | 0 |
| Cognitive (SonarJS) | 4 | 2.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4794003 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


