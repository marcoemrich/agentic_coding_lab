# Analysis Report: 2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T21:37:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1679s |
| Started | 2026-05-23T21:09:13+00:00 |
| Ended | 2026-05-23T21:37:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 201
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 487
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 7ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  21:37:16
   Duration  191ms (transform 46ms, setup 0ms, collect 47ms, tests 7ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 12 | ×5 | 60 |
| Assignments | 85 | ×6 | 510 |
| **Total Mass** | | | **825** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 170 |
| Functions | 20 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.70 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.62 | 0 |
| Cognitive (SonarJS) | 4 | 2.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 42340055 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 97.04s |
| Avg Red Phase | 19.12s |
| Avg Green Phase | 26.77s |
| Avg Refactor Phase | 51.15s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 59 |
| Predictions Total | 59 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 32 |


