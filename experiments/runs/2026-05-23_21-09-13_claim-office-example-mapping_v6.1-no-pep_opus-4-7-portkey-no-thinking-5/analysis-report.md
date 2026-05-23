# Analysis Report: 2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-5

Generated: 2026-05-23T21:23:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 855s |
| Started | 2026-05-23T21:09:13+00:00 |
| Ended | 2026-05-23T21:23:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 227
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 759
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-5

 ✓ src/claim-office.spec.ts  (50 tests) 375ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  21:23:31
   Duration  572ms (transform 53ms, setup 0ms, collect 51ms, tests 375ms, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 12 | ×5 | 60 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **872** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 199 |
| Functions | 16 |
| Longest Function | 15 lines |
| Avg LOC/Function | 7.44 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 2.12 | 0 |
| Cognitive (SonarJS) | 7 | 2.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21297751 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 202.25s |
| Avg Red Phase | 17.95s |
| Avg Green Phase | 134.7s |
| Avg Refactor Phase | 49.6s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


