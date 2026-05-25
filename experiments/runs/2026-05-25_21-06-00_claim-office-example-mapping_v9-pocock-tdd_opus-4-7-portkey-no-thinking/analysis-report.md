# Analysis Report: 2026-05-25_21-06-00_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T21:16:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v9-pocock-tdd |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 601s |
| Started | 2026-05-25T21:06:00+00:00 |
| Ended | 2026-05-25T21:16:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 220
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 459
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_21-06-00_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_21-06-00_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (28 tests) 5ms
 ✓ src/cli.spec.ts  (2 tests) 710ms

 Test Files  2 passed (2)
      Tests  30 passed (30)
   Start at  21:16:04
   Duration  1.04s (transform 47ms, setup 1ms, collect 46ms, tests 715ms, environment 0ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 97 | ×2 | 194 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 13 | ×5 | 65 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **687** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 192 |
| Functions | 16 |
| Longest Function | 32 lines |
| Avg LOC/Function | 8.44 |
| Median LOC/Function | 6.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 3.18 | 1 |
| Cognitive (SonarJS) | 13 | 3.75 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17623077 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 16.05s |
| Avg Red Phase | 10.02s |
| Avg Green Phase | 6.03s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 40 |
| Predictions Total | 40 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


