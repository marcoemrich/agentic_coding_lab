# Analysis Report: 2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-4

Generated: 2026-08-10T13:44:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1284s |
| Started | 2026-08-10T13:23:08+00:00 |
| Ended | 2026-08-10T13:44:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 114
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 169
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol-4

 ✓ src/claim-office.spec.ts  (26 tests) 371ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  13:44:36
   Duration  546ms (transform 34ms, setup 0ms, collect 43ms, tests 371ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 6 | ×5 | 30 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **491** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 109 |
| Functions | 3 |
| Longest Function | 26 lines |
| Avg LOC/Function | 16.00 |
| Median LOC/Function | 20.00 |
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
| McCabe (Cyclomatic) | 6 | 2.78 | 0 |
| Cognitive (SonarJS) | 6 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5602059 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 33 |
| Predictions Total | 34 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


