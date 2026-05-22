# Analysis Report: 2026-05-22_20-01-47_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T20:16:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 872s |
| Started | 2026-05-22T20:01:47+00:00 |
| Ended | 2026-05-22T20:16:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 197
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 502
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_20-01-47_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_20-01-47_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 6ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  20:16:21
   Duration  188ms (transform 48ms, setup 0ms, collect 47ms, tests 6ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 10 | ×5 | 50 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **684** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 181 |
| Functions | 13 |
| Longest Function | 20 lines |
| Avg LOC/Function | 7.85 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 7 | 2.75 | 0 |
| Cognitive (SonarJS) | 8 | 3.30 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28366021 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
| Avg Cycle Time | 58.98s |
| Avg Red Phase | 34.48s |
| Avg Green Phase | 14.99s |
| Avg Refactor Phase | 9.51s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 13 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


