# Analysis Report: 2026-05-21_10-56-34_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T11:01:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 316s |
| Started | 2026-05-21T10:56:34+00:00 |
| Ended | 2026-05-21T11:01:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 287
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 564
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_10-56-34_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_10-56-34_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 6ms
 ✓ src/cli.spec.ts  (5 tests) 1859ms

 Test Files  2 passed (2)
      Tests  45 passed (45)
   Start at  11:01:52
   Duration  2.18s (transform 47ms, setup 0ms, collect 54ms, tests 1.86s, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 16 | ×5 | 80 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **820** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 215 |
| Functions | 9 |
| Longest Function | 86 lines |
| Avg LOC/Function | 22.00 |
| Median LOC/Function | 11.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 8 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **18** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 19 | 3.92 | 1 |
| Cognitive (SonarJS) | 45 | 10.14 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2299823 |
| Context Utilization | 31% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 15.41s |
| Avg Red Phase | 12.12s |
| Avg Green Phase | 3.29s |
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
| Tests Passed Immediately | 1 |


