# Analysis Report: 2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2

Generated: 2026-09-04T23:51:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2387s |
| Started | 2026-09-04T23:11:22+00:00 |
| Ended | 2026-09-04T23:51:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 341
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 861
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (50 tests) 13ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  23:51:14
   Duration  386ms (transform 137ms, setup 0ms, collect 146ms, tests 13ms, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 12 | ×5 | 60 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **725** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 241 |
| Functions | 23 |
| Longest Function | 29 lines |
| Avg LOC/Function | 4.43 |
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
| McCabe (Cyclomatic) | 4 | 1.47 | 0 |
| Cognitive (SonarJS) | 3 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 95488938 |
| Context Utilization | 167% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 103.14s |
| Avg Red Phase | 17.88s |
| Avg Green Phase | 20.29s |
| Avg Refactor Phase | 64.97s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 100 |
| Predictions Total | 100 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 30 |


