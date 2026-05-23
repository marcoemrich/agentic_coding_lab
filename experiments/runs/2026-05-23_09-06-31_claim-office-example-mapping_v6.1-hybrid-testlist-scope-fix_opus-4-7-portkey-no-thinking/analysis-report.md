# Analysis Report: 2026-05-23_09-06-31_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T12:01:03+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1547s |
| Started | 2026-05-23T09:06:31+00:00 |
| Ended | 2026-05-23T09:32:19+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 258
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 569
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_09-06-31_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_09-06-31_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (46 tests) 7ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  12:01:03
   Duration  360ms (transform 47ms, setup 0ms, collect 44ms, tests 7ms, environment 0ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 11 | ×5 | 55 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **872** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 25 |
| Longest Function | 17 lines |
| Avg LOC/Function | 4.88 |
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
| McCabe (Cyclomatic) | 7 | 1.97 | 0 |
| Cognitive (SonarJS) | 8 | 1.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34816228 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 115.07s |
| Avg Red Phase | 20.66s |
| Avg Green Phase | 19.31s |
| Avg Refactor Phase | 75.1s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


