# Analysis Report: 2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-4

Generated: 2026-09-24T04:54:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 219s |
| Started | 2026-09-24T04:50:56+00:00 |
| Ended | 2026-09-24T04:54:42+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 65
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 122
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-4

 ✓ src/office.spec.ts  (8 tests) 12ms
 ✓ src/cli.spec.ts  (2 tests) 656ms

 Test Files  2 passed (2)
      Tests  10 passed (10)
   Start at  04:54:43
   Duration  1.47s (transform 149ms, setup 1ms, collect 180ms, tests 668ms, environment 0ms, prepare 224ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **395** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 61 |
| Functions | 1 |
| Longest Function | 37 lines |
| Avg LOC/Function | 37.00 |
| Median LOC/Function | 37.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.25 | 0 |
| Cognitive (SonarJS) | 24 | 8.25 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 445073 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
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


