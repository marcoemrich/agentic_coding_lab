# Analysis Report: 2026-08-05_06-44-10_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-no-thinking-2

Generated: 2026-08-05T07:37:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3183s |
| Started | 2026-08-05T06:44:10+00:00 |
| Ended | 2026-08-05T07:37:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 267
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 564
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_06-44-10_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_06-44-10_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-no-thinking-2

 ✓ src/claim-office.spec.ts  (38 tests) 747ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  07:37:16
   Duration  981ms (transform 61ms, setup 0ms, collect 79ms, tests 747ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 13 | ×5 | 65 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **725** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 191 |
| Functions | 29 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.59 |
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
| McCabe (Cyclomatic) | 4 | 1.57 | 0 |
| Cognitive (SonarJS) | 4 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19889736 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 54 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 43 |
| Predictions Total | 44 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


