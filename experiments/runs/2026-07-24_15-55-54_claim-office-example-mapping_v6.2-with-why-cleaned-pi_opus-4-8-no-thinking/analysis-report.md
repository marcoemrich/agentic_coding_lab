# Analysis Report: 2026-07-24_15-55-54_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

Generated: 2026-07-25T20:24:54+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1961s |
| Started | 2026-07-24T15:55:54+00:00 |
| Ended | 2026-07-24T16:28:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 369
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 483
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_15-55-54_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_15-55-54_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (45 tests) 1241ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  20:24:55
   Duration  1.59s (transform 47ms, setup 0ms, collect 43ms, tests 1.24s, environment 0ms, prepare 106ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 16 | ×5 | 80 |
| Assignments | 97 | ×6 | 582 |
| **Total Mass** | | | **946** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 260 |
| Functions | 31 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.55 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.37 | 0 |
| Cognitive (SonarJS) | 3 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17479172 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 74 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


