# Analysis Report: 2026-05-25_13-04-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-25T13:18:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-audit-bundle |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 822s |
| Started | 2026-05-25T13:04:26+00:00 |
| Ended | 2026-05-25T13:18:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 81
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 132
- **Active tests**: 9
- **Remaining todos**: 27

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_13-04-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_13-04-26_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (36 tests | 27 skipped) 4ms

 Test Files  1 passed (1)
      Tests  9 passed | 27 todo (36)
   Start at  13:18:10
   Duration  157ms (transform 28ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 70% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 3 | ×5 | 15 |
| Assignments | 23 | ×6 | 138 |
| **Total Mass** | | | **238** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 65 |
| Functions | 11 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.45 |
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
| McCabe (Cyclomatic) | 3 | 1.33 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10979954 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 84.42s |
| Avg Red Phase | 19.51s |
| Avg Green Phase | 15.05s |
| Avg Refactor Phase | 49.86s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 17 |
| Predictions Total | 18 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


