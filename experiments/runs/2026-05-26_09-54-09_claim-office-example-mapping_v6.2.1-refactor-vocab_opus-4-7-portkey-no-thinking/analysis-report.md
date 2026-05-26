# Analysis Report: 2026-05-26_09-54-09_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking

Generated: 2026-05-26T10:05:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-refactor-vocab |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 650s |
| Started | 2026-05-26T09:54:09+00:00 |
| Ended | 2026-05-26T10:05:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 65
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 128
- **Active tests**: 8
- **Remaining todos**: 32

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_09-54-09_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_09-54-09_claim-office-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests | 32 skipped) 3ms

 Test Files  1 passed (1)
      Tests  8 passed | 32 todo (40)
   Start at  10:05:01
   Duration  177ms (transform 30ms, setup 0ms, collect 28ms, tests 3ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 64% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 3 | ×5 | 15 |
| Assignments | 23 | ×6 | 138 |
| **Total Mass** | | | **227** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 54 |
| Functions | 7 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 1.67 | 0 |
| Cognitive (SonarJS) | 3 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8885963 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 74.04s |
| Avg Red Phase | 18.36s |
| Avg Green Phase | 13.11s |
| Avg Refactor Phase | 42.57s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


