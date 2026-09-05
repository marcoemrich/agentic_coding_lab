# Analysis Report: 2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-4

Generated: 2026-09-05T00:12:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3685s |
| Started | 2026-09-04T23:11:22+00:00 |
| Ended | 2026-09-05T00:12:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 437
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 1009
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-4

 ✓ src/claim-office.spec.ts  (46 tests) 12ms
 ✓ src/cli.spec.ts  (3 tests) 1367ms

 Test Files  2 passed (2)
      Tests  49 passed (49)
   Start at  00:12:52
   Duration  1.86s (transform 93ms, setup 0ms, collect 90ms, tests 1.38s, environment 0ms, prepare 148ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 101 | ×1 | 101 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **853** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 287 |
| Functions | 32 |
| Longest Function | 19 lines |
| Avg LOC/Function | 3.97 |
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
| McCabe (Cyclomatic) | 3 | 1.41 | 0 |
| Cognitive (SonarJS) | 2 | 1.14 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 123086078 |
| Context Utilization | 214% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 125.95s |
| Avg Red Phase | 24.95s |
| Avg Green Phase | 29.97s |
| Avg Refactor Phase | 71.03s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 98 |
| Predictions Total | 98 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


