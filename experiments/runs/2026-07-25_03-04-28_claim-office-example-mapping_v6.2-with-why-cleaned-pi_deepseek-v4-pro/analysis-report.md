# Analysis Report: 2026-07-25_03-04-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

Generated: 2026-07-25T20:32:17+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 830s |
| Started | 2026-07-25T03:04:28+00:00 |
| Ended | 2026-07-25T03:18:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 242
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 496
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-04-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-04-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

 ✓ src/claim-office.spec.ts  (42 tests) 11ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  20:32:18
   Duration  481ms (transform 72ms, setup 0ms, collect 70ms, tests 11ms, environment 1ms, prepare 125ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 16 | ×5 | 80 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **758** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 208 |
| Functions | 14 |
| Longest Function | 27 lines |
| Avg LOC/Function | 11.07 |
| Median LOC/Function | 8.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.75 | 0 |
| Cognitive (SonarJS) | 11 | 4.09 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18603325 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


