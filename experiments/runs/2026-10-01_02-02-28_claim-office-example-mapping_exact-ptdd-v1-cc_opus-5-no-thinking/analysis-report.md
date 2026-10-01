# Analysis Report: 2026-10-01_02-02-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T02:21:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1162s |
| Started | 2026-10-01T02:02:28+00:00 |
| Ended | 2026-10-01T02:21:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 299
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 454
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_02-02-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_02-02-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (47 tests) 9ms
 ✓ src/cli.spec.ts  (5 tests) 829ms

 Test Files  2 passed (2)
      Tests  52 passed (52)
   Start at  02:21:54
   Duration  1.36s (transform 91ms, setup 0ms, collect 91ms, tests 838ms, environment 0ms, prepare 146ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 100 | ×2 | 200 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **654** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 237 |
| Functions | 27 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.70 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.53 | 0 |
| Cognitive (SonarJS) | 3 | 1.54 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21172833 |
| Context Utilization | 75% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 75 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 96 |
| Predictions Total | 97 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 48 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


