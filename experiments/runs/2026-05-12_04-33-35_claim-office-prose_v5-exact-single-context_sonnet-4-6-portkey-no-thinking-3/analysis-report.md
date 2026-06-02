# Analysis Report: 2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking-3

Generated: 2026-06-02T07:59:10+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1282s |
| Started | 2026-05-12T04:33:35+00:00 |
| Ended | 2026-05-12T04:55:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 109
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 85
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (12 tests) 3ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  07:59:12
   Duration  362ms (transform 26ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 63ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 58% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 45 | ×1 | 45 |
| Invocations | 29 | ×2 | 58 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 4 | ×5 | 20 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **389** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 91 |
| Functions | 4 |
| Longest Function | 28 lines |
| Avg LOC/Function | 13.00 |
| Median LOC/Function | 10.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.00 | 0 |
| Cognitive (SonarJS) | 7 | 3.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25789528 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 102.76s |
| Avg Red Phase | 26.4s |
| Avg Green Phase | 23.35s |
| Avg Refactor Phase | 53.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


