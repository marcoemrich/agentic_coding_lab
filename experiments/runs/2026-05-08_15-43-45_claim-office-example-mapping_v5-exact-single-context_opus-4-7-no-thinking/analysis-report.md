# Analysis Report: 2026-05-08_15-43-45_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-05-10T14:54:30+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 624s |
| Started | 2026-05-08T15:43:45+00:00 |
| Ended | 2026-05-08T15:54:11+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 236
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 610
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_15-43-45_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_15-43-45_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 6ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  14:54:31
   Duration  382ms (transform 37ms, setup 1ms, collect 34ms, tests 6ms, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 12 | ×5 | 60 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **863** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 205 |
| Functions | 14 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.29 |
| Median LOC/Function | 6.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.43 | 0 |
| Cognitive (SonarJS) | 12 | 3.08 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12777707 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 287.98s |
| Avg Red Phase | 20.53s |
| Avg Green Phase | 15.45s |
| Avg Refactor Phase | 252s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


