# Analysis Report: 2026-08-17_00-19-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T00:40:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1241s |
| Started | 2026-08-17T00:19:21+00:00 |
| Ended | 2026-08-17T00:40:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 105
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 250
- **Active tests**: 24
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-19-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-19-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (24 tests) 1932ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  00:40:04
   Duration  2.13s (transform 54ms, setup 0ms, collect 55ms, tests 1.93s, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 33 | ×2 | 66 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **471** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 100 |
| Functions | 3 |
| Longest Function | 22 lines |
| Avg LOC/Function | 9.67 |
| Median LOC/Function | 5.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.36 | 0 |
| Cognitive (SonarJS) | 5 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4924077 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


