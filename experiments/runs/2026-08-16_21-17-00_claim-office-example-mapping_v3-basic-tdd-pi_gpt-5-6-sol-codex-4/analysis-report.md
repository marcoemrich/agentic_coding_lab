# Analysis Report: 2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-4

Generated: 2026-08-16T21:20:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 197s |
| Started | 2026-08-16T21:17:01+00:00 |
| Ended | 2026-08-16T21:20:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 157
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 88
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_21-17-00_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-4

 ✓ src/claim-office.spec.ts  (15 tests) 7ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  21:20:21
   Duration  225ms (transform 35ms, setup 0ms, collect 31ms, tests 7ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 11 | ×5 | 55 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **678** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 141 |
| Functions | 13 |
| Longest Function | 22 lines |
| Avg LOC/Function | 6.62 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 7 | 3.06 | 0 |
| Cognitive (SonarJS) | 7 | 2.92 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 263485 |
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
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


