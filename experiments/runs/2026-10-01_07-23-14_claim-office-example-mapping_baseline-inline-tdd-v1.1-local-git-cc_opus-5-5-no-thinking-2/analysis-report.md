# Analysis Report: 2026-10-01_07-23-14_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking-2

Generated: 2026-10-01T07:25:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 119s |
| Started | 2026-10-01T07:23:14+00:00 |
| Ended | 2026-10-01T07:25:18+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 232
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts
- **Test LOC** (total): 224
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking-2

 ✓ src/claim.spec.ts  (14 tests) 5ms
 ✓ src/cli.spec.ts  (6 tests) 1509ms
 ✓ src/premium.spec.ts  (19 tests) 6ms

 Test Files  3 passed (3)
      Tests  39 passed (39)
   Start at  07:25:19
   Duration  2.33s (transform 102ms, setup 1ms, collect 125ms, tests 1.52s, environment 0ms, prepare 228ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 112 | ×2 | 224 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 9 | ×5 | 45 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **750** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 199 |
| Functions | 14 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.64 |
| Median LOC/Function | 4.50 |
| Imports | 6 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.52 | 0 |
| Cognitive (SonarJS) | 9 | 2.53 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1604922 |
| Context Utilization | 28% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 4.24s |
| Avg Red Phase | 1.28s |
| Avg Green Phase | 2.96s |
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
| Tests Passed Immediately | 0 |


