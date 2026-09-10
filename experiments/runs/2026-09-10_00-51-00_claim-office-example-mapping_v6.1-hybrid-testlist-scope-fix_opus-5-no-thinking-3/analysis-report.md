# Analysis Report: 2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3

Generated: 2026-09-10T01:30:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2377s |
| Started | 2026-09-10T00:51:00+00:00 |
| Ended | 2026-09-10T01:30:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 297
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 805
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (50 tests) 862ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  01:30:40
   Duration  1.05s (transform 54ms, setup 0ms, collect 51ms, tests 862ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 7 | ×5 | 35 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **734** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 209 |
| Functions | 33 |
| Longest Function | 8 lines |
| Avg LOC/Function | 2.64 |
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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 3 | 1.14 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 76571037 |
| Context Utilization | 151% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 85.54s |
| Avg Red Phase | 16.4s |
| Avg Green Phase | 14.37s |
| Avg Refactor Phase | 54.77s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 99 |
| Predictions Total | 100 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


