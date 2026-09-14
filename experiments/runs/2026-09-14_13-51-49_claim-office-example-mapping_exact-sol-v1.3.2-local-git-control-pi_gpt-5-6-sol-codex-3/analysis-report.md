# Analysis Report: 2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex-3

Generated: 2026-09-14T15:54:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3.2-local-git-control-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1742s |
| Started | 2026-09-14T13:51:52+00:00 |
| Ended | 2026-09-14T14:21:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node-shims.d.ts
- **Implementation LOC** (total): 195
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 234
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex-3

 ✓ src/claim-office.spec.ts  (37 tests) 442ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  15:54:04
   Duration  846ms (transform 81ms, setup 0ms, collect 82ms, tests 442ms, environment 0ms, prepare 103ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 51 | ×2 | 102 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 7 | ×5 | 35 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **627** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 177 |
| Functions | 11 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.18 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 6 | 2.25 | 0 |
| Cognitive (SonarJS) | 5 | 2.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6995978 |
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
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


