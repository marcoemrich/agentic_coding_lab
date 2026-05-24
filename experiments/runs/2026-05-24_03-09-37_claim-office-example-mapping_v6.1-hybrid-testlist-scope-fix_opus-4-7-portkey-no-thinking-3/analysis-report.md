# Analysis Report: 2026-05-24_03-09-37_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking-3

Generated: 2026-05-24T03:21:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 726s |
| Started | 2026-05-24T03:09:37+00:00 |
| Ended | 2026-05-24T03:21:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 178
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 539
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_03-09-37_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_03-09-37_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  03:21:44
   Duration  172ms (transform 40ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 9 | ×5 | 45 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **697** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 160 |
| Functions | 10 |
| Longest Function | 60 lines |
| Avg LOC/Function | 11.10 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 3.58 | 1 |
| Cognitive (SonarJS) | 21 | 5.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19163189 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 193.00s |
| Avg Red Phase | 140.85s |
| Avg Green Phase | 15.82s |
| Avg Refactor Phase | 36.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


