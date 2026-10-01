# Analysis Report: 2026-10-01_09-39-41_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-10-01T10:32:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 3157s |
| Started | 2026-10-01T09:39:41+00:00 |
| Ended | 2026-10-01T10:32:21+00:00 |

## Code Metrics

- **Implementation files**: basePremium.ts, claimOffice.ts, claimSettlement.ts, cli.ts, item.ts, policy.ts, premium.ts, priceList.ts, reimbursementClauses.ts
- **Implementation LOC** (total): 368
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 237
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_09-39-41_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_09-39-41_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (43 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 489ms

 Test Files  2 passed (2)
      Tests  46 passed (46)
   Start at  10:32:22
   Duration  1.03s (transform 92ms, setup 0ms, collect 108ms, tests 499ms, environment 0ms, prepare 151ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 147 | ×2 | 294 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **741** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 297 |
| Functions | 49 |
| Longest Function | 13 lines |
| Avg LOC/Function | 3.98 |
| Median LOC/Function | 3.00 |
| Imports | 17 |

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
| McCabe (Cyclomatic) | 3 | 1.28 | 0 |
| Cognitive (SonarJS) | 2 | 1.06 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 67209488 |
| Context Utilization | 113% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 46.38s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 46.38s |

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


