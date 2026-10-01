# Analysis Report: 2026-10-01_01-32-09_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:36:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-pocock-2026-09-04-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 274s |
| Started | 2026-10-01T01:32:09+00:00 |
| Ended | 2026-10-01T01:36:46+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts
- **Implementation LOC** (total): 156
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 262
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-32-09_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-32-09_claim-office-example-mapping_external-pocock-2026-09-04-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (36 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 406ms

 Test Files  2 passed (2)
      Tests  39 passed (39)
   Start at  01:36:47
   Duration  1.07s (transform 111ms, setup 0ms, collect 109ms, tests 416ms, environment 0ms, prepare 177ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **595** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 134 |
| Functions | 9 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.56 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 10 | 2.71 | 0 |
| Cognitive (SonarJS) | 12 | 3.75 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4717277 |
| Context Utilization | 37% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


