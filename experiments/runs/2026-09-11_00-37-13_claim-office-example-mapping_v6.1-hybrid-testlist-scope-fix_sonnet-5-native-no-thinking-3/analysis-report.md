# Analysis Report: 2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking-3

Generated: 2026-09-11T01:26:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | sonnet-5-native-no-thinking |
| Model Version(s) | claude-sonnet-5 |
| Thinking | unknown |
| Duration | 2949s |
| Started | 2026-09-11T00:37:13+00:00 |
| Ended | 2026-09-11T01:26:24+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, policy.ts
- **Implementation LOC** (total): 334
- **Test files**: cli.spec.ts, policy.spec.ts
- **Test LOC** (total): 357
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking-3

 ✓ src/policy.spec.ts  (41 tests) 6ms
 ✓ src/cli.spec.ts  (7 tests) 4ms

 Test Files  2 passed (2)
      Tests  48 passed (48)
   Start at  01:26:25
   Duration  469ms (transform 71ms, setup 0ms, collect 79ms, tests 10ms, environment 0ms, prepare 136ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 86 | ×1 | 86 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 15 | ×5 | 75 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **865** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 201 |
| Functions | 17 |
| Longest Function | 36 lines |
| Avg LOC/Function | 8.29 |
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
| McCabe (Cyclomatic) | 5 | 2.07 | 0 |
| Cognitive (SonarJS) | 4 | 2.07 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 130990027 |
| Context Utilization | 232% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 99.13s |
| Avg Red Phase | 18.46s |
| Avg Green Phase | 29.07s |
| Avg Refactor Phase | 51.6s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 27 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


