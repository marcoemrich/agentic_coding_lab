# Analysis Report: 2026-05-24_03-09-37_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-24T03:41:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1924s |
| Started | 2026-05-24T03:09:37+00:00 |
| Ended | 2026-05-24T03:41:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 212
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 478
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_03-09-37_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_03-09-37_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (41 tests) 7ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  03:41:43
   Duration  192ms (transform 53ms, setup 0ms, collect 54ms, tests 7ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **852** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 176 |
| Functions | 23 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.09 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 4 | 2.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 42908014 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 92.35s |
| Avg Red Phase | 21.87s |
| Avg Green Phase | 19.87s |
| Avg Refactor Phase | 50.61s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 70 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


