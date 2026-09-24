# Analysis Report: 2026-09-23_16-58-01_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-09-23T17:38:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 2451s |
| Started | 2026-09-23T16:58:01+00:00 |
| Ended | 2026-09-23T17:38:56+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, claimSettlement.ts, cli.ts, itemCatalog.ts, premiumQuote.ts
- **Implementation LOC** (total): 244
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 272
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_16-58-01_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_16-58-01_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (46 tests) 11ms
 ✓ src/cli.spec.ts  (5 tests) 808ms

 Test Files  2 passed (2)
      Tests  51 passed (51)
   Start at  17:38:58
   Duration  1.33s (transform 99ms, setup 0ms, collect 101ms, tests 819ms, environment 0ms, prepare 141ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 97 | ×2 | 194 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **653** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 201 |
| Functions | 29 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.34 |
| Median LOC/Function | 3.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 3 | 1.35 | 0 |
| Cognitive (SonarJS) | 2 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 42547803 |
| Context Utilization | 110% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 29.09s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 29.09s |

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
| Refactorings Applied | 51 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


