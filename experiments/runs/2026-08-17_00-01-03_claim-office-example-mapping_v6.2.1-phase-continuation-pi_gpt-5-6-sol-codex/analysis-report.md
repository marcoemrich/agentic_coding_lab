# Analysis Report: 2026-08-17_00-01-03_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T00:24:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1386s |
| Started | 2026-08-17T00:01:03+00:00 |
| Ended | 2026-08-17T00:24:11+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 131
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 133
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-01-03_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-01-03_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (22 tests) 7ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  00:24:12
   Duration  189ms (transform 37ms, setup 0ms, collect 36ms, tests 7ms, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **545** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 119 |
| Functions | 11 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.27 |
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
| McCabe (Cyclomatic) | 4 | 2.20 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3199381 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 22 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 19 |
| Predictions Total | 20 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


