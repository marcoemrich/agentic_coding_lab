# Analysis Report: 2026-08-17_07-30-11_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking

Generated: 2026-08-17T10:36:51+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3340s |
| Started | 2026-08-17T07:30:11+00:00 |
| Ended | 2026-08-17T08:25:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 498
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 678
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-30-11_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-30-11_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 439ms

 Test Files  2 passed (2)
      Tests  39 passed (39)
   Start at  10:36:51
   Duration  781ms (transform 71ms, setup 0ms, collect 77ms, tests 446ms, environment 0ms, prepare 164ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 81 | ×1 | 81 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 19 | ×5 | 95 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **908** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 403 |
| Functions | 22 |
| Longest Function | 25 lines |
| Avg LOC/Function | 4.64 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 1.41 | 0 |
| Cognitive (SonarJS) | 5 | 1.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 94100172 |
| Context Utilization | 210% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 121.97s |
| Avg Red Phase | 24.22s |
| Avg Green Phase | 26.67s |
| Avg Refactor Phase | 71.08s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


