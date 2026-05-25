# Analysis Report: 2026-05-25_20-58-11_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T21:05:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v9-pocock-tdd |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 452s |
| Started | 2026-05-25T20:58:11+00:00 |
| Ended | 2026-05-25T21:05:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 260
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 489
- **Active tests**: 27
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (27 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-58-11_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-58-11_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (27 tests) 6ms

 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  21:05:45
   Duration  191ms (transform 42ms, setup 0ms, collect 51ms, tests 6ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 7 | ×5 | 35 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **747** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 14 |
| Longest Function | 31 lines |
| Avg LOC/Function | 9.64 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 11 | 2.47 | 1 |
| Cognitive (SonarJS) | 16 | 3.08 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8432085 |
| Context Utilization | 10% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 7.44s |
| Avg Red Phase | 4.52s |
| Avg Green Phase | 2.92s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 29 |
| Predictions Total | 37 |
| Accuracy | 78% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


