# Analysis Report: 2026-07-24_19-26-36_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7-no-thinking

Generated: 2026-07-25T13:02:54+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | kimi-k2-7-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 908s |
| Started | 2026-07-24T19:26:36+00:00 |
| Ended | 2026-07-24T19:41:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 199
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 335
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_19-26-36_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_19-26-36_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 5ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  13:02:55
   Duration  387ms (transform 38ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 7 | ×5 | 35 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **671** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 168 |
| Functions | 9 |
| Longest Function | 30 lines |
| Avg LOC/Function | 13.78 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.25 | 0 |
| Cognitive (SonarJS) | 9 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8443817 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


