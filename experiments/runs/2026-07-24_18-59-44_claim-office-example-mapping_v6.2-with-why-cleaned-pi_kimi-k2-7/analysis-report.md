# Analysis Report: 2026-07-24_18-59-44_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7

Generated: 2026-07-25T20:27:55+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | kimi-k2-7 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1595s |
| Started | 2026-07-24T18:59:44+00:00 |
| Ended | 2026-07-24T19:26:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 209
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 336
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_18-59-44_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_18-59-44_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7

 ✓ src/claim-office.spec.ts  (35 tests) 8ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  20:27:56
   Duration  514ms (transform 57ms, setup 0ms, collect 54ms, tests 8ms, environment 0ms, prepare 137ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **737** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 184 |
| Functions | 18 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.61 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 5 | 2.04 | 0 |
| Cognitive (SonarJS) | 4 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17448197 |
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
| Predictions Correct | 66 |
| Predictions Total | 66 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


