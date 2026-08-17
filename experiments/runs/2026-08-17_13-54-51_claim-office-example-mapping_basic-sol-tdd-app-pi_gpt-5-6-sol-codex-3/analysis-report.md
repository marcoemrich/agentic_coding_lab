# Analysis Report: 2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex-3

Generated: 2026-08-17T14:20:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1547s |
| Started | 2026-08-17T13:54:51+00:00 |
| Ended | 2026-08-17T14:20:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 149
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 206
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex-3

 ✓ src/claim-office.spec.ts  (38 tests) 2189ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  14:20:41
   Duration  2.37s (transform 36ms, setup 0ms, collect 40ms, tests 2.19s, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **696** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 138 |
| Functions | 11 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.64 |
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
| McCabe (Cyclomatic) | 8 | 2.33 | 0 |
| Cognitive (SonarJS) | 8 | 2.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7678648 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


