# Analysis Report: 2026-08-17_07-18-23_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking

Generated: 2026-08-17T10:36:39+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3470s |
| Started | 2026-08-17T07:18:23+00:00 |
| Ended | 2026-08-17T08:16:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 477
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 829
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-18-23_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-18-23_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 620ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  10:36:40
   Duration  969ms (transform 47ms, setup 0ms, collect 46ms, tests 620ms, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 100 | ×2 | 200 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 12 | ×5 | 60 |
| Assignments | 104 | ×6 | 624 |
| **Total Mass** | | | **991** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 285 |
| Functions | 31 |
| Longest Function | 22 lines |
| Avg LOC/Function | 4.87 |
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
| McCabe (Cyclomatic) | 4 | 1.49 | 0 |
| Cognitive (SonarJS) | 3 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 109394391 |
| Context Utilization | 208% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 122.08s |
| Avg Red Phase | 23.68s |
| Avg Green Phase | 26.88s |
| Avg Refactor Phase | 71.52s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 86 |
| Predictions Total | 88 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


