# Analysis Report: 2026-05-22_22-47-39_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T23:33:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7.1-hybrid-green-refactor-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2747s |
| Started | 2026-05-22T22:47:39+00:00 |
| Ended | 2026-05-22T23:33:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 215
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 477
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_22-47-39_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_22-47-39_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 7ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  23:33:28
   Duration  190ms (transform 46ms, setup 0ms, collect 47ms, tests 7ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 13 | ×5 | 65 |
| Assignments | 80 | ×6 | 480 |
| **Total Mass** | | | **805** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 171 |
| Functions | 29 |
| Longest Function | 17 lines |
| Avg LOC/Function | 3.97 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 5 | 1.50 | 0 |
| Cognitive (SonarJS) | 5 | 1.57 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 32777883 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 115.45s |
| Avg Red Phase | 21.9s |
| Avg Green Phase | 29.32s |
| Avg Refactor Phase | 64.23s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 47 |
| Predictions Total | 47 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 11 |


