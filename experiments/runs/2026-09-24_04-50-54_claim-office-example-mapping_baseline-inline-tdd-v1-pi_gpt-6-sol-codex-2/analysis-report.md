# Analysis Report: 2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-2

Generated: 2026-09-24T04:53:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 166s |
| Started | 2026-09-24T04:50:56+00:00 |
| Ended | 2026-09-24T04:53:49+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 72
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 119
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-2

 ✓ src/office.spec.ts  (11 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 337ms

 Test Files  2 passed (2)
      Tests  13 passed (13)
   Start at  04:53:50
   Duration  880ms (transform 79ms, setup 0ms, collect 75ms, tests 344ms, environment 0ms, prepare 177ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 49 | ×2 | 98 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 31 | ×6 | 186 |
| **Total Mass** | | | **426** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 68 |
| Functions | 2 |
| Longest Function | 35 lines |
| Avg LOC/Function | 21.50 |
| Median LOC/Function | 21.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **18** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 13 | 4.00 | 1 |
| Cognitive (SonarJS) | 31 | 8.20 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 223484 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


