# Analysis Report: 2026-09-10_05-35-05_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

Generated: 2026-09-10T06:37:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-1-no-thinking |
| Model Version(s) | claude-fable-5-1 |
| Thinking | unknown |
| Duration | 3762s |
| Started | 2026-09-10T05:35:05+00:00 |
| Ended | 2026-09-10T06:37:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 216
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 312
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_05-35-05_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_05-35-05_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 579ms

 Test Files  2 passed (2)
      Tests  44 passed (44)
   Start at  06:37:48
   Duration  896ms (transform 50ms, setup 0ms, collect 51ms, tests 586ms, environment 0ms, prepare 91ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **736** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 168 |
| Functions | 28 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.61 |
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
| Cognitive (SonarJS) | 3 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 60181210 |
| Context Utilization | 129% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 54.99s |
| Avg Red Phase | 11.78s |
| Avg Green Phase | 14.2s |
| Avg Refactor Phase | 29.01s |

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
| Tests Passed Immediately | 20 |


