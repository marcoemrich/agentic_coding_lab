# Analysis Report: 2026-08-17_07-03-06_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking

Generated: 2026-08-17T10:35:32+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1606s |
| Started | 2026-08-17T07:03:06+00:00 |
| Ended | 2026-08-17T07:29:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 254
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 507
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-03-06_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-03-06_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (54 tests) 332ms

 Test Files  1 passed (1)
      Tests  54 passed (54)
   Start at  10:35:32
   Duration  654ms (transform 39ms, setup 0ms, collect 38ms, tests 332ms, environment 0ms, prepare 64ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **703** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 209 |
| Functions | 20 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.90 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.70 | 0 |
| Cognitive (SonarJS) | 3 | 1.82 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37322425 |
| Context Utilization | 92% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 92 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 40 |
| Predictions Total | 42 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 54 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


