# Analysis Report: 2026-05-23_11-00-44_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T11:04:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 234s |
| Started | 2026-05-23T11:00:44+00:00 |
| Ended | 2026-05-23T11:04:40+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claim.ts, claimOffice.ts, cli.ts, quote.ts, types.ts
- **Implementation LOC** (total): 344
- **Test file**: claimOffice.spec.ts
- **Test file LOC**: 495
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_11-00-44_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_11-00-44_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

 ✓ src/claimOffice.spec.ts  (38 tests) 24ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  11:04:41
   Duration  206ms (transform 48ms, setup 0ms, collect 51ms, tests 24ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 113 | ×2 | 226 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 13 | ×5 | 65 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **814** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 274 |
| Functions | 19 |
| Longest Function | 32 lines |
| Avg LOC/Function | 10.32 |
| Median LOC/Function | 6.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 8 | 2.32 | 0 |
| Cognitive (SonarJS) | 9 | 3.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2441263 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 45.25s |
| Avg Red Phase | 6.24s |
| Avg Green Phase | 26.53s |
| Avg Refactor Phase | 12.48s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


