# Analysis Report: 2026-05-12_22-42-33_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:12:27+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 459s |
| Started | 2026-05-12T22:42:33+00:00 |
| Ended | 2026-05-12T22:50:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 218
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 257
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-42-33_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-42-33_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (15 tests) 3ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  08:12:27
   Duration  355ms (transform 35ms, setup 0ms, collect 29ms, tests 3ms, environment 0ms, prepare 107ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 7 | ×5 | 35 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **667** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 190 |
| Functions | 12 |
| Longest Function | 22 lines |
| Avg LOC/Function | 7.83 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 1.68 | 0 |
| Cognitive (SonarJS) | 3 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12439872 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 146.71s |
| Avg Red Phase | 20.28s |
| Avg Green Phase | 112.59s |
| Avg Refactor Phase | 13.84s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


