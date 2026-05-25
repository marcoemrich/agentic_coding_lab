# Analysis Report: 2026-05-25_21-16-21_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T21:27:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v9-pocock-tdd |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 657s |
| Started | 2026-05-25T21:16:21+00:00 |
| Ended | 2026-05-25T21:27:20+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, engine.ts
- **Implementation LOC** (total): 227
- **Test file**: engine.spec.ts
- **Test file LOC**: 388
- **Active tests**: 23
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_21-16-21_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_21-16-21_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking

 ✓ src/engine.spec.ts  (27 tests) 6ms
 ✓ src/cli.spec.ts  (2 tests) 722ms

 Test Files  2 passed (2)
      Tests  29 passed (29)
   Start at  21:27:21
   Duration  1.05s (transform 51ms, setup 0ms, collect 54ms, tests 728ms, environment 0ms, prepare 91ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 11 | ×5 | 55 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **811** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 14 |
| Longest Function | 34 lines |
| Avg LOC/Function | 8.36 |
| Median LOC/Function | 4.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 12 | 3.06 | 1 |
| Cognitive (SonarJS) | 14 | 4.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13225690 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 23.30s |
| Avg Red Phase | 14.4s |
| Avg Green Phase | 8.9s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 29 |
| Predictions Total | 32 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


