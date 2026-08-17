# Analysis Report: 2026-08-17_00-40-26_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T01:03:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1379s |
| Started | 2026-08-17T00:40:26+00:00 |
| Ended | 2026-08-17T01:03:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 142
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 155
- **Active tests**: 20
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-40-26_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-40-26_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (20 tests) 106ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  01:03:27
   Duration  263ms (transform 32ms, setup 0ms, collect 31ms, tests 106ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 4 | ×5 | 20 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **561** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 128 |
| Functions | 12 |
| Longest Function | 28 lines |
| Avg LOC/Function | 6.58 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.71 | 0 |
| Cognitive (SonarJS) | 6 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4921522 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 27 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


