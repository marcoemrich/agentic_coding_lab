# Analysis Report: 2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex-5

Generated: 2026-09-14T15:54:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3.2-local-git-control-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1007s |
| Started | 2026-09-14T13:51:52+00:00 |
| Ended | 2026-09-14T14:08:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 136
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 177
- **Active tests**: 24
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_13-51-49_claim-office-example-mapping_exact-sol-v1.3.2-local-git-control-pi_gpt-5-6-sol-codex-5

 ✓ src/claim-office.spec.ts  (30 tests) 3091ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  15:54:51
   Duration  3.45s (transform 62ms, setup 0ms, collect 57ms, tests 3.09s, environment 0ms, prepare 90ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **555** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 124 |
| Functions | 9 |
| Longest Function | 15 lines |
| Avg LOC/Function | 7.22 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 3 | 1.67 | 0 |
| Cognitive (SonarJS) | 2 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4847167 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 29 |
| Predictions Total | 30 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


