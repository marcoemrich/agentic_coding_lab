# Analysis Report: 2026-08-11_00-48-46_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-11T01:34:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2739s |
| Started | 2026-08-11T00:48:46+00:00 |
| Ended | 2026-08-11T01:34:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 372
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 758
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_00-48-46_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_00-48-46_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 576ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  01:34:27
   Duration  753ms (transform 43ms, setup 0ms, collect 48ms, tests 576ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 14 | ×5 | 70 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **922** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 276 |
| Functions | 25 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.44 |
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
| McCabe (Cyclomatic) | 3 | 1.29 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 89042617 |
| Context Utilization | 175% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 101.71s |
| Avg Red Phase | 20.68s |
| Avg Green Phase | 23.41s |
| Avg Refactor Phase | 57.62s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 90 |
| Predictions Total | 90 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


