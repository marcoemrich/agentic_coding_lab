# Analysis Report: 2026-08-10_15-38-59_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T16:14:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2099s |
| Started | 2026-08-10T15:38:59+00:00 |
| Ended | 2026-08-10T16:14:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 251
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 405
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-38-59_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-38-59_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests) 593ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  16:14:01
   Duration  769ms (transform 46ms, setup 0ms, collect 47ms, tests 593ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 10 | ×5 | 50 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **602** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 194 |
| Functions | 16 |
| Longest Function | 22 lines |
| Avg LOC/Function | 6.62 |
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
| McCabe (Cyclomatic) | 3 | 1.70 | 0 |
| Cognitive (SonarJS) | 2 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 140314886 |
| Context Utilization | 223% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 72.90s |
| Avg Red Phase | 21.35s |
| Avg Green Phase | 21.42s |
| Avg Refactor Phase | 30.13s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 96 |
| Predictions Total | 96 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


