# Analysis Report: 2026-07-24_20-30-02_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7-no-thinking

Generated: 2026-07-25T13:03:47+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | kimi-k2-7-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1557s |
| Started | 2026-07-24T20:30:02+00:00 |
| Ended | 2026-07-24T20:56:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 234
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 438
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_20-30-02_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_20-30-02_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests) 6ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  13:03:48
   Duration  353ms (transform 40ms, setup 0ms, collect 36ms, tests 6ms, environment 0ms, prepare 90ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **878** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 204 |
| Functions | 21 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.79 | 0 |
| Cognitive (SonarJS) | 7 | 2.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12967594 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 27 |
| Predictions Total | 27 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


