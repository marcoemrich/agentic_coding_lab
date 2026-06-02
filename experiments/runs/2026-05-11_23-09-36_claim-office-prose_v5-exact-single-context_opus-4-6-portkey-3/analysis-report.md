# Analysis Report: 2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-3

Generated: 2026-06-02T07:54:14+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1391s |
| Started | 2026-05-11T23:09:36+00:00 |
| Ended | 2026-05-11T23:32:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 128
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 309
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-3
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-3

 ✓ src/claim-office.spec.ts  (14 tests) 3ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  07:54:16
   Duration  383ms (transform 31ms, setup 0ms, collect 34ms, tests 3ms, environment 0ms, prepare 96ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 41 | ×1 | 41 |
| Invocations | 45 | ×2 | 90 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 4 | ×5 | 20 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **475** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 113 |
| Functions | 9 |
| Longest Function | 17 lines |
| Avg LOC/Function | 8.67 |
| Median LOC/Function | 8.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 2 | 1.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28995279 |
| Context Utilization | 82% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 109.23s |
| Avg Red Phase | 29.2s |
| Avg Green Phase | 29.05s |
| Avg Refactor Phase | 50.98s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


