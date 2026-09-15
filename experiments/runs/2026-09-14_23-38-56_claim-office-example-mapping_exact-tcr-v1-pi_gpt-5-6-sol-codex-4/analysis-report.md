# Analysis Report: 2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-4

Generated: 2026-09-15T00:00:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1309s |
| Started | 2026-09-14T23:38:58+00:00 |
| Ended | 2026-09-15T00:00:52+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 183
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 267
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-4

 ✓ src/claim-office.spec.ts  (38 tests) 6694ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  00:00:53
   Duration  7.00s (transform 70ms, setup 0ms, collect 68ms, tests 6.69s, environment 0ms, prepare 88ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 49 | ×2 | 98 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **540** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 166 |
| Functions | 9 |
| Longest Function | 30 lines |
| Avg LOC/Function | 10.33 |
| Median LOC/Function | 7.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 4 | 1.55 | 0 |
| Cognitive (SonarJS) | 3 | 1.57 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7031633 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


