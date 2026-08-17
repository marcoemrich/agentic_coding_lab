# Analysis Report: 2026-08-17_07-04-36_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking

Generated: 2026-08-17T10:35:53+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 806s |
| Started | 2026-08-17T07:04:36+00:00 |
| Ended | 2026-08-17T07:18:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 229
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 527
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-04-36_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-04-36_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 673ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  10:35:54
   Duration  1.02s (transform 42ms, setup 0ms, collect 38ms, tests 673ms, environment 0ms, prepare 96ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **590** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 194 |
| Functions | 18 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.44 |
| Median LOC/Function | 5.50 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.58 | 0 |
| Cognitive (SonarJS) | 3 | 1.78 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22190995 |
| Context Utilization | 67% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 12.01s |
| Avg Red Phase | 3.98s |
| Avg Green Phase | 5.52s |
| Avg Refactor Phase | 2.51s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


