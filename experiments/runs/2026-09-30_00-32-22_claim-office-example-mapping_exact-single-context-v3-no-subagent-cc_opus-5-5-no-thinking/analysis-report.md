# Analysis Report: 2026-09-30_00-32-22_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking

Generated: 2026-09-30T00:44:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v3-no-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 722s |
| Started | 2026-09-30T00:32:22+00:00 |
| Ended | 2026-09-30T00:44:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 173
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 243
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-30_00-32-22_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-30_00-32-22_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 314ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  00:44:29
   Duration  581ms (transform 55ms, setup 0ms, collect 58ms, tests 314ms, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 12 | ×5 | 60 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **741** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 141 |
| Functions | 22 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.00 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 1.68 | 0 |
| Cognitive (SonarJS) | 8 | 2.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 61988748 |
| Context Utilization | 155% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 26.37s |
| Avg Red Phase | 8.67s |
| Avg Green Phase | 6.92s |
| Avg Refactor Phase | 10.78s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


