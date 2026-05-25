# Analysis Report: 2026-05-25_13-37-22_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T13:48:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-audit-bundle |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 638s |
| Started | 2026-05-25T13:37:22+00:00 |
| Ended | 2026-05-25T13:48:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 94
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 129
- **Active tests**: 8
- **Remaining todos**: 35

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_13-37-22_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_13-37-22_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests | 35 skipped) 3ms

 Test Files  1 passed (1)
      Tests  8 passed | 35 todo (43)
   Start at  13:48:02
   Duration  156ms (transform 26ms, setup 0ms, collect 25ms, tests 3ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 32 | ×2 | 64 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 4 | ×5 | 20 |
| Assignments | 30 | ×6 | 180 |
| **Total Mass** | | | **301** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 79 |
| Functions | 9 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.11 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.80 | 0 |
| Cognitive (SonarJS) | 6 | 2.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10173438 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 76.82s |
| Avg Red Phase | 18.58s |
| Avg Green Phase | 18.92s |
| Avg Refactor Phase | 39.32s |

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
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


