# Analysis Report: 2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-2

Generated: 2026-09-14T16:00:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 293s |
| Started | 2026-09-14T15:44:32+00:00 |
| Ended | 2026-09-14T15:49:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 173
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 136
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-2

 ✓ src/claim-office.spec.ts  (16 tests) 9ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  16:00:52
   Duration  393ms (transform 62ms, setup 0ms, collect 63ms, tests 9ms, environment 0ms, prepare 91ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 78 | ×1 | 78 |
| Invocations | 104 | ×2 | 208 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **696** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 154 |
| Functions | 14 |
| Longest Function | 25 lines |
| Avg LOC/Function | 7.36 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 6 | 2.72 | 0 |
| Cognitive (SonarJS) | 5 | 2.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 380392 |
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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


