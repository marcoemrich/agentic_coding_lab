# Analysis Report: 2026-09-10_10-27-36_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking

Generated: 2026-09-10T12:47:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 8386s |
| Started | 2026-09-10T10:27:36+00:00 |
| Ended | 2026-09-10T12:47:24+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 256
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 525
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_10-27-36_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_10-27-36_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 540ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  12:47:24
   Duration  752ms (transform 54ms, setup 0ms, collect 69ms, tests 540ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 48 | ×1 | 48 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 4 | ×5 | 20 |
| Assignments | 75 | ×6 | 450 |
| **Total Mass** | | | **672** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 224 |
| Functions | 15 |
| Longest Function | 22 lines |
| Avg LOC/Function | 4.07 |
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
| McCabe (Cyclomatic) | 5 | 1.64 | 0 |
| Cognitive (SonarJS) | 4 | 1.90 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 60648346 |
| Context Utilization | 154% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 97.43s |
| Avg Red Phase | 15.55s |
| Avg Green Phase | 16.89s |
| Avg Refactor Phase | 64.99s |

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
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


