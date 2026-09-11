# Analysis Report: 2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking

Generated: 2026-09-10T19:53:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 2424s |
| Started | 2026-09-10T19:13:08+00:00 |
| Ended | 2026-09-10T19:53:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 253
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 606
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 889ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  19:53:36
   Duration  1.25s (transform 89ms, setup 0ms, collect 86ms, tests 889ms, environment 0ms, prepare 96ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 6 | ×5 | 30 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **664** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 213 |
| Functions | 17 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.24 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.47 | 0 |
| Cognitive (SonarJS) | 3 | 1.70 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 61453866 |
| Context Utilization | 150% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 93.46s |
| Avg Red Phase | 14.94s |
| Avg Green Phase | 15.77s |
| Avg Refactor Phase | 62.75s |

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
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


