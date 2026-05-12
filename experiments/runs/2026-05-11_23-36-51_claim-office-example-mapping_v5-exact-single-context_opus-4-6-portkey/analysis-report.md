# Analysis Report: 2026-05-11_23-36-51_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-12T22:37:52+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 2248s |
| Started | 2026-05-11T23:36:51+00:00 |
| Ended | 2026-05-12T00:14:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 242
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 606
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-36-51_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-36-51_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (29 tests) 6ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
   Start at  22:37:52
   Duration  375ms (transform 36ms, setup 0ms, collect 36ms, tests 6ms, environment 0ms, prepare 73ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 102 | ×2 | 204 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 13 | ×5 | 65 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **811** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 209 |
| Functions | 14 |
| Longest Function | 34 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 9.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 13 | 2.73 | 1 |
| Cognitive (SonarJS) | 26 | 6.56 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 51502315 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 110.12s |
| Avg Red Phase | 35.76s |
| Avg Green Phase | 30.6s |
| Avg Refactor Phase | 43.76s |

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
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


