# Analysis Report: 2026-08-10_17-18-21_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T18:03:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2700s |
| Started | 2026-08-10T17:18:21+00:00 |
| Ended | 2026-08-10T18:03:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 398
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 618
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_17-18-21_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_17-18-21_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 6ms
 ✓ src/cli.spec.ts  (2 tests) 573ms

 Test Files  2 passed (2)
      Tests  40 passed (40)
   Start at  18:03:23
   Duration  880ms (transform 55ms, setup 0ms, collect 58ms, tests 579ms, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 16 | ×5 | 80 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **847** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 315 |
| Functions | 27 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 3 | 1.42 | 0 |
| Cognitive (SonarJS) | 3 | 1.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 74751381 |
| Context Utilization | 162% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 110.99s |
| Avg Red Phase | 21.93s |
| Avg Green Phase | 22.79s |
| Avg Refactor Phase | 66.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


