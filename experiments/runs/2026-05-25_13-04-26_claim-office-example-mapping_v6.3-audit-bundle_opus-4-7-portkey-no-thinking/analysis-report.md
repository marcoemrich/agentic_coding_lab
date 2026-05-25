# Analysis Report: 2026-05-25_13-04-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T13:15:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-audit-bundle |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 673s |
| Started | 2026-05-25T13:04:26+00:00 |
| Ended | 2026-05-25T13:15:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 109
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 138
- **Active tests**: 8
- **Remaining todos**: 33

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_13-04-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_13-04-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests | 33 skipped) 4ms

 Test Files  1 passed (1)
      Tests  8 passed | 33 todo (41)
   Start at  13:15:41
   Duration  165ms (transform 31ms, setup 0ms, collect 31ms, tests 4ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 80% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 27 | ×1 | 27 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 4 | ×5 | 20 |
| Assignments | 26 | ×6 | 156 |
| **Total Mass** | | | **269** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 90 |
| Functions | 8 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.25 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.25 | 0 |
| Cognitive (SonarJS) | 3 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9408984 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 75.63s |
| Avg Red Phase | 18.9s |
| Avg Green Phase | 13.69s |
| Avg Refactor Phase | 43.04s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 15 |
| Predictions Total | 16 |
| Accuracy | 93% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


