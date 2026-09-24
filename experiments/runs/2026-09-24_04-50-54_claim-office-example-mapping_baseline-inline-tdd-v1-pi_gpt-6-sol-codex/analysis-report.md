# Analysis Report: 2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

Generated: 2026-09-24T04:55:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 255s |
| Started | 2026-09-24T04:50:56+00:00 |
| Ended | 2026-09-24T04:55:18+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 96
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 146
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

 ✓ src/office.spec.ts  (23 tests) 8ms
 ✓ src/cli.spec.ts  (5 tests) 791ms

 Test Files  2 passed (2)
      Tests  28 passed (28)
   Start at  04:55:19
   Duration  1.33s (transform 84ms, setup 0ms, collect 83ms, tests 799ms, environment 0ms, prepare 138ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 29 | ×6 | 174 |
| **Total Mass** | | | **439** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 88 |
| Functions | 3 |
| Longest Function | 31 lines |
| Avg LOC/Function | 12.67 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 19 |
| Code Quality | 0 |
| **Total** | **23** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 15 | 3.20 | 1 |
| Cognitive (SonarJS) | 34 | 8.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 506231 |
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


