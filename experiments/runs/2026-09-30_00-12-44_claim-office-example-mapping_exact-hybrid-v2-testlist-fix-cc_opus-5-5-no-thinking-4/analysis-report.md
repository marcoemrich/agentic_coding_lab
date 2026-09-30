# Analysis Report: 2026-09-30_00-12-44_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-4

Generated: 2026-09-30T00:32:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1185s |
| Started | 2026-09-30T00:12:44+00:00 |
| Ended | 2026-09-30T00:32:35+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 191
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 281
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-30_00-12-44_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-30_00-12-44_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-4

 ✓ src/claim-office.spec.ts  (41 tests) 495ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  00:32:36
   Duration  787ms (transform 75ms, setup 0ms, collect 71ms, tests 495ms, environment 0ms, prepare 78ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 3 | ×5 | 15 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **710** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 145 |
| Functions | 27 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.37 |
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
| McCabe (Cyclomatic) | 3 | 1.32 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 47332352 |
| Context Utilization | 125% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 38.47s |
| Avg Red Phase | 8.35s |
| Avg Green Phase | 11.46s |
| Avg Refactor Phase | 18.66s |

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
| Refactorings Applied | 27 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


