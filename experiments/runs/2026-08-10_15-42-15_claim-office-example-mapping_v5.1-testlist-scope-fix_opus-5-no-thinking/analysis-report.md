# Analysis Report: 2026-08-10_15-42-15_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T15:58:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 968s |
| Started | 2026-08-10T15:42:15+00:00 |
| Ended | 2026-08-10T15:58:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 271
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 302
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-42-15_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-42-15_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (45 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 593ms

 Test Files  2 passed (2)
      Tests  47 passed (47)
   Start at  15:58:25
   Duration  908ms (transform 44ms, setup 0ms, collect 46ms, tests 600ms, environment 0ms, prepare 100ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 14 | ×5 | 70 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **652** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 220 |
| Functions | 19 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.95 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.88 | 0 |
| Cognitive (SonarJS) | 3 | 1.79 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35741544 |
| Context Utilization | 82% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 203.91s |
| Avg Red Phase | 87.92s |
| Avg Green Phase | 31.3s |
| Avg Refactor Phase | 84.69s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


