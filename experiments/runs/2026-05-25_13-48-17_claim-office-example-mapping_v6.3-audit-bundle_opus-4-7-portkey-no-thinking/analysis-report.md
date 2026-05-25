# Analysis Report: 2026-05-25_13-48-17_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T13:58:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-audit-bundle |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 597s |
| Started | 2026-05-25T13:48:17+00:00 |
| Ended | 2026-05-25T13:58:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 51
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 114
- **Active tests**: 7
- **Remaining todos**: 33

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_13-48-17_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_13-48-17_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests | 33 skipped) 2ms

 Test Files  1 passed (1)
      Tests  7 passed | 33 todo (40)
   Start at  13:58:16
   Duration  163ms (transform 27ms, setup 0ms, collect 25ms, tests 2ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 58% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 3 | ×5 | 15 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **209** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 43 |
| Functions | 6 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.50 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 2 | 1.22 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7723093 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 75.21s |
| Avg Red Phase | 17.72s |
| Avg Green Phase | 15.23s |
| Avg Refactor Phase | 42.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 14 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


