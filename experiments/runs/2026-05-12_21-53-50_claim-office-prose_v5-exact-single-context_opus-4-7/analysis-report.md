# Analysis Report: 2026-05-12_21-53-50_claim-office-prose_v5-exact-single-context_opus-4-7

Generated: 2026-06-02T08:11:15+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 1183s |
| Started | 2026-05-12T21:53:50+00:00 |
| Ended | 2026-05-12T22:13:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 181
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 272
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_21-53-50_claim-office-prose_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_21-53-50_claim-office-prose_v5-exact-single-context_opus-4-7

 ✓ src/claim-office.spec.ts  (16 tests) 3ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  08:11:16
   Duration  364ms (transform 28ms, setup 0ms, collect 28ms, tests 3ms, environment 0ms, prepare 66ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 7 | ×5 | 35 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **584** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 155 |
| Functions | 10 |
| Longest Function | 22 lines |
| Avg LOC/Function | 8.70 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.62 | 0 |
| Cognitive (SonarJS) | 8 | 2.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28152199 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 74.78s |
| Avg Red Phase | 32.34s |
| Avg Green Phase | 24.31s |
| Avg Refactor Phase | 18.13s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 31 |
| Predictions Total | 31 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


