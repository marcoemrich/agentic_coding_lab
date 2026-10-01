# Analysis Report: 2026-10-01_09-13-29_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-10-01T10:04:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 3084s |
| Started | 2026-10-01T09:13:29+00:00 |
| Ended | 2026-10-01T10:04:56+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, claimSettlement.ts, cli.ts, itemCatalogue.ts, premium.ts
- **Implementation LOC** (total): 310
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 292
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_09-13-29_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_09-13-29_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (47 tests) 9ms
 ✓ src/cli.spec.ts  (3 tests) 441ms

 Test Files  2 passed (2)
      Tests  50 passed (50)
   Start at  10:04:57
   Duration  969ms (transform 86ms, setup 0ms, collect 91ms, tests 450ms, environment 0ms, prepare 156ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 116 | ×2 | 232 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **646** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 243 |
| Functions | 35 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.43 |
| Median LOC/Function | 3.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 3 | 1.48 | 0 |
| Cognitive (SonarJS) | 2 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 58005864 |
| Context Utilization | 112% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 37.68s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 37.68s |

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
| Refactorings Applied | 50 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


