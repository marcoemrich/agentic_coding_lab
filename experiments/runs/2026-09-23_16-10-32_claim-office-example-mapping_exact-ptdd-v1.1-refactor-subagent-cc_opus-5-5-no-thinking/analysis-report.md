# Analysis Report: 2026-09-23_16-10-32_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-09-23T16:57:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5, <synthetic> |
| Thinking | unknown |
| Duration | 2817s |
| Started | 2026-09-23T16:10:32+00:00 |
| Ended | 2026-09-23T16:57:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claims.ts, cli.ts, insured-item.ts, policy.ts, premium.ts, price-list.ts, reimbursement.ts
- **Implementation LOC** (total): 317
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 275
- **Active tests**: 50
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_16-10-32_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_16-10-32_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests | 1 skipped) 789ms

 Test Files  1 passed (1)
      Tests  50 passed | 1 todo (51)
   Start at  16:57:34
   Duration  1.17s (transform 95ms, setup 0ms, collect 103ms, tests 789ms, environment 0ms, prepare 101ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 118 | ×2 | 236 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **689** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 244 |
| Functions | 35 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.06 |
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
| McCabe (Cyclomatic) | 3 | 1.36 | 0 |
| Cognitive (SonarJS) | 2 | 1.14 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 40329394 |
| Context Utilization | 106% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 40.21s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 40.21s |

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


