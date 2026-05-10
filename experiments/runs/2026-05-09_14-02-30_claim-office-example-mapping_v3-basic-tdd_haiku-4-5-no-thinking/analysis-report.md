# Analysis Report: 2026-05-09_14-02-30_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

Generated: 2026-05-10T14:57:18+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 191s |
| Started | 2026-05-09T14:02:30+00:00 |
| Ended | 2026-05-09T14:05:44+00:00 |

## Code Metrics

- **Implementation files**: claims.test.ts, claims.ts, cli.test.ts, cli.ts, pricing.test.ts, pricing.ts, types.ts
- **Implementation LOC** (total): 1095
- **Tests**: Not found

## Test Results

**Status**: ✅ All tests passing (65 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-02-30_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-02-30_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

 ✓ src/pricing.test.ts  (28 tests) 5ms
 ✓ src/cli.test.ts  (18 tests) 4ms
 ✓ src/claims.test.ts  (19 tests) 5ms

 Test Files  3 passed (3)
      Tests  65 passed (65)
   Start at  14:57:18
   Duration  347ms (transform 62ms, setup 0ms, collect 91ms, tests 14ms, environment 0ms, prepare 299ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 66% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 728 | ×1 | 728 |
| Invocations | 494 | ×2 | 988 |
| Conditionals | 34 | ×4 | 136 |
| Loops | 45 | ×5 | 225 |
| Assignments | 275 | ×6 | 1650 |
| **Total Mass** | | | **3727** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 827 |
| Functions | 20 |
| Longest Function | 67 lines |
| Avg LOC/Function | 12.20 |
| Median LOC/Function | 7.00 |
| Imports | 15 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 11 |
| Duplication | 0 |
| Magic Numbers | 117 |
| Code Quality | 0 |
| **Total** | **128** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 1.57 | 1 |
| Cognitive (SonarJS) | 24 | 4.37 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4177833 |
| Context Utilization | 33% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 37.61s |
| Avg Red Phase | 11.31s |
| Avg Green Phase | 26.3s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


