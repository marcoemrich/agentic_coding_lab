# Analysis Report: 2026-05-11_23-33-54_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-12T00:05:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1905s |
| Started | 2026-05-11T23:33:54+00:00 |
| Ended | 2026-05-12T00:05:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 135
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 312
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_23-33-54_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (18 tests) 5ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  00:05:42
   Duration  170ms (transform 38ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 45 | ×1 | 45 |
| Invocations | 48 | ×2 | 96 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 4 | ×5 | 20 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **505** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 118 |
| Functions | 8 |
| Longest Function | 15 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 8.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.73 | 0 |
| Cognitive (SonarJS) | 8 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39292918 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 109.90s |
| Avg Red Phase | 33.71s |
| Avg Green Phase | 29.34s |
| Avg Refactor Phase | 46.85s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


