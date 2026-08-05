# Analysis Report: 2026-08-05_14-53-13_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-no-thinking-2

Generated: 2026-08-05T15:46:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3186s |
| Started | 2026-08-05T14:53:13+00:00 |
| Ended | 2026-08-05T15:46:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 348
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 595
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_14-53-13_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_14-53-13_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-no-thinking-2

 ✓ src/claim-office.spec.ts  (42 tests) 645ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  15:46:21
   Duration  836ms (transform 56ms, setup 0ms, collect 58ms, tests 645ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 103 | ×6 | 618 |
| **Total Mass** | | | **892** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 286 |
| Functions | 32 |
| Longest Function | 8 lines |
| Avg LOC/Function | 2.38 |
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
| McCabe (Cyclomatic) | 3 | 1.32 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20953714 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 84 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


