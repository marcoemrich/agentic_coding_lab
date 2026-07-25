# Analysis Report: 2026-07-25_03-22-18_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

Generated: 2026-07-25T20:33:20+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 871s |
| Started | 2026-07-25T03:22:18+00:00 |
| Ended | 2026-07-25T03:36:50+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 188
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 440
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-22-18_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-22-18_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

 ✓ src/claim-office.spec.ts  (45 tests) 7ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  20:33:22
   Duration  411ms (transform 42ms, setup 0ms, collect 35ms, tests 7ms, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 9 | ×5 | 45 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **753** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 4 |
| Longest Function | 92 lines |
| Avg LOC/Function | 35.75 |
| Median LOC/Function | 20.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 11 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 26 | 6.43 | 1 |
| Cognitive (SonarJS) | 63 | 19.75 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15942527 |
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
| Predictions Correct | 21 |
| Predictions Total | 21 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


