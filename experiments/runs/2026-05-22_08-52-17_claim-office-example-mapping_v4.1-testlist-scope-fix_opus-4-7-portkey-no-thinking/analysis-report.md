# Analysis Report: 2026-05-22_08-52-17_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T09:28:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2180s |
| Started | 2026-05-22T08:52:17+00:00 |
| Ended | 2026-05-22T09:28:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 140
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 599
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_08-52-17_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_08-52-17_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 7ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  09:28:39
   Duration  221ms (transform 64ms, setup 0ms, collect 63ms, tests 7ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **538** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 133 |
| Functions | 3 |
| Longest Function | 86 lines |
| Avg LOC/Function | 35.00 |
| Median LOC/Function | 12.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 30 | 7.60 | 1 |
| Cognitive (SonarJS) | 68 | 18.25 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15084445 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 76.32s |
| Avg Red Phase | 27.75s |
| Avg Green Phase | 19.24s |
| Avg Refactor Phase | 29.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 41 |
| Predictions Total | 43 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


