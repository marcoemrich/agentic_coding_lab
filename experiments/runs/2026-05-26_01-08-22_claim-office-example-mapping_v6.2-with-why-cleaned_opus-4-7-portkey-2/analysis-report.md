# Analysis Report: 2026-05-26_01-08-22_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-2

Generated: 2026-05-26T01:50:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 2531s |
| Started | 2026-05-26T01:08:22+00:00 |
| Ended | 2026-05-26T01:50:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 242
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 614
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_01-08-22_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_01-08-22_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-2

 ✓ src/claim-office.spec.ts  (40 tests) 14ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  01:50:37
   Duration  386ms (transform 91ms, setup 0ms, collect 96ms, tests 14ms, environment 0ms, prepare 90ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 93 | ×6 | 558 |
| **Total Mass** | | | **869** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 205 |
| Functions | 27 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.56 |
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
| McCabe (Cyclomatic) | 5 | 1.54 | 0 |
| Cognitive (SonarJS) | 5 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 45303096 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 103.72s |
| Avg Red Phase | 20.57s |
| Avg Green Phase | 25.38s |
| Avg Refactor Phase | 57.77s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 80 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


