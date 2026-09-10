# Analysis Report: 2026-09-10_05-35-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

Generated: 2026-09-10T06:42:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-1-no-thinking |
| Model Version(s) | claude-fable-5-1 |
| Thinking | unknown |
| Duration | 4055s |
| Started | 2026-09-10T05:35:13+00:00 |
| Ended | 2026-09-10T06:42:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 299
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 269
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_05-35-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_05-35-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 616ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  06:42:49
   Duration  787ms (transform 37ms, setup 0ms, collect 36ms, tests 616ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 12 | ×5 | 60 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **790** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 223 |
| Functions | 26 |
| Longest Function | 17 lines |
| Avg LOC/Function | 3.81 |
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
| McCabe (Cyclomatic) | 4 | 1.41 | 0 |
| Cognitive (SonarJS) | 3 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 55741821 |
| Context Utilization | 128% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 65.64s |
| Avg Red Phase | 10.66s |
| Avg Green Phase | 15.47s |
| Avg Refactor Phase | 39.51s |

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
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


