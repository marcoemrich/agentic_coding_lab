# Analysis Report: 2026-05-24_03-31-36_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T04:10:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-with-why |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2337s |
| Started | 2026-05-24T03:31:36+00:00 |
| Ended | 2026-05-24T04:10:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 240
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 432
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_03-31-36_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_03-31-36_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 7ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  04:10:35
   Duration  196ms (transform 46ms, setup 0ms, collect 46ms, tests 7ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 75 | ×6 | 450 |
| **Total Mass** | | | **768** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 196 |
| Functions | 26 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.42 |
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
| McCabe (Cyclomatic) | 4 | 1.62 | 0 |
| Cognitive (SonarJS) | 4 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 43728341 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 91.24s |
| Avg Red Phase | 23.69s |
| Avg Green Phase | 19.28s |
| Avg Refactor Phase | 48.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 79 |
| Predictions Total | 82 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


