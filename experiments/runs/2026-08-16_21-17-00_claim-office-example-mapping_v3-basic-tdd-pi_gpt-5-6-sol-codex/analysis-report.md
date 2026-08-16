# Analysis Report: 2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T21:20:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 233s |
| Started | 2026-08-16T21:17:00+00:00 |
| Ended | 2026-08-16T21:20:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 202
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 113
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (16 tests) 6ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  21:20:55
   Duration  169ms (transform 33ms, setup 0ms, collect 32ms, tests 6ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 83 | ×1 | 83 |
| Invocations | 116 | ×2 | 232 |
| Conditionals | 30 | ×4 | 120 |
| Loops | 9 | ×5 | 45 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **870** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 180 |
| Functions | 17 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.94 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 10 | 3.00 | 0 |
| Cognitive (SonarJS) | 9 | 2.76 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 246248 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


