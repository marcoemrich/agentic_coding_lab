# Analysis Report: 2026-05-11_23-39-13_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-06-02T07:55:36+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 2213s |
| Started | 2026-05-11T23:39:13+00:00 |
| Ended | 2026-05-12T00:16:07+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 154
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 545
- **Active tests**: 24
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-39-13_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-39-13_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (24 tests) 5ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  07:55:38
   Duration  431ms (transform 37ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 66ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 12 | ×5 | 60 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **611** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 143 |
| Functions | 6 |
| Longest Function | 24 lines |
| Avg LOC/Function | 12.50 |
| Median LOC/Function | 13.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.67 | 0 |
| Cognitive (SonarJS) | 11 | 3.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 49573915 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 112.39s |
| Avg Red Phase | 32.04s |
| Avg Green Phase | 35.34s |
| Avg Refactor Phase | 45.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 48 |
| Predictions Total | 48 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


