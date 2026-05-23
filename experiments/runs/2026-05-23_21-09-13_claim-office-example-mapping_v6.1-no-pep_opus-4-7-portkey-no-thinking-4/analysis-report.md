# Analysis Report: 2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-4

Generated: 2026-05-23T21:18:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 524s |
| Started | 2026-05-23T21:09:13+00:00 |
| Ended | 2026-05-23T21:18:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 260
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 434
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-4

 ✓ src/claim-office.spec.ts  (39 tests) 6ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  21:18:00
   Duration  189ms (transform 41ms, setup 0ms, collect 38ms, tests 6ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 16 | ×5 | 80 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **905** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 202 |
| Functions | 16 |
| Longest Function | 25 lines |
| Avg LOC/Function | 9.75 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 2.85 | 1 |
| Cognitive (SonarJS) | 13 | 3.46 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7993261 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 101.87s |
| Avg Red Phase | 21.21s |
| Avg Green Phase | 37.35s |
| Avg Refactor Phase | 43.31s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


