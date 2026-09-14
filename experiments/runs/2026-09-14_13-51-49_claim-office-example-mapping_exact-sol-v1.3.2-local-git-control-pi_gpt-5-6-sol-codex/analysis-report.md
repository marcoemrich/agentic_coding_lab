# Analysis Report: 2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:53:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3.2-local-git-control-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1270s |
| Started | 2026-09-14T13:51:52+00:00 |
| Ended | 2026-09-14T14:13:10+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 141
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 148
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (28 tests) 660ms

 Test Files  1 passed (1)
      Tests  28 passed (28)
   Start at  15:53:14
   Duration  1.07s (transform 86ms, setup 0ms, collect 81ms, tests 660ms, environment 0ms, prepare 106ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 49 | ×2 | 98 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **549** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 128 |
| Functions | 9 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.67 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 6 | 1.83 | 0 |
| Cognitive (SonarJS) | 4 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4782057 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


