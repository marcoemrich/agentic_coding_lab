# Analysis Report: 2026-08-17_14-49-04_claim-office-example-mapping_basic-sol-tdd-app-measured-tool-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T15:10:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-measured-tool-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1271s |
| Started | 2026-08-17T14:49:04+00:00 |
| Ended | 2026-08-17T15:10:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 148
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 202
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_14-49-04_claim-office-example-mapping_basic-sol-tdd-app-measured-tool-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_14-49-04_claim-office-example-mapping_basic-sol-tdd-app-measured-tool-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (37 tests) 2186ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  15:10:17
   Duration  2.39s (transform 50ms, setup 0ms, collect 48ms, tests 2.19s, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **497** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 132 |
| Functions | 10 |
| Longest Function | 15 lines |
| Avg LOC/Function | 7.40 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 4 | 1.79 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8857374 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 37 |
| Predictions Total | 38 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


