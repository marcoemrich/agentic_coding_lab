# Analysis Report: 2026-05-26_07-14-10_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey-no-thinking

Generated: 2026-05-26T16:44:26+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1910s |
| Started | 2026-05-26T07:14:10+00:00 |
| Ended | 2026-05-26T07:46:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 275
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 432
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/agent-1/experiments/runs/2026-05-26_07-14-10_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/agent-1/experiments/runs/2026-05-26_07-14-10_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 362ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  16:44:27
   Duration  731ms (transform 34ms, setup 0ms, collect 35ms, tests 362ms, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 13 | ×5 | 65 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **938** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 223 |
| Functions | 23 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.85 | 0 |
| Cognitive (SonarJS) | 3 | 1.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13662523 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
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


