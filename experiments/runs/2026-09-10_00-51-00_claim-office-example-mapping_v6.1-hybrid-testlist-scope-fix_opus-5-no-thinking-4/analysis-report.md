# Analysis Report: 2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-4

Generated: 2026-09-10T01:27:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2209s |
| Started | 2026-09-10T00:51:00+00:00 |
| Ended | 2026-09-10T01:27:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 346
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 839
- **Active tests**: 43
- **Remaining todos**: 8

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-4

 ✓ src/claim-office.spec.ts  (51 tests | 8 skipped) 644ms

 Test Files  1 passed (1)
      Tests  43 passed | 8 todo (51)
   Start at  01:27:52
   Duration  868ms (transform 65ms, setup 0ms, collect 65ms, tests 644ms, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 12 | ×5 | 60 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **872** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 251 |
| Functions | 25 |
| Longest Function | 25 lines |
| Avg LOC/Function | 4.28 |
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
| Cognitive (SonarJS) | 3 | 1.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 51719658 |
| Context Utilization | 132% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 81.34s |
| Avg Red Phase | 13.36s |
| Avg Green Phase | 12.12s |
| Avg Refactor Phase | 55.86s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 48 |
| Predictions Total | 48 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


