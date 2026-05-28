# Analysis Report: 2026-05-28_06-01-07_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-28T09:03:12+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3682s |
| Started | 2026-05-28T06:01:07+00:00 |
| Ended | 2026-05-28T07:02:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 184
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 392
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-28_06-01-07_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-28_06-01-07_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  09:03:13
   Duration  504ms (transform 55ms, setup 0ms, collect 43ms, tests 6ms, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **803** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 146 |
| Functions | 34 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.24 |
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
| McCabe (Cyclomatic) | 3 | 1.39 | 0 |
| Cognitive (SonarJS) | 2 | 1.13 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39092255 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 94.01s |
| Avg Red Phase | 20.22s |
| Avg Green Phase | 13.21s |
| Avg Refactor Phase | 60.58s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 62 |
| Predictions Total | 62 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


