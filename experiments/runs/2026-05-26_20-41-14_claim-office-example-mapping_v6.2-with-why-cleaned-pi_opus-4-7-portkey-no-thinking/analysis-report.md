# Analysis Report: 2026-05-26_20-41-14_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-7-portkey-no-thinking

Generated: 2026-05-27T00:49:19+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1586s |
| Started | 2026-05-26T20:41:14+00:00 |
| Ended | 2026-05-26T21:07:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 205
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 521
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_20-41-14_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_20-41-14_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 7ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  00:49:20
   Duration  390ms (transform 40ms, setup 0ms, collect 36ms, tests 7ms, environment 0ms, prepare 109ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **807** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 167 |
| Functions | 18 |
| Longest Function | 15 lines |
| Avg LOC/Function | 6.06 |
| Median LOC/Function | 6.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.85 | 0 |
| Cognitive (SonarJS) | 4 | 2.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1840395 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 60 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 31 |
| Predictions Total | 31 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


