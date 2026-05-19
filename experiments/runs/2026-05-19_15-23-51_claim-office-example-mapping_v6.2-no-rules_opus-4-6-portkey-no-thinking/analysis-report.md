# Analysis Report: 2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T16:22:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-no-rules |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3523s |
| Started | 2026-05-19T15:23:51+00:00 |
| Ended | 2026-05-19T16:22:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 165
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 831
- **Active tests**: 40
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests | 1 skipped) 386ms

 Test Files  1 passed (1)
      Tests  40 passed | 1 todo (41)
   Start at  16:22:37
   Duration  600ms (transform 63ms, setup 1ms, collect 62ms, tests 386ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 10 | ×5 | 50 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **639** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 146 |
| Functions | 15 |
| Longest Function | 26 lines |
| Avg LOC/Function | 7.67 |
| Median LOC/Function | 6.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.04 | 0 |
| Cognitive (SonarJS) | 5 | 2.42 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 52087887 |
| Context Utilization | 84% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 173.02s |
| Avg Red Phase | 35.59s |
| Avg Green Phase | 31.74s |
| Avg Refactor Phase | 105.69s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


