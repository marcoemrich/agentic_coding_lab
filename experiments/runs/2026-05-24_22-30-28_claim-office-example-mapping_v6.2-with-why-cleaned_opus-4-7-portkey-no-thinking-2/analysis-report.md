# Analysis Report: 2026-05-24_22-30-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-24T22:44:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 849s |
| Started | 2026-05-24T22:30:28+00:00 |
| Ended | 2026-05-24T22:44:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 133
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 128
- **Active tests**: 9
- **Remaining todos**: 32

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_22-30-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_22-30-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (41 tests | 32 skipped) 4ms

 Test Files  1 passed (1)
      Tests  9 passed | 32 todo (41)
   Start at  22:44:38
   Duration  188ms (transform 30ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 38 | ×2 | 76 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 5 | ×5 | 25 |
| Assignments | 29 | ×6 | 174 |
| **Total Mass** | | | **323** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 105 |
| Functions | 13 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.31 |
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
| McCabe (Cyclomatic) | 3 | 1.35 | 0 |
| Cognitive (SonarJS) | 3 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10840763 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 86.92s |
| Avg Red Phase | 20.53s |
| Avg Green Phase | 15.36s |
| Avg Refactor Phase | 51.03s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


