# Analysis Report: 2026-10-20_04-41-17_claim-office-example-mapping_exact-single-context-v1-cc_opus-4-6-requesty

Generated: 2026-10-20T05:01:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v1-cc |
| Model | opus-4-6-requesty |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1209s |
| Started | 2026-10-20T04:41:17+00:00 |
| Ended | 2026-10-20T05:01:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 154
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 353
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-20_04-41-17_claim-office-example-mapping_exact-single-context-v1-cc_opus-4-6-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-20_04-41-17_claim-office-example-mapping_exact-single-context-v1-cc_opus-4-6-requesty

 ✓ src/claim-office.spec.ts  (30 tests) 6ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  05:01:29
   Duration  169ms (transform 41ms, setup 0ms, collect 35ms, tests 6ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 47 | ×2 | 94 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 9 | ×5 | 45 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **592** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 139 |
| Functions | 2 |
| Longest Function | 66 lines |
| Avg LOC/Function | 48.00 |
| Median LOC/Function | 48.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 18 | 5.00 | 1 |
| Cognitive (SonarJS) | 34 | 13.00 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34219886 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 117.40s |
| Avg Red Phase | 24.41s |
| Avg Green Phase | 63.64s |
| Avg Refactor Phase | 29.35s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


