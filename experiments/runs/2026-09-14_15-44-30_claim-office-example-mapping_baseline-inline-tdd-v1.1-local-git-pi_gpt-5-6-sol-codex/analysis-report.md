# Analysis Report: 2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T16:00:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 316s |
| Started | 2026-09-14T15:44:32+00:00 |
| Ended | 2026-09-14T15:49:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 211
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 97
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (8 tests) 6ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  16:00:32
   Duration  346ms (transform 58ms, setup 0ms, collect 57ms, tests 6ms, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 76% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 14 | ×5 | 70 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **729** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 190 |
| Functions | 11 |
| Longest Function | 19 lines |
| Avg LOC/Function | 9.09 |
| Median LOC/Function | 11.00 |
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
| McCabe (Cyclomatic) | 12 | 3.63 | 1 |
| Cognitive (SonarJS) | 8 | 3.91 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 344129 |
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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


