# Analysis Report: 2026-07-25_03-32-33_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2

Generated: 2026-07-25T13:07:41+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | glm-5-2 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2238s |
| Started | 2026-07-25T03:32:33+00:00 |
| Ended | 2026-07-25T04:09:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 225
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 376
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-32-33_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-32-33_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2

 ✓ src/claim-office.spec.ts  (38 tests) 242ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  13:07:52
   Duration  621ms (transform 38ms, setup 0ms, collect 39ms, tests 242ms, environment 0ms, prepare 59ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **616** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 194 |
| Functions | 14 |
| Longest Function | 20 lines |
| Avg LOC/Function | 5.71 |
| Median LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 6 | 1.84 | 0 |
| Cognitive (SonarJS) | 6 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26439317 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
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


