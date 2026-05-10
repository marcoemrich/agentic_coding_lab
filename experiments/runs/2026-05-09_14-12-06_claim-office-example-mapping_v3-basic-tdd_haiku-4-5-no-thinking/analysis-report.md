# Analysis Report: 2026-05-09_14-12-06_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

Generated: 2026-05-10T14:57:39+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 341s |
| Started | 2026-05-09T14:12:06+00:00 |
| Ended | 2026-05-09T14:17:49+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts
- **Implementation LOC** (total): 421
- **Test file**: claim.spec.ts
- **Test file LOC**: 218
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-12-06_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-12-06_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

 ✓ src/quote.spec.ts  (21 tests) 4ms
 ✓ src/claim.spec.ts  (14 tests) 4ms

 Test Files  2 passed (2)
      Tests  35 passed (35)
   Start at  14:57:40
   Duration  415ms (transform 62ms, setup 0ms, collect 75ms, tests 8ms, environment 0ms, prepare 188ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 58% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 81 | ×1 | 81 |
| Invocations | 95 | ×2 | 190 |
| Conditionals | 28 | ×4 | 112 |
| Loops | 21 | ×5 | 105 |
| Assignments | 80 | ×6 | 480 |
| **Total Mass** | | | **968** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 318 |
| Functions | 7 |
| Longest Function | 80 lines |
| Avg LOC/Function | 39.86 |
| Median LOC/Function | 35.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 9 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **13** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 17 | 6.11 | 2 |
| Cognitive (SonarJS) | 22 | 9.50 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8482342 |
| Context Utilization | 46% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 15.59s |
| Avg Red Phase | 11.92s |
| Avg Green Phase | 1.35s |
| Avg Refactor Phase | 2.32s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


