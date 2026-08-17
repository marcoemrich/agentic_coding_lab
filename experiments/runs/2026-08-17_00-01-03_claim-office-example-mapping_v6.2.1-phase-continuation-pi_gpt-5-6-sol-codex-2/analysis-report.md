# Analysis Report: 2026-08-17_00-01-03_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-2

Generated: 2026-08-17T00:19:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1080s |
| Started | 2026-08-17T00:01:03+00:00 |
| Ended | 2026-08-17T00:19:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 129
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 133
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-01-03_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-01-03_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-2

 ✓ src/claim-office.spec.ts  (33 tests) 6ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  00:19:06
   Duration  175ms (transform 40ms, setup 0ms, collect 33ms, tests 6ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 30 | ×6 | 180 |
| **Total Mass** | | | **405** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 115 |
| Functions | 3 |
| Longest Function | 44 lines |
| Avg LOC/Function | 19.33 |
| Median LOC/Function | 12.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.11 | 0 |
| Cognitive (SonarJS) | 15 | 7.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4405509 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


