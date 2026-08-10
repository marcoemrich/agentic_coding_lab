# Analysis Report: 2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-3

Generated: 2026-08-10T07:54:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4493s |
| Started | 2026-08-10T06:39:55+00:00 |
| Ended | 2026-08-10T07:54:50+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 234
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 914
- **Active tests**: 62
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (62 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-3

 ✓ src/claim-office.spec.ts  (62 tests) 12ms

 Test Files  1 passed (1)
      Tests  62 passed (62)
   Start at  07:55:01
   Duration  253ms (transform 64ms, setup 0ms, collect 68ms, tests 12ms, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 105 | ×1 | 105 |
| Invocations | 34 | ×2 | 68 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 2 | ×5 | 10 |
| Assignments | 24 | ×6 | 144 |
| **Total Mass** | | | **407** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 209 |
| Functions | 17 |
| Longest Function | 53 lines |
| Avg LOC/Function | 8.18 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 29 |
| Code Quality | 0 |
| **Total** | **31** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 18 | 2.71 | 1 |
| Cognitive (SonarJS) | 15 | 5.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15904220 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 100 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 91 |
| Predictions Total | 104 |
| Accuracy | 87% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


