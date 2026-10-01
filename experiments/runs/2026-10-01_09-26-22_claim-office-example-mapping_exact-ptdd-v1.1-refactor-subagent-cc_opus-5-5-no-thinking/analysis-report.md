# Analysis Report: 2026-10-01_09-26-22_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-10-01T10:06:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 2412s |
| Started | 2026-10-01T09:26:22+00:00 |
| Ended | 2026-10-01T10:06:37+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, claimPayout.ts, cli.ts, itemCatalogue.ts, payoutCap.ts, percentage.ts, quotePremium.ts
- **Implementation LOC** (total): 272
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 221
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_09-26-22_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_09-26-22_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (44 tests) 11ms
 ✓ src/cli.spec.ts  (3 tests) 521ms

 Test Files  2 passed (2)
      Tests  47 passed (47)
   Start at  10:06:38
   Duration  1.06s (transform 90ms, setup 0ms, collect 100ms, tests 532ms, environment 0ms, prepare 155ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 105 | ×2 | 210 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **675** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 225 |
| Functions | 30 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.37 |
| Median LOC/Function | 3.00 |
| Imports | 14 |

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
| McCabe (Cyclomatic) | 3 | 1.43 | 0 |
| Cognitive (SonarJS) | 2 | 1.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 52814256 |
| Context Utilization | 107% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 20 |
| Avg Cycle Time | 31.85s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 31.85s |

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
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


