# Analysis Report: 2026-07-25_04-28-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

Generated: 2026-07-25T04:31:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | gpt-5-6-terra |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 173s |
| Started | 2026-07-25T04:28:28+00:00 |
| Ended | 2026-07-25T04:31:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 71
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 57
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_04-28-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_04-28-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

 ✓ src/claim-office.spec.ts  (21 tests) 6ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  04:31:23
   Duration  162ms (transform 33ms, setup 0ms, collect 30ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 51 | ×2 | 102 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 34 | ×6 | 204 |
| **Total Mass** | | | **445** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 67 |
| Functions | 6 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.17 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.00 | 0 |
| Cognitive (SonarJS) | 10 | 3.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 122074 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 7 |
| Accuracy | 85% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


