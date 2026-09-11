# Analysis Report: 2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking

Generated: 2026-09-11T01:00:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | sonnet-5-native-no-thinking |
| Model Version(s) | claude-sonnet-5 |
| Thinking | unknown |
| Duration | 1421s |
| Started | 2026-09-11T00:37:13+00:00 |
| Ended | 2026-09-11T01:00:56+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 250
- **Test files**: cli.spec.ts, premium.spec.ts
- **Test LOC** (total): 412
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking

 ✓ src/premium.spec.ts  (38 tests) 7ms
 ✓ src/cli.spec.ts  (4 tests) 369ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  01:00:57
   Duration  821ms (transform 64ms, setup 0ms, collect 73ms, tests 376ms, environment 0ms, prepare 136ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 70% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **741** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 216 |
| Functions | 15 |
| Longest Function | 36 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 5.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.77 | 0 |
| Cognitive (SonarJS) | 5 | 2.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 62459406 |
| Context Utilization | 110% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 78.30s |
| Avg Red Phase | 12.93s |
| Avg Green Phase | 14.2s |
| Avg Refactor Phase | 51.17s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 41 |
| Predictions Total | 42 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


