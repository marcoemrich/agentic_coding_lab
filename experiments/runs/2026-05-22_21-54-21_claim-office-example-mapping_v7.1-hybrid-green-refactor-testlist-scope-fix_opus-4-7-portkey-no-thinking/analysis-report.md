# Analysis Report: 2026-05-22_21-54-21_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T22:24:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7.1-hybrid-green-refactor-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1822s |
| Started | 2026-05-22T21:54:21+00:00 |
| Ended | 2026-05-22T22:24:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 202
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 368
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_21-54-21_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_21-54-21_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 5ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  22:24:45
   Duration  189ms (transform 49ms, setup 0ms, collect 55ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 12 | ×5 | 60 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **800** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 170 |
| Functions | 26 |
| Longest Function | 22 lines |
| Avg LOC/Function | 4.65 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 4 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25042083 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 112.22s |
| Avg Red Phase | 30.55s |
| Avg Green Phase | 26.89s |
| Avg Refactor Phase | 54.78s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


