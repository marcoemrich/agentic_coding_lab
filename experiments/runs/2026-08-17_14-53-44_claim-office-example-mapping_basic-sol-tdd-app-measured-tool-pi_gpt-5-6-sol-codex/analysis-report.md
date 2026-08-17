# Analysis Report: 2026-08-17_14-53-44_claim-office-example-mapping_basic-sol-tdd-app-measured-tool-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T15:11:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-measured-tool-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1071s |
| Started | 2026-08-17T14:53:44+00:00 |
| Ended | 2026-08-17T15:11:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 137
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 139
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_14-53-44_claim-office-example-mapping_basic-sol-tdd-app-measured-tool-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_14-53-44_claim-office-example-mapping_basic-sol-tdd-app-measured-tool-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (33 tests) 1807ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  15:11:37
   Duration  2.00s (transform 39ms, setup 0ms, collect 37ms, tests 1.81s, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 8 | ×5 | 40 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **540** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 120 |
| Functions | 8 |
| Longest Function | 21 lines |
| Avg LOC/Function | 6.75 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 7 | 2.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8797941 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 68 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 34 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


