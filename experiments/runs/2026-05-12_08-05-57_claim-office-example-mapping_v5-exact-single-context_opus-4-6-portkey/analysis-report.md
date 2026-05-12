# Analysis Report: 2026-05-12_08-05-57_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-12T22:38:42+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 2755s |
| Started | 2026-05-12T08:05:57+00:00 |
| Ended | 2026-05-12T08:51:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 114
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 608
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-05-57_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-05-57_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (30 tests) 6ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  22:38:43
   Duration  362ms (transform 37ms, setup 0ms, collect 33ms, tests 6ms, environment 0ms, prepare 89ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **447** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 100 |
| Functions | 3 |
| Longest Function | 40 lines |
| Avg LOC/Function | 26.67 |
| Median LOC/Function | 27.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 3.57 | 1 |
| Cognitive (SonarJS) | 17 | 7.25 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 55584203 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 112.22s |
| Avg Red Phase | 34.86s |
| Avg Green Phase | 31.21s |
| Avg Refactor Phase | 46.15s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 58 |
| Predictions Total | 58 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


