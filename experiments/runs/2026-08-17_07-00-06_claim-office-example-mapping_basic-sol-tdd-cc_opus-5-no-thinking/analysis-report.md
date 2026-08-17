# Analysis Report: 2026-08-17_07-00-06_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking

Generated: 2026-08-17T10:35:20+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1009s |
| Started | 2026-08-17T07:00:06+00:00 |
| Ended | 2026-08-17T07:16:56+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 290
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 781
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-00-06_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-00-06_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (50 tests) 671ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  10:35:21
   Duration  1.02s (transform 42ms, setup 0ms, collect 41ms, tests 671ms, environment 0ms, prepare 67ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **582** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 228 |
| Functions | 16 |
| Longest Function | 25 lines |
| Avg LOC/Function | 8.88 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 3 | 2.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 27332400 |
| Context Utilization | 74% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 11.99s |
| Avg Red Phase | 2.83s |
| Avg Green Phase | 4.53s |
| Avg Refactor Phase | 4.63s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 37 |
| Predictions Total | 38 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 41 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 23 |


